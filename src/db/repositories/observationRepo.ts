import type { CanonicalObservation } from "../../canonical/index.js";
import { pool } from "../pool.js";

export async function upsertObservation(observation: CanonicalObservation): Promise<void> {
  await pool.query(
    `INSERT INTO observations
      (id, status, category, code_system, code, code_display, subject_patient_id,
       effective_at, value_amount, value_unit, source_id, source_record_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       value_amount = EXCLUDED.value_amount,
       value_unit = EXCLUDED.value_unit`,
    [
      observation.id,
      observation.status,
      observation.category,
      observation.code.system,
      observation.code.code,
      observation.code.display,
      observation.subject.id,
      observation.effectiveDateTime,
      observation.value.value,
      observation.value.unit,
      observation.sourceRecord.sourceId,
      observation.sourceRecord.sourceRecordId,
    ]
  );
}
