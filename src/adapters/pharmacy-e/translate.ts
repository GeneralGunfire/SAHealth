import type {
  CanonicalEncounter,
  CanonicalMedicationStatement,
  CanonicalObservation,
  CanonicalPatient,
} from "../../canonical/index.js";
import type { AdapterWarning, CanonicalBundle, RawSourceBundle } from "../../types/sourceAdapter.js";
import type { PharmacyERawPatient } from "./types.js";

/**
 * This adapter began as an AI-generated first draft via
 * scripts/generateAdapter.ts (OmniRoute, routed to "big-pickle" on
 * generation) and was corrected by hand before being accepted here. See
 * docs/ai-assisted-adapter-generation.md for the full, honest record of
 * what the draft got right and what needed fixing — including the
 * `rxstat` mapping below, which the original draft got subtly wrong.
 */

const SOURCE_ID = "pharmacy-e";
const DRUG_CODE_SYSTEM = "pharmacy-e-drug-codes";

const MONTHS: Record<string, string> = {
  JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
  JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12",
};

/** Converts Pharmacy E's "DD-MMM-YYYY" dates to ISO-8601. Unparsable dates are logged, never silently guessed. */
function parsePharmacyDate(value: string, warnings: AdapterWarning[], recordId: string, fieldName: string): string {
  const match = value.trim().toUpperCase().match(/^(\d{2})-([A-Z]{3})-(\d{4})$/);
  const month = match ? MONTHS[match[2]] : undefined;

  if (!match || !month) {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: recordId,
      message: `Could not parse "${fieldName}" value "${value}" as a Pharmacy E date (DD-MMM-YYYY); passed through unparsed.`,
    });
    return value;
  }

  return `${match[3]}-${month}-${match[1]}`;
}

function mapSex(sex: string, warnings: AdapterWarning[], recordId: string): CanonicalPatient["gender"] {
  const normalized = sex.trim().toUpperCase();
  if (normalized === "M") return "male";
  if (normalized === "F") return "female";

  warnings.push({
    sourceId: SOURCE_ID,
    sourceRecordId: recordId,
    message: `Unrecognised sex value "${sex}"; mapped to "unknown".`,
  });
  return "unknown";
}

/**
 * CORRECTED from the AI draft: rxstat is a DISPENSING-lifecycle flag, not a
 * medication-administration status. "DISP" means the pharmacy handed the
 * drugs over once — it says nothing about whether the patient is still
 * taking them, which this source has no way of knowing at all. The
 * original draft mapped "DISP" to canonical "active" with a confident
 * one-line comment; that is a real, understated assumption smuggled in as
 * settled logic, not an honestly-flagged judgement call. Mapping to
 * "completed" (the dispensing event finished) is a more defensible resting
 * state given Pharmacy E's actual knowledge, and the ambiguity is now
 * explicitly logged rather than presented as certain.
 */
function mapRxStatus(rxstat: string, warnings: AdapterWarning[], recordId: string): CanonicalMedicationStatement["status"] {
  const normalized = rxstat.trim().toUpperCase();

  if (normalized === "DISP") {
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: recordId,
      message:
        'Pharmacy E\'s "DISP" status only confirms the item was dispensed once; it cannot confirm the patient is still taking it. Mapped to "completed" rather than "active" — this is a genuine ambiguity in what this source can know, not a resolved fact.',
    });
    return "completed";
  }
  if (normalized === "CANC") return "stopped";

  warnings.push({
    sourceId: SOURCE_ID,
    sourceRecordId: recordId,
    message: `Unrecognised rxstat value "${rxstat}"; mapped to "unknown".`,
  });
  return "unknown";
}

export function translatePharmacyE(
  raw: RawSourceBundle<PharmacyERawPatient["pat"]>,
  warnings: AdapterWarning[]
): CanonicalBundle {
  const bundle = (raw as unknown) as PharmacyERawPatient;
  const pat = bundle.pat;

  const nationalId = pat.nid?.trim() || null;
  if (!nationalId) {
    // CORRECTED from the AI draft: the original silently omitted the
    // identifier with no warning when nid was null. Every other adapter in
    // this project logs this, since identity matching for the record will
    // fail without it — the draft was inconsistent with its own reference
    // example on this point.
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: pat.pid,
      message: "No national id on file for this patient; identity matching for this record will fail.",
    });
  }

  const patient: CanonicalPatient = {
    resourceType: "Patient",
    id: pat.pid, // placeholder; identity-matching module assigns final canonical id
    identifiers: [
      ...(nationalId ? [{ system: "pharmacy-e-national-id", value: nationalId }] : []),
      { system: "pharmacy-e-pid", value: pat.pid },
    ],
    name: { given: [pat.gv], family: pat.sur },
    gender: mapSex(pat.sx, warnings, pat.pid),
    birthDate: parsePharmacyDate(pat.dob, warnings, pat.pid, "dob"),
    contact: {
      phone: pat.cell,
      email: null, // Pharmacy E never captures patient email addresses
    },
    address: {
      // Pharmacy E has no residential address fields in its patient record.
      line: null,
      city: null,
      province: null,
      postalCode: null,
    },
    sourceRecords: [{ sourceId: SOURCE_ID, sourceRecordId: pat.pid }],
  };

  // CORRECTED from the AI draft: `const encounters = []` / `const observations = []`
  // were untyped, which fails this project's actual strict-mode build
  // (TS7034/TS7005, confirmed by running `tsc --strict` against the draft
  // before this correction). Explicitly typed empty arrays, since Pharmacy
  // E genuinely has no encounter- or observation-like structures at all —
  // it is a dispensing feed, not a clinical encounter or measurement system.
  const encounters: CanonicalEncounter[] = [];
  const observations: CanonicalObservation[] = [];

  const medicationStatements: CanonicalMedicationStatement[] = bundle.rx.map((rx) => {
    const codedDrugCode = rx.drugcd?.trim() || null;

    // OTC products are sometimes dispensed with no formulary code at all.
    // The canonical medication field explicitly supports free-text
    // medication for exactly this case — a first-class representation,
    // not a silent fallback.
    const medication: CanonicalMedicationStatement["medication"] = codedDrugCode
      ? { kind: "coded", system: DRUG_CODE_SYSTEM, code: codedDrugCode, display: rx.drugnm }
      : { kind: "text", text: rx.drugnm };

    // CORRECTED from the AI draft: qtydisp/dayssup were silently discarded
    // with only an inline code comment explaining the decision, no
    // AdapterWarning. Per this project's Section 2.3 convention, data that
    // has no canonical home should be disclosed, not just quietly dropped —
    // a real HIM reviewer combing the audit trail should be able to see
    // that supply-quantity information existed and was not carried forward.
    warnings.push({
      sourceId: SOURCE_ID,
      sourceRecordId: rx.rxid,
      message: `Pharmacy E's qtydisp (${rx.qtydisp}) and dayssup (${rx.dayssup}) have no field in the canonical MedicationStatement model and are not carried forward; only the free-text "sig" dosing instruction is retained as dosageText.`,
    });

    return {
      resourceType: "MedicationStatement" as const,
      id: rx.rxid,
      status: mapRxStatus(rx.rxstat, warnings, rx.rxid),
      medication,
      subject: { resourceType: "Patient" as const, id: pat.pid },
      effectiveDateTime: `${parsePharmacyDate(rx.dtdisp, warnings, rx.rxid, "dtdisp")}T00:00:00Z`,
      dosageText: rx.sig,
      sourceRecord: { sourceId: SOURCE_ID, sourceRecordId: rx.rxid },
    };
  });

  return { patient, encounters, observations, medicationStatements };
}
