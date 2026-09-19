import { readdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import type { SourceAdapter } from "../types/sourceAdapter.js";
import { loadConfig } from "../config/loadConfig.js";
import { withTransientRetry } from "../adapters/retry.js";

/**
 * Returns the adapter with its fetchPatient wrapped in transient-failure
 * retry. Everything else about the adapter — id, displayName, translate — is
 * passed through untouched, so the SourceAdapter contract is unchanged and
 * the orchestrator cannot tell the difference except that a brief blip no
 * longer surfaces as a failed source.
 */
function withRetryingFetch(adapter: SourceAdapter): SourceAdapter {
  return {
    ...adapter,
    fetchPatient: (sourcePatientId: string) =>
      withTransientRetry(adapter.id, () => adapter.fetchPatient(sourcePatientId)),
  };
}

const ADAPTERS_DIR = fileURLToPath(new URL("../adapters/", import.meta.url));

/**
 * Discovers every adapter folder under src/adapters/ (each must export a
 * SourceAdapter as its default export from index.ts), then filters to only
 * the ids listed as active in config. This is the single mechanism through
 * which the core learns about adapters — it never imports a specific
 * adapter by name. Adding source #3 requires a new folder + a config
 * entry; this file does not change.
 */
export async function buildAdapterRegistry(): Promise<Map<string, SourceAdapter>> {
  const config = loadConfig();
  const activeIds = new Set(config.activeSources.map((s) => s.id));

  const entries = readdirSync(ADAPTERS_DIR, { withFileTypes: true }).filter(
    (e) => e.isDirectory() && !e.name.startsWith("_")
  );

  const registry = new Map<string, SourceAdapter>();

  for (const entry of entries) {
    if (!activeIds.has(entry.name)) continue;

    const indexPath = path.join(ADAPTERS_DIR, entry.name, "index.js");
    const moduleUrl = pathToFileURL(indexPath).href;
    const mod = (await import(moduleUrl)) as { default: SourceAdapter };
    const adapter = mod.default;

    if (!adapter || typeof adapter.fetchPatient !== "function" || typeof adapter.translate !== "function") {
      throw new Error(`Adapter folder "${entry.name}" does not export a valid SourceAdapter as default export.`);
    }
    if (adapter.id !== entry.name) {
      throw new Error(`Adapter in folder "${entry.name}" declares id "${adapter.id}"; folder name and id must match.`);
    }

    // Step 2: wrap fetchPatient with transient-failure retry (see
    // src/adapters/retry.ts). Applied here, at the one place every adapter
    // is loaded, so all five — and any adapter added later — get identical
    // retry behaviour without each index.ts repeating it, and without the
    // orchestrator's failure-isolation logic changing at all. translate()
    // is deliberately NOT wrapped: it is pure, local, and cannot fail
    // transiently.
    registry.set(adapter.id, withRetryingFetch(adapter));
  }

  return registry;
}
