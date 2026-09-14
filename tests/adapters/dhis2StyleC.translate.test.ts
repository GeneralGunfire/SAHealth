import { describe, expect, it } from "vitest";
import { translateDhis2StyleC } from "../../src/adapters/dhis2-style-c/translate.js";
import type { AdapterWarning, RawSourceBundle } from "../../src/types/sourceAdapter.js";
import type { Dhis2RawPatient } from "../../src/adapters/dhis2-style-c/types.js";
import {
  canonicalPatientSchema,
  canonicalEncounterSchema,
  canonicalObservationSchema,
  canonicalMedicationStatementSchema,
} from "../../src/canonical/index.js";

function rawBundle(overrides: Partial<Dhis2RawPatient> = {}): RawSourceBundle<Dhis2RawPatient["trackedEntity"]> {
  const base: Dhis2RawPatient = {
    trackedEntity: {
      teiUid: "TEI-001",
      orgUnitUid: "OU-FAC-01",
      attributes: [
        { code: "firstName", value: "Thandiwe" },
        { code: "lastName", value: "Nkosi" },
        { code: "sex", value: "F" },
        { code: "dob", value: "1988-01-01" },
        { code: "nationalId", value: "SYN-8801015800083" },
        { code: "phone", value: "+27821234567" },
      ],
    },
    enrollments: [
      {
        enrollmentUid: "ENR-001",
        teiUid: "TEI-001",
        programCode: "CHRONIC_CARE",
        orgUnitUid: "OU-FAC-01",
        status: "ACTIVE",
        enrollmentDate: "2026-02-01",
      },
    ],
    events: [
      {
        eventUid: "EVT-001",
        enrollmentUid: "ENR-001",
        programStage: "LAB_STAGE",
        orgUnitUid: "OU-FAC-01",
        status: "COMPLETED",
        eventDate: "2026-02-03",
        dataValues: [
          { code: "DIAGNOSIS_CODE", value: "E11" },
          { code: "GLUCOSE_VALUE", value: "7.4" },
          { code: "GLUCOSE_UNIT", value: "mmol/L" },
          { code: "MEDICATION_TEXT", value: "Metformin 500mg twice daily" },
        ],
      },
    ],
  };
  return { ...base, ...overrides } as unknown as RawSourceBundle<Dhis2RawPatient["trackedEntity"]>;
}

describe("Source C (DHIS2-style) translate", () => {
  it("translates attribute-value pairs and event data-values into a valid canonical bundle", () => {
    const warnings: AdapterWarning[] = [];
    const bundle = translateDhis2StyleC(rawBundle(), warnings);

    const patient = canonicalPatientSchema.parse(bundle.patient);
    expect(patient.name).toEqual({ given: ["Thandiwe"], family: "Nkosi" });
    expect(patient.gender).toBe("female");
    expect(patient.birthDate).toBe("1988-01-01");
    expect(patient.identifiers.some((i) => i.value === "SYN-8801015800083")).toBe(true);

    const [encounter] = bundle.encounters.map((e) => canonicalEncounterSchema.parse(e));
    expect(encounter.status).toBe("finished");
    expect(encounter.class).toBe("ambulatory"); // no native encounter-class concept in this source

    const observations = bundle.observations.map((o) => canonicalObservationSchema.parse(o));
    const glucose = observations.find((o) => o.code.code === "GLUCOSE_VALUE");
    expect(glucose?.value).toEqual({ value: 7.4, unit: "mmol/L" });
    const diagnosis = observations.find((o) => o.code.code === "E11");
    expect(diagnosis).toBeDefined();

    const [medication] = bundle.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));
    expect(medication.medication).toEqual({ kind: "text", text: "Metformin 500mg twice daily" });

    // Encounter-class inference is a genuine ambiguity for this source and must be logged.
    expect(warnings.some((w) => w.message.includes("no native encounter-class concept"))).toBe(true);
  });

  it("logs a warning and defaults to 'unknown' unit when GLUCOSE_VALUE has no GLUCOSE_UNIT data element", () => {
    const warnings: AdapterWarning[] = [];
    const messy = rawBundle({
      events: [
        {
          eventUid: "EVT-003",
          enrollmentUid: "ENR-001",
          programStage: "LAB_STAGE",
          orgUnitUid: "OU-FAC-01",
          status: "COMPLETED",
          eventDate: "2026-03-11",
          dataValues: [{ code: "GLUCOSE_VALUE", value: "6.8" }],
        },
      ],
    });

    const bundle = translateDhis2StyleC(messy, warnings);
    const [observation] = bundle.observations.map((o) => canonicalObservationSchema.parse(o));

    expect(observation.value.unit).toBe("unknown");
    expect(warnings.some((w) => w.message.includes("no corresponding GLUCOSE_UNIT"))).toBe(true);
  });

  it("logs a warning but still produces a valid canonical patient when no nationalId attribute is captured (near-duplicate fixture)", () => {
    const warnings: AdapterWarning[] = [];
    const messy = rawBundle({
      trackedEntity: {
        teiUid: "TEI-006",
        orgUnitUid: "OU-FAC-01",
        attributes: [
          { code: "firstName", value: "Palesah" },
          { code: "lastName", value: "Zulu" },
          { code: "sex", value: "F" },
          { code: "dob", value: "1990-01-01" },
          { code: "phone", value: "+27861112233" },
          // no nationalId attribute row at all
        ],
      },
      enrollments: [],
      events: [],
    });

    const bundle = translateDhis2StyleC(messy, warnings);
    expect(() => canonicalPatientSchema.parse(bundle.patient)).not.toThrow();
    expect(warnings.some((w) => w.message.includes("No nationalId attribute"))).toBe(true);
  });
});
