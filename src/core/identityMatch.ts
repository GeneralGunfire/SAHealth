import type { CanonicalPatient } from "../canonical/index.js";

/**
 * Deterministic identity matching (Backend_Research.docx Section 3.2): matches
 * patient records across sources using a single, consistently-populated
 * synthetic identifier system, rather than probabilistic/fuzzy matching.
 *
 * This is a deliberate scope decision, not an oversight — probabilistic
 * matching is documented as future work, not implemented here.
 *
 * Isolated in its own module so a future matching strategy (e.g. probabilistic
 * scoring) can replace `computeCanonicalPatientId` without any change to
 * adapters or the orchestrator, which only depend on this module's exported
 * function signature.
 */

/**
 * The identifier systems adapters populate with a SHARED synthetic national
 * id, used for cross-source matching. Not every source participates in this
 * shared scheme by design: Source D (HPRS-style) deliberately uses its own,
 * separate 13-digit SA ID identifier system (hprs-style-d-sa-id-number) and
 * is never listed here — see src/adapters/hprs-style-d/translate.ts. Adding
 * a new source that DOES share the synthetic identifier scheme means adding
 * its identifier system string here; a source with its own separate scheme
 * needs no entry at all and will correctly match only against itself.
 */
const MATCH_IDENTIFIER_SYSTEMS = [
  "clinic-a-nat-id",
  "hospital-b-national-id",
  "dhis2-style-c-national-id",
] as const;

/**
 * Derives a single canonical patient id from one or more per-source canonical
 * Patient records that are believed to represent the same individual.
 *
 * A single contributing record always succeeds — even one with no shared
 * synthetic identifier at all (e.g. Source D) — falling back to its own
 * source-native id, since there is nothing to match against and no
 * ambiguity possible with only one record. Throws only when there are
 * multiple contributing records that cannot be linked by a shared
 * identifier, or that carry conflicting identifiers, since silently
 * merging unmatched records would be worse than failing loudly.
 */
export function computeCanonicalPatientId(patients: CanonicalPatient[]): string {
  if (patients.length === 1) {
    const [only] = patients;
    const matchValue = only.identifiers.find((i) =>
      (MATCH_IDENTIFIER_SYSTEMS as readonly string[]).includes(i.system)
    )?.value;
    return matchValue ?? only.id;
  }

  const matchValues = new Set<string>();

  for (const patient of patients) {
    for (const identifier of patient.identifiers) {
      if ((MATCH_IDENTIFIER_SYSTEMS as readonly string[]).includes(identifier.system)) {
        matchValues.add(identifier.value);
      }
    }
  }

  if (matchValues.size === 0) {
    throw new Error("No shared synthetic match identifier found across multiple candidate patient records.");
  }
  if (matchValues.size > 1) {
    throw new Error(
      `Ambiguous match: candidate records carry different synthetic identifiers (${[...matchValues].join(", ")}).`
    );
  }

  return [...matchValues][0];
}

/**
 * Groups a flat list of per-source canonical Patients into clusters that
 * share the same synthetic identifier. Records with no match identifier at
 * all are returned as their own singleton cluster rather than dropped.
 */
export function groupPatientsByIdentity(patients: CanonicalPatient[]): CanonicalPatient[][] {
  const groups = new Map<string, CanonicalPatient[]>();
  const unmatched: CanonicalPatient[][] = [];

  for (const patient of patients) {
    try {
      const key = computeCanonicalPatientId([patient]);
      const group = groups.get(key) ?? [];
      group.push(patient);
      groups.set(key, group);
    } catch {
      unmatched.push([patient]);
    }
  }

  return [...groups.values(), ...unmatched];
}
