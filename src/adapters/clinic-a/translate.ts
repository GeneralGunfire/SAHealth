import type {
  CanonicalEncounter,
  CanonicalMedicationStatement,
  CanonicalObservation,
  CanonicalPatient,
} from "../../canonical/index.js";
import type { AdapterWarning, CanonicalBundle, RawSourceBundle } from "../../types/sourceAdapter.js";
import type { ClinicARawPatient } from "./types.js";

const SOURCE_ID = "clinic-a";

/** Clinic A dates are DD/MM/YYYY or "DD/MM/YYYY HH:mm" — convert to ISO-8601. */
function parseClinicADate(input: string): string {
  const [datePart, timePart] = input.split(" ");
  const [dd, mm, yyyy] = datePart.split("/");
  const iso = `${yyyy}-${mm}-${dd}${timePart ? `T${timePart}:00Z` : ""}`;
  return iso;
}

function toIsoDate(input: string): string {
  const [dd, mm, yyyy] = input.split("/");
  return `${yyyy}-${mm}-${dd}`;
}

function mapGender(sex: "M" | "F"): CanonicalPatient["gender"] {
  return sex === "M" ? "male" : "female";
}

function mapVisitStatus(status: "OPEN" | "CLOSED" | "CANCELLED"): CanonicalEncounter["status"] {
  switch (status) {
    case "OPEN":
      return "in-progress";
    case "CLOSED":
      return "finished";
    case "CANCELLED":
      return "cancelled";
  }
}

function mapVisitClass(type: "OPD" | "IPD" | "ER"): CanonicalEncounter["class"] {
  switch (type) {
    case "OPD":
      return "ambulatory";
    case "IPD":
      return "inpatient";
    case "ER":
      return "emergency";
  }
}

function mapResultStatus(status: "PENDING" | "FINAL" | "CORRECTED"): CanonicalObservation["status"] {
  switch (status) {
    case "PENDING":
      return "preliminary";
    case "FINAL":
      return "final";
    case "CORRECTED":
      return "amended";
  }
}

/**
 * Clinic A reports blood glucose in mg/dL; the canonical model standardises
 * on mmol/L (the SI unit used in South African clinical practice). This is
 * an explicit unit-normalisation step per Section 2.3 — never left implicit.
 * `unit` may be null for legacy-adjacent results that were never annotated;
 * that ambiguity is logged rather than assumed.
 */
function normaliseGlucoseUnit(
  value: number,
  unit: string | null,
  warnings: AdapterWarning[],
  recordId: string
): { value: number; unit: string } {
  if (unit === null) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: recordId,
      message: "Glucose result has no recorded unit; value cannot be safely interpreted or compared across sources.",
    });
    return { value, unit: "unknown" };
  }
  if (unit === "mg/dL") {
    return { value: Math.round((value / 18.0182) * 100) / 100, unit: "mmol/L" };
  }
  if (unit === "mmol/L") {
    return { value, unit };
  }
  warnings.push({
    sourceId: SOURCE_ID,
    sourceRecordId: recordId,
    message: `Unrecognised unit "${unit}" for glucose result; passed through without conversion.`,
  });
  return { value, unit };
}

/** Non-glucose observations: same null-unit handling, without the glucose-specific mg/dL conversion. */
function normaliseGenericUnit(
  value: number,
  unit: string | null,
  warnings: AdapterWarning[],
  recordId: string
): { value: number; unit: string } {
  if (unit === null) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: recordId,
      message: "Observation has no recorded unit; value cannot be safely interpreted or compared across sources.",
    });
    return { value, unit: "unknown" };
  }
  return { value, unit };
}

function mapMedStatus(status: "CURRENT" | "ENDED" | "STOPPED"): CanonicalMedicationStatement["status"] {
  switch (status) {
    case "CURRENT":
      return "active";
    case "ENDED":
      return "completed";
    case "STOPPED":
      return "stopped";
  }
}

export function translateClinicA(raw: RawSourceBundle<ClinicARawPatient["patient"]>, warnings: AdapterWarning[]): CanonicalBundle {
  const bundle = (raw as unknown) as ClinicARawPatient;
  const p = bundle.patient;

  // Field-path mismatch example (Section 2.3): Clinic A nests identifiers in an array
  // keyed by idType, unlike Hospital B's flat fields. Handled here, not in the core.
  const natId = p.identifiers.find((i) => i.idType === "NAT-ID");
  if (!natId) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: p.patientRef,
      message: "No NAT-ID identifier found; identity matching for this record may fail.",
    });
  }

  const patient: CanonicalPatient = {
    resourceType: "Patient",
    id: p.patientRef, // placeholder; identity-matching module assigns final canonical id
    identifiers: p.identifiers.map((i) => ({ system: `clinic-a-${i.idType.toLowerCase()}`, value: i.idValue })),
    name: {
      given: p.firstNames.split(" ").filter(Boolean),
      family: p.surname,
    },
    gender: mapGender(p.sex),
    birthDate: toIsoDate(p.dob),
    contact: {
      phone: p.cellNumber,
      email: p.emailAddress,
    },
    address: {
      line: p.addr.street,
      city: p.addr.town,
      province: p.addr.province,
      postalCode: p.addr.zip,
    },
    sourceRecords: [{ sourceId: SOURCE_ID, sourceRecordId: p.patientRef }],
  };

  const encounters: CanonicalEncounter[] = bundle.visits.map((v) => ({
    resourceType: "Encounter",
    id: v.visitId,
    status: mapVisitStatus(v.visitStatus),
    class: mapVisitClass(v.visitType),
    subject: { resourceType: "Patient", id: p.patientRef },
    period: {
      start: parseClinicADate(v.startedAt),
      end: v.endedAt ? parseClinicADate(v.endedAt) : null,
    },
    sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: v.visitId },
  }));

  const observations: CanonicalObservation[] = bundle.labResults.map((r) => {
    const normalised =
      r.testCode === "GLU"
        ? normaliseGlucoseUnit(r.resultValue, r.resultUnit, warnings, r.resultId)
        : normaliseGenericUnit(r.resultValue, r.resultUnit, warnings, r.resultId);

    return {
      resourceType: "Observation",
      id: r.resultId,
      status: mapResultStatus(r.resultStatus),
      category: r.panel === "LAB" ? "laboratory" : "vital-signs",
      code: { system: "clinic-a-local-codes", code: r.testCode, display: r.testName },
      subject: { resourceType: "Patient", id: p.patientRef },
      effectiveDateTime: parseClinicADate(r.resultDateTime),
      value: normalised,
      sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: r.resultId },
    };
  });

  const medicationStatements: CanonicalMedicationStatement[] = bundle.medications.map((m) => ({
    resourceType: "MedicationStatement",
    id: m.medRecordId,
    status: mapMedStatus(m.medStatus),
    // Clinic A never codes medications — always falls back to free text (Section 2.2: "code or text").
    medication: { kind: "text", text: m.medicationFreeText },
    subject: { resourceType: "Patient", id: p.patientRef },
    effectiveDateTime: `${toIsoDate(m.startedAt)}T00:00:00Z`,
    dosageText: m.instructions,
    sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: m.medRecordId },
  }));

  return { patient, encounters, observations, medicationStatements };
}
