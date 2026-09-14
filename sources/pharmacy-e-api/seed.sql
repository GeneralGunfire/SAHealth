-- Pharmacy E synthetic seed data. Includes deliberate messiness consistent
-- with the other four sources: one patient with no national id on file,
-- one dispensing record with no drug code (OTC), and a mix of DISP/CANC
-- statuses.

INSERT INTO patients (pid, surname, given_name, dob, sex, cell, national_id) VALUES
  ('PHE-0042', 'Mokwena', 'Thabo',   '15-MAR-1979', 'M', '0731234567', 'SYN-7903155800012'),
  ('PHE-0043', 'Naidoo',  'Priya',   '22-JUL-1985', 'F', '0729876543', 'SYN-8507225800034'),
  ('PHE-0044', 'Steyn',   'Johan',   '09-NOV-1990', 'M', NULL,          NULL); -- no national id on file

INSERT INTO dispensing_records (rx_id, pid, drug_code, drug_name, qty_dispensed, days_supply, sig, date_dispensed, rx_status) VALUES
  ('RX-88291', 'PHE-0042', 'ATORVA20',  'Atorvastatin 20mg',                 30, 30, '1 tab nocte', '03-FEB-2026', 'DISP'),
  ('RX-88295', 'PHE-0042', NULL,        'Multivitamin (OTC, no code on file)', 1, 30, '1 daily',     '03-FEB-2026', 'DISP'),
  ('RX-90110', 'PHE-0042', 'METFOR500', 'Metformin 500mg',                    60, 30, '1 tab bd',    '01-MAR-2026', 'CANC'),
  ('RX-91002', 'PHE-0043', 'AMLOD5',    'Amlodipine 5mg',                     30, 30, '1 tab daily', '10-MAR-2026', 'DISP'),
  ('RX-91500', 'PHE-0044', 'PARA500',   'Paracetamol 500mg',                  20, 5,  '2 tab qid prn','12-MAR-2026', 'DISP');
