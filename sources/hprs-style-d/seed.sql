-- Source D synthetic seed data (SQLite). All fields are NOT NULL per this
-- source's stricter validation archetype — there is no "missing field"
-- messiness here (that would violate the schema's own constraints); the
-- messiness this source contributes is elsewhere: a near-duplicate patient,
-- and the fact that its SA ID number format is genuinely validated (see
-- setup.ts), unlike the loosely-typed national id strings in the other
-- three sources.
--
-- The `patients` table's rows are NOT seeded here: sa_id_number must be
-- encrypted before insertion (see encryption.ts), so setup.ts inserts
-- patients programmatically from seed-patients.ts instead of via this raw
-- SQL file. Every other table's data is still seeded here as plain SQL.

INSERT INTO snomed_code_list (code, display) VALUES
  ('44054006', 'Type 2 diabetes mellitus'),
  ('38341003', 'Hypertensive disorder'),
  ('195967001', 'Asthma'),
  ('13645005', 'Chronic obstructive pulmonary disease'),
  ('90560007', 'Gout');

INSERT INTO visits (visit_uuid, hprs_uuid, visit_status, visit_date) VALUES
  ('HPRS-V001', 'HPRS-P001', 'CLOSED', '2026-02-05'),
  ('HPRS-V002', 'HPRS-P006', 'CLOSED', '2026-03-12'),
  ('HPRS-V003', 'HPRS-P004', 'OPEN',   '2026-04-01');

INSERT INTO diagnoses (diagnosis_uuid, visit_uuid, snomed_code, snomed_display, recorded_date) VALUES
  ('HPRS-D001', 'HPRS-V001', '44054006', 'Type 2 diabetes mellitus', '2026-02-05'),
  ('HPRS-D002', 'HPRS-V002', '38341003', 'Hypertensive disorder', '2026-03-12'),
  ('HPRS-D003', 'HPRS-V003', '195967001', 'Asthma', '2026-04-01');

INSERT INTO medication_records (med_uuid, hprs_uuid, status, medication_code, medication_name, dosage_text, prescribed_date) VALUES
  ('HPRS-M001', 'HPRS-P001', 'ACTIVE', 'HPRSF-MET-500', 'Metformin 500mg', 'One tablet twice daily with food', '2026-02-05'),
  ('HPRS-M002', 'HPRS-P006', 'ACTIVE', 'HPRSF-AML-005', 'Amlodipine 5mg',  'One tablet once daily',            '2026-03-12');
