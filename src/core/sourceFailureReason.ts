import { ZodError } from "zod";

/**
 * Classification of why a source was unreachable/failed for a specific
 * query, per Backend_Research.docx Section 5.2's honest-disclosure
 * requirement. Reuses Phase 1's existing failure-isolation mechanism (the
 * try/catch around each adapter's fetchPatient/translate call in
 * orchestrator.ts) — this module only classifies the error that mechanism
 * already catches; it does not add a new failure-handling path.
 */
export type SourceFailureReason =
  | "timeout"
  | "connection-refused"
  | "auth-failure"
  | "invalid-response"
  | "unknown";

/**
 * Classifies a caught error from an adapter's fetchPatient/translate call.
 * Adapters in this project reach their source over plain `fetch()` (see
 * each adapter's index.ts under src/adapters/), so the error shapes below
 * are what Node's fetch/undici implementation and this project's own
 * adapters actually throw — not a speculative general-purpose classifier.
 */
export function classifySourceFailure(err: unknown): SourceFailureReason {
  if (err instanceof ZodError) {
    return "invalid-response";
  }

  const message = err instanceof Error ? err.message : String(err);
  const cause = err instanceof Error ? (err.cause as { code?: string } | undefined) : undefined;
  const code = cause?.code;

  if (code === "ECONNREFUSED" || message.includes("ECONNREFUSED") || message.includes("fetch failed")) {
    return "connection-refused";
  }
  if (
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "ETIMEDOUT" ||
    message.toLowerCase().includes("timeout") ||
    message.toLowerCase().includes("timed out")
  ) {
    return "timeout";
  }
  if (message.includes(" 401 ") || message.includes(" 403 ") || message.toLowerCase().includes("unauthorized")) {
    return "auth-failure";
  }
  // Adapters throw `Error("<Source> API returned <status> <statusText>")`
  // for any non-2xx, non-404 HTTP response (see src/adapters/*/index.ts) —
  // anything reaching here that isn't a connection/timeout/auth failure is
  // the source responding but with something the adapter/orchestrator
  // could not use (a bad status, or a body that failed canonical validation).
  if (message.includes("API returned")) {
    return "invalid-response";
  }

  return "unknown";
}
