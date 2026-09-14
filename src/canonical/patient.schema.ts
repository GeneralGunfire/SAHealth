import { z } from "zod";
import { identifierSchema, isoDate, sourceRefSchema } from "./common.js";

/**
 * Canonical Patient resource.
 * Fields per Backend_Research.docx Section 2.2: identifier(s), name, gender,
 * date of birth, contact details, address.
 */
export const canonicalPatientSchema = z.object({
  resourceType: z.literal("Patient"),

  /** Canonical patient id assigned by the identity-matching module, not a source-native id. */
  id: z.string().min(1),

  identifiers: z.array(identifierSchema).min(1),

  name: z.object({
    given: z.array(z.string().min(1)).min(1),
    family: z.string().min(1),
  }),

  gender: z.enum(["male", "female", "other", "unknown"]),

  birthDate: isoDate,

  contact: z.object({
    phone: z.string().nullable().default(null),
    email: z.string().email().nullable().default(null),
  }),

  address: z.object({
    line: z.string().nullable().default(null),
    city: z.string().nullable().default(null),
    province: z.string().nullable().default(null),
    postalCode: z.string().nullable().default(null),
  }),

  /** Every source record that contributed to this canonical patient (post identity-match). */
  sourceRecords: z.array(sourceRefSchema).min(1),
});

export type CanonicalPatient = z.infer<typeof canonicalPatientSchema>;

// Phase 2 note: consent is deliberately NOT embedded as a field on this schema.
// Consent tokens (src/canonical/consentToken.schema.ts) and enforcement
// (src/core/consent/) are a cross-cutting layer that wraps queries and routes,
// so that adding a resource type or adapter never requires touching consent
// logic, and vice versa. See src/core/consent/consentGuard.ts.
