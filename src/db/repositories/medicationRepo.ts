import type { CanonicalMedicationStatement } from "../../canonical/index.js";
import { pool } from "../pool.js";

export async function upsertMedicationStatement(medication: CanonicalMedicationStatement): Promise<void> {
  await pool.query(
    `INSERT INTO medication_statements
      (id, status, medication, subject_patient_id, effective_at, dosage_text, source_id, source_record_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       status = EXCLUDED.status,
       medication = EXCLUDED.medication,
       dosage_text = EXCLUDED.dosage_text`,
    [
      medication.id,
      medication.status,
      JSON.stringify(medication.medication),
      medication.subject.id,
      medication.effectiveDateTime,
      medication.dosageText,
      medication.sourceRecord.sourceId,
      medication.sourceRecord.sourceRecordId,
    ]
  );
}
