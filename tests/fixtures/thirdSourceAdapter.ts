import type { CanonicalBundle, RawSourceBundle, SourceAdapter } from "../../src/types/sourceAdapter.js";

/**
 * A throwaway third source adapter, used only by
 * tests/core/orchestrator.thirdSource.test.ts to prove the extensibility
 * claim: registering a new source requires touching only this file and the
 * test's own registry construction — no change to core/, canonical/, or
 * either of the other two adapters.
 */

interface ThirdSourceRawPatient {
  id: string;
  natId: string;
  givenName: string;
  familyName: string;
}

const mockData: Record<string, ThirdSourceRawPatient> = {
  "TS-001": { id: "TS-001", natId: "SYN-8801015800083", givenName: "Thandiwe", familyName: "Nkosi" },
};

function translate(raw: RawSourceBundle<ThirdSourceRawPatient>): CanonicalBundle {
  const p = raw.patient;
  return {
    patient: {
      resourceType: "Patient",
      id: p.id,
      identifiers: [{ system: "hospital-b-national-id", value: p.natId }],
      name: { given: [p.givenName], family: p.familyName },
      gender: "female",
      birthDate: "1988-01-01",
      contact: { phone: null, email: null },
      address: { line: null, city: null, province: null, postalCode: null },
      sourceRecords: [{ sourceId: "third-source", sourceRecordId: p.id }],
    },
    encounters: [],
    observations: [],
    medicationStatements: [],
  };
}

const thirdSourceAdapter: SourceAdapter<ThirdSourceRawPatient> = {
  id: "third-source",
  displayName: "Third Source (test-only dummy)",

  async fetchPatient(sourcePatientId) {
    const record = mockData[sourcePatientId];
    if (!record) return null;
    return { patient: record, encounters: [], observations: [], medicationStatements: [] };
  },

  translate(raw) {
    return translate(raw);
  },
};

export default thirdSourceAdapter;
