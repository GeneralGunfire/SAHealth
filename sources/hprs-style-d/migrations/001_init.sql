-- Source D: HPRS-style national system pattern, backed by SQLite (not
-- Postgres) to prove the adapter pattern is storage-engine-agnostic. Models
-- a national registry archetype: HPRS-style UUID primary key, South African
-- ID number format validation (13 digits) enforced at write time, a small
-- fixed SNOMED CT-style diagnosis code list, and stricter required-field
-- validation than the other three sources (no optional demographic fields).

CREATE TABLE IF NOT EXISTS patients (
  hprs_uuid       TEXT PRIMARY KEY,       -- simulated HPRS-style UUID
  sa_id_number    TEXT NOT NULL UNIQUE,   -- 13-digit SA ID number, validated at write time (see setup.ts)
  given_name      TEXT NOT NULL,
  family_name     TEXT NOT NULL,
  sex             TEXT NOT NULL CHECK (sex IN ('M', 'F')),
  date_of_birth   TEXT NOT NULL,          -- ISO "YYYY-MM-DD"; stricter source, always well-formed
  mobile_number   TEXT NOT NULL,          -- required here, unlike the other three sources
  facility_code   TEXT NOT NULL           -- registering facility, HPRS-style
);

CREATE TABLE IF NOT EXISTS visits (
  visit_uuid      TEXT PRIMARY KEY,
  hprs_uuid       TEXT NOT NULL REFERENCES patients(hprs_uuid),
  visit_status    TEXT NOT NULL CHECK (visit_status IN ('OPEN', 'CLOSED')),
  visit_date      TEXT NOT NULL           -- ISO "YYYY-MM-DD"
);

CREATE TABLE IF NOT EXISTS diagnoses (
  diagnosis_uuid  TEXT PRIMARY KEY,
  visit_uuid      TEXT NOT NULL REFERENCES visits(visit_uuid),
  snomed_code     TEXT NOT NULL,          -- from the small fixed code list below
  snomed_display  TEXT NOT NULL,
  recorded_date   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS medication_records (
  med_uuid        TEXT PRIMARY KEY,
  hprs_uuid       TEXT NOT NULL REFERENCES patients(hprs_uuid),
  status          TEXT NOT NULL CHECK (status IN ('ACTIVE', 'ENDED')),
  medication_code TEXT NOT NULL,          -- fixed local formulary code, always coded (stricter source)
  medication_name TEXT NOT NULL,
  dosage_text     TEXT NOT NULL,
  prescribed_date TEXT NOT NULL
);

-- Small fixed SNOMED CT-style code list, per the spec ("not the full
-- terminology"). Referenced informally by diagnoses.snomed_code — kept as
-- a lookup table for clarity, not enforced via foreign key since a real
-- HPRS-style system would validate against a much larger external
-- terminology service, not a local table.
CREATE TABLE IF NOT EXISTS snomed_code_list (
  code    TEXT PRIMARY KEY,
  display TEXT NOT NULL
);
