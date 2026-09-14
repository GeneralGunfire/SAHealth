import { describe, expect, it } from "vitest";
import { checkSources } from "../../src/api/routes/health.js";

/**
 * Step 2 verification. The live-backend tests require the real backend
 * running on BACKEND_PORT (default 3010) with Postgres and the five source
 * APIs up, same as the other integration tests in this folder.
 */
const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT ?? 3010}`;

describe("/health — basic liveness", () => {
  it("always returns fast with no dependency checks", async () => {
    const startedAt = performance.now();
    const response = await fetch(`${BACKEND_URL}/health`);
    const elapsedMs = performance.now() - startedAt;

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok" });
    // "Fast" here means "did not wait on any real dependency" — a generous
    // upper bound well below what even one DB round trip plus five source
    // probes would take, to catch a regression where /health accidentally
    // grew a dependency check.
    expect(elapsedMs).toBeLessThan(500);
  });
});

describe("/healthz — deep readiness with honest partial-outage reporting", () => {
  it("reports all five sources reachable and the database reachable when everything is up", async () => {
    const response = await fetch(`${BACKEND_URL}/healthz`);
    expect(response.status).toBe(200);

    const body = (await response.json()) as {
      status: string;
      components: {
        database: { reachable: boolean };
        sources: { sourceId: string; reachable: boolean }[];
        outboxPublisher: { lastSuccessfulRunAt: string | null };
        probabilisticMatchingSidecar: { reachable: boolean };
      };
    };

    expect(body.status).toBe("ok"); // this endpoint answered — see components for actual health
    expect(body.components.database.reachable).toBe(true);
    expect(body.components.sources).toHaveLength(5);
    expect(body.components.sources.every((s) => s.reachable)).toBe(true);
    // The outbox publisher runs on a 2s interval from process start; by the
    // time integration tests run against an already-up backend it should
    // have completed at least one tick.
    expect(body.components.outboxPublisher.lastSuccessfulRunAt).not.toBeNull();
  });

  it("correctly reports a simulated partial outage — 200 with a per-component breakdown, never collapsed into a single boolean", async () => {
    // Exercises the SAME reachability-probe function /healthz actually uses
    // (checkSources), against a source list with one deliberately
    // unreachable entry, rather than mutating the live
    // src/config/sources.json file on disk (which would risk leaving it
    // corrupted if this test failed mid-write).
    const results = await checkSources([
      { id: "clinic-a", connection: { baseUrl: "http://localhost:4001" } },
      { id: "hospital-b", connection: { baseUrl: "http://localhost:59999" } }, // nothing listening here
      { id: "dhis2-style-c", connection: { baseUrl: "http://localhost:4003" } },
      { id: "hprs-style-d", connection: { baseUrl: "http://localhost:4004" } },
      { id: "pharmacy-e", connection: { baseUrl: "http://localhost:4005" } },
    ]);

    expect(results).toHaveLength(5);

    const hospitalBStatus = results.find((s) => s.sourceId === "hospital-b");
    expect(hospitalBStatus?.reachable).toBe(false);
    expect(hospitalBStatus?.reason).toBe("connection-refused");

    // The other four sources are unaffected — this is a per-component
    // breakdown, not a single "healthy: false" collapse.
    const otherSources = results.filter((s) => s.sourceId !== "hospital-b");
    expect(otherSources.every((s) => s.reachable)).toBe(true);
  });

  it("live end-to-end: the running backend's own /healthz reflects the real five-source config accurately", async () => {
    // Complements the unit-level test above by confirming the real HTTP
    // route (not just the underlying function in isolation) produces a
    // correctly-shaped response against the actual running five-source setup.
    const response = await fetch(`${BACKEND_URL}/healthz`);
    const body = (await response.json()) as {
      components: { sources: { sourceId: string }[] };
    };
    const sourceIds = body.components.sources.map((s) => s.sourceId).sort();
    expect(sourceIds).toEqual(["clinic-a", "dhis2-style-c", "hospital-b", "hprs-style-d", "pharmacy-e"]);
  });
});
