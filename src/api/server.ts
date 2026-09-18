import "../config/env.js"; // Step 3: fail-fast env validation — must run before any other import that reads process.env (e.g. signingKey.ts)
import Fastify from "fastify";
import { ZodError } from "zod";
import { sendError } from "./errors.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { patientRoutes } from "./routes/patient.js";
import { consentRoutes } from "./routes/consent.js";
import { auditRoutes } from "./routes/audit.js";
import { healthRoutes } from "./routes/health.js";
import { startOutboxPublisher, stopOutboxPublisher } from "../core/audit/outboxPublisher.js";
import { generateOpenApiDocument } from "./docs/openapi.js";
import { installGracefulShutdown } from "../core/shutdown.js";
import { pool } from "../db/pool.js";

// Fastify's built-in logger is pino; configured here with a `service` field
// and per-request `requestId` (Fastify's default reqId generator) so every
// log line from this process matches the same structured-logging scheme as
// src/core/logger.ts. JSON to stdout only — no log aggregation (Backend_Research.docx
// Section 11.1 defers centralised logging infrastructure to production hardening).
const app = Fastify({
  logger: {
    base: { service: "sa-health-backend" },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
});

// OpenAPI docs (Step 1): a static, pre-built document (see
// src/api/docs/openapi.ts) generated from the project's existing Zod
// schemas via @asteasolutions/zod-to-openapi, rather than Fastify's
// route-schema auto-generation — the routes below don't declare Fastify
// `schema` blocks, so the docs are authored once, explicitly, in one place
// rather than scattered across every route file.
// The generated document's TypeScript type comes from `openapi3-ts` (via
// zod-to-openapi), while @fastify/swagger's own types come from
// `openapi-types` — two structurally-compatible but nominally different
// OpenAPI type packages. The actual JSON shape is a valid OpenAPI 3.1
// document either way; this cast only resolves the type-package mismatch,
// not a real shape difference.
await app.register(swagger, {
  mode: "static",
  specification: { document: generateOpenApiDocument() as never },
});
await app.register(swaggerUi, { routePrefix: "/docs" });

// Step 5: standardised error shape { error: { code, message, details? } }
// for every response this process sends — route-level ad-hoc sends now go
// through sendError() (src/api/errors.ts); this global handler covers what
// no route-level code catches: Zod .parse() throws from request
// validation (validation-failed) and any other uncaught error
// (internal-error). Consent/audit/orchestrator/matching logic is
// unchanged — this only standardises how already-thrown errors are
// reported to the client.
app.setErrorHandler((err: Error & { statusCode?: number }, request, reply) => {
  if (err instanceof ZodError) {
    return sendError(reply, 400, "validation-failed", "Request failed validation.", {
      issues: err.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
    });
  }
  if (err.statusCode === 429) {
    return sendError(reply, 429, "rate-limited", "Too many requests.");
  }
  request.log.error(err);
  return sendError(reply, err.statusCode ?? 500, "internal-error", "An unexpected error occurred.");
});

app.setNotFoundHandler((_request, reply) => {
  return sendError(reply, 404, "not-found", "No route matches this request.");
});

await app.register(healthRoutes);
await app.register(patientRoutes);
await app.register(consentRoutes);
await app.register(auditRoutes);

// Step 3: background outbox publisher, draining audit_outbox into
// audit_events. Runs for the lifetime of this process; stopped on shutdown
// so a graceful close doesn't leave an interval running against a closed pool.
const outboxTimer = startOutboxPublisher();
app.addHook("onClose", async () => {
  // Stops the interval AND awaits any publish attempt already in progress,
  // so the pool below is never closed out from under a half-finished publish.
  await stopOutboxPublisher(outboxTimer);
});

// Graceful shutdown on SIGTERM/SIGINT: drain in-flight requests (10s), run
// the onClose hook above, then close the DB pool. Exit 0 clean, 1 if the
// drain had to be force-closed. Purely operational — no request-handling,
// consent, audit or matching behaviour changes.
installGracefulShutdown(app, {
  timeoutMs: 10_000,
  onCleanup: async () => {
    await pool.end();
  },
});

// Internal-only port: the gateway (src/api/gateway.ts) is the public-facing
// entry point at PORT (default 3000) and proxies through to this backend.
// This backend's own route/consent/audit contract is unchanged — only the
// port it binds to moved, so that the gateway can occupy the previously
// public address without altering how routes, consent, or audit behave.
const port = Number(process.env.BACKEND_PORT ?? 3010);

app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`SA Health interop backend (internal) listening on port ${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });

// Consent enforcement and audit logging are applied per-route via
// consentGuard() (preHandler) and auditedQuery()/record() (see
// src/core/consent/ and src/core/audit/) rather than as a single global
// hook, since the audit-trail route logs a different operation type than
// the patient-query route despite sharing the same guard.
