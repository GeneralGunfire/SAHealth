import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import httpProxy from "@fastify/http-proxy";

// Step 3: fail-fast config validation. The gateway has no secrets of its
// own (BACKEND_URL is derived from BACKEND_PORT, not a credential) — PORT
// and BACKEND_PORT are the only values that would otherwise silently
// become NaN on a malformed input, so both are format-checked eagerly.
for (const envVarName of ["PORT", "BACKEND_PORT"]) {
  const value = process.env[envVarName];
  if (value !== undefined && !/^\d+$/.test(value)) {
    console.error(`FATAL: sa-health-gateway cannot start — ${envVarName} is set to an invalid value ("${value}"). Must be a positive integer.`);
    process.exit(1);
  }
}

/**
 * Lightweight native API gateway (Step 2). Sits in front of the backend
 * (src/api/server.ts, now internal-only on BACKEND_PORT) and is the
 * public-facing entry point at PORT (default 3000) — the address the
 * backend used to occupy directly, so external callers see no contract
 * change.
 *
 * This is deliberately NOT Kong and NOT containerised: a plain Fastify
 * instance using two well-established plugins (@fastify/rate-limit,
 * @fastify/http-proxy). It is purely additive — the backend's routes,
 * consent enforcement, and audit logging are completely unmodified; this
 * process only adds centralised rate limiting, request logging, and
 * routing before a request ever reaches the backend.
 */
// Same structured-logging scheme as the backend (src/api/server.ts) and
// src/core/logger.ts: JSON to stdout, a `service` field identifying this
// process, and Fastify's default per-request `requestId`.
const gateway = Fastify({
  logger: {
    base: { service: "sa-health-gateway" },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
});

const BACKEND_URL = `http://localhost:${process.env.BACKEND_PORT ?? 3010}`;

await gateway.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX ?? 20),
  timeWindow: process.env.RATE_LIMIT_WINDOW ?? "1 minute",
  // Step 5: standardise the rate-limit rejection onto the same
  // { error: { code, message, details? } } shape as everything else this
  // gateway/backend send, instead of @fastify/rate-limit's own default body.
  errorResponseBuilder: (_request, context) => ({
    error: {
      code: "rate-limited",
      message: `Rate limit exceeded. Try again in ${context.after}.`,
      details: { max: context.max, ttlMs: context.ttl },
    },
  }),
});

// Centralised request logging: every request that passes through the
// gateway is logged here, before Medplum-equivalent consent/audit logic
// (which remains entirely inside the backend) ever runs.
gateway.addHook("onRequest", async (request) => {
  request.log.info({ method: request.method, url: request.url }, "gateway: incoming request");
});

// Step 2: a gateway-local /health, answered without ever reaching the
// backend — the fastest possible signal that the public-facing process
// itself is up, independent of the backend's own state. The backend's own
// deep /healthz still proxies through normally via the catch-all below.
gateway.get("/health", async (_request, reply) => reply.send({ status: "ok" }));

await gateway.register(httpProxy, {
  upstream: BACKEND_URL,
  prefix: "/",
  rewritePrefix: "/",
});

const port = Number(process.env.PORT ?? 3000);

gateway
  .listen({ port, host: "0.0.0.0" })
  .then(() => gateway.log.info(`SA Health API gateway listening on port ${port}, proxying to ${BACKEND_URL}`))
  .catch((err) => {
    gateway.log.error(err);
    process.exit(1);
  });
