/**
 * Hospital B's native data shape — deliberately distinct from Clinic A's.
 * Style: nested demographic block, ISO-ish but different field names,
 * glucose already in mmol/L, medications coded against a local formulary.
 */

export interface HospitalBIdentifiers {
  /** Nullable: this legacy system did not always capture a national id at intake. */
  nationalId: string | null;
  hospitalNumber: string;
}

export interface HospitalBDemographics {
  /**
   * Hospital B never stored a clean given-name field — only a surname and
   * initials (e.g. "T." or "N.A."), a real legacy-system limitation. `first`
   * is therefore always null; the adapter must not invent a given name.
   */
  fullName: { first: null; middle: null; last: string; initials: string };
  genderCode: "1" | "2" | "9"; // 1=male, 2=female, 9=unspecified (local hospital code table)
  /**
   * Free text, NOT a consistent format: rows may be "YYYY-MM-DD",
   * "DD/MM/YYYY", "DD-MM-YYYY", or "D MMM YYYY" depending on when the row
   * was entered. The adapter must parse this defensively and log any date
   * it cannot confidently parse rather than guessing.
   */
  dateOfBirth: string;
  telecom: { mobile: string | null; email: string | null };
  residentialAddress: string | null; // Hospital B stores address as a single free-text line
  suburb: string | null;
  region: string | null;
  postCode: string | null;
}

export interface HospitalBPatientRecord {
  hb_patient_id: string; // Hospital B's own native patient id
  identifiers: HospitalBIdentifiers; // flat object, not an array (unlike Clinic A)
  demographics: HospitalBDemographics;
}

export interface HospitalBAdmissionRecord {
  admissionId: string;
  hb_patient_id: string;
  admissionStatus: "ACTIVE" | "DISCHARGED" | "CANCELLED";
  careLevel: "OUTPATIENT" | "INPATIENT" | "EMERGENCY" | "TELEHEALTH";
  /** Free text, inconsistent format (see HospitalBDemographics.dateOfBirth). */
  admittedAtUtc: string;
  dischargedAtUtc: string | null;
}

export interface HospitalBObservationRecord {
  obsId: string;
  hb_patient_id: string;
  obsStatus: "DRAFT" | "FINAL" | "AMENDED";
  domain: "PATHOLOGY" | "VITALS";
  loincLikeCode: string; // Hospital B uses its own SNOMED-inspired local codes
  description: string;
  /** Free text, inconsistent format (see HospitalBDemographics.dateOfBirth). */
  observedAtUtc: string;
  /** `units` is nullable: some legacy rows were never annotated with a unit. */
  measurement: { amount: number; units: string | null };
}

export interface HospitalBMedicationRecord {
  medId: string;
  hb_patient_id: string;
  medStatus: "ONGOING" | "DISCONTINUED" | "COMPLETE";
  formularyCode: string | null; // coded when available
  formularyDisplay: string | null;
  freeTextFallback: string | null; // only populated when not coded
  /** Free text, inconsistent format (see HospitalBDemographics.dateOfBirth). */
  prescribedAtUtc: string;
  dosageInstructions: string;
}

export interface HospitalBRawPatient {
  patientRecord: HospitalBPatientRecord;
  admissions: HospitalBAdmissionRecord[];
  observations: HospitalBObservationRecord[];
  medications: HospitalBMedicationRecord[];
}
