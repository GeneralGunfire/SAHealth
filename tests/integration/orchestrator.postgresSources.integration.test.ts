import { describe, expect, it } from "vitest";
import clinicAAdapter from "../../src/adapters/clinic-a/index.js";
import hospitalBAdapter from "../../src/adapters/hospital-b/index.js";
import { queryPatientAcrossSources } from "../../src/core/orchestrator.js";
import { makeResolver, resolveSourcePatientId } from "../../src/core/sourcePatientDirectory.js";
import type { SourceAdapter } from "../../src/types/sourceAdapter.js";

/**
 * Integration coverage against the real Postgres-backed source APIs
 * (sources/clinic-a-api and sources/hospital-b-api). Requires both services
 * running (see each service's README/package.json `dev` script) with their
 * databases created and seeded (`npm run db:setup` in each service folder).
 *
 * This supersedes the old Phase 1 unit-style orchestrator test that called
 * the real adapters directly — those adapters now perform real HTTP calls,
 * so exercising them meaningfully requires the live services.
 */
function registryOf(...adapters: SourceAdapter[]): Map<string, SourceAdapter> {
  return new Map(adapters.map((a) => [a.id, a]));
}

describe("orchestrator against Postgres-backed sources", () => {
  it("combines both sources for a patient present in both, deduplicating identity", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter);
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));

    expect(result.contributingSources.sort()).toEqual(["clinic-a", "hospital-b"]);
    expect(result.failedSources).toHaveLength(0);
    expect(result.patient).not.toBeNull();
    expect(result.patient!.sourceRecords).toHaveLength(2);

    const patientId = result.canonicalPatientId;
    for (const e of result.encounters) expect(e.subject.id).toBe(patientId);
    for (const o of result.observations) expect(o.subject.id).toBe(patientId);
    for (const m of result.medicationStatements) expect(m.subject.id).toBe(patientId);
  });

  it("returns a partial result when the patient exists in only one source", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter);
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-9203127800088"));

    expect(result.contributingSources).toEqual(["clinic-a"]);
    expect(result.patient).not.toBeNull();
  });

  it("returns a null result with no contributing sources for an unknown identifier", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter);
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-DOES-NOT-EXIST"));

    expect(result.patient).toBeNull();
    expect(result.contributingSources).toHaveLength(0);
  });

  it("handles a deliberately messy record (missing email/mobile) without crashing", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter);
    // Sipho Dlamini (CA-002): cellNumber is NULL in the seed data.
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-9203127800088"));

    expect(result.patient).not.toBeNull();
    expect(result.patient!.contact.phone).toBeNull();
    expect(result.failedSources).toHaveLength(0);
  });

  it("logs and skips a source when the API returns an error, without failing the whole query", async () => {
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

    const registry = registryOf(clinicAAdapter, brokenAdapter);
    const result = await queryPatientAcrossSources(registry, (sourceId) =>
      sourceId === "broken-source" ? "anything" : makeResolver("SYN-8801015800083")(sourceId)
    );

    expect(result.contributingSources).toEqual(["clinic-a"]);
    expect(result.failedSources).toEqual([{ sourceId: "broken-source", reason: "simulated connectivity failure" }]);
    expect(result.patient).not.toBeNull();
  });

  /**
   * Honesty test for deterministic identity matching's known limitation
   * (Backend_Research.docx Section 3.2): Clinic A's "Palesa Zulu" and
   * Hospital B's "Palessa Zulu" (misspelled, and with no national id on
   * file) represent the same conceptual person in this synthetic dataset,
   * but deterministic matching on a shared identifier CANNOT and MUST NOT
   * merge them, because no shared identifier exists between the two
   * records. This is expected, documented behaviour — not a bug to fix —
   * and is exactly why probabilistic matching remains a backlog item
   * rather than being implemented prematurely.
   */
  it("does NOT merge the near-duplicate patient across sources (expected deterministic-matching limitation)", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter);

    // Querying by Clinic A's synthetic id for Palesa Zulu only ever resolves
    // a Clinic A native id — there is no shared identifier to resolve Hospital
    // B's misspelled, unlinked "Palessa Zulu" record through the same query.
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-9001015800044"));

    expect(result.contributingSources).toEqual(["clinic-a"]);
    expect(result.patient!.name.family).toBe("Zulu");
    expect(result.patient!.sourceRecords).toHaveLength(1);
    expect(result.patient!.sourceRecords[0].sourceId).toBe("clinic-a");

    // Confirm Hospital B's record for the same conceptual person truly has
    // no resolvable path via the shared-identifier directory, proving this
    // isn't an accidental gap in the test but the documented limitation itself.
    expect(resolveSourcePatientId("SYN-9001015800044", "hospital-b")).toBeUndefined();
  });
});
