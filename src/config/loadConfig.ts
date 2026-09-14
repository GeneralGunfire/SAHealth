import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const sourceConfigSchema = z.object({
  id: z.string().min(1),
  connection: z.record(z.string(), z.unknown()),
});

const configSchema = z.object({
  activeSources: z.array(sourceConfigSchema),
});

export type SourceConfig = z.infer<typeof sourceConfigSchema>;
export type AppConfig = z.infer<typeof configSchema>;

const CONFIG_PATH = fileURLToPath(new URL("./sources.json", import.meta.url));

/**
 * Loads which adapters are active and their connection details.
 * Externalised per the extensibility requirement: activating a new source
 * (once its adapter folder exists) never requires a code change, only an
 * entry here. In a later phase this can be swapped for a DB-backed table
 * without any change to the registry or orchestrator.
 */
export function loadConfig(): AppConfig {
  const raw = readFileSync(CONFIG_PATH, "utf-8");
  return configSchema.parse(JSON.parse(raw));
}

/**
 * Convenience for an adapter to read its own `connection` block without
 * needing to know about any other source's config entry. Adapters call
 * this with their own `id` — never another source's — keeping each
 * adapter's knowledge scoped to itself.
 */
export function loadSourceConnection(sourceId: string): Record<string, unknown> {
  const config = loadConfig();
  const entry = config.activeSources.find((s) => s.id === sourceId);
  if (!entry) {
    throw new Error(`No active source config entry found for "${sourceId}".`);
  }
  return entry.connection;
}
