import { describe, expect, it } from "vitest";
import clinicAAdapter from "../../src/adapters/clinic-a/index.js";
import hospitalBAdapter from "../../src/adapters/hospital-b/index.js";
import dhis2StyleCAdapter from "../../src/adapters/dhis2-style-c/index.js";
import hprsStyleDAdapter from "../../src/adapters/hprs-style-d/index.js";
import { queryPatientAcrossSources } from "../../src/core/orchestrator.js";
import { makeResolver } from "../../src/core/sourcePatientDirectory.js";
import { makeFailingAdapter, connectionRefusedError, timeoutError, authFailureError } from "../fixtures/failingAdapter.js";
import type { SourceAdapter } from "../../src/types/sourceAdapter.js";

/**
 * Phase 3 verification (Backend_Research.docx Section 5.2): explicit,
 * per-source status disclosure on every query, without weakening Phase 1's
 * existing failure isolation. Requires the four real source APIs running
 * (Clinic A, Hospital B, Source C, Source D) — the "down" sources in these
 * tests are test-only failing-adapter substitutions per the existing
 * broken-source pattern, not the real services being stopped.
 */
function registryOf(...adapters: SourceAdapter[]): Map<string, SourceAdapter> {
  return new Map(adapters.map((a) => [a.id, a]));
}

describe("orchestrator: per-source status disclosure", () => {
  it("all sources actually queried are reachable: sourceStatus covers all four, with correct queried/reachable distinction", async () => {
    // SYN-8801015800083 (Thandiwe Nkosi) resolves in clinic-a, hospital-b, and
    // dhis2-style-c, but NOT hprs-style-d, which deliberately uses its own
    // separate SA-ID identifier scheme (see sourcePatientDirectory.ts) — so
    // Source D is correctly reported as `queried: false`, not `reachable: false`.
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));

    expect(result.sourceStatus).toHaveLength(4);

    const queried = result.sourceStatus.filter((s) => s.queried);
    const notQueried = result.sourceStatus.filter((s) => !s.queried);
    expect(queried).toHaveLength(3);
    expect(notQueried).toHaveLength(1);
    expect(notQueried[0].sourceId).toBe("hprs-style-d");
    expect(notQueried[0].reachable).toBe(false);
    expect(notQueried[0].reason).toBeNull(); // not-queried is not a failure; no failure reason is fabricated

    for (const status of queried) {
      expect(status.reachable).toBe(true);
      expect(status.reason).toBeNull();
      expect(status.responseTimeMs).not.toBeNull();
      expect(status.responseTimeMs!).toBeGreaterThanOrEqual(0);
      expect(new Date(status.queriedAt).toString()).not.toBe("Invalid Date");
    }
    // No source that was actually attempted came back unreachable.
    expect(queried.some((s) => !s.reachable)).toBe(false);
  });

  it("one source down (connection refused): 200-equivalent partial combination, correct unreachable entry, no stale data leaks in", async () => {
    const failingHospitalB = makeFailingAdapter("hospital-b", connectionRefusedError());
    const registry = registryOf(clinicAAdapter, failingHospitalB, dhis2StyleCAdapter, hprsStyleDAdapter);

    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));

    expect(result.patient).not.toBeNull();
    expect(result.contributingSources.sort()).toEqual(["clinic-a", "dhis2-style-c"]);

    const hospitalBStatus = result.sourceStatus.find((s) => s.sourceId === "hospital-b");
    expect(hospitalBStatus).toMatchObject({ reachable: false, reason: "connection-refused" });
    expect(hospitalBStatus!.responseTimeMs).not.toBeNull();

    // No data attributed to hospital-b appears anywhere in the combined result.
    expect(result.patient!.sourceRecords.some((sr) => sr.sourceId === "hospital-b")).toBe(false);
    expect(result.encounters.some((e) => e.sourceRecord.sourceId === "hospital-b")).toBe(false);
    expect(result.observations.some((o) => o.sourceRecord.sourceId === "hospital-b")).toBe(false);
    expect(result.medicationStatements.some((m) => m.sourceRecord.sourceId === "hospital-b")).toBe(false);
  });

  it("one source down (timeout): correctly classified and isolated", async () => {
    const failingSourceC = makeFailingAdapter("dhis2-style-c", timeoutError());
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, failingSourceC, hprsStyleDAdapter);

    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));

    expect(result.patient).not.toBeNull();
    const status = result.sourceStatus.find((s) => s.sourceId === "dhis2-style-c");
    expect(status).toMatchObject({ reachable: false, reason: "timeout" });
    expect(result.encounters.some((e) => e.sourceRecord.sourceId === "dhis2-style-c")).toBe(false);
  });

  it("one source down (auth failure): correctly classified", async () => {
    const failingClinicA = makeFailingAdapter("clinic-a", authFailureError("Clinic A"));
    const registry = registryOf(failingClinicA, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);

    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));

    const status = result.sourceStatus.find((s) => s.sourceId === "clinic-a");
    expect(status).toMatchObject({ reachable: false, reason: "auth-failure" });
  });

  it("two sources down simultaneously: honesty guarantee still holds for both, remaining sources still combine correctly", async () => {
    const failingHospitalB = makeFailingAdapter("hospital-b", connectionRefusedError());
    const failingSourceC = makeFailingAdapter("dhis2-style-c", timeoutError());
    const registry = registryOf(clinicAAdapter, failingHospitalB, failingSourceC, hprsStyleDAdapter);

    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));

    expect(result.patient).not.toBeNull();
    expect(result.contributingSources).toEqual(["clinic-a"]);
    expect(result.sourceStatus).toHaveLength(4);

    const hospitalBStatus = result.sourceStatus.find((s) => s.sourceId === "hospital-b");
    const sourceCStatus = result.sourceStatus.find((s) => s.sourceId === "dhis2-style-c");
    expect(hospitalBStatus).toMatchObject({ reachable: false, reason: "connection-refused" });
    expect(sourceCStatus).toMatchObject({ reachable: false, reason: "timeout" });

    const clinicAStatus = result.sourceStatus.find((s) => s.sourceId === "clinic-a");
    expect(clinicAStatus).toMatchObject({ reachable: true, reason: null });

    // No data from either downed source leaks into the combined result.
    for (const downedSourceId of ["hospital-b", "dhis2-style-c"]) {
      expect(result.patient!.sourceRecords.some((sr) => sr.sourceId === downedSourceId)).toBe(false);
      expect(result.encounters.some((e) => e.sourceRecord.sourceId === downedSourceId)).toBe(false);
      expect(result.observations.some((o) => o.sourceRecord.sourceId === downedSourceId)).toBe(false);
      expect(result.medicationStatements.some((m) => m.sourceRecord.sourceId === downedSourceId)).toBe(false);
    }
  });

  it("every resource in the combined result carries queriedAt provenance from this specific query attempt", async () => {
    const registry = registryOf(clinicAAdapter, hospitalBAdapter, dhis2StyleCAdapter, hprsStyleDAdapter);
    const beforeQuery = new Date();
    const result = await queryPatientAcrossSources(registry, makeResolver("SYN-8801015800083"));
    const afterQuery = new Date();

    const allRecords = [
      ...result.patient!.sourceRecords,
      ...result.encounters.map((e) => e.sourceRecord),
      ...result.observations.map((o) => o.sourceRecord),
      ...result.medicationStatements.map((m) => m.sourceRecord),
    ];

    expect(allRecords.length).toBeGreaterThan(0);
    for (const ref of allRecords) {
      expect(ref.queriedAt).toBeDefined();
      const queriedAt = new Date(ref.queriedAt!);
      expect(queriedAt.getTime()).toBeGreaterThanOrEqual(beforeQuery.getTime());
      expect(queriedAt.getTime()).toBeLessThanOrEqual(afterQuery.getTime());
    }
  });
});
