import { describe, expect, it } from "vitest";
import { translateClinicA } from "../../src/adapters/clinic-a/translate.js";
import type { AdapterWarning, RawSourceBundle } from "../../src/types/sourceAdapter.js";
import type { ClinicARawPatient } from "../../src/adapters/clinic-a/types.js";
import {
  canonicalPatientSchema,
  canonicalEncounterSchema,
  canonicalObservationSchema,
  canonicalMedicationStatementSchema,
} from "../../src/canonical/index.js";

/**
 * Pure unit tests for translateClinicA against fixture raw data — no
 * network/database dependency. Live end-to-end coverage against the real
 * Postgres-backed Clinic A API lives in
 * tests/integration/clinicASourceApi.integration.test.ts.
 */
function rawBundle(overrides: Partial<ClinicARawPatient> = {}): RawSourceBundle<ClinicARawPatient["patient"]> {
  const base: ClinicARawPatient = {
    patient: {
      patientRef: "CA-001",
      identifiers: [
        { idType: "NAT-ID", idValue: "SYN-8801015800083" },
        { idType: "MRN", idValue: "CA-MRN-4471" },
      ],
      firstNames: "Thandiwe",
      surname: "Nkosi",
      sex: "F",
      dob: "01/01/1988",
      cellNumber: "+27821234567",
      emailAddress: "thandiwe.nkosi@example.co.za",
      addr: { street: "12 Protea Street", town: "Soweto", province: "Gauteng", zip: "1818" },
    },
    visits: [
      {
        visitId: "CA-V-9001",
        patientRef: "CA-001",
        visitStatus: "CLOSED",
        visitType: "OPD",
        startedAt: "03/02/2026 09:15",
        endedAt: "03/02/2026 09:45",
      },
    ],
    labResults: [
      {
        resultId: "CA-R-5001",
        patientRef: "CA-001",
        resultStatus: "FINAL",
        panel: "LAB",
        testCode: "GLU",
        testName: "Blood Glucose",
        resultDateTime: "03/02/2026 09:20",
        resultValue: 126,
        resultUnit: "mg/dL",
      },
    ],
    medications: [
      {
        medRecordId: "CA-M-3001",
        patientRef: "CA-001",
        medStatus: "CURRENT",
        medicationFreeText: "Metformin",
        startedAt: "03/02/2026",
        instructions: "500mg twice daily with meals",
      },
    ],
  };
  return { ...base, ...overrides } as unknown as RawSourceBundle<ClinicARawPatient["patient"]>;
}

describe("Clinic A translate", () => {
  it("translates native shape to a canonical bundle that validates against the shared schemas", () => {
    const warnings: AdapterWarning[] = [];
    const bundle = translateClinicA(rawBundle(), warnings);

    const patient = canonicalPatientSchema.parse(bundle.patient);
    expect(patient.name.family).toBe("Nkosi");
    expect(patient.gender).toBe("female");
    expect(patient.birthDate).toBe("1988-01-01"); // DD/MM/YYYY -> ISO date
    expect(patient.identifiers.some((i) => i.value === "SYN-8801015800083")).toBe(true);

    const [encounter] = bundle.encounters.map((e) => canonicalEncounterSchema.parse(e));
    expect(encounter.status).toBe("finished");
    expect(encounter.class).toBe("ambulatory");

    const [observation] = bundle.observations.map((o) => canonicalObservationSchema.parse(o));
    // 126 mg/dL -> mmol/L conversion
    expect(observation.value.unit).toBe("mmol/L");
    expect(observation.value.value).toBeCloseTo(6.99, 1);

    const [medication] = bundle.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));
    expect(medication.medication).toEqual({ kind: "text", text: "Metformin" });

    expect(warnings).toHaveLength(0);
  });

  it("logs a warning and does not crash when a lab result has no recorded unit", () => {
    const warnings: AdapterWarning[] = [];
    const messy = rawBundle({
      labResults: [
        {
          resultId: "CA-R-5002",
          patientRef: "CA-001",
          resultStatus: "FINAL",
          panel: "LAB",
          testCode: "GLU",
          testName: "Blood Glucose",
          resultDateTime: "20/01/2026 22:30",
          resultValue: 98,
          resultUnit: null,
        },
      ],
    });

    const bundle = translateClinicA(messy, warnings);
    const [observation] = bundle.observations.map((o) => canonicalObservationSchema.parse(o));

    expect(observation.value.unit).toBe("unknown");
    expect(warnings).toHaveLength(1);
    expect(warnings[0].message).toMatch(/no recorded unit/i);
  });

  it("logs a warning but still produces a valid canonical patient when no NAT-ID identifier is present", () => {
    const warnings: AdapterWarning[] = [];
    const messy = rawBundle({
      patient: {
        patientRef: "CA-008",
        identifiers: [{ idType: "MRN", idValue: "CA-MRN-4478" }], // no NAT-ID
        firstNames: "Refilwe",
        surname: "Sithole",
        sex: "F",
        dob: "15/05/1995",
        cellNumber: "+27823334455",
        emailAddress: "refilwe.s@example.co.za",
        addr: { street: "9 Baobab Street", town: "Polokwane", province: "Limpopo", zip: "0699" },
      },
    });

    const bundle = translateClinicA(messy, warnings);
    expect(() => canonicalPatientSchema.parse(bundle.patient)).not.toThrow();
    expect(warnings.some((w) => w.message.includes("No NAT-ID"))).toBe(true);
  });
});
