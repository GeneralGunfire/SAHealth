import type { RawSourceBundle, SourceAdapter } from "../../types/sourceAdapter.js";
import { loadSourceConnection } from "../../config/loadConfig.js";
import { translateHprsStyleD } from "./translate.js";
import type { HprsRawPatient } from "./types.js";

const SOURCE_ID = "hprs-style-d";

/**
 * Self-registering adapter for Source D (HPRS-style national system,
 * SQLite-backed). The registry discovers this module by its default
 * export — no other file needs to know Source D exists, and nothing about
 * this adapter or the core cares that its backing store is SQLite rather
 * than Postgres, since it is only ever reached over HTTP like every other
 * source.
 */
const hprsStyleDAdapter: SourceAdapter<HprsRawPatient["patient"]> = {
  id: SOURCE_ID,
  displayName: "Source D (simulated HPRS-style national system, SQLite-backed)",

  async fetchPatient(sourcePatientId) {
    const connection = loadSourceConnection(SOURCE_ID) as { baseUrl: string; apiKey: string };

    const response = await fetch(`${connection.baseUrl}/patients/${encodeURIComponent(sourcePatientId)}`, {
      headers: { Authorization: `Bearer ${connection.apiKey}` },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Source D API returned ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    return body as RawSourceBundle<HprsRawPatient["patient"]>;
  },

  translate(raw, warnings) {
    return translateHprsStyleD(raw, warnings);
  },
};

export default hprsStyleDAdapter;
