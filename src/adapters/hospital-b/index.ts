import type { RawSourceBundle, SourceAdapter } from "../../types/sourceAdapter.js";
import { loadSourceConnection } from "../../config/loadConfig.js";
import { translateHospitalB } from "./translate.js";
import type { HospitalBRawPatient } from "./types.js";

const SOURCE_ID = "hospital-b";

/**
 * Self-registering adapter for Hospital B. The registry discovers this module
 * by its default export — no other file needs to know Hospital B exists.
 *
 * fetchPatient now calls Hospital B's own standalone Postgres-backed API
 * (sources/hospital-b-api/), authenticated with a static bearer API key,
 * instead of the in-memory mock data used before this revision. The
 * SourceAdapter interface and registration are unchanged.
 */
const hospitalBAdapter: SourceAdapter<HospitalBRawPatient["patientRecord"]> = {
  id: SOURCE_ID,
  displayName: "Hospital B (simulated tertiary hospital system)",

  async fetchPatient(sourcePatientId) {
    const connection = loadSourceConnection(SOURCE_ID) as { baseUrl: string; apiKey: string };

    const response = await fetch(`${connection.baseUrl}/patients/${encodeURIComponent(sourcePatientId)}`, {
      headers: { Authorization: `Bearer ${connection.apiKey}` },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Hospital B source API returned ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    return body as RawSourceBundle<HospitalBRawPatient["patientRecord"]>;
  },

  translate(raw, warnings) {
    return translateHospitalB(raw, warnings);
  },
};

export default hospitalBAdapter;
