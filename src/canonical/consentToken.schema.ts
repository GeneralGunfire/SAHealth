import { z } from "zod";

/**
 * Canonical ConsentToken claims (Backend_Research.docx Section 4.3:
 * selective-disclosure, scope-and-time-limited consent tokens).
 *
 * This is the payload signed into the JWT — not the JWT string itself.
 * Defined once here so issuance, verification, and audit logging all agree
 * on the same shape, the same way canonical resource schemas are shared
 * across adapters.
 */
export const consentResourceTypeSchema = z.enum([
  "Patient",
  "Encounter",
  "Observation",
  "MedicationStatement",
]);
export type ConsentResourceType = z.infer<typeof consentResourceTypeSchema>;

export const consentTokenClaimsSchema = z.object({
  /** Identity of the requesting party (e.g. a clinician or requesting system id). */
  sub: z.string().min(1),

  /** The synthetic national id this token authorises access to (Phase 1's query key). */
  patientId: z.string().min(1),

  /** Resource types this token covers. A query touching a type outside this set is rejected. */
  scopes: z.array(consentResourceTypeSchema).min(1),

  /** Stated purpose of use, per Section 4.2's audit-record requirement. */
  purpose: z.string().min(1),

  /** Standard JWT claims; populated by issueToken, checked by verifyToken. */
  iat: z.number(),
  exp: z.number(),
});
export type ConsentTokenClaims = z.infer<typeof consentTokenClaimsSchema>;

// TODO(Phase 3 - offline): consider whether a token issued while a source was
// unreachable should carry an explicit "issued under partial source visibility"
// flag, consistent with Section 5.2's honest-disclosure principle.
