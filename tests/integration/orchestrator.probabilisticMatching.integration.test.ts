import { afterAll, beforeAll, describe, expect, it } from "vitest";
import clinicAAdapter from "../../src/adapters/clinic-a/index.js";
import hospitalBAdapter from "../../src/adapters/hospital-b/index.js";
import dhis2StyleCAdapter from "../../src/adapters/dhis2-style-c/index.js";
import hprsStyleDAdapter from "../../src/adapters/hprs-style-d/index.js";
import { queryPatientAcrossSources } from "../../src/core/orchestrator.js";
import { makeResolver, makeProbabilisticDemoResolver } from "../../src/core/sourcePatientDirectory.js";
import { ProbabilisticMatchingUnavailableError } from "../../src/core/identityMatchProbabilistic.js";
import type { SourceAdapter } from "../../src/types/sourceAdapter.js";

/**
 * Probabilistic identity matching (Backend_Research.docx Section 3.2),
 * demonstrated side-by-side against unchanged deterministic behaviour.
 *
 * Requires all four source APIs running AND the Python sidecar
 * (sidecar-probabilistic-matching/) running on port 5001 —
 * `uvicorn main:app --port 5001` from that folder.
 */
function registryOf(...adapters: SourceAdapter[]): Map<string, SourceAdapter> {
  return new Map(adapters.map((a) => [a.id, a]));
}

describe("probabilistic vs deterministic identity matching", () => {
  it("deterministic mode: the Palesa/Palessa/Palesah/P. case is NOT merged — unchanged from before this feature existed", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);

    // Query each leg individually via the deterministic resolver, exactly
    // as Phase 1/1B's existing tests already do — this is not a new
    // assertion, it is re-confirming the pre-existing guarantee still holds
    // with probabilistic matching now present in the codebase.
    const clinicALeg = await queryPatientAcrossSources(registry, makeResolver("SYN-9001015800044"), "deterministic");
    expect(clinicALeg.contributingSources).toEqual(["clinic-a"]);
    expect(clinicALeg.matchingMode).toBe("deterministic");
    expect(clinicALeg.probabilisticMatch).toBeNull();

    const sourceDLeg = await queryPatientAcrossSources(
      registry,
      (sourceId) => (sourceId === "hprs-style-d" ? "HPRS-P006" : undefined),
      "deterministic"
    );
    expect(sourceDLeg.contributingSources).toEqual(["hprs-style-d"]);
    expect(clinicALeg.canonicalPatientId).not.toBe(sourceDLeg.canonicalPatientId);
  });

  it("probabilistic mode: the SAME Palesa/Palessa/Palesah/P. case IS flagged as a probable match group above threshold", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);

    const result = await queryPatientAcrossSources(
      registry,
      makeProbabilisticDemoResolver("DEMO-PALESA-ZULU"),
      "probabilistic"
    );

    expect(result.matchingMode).toBe("probabilistic");
    expect(result.contributingSources.sort()).toEqual(["clinic-a", "dhis2-style-c", "hospital-b", "hprs-style-d"]);
    expect(result.probabilisticMatch).not.toBeNull();
    expect(result.probabilisticMatch!.score).toBeGreaterThanOrEqual(0.85);
    expect(result.probabilisticMatch!.candidateIds).toHaveLength(4);

    // All four sources' records are genuinely combined into one canonical patient.
    expect(result.patient).not.toBeNull();
    expect(result.patient!.sourceRecords).toHaveLength(4);
    const mergedSourceIds = result.patient!.sourceRecords.map((sr) => sr.sourceId).sort();
    expect(mergedSourceIds).toEqual(["clinic-a", "dhis2-style-c", "hospital-b", "hprs-style-d"]);
  });

  it("deterministic mode is unaffected when queried immediately after a probabilistic query (no shared state)", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);

    await queryPatientAcrossSources(registry, makeProbabilisticDemoResolver("DEMO-PALESA-ZULU"), "probabilistic");

    // Immediately re-run the deterministic query for the same conceptual
    // person's Clinic A leg — must still show the unmerged, isolated result.
    const afterProbabilistic = await queryPatientAcrossSources(
      registry,
      makeResolver("SYN-9001015800044"),
      "deterministic"
    );
    expect(afterProbabilistic.contributingSources).toEqual(["clinic-a"]);
    expect(afterProbabilistic.matchingMode).toBe("deterministic");
  });
});

describe("probabilistic matching: true-negative honesty check", () => {
  it("does not merge two different patients who share a first name and DOB pattern", async () => {
    // Construct a registry with two clean, single-source adapters standing
    // in for two clearly different people who happen to share superficial
    // features (first name "Palesa", nearby DOB) — proving probabilistic
    // matching doesn't over-merge just because it CAN catch the intended case.
    const palesaAdapter: SourceAdapter = {
      id: "clinic-a",
      displayName: "Clinic A (simulated local clinic system)",
      async fetchPatient() {
        return {
          patient: {
            patientRef: "CA-006",
            identifiers: [{ idType: "NAT-ID", idValue: "SYN-9001015800044" }],
            firstNames: "Palesa",
            surname: "Zulu",
            sex: "F" as const,
            dob: "01/01/1990",
            cellNumber: "+27827778899",
            emailAddress: null,
            addr: { street: null, town: null, province: null, zip: null },
          },
          encounters: [],
          observations: [],
          medicationStatements: [],
        };
      },
      translate(raw, _warnings) {
        const p = (raw as { patient: { patientRef: string; firstNames: string; surname: string; sex: "M" | "F"; dob: string; cellNumber: string | null } }).patient;
        const [dd, mm, yyyy] = p.dob.split("/");
        return {
          patient: {
            resourceType: "Patient",
            id: p.patientRef,
            identifiers: [{ system: "clinic-a-nat-id", value: "SYN-9001015800044" }],
            name: { given: [p.firstNames], family: p.surname },
            gender: p.sex === "F" ? "female" : "male",
            birthDate: `${yyyy}-${mm}-${dd}`,
            contact: { phone: p.cellNumber, email: null },
            address: { line: null, city: null, province: null, postalCode: null },
            sourceRecords: [{ sourceId: "clinic-a", sourceRecordId: p.patientRef }],
          },
          encounters: [],
          observations: [],
          medicationStatements: [],
        };
      },
    };

    const unrelatedPalesaAdapter: SourceAdapter = {
      id: "hprs-style-d",
      displayName: "Source D (simulated HPRS-style national system, SQLite-backed)",
      async fetchPatient() {
        return {
          patient: {
            hprsUuid: "HPRS-DIFFERENT-PALESA",
            saIdNumber: "7506159800012",
            givenName: "Palesa",
            familyName: "Ndlovu", // different surname
            sex: "F" as const,
            dateOfBirth: "1975-06-15", // different DOB
            mobileNumber: "+27811119999",
            facilityCode: "FAC-DEMO-99",
          },
          encounters: [],
          observations: [],
          medicationStatements: [],
        };
      },
      translate(raw, _warnings) {
        const p = (raw as {
          patient: {
            hprsUuid: string;
            saIdNumber: string;
            givenName: string;
            familyName: string;
            sex: "M" | "F";
            dateOfBirth: string;
            mobileNumber: string;
          };
        }).patient;
        return {
          patient: {
            resourceType: "Patient",
            id: p.hprsUuid,
            identifiers: [
              { system: "hprs-style-d-sa-id-number", value: p.saIdNumber },
              { system: "hprs-style-d-uuid", value: p.hprsUuid },
            ],
            name: { given: [p.givenName], family: p.familyName },
            gender: p.sex === "F" ? "female" : "male",
            birthDate: p.dateOfBirth,
            contact: { phone: p.mobileNumber, email: null },
            address: { line: null, city: null, province: null, postalCode: null },
            sourceRecords: [{ sourceId: "hprs-style-d", sourceRecordId: p.hprsUuid }],
          },
          encounters: [],
          observations: [],
          medicationStatements: [],
        };
      },
    };

    const registry = registryOf(palesaAdapter, unrelatedPalesaAdapter);
    const result = await queryPatientAcrossSources(
      registry,
      () => "irrelevant-because-both-adapters-ignore-the-id-arg",
      "probabilistic"
    );

    expect(result.matchingMode).toBe("probabilistic");
    // No probable-match group covers both contributing sources.
    expect(result.probabilisticMatch).toBeNull();
    // Only the primary source's data is combined — the two are NOT merged.
    expect(result.patient!.sourceRecords).toHaveLength(1);
    expect(result.warnings.some((w) => w.sourceId === "identity-match-probabilistic")).toBe(true);
  });
});

describe("probabilistic matching: sidecar unavailability", () => {
  const originalEnv = process.env.PROBABILISTIC_MATCHING_SIDECAR_URL;

  beforeAll(() => {
    // Point at a port nothing is listening on, simulating the sidecar being down.
    process.env.PROBABILISTIC_MATCHING_SIDECAR_URL = "http://localhost:59999";
  });

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.PROBABILISTIC_MATCHING_SIDECAR_URL;
    } else {
      process.env.PROBABILISTIC_MATCHING_SIDECAR_URL = originalEnv;
    }
  });

  it("fails clearly when the sidecar is unreachable, rather than silently falling back to deterministic", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);

    await expect(
      queryPatientAcrossSources(registry, makeProbabilisticDemoResolver("DEMO-PALESA-ZULU"), "probabilistic")
    ).rejects.toThrow(ProbabilisticMatchingUnavailableError);
  });

  it("the deterministic path continues working regardless of the sidecar being down", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);

    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"), "deterministic");
    expect(result.patient).not.toBeNull();
    expect(result.matchingMode).toBe("deterministic");
  });
});
