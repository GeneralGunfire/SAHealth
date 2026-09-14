import type { RawSourceBundle, SourceAdapter } from "../../types/sourceAdapter.js";
import { loadSourceConnection } from "../../config/loadConfig.js";
import { translatePharmacyE } from "./translate.js";
import type { PharmacyERawPatient } from "./types.js";

const SOURCE_ID = "pharmacy-e";

/**
 * Self-registering adapter for Pharmacy E (a dispensing feed). The
 * registry discovers this module by its default export — no other file
 * needs to know Pharmacy E exists.
 *
 * This is the fifth source in the project, and the first one drafted with
 * AI assistance (see docs/ai-assisted-adapter-generation.md for the full,
 * honest review record) before being corrected by hand and accepted here —
 * same registration pattern as every other adapter regardless of how it
 * was authored.
 */
const pharmacyEAdapter: SourceAdapter<PharmacyERawPatient["pat"]> = {
  id: SOURCE_ID,
  displayName: "Pharmacy E (simulated dispensing feed)",

  async fetchPatient(sourcePatientId) {
    const connection = loadSourceConnection(SOURCE_ID) as { baseUrl: string; apiKey: string };

    const response = await fetch(`${connection.baseUrl}/patients/${encodeURIComponent(sourcePatientId)}`, {
      headers: { Authorization: `Bearer ${connection.apiKey}` },
    });

    if (response.status === 404) return null;
    if (!response.ok) {
      throw new Error(`Pharmacy E API returned ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    return body as RawSourceBundle<PharmacyERawPatient["pat"]>;
  },

  translate(raw, warnings) {
    return translatePharmacyE(raw, warnings);
  },
};

export default pharmacyEAdapter;
