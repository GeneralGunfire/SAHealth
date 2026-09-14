import type { CanonicalPatient } from "../../canonical/index.js";
import { pool } from "../pool.js";

export async function upsertPatient(patient: CanonicalPatient): Promise<void> {
  await pool.query(
    `INSERT INTO patients
      (id, identifiers, given_names, family_name, gender, birth_date, phone, email,
       address_line, address_city, address_province, address_postcode, source_records, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, now())
     ON CONFLICT (id) DO UPDATE SET
       identifiers = EXCLUDED.identifiers,
       given_names = EXCLUDED.given_names,
       family_name = EXCLUDED.family_name,
       gender = EXCLUDED.gender,
       birth_date = EXCLUDED.birth_date,
       phone = EXCLUDED.phone,
       email = EXCLUDED.email,
       address_line = EXCLUDED.address_line,
       address_city = EXCLUDED.address_city,
       address_province = EXCLUDED.address_province,
       address_postcode = EXCLUDED.address_postcode,
       source_records = EXCLUDED.source_records,
       updated_at = now()`,
    [
      patient.id,
      JSON.stringify(patient.identifiers),
      patient.name.given,
      patient.name.family,
      patient.gender,
      patient.birthDate,
      patient.contact.phone,
      patient.contact.email,
      patient.address.line,
      patient.address.city,
      patient.address.province,
      patient.address.postalCode,
      JSON.stringify(patient.sourceRecords),
    ]
  );
}
