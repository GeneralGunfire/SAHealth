-- Clinic A synthetic seed data (18 patients), including deliberate messiness:
--  - CA-006 (Palesa Zulu): near-duplicate cross-source test case (see hospital-b-api/seed.sql CA-006 counterpart)
--  - CA-007: missing email + mobile (nullable fields absent)
--  - CA-008: national_id is NULL (untraceable for matching)
--  - CA-R-5002 (attached to CA-001... actually CA-009): result_unit is NULL (ambiguous unit case)

INSERT INTO patients (patient_id, national_id, mrn, first_name, last_name, sex, date_of_birth, mobile, email, street, town, province, postal_code) VALUES
  ('CA-001', 'SYN-8801015800083', 'CA-MRN-4471', 'Thandiwe', 'Nkosi',    'F', '1988-01-01', '+27821234567', 'thandiwe.nkosi@example.co.za', '12 Protea Street', 'Soweto', 'Gauteng', '1818'),
  ('CA-002', 'SYN-9203127800088', 'CA-MRN-4472', 'Sipho',    'Dlamini',  'M', '1992-03-12', NULL,           'sipho.d@example.co.za', NULL, 'Pietermaritzburg', 'KwaZulu-Natal', NULL),
  ('CA-003', 'SYN-7711302800011', 'CA-MRN-4473', 'Lindiwe',  'Khumalo',  'F', '1977-11-30', '+27829876543', 'lindiwe.k@example.co.za', '5 Church Street', 'Nelspruit', 'Mpumalanga', '1200'),
  ('CA-004', 'SYN-8404185800022', 'CA-MRN-4474', 'Bongani',  'Mahlangu', 'M', '1984-04-18', '+27835551234', NULL, '88 Kruger Ave', 'Polokwane', 'Limpopo', '0700'),
  ('CA-005', 'SYN-9908227800033', 'CA-MRN-4475', 'Zanele',   'Mthembu',  'F', '1999-08-22', '+27846667788', 'zanele.m@example.co.za', '3 Marine Drive', 'Durban', 'KwaZulu-Natal', '4001'),
  ('CA-006', 'SYN-9001015800044', 'CA-MRN-4476', 'Palesa',   'Zulu',     'F', '1990-01-01', '+27827778899', 'palesa.zulu@example.co.za', '21 Long Street', 'Cape Town', 'Western Cape', '8001'),
  ('CA-007', 'SYN-8607091800055', 'CA-MRN-4477', 'Kagiso',   'Molefe',   'M', '1986-07-09', NULL,           NULL, '14 Voortrekker Road', 'Bloemfontein', 'Free State', '9300'),
  ('CA-008', NULL,                'CA-MRN-4478', 'Refilwe',  'Sithole',  'F', '1995-05-15', '+27823334455', 'refilwe.s@example.co.za', '9 Baobab Street', 'Polokwane', 'Limpopo', '0699'),
  ('CA-009', 'SYN-9312057800066', 'CA-MRN-4479', 'Themba',   'Ndlovu',   'M', '1993-12-05', '+27811112233', 'themba.n@example.co.za', '67 Main Road', 'Port Elizabeth', 'Eastern Cape', '6001'),
  ('CA-010', 'SYN-8710233800077', 'CA-MRN-4480', 'Nomvula',  'Radebe',   'F', '1987-10-23', '+27829990011', 'nomvula.r@example.co.za', '2 Ridge Road', 'East London', 'Eastern Cape', '5201'),
  ('CA-011', 'SYN-9105147800088', 'CA-MRN-4481', 'Lucky',    'Maseko',   'M', '1991-05-14', '+27834445566', 'lucky.m@example.co.za', '45 Hill Street', 'Rustenburg', 'North West', '0299'),
  ('CA-012', 'SYN-8302197800099', 'CA-MRN-4482', 'Precious', 'Mokoena',  'F', '1983-02-19', '+27845556677', 'precious.mk@example.co.za', '18 Station Road', 'Kimberley', 'Northern Cape', '8301'),
  ('CA-013', 'SYN-9704088800010', 'CA-MRN-4483', 'Given',    'Zwane',    'M', '1997-04-08', '+27817778890', 'given.z@example.co.za', '77 Church Road', 'George', 'Western Cape', '6529'),
  ('CA-014', 'SYN-8909162800021', 'CA-MRN-4484', 'Ntombi',   'Cele',     'F', '1989-09-16', '+27828889901', 'ntombi.c@example.co.za', '30 River Road', 'Richards Bay', 'KwaZulu-Natal', '3900'),
  ('CA-015', 'SYN-9006254800032', 'CA-MRN-4485', 'Sabelo',   'Buthelezi','M', '1990-06-25', '+27839990022', 'sabelo.b@example.co.za', '11 Beach Road', 'Margate', 'KwaZulu-Natal', '4275'),
  ('CA-016', 'SYN-8501073800043', 'CA-MRN-4486', 'Boitumelo','Tau',      'F', '1985-01-07', '+27841112244', 'boitumelo.t@example.co.za', '55 School Street', 'Mahikeng', 'North West', '2745'),
  ('CA-017', 'SYN-9209199800054', 'CA-MRN-4487', 'Andile',   'Mkhize',   'M', '1992-09-19', '+27852223355', 'andile.mk@example.co.za', '8 Forest Drive', 'Tzaneen', 'Limpopo', '0850'),
  ('CA-018', 'SYN-8812304800065', 'CA-MRN-4488', 'Fikile',   'Ngwenya',  'F', '1988-12-30', '+27863334466', 'fikile.n@example.co.za', '40 Market Street', 'Upington', 'Northern Cape', '8801');

INSERT INTO visits (visit_id, patient_id, status, visit_type, started_at, ended_at) VALUES
  ('CA-V-9001', 'CA-001', 'CLOSED', 'OPD', '2026-02-03T09:15:00Z', '2026-02-03T09:45:00Z'),
  ('CA-V-9002', 'CA-006', 'CLOSED', 'OPD', '2026-03-11T10:00:00Z', '2026-03-11T10:30:00Z'),
  ('CA-V-9003', 'CA-009', 'CLOSED', 'ER',  '2026-01-20T22:10:00Z', '2026-01-21T01:45:00Z'),
  ('CA-V-9004', 'CA-012', 'OPEN',   'IPD', '2026-04-02T08:00:00Z', NULL);

INSERT INTO lab_results (result_id, patient_id, status, panel, test_code, test_name, result_at, result_value, result_unit) VALUES
  ('CA-R-5001', 'CA-001', 'FINAL', 'LAB', 'GLU', 'Blood Glucose', '2026-02-03T09:20:00Z', 126, 'mg/dL'),
  ('CA-R-5002', 'CA-009', 'FINAL', 'LAB', 'GLU', 'Blood Glucose', '2026-01-20T22:30:00Z', 98, NULL), -- ambiguous unit: deliberately NULL
  ('CA-R-5003', 'CA-012', 'PENDING', 'VITALS', 'TEMP', 'Body Temperature', '2026-04-02T08:10:00Z', 37.2, 'C');

INSERT INTO medications (med_id, patient_id, status, medication_text, started_at, instructions) VALUES
  ('CA-M-3001', 'CA-001', 'CURRENT', 'Metformin', '2026-02-03', '500mg twice daily with meals'),
  ('CA-M-3002', 'CA-006', 'CURRENT', 'Amlodipine', '2026-03-11', '5mg once daily'),
  ('CA-M-3003', 'CA-012', 'CURRENT', 'Paracetamol', '2026-04-02', '1g every 6 hours as needed');
