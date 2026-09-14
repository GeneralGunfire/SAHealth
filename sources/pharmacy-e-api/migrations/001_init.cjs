/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * Step 4: initial migration, wrapping the exact schema previously applied
 * by hand via schema.sql (now removed — this migration directory is the
 * new single source of truth).
 */
exports.up = (pgm) => {
  pgm.sql(`
-- Pharmacy E: a dispensing feed, deliberately NOT an EMR/encounter system.
-- No encounters or observations exist here at all — a patient has
-- demographics and a list of dispensed prescriptions, full stop. Dates are
-- stored as pharmacy-style "DD-MMM-YYYY" text, and drug_code is nullable
-- (OTC items are sometimes dispensed with no formulary code on file).

CREATE TABLE IF NOT EXISTS patients (
  pid           TEXT PRIMARY KEY,
  surname       TEXT NOT NULL,
  given_name    TEXT NOT NULL,
  dob           TEXT NOT NULL,          -- "DD-MMM-YYYY"
  sex           TEXT NOT NULL CHECK (sex IN ('M', 'F')),
  cell          TEXT,
  national_id   TEXT                    -- nullable: not every patient has a synthetic national id on file
);

CREATE TABLE IF NOT EXISTS dispensing_records (
  rx_id         TEXT PRIMARY KEY,
  pid           TEXT NOT NULL REFERENCES patients(pid),
  drug_code     TEXT,                   -- nullable: OTC items sometimes dispensed with no code
  drug_name     TEXT NOT NULL,
  qty_dispensed NUMERIC NOT NULL,
  days_supply   NUMERIC NOT NULL,
  sig           TEXT NOT NULL,          -- clinician-facing dosing instruction, e.g. "1 tab nocte"
  date_dispensed TEXT NOT NULL,         -- "DD-MMM-YYYY"
  rx_status     TEXT NOT NULL CHECK (rx_status IN ('DISP', 'CANC'))
);
`);
};

exports.down = (pgm) => {
  pgm.sql(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
};
