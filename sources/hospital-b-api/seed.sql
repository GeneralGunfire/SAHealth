-- Hospital B synthetic seed data (18 patients), including deliberate messiness:
--  - pat_seq for "Palessa Zulu" (misspelled vs Clinic A's "Palesa Zulu") has nat_id_no NULL:
--    this is the near-duplicate cross-source test case. It must NOT deterministically
--    match Clinic A's CA-006 record — no shared identifier exists, and the names differ.
--    This is an honest, expected limitation of deterministic matching (see
--    Backend_Research.docx Section 3.2) — probabilistic matching remains backlog.
--  - HB-777 counterpart to Clinic A's CA-001 (Thandiwe Nkosi): clean cross-source match.
--  - One patient has nat_id_no NULL entirely (untraceable for matching).
--  - One patient has mobile_no/email_addr both NULL.
--  - One obs_tbl row has obs_units NULL (ambiguous unit case).
--  - Date fields (pat_dob, adm_dt, dis_dt, obs_dt, rx_dt) are free text with
--    intentionally inconsistent formats across rows, matching a real legacy system.

INSERT INTO pat_master (nat_id_no, hosp_no, surname, initials, sex_cd, pat_dob, mobile_no, email_addr, addr_line, suburb_txt, region_txt, post_cd) VALUES
  ('SYN-8801015800083', 'HB-HN-22190', 'Nkosi',    'T.',    '2', '1988-01-01',    '+27821234567', 'thandiwe.nkosi@example.co.za', '12 Protea Street', 'Soweto', 'Gauteng', '1818'),
  ('SYN-9506201800099', 'HB-HN-30021', 'Mokoena',  'N.A.',  '2', '20/06/1995',    NULL,           NULL, NULL, 'Polokwane', 'Limpopo', NULL),
  (NULL,                'HB-HN-30099', 'Mabaso',   'P.',    '1', '14 Mar 1979',   '+27849001122', 'p.mabaso@example.co.za', '3 Baker Street', 'Kimberley', 'Northern Cape', '8301'),
  ('SYN-9002284800012', 'HB-HN-30122', 'Sebego',   'K.J.',  '1', '1990-02-28',    '+27835556677', 'k.sebego@example.co.za', '77 Hospital Road', 'Mahikeng', 'North West', '2745'),
  ('SYN-8511196800023', 'HB-HN-30188', 'Botha',    'L.',    '2', '19/11/1985',    '+27823334455', 'l.botha@example.co.za', '6 Voortrekker Street', 'Bloemfontein', 'Free State', '9300'),
  (NULL,                'HB-HN-30201', 'Zulu',     'P.',    '2', '1990-01-01',    NULL,           NULL, NULL, 'Cape Town', 'Western Cape', NULL), -- "Palessa" misspelling vs Clinic A's "Palesa"; see note above
  ('SYN-9407013800034', 'HB-HN-30255', 'Khoza',    'M.',    '1', '1994-07-01',    '+27841234567', 'm.khoza@example.co.za', '19 Kloof Street', 'Durban', 'KwaZulu-Natal', '4001'),
  ('SYN-8809224800045', 'HB-HN-30298', 'Baloyi',   'S.T.',  '2', '22-09-1988',    '+27852345678', 's.baloyi@example.co.za', '5 Church Street', 'Nelspruit', 'Mpumalanga', '1200'),
  ('SYN-9103157800056', 'HB-HN-30341', 'Motaung',  'R.',    '1', '1991-03-15',    '+27863456789', 'r.motaung@example.co.za', '88 Kruger Avenue', 'Rustenburg', 'North West', '0299'),
  ('SYN-8706085800067', 'HB-HN-30389', 'Steyn',    'A.M.',  '2', '08/06/1987',    '+27874567890', 'a.steyn@example.co.za', '2 Ridge Road', 'East London', 'Eastern Cape', '5201'),
  ('SYN-9209278800078', 'HB-HN-30412', 'Dube',     'V.',    '1', '1992-09-27',    '+27885678901', 'v.dube@example.co.za', '45 Hill Street', 'Port Elizabeth', 'Eastern Cape', '6001'),
  ('SYN-8404039800089', 'HB-HN-30456', 'Naidoo',   'K.',    '2', '03/04/1984',    '+27896789012', 'k.naidoo@example.co.za', '18 Station Road', 'George', 'Western Cape', '6529'),
  ('SYN-9711166800090', 'HB-HN-30489', 'Ferreira', 'J.P.',  '1', '1997-11-16',    '+27807890123', 'jp.ferreira@example.co.za', '77 Market Street', 'Upington', 'Northern Cape', '8801'),
  ('SYN-8902287800101', 'HB-HN-30512', 'Malinga',  'Z.',    '2', '28/02/1989',    '+27818901234', 'z.malinga@example.co.za', '30 River Road', 'Richards Bay', 'KwaZulu-Natal', '3900'),
  ('SYN-9005099800112', 'HB-HN-30567', 'Kruger',   'D.',    '1', '1990-05-09',    '+27829012345', 'd.kruger@example.co.za', '11 Beach Road', 'Margate', 'KwaZulu-Natal', '4275'),
  ('SYN-8501187800123', 'HB-HN-30601', 'Nel',      'C.J.',  '2', '18-01-1985',    '+27830123456', 'c.nel@example.co.za', '55 School Street', 'Tzaneen', 'Limpopo', '0850'),
  ('SYN-9209019800134', 'HB-HN-30645', 'Van Wyk',  'F.',    '1', '1992-09-01',    '+27841234000', 'f.vanwyk@example.co.za', '8 Forest Drive', 'Mahikeng', 'North West', '2745'),
  ('SYN-8812229800145', 'HB-HN-30678', 'Pillay',   'S.',    '2', '22/12/1988',    '+27852345111', 's.pillay@example.co.za', '40 Ocean View', 'Durban', 'KwaZulu-Natal', '4001');

INSERT INTO admissions (pat_seq, adm_status, care_lvl, adm_dt, dis_dt) VALUES
  ((SELECT pat_seq FROM pat_master WHERE hosp_no = 'HB-HN-22190'), 'DISCHARGED', 'EMERGENCY',   '2026-04-10T14:00:00Z', '2026-04-10T18:30:00Z'),
  ((SELECT pat_seq FROM pat_master WHERE hosp_no = 'HB-HN-30201'), 'DISCHARGED', 'OUTPATIENT',  '11/03/2026 10:00',     '11/03/2026 10:30'),
  ((SELECT pat_seq FROM pat_master WHERE hosp_no = 'HB-HN-30122'), 'ACTIVE',     'INPATIENT',   '2026-04-02T08:00:00Z', NULL);

INSERT INTO obs_tbl (pat_seq, obs_status, domain_cd, loc_code, obs_desc, obs_dt, obs_amt, obs_units) VALUES
  ((SELECT pat_seq FROM pat_master WHERE hosp_no = 'HB-HN-22190'), 'FINAL', 'PATHOLOGY', 'HB-GLU-01', 'Blood Glucose (Fasting)', '2026-04-10T14:20:00Z', 7.1, 'mmol/L'),
  ((SELECT pat_seq FROM pat_master WHERE hosp_no = 'HB-HN-30122'), 'FINAL', 'PATHOLOGY', 'HB-GLU-01', 'Blood Glucose (Fasting)', '02/04/2026 08:10', 5.4, NULL); -- ambiguous unit: deliberately NULL

INSERT INTO rx_tbl (pat_seq, rx_status, formulary_cd, formulary_txt, free_txt, rx_dt, dosage_txt) VALUES
  ((SELECT pat_seq FROM pat_master WHERE hosp_no = 'HB-HN-22190'), 'ONGOING', 'HBF-MET-500', 'Metformin 500mg', NULL, '2026-04-10T18:00:00Z', 'One tablet twice daily with food'),
  ((SELECT pat_seq FROM pat_master WHERE hosp_no = 'HB-HN-30201'), 'ONGOING', NULL, NULL, 'Amlodipine 5mg', '11/03/2026 10:25', 'One tablet once daily');
