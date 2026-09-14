import { pool } from "../../db/pool.js";
import { logger } from "../logger.js";
import type { AuditEvent } from "./auditEvent.schema.js";

/**
 * Outbox pattern (Step 3): writes an audit event to a local, always-fast
 * outbox table rather than attempting the audit_events write directly from
 * the request path. A separate background publisher (outboxPublisher.ts)
 * later moves each row into audit_events. This guarantees no audit event is
 * silently lost if that downstream write is transiently unavailable — the
 * event survives in the outbox until it succeeds, rather than being logged
 * and dropped.
 *
 * Still fire-and-forget from the caller's perspective: enqueuing is a
 * single fast local insert, and any failure to even enqueue is logged
 * rather than thrown, so a query/token response is never blocked or
 * failed by audit plumbing.
 */
export function enqueue(event: AuditEvent): void {
  pool
    .query(`INSERT INTO audit_outbox (payload) VALUES ($1)`, [JSON.stringify(event)])
    .catch((err) => {
      logger.error("Failed to enqueue audit event to outbox (query/token processing was not affected).", {
        operation: event.operation,
        reason: err instanceof Error ? err.message : String(err),
      });
    });
}

export interface OutboxRow {
  id: number;
  payload: AuditEvent;
  publish_attempts: number;
}

/** Fetches a batch of unpublished outbox rows, oldest first. */
export async function fetchUnpublished(limit = 50): Promise<OutboxRow[]> {
  const { rows } = await pool.query(
    `SELECT id, payload, publish_attempts FROM audit_outbox
     WHERE published_at IS NULL
     ORDER BY id ASC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

/** Writes one outbox row's payload into audit_events and marks the row published. */
export async function publishOutboxRow(row: OutboxRow): Promise<void> {
  const event = row.payload;
  await pool.query("BEGIN");
  try {
    await pool.query(
      `INSERT INTO audit_events
        (operation, occurred_at, actor, patient_id, outcome, purpose, resource_types, detail)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        event.operation,
        event.occurredAt,
        event.actor,
        event.patientId,
        event.outcome,
        event.purpose,
        JSON.stringify(event.resourceTypes),
        JSON.stringify(event.detail),
      ]
    );
    await pool.query(`UPDATE audit_outbox SET published_at = now() WHERE id = $1`, [row.id]);
    await pool.query("COMMIT");
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
}

/** Records a failed publish attempt against an outbox row without losing it. */
export async function recordPublishFailure(rowId: number, reason: string): Promise<void> {
  await pool.query(
    `UPDATE audit_outbox SET publish_attempts = publish_attempts + 1, last_error = $2 WHERE id = $1`,
    [rowId, reason]
  );
}
