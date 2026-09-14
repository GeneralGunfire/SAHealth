import { describe, expect, it } from "vitest";
import { translatePharmacyE } from "../../src/adapters/pharmacy-e/translate.js";
import type { AdapterWarning, RawSourceBundle } from "../../src/types/sourceAdapter.js";
import type { PharmacyERawPatient } from "../../src/adapters/pharmacy-e/types.js";
import {
  canonicalPatientSchema,
  canonicalMedicationStatementSchema,
} from "../../src/canonical/index.js";

/**
 * Pure unit tests for translatePharmacyE against fixture raw data — no
 * network/database dependency. This adapter began as an AI-generated draft
 * (see docs/ai-assisted-adapter-generation.md); this test file is the
 * hand-corrected version, not the AI-generated one (see
 * src/adapters/_drafts/pharmacy-e/translate.draft.test.ts for the original).
 */
function rawBundle(overrides: Partial<PharmacyERawPatient> = {}): RawSourceBundle<PharmacyERawPatient["pat"]> {
  const base: PharmacyERawPatient = {
    pat: {
      pid: "PHE-0042",
      sur: "Mokwena",
      gv: "Thabo",
      dob: "15-MAR-1979",
      sx: "M",
      cell: "0731234567",
      nid: "SYN-7903155800012",
    },
    rx: [
      {
        rxid: "RX-88291",
        pid: "PHE-0042",
        drugcd: "ATORVA20",
        drugnm: "Atorvastatin 20mg",
        qtydisp: 30,
        dayssup: 30,
        sig: "1 tab nocte",
        dtdisp: "03-FEB-2026",
        rxstat: "DISP",
      },
    ],
  };
  return { ...base, ...overrides } as unknown as RawSourceBundle<PharmacyERawPatient["pat"]>;
}

describe("Pharmacy E translate", () => {
  it("translates the dispensing-feed native shape into a valid canonical bundle, with no encounters/observations", () => {
    const warnings: AdapterWarning[] = [];
    const bundle = translatePharmacyE(rawBundle(), warnings);

    const patient = canonicalPatientSchema.parse(bundle.patient);
    expect(patient.name).toEqual({ given: ["Thabo"], family: "Mokwena" });
    expect(patient.gender).toBe("male");
    expect(patient.birthDate).toBe("1979-03-15"); // "15-MAR-1979" -> ISO date
    expect(patient.identifiers.some((i) => i.value === "SYN-7903155800012")).toBe(true);

    // Pharmacy E is a dispensing feed: no encounter or observation concept exists at all.
    expect(bundle.encounters).toEqual([]);
    expect(bundle.observations).toEqual([]);

    const [medication] = bundle.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));
    expect(medication.medication).toEqual({
      kind: "coded",
      system: "pharmacy-e-drug-codes",
      code: "ATORVA20",
      display: "Atorvastatin 20mg",
    });
    expect(medication.dosageText).toBe("1 tab nocte");
    expect(medication.effectiveDateTime).toBe("2026-02-03T00:00:00Z");

    // CORRECTED from the AI draft: "DISP" maps to "completed", not "active" —
    // see translate.ts's mapRxStatus for the full reasoning. This is the
    // single most important behavioural correction from the original draft.
    expect(medication.status).toBe("completed");
    expect(warnings.some((w) => w.message.includes('cannot confirm the patient is still taking it'))).toBe(true);
  });

  it("falls back to free-text medication when drugcd is null (OTC item with no formulary code)", () => {
    const warnings: AdapterWarning[] = [];
    const otc = rawBundle({
      rx: [
        {
          rxid: "RX-88295",
          pid: "PHE-0042",
          drugcd: null,
          drugnm: "Multivitamin (OTC, no code on file)",
          qtydisp: 1,
          dayssup: 30,
          sig: "1 daily",
          dtdisp: "03-FEB-2026",
          rxstat: "DISP",
        },
      ],
    });

    const bundle = translatePharmacyE(otc, warnings);
    const [medication] = bundle.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));
    expect(medication.medication).toEqual({ kind: "text", text: "Multivitamin (OTC, no code on file)" });
  });

  it("maps CANC to stopped", () => {
    const warnings: AdapterWarning[] = [];
    const cancelled = rawBundle({
      rx: [
        {
          rxid: "RX-90110",
          pid: "PHE-0042",
          drugcd: "METFOR500",
          drugnm: "Metformin 500mg",
          qtydisp: 60,
          dayssup: 30,
          sig: "1 tab bd",
          dtdisp: "01-MAR-2026",
          rxstat: "CANC",
        },
      ],
    });

    const bundle = translatePharmacyE(cancelled, warnings);
    const [medication] = bundle.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));
    expect(medication.status).toBe("stopped");
  });

  it("logs a warning but still produces a valid canonical patient when no national id is on file", () => {
    const warnings: AdapterWarning[] = [];
    const noNid = rawBundle({
      pat: {
        pid: "PHE-0044",
        sur: "Steyn",
        gv: "Johan",
        dob: "09-NOV-1990",
        sx: "M",
        cell: null,
        nid: null,
      },
      rx: [],
    });

    const bundle = translatePharmacyE(noNid, warnings);
    expect(() => canonicalPatientSchema.parse(bundle.patient)).not.toThrow();
    expect(warnings.some((w) => w.message.includes("No national id on file"))).toBe(true);
  });

  it("logs a warning that qtydisp/dayssup have no canonical home and are not carried forward", () => {
    const warnings: AdapterWarning[] = [];
    translatePharmacyE(rawBundle(), warnings);
    expect(warnings.some((w) => w.message.includes("qtydisp") && w.message.includes("dayssup"))).toBe(true);
  });

  it("logs a warning and passes through unparsed for an unrecognised date format", () => {
    const warnings: AdapterWarning[] = [];
    const badDate = rawBundle({
      pat: {
        pid: "PHE-0099",
        sur: "Test",
        gv: "Test",
        dob: "not-a-date",
        sx: "M",
        cell: null,
        nid: "SYN-0000000000000",
      },
      rx: [],
    });

    expect(() => translatePharmacyE(badDate, warnings)).not.toThrow();
    expect(warnings.some((w) => w.message.includes("Could not parse"))).toBe(true);
  });
});
