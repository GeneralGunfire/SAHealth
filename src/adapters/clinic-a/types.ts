/**
 * Clinic A's native data shape — deliberately distinct from Hospital B's.
 * Style: flat records, array-based identifiers, DD/MM/YYYY dates,
 * glucose reported in mg/dL, medication as free text only.
 */

export interface ClinicAIdentifier {
  idType: string; // e.g. "NAT-ID", "MRN"
  idValue: string;
}

export interface ClinicAPatientRecord {
  patientRef: string; // clinic A's own native patient id
  identifiers: ClinicAIdentifier[];
  firstNames: string; // space-separated given names
  surname: string;
  sex: "M" | "F";
  dob: string; // DD/MM/YYYY
  cellNumber: string | null;
  emailAddress: string | null;
  addr: {
    street: string | null;
    town: string | null;
    province: string | null;
    zip: string | null;
  };
}

export interface ClinicAVisitRecord {
  visitId: string;
  patientRef: string;
  visitStatus: "OPEN" | "CLOSED" | "CANCELLED";
  visitType: "OPD" | "IPD" | "ER";
  startedAt: string; // DD/MM/YYYY HH:mm
  endedAt: string | null;
}

export interface ClinicALabResult {
  resultId: string;
  patientRef: string;
  resultStatus: "PENDING" | "FINAL" | "CORRECTED";
  panel: "LAB" | "VITALS";
  testCode: string; // clinic A's local test code
  testName: string;
  resultDateTime: string; // DD/MM/YYYY HH:mm
  resultValue: number;
  resultUnit: string | null; // e.g. "mg/dL"; nullable — not every legacy-adjacent result was annotated with a unit
}

export interface ClinicAMedicationRecord {
  medRecordId: string;
  patientRef: string;
  medStatus: "CURRENT" | "ENDED" | "STOPPED";
  medicationFreeText: string; // clinic A never codes medications
  startedAt: string; // DD/MM/YYYY
  instructions: string;
}

export interface ClinicARawPatient {
  patient: ClinicAPatientRecord;
  visits: ClinicAVisitRecord[];
  labResults: ClinicALabResult[];
  medications: ClinicAMedicationRecord[];
}
