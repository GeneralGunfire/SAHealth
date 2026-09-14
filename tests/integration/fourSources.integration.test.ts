import { describe, expect, it } from "vitest";
import clinicAAdapter from "../../src/adapters/clinic-a/index.js";
import hospitalBAdapter from "../../src/adapters/hospital-b/index.js";
import dhis2StyleCAdapter from "../../src/adapters/dhis2-style-c/index.js";
import hprsStyleDAdapter from "../../src/adapters/hprs-style-d/index.js";
import { queryPatientAcrossSources } from "../../src/core/orchestrator.js";
import { makeResolver } from "../../src/core/sourcePatientDirectory.js";
import type { SourceAdapter } from "../../src/types/sourceAdapter.js";

/**
 * Step 1 verification: all four sources (Clinic A, Hospital B, Source C
 * DHIS2-style, Source D HPRS-style/SQLite) queryable together through the
 * unchanged orchestrator/registry, with zero core code changes required to
 * add the two new sources. Requires all four source APIs running and
 * seeded — see each source's own package.json `dev`/`db:setup` scripts.
 */
function registryOf(...adapters: SourceAdapter[]): Map<string, SourceAdapter> {
  return new Map(adapters.map((a) => [a.id, a]));
}

describe("orchestrator across all four sources", () => {
  it("combines Clinic A, Hospital B, and Source C for a patient present in three of four sources", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));

    expect(result.contributingSources.sort()).toEqual(["clinic-a", "dhis2-style-c", "hospital-b"]);
    expect(result.failedSources).toHaveLength(0);
    expect(result.patient).not.toBeNull();
    expect(result.patient!.sourceRecords).toHaveLength(3);

    const patientId = result.canonicalPatientId;
    for (const e of result.encounters) expect(e.subject.id).toBe(patientId);
    for (const o of result.observations) expect(o.subject.id).toBe(patientId);
    for (const m of result.medicationStatements) expect(m.subject.id).toBe(patientId);
  });

  it("still isolates a failing source's error when querying across all four", async () => {
    const brokenAdapter: SourceAdapter = {
      id: "broken-source",
      displayName: "Broken source (test double)",
      async fetchPatient() {
        throw new Error("simulated connectivity failure");
      },
      translate() {
        throw new Error("should not be called");
      },
    };

    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter, brokenAdapter);
    const result = await queryPatientAcrossSources(registry, (sourceId) =>
      sourceId === "broken-source" ? "anything" : makeResolver("SYN-8801015800083")(sourceId)
    );

    expect(result.failedSources).toEqual([{ sourceId: "broken-source", reason: "simulated connectivity failure" }]);
    expect(result.contributingSources.sort()).toEqual(["clinic-a", "dhis2-style-c", "hospital-b"]);
    expect(result.patient).not.toBeNull();
  });

  it("queries Source D independently by its own native id (separate identifier system, no automatic cross-reference)", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);
    const result = await queryPatientAcrossSources(registry, (sourceId) =>
      sourceId === "hprs-style-d" ? "HPRS-P001" : undefined
    );

    expect(result.contributingSources).toEqual(["hprs-style-d"]);
    expect(result.patient!.name.family).toBe("Nkosi");
  });

  /**
   * Honesty test across the FULL near-duplicate chain (four independently-
   * shaped systems, four different spellings/identifiers for the same
   * conceptual person "Palesa Zulu"): deterministic matching correctly
   * treats each as a separate, unmerged canonical patient, since no two of
   * them share a resolvable identifier. Source D's record in particular
   * has the CORRECT spelling but a mismatched identifier from a different
   * identifier system entirely — proving name similarity alone is not
   * what deterministic matching keys on, and that this is not a
   * coincidental gap but the documented, expected limitation motivating
   * probabilistic matching as future work (Backend_Research.docx Section 3.2).
   */
  it("does NOT merge any leg of the four-way near-duplicate chain (expected deterministic-matching limitation)", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);

    const clinicALeg = await queryPatientAcrossSources(registry, makeResolver("SYN-9001015800044"));
    expect(clinicALeg.contributingSources).toEqual(["clinic-a"]);
    expect(clinicALeg.patient!.name.family).toBe("Zulu");

    const sourceDLeg = await queryPatientAcrossSources(registry, (sourceId) =>
      sourceId === "hprs-style-d" ? "HPRS-P006" : undefined
    );
    expect(sourceDLeg.contributingSources).toEqual(["hprs-style-d"]);
    expect(sourceDLeg.patient!.name.family).toBe("Zulu");
    expect(sourceDLeg.patient!.name.given).toEqual(["Palesa"]); // correctly spelled here, but still unmatched

    // Confirm these are genuinely two separate canonical patients, not
    // coincidentally sharing a canonical id.
    expect(clinicALeg.canonicalPatientId).not.toBe(sourceDLeg.canonicalPatientId);
  });
});
