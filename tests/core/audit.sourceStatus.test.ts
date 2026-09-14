import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { pool } from "../../src/db/pool.js";
import { enqueue, fetchUnpublished, publishOutboxRow } from "../../src/core/audit/outbox.js";
import { findAuditEventsForPatient } from "../../src/core/audit/auditRepo.js";
import type { AuditEvent } from "../../src/core/audit/auditEvent.schema.js";

/**
 * Confirms Step 4's requirement end-to-end through the real database: a
 * query's per-source status block, once recorded via the existing outbox
 * mechanism, is genuinely retrievable afterward through the same
 * findAuditEventsForPatient function the /audit-trail route uses — i.e.
 * "which sources were up/down for this specific historical query" survives
 * the full record -> outbox -> publish -> read round trip, not just an
 * in-memory assertion against a mocked record() call.
 */
const testPatientId = "TEST-SOURCE-STATUS-PATIENT";

function partialFailureEvent(): AuditEvent {
  return {
    operation: "patient-query",
    occurredAt: new Date().toISOString(),
    actor: "test-actor",
    patientId: testPatientId,
    outcome: "partial-success",
    purpose: "testing",
    resourceTypes: ["Patient", "Encounter", "Observation", "MedicationStatement"],
    detail: {
      contributingSources: ["clinic-a"],
      failedSources: [{ sourceId: "hospital-b", reason: "fetch failed" }],
      reason: null,
      sourceStatus: [
        {
          sourceId: "clinic-a",
          displayName: "Clinic A (simulated local clinic system)",
          queried: true,
          reachable: true,
          responseTimeMs: 42,
          queriedAt: new Date().toISOString(),
          reason: null,
        },
        {
          sourceId: "hospital-b",
          displayName: "Hospital B (simulated tertiary hospital system)",
          queried: true,
          reachable: false,
          responseTimeMs: 15,
          queriedAt: new Date().toISOString(),
          reason: "connection-refused",
        },
      ],
      matchingMode: "deterministic",
      probabilisticMatch: null,
    },
  };
}

async function cleanUp() {
  await pool.query(`DELETE FROM audit_events WHERE patient_id = $1`, [testPatientId]);
  await pool.query(`DELETE FROM audit_outbox WHERE payload->>'patientId' = $1`, [testPatientId]);
}

describe("audit trail retrievability of per-source status (Phase 3, Step 4)", () => {
  beforeEach(cleanUp);
  afterEach(cleanUp);

  it("a partial-failure query's sourceStatus survives enqueue -> publish -> read and is retrievable via the audit-trail lookup", async () => {
    enqueue(partialFailureEvent());
    await new Promise((r) => setTimeout(r, 100));

    const unpublished = await fetchUnpublished();
    const ourRow = unpublished.find((r) => r.payload.patientId === testPatientId);
    expect(ourRow).toBeDefined();

    await publishOutboxRow(ourRow!);

    const events = await findAuditEventsForPatient(testPatientId);
    expect(events).toHaveLength(1);

    const [event] = events;
    expect(event.outcome).toBe("partial-success");
    expect(event.detail.sourceStatus).toHaveLength(2);

    const clinicAStatus = event.detail.sourceStatus.find((s) => s.sourceId === "clinic-a");
    const hospitalBStatus = event.detail.sourceStatus.find((s) => s.sourceId === "hospital-b");

    expect(clinicAStatus).toMatchObject({ reachable: true, reason: null });
    expect(hospitalBStatus).toMatchObject({ reachable: false, reason: "connection-refused" });
  });
});
