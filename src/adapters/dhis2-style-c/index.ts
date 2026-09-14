import type { RawSourceBundle, SourceAdapter } from "../../types/sourceAdapter.js";
import { loadSourceConnection } from "../../config/loadConfig.js";
import { translateDhis2StyleC } from "./translate.js";
import type { Dhis2RawPatient } from "./types.js";

const SOURCE_ID = "dhis2-style-c";

/**
 * Self-registering adapter for Source C (DHIS2-style public-sector
 * tracker). The registry discovers this module by its default export — no
 * other file needs to know Source C exists.
 */
const dhis2StyleCAdapter: SourceAdapter<Dhis2RawPatient["trackedEntity"]> = {
  id: SOURCE_ID,
  displayName: "Source C (simulated DHIS2-style public-sector tracker)",

  async fetchPatient(sourcePatientId) {
    const connection = loadSourceConnection(SOURCE_ID) as { baseUrl: string; apiKey: string };

    const response = await fetch(`${connection.baseUrl}/tracked-entities/${encodeURIComponent(sourcePatientId)}`, {
      headers: { Authorization: `Bearer ${connection.apiKey}` },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Source C API returned ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    return body as RawSourceBundle<Dhis2RawPatient["trackedEntity"]>;
  },

  translate(raw, warnings) {
    return translateDhis2StyleC(raw, warnings);
  },
};

export default dhis2StyleCAdapter;
