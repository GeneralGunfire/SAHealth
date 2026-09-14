/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * Step 4: initial migration, wrapping the exact schema previously applied
 * by hand via schema.sql (now removed — this migration directory is the
 * new single source of truth).
 */
exports.up = (pgm) => {
  pgm.sql(`
-- Clinic A: independently-designed, "modern" simulated source system.
-- Reasonable field names, but deliberately not identical to the canonical
-- model's field names — this is Clinic A's own schema, not a mirror.

CREATE TABLE IF NOT EXISTS patients (
  patient_id       TEXT PRIMARY KEY,          -- source-native id, unrelated to any shared identifier scheme
  national_id      TEXT,                      -- nullable: not every walk-in has one on file
  mrn              TEXT NOT NULL,
  first_name       TEXT NOT NULL,
  last_name        TEXT NOT NULL,
  sex              TEXT NOT NULL CHECK (sex IN ('M', 'F')),
  date_of_birth    DATE NOT NULL,
  mobile           TEXT,
  email            TEXT,
  street           TEXT,
  town             TEXT,
  province         TEXT,
  postal_code      TEXT
);

CREATE TABLE IF NOT EXISTS visits (
  visit_id    TEXT PRIMARY KEY,
  patient_id  TEXT NOT NULL REFERENCES patients(patient_id),
  status      TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
  visit_type  TEXT NOT NULL CHECK (visit_type IN ('OPD', 'IPD', 'ER')),
  started_at  TIMESTAMPTZ NOT NULL,
  ended_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS lab_results (
  result_id     TEXT PRIMARY KEY,
  patient_id    TEXT NOT NULL REFERENCES patients(patient_id),
  status        TEXT NOT NULL CHECK (status IN ('PENDING', 'FINAL', 'CORRECTED')),
  panel         TEXT NOT NULL CHECK (panel IN ('LAB', 'VITALS')),
  test_code     TEXT NOT NULL,
  test_name     TEXT NOT NULL,
  result_at     TIMESTAMPTZ NOT NULL,
  result_value  NUMERIC NOT NULL,
  result_unit   TEXT                          -- nullable: source of the "ambiguous unit" test case
);

CREATE TABLE IF NOT EXISTS medications (
  med_id           TEXT PRIMARY KEY,
  patient_id       TEXT NOT NULL REFERENCES patients(patient_id),
  status           TEXT NOT NULL CHECK (status IN ('CURRENT', 'ENDED', 'STOPPED')),
  medication_text  TEXT NOT NULL,
  started_at       DATE NOT NULL,
  instructions     TEXT NOT NULL
);
`);
};

exports.down = (pgm) => {
  pgm.sql(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
};
