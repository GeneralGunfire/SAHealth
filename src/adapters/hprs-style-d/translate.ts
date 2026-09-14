import type {
  CanonicalEncounter,
  CanonicalMedicationStatement,
  CanonicalObservation,
  CanonicalPatient,
} from "../../canonical/index.js";
import type { AdapterWarning, CanonicalBundle, RawSourceBundle } from "../../types/sourceAdapter.js";
import type { HprsRawPatient } from "./types.js";

const SOURCE_ID = "hprs-style-d";

function mapSex(sex: "M" | "F"): CanonicalPatient["gender"] {
  return sex === "M" ? "male" : "female";
}

function mapVisitStatus(status: "OPEN" | "CLOSED"): CanonicalEncounter["status"] {
  return status === "OPEN" ? "in-progress" : "finished";
}

function mapMedStatus(status: "ACTIVE" | "ENDED"): CanonicalMedicationStatement["status"] {
  return status === "ACTIVE" ? "active" : "completed";
}

/**
 * Source D's 13-digit SA ID number is a different identifier system from
 * the synthetic "SYN-..." national ids used by the other three sources.
 * It is NOT rewritten to look like a SYN- id — that would be exactly the
 * kind of silent normalisation Section 2.3 warns against. Instead it is
 * recorded under its own identifier system, and identity matching (which
 * keys on the shared synthetic identifier) will correctly treat a Source D
 * record with no matching SYN- identifier as unmatched unless a real
 * cross-reference is established — consistent with this source's
 * deliberately separate identifier scheme.
 */
export function translateHprsStyleD(
  raw: RawSourceBundle<HprsRawPatient["patient"]>,
  warnings: AdapterWarning[]
): CanonicalBundle {
  const bundle = (raw as unknown) as HprsRawPatient;
  const p = bundle.patient;

  warnings.push({
    sourceId: SOURCE_ID,
    sourceRecordId: p.hprsUuid,
    message: `Source D's SA ID number (${p.saIdNumber}) uses a distinct identifier system from the other sources' synthetic national id; no automatic cross-reference is assumed.`,
  });

  const patient: CanonicalPatient = {
    resourceType: "Patient",
    id: p.hprsUuid, // placeholder; identity-matching module assigns final canonical id
    identifiers: [
      { system: "hprs-style-d-sa-id-number", value: p.saIdNumber },
      { system: "hprs-style-d-uuid", value: p.hprsUuid },
    ],
    name: {
      given: [p.givenName],
      family: p.familyName,
    },
    gender: mapSex(p.sex),
    birthDate: p.dateOfBirth,
    contact: {
      phone: p.mobileNumber,
      email: null, // Source D never captures email
    },
    address: {
      // Source D has no residential address fields at all — only a
      // registering facility code, a structurally different concept.
      line: null,
      city: null,
      province: null,
      postalCode: null,
    },
    sourceRecords: [{ sourceId: SOURCE_ID, sourceRecordId: p.hprsUuid }],
  };

  const encounters: CanonicalEncounter[] = bundle.visits.map((v) => ({
    resourceType: "Encounter",
    id: v.visitUuid,
    status: mapVisitStatus(v.visitStatus),
    // Source D has no encounter-class concept (no OPD/IPD/ER distinction) —
    // every visit is treated as ambulatory, logged rather than assumed silently.
    class: "ambulatory",
    subject: { resourceType: "Patient", id: p.hprsUuid },
    period: { start: `${v.visitDate}T00:00:00Z`, end: null },
    sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: v.visitUuid },
  }));

  if (bundle.visits.length > 0) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: p.hprsUuid,
      message: "Source D has no native encounter-class concept; all visits defaulted to \"ambulatory\".",
    });
  }

  const observations: CanonicalObservation[] = bundle.visits.flatMap((v) =>
    v.diagnoses.map((d) => ({
      resourceType: "Observation" as const,
      id: d.diagnosisUuid,
      status: "final" as const,
      category: "laboratory" as const,
      // Source D's SNOMED CT-style code list is a genuinely different
      // terminology system from the other sources' local code lists —
      // recorded under its own system, not remapped to another source's codes.
      code: { system: "hprs-style-d-snomed", code: d.snomedCode, display: d.snomedDisplay },
      subject: { resourceType: "Patient" as const, id: p.hprsUuid },
      effectiveDateTime: `${d.recordedDate}T00:00:00Z`,
      // A diagnosis has no numeric value in this source; recorded as a
      // presence marker (1) with the SNOMED code carrying the clinical meaning.
      value: { value: 1, unit: "code" },
      sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: d.diagnosisUuid },
    }))
  );

  const medicationStatements: CanonicalMedicationStatement[] = bundle.medications.map((m) => ({
    resourceType: "MedicationStatement",
    id: m.medUuid,
    status: mapMedStatus(m.status),
    // Source D always codes medications against its local formulary — never free text.
    medication: { kind: "coded", system: "hprs-style-d-formulary", code: m.medicationCode, display: m.medicationName },
    subject: { resourceType: "Patient", id: p.hprsUuid },
    effectiveDateTime: `${m.prescribedDate}T00:00:00Z`,
    dosageText: m.dosageText,
    sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: m.medUuid },
  }));

  return { patient, encounters, observations, medicationStatements };
}
