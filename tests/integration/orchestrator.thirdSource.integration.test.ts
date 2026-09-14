import { describe, expect, it } from "vitest";
import clinicAAdapter from "../../src/adapters/clinic-a/index.js";
import hospitalBAdapter from "../../src/adapters/hospital-b/index.js";
import thirdSourceAdapter from "../fixtures/thirdSourceAdapter.js";
import { queryPatientAcrossSources } from "../../src/core/orchestrator.js";
import type { SourceAdapter } from "../../src/types/sourceAdapter.js";

/**
 * Proves the extensibility requirement from the spec: adding a third source
 * requires no changes outside the new adapter's own file/folder plus a
 * registry entry. This test constructs the registry directly (standing in
 * for adding "third-source" to config/sources.json) and imports zero
 * modified files from src/core, src/canonical, src/adapters/clinic-a, or
 * src/adapters/hospital-b — every import from those paths is identical to
 * the imports used in orchestrator.postgresSources.integration.test.ts.
 *
 * Requires the Clinic A and Hospital B source APIs running and seeded (see
 * orchestrator.postgresSources.integration.test.ts) since clinicAAdapter and
 * hospitalBAdapter now perform real HTTP calls.
 */
describe("orchestrator: extensibility (third source)", () => {
  it("picks up a newly registered third adapter with no core code changes", async () => {
    const registry = new Map<string, SourceAdapter>([
      [clinicAAdapter.id, clinicAAdapter],
      [hospitalBAdapter.id, hospitalBAdapter],
      [thirdSourceAdapter.id, thirdSourceAdapter],
    ]);

    const result = await queryPatientAcrossSources(registry, (sourceId) => {
      if (sourceId === "third-source") return "TS-001";
      if (sourceId === "clinic-a") return "CA-001";
      if (sourceId === "hospital-b") return "HB-HN-22190";
      return undefined;
    });

    expect(result.contributingSources.sort()).toEqual(["clinic-a", "hospital-b", "third-source"]);
    expect(result.failedSources).toHaveLength(0);
    expect(result.patient!.sourceRecords).toHaveLength(3);
  });
});
