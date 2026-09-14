-- Source C synthetic seed data. Includes deliberate messiness consistent
-- with Clinic A / Hospital B's approach:
--  - TEI-006: near-duplicate of Clinic A's "Palesa Zulu" / Hospital B's
--    "Palessa Zulu", spelled a THIRD way ("Palesah Zulu") with no
--    nationalId attribute captured at all — must not deterministically merge.
--  - TEI-001: clean match to the shared Thandiwe Nkosi identity (SYN-8801015800083).
--  - TEI-007: missing phone attribute entirely (attribute row absent, not just null).
--  - One event with a GLUCOSE_VALUE but no GLUCOSE_UNIT data element (ambiguous unit).

INSERT INTO org_units (org_unit_uid, name, level, parent_uid) VALUES
  ('OU-GP',      'Gauteng Province',       'province',     NULL),
  ('OU-GP-JHB',  'Johannesburg District',  'district',     'OU-GP'),
  ('OU-GP-SOW',  'Soweto Sub-District',    'sub-district', 'OU-GP-JHB'),
  ('OU-FAC-01',  'Soweto Community Clinic','facility',     'OU-GP-SOW'),
  ('OU-LIM',     'Limpopo Province',       'province',     NULL),
  ('OU-LIM-POL', 'Polokwane District',     'district',     'OU-LIM'),
  ('OU-FAC-02',  'Polokwane Health Post',  'facility',     'OU-LIM-POL');

INSERT INTO tracked_entities (tei_uid, org_unit_uid) VALUES
  ('TEI-001', 'OU-FAC-01'),
  ('TEI-002', 'OU-FAC-02'),
  ('TEI-003', 'OU-FAC-01'),
  ('TEI-004', 'OU-FAC-02'),
  ('TEI-005', 'OU-FAC-01'),
  ('TEI-006', 'OU-FAC-01'), -- near-duplicate: "Palesah Zulu"
  ('TEI-007', 'OU-FAC-02'); -- missing phone attribute entirely

INSERT INTO tracked_entity_attributes (tei_uid, attribute_code, value) VALUES
  ('TEI-001', 'firstName', 'Thandiwe'), ('TEI-001', 'lastName', 'Nkosi'), ('TEI-001', 'sex', 'F'),
  ('TEI-001', 'dob', '1988-01-01'), ('TEI-001', 'nationalId', 'SYN-8801015800083'), ('TEI-001', 'phone', '+27821234567'),

  ('TEI-002', 'firstName', 'Kabelo'), ('TEI-002', 'lastName', 'Sekwati'), ('TEI-002', 'sex', 'M'),
  ('TEI-002', 'dob', '1983-06-14'), ('TEI-002', 'nationalId', 'SYN-8306145800076'), ('TEI-002', 'phone', '+27827001122'),

  ('TEI-003', 'firstName', 'Ayanda'), ('TEI-003', 'lastName', 'Mahlangu'), ('TEI-003', 'sex', 'F'),
  ('TEI-003', 'dob', '1996-02-20'), ('TEI-003', 'nationalId', 'SYN-9602205800087'), ('TEI-003', 'phone', '+27838002233'),

  ('TEI-004', 'firstName', 'Karabo'), ('TEI-004', 'lastName', 'Molepo'), ('TEI-004', 'sex', 'M'),
  ('TEI-004', 'dob', '1979-10-05'), ('TEI-004', 'nationalId', 'SYN-7910055800098'), ('TEI-004', 'phone', '+27849003344'),

  ('TEI-005', 'firstName', 'Dineo'), ('TEI-005', 'lastName', 'Motau'), ('TEI-005', 'sex', 'F'),
  ('TEI-005', 'dob', '1990-12-11'), ('TEI-005', 'nationalId', 'SYN-9012115800109'), ('TEI-005', 'phone', '+27850004455'),

  -- Near-duplicate: no nationalId attribute captured at all (row absent, not null).
  ('TEI-006', 'firstName', 'Palesah'), ('TEI-006', 'lastName', 'Zulu'), ('TEI-006', 'sex', 'F'),
  ('TEI-006', 'dob', '1990-01-01'), ('TEI-006', 'phone', '+27861112233'),

  -- Missing phone entirely.
  ('TEI-007', 'firstName', 'Tumelo'), ('TEI-007', 'lastName', 'Rakgoale'), ('TEI-007', 'sex', 'M'),
  ('TEI-007', 'dob', '2001-07-19'), ('TEI-007', 'nationalId', 'SYN-0107195800110');

INSERT INTO enrollments (enrollment_uid, tei_uid, program_code, org_unit_uid, status, enrollment_date) VALUES
  ('ENR-001', 'TEI-001', 'CHRONIC_CARE',   'OU-FAC-01', 'ACTIVE',    '2026-02-01'),
  ('ENR-002', 'TEI-003', 'MATERNAL_HEALTH','OU-FAC-01', 'ACTIVE',    '2026-01-15'),
  ('ENR-003', 'TEI-006', 'CHRONIC_CARE',   'OU-FAC-01', 'ACTIVE',    '2026-03-10'),
  ('ENR-004', 'TEI-007', 'IMMUNIZATION',   'OU-FAC-02', 'COMPLETED', '2026-01-05');

INSERT INTO events (event_uid, enrollment_uid, program_stage, org_unit_uid, status, event_date) VALUES
  ('EVT-001', 'ENR-001', 'LAB_STAGE',    'OU-FAC-01', 'COMPLETED', '2026-02-03'),
  ('EVT-002', 'ENR-002', 'ANC_VISIT',    'OU-FAC-01', 'COMPLETED', '2026-01-20'),
  ('EVT-003', 'ENR-003', 'LAB_STAGE',    'OU-FAC-01', 'COMPLETED', '2026-03-11'),
  ('EVT-004', 'ENR-004', 'IMMUNIZATION_DOSE', 'OU-FAC-02', 'COMPLETED', '2026-01-05');

INSERT INTO event_data_values (event_uid, data_element_code, value) VALUES
  ('EVT-001', 'DIAGNOSIS_CODE', 'E11'),       -- ICD-10-ish: Type 2 diabetes
  ('EVT-001', 'GLUCOSE_VALUE',  '7.4'),
  ('EVT-001', 'GLUCOSE_UNIT',   'mmol/L'),
  ('EVT-001', 'MEDICATION_TEXT','Metformin 500mg twice daily'),

  ('EVT-002', 'VISIT_NOTE', 'Routine antenatal check, no concerns'),

  -- Ambiguous unit: GLUCOSE_VALUE present, GLUCOSE_UNIT data element absent entirely.
  ('EVT-003', 'GLUCOSE_VALUE', '6.8'),
  ('EVT-003', 'MEDICATION_TEXT', 'Amlodipine 5mg once daily'),

  ('EVT-004', 'DIAGNOSIS_CODE', 'Z23'); -- Immunization encounter
