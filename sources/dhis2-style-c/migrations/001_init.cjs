/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * Step 4: initial migration, wrapping the exact schema previously applied
 * by hand via schema.sql (now removed — this migration directory is the
 * new single source of truth).
 */
exports.up = (pgm) => {
  pgm.sql(`
-- Source C: DHIS2-style public-sector tracker system.
-- Deliberately NOT a "patient + related records" shape like Clinic A/Hospital B.
-- Real DHIS2 stores an org-unit hierarchy, tracked entities enrolled in
-- programs, and program-stage events whose clinical content is a set of
-- loose data-element key/value pairs rather than fixed columns. This forces
-- the adapter to do genuine structural translation, not just field renaming.

CREATE TABLE IF NOT EXISTS org_units (
  org_unit_uid   TEXT PRIMARY KEY,       -- DHIS2-style 11-char UID, simulated here as short codes
  name           TEXT NOT NULL,
  level          TEXT NOT NULL CHECK (level IN ('facility', 'sub-district', 'district', 'province')),
  parent_uid     TEXT REFERENCES org_units(org_unit_uid)
);

-- The "tracked entity instance" — a person enrolled in the system, identified
-- structurally differently from every other source (no single identifiers
-- array or object; core demographic attributes live as tracked-entity
-- attribute values, matching DHIS2's actual attribute-value model).
CREATE TABLE IF NOT EXISTS tracked_entities (
  tei_uid        TEXT PRIMARY KEY,       -- DHIS2-style UID
  org_unit_uid   TEXT NOT NULL REFERENCES org_units(org_unit_uid),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attribute values for a tracked entity: DHIS2 models every demographic
-- field (name, DOB, national id, sex, phone) as a generic attribute-value
-- row keyed by a fixed attribute code, not as dedicated columns.
CREATE TABLE IF NOT EXISTS tracked_entity_attributes (
  tei_uid         TEXT NOT NULL REFERENCES tracked_entities(tei_uid),
  attribute_code  TEXT NOT NULL,  -- e.g. 'firstName', 'lastName', 'nationalId', 'sex', 'dob', 'phone'
  value           TEXT,           -- nullable: not every attribute is captured for every person
  PRIMARY KEY (tei_uid, attribute_code)
);

-- A program enrolment: this person is enrolled in a named program (e.g.
-- "Maternal Health", "Immunization Tracker") at a point in time.
CREATE TABLE IF NOT EXISTS enrollments (
  enrollment_uid TEXT PRIMARY KEY,
  tei_uid        TEXT NOT NULL REFERENCES tracked_entities(tei_uid),
  program_code   TEXT NOT NULL,   -- e.g. 'MATERNAL_HEALTH', 'IMMUNIZATION'
  org_unit_uid   TEXT NOT NULL REFERENCES org_units(org_unit_uid),
  status         TEXT NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
  enrollment_date TEXT NOT NULL   -- DHIS2 dates are plain "YYYY-MM-DD" strings, no time/zone
);

-- A program-stage event: one visit/encounter under an enrollment. The
-- clinical content of the event lives in event_data_values, not here —
-- this table only carries the encounter-shaped metadata.
CREATE TABLE IF NOT EXISTS events (
  event_uid       TEXT PRIMARY KEY,
  enrollment_uid  TEXT NOT NULL REFERENCES enrollments(enrollment_uid),
  program_stage   TEXT NOT NULL,  -- e.g. 'ANC_VISIT', 'IMMUNIZATION_DOSE', 'LAB_STAGE'
  org_unit_uid    TEXT NOT NULL REFERENCES org_units(org_unit_uid),
  status          TEXT NOT NULL CHECK (status IN ('ACTIVE', 'COMPLETED', 'SKIPPED', 'SCHEDULE')),
  event_date      TEXT NOT NULL   -- plain "YYYY-MM-DD", no time/zone
);

-- Data element values for one event: DHIS2's actual clinical-data shape —
-- loose key/value pairs, not fixed columns. A "GLU" (glucose) data element
-- may or may not carry an explicit unit in a separate data element, which
-- is exactly the ambiguous-unit situation this project already models.
CREATE TABLE IF NOT EXISTS event_data_values (
  event_uid          TEXT NOT NULL REFERENCES events(event_uid),
  data_element_code  TEXT NOT NULL, -- e.g. 'DIAGNOSIS_CODE', 'GLUCOSE_VALUE', 'GLUCOSE_UNIT', 'MEDICATION_TEXT'
  value              TEXT,          -- nullable: not every event captures every data element
  PRIMARY KEY (event_uid, data_element_code)
);

-- Aggregate reporting data, alongside individual tracker records, per the
-- spec's "aggregate reporting fields alongside individual records"
-- requirement. Not consumed by the adapter (out of scope for patient-level
-- queries) but present to make the source realistically DHIS2-shaped.
CREATE TABLE IF NOT EXISTS aggregate_reports (
  org_unit_uid   TEXT NOT NULL REFERENCES org_units(org_unit_uid),
  period         TEXT NOT NULL,  -- e.g. '202603' (DHIS2 monthly period format)
  data_element   TEXT NOT NULL,  -- e.g. 'ANC_1ST_VISIT_COUNT'
  value          NUMERIC NOT NULL,
  PRIMARY KEY (org_unit_uid, period, data_element)
);
`);
};

exports.down = (pgm) => {
  pgm.sql(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
};
