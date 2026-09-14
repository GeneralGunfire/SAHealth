import { describe, expect, it } from "vitest";
import { translateHprsStyleD } from "../../src/adapters/hprs-style-d/translate.js";
import type { AdapterWarning, RawSourceBundle } from "../../src/types/sourceAdapter.js";
import type { HprsRawPatient } from "../../src/adapters/hprs-style-d/types.js";
import {
  canonicalPatientSchema,
  canonicalEncounterSchema,
  canonicalObservationSchema,
  canonicalMedicationStatementSchema,
} from "../../src/canonical/index.js";

function rawBundle(overrides: Partial<HprsRawPatient> = {}): RawSourceBundle<HprsRawPatient["patient"]> {
  const base: HprsRawPatient = {
    patient: {
      hprsUuid: "HPRS-P001",
      saIdNumber: "8801015800083",
      givenName: "Thandiwe",
      familyName: "Nkosi",
      sex: "F",
      dateOfBirth: "1988-01-01",
      mobileNumber: "+27821234567",
      facilityCode: "FAC-SOWETO-01",
    },
    visits: [
      {
        visitUuid: "HPRS-V001",
        hprsUuid: "HPRS-P001",
        visitStatus: "CLOSED",
        visitDate: "2026-02-05",
        diagnoses: [
          {
            diagnosisUuid: "HPRS-D001",
            snomedCode: "44054006",
            snomedDisplay: "Type 2 diabetes mellitus",
            recordedDate: "2026-02-05",
          },
        ],
      },
    ],
    medications: [
      {
        medUuid: "HPRS-M001",
        hprsUuid: "HPRS-P001",
        status: "ACTIVE",
        medicationCode: "HPRSF-MET-500",
        medicationName: "Metformin 500mg",
        dosageText: "One tablet twice daily with food",
        prescribedDate: "2026-02-05",
      },
    ],
  };
  return { ...base, ...overrides } as unknown as RawSourceBundle<HprsRawPatient["patient"]>;
}

describe("Source D (HPRS-style) translate", () => {
  it("translates the stricter, always-coded native shape into a valid canonical bundle", () => {
    const warnings: AdapterWarning[] = [];
    const bundle = translateHprsStyleD(rawBundle(), warnings);

    const patient = canonicalPatientSchema.parse(bundle.patient);
    expect(patient.name).toEqual({ given: ["Thandiwe"], family: "Nkosi" });
    expect(patient.gender).toBe("female");
    expect(patient.identifiers.some((i) => i.system === "hprs-style-d-sa-id-number" && i.value === "8801015800083")).toBe(
      true
    );

    const [encounter] = bundle.encounters.map((e) => canonicalEncounterSchema.parse(e));
    expect(encounter.status).toBe("finished");
    expect(encounter.class).toBe("ambulatory");

    const [observation] = bundle.observations.map((o) => canonicalObservationSchema.parse(o));
    expect(observation.code).toEqual({
      system: "hprs-style-d-snomed",
      code: "44054006",
      display: "Type 2 diabetes mellitus",
    });

    const [medication] = bundle.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));
    // Source D always codes medications — never free text, unlike Clinic A.
    expect(medication.medication).toEqual({
      kind: "coded",
      system: "hprs-style-d-formulary",
      code: "HPRSF-MET-500",
      display: "Metformin 500mg",
    });

    // Distinct-identifier-system warning is always logged for this source.
    expect(warnings.some((w) => w.message.includes("distinct identifier system"))).toBe(true);
  });

  it("does not throw for the near-duplicate fixture (correct spelling, mismatched SA ID)", () => {
    const warnings: AdapterWarning[] = [];
    const nearDuplicate = rawBundle({
      patient: {
        hprsUuid: "HPRS-P006",
        saIdNumber: "9001019800089", // deliberately different from Clinic A's SYN-9001015800044
        givenName: "Palesa",
        familyName: "Zulu",
        sex: "F",
        dateOfBirth: "1990-01-01",
        mobileNumber: "+27876789012",
        facilityCode: "FAC-CPT-06",
      },
      visits: [],
      medications: [],
    });

    const bundle = translateHprsStyleD(nearDuplicate, warnings);
    expect(() => canonicalPatientSchema.parse(bundle.patient)).not.toThrow();
    expect(bundle.patient.identifiers.map((i) => i.value)).not.toContain("SYN-9001015800044");
  });
});
