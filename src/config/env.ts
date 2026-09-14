import { z } from "zod";

/**
 * Fail-fast environment validation for the main backend process (Step 3).
 * Runs once at module import time — before server.ts calls app.listen() —
 * so a missing/invalid value crashes immediately with a specific error
 * message, never on the first real request that happens to touch it.
 *
 * Only CONSENT_TOKEN_SIGNING_KEY is genuinely required: it is the one
 * backend secret with no safe default (the hardcoded fallback in
 * signingKey.ts is a known prototype-only shortcut, not something to rely
 * on). Everything else already has a safe, working dev-mode default
 * (ports, the DB connection string, the probabilistic-matching sidecar
 * URL) — those stay optional, but are still type/format-checked here so a
 * malformed value (e.g. BACKEND_PORT="abc") fails at startup instead of
 * silently becoming NaN and misbehaving on the first request.
 */
const envSchema = z.object({
  CONSENT_TOKEN_SIGNING_KEY: z.string().min(1, "CONSENT_TOKEN_SIGNING_KEY must not be empty if set"),
  BACKEND_PORT: z
    .string()
    .regex(/^\d+$/, "BACKEND_PORT must be a positive integer")
    .optional(),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid connection URL").optional(),
  PROBABILISTIC_MATCHING_SIDECAR_URL: z.string().url("PROBABILISTIC_MATCHING_SIDECAR_URL must be a valid URL").optional(),
});

function validateEnv() {
  // CONSENT_TOKEN_SIGNING_KEY is checked separately from the rest of the
  // schema (which .parse()s the whole optional set) so its specific,
  // named absence produces the clearest possible message — the exact
  // failure mode Step 3 exists to eliminate.
  if (!process.env.CONSENT_TOKEN_SIGNING_KEY) {
    console.error(
      "FATAL: CONSENT_TOKEN_SIGNING_KEY is not set. This backend cannot start without it — " +
        "consent tokens would otherwise be signed with a hardcoded, publicly-known prototype secret. " +
        "Set CONSENT_TOKEN_SIGNING_KEY to a long random value (see .env.example)."
    );
    process.exit(1);
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("FATAL: invalid environment configuration for the backend:");
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }
}

validateEnv();
