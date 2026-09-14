"""
Probabilistic identity matching via Splink (Fellegi-Sunter model), backed by
DuckDB in-process — no server, no container.

This module owns all Splink-specific configuration. The FastAPI layer
(main.py) never touches Splink directly: it converts the minimal JSON
contract into the plain dict shape this module expects, and converts this
module's plain dict/list output back into the JSON response. That boundary
is what lets the sidecar's HTTP contract stay stable even if the matching
engine underneath is swapped out later.

MATCH THRESHOLD: 0.85, the midpoint of the 0.80-0.90 range specified for
this feature. This value is a judgment call appropriate to this project's
synthetic, small-scale demo dataset (a few dozen candidate records) — it
has NOT been validated against production-scale data or a labelled
ground-truth set, and should not be read as a tuned, production-grade
threshold. It is deliberately exposed as a module-level constant (and
overridable via the MATCH_THRESHOLD environment variable) rather than
buried inside the Splink settings, precisely so it can be revisited when
this moves beyond a demonstration.
"""

import logging
import os
from typing import Any

import pandas as pd
import splink.comparison_level_library as cll
import splink.comparison_library as cl
from splink import DuckDBAPI, Linker, SettingsCreator, block_on

# Splink logs blocking/predict timing to stdout at INFO level by default,
# which is noisy for a service meant to be called many times. This sidecar
# has no training step to log (m/u values are fixed, see below), so INFO
# output carries no useful signal here.
logging.getLogger("splink").setLevel(logging.WARNING)

MATCH_THRESHOLD = float(os.environ.get("MATCH_THRESHOLD", "0.85"))

# Blocking rule: candidate pairs are only ever scored if they share
# last_name + date_of_birth exactly. The spec calls for blocking on
# first_name + last_name + date_of_birth, but block_on() is an EXACT-match
# equi-join — requiring first_name to match exactly would filter out the
# very fuzzy-first-name variants (e.g. "Palesa" vs "Palesah" vs the
# initials-only "P.") this feature exists to catch, before scoring ever
# runs. Blocking on the two fields least likely to carry a typo in this
# dataset (surname, DOB) and leaving first-name fuzziness to the scoring
# stage below is the standard Splink pattern for this situation — it is a
# deliberate, documented deviation from the literal spec wording, not an
# oversight. It still narrows the pair count sharply versus no blocking at
# all, since last_name + date_of_birth together are highly selective.
BLOCKING_RULES = [block_on("last_name", "date_of_birth")]

# m/u probabilities are specified directly below (fix_m_probability=True,
# fix_u_probability=True) rather than trained via expectation-maximisation
# or random sampling. Splink's usual training approaches need enough data
# volume to observe every comparison level repeatedly; this project's
# synthetic demo set (a few dozen records total) is far too small for that
# — EM training on a dataset this size produces "not fully trained"
# warnings and degenerate all-zero results (see git history / dev notes on
# this file for the debugging trail). Fixed values below are a documented,
# supported Splink pattern for exactly this situation: small, curated
# datasets where analytically reasonable priors are more honest than
# pretending the data volume supports statistical training. These are
# domain-informed judgment calls for THIS demo, not calibrated estimates —
# see the module docstring's threshold note for the same caveat applied to
# MATCH_THRESHOLD.


def _name_comparison(col_name: str) -> cl.CustomComparison:
    return cl.CustomComparison(
        output_column_name=col_name,
        comparison_description=f"Fuzzy/phonetic name comparison on {col_name}",
        comparison_levels=[
            cll.NullLevel(col_name),
            cll.ExactMatchLevel(col_name).configure(
                m_probability=0.9, u_probability=0.02, fix_m_probability=True, fix_u_probability=True
            ),
            cll.JaroWinklerLevel(col_name, distance_threshold=0.88).configure(
                m_probability=0.75, u_probability=0.03, fix_m_probability=True, fix_u_probability=True
            ),
            cll.JaroWinklerLevel(col_name, distance_threshold=0.7).configure(
                m_probability=0.4, u_probability=0.08, fix_m_probability=True, fix_u_probability=True
            ),
            cll.ElseLevel().configure(
                m_probability=0.02, u_probability=0.85, fix_m_probability=True, fix_u_probability=True
            ),
        ],
    )


def _date_of_birth_comparison() -> cl.CustomComparison:
    return cl.CustomComparison(
        output_column_name="date_of_birth",
        comparison_description="Date of birth comparison",
        comparison_levels=[
            cll.NullLevel("date_of_birth"),
            cll.ExactMatchLevel("date_of_birth").configure(
                m_probability=0.95, u_probability=0.01, fix_m_probability=True, fix_u_probability=True
            ),
            cll.ElseLevel().configure(
                m_probability=0.03, u_probability=0.9, fix_m_probability=True, fix_u_probability=True
            ),
        ],
    )


def _exact_match_comparison(col_name: str, present_m: float, present_u: float) -> cl.CustomComparison:
    """
    Exact-match comparison for a field that may be missing (e.g. phone) —
    a null on either side is its own level (contributes no evidence either
    way), distinct from a genuine mismatch.
    """
    return cl.CustomComparison(
        output_column_name=col_name,
        comparison_description=f"Exact match comparison on {col_name}",
        comparison_levels=[
            cll.NullLevel(col_name),
            cll.ExactMatchLevel(col_name).configure(
                m_probability=present_m, u_probability=present_u, fix_m_probability=True, fix_u_probability=True
            ),
            cll.ElseLevel().configure(
                m_probability=1 - present_m, u_probability=1 - present_u, fix_m_probability=True, fix_u_probability=True
            ),
        ],
    )


SETTINGS = SettingsCreator(
    link_type="dedupe_only",
    blocking_rules_to_generate_predictions=BLOCKING_RULES,
    # Splink's default (0.0001) assumes a random pair from a large-scale
    # linkage almost never matches — appropriate for production volumes,
    # wildly miscalibrated for a synthetic demo set of a few dozen records
    # where the deliberately-planted near-duplicate is a meaningfully large
    # fraction of all records. Left un-set, the default prior crushes every
    # posterior match probability toward zero regardless of field agreement.
    # This value is set for THIS demo dataset's scale, not a general
    # recommendation — see the module docstring's threshold note.
    probability_two_random_records_match=0.05,
    comparisons=[
        _name_comparison("first_name"),
        _name_comparison("last_name"),
        _date_of_birth_comparison(),
        _exact_match_comparison("gender", present_m=0.85, present_u=0.4),
        _exact_match_comparison("phone", present_m=0.9, present_u=0.02),
    ],
    retain_intermediate_calculation_columns=False,
)


def _to_splink_row(candidate: dict[str, Any]) -> dict[str, Any]:
    """Maps this sidecar's JSON field names onto Splink's expected column names."""
    return {
        "unique_id": candidate["id"],
        "first_name": candidate.get("firstName") or None,
        "last_name": candidate.get("lastName") or None,
        "date_of_birth": candidate.get("dateOfBirth") or None,
        "gender": candidate.get("gender") or None,
        "phone": candidate.get("phone") or None,
    }


def find_probable_match_groups(
    candidates: list[dict[str, Any]], threshold: float = MATCH_THRESHOLD
) -> list[dict[str, Any]]:
    """
    Runs Splink's Fellegi-Sunter probabilistic matching over the given
    candidate records and returns groups of candidate ids whose pairwise
    match probability clears `threshold`. A candidate that matches no other
    candidate above threshold simply does not appear in any returned group
    — the caller (main.py / the Node orchestrator) treats "not in any
    group" as "no probable match," never as an error.

    All m/u probabilities are fixed in SETTINGS (see module comments) rather
    than trained from the request data — this dataset is far too small for
    Splink's usual training approaches to converge meaningfully, so no
    training step runs here at all; predict() uses the fixed values directly.
    """
    if len(candidates) < 2:
        return []

    rows = pd.DataFrame([_to_splink_row(c) for c in candidates])

    linker = Linker(rows, SETTINGS, db_api=DuckDBAPI())
    predictions = linker.inference.predict(threshold_match_probability=threshold)
    predictions_df = predictions.as_pandas_dataframe()

    if predictions_df.empty:
        return []

    # Union-find over pairwise matches above threshold: two records that are
    # each independently linked to a common third record end up in the same
    # group, not just pairwise — this is what turns pairwise Splink output
    # into the "groups" shape the Node side actually wants.
    parent: dict[str, str] = {}

    def find(x: str) -> str:
        while parent.get(x, x) != x:
            x = parent.get(x, x)
        return x

    def union(a: str, b: str) -> None:
        parent.setdefault(a, a)
        parent.setdefault(b, b)
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    pair_scores: dict[tuple[str, str], float] = {}
    for _, row in predictions_df.iterrows():
        a, b, score = str(row["unique_id_l"]), str(row["unique_id_r"]), float(row["match_probability"])
        if score < threshold:
            continue
        union(a, b)
        pair_scores[(a, b)] = score

    groups: dict[str, set[str]] = {}
    for node in parent:
        root = find(node)
        groups.setdefault(root, set()).add(node)

    result = []
    for members in groups.values():
        if len(members) < 2:
            continue
        member_list = sorted(members)
        relevant_scores = [
            score for (a, b), score in pair_scores.items() if a in members and b in members
        ]
        group_score = min(relevant_scores) if relevant_scores else threshold
        result.append({"candidateIds": member_list, "score": round(group_score, 4)})

    return result
