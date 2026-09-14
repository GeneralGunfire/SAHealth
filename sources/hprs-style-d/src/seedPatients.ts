/**
 * Patient seed data, kept out of seed.sql specifically because
 * sa_id_number must be encrypted before insertion (see encryption.ts) —
 * a plain `db.exec(seed.sql)` cannot apply per-row encryption, so this one
 * table's seed data is inserted programmatically by setup.ts instead.
 *
 * HPRS-P006 is the fourth spelling of the recurring near-duplicate person:
 * Clinic A "Palesa Zulu", Hospital B "Palessa Zulu" (no national id),
 * Source C "Palesah Zulu" (no national id), and here "Palesa Zulu" again
 * but with a DIFFERENT (mismatched) SA ID number from Clinic A's synthetic
 * identifier — deliberately not matching, so deterministic identity
 * matching correctly does NOT merge this record with Clinic A's either,
 * even though the name spelling happens to agree here.
 */
export interface SeedPatientRow {
  hprsUuid: string;
  saIdNumber: string; // plaintext here; setup.ts encrypts before insert
  givenName: string;
  familyName: string;
  sex: "M" | "F";
  dateOfBirth: string;
  mobileNumber: string;
  facilityCode: string;
}

export const seedPatients: SeedPatientRow[] = [
  { hprsUuid: "HPRS-P001", saIdNumber: "8801015800083", givenName: "Thandiwe", familyName: "Nkosi", sex: "F", dateOfBirth: "1988-01-01", mobileNumber: "+27821234567", facilityCode: "FAC-SOWETO-01" },
  { hprsUuid: "HPRS-P002", saIdNumber: "9105126800045", givenName: "Lerato", familyName: "Phiri", sex: "F", dateOfBirth: "1991-05-12", mobileNumber: "+27832345678", facilityCode: "FAC-PTA-02" },
  { hprsUuid: "HPRS-P003", saIdNumber: "8712087800056", givenName: "Mpho", familyName: "Tshabalala", sex: "M", dateOfBirth: "1987-12-08", mobileNumber: "+27843456789", facilityCode: "FAC-DBN-03" },
  { hprsUuid: "HPRS-P004", saIdNumber: "9403159800067", givenName: "Nomsa", familyName: "Dube", sex: "F", dateOfBirth: "1994-03-15", mobileNumber: "+27854567890", facilityCode: "FAC-CPT-04" },
  { hprsUuid: "HPRS-P005", saIdNumber: "8909224800078", givenName: "Sizwe", familyName: "Khumalo", sex: "M", dateOfBirth: "1989-09-22", mobileNumber: "+27865678901", facilityCode: "FAC-BFN-05" },
  // Near-duplicate (fourth spelling), mismatched SA ID vs Clinic A's synthetic identifier.
  { hprsUuid: "HPRS-P006", saIdNumber: "9001019800089", givenName: "Palesa", familyName: "Zulu", sex: "F", dateOfBirth: "1990-01-01", mobileNumber: "+27876789012", facilityCode: "FAC-CPT-06" },
  { hprsUuid: "HPRS-P007", saIdNumber: "9612037800090", givenName: "Bafana", familyName: "Ngcobo", sex: "M", dateOfBirth: "1996-12-03", mobileNumber: "+27887890123", facilityCode: "FAC-EL-07" },
  { hprsUuid: "HPRS-P008", saIdNumber: "8506118800101", givenName: "Zodwa", familyName: "Mabuza", sex: "F", dateOfBirth: "1985-06-11", mobileNumber: "+27898901234", facilityCode: "FAC-NELS-08" },
];
