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
  return setInterval(async () => {
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
  }, intervalMs);
}
