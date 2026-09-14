import { pool } from "../../db/pool.js";
import { enqueue } from "./outbox.js";
import type { AuditEvent, AuditEventInput } from "./auditEvent.schema.js";

/**
 * Fire-and-forget audit write, now via the outbox pattern (Step 3): the
 * event is enqueued to audit_outbox (a fast, always-available local
 * insert) rather than written directly to audit_events. A background
 * publisher (outboxPublisher.ts) moves it into audit_events shortly after.
 * This is the only function the rest of the consent/audit layer should
 * call — callers are unaffected by this change; enqueueing still never
 * throws into the request path.
 *
 * Accepts the input (pre-defaults) shape: callers that have no
 * sourceStatus to report (token issuance, validation failures, audit-trail
 * reads) may omit it, since only patient-query events populate it.
 */
export function record(event: AuditEventInput): void {
  enqueue({ ...event, detail: { sourceStatus: [], ...event.detail } } as AuditEvent);
}

export interface AuditRow extends AuditEvent {
  id: string;
}

/**
 * Read-only retrieval for the audit-trail endpoint. Itself audited by the
 * caller. Reads only from audit_events (published events) — an event still
 * sitting in the outbox, not yet published, is not visible here until the
 * background publisher moves it, which is expected latency for this
 * pattern (typically under the publisher's poll interval).
 */
export async function findAuditEventsForPatient(patientId: string): Promise<AuditRow[]> {
  const { rows } = await pool.query(
    `SELECT id, operation, occurred_at AS "occurredAt", actor, patient_id AS "patientId",
            outcome, purpose, resource_types AS "resourceTypes", detail
     FROM audit_events
     WHERE patient_id = $1
     ORDER BY occurred_at ASC`,
    [patientId]
  );
  return rows;
}
