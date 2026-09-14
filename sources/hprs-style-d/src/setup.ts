import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { db } from "./db.js";
import { runMigrations } from "./migrate.js";
import { isValidSaIdNumberFormat } from "./validation.js";
import { encryptSaIdNumber } from "./encryption.js";
import { seedPatients } from "./seedPatients.js";

function setup() {
  const seed = readFileSync(fileURLToPath(new URL("../seed.sql", import.meta.url)), "utf-8");

  runMigrations();

  // Patients are seeded programmatically (not via raw SQL) so sa_id_number
  // can be validated and encrypted before it ever reaches disk.
  const insertPatient = db.prepare(
    `INSERT INTO patients (hprs_uuid, sa_id_number, given_name, family_name, sex, date_of_birth, mobile_number, facility_code)
     VALUES (@hprsUuid, @saIdNumber, @givenName, @familyName, @sex, @dateOfBirth, @mobileNumber, @facilityCode)`
  );

  for (const patient of seedPatients) {
    if (!isValidSaIdNumberFormat(patient.saIdNumber)) {
      throw new Error(`Seed data contains an invalid SA ID number format: "${patient.saIdNumber}"`);
    }
    insertPatient.run({ ...patient, saIdNumber: encryptSaIdNumber(patient.saIdNumber) });
  }

  // Every other table's seed data (visits, diagnoses, medications, the
  // SNOMED code list) contains no sensitive identifiers and is seeded as
  // plain SQL, unchanged.
  db.exec(seed);

  console.log("Source D (HPRS-style, SQLite) database migrated and seeded (sa_id_number encrypted at rest).");
}

setup();
