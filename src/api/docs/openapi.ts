import "./zodOpenApiSetup.js"; // must run before any .openapi() call below
import { z } from "zod";
import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";
import { consentResourceTypeSchema, consentTokenClaimsSchema } from "../../canonical/index.js";

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

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "SA Health Interoperability Platform — Backend API",
      version: "0.1.0",
      description:
        "Retired pre-restart implementation: the source-querying pipeline (gateway, orchestrator, adapters, source services) has been removed pending a rebuild. " +
        "This document currently covers only what remains — consent tokens and the audit trail. " +
        "No user accounts or registration exist — a consent token (see POST /consent/tokens) is the entire access-control model.",
    },
    servers: [{ description: "Backend (internal)", url: "http://localhost:3010" }],
  });
}
