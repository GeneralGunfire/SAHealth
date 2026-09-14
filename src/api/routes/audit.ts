import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { consentGuard } from "../../core/consent/consentGuard.js";
import { findAuditEventsForPatient, record } from "../../core/audit/auditRepo.js";

const paramsSchema = z.object({ nationalId: z.string().min(1) });

/**
 * Read-only audit-trail retrieval, for demo/testing purposes per the spec.
 * Gated behind the same consent guard as the query route (scoped to
 * "Patient", since reading someone's access history is itself accessing
 * data about that patient) and, per the spec, logs its own read as an
 * access event rather than being exempt from audit.
 */
export async function auditRoutes(app: FastifyInstance) {
  app.get(
    "/patients/:nationalId/audit-trail",
    { preHandler: consentGuard(["Patient"]) },
    async (request, reply) => {
      const { nationalId } = paramsSchema.parse(request.params);
      const claims = request.consentClaims!;

      const events = await findAuditEventsForPatient(nationalId);

      record({
        operation: "audit-trail-read",
        occurredAt: new Date().toISOString(),
        actor: claims.sub,
        patientId: nationalId,
        outcome: "success",
        purpose: claims.purpose,
        resourceTypes: ["Patient"],
        detail: { contributingSources: [], failedSources: [], reason: null },
      });

      return reply.send({ patientId: nationalId, events });
    }
  );
}
