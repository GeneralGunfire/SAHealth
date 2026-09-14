import type { ConsentTokenClaims } from "../../canonical/index.js";
import {
  queryPatientAcrossSources,
  type MatchingMode,
  type OrchestratorResult,
  type SourcePatientIdResolver,
} from "../orchestrator.js";
import type { SourceAdapter } from "../../types/sourceAdapter.js";
import { record } from "./auditRepo.js";

/**
 * Wraps Phase 1's `queryPatientAcrossSources` with an audit write. This is
 * the "decorator" half of the cross-cutting layer: it calls the orchestrator
 * exactly as Phase 1 did (same registry, same resolver signature) and does
 * not alter its return shape or internal behaviour. Any adapter present in
 * the registry — including one added after this file was written — is
 * covered automatically, since this function never inspects adapter
 * identity.
 *
 * Also applies scope-filtering: a token scoped to a subset of resource
 * types (e.g. "Observation" only) still lets the orchestrator run in full
 * (Phase 1 behaviour unchanged) but strips resource arrays the token does
 * not cover before returning to the caller — enforcing the "a token
 * covering only Observation must not authorise access to
 * MedicationStatement" requirement at the response boundary, not inside
 * the orchestrator.
 */
export async function auditedQuery(
  registry: Map<string, SourceAdapter>,
  resolveSourcePatientId: SourcePatientIdResolver,
  claims: ConsentTokenClaims,
  matchingMode: MatchingMode = "deterministic"
): Promise<OrchestratorResult> {
  // A thrown ProbabilisticMatchingUnavailableError (see
  // identityMatchProbabilistic.ts) deliberately propagates through this
  // function uncaught — the route layer is responsible for turning it into
  // a clear error response, not this audit wrapper silently swallowing it.
  const result = await queryPatientAcrossSources(registry, resolveSourcePatientId, matchingMode);

  const scoped: OrchestratorResult = {
    ...result,
    patient: claims.scopes.includes("Patient") ? result.patient : null,
    encounters: claims.scopes.includes("Encounter") ? result.encounters : [],
    observations: claims.scopes.includes("Observation") ? result.observations : [],
    medicationStatements: claims.scopes.includes("MedicationStatement") ? result.medicationStatements : [],
  };

  const outcome =
    result.patient === null
      ? "failure"
      : result.failedSources.length > 0
        ? "partial-success"
        : "success";

  record({
    operation: "patient-query",
    occurredAt: new Date().toISOString(),
    actor: claims.sub,
    patientId: claims.patientId,
    outcome,
    purpose: claims.purpose,
    resourceTypes: claims.scopes,
    detail: {
      contributingSources: result.contributingSources,
      failedSources: result.failedSources,
      reason: result.patient === null ? "No contributing source returned a valid record." : null,
      // Phase 3: the full per-source status block (reachable/unreachable,
      // response time, classified reason) is recorded here so "which
      // sources were up and which were down for this specific historical
      // query" is itself auditable via the existing audit-trail endpoint,
      // not just inferable from contributingSources/failedSources.
      sourceStatus: result.sourceStatus,
      // Which identity-matching strategy actually ran, and (in probabilistic
      // mode) what group/score it found — so a historical audit read can
      // distinguish "these sources were merged because they share an
      // identifier" from "these sources were merged because a probabilistic
      // model scored them as a probable match," not just that they merged.
      matchingMode: result.matchingMode,
      probabilisticMatch: result.probabilisticMatch,
    },
  });

  return scoped;
}
