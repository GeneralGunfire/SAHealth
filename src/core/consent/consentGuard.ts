import type { FastifyReply, FastifyRequest } from "fastify";
import type { ConsentTokenClaims, ConsentResourceType } from "../../canonical/index.js";
import { verifyConsentToken, checkScope } from "./verifyToken.js";
import { record } from "../audit/auditRepo.js";
import { sendError } from "../../api/errors.js";

/** All four resource types a Phase 1 query touches, by default. */
const ALL_RESOURCE_TYPES: ConsentResourceType[] = ["Patient", "Encounter", "Observation", "MedicationStatement"];

declare module "fastify" {
  interface FastifyRequest {
    consentClaims?: ConsentTokenClaims;
  }
}

function extractBearerToken(request: FastifyRequest): string | undefined {
  const header = request.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice("Bearer ".length).trim();
}

/**
 * Fastify preHandler that gates a route behind a valid, correctly-scoped
 * consent token. Runs entirely before the route handler — and therefore
 * before the orchestrator — so a rejected request never reaches
 * queryPatientAcrossSources or any adapter. This is the enforcement half
 * of Section 4.3; it never touches orchestrator.ts or registry.ts.
 *
 * `requiredResourceTypes` defaults to all four canonical types, matching
 * Phase 1's orchestrator, which always fetches all resource kinds for a
 * patient. A token scoped to a subset still passes this guard (the
 * response-shaping wrapper in recordAccess.ts filters what's returned);
 * this guard only rejects tokens that are invalid, expired, or that don't
 * cover the requested patient at all.
 */
export function consentGuard(requiredResourceTypes: ConsentResourceType[] = ALL_RESOURCE_TYPES) {
  return async function guard(request: FastifyRequest, reply: FastifyReply) {
    const patientId = (request.params as { nationalId?: string }).nationalId;
    const token = extractBearerToken(request);

    const verifyResult = await verifyConsentToken(token);
    if (!verifyResult.ok) {
      record({
        operation: "token-validation-failure",
        occurredAt: new Date().toISOString(),
        actor: "unknown",
        patientId: patientId ?? null,
        outcome: "failure",
        purpose: null,
        resourceTypes: requiredResourceTypes,
        detail: { contributingSources: [], failedSources: [], reason: verifyResult.reason },
      });
      return sendError(reply, 401, "consent-rejected", verifyResult.message, { reason: verifyResult.reason });
    }

    if (!patientId) {
      return sendError(reply, 400, "validation-failed", "Missing patient identifier in request path.");
    }

    const scopeResult = checkScope(verifyResult.claims, patientId, requiredResourceTypes);
    if (!scopeResult.ok) {
      record({
        operation: "token-validation-failure",
        occurredAt: new Date().toISOString(),
        actor: verifyResult.claims.sub,
        patientId,
        outcome: "failure",
        purpose: verifyResult.claims.purpose,
        resourceTypes: requiredResourceTypes,
        detail: { contributingSources: [], failedSources: [], reason: scopeResult.reason },
      });
      return sendError(reply, 403, "consent-rejected", scopeResult.message, { reason: scopeResult.reason });
    }

    request.consentClaims = verifyResult.claims;
  };
}
