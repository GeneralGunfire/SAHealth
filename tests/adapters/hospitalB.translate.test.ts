import { describe, expect, it } from "vitest";
import { translateHospitalB } from "../../src/adapters/hospital-b/translate.js";
import type { AdapterWarning, RawSourceBundle } from "../../src/types/sourceAdapter.js";
import type { HospitalBRawPatient } from "../../src/adapters/hospital-b/types.js";
import {
  canonicalPatientSchema,
  canonicalEncounterSchema,
  canonicalObservationSchema,
  canonicalMedicationStatementSchema,
} from "../../src/canonical/index.js";

/**
 * Pure unit tests for translateHospitalB against fixture raw data — no
 * network/database dependency. Live end-to-end coverage against the real
 * Postgres-backed Hospital B API lives in
 * tests/integration/hospitalBSourceApi.integration.test.ts.
 */
function rawBundle(overrides: Partial<HospitalBRawPatient> = {}): RawSourceBundle<HospitalBRawPatient["patientRecord"]> {
  const base: HospitalBRawPatient = {
    patientRecord: {
      hb_patient_id: "HB-HN-22190",
      identifiers: { nationalId: "SYN-8801015800083", hospitalNumber: "HB-HN-22190" },
      demographics: {
        fullName: { first: null, middle: null, last: "Nkosi", initials: "T." },
        genderCode: "2",
        dateOfBirth: "1988-01-01",
        telecom: { mobile: "+27821234567", email: "thandiwe.nkosi@example.co.za" },
        residentialAddress: "12 Protea Street",
        suburb: "Soweto",
        region: "Gauteng",
        postCode: "1818",
      },
    },
    admissions: [
      {
        admissionId: "HB-A-6001",
        hb_patient_id: "HB-HN-22190",
        admissionStatus: "DISCHARGED",
        careLevel: "EMERGENCY",
        admittedAtUtc: "2026-04-10T14:00:00Z",
        dischargedAtUtc: "2026-04-10T18:30:00Z",
      },
    ],
    observations: [
      {
        obsId: "HB-O-7001",
        hb_patient_id: "HB-HN-22190",
        obsStatus: "FINAL",
        domain: "PATHOLOGY",
        loincLikeCode: "HB-GLU-01",
        description: "Blood Glucose (Fasting)",
        observedAtUtc: "2026-04-10T14:20:00Z",
        measurement: { amount: 7.1, units: "mmol/L" },
      },
    ],
    medications: [
      {
        medId: "HB-M-8001",
        hb_patient_id: "HB-HN-22190",
        medStatus: "ONGOING",
        formularyCode: "HBF-MET-500",
        formularyDisplay: "Metformin 500mg",
        freeTextFallback: null,
        prescribedAtUtc: "2026-04-10T18:00:00Z",
        dosageInstructions: "One tablet twice daily with food",
      },
    ],
  };
  return { ...base, ...overrides } as unknown as RawSourceBundle<HospitalBRawPatient["patientRecord"]>;
}

describe("Hospital B translate", () => {
  it("translates native shape to a canonical bundle that validates against the shared schemas", () => {
    const warnings: AdapterWarning[] = [];
    const bundle = translateHospitalB(rawBundle(), warnings);

    const patient = canonicalPatientSchema.parse(bundle.patient);
    expect(patient.name.family).toBe("Nkosi");
    expect(patient.name.given).toEqual(["T."]); // initials-only, no given name in this legacy source
    expect(patient.gender).toBe("female");
    expect(patient.birthDate).toBe("1988-01-01");
    expect(patient.identifiers.some((i) => i.value === "SYN-8801015800083")).toBe(true);
    expect(patient.address.line).toBe("12 Protea Street");

    const [encounter] = bundle.encounters.map((e) => canonicalEncounterSchema.parse(e));
    expect(encounter.status).toBe("finished");
    expect(encounter.class).toBe("emergency");

    const [observation] = bundle.observations.map((o) => canonicalObservationSchema.parse(o));
    expect(observation.value).toEqual({ value: 7.1, unit: "mmol/L" });

    const [medication] = bundle.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));
    expect(medication.medication).toEqual({
      kind: "coded",
      system: "hospital-b-formulary",
      code: "HBF-MET-500",
      display: "Metformin 500mg",
    });

    expect(warnings).toHaveLength(0);
  });

  it("parses DD/MM/YYYY, DD-MM-YYYY, and 'D MMM YYYY' date formats without crashing", () => {
    const warnings: AdapterWarning[] = [];

    const ddmmyyyy = translateHospitalB(
      rawBundle({
        patientRecord: {
          hb_patient_id: "HB-HN-30021",
          identifiers: { nationalId: "SYN-9506201800099", hospitalNumber: "HB-HN-30021" },
          demographics: {
            fullName: { first: null, middle: null, last: "Mokoena", initials: "N.A." },
            genderCode: "2",
            dateOfBirth: "20/06/1995",
            telecom: { mobile: null, email: null },
            residentialAddress: null,
            suburb: "Polokwane",
            region: "Limpopo",
            postCode: null,
          },
        },
        admissions: [],
        observations: [],
        medications: [],
      }),
      warnings
    );
    expect(ddmmyyyy.patient.birthDate).toBe("1995-06-20");

    const dashFormat = translateHospitalB(
      rawBundle({
        patientRecord: {
          hb_patient_id: "HB-HN-30298",
          identifiers: { nationalId: "SYN-8809224800045", hospitalNumber: "HB-HN-30298" },
          demographics: {
            fullName: { first: null, middle: null, last: "Baloyi", initials: "S.T." },
            genderCode: "2",
            dateOfBirth: "22-09-1988",
            telecom: { mobile: null, email: null },
            residentialAddress: null,
            suburb: null,
            region: null,
            postCode: null,
          },
        },
        admissions: [],
        observations: [],
        medications: [],
      }),
      warnings
    );
    expect(dashFormat.patient.birthDate).toBe("1988-09-22");

    const monthName = translateHospitalB(
      rawBundle({
        patientRecord: {
          hb_patient_id: "HB-HN-30099",
          identifiers: { nationalId: null, hospitalNumber: "HB-HN-30099" },
          demographics: {
            fullName: { first: null, middle: null, last: "Mabaso", initials: "P." },
            genderCode: "1",
            dateOfBirth: "14 Mar 1979",
            telecom: { mobile: null, email: null },
            residentialAddress: null,
            suburb: null,
            region: null,
            postCode: null,
          },
        },
        admissions: [],
        observations: [],
        medications: [],
      }),
      warnings
    );
    expect(monthName.patient.birthDate).toBe("1979-03-14");
  });

  it("logs a warning and defaults to 'unknown' unit when an observation has no recorded unit", () => {
    const warnings: AdapterWarning[] = [];
    const messy = rawBundle({
      observations: [
        {
          obsId: "HB-O-7002",
          hb_patient_id: "HB-HN-22190",
          obsStatus: "FINAL",
          domain: "PATHOLOGY",
          loincLikeCode: "HB-GLU-01",
          description: "Blood Glucose (Fasting)",
          observedAtUtc: "02/04/2026 08:10",
          measurement: { amount: 5.4, units: null },
        },
      ],
    });

    const bundle = translateHospitalB(messy, warnings);
    const [observation] = bundle.observations.map((o) => canonicalObservationSchema.parse(o));

    expect(observation.value.unit).toBe("unknown");
    expect(warnings.some((w) => w.message.match(/no recorded unit/i))).toBe(true);
  });

  it("logs a warning but still produces a valid canonical patient when nationalId is null", () => {
    const warnings: AdapterWarning[] = [];
    const messy = rawBundle({
      patientRecord: {
        hb_patient_id: "HB-HN-30099",
        identifiers: { nationalId: null, hospitalNumber: "HB-HN-30099" },
        demographics: {
          fullName: { first: null, middle: null, last: "Mabaso", initials: "P." },
          genderCode: "1",
          dateOfBirth: "1979-03-14",
          telecom: { mobile: "+27849001122", email: "p.mabaso@example.co.za" },
          residentialAddress: "3 Baker Street",
          suburb: "Kimberley",
          region: "Northern Cape",
          postCode: "8301",
        },
      },
    });

    const bundle = translateHospitalB(messy, warnings);
    expect(() => canonicalPatientSchema.parse(bundle.patient)).not.toThrow();
    expect(warnings.some((w) => w.message.includes("No national id"))).toBe(true);
  });

  it("does not throw and logs a warning for an unparseable date string", () => {
    const warnings: AdapterWarning[] = [];
    const messy = rawBundle({
      patientRecord: {
        hb_patient_id: "HB-HN-99999",
        identifiers: { nationalId: "SYN-0000000000000", hospitalNumber: "HB-HN-99999" },
        demographics: {
          fullName: { first: null, middle: null, last: "Test", initials: "X." },
          genderCode: "9",
          dateOfBirth: "not-a-real-date",
          telecom: { mobile: null, email: null },
          residentialAddress: null,
          suburb: null,
          region: null,
          postCode: null,
        },
      },
    });

    expect(() => translateHospitalB(messy, warnings)).not.toThrow();
    expect(warnings.some((w) => w.message.includes("Could not parse"))).toBe(true);
  });
});
