/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * Step 4: initial migration, wrapping the exact schema previously applied
 * by hand via src/db/schema.sql (now removed — this migration is the new
 * single source of truth). Kept as one straight-line SQL block rather than
 * split into node-pg-migrate's schema-builder API, since it is a direct,
 * faithful port of working SQL rather than a new design.
 */
exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS patients (
      id                TEXT PRIMARY KEY,
      identifiers       JSONB NOT NULL,
      given_names       TEXT[] NOT NULL,
      family_name       TEXT NOT NULL,
      gender            TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other', 'unknown')),
      birth_date        DATE NOT NULL,
      phone             TEXT,
      email             TEXT,
      address_line      TEXT,
      address_city      TEXT,
      address_province  TEXT,
      address_postcode  TEXT,
      source_records    JSONB NOT NULL,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS encounters (
      id                TEXT PRIMARY KEY,
      status            TEXT NOT NULL CHECK (status IN ('planned', 'in-progress', 'finished', 'cancelled')),
      class             TEXT NOT NULL CHECK (class IN ('ambulatory', 'inpatient', 'emergency', 'virtual')),
      subject_patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      period_start      TIMESTAMPTZ NOT NULL,
      period_end        TIMESTAMPTZ,
      source_id         TEXT NOT NULL,
      source_record_id  TEXT NOT NULL,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS observations (
      id                TEXT PRIMARY KEY,
      status            TEXT NOT NULL CHECK (status IN ('registered', 'preliminary', 'final', 'amended')),
      category          TEXT NOT NULL CHECK (category IN ('laboratory', 'vital-signs')),
      code_system       TEXT NOT NULL,
      code              TEXT NOT NULL,
      code_display      TEXT NOT NULL,
      subject_patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      effective_at      TIMESTAMPTZ NOT NULL,
      value_amount      NUMERIC NOT NULL,
      value_unit        TEXT NOT NULL,
      source_id         TEXT NOT NULL,
      source_record_id  TEXT NOT NULL,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS medication_statements (
      id                TEXT PRIMARY KEY,
      status            TEXT NOT NULL CHECK (status IN ('active', 'completed', 'stopped', 'unknown')),
      medication        JSONB NOT NULL,
      subject_patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      effective_at      TIMESTAMPTZ NOT NULL,
      dosage_text       TEXT NOT NULL,
      source_id         TEXT NOT NULL,
      source_record_id  TEXT NOT NULL,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_encounters_subject ON encounters(subject_patient_id);
    CREATE INDEX IF NOT EXISTS idx_observations_subject ON observations(subject_patient_id);
    CREATE INDEX IF NOT EXISTS idx_medication_statements_subject ON medication_statements(subject_patient_id);

    CREATE TABLE IF NOT EXISTS audit_events (
      id                BIGSERIAL PRIMARY KEY,
      operation         TEXT NOT NULL CHECK (operation IN
                          ('token-issue', 'token-validation-failure', 'patient-query', 'audit-trail-read')),
      occurred_at       TIMESTAMPTZ NOT NULL,
      actor             TEXT NOT NULL,
      patient_id        TEXT,
      outcome           TEXT NOT NULL CHECK (outcome IN ('success', 'partial-success', 'failure')),
      purpose           TEXT,
      resource_types    JSONB NOT NULL,
      detail            JSONB NOT NULL,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX IF NOT EXISTS idx_audit_events_patient ON audit_events(patient_id);
    CREATE INDEX IF NOT EXISTS idx_audit_events_occurred_at ON audit_events(occurred_at);

    CREATE TABLE IF NOT EXISTS audit_outbox (
      id            BIGSERIAL PRIMARY KEY,
      payload       JSONB NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      published_at  TIMESTAMPTZ,
      publish_attempts INT NOT NULL DEFAULT 0,
      last_error    TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_audit_outbox_unpublished ON audit_outbox(id) WHERE published_at IS NULL;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS audit_outbox;
    DROP TABLE IF EXISTS audit_events;
    DROP TABLE IF EXISTS medication_statements;
    DROP TABLE IF EXISTS observations;
    DROP TABLE IF EXISTS encounters;
    DROP TABLE IF EXISTS patients;
  `);
};
