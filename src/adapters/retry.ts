import { classifySourceFailure, type SourceFailureReason } from "../core/sourceFailureReason.js";
import { logger } from "../core/logger.js";

/**
 * Transient-failure retry for adapter source calls (Step 2).
 *
 * Scope: the adapter layer only. This wraps an adapter's fetchPatient call so
 * a brief blip reaching a source — a dropped connection, a connect timeout —
 * is retried before it ever reaches the orchestrator. It deliberately does
 * NOT touch the orchestrator's failure-isolation logic, the honest-disclosure
 * /healthz reporting, or how a failure is finally classified: if every
 * attempt fails, the last error is rethrown unchanged, so downstream code
 * sees exactly the error it would have seen before this existed — just later.
 *
 * Only genuinely transient reasons are retried. An auth failure or an
 * invalid/unusable response is a deterministic "no" from the source: retrying
 * it would add latency, repeat a rejected request, and change nothing, so
 * those fail fast with zero retries exactly as today.
 */
const RETRYABLE_REASONS: ReadonlySet<SourceFailureReason> = new Set<SourceFailureReason>([
  "timeout",
  "connection-refused",
]);

/** Delays before retry attempts 2 and 3. Length also defines the retry count. */
const BACKOFF_MS = [200, 800] as const;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs `operation`, retrying only transient failures with exponential backoff
 * (200ms, then 800ms) for up to 2 additional attempts — 3 total.
 *
 * `sourceId` is used for log attribution only.
 */
export async function withTransientRetry<T>(
  sourceId: string,
  operation: () => Promise<T>,
  // Injectable for tests, so a retry test doesn't have to wait ~1s of real backoff.
  delays: readonly number[] = BACKOFF_MS
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const result = await operation();
      if (attempt > 0) {
        logger.info("Source call succeeded after a transient failure was retried.", {
          sourceId,
          attempts: attempt + 1,
        });
      }
      return result;
    } catch (err) {
      lastError = err;
      const reason = classifySourceFailure(err);

      // Non-transient (auth-failure, invalid-response, unknown): fail fast,
      // with the original error untouched for the existing classifier.
      if (!RETRYABLE_REASONS.has(reason)) {
        throw err;
      }
      // Out of attempts — rethrow so failure isolation/classification and
      // honest disclosure behave exactly as they did before retries existed.
      if (attempt === delays.length) {
        logger.warn("Source call still failing after retries; handing off to failure isolation.", {
          sourceId,
          classifiedReason: reason,
          attempts: attempt + 1,
        });
        throw err;
      }

      logger.warn("Transient source failure; retrying after backoff.", {
        sourceId,
        classifiedReason: reason,
        attempt: attempt + 1,
        retryInMs: delays[attempt],
      });
      await sleep(delays[attempt]);
    }
  }

  // Unreachable: the loop either returns or throws.
  throw lastError;
}
