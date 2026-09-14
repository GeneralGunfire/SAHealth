/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * Step 4: initial migration, wrapping the exact schema previously applied
 * by hand via schema.sql (now removed — this migration directory is the
 * new single source of truth).
 */
exports.up = (pgm) => {
  pgm.sql(`
-- Hospital B: independently-designed, deliberately legacy-shaped simulated
-- source system. Abbreviated/internal field names, surname/initials split,
-- a pure auto-incrementing internal id unrelated to any shared identifier
-- scheme, and inconsistent free-text date formats across rows (a real
-- legacy-system quirk, not a bug to fix here).

CREATE TABLE IF NOT EXISTS pat_master (
  pat_seq     SERIAL PRIMARY KEY,             -- internal auto-increment only; no relation to nat_id_no
  nat_id_no   TEXT,                           -- nullable, inconsistently populated (added late to this legacy system)
  hosp_no     TEXT NOT NULL,
  surname     TEXT NOT NULL,
  initials    TEXT NOT NULL,                  -- e.g. "T.A." instead of a clean given-name field
  sex_cd      CHAR(1) NOT NULL CHECK (sex_cd IN ('1', '2', '9')),
  pat_dob     TEXT NOT NULL,                  -- free text, inconsistent format across rows by design
  mobile_no   TEXT,
  email_addr  TEXT,
  addr_line   TEXT,
  suburb_txt  TEXT,
  region_txt  TEXT,
  post_cd     TEXT
);

CREATE TABLE IF NOT EXISTS admissions (
  adm_seq     SERIAL PRIMARY KEY,
  pat_seq     INT NOT NULL REFERENCES pat_master(pat_seq),
  adm_status  TEXT NOT NULL CHECK (adm_status IN ('ACTIVE', 'DISCHARGED', 'CANCELLED')),
  care_lvl    TEXT NOT NULL CHECK (care_lvl IN ('OUTPATIENT', 'INPATIENT', 'EMERGENCY', 'TELEHEALTH')),
  adm_dt      TEXT NOT NULL,                  -- free text, inconsistent format across rows by design
  dis_dt      TEXT
);

CREATE TABLE IF NOT EXISTS obs_tbl (
  obs_seq    SERIAL PRIMARY KEY,
  pat_seq    INT NOT NULL REFERENCES pat_master(pat_seq),
  obs_status TEXT NOT NULL CHECK (obs_status IN ('DRAFT', 'FINAL', 'AMENDED')),
  domain_cd  TEXT NOT NULL CHECK (domain_cd IN ('PATHOLOGY', 'VITALS')),
  loc_code   TEXT NOT NULL,
  obs_desc   TEXT NOT NULL,
  obs_dt     TEXT NOT NULL,                   -- free text, inconsistent format across rows by design
  obs_amt    NUMERIC NOT NULL,
  obs_units  TEXT                             -- nullable: source of the "ambiguous unit" test case
);

CREATE TABLE IF NOT EXISTS rx_tbl (
  rx_seq        SERIAL PRIMARY KEY,
  pat_seq       INT NOT NULL REFERENCES pat_master(pat_seq),
  rx_status     TEXT NOT NULL CHECK (rx_status IN ('ONGOING', 'DISCONTINUED', 'COMPLETE')),
  formulary_cd  TEXT,
  formulary_txt TEXT,
  free_txt      TEXT,
  rx_dt         TEXT NOT NULL,                -- free text, inconsistent format across rows by design
  dosage_txt    TEXT NOT NULL
);
`);
};

exports.down = (pgm) => {
  pgm.sql(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
};
