import type { CanonicalEncounter } from "../../canonical/index.js";
import { pool } from "../pool.js";

export async function upsertEncounter(encounter: CanonicalEncounter): Promise<void> {
  await pool.query(
    `INSERT INTO encounters
      (id, status, class, subject_patient_id, period_start, period_end, source_id, source_record_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       class = EXCLUDED.class,
       period_start = EXCLUDED.period_start,
       period_end = EXCLUDED.period_end`,
    [
      encounter.id,
      encounter.status,
      encounter.class,
      encounter.subject.id,
      encounter.period.start,
      encounter.period.end,
      encounter.sourceRecord.sourceId,
      encounter.sourceRecord.sourceRecordId,
    ]
  );
}
