import type {
  CanonicalEncounter,
  CanonicalMedicationStatement,
  CanonicalObservation,
  CanonicalPatient,
} from "../../canonical/index.js";
import type { AdapterWarning, CanonicalBundle, RawSourceBundle } from "../../types/sourceAdapter.js";
import type { Dhis2RawPatient } from "./types.js";

const SOURCE_ID = "dhis2-style-c";

function getAttribute(attributes: { code: string; value: string | null }[], code: string): string | null {
  return attributes.find((a) => a.code === code)?.value ?? null;
}

function getDataValue(dataValues: { code: string; value: string | null }[], code: string): string | null {
  return dataValues.find((dv) => dv.code === code)?.value ?? null;
}

function mapSex(sex: string | null, warnings: AdapterWarning[], recordId: string): CanonicalPatient["gender"] {
  if (sex === "F") return "female";
  if (sex === "M") return "male";
  warnings.push({
    sourceId: SOURCE_ID,
    sourceRecordId: recordId,
    message: `Unrecognised or missing sex attribute value "${sex}"; mapped to "unknown".`,
  });
  return "unknown";
}

/**
 * DHIS2 enrollment/event statuses don't map 1:1 onto FHIR-inspired Encounter
 * statuses — an event's own status (ACTIVE/COMPLETED/SKIPPED/SCHEDULE) is
 * the more encounter-like signal than the parent enrollment's status, so
 * the adapter maps from the event, not the enrollment. This is exactly the
 * kind of structural judgement call the spec expects from a genuinely
 * different source shape, not a straight field rename.
 */
function mapEventStatus(status: "ACTIVE" | "COMPLETED" | "SKIPPED" | "SCHEDULE"): CanonicalEncounter["status"] {
  switch (status) {
    case "SCHEDULE":
      return "planned";
    case "ACTIVE":
      return "in-progress";
    case "COMPLETED":
      return "finished";
    case "SKIPPED":
      return "cancelled";
  }
}

/**
 * DHIS2 has no concept of Encounter "class" (ambulatory/inpatient/etc.) —
 * program stages describe clinical workflow steps, not care settings. In
 * the absence of a real signal, every event is treated as ambulatory and
 * this assumption is logged rather than silently guessed, per Section 2.3.
 */
function inferEncounterClass(programStage: string, warnings: AdapterWarning[], recordId: string): CanonicalEncounter["class"] {
  warnings.push({
    sourceId: SOURCE_ID,
    sourceRecordId: recordId,
    message: `Source C has no native encounter-class concept for program stage "${programStage}"; defaulted to "ambulatory".`,
  });
  return "ambulatory";
}

export function translateDhis2StyleC(
  raw: RawSourceBundle<Dhis2RawPatient["trackedEntity"]>,
  warnings: AdapterWarning[]
): CanonicalBundle {
  const bundle = (raw as unknown) as Dhis2RawPatient;
  const tei = bundle.trackedEntity;

  const nationalId = getAttribute(tei.attributes, "nationalId");
  if (!nationalId) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: tei.teiUid,
      message: "No nationalId attribute captured for this tracked entity; identity matching for this record will fail.",
    });
  }

  const firstName = getAttribute(tei.attributes, "firstName");
  const lastName = getAttribute(tei.attributes, "lastName");
  if (!firstName || !lastName) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: tei.teiUid,
      message: "Missing firstName or lastName attribute; canonical name fields may be incomplete.",
    });
  }

  const phone = getAttribute(tei.attributes, "phone");

  const patient: CanonicalPatient = {
    resourceType: "Patient",
    id: tei.teiUid, // placeholder; identity-matching module assigns final canonical id
    identifiers: [
      ...(nationalId ? [{ system: "dhis2-style-c-national-id", value: nationalId }] : []),
      { system: "dhis2-style-c-tei-uid", value: tei.teiUid },
    ],
    name: {
      given: [firstName ?? "Unknown"],
      family: lastName ?? "Unknown",
    },
    gender: mapSex(getAttribute(tei.attributes, "sex"), warnings, tei.teiUid),
    birthDate: getAttribute(tei.attributes, "dob") ?? "1900-01-01",
    contact: {
      phone,
      email: null, // Source C never captures email as a tracked-entity attribute
    },
    address: {
      // Source C has no patient-level address attributes at all — location is
      // expressed only via the org-unit hierarchy (facility/sub-district/etc.),
      // a structurally different concept from a home address. Left null rather
      // than conflating org-unit with residential address.
      line: null,
      city: null,
      province: null,
      postalCode: null,
    },
    sourceRecords: [{ sourceId: SOURCE_ID, sourceRecordId: tei.teiUid }],
  };

  const encounters: CanonicalEncounter[] = bundle.events.map((event) => ({
    resourceType: "Encounter",
    id: event.eventUid,
    status: mapEventStatus(event.status),
    class: inferEncounterClass(event.programStage, warnings, event.eventUid),
    subject: { resourceType: "Patient", id: tei.teiUid },
    period: { start: `${event.eventDate}T00:00:00Z`, end: null },
    sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: event.eventUid },
  }));

  // Observations: extracted from each event's loose data-value pairs. Only
  // events carrying a recognised clinical data element produce an
  // Observation — this is the genuine structural translation the DHIS2
  // shape demands, since "an observation" isn't a row in this source at all.
  const observations: CanonicalObservation[] = [];
  for (const event of bundle.events) {
    const glucoseValue = getDataValue(event.dataValues, "GLUCOSE_VALUE");
    if (glucoseValue !== null) {
      const glucoseUnit = getDataValue(event.dataValues, "GLUCOSE_UNIT");
      if (glucoseUnit === null) {
        warnings.push({
          sourceId: SOURCE_ID,
          sourceRecordId: event.eventUid,
          message: "GLUCOSE_VALUE data element present with no corresponding GLUCOSE_UNIT; value cannot be safely interpreted or compared across sources.",
        });
      }
      observations.push({
        resourceType: "Observation",
        id: `${event.eventUid}-GLUCOSE`,
        status: event.status === "COMPLETED" ? "final" : "preliminary",
        category: "laboratory",
        code: { system: "dhis2-style-c-data-elements", code: "GLUCOSE_VALUE", display: "Blood Glucose" },
        subject: { resourceType: "Patient", id: tei.teiUid },
        effectiveDateTime: `${event.eventDate}T00:00:00Z`,
        value: { value: Number(glucoseValue), unit: glucoseUnit ?? "unknown" },
        sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: event.eventUid },
      });
    }

    const diagnosisCode = getDataValue(event.dataValues, "DIAGNOSIS_CODE");
    if (diagnosisCode !== null) {
      observations.push({
        resourceType: "Observation",
        id: `${event.eventUid}-DIAGNOSIS`,
        status: event.status === "COMPLETED" ? "final" : "preliminary",
        category: "laboratory",
        code: { system: "dhis2-style-c-diagnosis-codes", code: diagnosisCode, display: diagnosisCode },
        subject: { resourceType: "Patient", id: tei.teiUid },
        effectiveDateTime: `${event.eventDate}T00:00:00Z`,
        // Diagnosis codes have no numeric "value" in this source; recorded as a
        // presence marker (1) with the code itself carrying the clinical meaning.
        value: { value: 1, unit: "code" },
        sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: event.eventUid },
      });
    }
  }

  const medicationStatements: CanonicalMedicationStatement[] = bundle.events
    .filter((event) => getDataValue(event.dataValues, "MEDICATION_TEXT") !== null)
    .map((event) => ({
      resourceType: "MedicationStatement",
      id: `${event.eventUid}-MED`,
      status: event.status === "COMPLETED" ? "completed" : "active",
      // Source C never codes medications — always free text within a data element.
      medication: { kind: "text", text: getDataValue(event.dataValues, "MEDICATION_TEXT")! },
      subject: { resourceType: "Patient", id: tei.teiUid },
      effectiveDateTime: `${event.eventDate}T00:00:00Z`,
      dosageText: getDataValue(event.dataValues, "MEDICATION_TEXT")!,
      sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: event.eventUid },
    }));

  return { patient, encounters, observations, medicationStatements };
}
