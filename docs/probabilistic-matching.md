# Probabilistic Identity Matching

This document supersedes the backlog note in `Backend_Research.docx`
Section 3.2 ("Probabilistic matching is retained as a documented area for
potential future exploration ... but is explicitly not prioritised for the
initial build"). That backlog item has now been implemented — as an
**explicit, separate, opt-in path alongside deterministic matching**, not
as a replacement for it.

## What changed, precisely

- **Deterministic matching remains the default and primary path.**
  `src/core/identityMatch.ts` is unmodified by this work. Every existing
  caller of `queryPatientAcrossSources` that does not pass a `matchingMode`
  argument gets byte-for-byte the same behaviour as before this feature
  existed. The full pre-existing test suite (50 tests) passes unchanged.
- **Probabilistic matching is reachable only by explicit request**: the
  `GET /patients/:nationalId?matching=probabilistic` query parameter, or
  passing `"probabilistic"` directly to `queryPatientAcrossSources`. There
  is no shared mutable state between the two paths.
- **If the probabilistic-matching sidecar is unreachable, the query fails
  clearly** (HTTP 502, a distinct `ProbabilisticMatchingUnavailableError`)
  rather than silently falling back to deterministic matching. The
  deterministic path is completely unaffected by the sidecar's
  availability — confirmed by a live test that kills the sidecar process
  and re-runs a deterministic query successfully in the same session.

## Architecture

A small Python sidecar (`sidecar-probabilistic-matching/`, FastAPI +
Splink, run via `uvicorn`, no Docker) exposes one endpoint, `POST /match`:
given a list of candidate patient records (name, DOB, gender, phone), it
returns groups of candidate ids that Splink's Fellegi-Sunter model scores
as a probable match above a configured threshold. The Node backend
(`src/core/identityMatchProbabilistic.ts`) calls this over plain HTTP and
holds no Splink-specific knowledge — the sidecar's internals could be
swapped for a different matching engine without the Node side changing.

## The demonstrated case

The pre-existing "Palesa Zulu" near-duplicate — the same conceptual person
recorded under four different spellings and four different (or absent)
identifier schemes across all four simulated sources — is the primary demo
case:

| Source | Name recorded | Shared identifier |
|---|---|---|
| Clinic A | Palesa Zulu | `SYN-9001015800044` |
| Hospital B | (initials only) "P." Zulu | none on file |
| Source C (DHIS2-style) | Palesah Zulu | none captured |
| Source D (HPRS-style) | Palesa Zulu | a different identifier scheme entirely |

- **Deterministic mode** (unchanged): each of the four is queried
  individually and never merges with the others — there is no shared
  identifier for it to key on. This is the correct, honest behaviour and
  remains exactly as documented before this feature.
- **Probabilistic mode**: querying all four sources' records together, the
  sidecar groups all four as a probable match with a score of **0.918**
  (above the 0.85 threshold), and the orchestrator combines their data into
  one canonical record — with the match explicitly disclosed in the
  response (`probabilisticMatch: { candidateIds, score }`) and in the audit
  trail, never presented as if it were a deterministic match.

A true-negative case is tested alongside the true positive: two records
sharing a first name ("Palesa") and a similar DOB pattern, but a different
surname, DOB, and gender, score **0.12** — well below threshold — and are
correctly NOT merged. This is deliberately included so the feature is not
demonstrated only on the case it's designed to catch.

## Honest limitations of this implementation

**The match threshold (0.85) and the underlying Splink model parameters
(m/u probabilities) were chosen for this project's synthetic, small-scale
demo dataset — a few dozen records total.** They have not been validated
against a labelled ground-truth dataset or production-representative
volume, and should not be read as production-tuned values. Specifically:

- Splink's usual training approaches (`estimate_u_using_random_sampling`,
  expectation-maximisation) do not converge meaningfully on a dataset this
  small; the m/u probabilities used here are fixed, analytically-reasoned
  values (see comments in `sidecar-probabilistic-matching/matching.py`),
  not statistically trained estimates.
- The blocking rule blocks on surname + date of birth, not first name +
  surname + date of birth as originally specified — an exact-match
  blocking rule on first name would have excluded the very fuzzy-first-name
  variants ("Palesa" / "Palessah" / "P.") this feature exists to catch,
  before scoring ever ran. This is a documented, deliberate deviation for
  this dataset, not an oversight.
- `probability_two_random_records_match` was raised from Splink's
  production-scale default (0.0001) to 0.05 specifically because the
  default assumes a random pair almost never matches — true at real
  linkage volumes, false for a small curated set where a planted
  near-duplicate is a meaningful fraction of all records.

In short: this is a demonstrated, working upgrade path for identity
matching, proving the architecture and the mechanism — not a validated,
production-grade probabilistic matching configuration. Moving beyond
demonstration would require a labelled training/validation dataset at
realistic scale, proper EM/random-sampling parameter training, and
threshold selection informed by measured precision/recall rather than
domain judgment.
