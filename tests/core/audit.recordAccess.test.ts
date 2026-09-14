import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import clinicAAdapter from "../../src/adapters/clinic-a/index.js";
import hospitalBAdapter from "../../src/adapters/hospital-b/index.js";
import thirdSourceAdapter from "../fixtures/thirdSourceAdapter.js";
import { auditedQuery } from "../../src/core/audit/recordAccess.js";
import * as auditRepo from "../../src/core/audit/auditRepo.js";
import { issueConsentToken } from "../../src/core/consent/issueToken.js";
import type { SourceAdapter } from "../../src/types/sourceAdapter.js";

function registryOf(...adapters: SourceAdapter[]): Map<string, SourceAdapter> {
  return new Map(adapters.map((a) => [a.id, a]));
}

describe("auditedQuery", () => {
  let recordSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    recordSpy = vi.spyOn(auditRepo, "record").mockImplementation(() => {});
  });

  afterEach(() => {
    recordSpy.mockRestore();
  });

  it("records a 'success' outcome and correct source attribution for a full valid query", async () => {
    const { claims } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
      purpose: "treatment",
    });

    const registry = registryOf(clinicAAdapter, hospitalBAdapter);
    const result = await auditedQuery(
      registry,
      (sourceId) => (sourceId === "clinic-a" ? "CA-001" : sourceId === "hospital-b" ? "HB-HN-22190" : undefined),
      claims
    );

    expect(result.patient).not.toBeNull();
    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: "patient-query",
        actor: "dr-jane",
        outcome: "success",
        detail: expect.objectContaining({ contributingSources: expect.arrayContaining(["clinic-a", "hospital-b"]) }),
      })
    );
  });

  it("records a 'partial-success' outcome, not a false success, when one source fails", async () => {
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

    const { claims } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
      purpose: "treatment",
    });

    const registry = registryOf(clinicAAdapter, brokenAdapter);
    const result = await auditedQuery(
      registry,
      (sourceId) => (sourceId === "clinic-a" ? "CA-001" : "anything"),
      claims
    );

    expect(result.patient).not.toBeNull();
    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: "patient-query",
        outcome: "partial-success",
        detail: expect.objectContaining({
          contributingSources: ["clinic-a"],
          failedSources: [{ sourceId: "broken-source", reason: "simulated connectivity failure" }],
        }),
      })
    );
  });

  it("strips resource types not covered by the token's scope from the response", async () => {
    const { claims } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Observation"], // deliberately narrow
      purpose: "research",
    });

    const registry = registryOf(clinicAAdapter, hospitalBAdapter);
    const result = await auditedQuery(
      registry,
      (sourceId) => (sourceId === "clinic-a" ? "CA-001" : sourceId === "hospital-b" ? "HB-HN-22190" : undefined),
      claims
    );

    expect(result.observations.length).toBeGreaterThan(0);
    expect(result.patient).toBeNull(); // Patient not in scope
    expect(result.encounters).toEqual([]); // Encounter not in scope
    expect(result.medicationStatements).toEqual([]); // MedicationStatement not in scope
  });

  it("records the full per-source status block (Phase 3) alongside a partial-success outcome", async () => {
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

    const { claims } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
      purpose: "treatment",
    });

    const registry = registryOf(clinicAAdapter, brokenAdapter);
    await auditedQuery(registry, (sourceId) => (sourceId === "clinic-a" ? "CA-001" : "anything"), claims);

    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({
          sourceStatus: expect.arrayContaining([
            expect.objectContaining({ sourceId: "clinic-a", reachable: true, reason: null }),
            expect.objectContaining({ sourceId: "broken-source", reachable: false }),
          ]),
        }),
      })
    );
  });

  it("extensibility: a newly registered third adapter is covered by audit logging with zero adapter-level changes", async () => {
    const { claims } = await issueConsentToken({
      requestingParty: "dr-jane",
      patientId: "SYN-8801015800083",
      scopes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
      purpose: "treatment",
    });

    const registry = registryOf(clinicAAdapter, hospitalBAdapter, thirdSourceAdapter);
    const result = await auditedQuery(
      registry,
      (sourceId) => {
        if (sourceId === "clinic-a") return "CA-001";
        if (sourceId === "hospital-b") return "HB-HN-22190";
        if (sourceId === "third-source") return "TS-001";
        return undefined;
      },
      claims
    );

    expect(result.contributingSources.sort()).toEqual(["clinic-a", "hospital-b", "third-source"]);
    expect(recordSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        outcome: "success",
        detail: expect.objectContaining({
          contributingSources: expect.arrayContaining(["clinic-a", "hospital-b", "third-source"]),
        }),
      })
    );
  });
});
