/**
 * Phase 1 stand-in for a real patient cross-reference service (e.g. IHE PIX).
 * Maps a query-time synthetic national id to each source's own native patient id.
 * This is deliberately a static, swappable lookup — not embedded in adapters or
 * the orchestrator — so a real PIX-style lookup can replace it later without
 * touching either.
 *
 * Clinic A is keyed by patient_id (e.g. "CA-001"), Hospital B by hosp_no
 * (e.g. "HB-HN-22190"), Source C by tei_uid (e.g. "TEI-001"), Source D by
 * hprs_uuid (e.g. "HPRS-P001") — see each source's seed.sql for the
 * underlying records these ids point to.
 *
 * Source D deliberately has NO entries routed to it via a shared "SYN-..."
 * identifier: its native identifier system is a 13-digit SA ID number, a
 * genuinely separate identifier scheme from the synthetic national id the
 * other three sources share (see src/adapters/hprs-style-d/translate.ts).
 * There is therefore no identifier through which this directory could
 * honestly resolve "the same person" into Source D without inventing a
 * cross-reference that doesn't exist in the data — so Source D's records
 * are reachable only by deliberately near-duplicate/unlinked test cases
 * below, never as an automatic fourth leg of an existing match.
 *
 * Near-duplicate chain across all four sources (the same conceptual person,
 * "Palesa Zulu", spelled and identified differently by each independently-
 * built system) is deliberately NOT resolvable as one shared identity here:
 *  - Clinic A: "Palesa Zulu", SYN-9001015800044 (has a synthetic national id)
 *  - Hospital B: "Palessa Zulu" (misspelled), no national id on file at all
 *  - Source C: "Palesah Zulu" (misspelled a third way), no nationalId attribute
 *  - Source D: "Palesa Zulu" (correct spelling here), SA ID 9001019800089 —
 *    a DIFFERENT identifier system and a different literal value from
 *    Clinic A's synthetic id, so even the correctly-spelled record does not
 *    deterministically match.
 * Each is reachable only via its own source-specific query id, proving
 * deterministic matching's honest limitation across four independently-
 * shaped systems, not just two.
 */
const directory: Record<string, Record<string, string>> = {
  "SYN-8801015800083": { "clinic-a": "CA-001", "hospital-b": "HB-HN-22190", "dhis2-style-c": "TEI-001" }, // Thandiwe Nkosi — matches in 3 of 4 sources
  "SYN-9203127800088": { "clinic-a": "CA-002" }, // Sipho Dlamini — Clinic A only
  "SYN-9506201800099": { "hospital-b": "HB-HN-30021" }, // Naledi Mokoena — Hospital B only
  "SYN-9001015800044": { "clinic-a": "CA-006" }, // Palesa Zulu — Clinic A leg of the near-duplicate chain only
  "SYN-7903155800012": { "pharmacy-e": "PHE-0042" }, // Thabo Mokwena — Pharmacy E only (fifth source, added via AI-assisted generation + human review; see docs/ai-assisted-adapter-generation.md)
};

export function resolveSourcePatientId(nationalId: string, sourceId: string): string | undefined {
  return directory[nationalId]?.[sourceId];
}

export function makeResolver(nationalId: string) {
  return (sourceId: string) => resolveSourcePatientId(nationalId, sourceId);
}

/**
 * Probabilistic-matching demo directory. Deliberately SEPARATE from
 * `directory` above and never consulted by makeResolver/resolveSourcePatientId
 * — the deterministic path's resolution behaviour is completely unchanged
 * by this addition.
 *
 * This exists because probabilistic matching's entire purpose is to find a
 * probable match WITHOUT a shared identifier — which is exactly the
 * situation `directory` above cannot express for the Palesa/Palessa/
 * Palesah case (there is no shared "SYN-..." key across all four sources
 * for that person; that is the documented point of the demo). A caller
 * requesting probabilistic matching therefore needs a distinct query key
 * that maps to all four sources' real, independent native ids, standing in
 * for what a real deployment would get from fetching "all recently active
 * records" or a broader candidate pool rather than a single shared key.
 */
const probabilisticDemoDirectory: Record<string, Record<string, string>> = {
  "DEMO-PALESA-ZULU": {
    "clinic-a": "CA-006",
    "hospital-b": "HB-HN-30201",
    "dhis2-style-c": "TEI-006",
    "hprs-style-d": "HPRS-P006",
  },
};

export function resolveProbabilisticDemoSourcePatientId(demoKey: string, sourceId: string): string | undefined {
  return probabilisticDemoDirectory[demoKey]?.[sourceId];
}

export function makeProbabilisticDemoResolver(demoKey: string) {
  return (sourceId: string) => resolveProbabilisticDemoSourcePatientId(demoKey, sourceId);
}
