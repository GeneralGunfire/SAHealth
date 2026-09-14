import "./zodOpenApiSetup.js"; // must run before any .openapi() call below
import { z } from "zod";
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import {
  consentResourceTypeSchema,
  consentTokenClaimsSchema,
  canonicalPatientSchema,
  canonicalEncounterSchema,
  canonicalObservationSchema,
  canonicalMedicationStatementSchema,
} from "../../canonical/index.js";

/**
 * Builds the full OpenAPI 3.1 document for the backend's real routes, using
 * the project's existing Zod schemas as the source of truth wherever one
 * exists (per Step 1's tradeoff: automated conversion via
 * @asteasolutions/zod-to-openapi rather than hand-mirrored JSON Schema, so
 * a canonical schema change can never silently drift out of sync with the
 * docs — the Zod v4 upgrade this required was verified against the full
 * 62-test suite before this file was written).
 *
 * This module only DESCRIBES existing schemas for documentation purposes —
 * it does not modify src/canonical/*, src/core/consent/*, or
 * src/core/audit/* in any way.
 */
const registry = new OpenAPIRegistry();

const bearerAuth = registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description:
    "A consent token issued via POST /consent/tokens. Required on every /patients/* route — this project has no user accounts; the consent token IS the access-control model.",
});

// ---- Shared response schemas ----

const sourceStatusSchema = z
  .object({
    sourceId: z.string(),
    displayName: z.string(),
    queried: z.boolean().openapi({
      description:
        "False when this source was never attempted at all (e.g. no identifier mapping exists for it) — distinct from `reachable: false`, which means it WAS attempted and failed.",
    }),
    reachable: z.boolean(),
    responseTimeMs: z.number().nullable(),
    queriedAt: z.string().openapi({ format: "date-time" }),
    reason: z
      .enum(["timeout", "connection-refused", "auth-failure", "invalid-response", "unknown"])
      .nullable()
      .openapi({ description: "Only set when queried is true and reachable is false." }),
  })
  .openapi("SourceStatus");

const warningSchema = z
  .object({
    sourceId: z.string(),
    sourceRecordId: z.string(),
    message: z.string(),
  })
  .openapi("AdapterWarning");

const orchestratorResultSchema = z
  .object({
    canonicalPatientId: z.string().nullable(),
    patient: canonicalPatientSchema.nullable(),
    encounters: z.array(canonicalEncounterSchema),
    observations: z.array(canonicalObservationSchema),
    medicationStatements: z.array(canonicalMedicationStatementSchema),
    contributingSources: z.array(z.string()),
    failedSources: z.array(z.object({ sourceId: z.string(), reason: z.string() })),
    sourceStatus: z.array(sourceStatusSchema).openapi({
      description:
        "Every registered source is always listed here, whether or not it contributed — a caller can always confirm all five sources are accounted for without inferring anything from absence.",
    }),
    warnings: z.array(warningSchema),
    matchingMode: z.enum(["deterministic", "probabilistic"]),
    probabilisticMatch: z
      .object({ candidateIds: z.array(z.string()), score: z.number() })
      .nullable()
      .openapi({ description: "Only set in probabilistic mode when the sidecar found a probable-match group." }),
  })
  .openapi("QueryResult");

const errorResponseSchema = z
  .object({
    error: z.object({
      code: z
        .enum(["validation-failed", "consent-rejected", "source-unreachable", "rate-limited", "not-found", "internal-error"])
        .openapi({ description: "Machine-readable error category. Consistent across every route in this backend." }),
      message: z.string().openapi({ description: "Human-readable explanation." }),
      details: z.unknown().optional().openapi({ description: "Optional extra structured context, e.g. failedSources or Zod validation issues." }),
    }),
  })
  .openapi("ErrorResponse");

// ---- POST /consent/tokens ----

const issueConsentBodySchema = z
  .object({
    requestingParty: z.string().min(1).openapi({ example: "dr-jane" }),
    patientId: z.string().min(1).openapi({
      example: "SYN-8801015800083",
      description: "The synthetic national id to authorise access to (or a probabilistic-matching demo key such as DEMO-PALESA-ZULU).",
    }),
    scopes: z.array(consentResourceTypeSchema).min(1).openapi({ example: ["Patient", "Encounter", "Observation", "MedicationStatement"] }),
    purpose: z.string().min(1).openapi({ example: "treatment" }),
    expiresInSeconds: z.number().positive().optional().openapi({ description: "Defaults to 900 (15 minutes)." }),
  })
  .openapi("IssueConsentTokenRequest");

const issuedTokenSchema = z
  .object({
    token: z.string().openapi({ description: "A signed JWT. Pass as `Authorization: Bearer <token>` on /patients/* routes." }),
    claims: consentTokenClaimsSchema,
  })
  .openapi("IssuedToken");

registry.registerPath({
  method: "post",
  path: "/consent/tokens",
  summary: "Issue a consent token (simulates a patient consent action)",
  description:
    "This project has no user accounts or registration — the consent token itself is the entire access-control model. There is no real patient-facing UI yet; this endpoint stands in for the moment a patient authorises a specific requesting party.",
  tags: ["Consent"],
  request: { body: { content: { "application/json": { schema: issueConsentBodySchema } } } },
  responses: {
    201: { description: "Token issued.", content: { "application/json": { schema: issuedTokenSchema } } },
    400: { description: "Invalid request body (code: validation-failed).", content: { "application/json": { schema: errorResponseSchema } } },
    429: { description: "Rate limited by the gateway (code: rate-limited).", content: { "application/json": { schema: errorResponseSchema } } },
  },
});

// ---- GET /patients/:nationalId ----

registry.registerPath({
  method: "get",
  path: "/patients/{nationalId}",
  summary: "Query a patient's combined record across all five sources",
  description:
    "Runs the orchestrator: fetches from every registered source that has a mapping for this identifier, translates each into the canonical model, and combines the results. A source that errors or has no record is isolated and disclosed, never silently dropped — see `sourceStatus` and `warnings` in the response.",
  tags: ["Query"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({
      nationalId: z.string().min(1).openapi({
        example: "SYN-8801015800083",
        description: "A synthetic national id (deterministic mode) or a probabilistic-matching demo key such as DEMO-PALESA-ZULU (probabilistic mode).",
      }),
    }),
    query: z.object({
      matching: z
        .enum(["deterministic", "probabilistic"])
        .default("deterministic")
        .openapi({
          description:
            "deterministic (default): matches records only via a shared identifier, never guesses. probabilistic: routes matching through a separate Splink-based sidecar; fails clearly (502) if that sidecar is unreachable, rather than silently falling back.",
        }),
    }),
  },
  responses: {
    200: { description: "Combined query result.", content: { "application/json": { schema: orchestratorResultSchema } } },
    400: { description: "Invalid request (code: validation-failed).", content: { "application/json": { schema: errorResponseSchema } } },
    401: { description: "Missing, invalid, or expired consent token (code: consent-rejected).", content: { "application/json": { schema: errorResponseSchema } } },
    403: { description: "Token does not cover the requested patient or resource type(s) (code: consent-rejected).", content: { "application/json": { schema: errorResponseSchema } } },
    404: { description: "No contributing source returned a valid record for this identifier (code: not-found).", content: { "application/json": { schema: errorResponseSchema } } },
    429: { description: "Rate limited by the gateway (code: rate-limited).", content: { "application/json": { schema: errorResponseSchema } } },
    502: { description: "Probabilistic matching requested but the sidecar is unreachable (code: source-unreachable).", content: { "application/json": { schema: errorResponseSchema } } },
  },
});

// ---- GET /patients/:nationalId/audit-trail ----

const auditTrailResponseSchema = z
  .object({
    patientId: z.string(),
    events: z.array(
      z.object({
        id: z.string(),
        operation: z.enum(["token-issue", "token-validation-failure", "patient-query", "audit-trail-read"]),
        occurredAt: z.string().openapi({ format: "date-time" }),
        actor: z.string(),
        patientId: z.string().nullable(),
        outcome: z.enum(["success", "partial-success", "failure"]),
        purpose: z.string().nullable(),
        resourceTypes: z.array(z.string()),
        detail: z.object({
          contributingSources: z.array(z.string()),
          failedSources: z.array(z.object({ sourceId: z.string(), reason: z.string() })),
          reason: z.string().nullable(),
          sourceStatus: z.array(sourceStatusSchema),
          matchingMode: z.enum(["deterministic", "probabilistic"]),
          probabilisticMatch: z.object({ candidateIds: z.array(z.string()), score: z.number() }).nullable(),
        }),
      })
    ),
  })
  .openapi("AuditTrailResponse");

registry.registerPath({
  method: "get",
  path: "/patients/{nationalId}/audit-trail",
  summary: "Retrieve the audit trail for a patient",
  description:
    "Read-only, for demo/verification purposes. Itself logged as an access event (operation: audit-trail-read) — reading someone's access history is itself accessing data about them. Requires a token scoped to at least Patient.",
  tags: ["Audit"],
  security: [{ [bearerAuth.name]: [] }],
  request: {
    params: z.object({ nationalId: z.string().min(1).openapi({ example: "SYN-8801015800083" }) }),
  },
  responses: {
    200: { description: "The full audit history for this patient identifier.", content: { "application/json": { schema: auditTrailResponseSchema } } },
    401: { description: "Missing, invalid, or expired consent token (code: consent-rejected).", content: { "application/json": { schema: errorResponseSchema } } },
    403: { description: "Token does not cover Patient scope for this patient (code: consent-rejected).", content: { "application/json": { schema: errorResponseSchema } } },
  },
});

// ---- GET /health, GET /healthz ----

const healthSourceComponentSchema = z.object({
  sourceId: z.string(),
  reachable: z.boolean(),
  responseTimeMs: z.number().nullable(),
  reason: z.string().nullable(),
});

const healthzResponseSchema = z
  .object({
    status: z.literal("ok").openapi({
      description: "Reports only that this endpoint answered — see `components` for actual per-dependency health. Never collapsed into a single healthy/unhealthy boolean.",
    }),
    timestamp: z.string().openapi({ format: "date-time" }),
    components: z.object({
      database: z.object({ reachable: z.boolean(), reason: z.string().nullable() }),
      sources: z.array(healthSourceComponentSchema),
      outboxPublisher: z.object({
        lastSuccessfulRunAt: z.string().nullable().openapi({ description: "ISO-8601 timestamp of the outbox publisher's last successful poll tick, or null if it has never run yet." }),
      }),
      probabilisticMatchingSidecar: z.object({ reachable: z.boolean(), responseTimeMs: z.number().nullable(), reason: z.string().nullable() }),
    }),
  })
  .openapi("HealthzResponse");

registry.registerPath({
  method: "get",
  path: "/health",
  summary: "Basic liveness check",
  description: "Always returns immediately with no dependency checks — confirms only that this process is up. Poll this frequently.",
  tags: ["Health"],
  responses: {
    200: { description: "Process is up.", content: { "application/json": { schema: z.object({ status: z.literal("ok") }) } } },
  },
});

registry.registerPath({
  method: "get",
  path: "/healthz",
  summary: "Deep readiness check across every real dependency",
  description:
    "Checks the backend's own Postgres DB, each of the five sources' reachability, the outbox publisher's last successful run, and the probabilistic-matching sidecar. Always returns 200 with a full per-component breakdown — a partial outage (e.g. 4 of 5 sources up) is never collapsed into a single boolean.",
  tags: ["Health"],
  responses: {
    200: { description: "Per-component health breakdown.", content: { "application/json": { schema: healthzResponseSchema } } },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "SA Health Interoperability Platform — Backend API",
      version: "0.1.0",
      description:
        "A prototype interoperability backend combining patient records across five independently-shaped simulated healthcare source systems (Clinic A, Hospital B, Source C/DHIS2-style, Source D/HPRS-style, Pharmacy E). " +
        "No user accounts or registration exist — a consent token (see POST /consent/tokens) is the entire access-control model. " +
        "Grade 10 Science Expo project; see Backend_Research.docx for the full research basis.",
    },
    servers: [{ description: "Via the gateway (rate-limited, public-facing)", url: "http://localhost:3000" }],
  });
}
