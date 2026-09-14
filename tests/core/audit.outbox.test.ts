import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pool } from "../../src/db/pool.js";
import { enqueue, fetchUnpublished, publishOutboxRow, recordPublishFailure } from "../../src/core/audit/outbox.js";
import { record, findAuditEventsForPatient } from "../../src/core/audit/auditRepo.js";
import type { AuditEvent } from "../../src/core/audit/auditEvent.schema.js";

const testPatientId = "TEST-OUTBOX-PATIENT";

function makeEvent(overrides: Partial<AuditEvent> = {}): AuditEvent {
  return {
    operation: "patient-query",
    occurredAt: new Date().toISOString(),
    actor: "test-actor",
    patientId: testPatientId,
    outcome: "success",
    purpose: "testing",
    resourceTypes: ["Patient"],
    detail: {
      contributingSources: ["clinic-a"],
      failedSources: [],
      reason: null,
      sourceStatus: [],
      matchingMode: "deterministic",
      probabilisticMatch: null,
    },
    ...overrides,
  };
}

async function cleanUp() {
  await pool.query(`DELETE FROM audit_events WHERE patient_id = $1`, [testPatientId]);
  await pool.query(`DELETE FROM audit_outbox WHERE payload->>'patientId' = $1`, [testPatientId]);
}

describe("audit outbox pattern", () => {
  beforeEach(cleanUp);
  afterEach(cleanUp);

  it("enqueues an event to the outbox immediately, without requiring audit_events to succeed", async () => {
    record(makeEvent());
    // enqueue() is fire-and-forget; give the local insert a moment to land.
    await new Promise((r) => setTimeout(r, 100));

    const { rows } = await pool.query(
      `SELECT * FROM audit_outbox WHERE payload->>'patientId' = $1`,
      [testPatientId]
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].published_at).toBeNull();
  });

  it("simulated transient audit_events unavailability: the outbox still captures the event, and it appears in audit_events once publishing succeeds", async () => {
    enqueue(makeEvent());
    await new Promise((r) => setTimeout(r, 100));

    const unpublished = await fetchUnpublished();
    const ourRow = unpublished.find((r) => r.payload.patientId === testPatientId);
    expect(ourRow).toBeDefined();

    // Simulate a transient failure of the downstream write (e.g. audit_events
    // temporarily unavailable) by forcing publishOutboxRow's insert to fail
    // once, then verify the row survives unpublished with the failure recorded.
    const originalQuery = pool.query.bind(pool);
    let failedOnce = false;
    const querySpy = vi.spyOn(pool, "query").mockImplementation((...args: unknown[]) => {
      const sql = String(args[0]);
      if (!failedOnce && sql.includes("INSERT INTO audit_events")) {
        failedOnce = true;
        return Promise.reject(new Error("simulated transient audit_events unavailability"));
      }
      return (originalQuery as (...a: unknown[]) => unknown)(...args) as Promise<unknown>;
    });

    await expect(publishOutboxRow(ourRow!)).rejects.toThrow("simulated transient audit_events unavailability");
    await recordPublishFailure(ourRow!.id, "simulated transient audit_events unavailability");

    querySpy.mockRestore();

    // Confirm the event is NOT yet in audit_events (the transient failure
    // genuinely prevented publishing) but IS still present, unpublished, in
    // the outbox — nothing was silently lost.
    const stillUnpublished = await fetchUnpublished();
    const stillThere = stillUnpublished.find((r) => r.id === ourRow!.id);
    expect(stillThere).toBeDefined();
    expect(stillThere!.publish_attempts).toBe(1);

    const notYetPublished = await findAuditEventsForPatient(testPatientId);
    expect(notYetPublished).toHaveLength(0);

    // "Audit_events is back" — retry the publish for real, with no failure injected.
    await publishOutboxRow(stillThere!);

    const nowPublished = await findAuditEventsForPatient(testPatientId);
    expect(nowPublished).toHaveLength(1);
    expect(nowPublished[0].outcome).toBe("success");

    const finalUnpublished = await fetchUnpublished();
    expect(finalUnpublished.find((r) => r.id === ourRow!.id)).toBeUndefined();
  });
});
