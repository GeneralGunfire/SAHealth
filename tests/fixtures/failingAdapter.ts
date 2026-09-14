import type { SourceAdapter } from "../../src/types/sourceAdapter.js";

/**
 * Test-only failing-adapter factory (Phase 3, Step 3): simulates a source
 * being unreachable for automated tests, without any new production
 * mechanism — matches the existing `broken-source` test-double pattern
 * already used in tests/integration/orchestrator.postgresSources.integration.test.ts
 * and tests/core/audit.recordAccess.test.ts.
 *
 * Real Expo-demo offline simulation is done by literally stopping one
 * source's process (see README/demo notes) — this fixture exists purely so
 * the same honesty guarantee can be asserted deterministically in CI.
 */
export function makeFailingAdapter(sourceId: string, error: Error): SourceAdapter {
  return {
    id: sourceId,
    displayName: `${sourceId} (test-only simulated failure)`,
    async fetchPatient() {
      throw error;
    },
    translate() {
      throw new Error("should not be called");
    },
  };
}

/** A connection-refused-shaped error, matching what Node's fetch throws when a port has nothing listening. */
export function connectionRefusedError(): Error {
  const err = new Error("fetch failed");
  (err as Error & { cause?: unknown }).cause = { code: "ECONNREFUSED" };
  return err;
}

/** A timeout-shaped error. */
export function timeoutError(): Error {
  return new Error("The operation timed out");
}

/** An auth-failure-shaped error, matching the message adapters throw for a non-2xx response. */
export function authFailureError(sourceLabel: string): Error {
  return new Error(`${sourceLabel} API returned 401 Unauthorized`);
}
