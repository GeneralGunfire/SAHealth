/**
 * Source D's native data shape — HPRS-style national system archetype.
 * Stricter than the other three sources: every demographic field is
 * required (never null), the id number is a validated 13-digit SA ID
 * number, diagnoses use a small fixed SNOMED CT-style code list, and
 * medications are always coded (never free text).
 */

export interface HprsDiagnosis {
  diagnosisUuid: string;
  snomedCode: string;
  snomedDisplay: string;
  recordedDate: string; // ISO "YYYY-MM-DD"
}

export interface HprsVisit {
  visitUuid: string;
  hprsUuid: string;
  visitStatus: "OPEN" | "CLOSED";
  visitDate: string; // ISO "YYYY-MM-DD"
  diagnoses: HprsDiagnosis[];
}

export interface HprsMedication {
  medUuid: string;
  hprsUuid: string;
  status: "ACTIVE" | "ENDED";
  medicationCode: string;
  medicationName: string;
  dosageText: string;
  prescribedDate: string; // ISO "YYYY-MM-DD"
}

export interface HprsPatientRecord {
  hprsUuid: string;
  saIdNumber: string; // always exactly 13 digits, validated at source
  givenName: string;
  familyName: string;
  sex: "M" | "F";
  dateOfBirth: string; // ISO "YYYY-MM-DD"
  mobileNumber: string; // required, never null in this source
  facilityCode: string;
}

export interface HprsRawPatient {
  patient: HprsPatientRecord;
  visits: HprsVisit[];
  medications: HprsMedication[];
}
