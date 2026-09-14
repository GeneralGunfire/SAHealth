import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { consentResourceTypeSchema } from "../../canonical/index.js";
import { issueConsentToken } from "../../core/consent/issueToken.js";

const issueBodySchema = z.object({
  requestingParty: z.string().min(1),
  patientId: z.string().min(1),
  scopes: z.array(consentResourceTypeSchema).min(1),
  purpose: z.string().min(1),
  expiresInSeconds: z.number().positive().optional(),
});

/**
 * Simulates a patient consent action (Backend_Research.docx Section 4.3).
 * No real patient-facing UI in this phase — this stands in for the moment
 * a patient authorises a specific requesting party to see specific
 * resource types, for a stated purpose, for a limited time.
 */
export async function consentRoutes(app: FastifyInstance) {
  app.post("/consent/tokens", async (request, reply) => {
    const body = issueBodySchema.parse(request.body);
    const issued = await issueConsentToken(body);
    return reply.code(201).send(issued);
  });
}
