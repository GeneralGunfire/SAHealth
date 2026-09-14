import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { buildAdapterRegistry } from "../../core/registry.js";
import { makeResolver, makeProbabilisticDemoResolver } from "../../core/sourcePatientDirectory.js";
import { consentGuard } from "../../core/consent/consentGuard.js";
import { auditedQuery } from "../../core/audit/recordAccess.js";
import { ProbabilisticMatchingUnavailableError } from "../../core/identityMatchProbabilistic.js";
import { sendError } from "../errors.js";

const paramsSchema = z.object({ nationalId: z.string().min(1) });
const querySchema = z.object({
  matching: z.enum(["deterministic", "probabilistic"]).default("deterministic"),
});

export async function patientRoutes(app: FastifyInstance) {
  // Built once at startup; the registry does not change per-request.
  const registry = await buildAdapterRegistry();

  app.get(
    "/patients/:nationalId",
    { preHandler: consentGuard() },
    async (request, reply) => {
      const { nationalId } = paramsSchema.parse(request.params);
      const { matching } = querySchema.parse(request.query);

      // consentGuard has already validated the token and rejected the
      // request if invalid/expired/out-of-scope; request.consentClaims is
      // guaranteed present here. queryPatientAcrossSources itself is called
      // unmodified inside auditedQuery — this route never touches
      // orchestrator internals.
      //
      // matching=probabilistic is an explicit, separate opt-in path
      // (Backend_Research.docx Section 3.2): it uses a distinct resolver
      // directory (see sourcePatientDirectory.ts) because probabilistic
      // matching's whole purpose is finding a match WITHOUT a shared
      // identifier, which the deterministic resolver cannot express for
      // the demo case this exists to prove. Default behaviour (no query
      // param) is byte-for-byte unchanged from before this path existed.
      const resolver = matching === "probabilistic" ? makeProbabilisticDemoResolver(nationalId) : makeResolver(nationalId);

      let result;
      try {
        result = await auditedQuery(registry, resolver, request.consentClaims!, matching);
      } catch (err) {
        if (err instanceof ProbabilisticMatchingUnavailableError) {
          // Fail clearly — never silently fall back to deterministic and
          // pretend probabilistic matching ran.
          return sendError(reply, 502, "source-unreachable", "Probabilistic matching is unavailable.", {
            reason: err.message,
          });
        }
        throw err;
      }

      if (!result.patient) {
        return sendError(
          reply,
          404,
          "not-found",
          "No contributing source returned a valid record for this identifier.",
          { failedSources: result.failedSources }
        );
      }

      // Phase 3: `result.sourceStatus` (reachable/unreachable, response time,
      // classified reason per source) and per-resource `queriedAt` provenance
      // are already part of `result` here — see src/core/orchestrator.ts.
      // Nothing unreachable-sourced is ever included in `result` itself:
      // there is no last-known-good cache in this system, so a failed
      // source contributes nothing to combine in the first place (Section
      // 5.2's "omit" choice is automatic, not a filter applied here).
      return reply.send(result);
    }
  );
}
