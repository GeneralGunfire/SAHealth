import { logger } from "../logger.js";
import { fetchUnpublished, publishOutboxRow, recordPublishFailure } from "./outbox.js";

/**
 * Observability-only state (Step 2, /healthz): when the publisher last
 * completed a tick without its own fetch step failing (individual row
 * publish failures don't count against this — those are expected/retried
 * transient failures the publisher already handles; a tick only fails to
 * "succeed" here if it couldn't even fetch the unpublished rows at all).
 * Purely additive — read by src/api/routes/health.ts, never written to or
 * read by the publishing logic itself, so this cannot change publish
 * behaviour in any way.
 */
let lastSuccessfulRunAt: string | null = null;

export function getOutboxPublisherLastSuccessfulRunAt(): string | null {
  return lastSuccessfulRunAt;
}

/**
 * Background outbox publisher (Step 3): a lightweight setInterval loop, no
 * message-queue system needed at this scale. Periodically drains
 * unpublished audit_outbox rows into audit_events. A row that fails to
 * publish (e.g. because audit_events is transiently unavailable) is left
 * unpublished with its failure recorded — it is retried on the next tick
 * rather than lost.
 */
export function startOutboxPublisher(intervalMs = 2000): NodeJS.Timeout {
  const tick = async (): Promise<void> => {
    let rows;
    try {
      rows = await fetchUnpublished();
      lastSuccessfulRunAt = new Date().toISOString();
    } catch (err) {
      logger.error("Outbox publisher failed to fetch unpublished rows; will retry next tick.", {
        reason: err instanceof Error ? err.message : String(err),
      });
      return;
    }

    for (const row of rows) {
      try {
        await publishOutboxRow(row);
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        logger.error("Outbox publisher failed to publish an audit event; left unpublished for retry.", {
          outboxId: row.id,
          reason,
        });
        await recordPublishFailure(row.id, reason).catch(() => {
          // Even the failure-bookkeeping write failing is not fatal — the
          // row simply remains unpublished and is retried next tick either way.
        });
      }
    }
  };

  const timer = setInterval(() => {
    // Track the in-flight tick so a graceful shutdown can await it rather
    // than tearing the pool out from under a half-finished publish. Publish
    // semantics are unchanged: a tick still never throws out of here, and a
    // row that doesn't publish stays unpublished for the next tick.
    inFlightTick = tick().finally(() => {
      inFlightTick = null;
    });
  }, intervalMs);

  activeTimer = timer;
  return timer;
}

/**
 * Shutdown-only state (graceful shutdown). `inFlightTick` is the currently
 * running tick's promise, if any. Read only by stopOutboxPublisher() — the
 * publishing logic itself never branches on it, so this cannot change what
 * or when anything publishes.
 */
let inFlightTick: Promise<void> | null = null;
let activeTimer: NodeJS.Timeout | null = null;

/**
 * Stops the publisher's interval and waits for an in-progress publish attempt
 * to finish, so a graceful shutdown doesn't close the DB pool mid-publish.
 * Safe to call when the publisher was never started or is already stopped.
 */
export async function stopOutboxPublisher(timer?: NodeJS.Timeout): Promise<void> {
  const toClear = timer ?? activeTimer;
  if (toClear) {
    clearInterval(toClear);
  }
  if (toClear === activeTimer) {
    activeTimer = null;
  }
  if (inFlightTick) {
    // A tick never rejects (every await inside is guarded), but catch anyway:
    // shutdown must not fail because of a publish that was already tolerated.
    await inFlightTick.catch(() => {});
  }
}
