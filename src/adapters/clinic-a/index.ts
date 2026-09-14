import type { RawSourceBundle, SourceAdapter } from "../../types/sourceAdapter.js";
import { loadSourceConnection } from "../../config/loadConfig.js";
import { translateClinicA } from "./translate.js";
import type { ClinicARawPatient } from "./types.js";

const SOURCE_ID = "clinic-a";

/**
 * Self-registering adapter for Clinic A. The registry discovers this module
 * by its default export — no other file needs to know Clinic A exists.
 *
 * fetchPatient now calls Clinic A's own standalone Postgres-backed API
 * (sources/clinic-a-api/), authenticated with a static bearer API key,
 * instead of the in-memory mock data used before this revision. The
 * SourceAdapter interface and registration are unchanged.
 */
const clinicAAdapter: SourceAdapter<ClinicARawPatient["patient"]> = {
  id: SOURCE_ID,
  displayName: "Clinic A (simulated local clinic system)",

  async fetchPatient(sourcePatientId) {
    const connection = loadSourceConnection(SOURCE_ID) as { baseUrl: string; apiKey: string };

    const response = await fetch(`${connection.baseUrl}/patients/${encodeURIComponent(sourcePatientId)}`, {
      headers: { Authorization: `Bearer ${connection.apiKey}` },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Clinic A source API returned ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    return body as RawSourceBundle<ClinicARawPatient["patient"]>;
  },

  translate(raw, warnings) {
    return translateClinicA(raw, warnings);
  },
};

export default clinicAAdapter;
