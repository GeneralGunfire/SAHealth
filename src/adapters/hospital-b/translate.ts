import type {
  CanonicalEncounter,
  CanonicalMedicationStatement,
  CanonicalObservation,
  CanonicalPatient,
} from "../../canonical/index.js";
import type { AdapterWarning, CanonicalBundle, RawSourceBundle } from "../../types/sourceAdapter.js";
import type { HospitalBRawPatient } from "./types.js";

const SOURCE_ID = "hospital-b";

function mapGender(code: "1" | "2" | "9"): CanonicalPatient["gender"] {
  switch (code) {
    case "1":
      return "male";
    case "2":
      return "female";
    case "9":
      return "unknown";
  }
}

function mapAdmissionStatus(status: "ACTIVE" | "DISCHARGED" | "CANCELLED"): CanonicalEncounter["status"] {
  switch (status) {
    case "ACTIVE":
      return "in-progress";
    case "DISCHARGED":
      return "finished";
    case "CANCELLED":
      return "cancelled";
  }
}

function mapCareLevel(level: "OUTPATIENT" | "INPATIENT" | "EMERGENCY" | "TELEHEALTH"): CanonicalEncounter["class"] {
  switch (level) {
    case "OUTPATIENT":
      return "ambulatory";
    case "INPATIENT":
      return "inpatient";
    case "EMERGENCY":
      return "emergency";
    case "TELEHEALTH":
      return "virtual";
  }
}

function mapObsStatus(status: "DRAFT" | "FINAL" | "AMENDED"): CanonicalObservation["status"] {
  switch (status) {
    case "DRAFT":
      return "preliminary";
    case "FINAL":
      return "final";
    case "AMENDED":
      return "amended";
  }
}

function mapMedStatus(status: "ONGOING" | "DISCONTINUED" | "COMPLETE"): CanonicalMedicationStatement["status"] {
  switch (status) {
    case "ONGOING":
      return "active";
    case "DISCONTINUED":
      return "stopped";
    case "COMPLETE":
      return "completed";
  }
}

const MONTH_NAMES = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/**
 * Hospital B's legacy date fields are free text with no single consistent
 * format across rows (a real symptom of a system whose date field was
 * never validated at entry). Tries, in order: ISO ("YYYY-MM-DD[THH:mm...]"),
 * slash-separated "DD/MM/YYYY[ HH:mm]", dash-separated "DD-MM-YYYY", and
 * "D MMM YYYY". Any format not recognised is logged as a warning and
 * passed through unparsed rather than guessed — consistent with Section
 * 2.3's requirement that ambiguous mappings never be resolved silently.
 */
function parseHospitalBDate(
  input: string,
  warnings: AdapterWarning[],
  recordId: string,
  fieldName: string
): string {
  const isoMatch = /^\d{4}-\d{2}-\d{2}(T[\d:.]+Z?)?$/.exec(input);
  if (isoMatch) {
    return isoMatch[1] ? input : `${input}T00:00:00Z`;
  }

  const slashMatch = /^(\d{2})\/(\d{2})\/(\d{4})(?: (\d{2}):(\d{2}))?$/.exec(input);
  if (slashMatch) {
    const [, dd, mm, yyyy, hh, min] = slashMatch;
    return `${yyyy}-${mm}-${dd}T${hh ?? "00"}:${min ?? "00"}:00Z`;
  }

  const dashMatch = /^(\d{2})-(\d{2})-(\d{4})$/.exec(input);
  if (dashMatch) {
    const [, dd, mm, yyyy] = dashMatch;
    return `${yyyy}-${mm}-${dd}T00:00:00Z`;
  }

  const monthNameMatch = /^(\d{1,2}) ([A-Za-z]{3,}) (\d{4})$/.exec(input);
  if (monthNameMatch) {
    const [, dd, monthName, yyyy] = monthNameMatch;
    const monthIndex = MONTH_NAMES.indexOf(monthName.slice(0, 3).toLowerCase());
    if (monthIndex >= 0) {
      return `${yyyy}-${String(monthIndex + 1).padStart(2, "0")}-${dd.padStart(2, "0")}T00:00:00Z`;
    }
  }

  warnings.push({
    sourceId: SOURCE_ID,
    sourceRecordId: recordId,
    message: `Could not parse "${fieldName}" value "${input}" against any known Hospital B date format; passed through unparsed.`,
  });
  return input;
}

/** Same parsing rules as parseHospitalBDate, but returns an ISO date (no time) for birthDate. */
function parseHospitalBDateOnly(input: string, warnings: AdapterWarning[], recordId: string, fieldName: string): string {
  const parsed = parseHospitalBDate(input, warnings, recordId, fieldName);
  return parsed.slice(0, 10);
}

/**
 * Hospital B already reports glucose in mmol/L when a unit is recorded at
 * all. Some legacy rows have no unit captured — that ambiguity is logged
 * rather than assumed, per Section 2.3.
 */
function normaliseMeasurementUnit(
  code: string,
  amount: number,
  units: string | null,
  warnings: AdapterWarning[],
  recordId: string
): { value: number; unit: string } {
  if (units === null) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: recordId,
      message: "Observation has no recorded unit; value cannot be safely interpreted or compared across sources.",
    });
    return { value: amount, unit: "unknown" };
  }
  if (code === "HB-GLU-01" && units !== "mmol/L") {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: recordId,
      message: `Expected mmol/L for glucose observation but found "${units}"; passed through without conversion.`,
    });
  }
  return { value: amount, unit: units };
}

export function translateHospitalB(
  raw: RawSourceBundle<HospitalBRawPatient["patientRecord"]>,
  warnings: AdapterWarning[]
): CanonicalBundle {
  const bundle = (raw as unknown) as HospitalBRawPatient;
  const p = bundle.patientRecord;
  const d = p.demographics;

  if (!p.identifiers.nationalId) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: p.hb_patient_id,
      message: "No national id on file for this patient; identity matching for this record will fail.",
    });
  }

  const patient: CanonicalPatient = {
    resourceType: "Patient",
    id: p.hb_patient_id, // placeholder; identity-matching module assigns final canonical id
    identifiers: [
      ...(p.identifiers.nationalId
        ? [{ system: "hospital-b-national-id", value: p.identifiers.nationalId }]
        : []),
      { system: "hospital-b-hospital-number", value: p.identifiers.hospitalNumber },
    ],
    name: {
      // Field-path/content mismatch example (Section 2.3): Hospital B never captured a
      // clean given name, only initials (e.g. "T.A."). The canonical model requires at
      // least one given-name entry, so the initials string is used as-is rather than
      // fabricating a full given name the source never recorded.
      given: [d.fullName.initials],
      family: d.fullName.last,
    },
    gender: mapGender(d.genderCode),
    birthDate: parseHospitalBDateOnly(d.dateOfBirth, warnings, p.hb_patient_id, "dateOfBirth"),
    contact: {
      phone: d.telecom.mobile,
      email: d.telecom.email,
    },
    address: {
      // Field-path mismatch example (Section 2.3): Hospital B stores address as a single
      // free-text line, while Clinic A structures it into street/town/province/zip.
      line: d.residentialAddress,
      city: d.suburb,
      province: d.region,
      postalCode: d.postCode,
    },
    sourceRecords: [{ sourceId: SOURCE_ID, sourceRecordId: p.hb_patient_id }],
  };

  const encounters: CanonicalEncounter[] = bundle.admissions.map((a) => ({
    resourceType: "Encounter",
    id: a.admissionId,
    status: mapAdmissionStatus(a.admissionStatus),
    class: mapCareLevel(a.careLevel),
    subject: { resourceType: "Patient", id: p.hb_patient_id },
    period: {
      start: parseHospitalBDate(a.admittedAtUtc, warnings, a.admissionId, "admittedAtUtc"),
      end: a.dischargedAtUtc ? parseHospitalBDate(a.dischargedAtUtc, warnings, a.admissionId, "dischargedAtUtc") : null,
    },
    sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: a.admissionId },
  }));

  const observations: CanonicalObservation[] = bundle.observations.map((o) => ({
    resourceType: "Observation",
    id: o.obsId,
    status: mapObsStatus(o.obsStatus),
    category: o.domain === "PATHOLOGY" ? "laboratory" : "vital-signs",
    code: { system: "hospital-b-local-codes", code: o.loincLikeCode, display: o.description },
    subject: { resourceType: "Patient", id: p.hb_patient_id },
    effectiveDateTime: parseHospitalBDate(o.observedAtUtc, warnings, o.obsId, "observedAtUtc"),
    value: normaliseMeasurementUnit(o.loincLikeCode, o.measurement.amount, o.measurement.units, warnings, o.obsId),
    sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: o.obsId },
  }));

  const medicationStatements: CanonicalMedicationStatement[] = bundle.medications.map((m) => {
    const medication: CanonicalMedicationStatement["medication"] =
      m.formularyCode && m.formularyDisplay
        ? { kind: "coded", system: "hospital-b-formulary", code: m.formularyCode, display: m.formularyDisplay }
        : m.freeTextFallback
          ? { kind: "text", text: m.freeTextFallback }
          : (() => {
              warnings.push({
                sourceId: SOURCE_ID,
                sourceRecordId: m.medId,
                message: "Medication record has neither a formulary code nor free text; defaulting to 'Unknown medication'.",
              });
              return { kind: "text", text: "Unknown medication" };
            })();

    return {
      resourceType: "MedicationStatement",
      id: m.medId,
      status: mapMedStatus(m.medStatus),
      medication,
      subject: { resourceType: "Patient", id: p.hb_patient_id },
      effectiveDateTime: parseHospitalBDate(m.prescribedAtUtc, warnings, m.medId, "prescribedAtUtc"),
      dosageText: m.dosageInstructions,
      sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: m.medId },
    };
  });

  return { patient, encounters, observations, medicationStatements };
}
