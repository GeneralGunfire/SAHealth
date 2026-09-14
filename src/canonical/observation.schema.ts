import { z } from "zod";
import { isoDateTime, quantitySchema, referenceSchema, sourceRefSchema } from "./common.js";

/**
 * Canonical Observation resource.
 * Fields per Backend_Research.docx Section 2.2: status, category, code, subject
 * reference, effective date/time, value with unit.
 */
export const canonicalObservationSchema = z.object({
  resourceType: z.literal("Observation"),
  id: z.string().min(1),

  status: z.enum(["registered", "preliminary", "final", "amended"]),

  category: z.enum(["laboratory", "vital-signs"]),

  /**
   * Clinical code for what was observed (e.g. "blood-glucose", "body-temperature").
   * Terminology-system mapping (ICD-10 / SNOMED / local) is an adapter responsibility
   * per Section 2.3; the canonical model stores the resolved code + display text.
   */
  code: z.object({
    system: z.string().min(1), // e.g. "synthetic-local-codes"
    code: z.string().min(1),
    display: z.string().min(1),
  }),

  subject: referenceSchema,

  effectiveDateTime: isoDateTime,

  /** Value normalised to a canonical unit; adapters are responsible for unit conversion. */
  value: quantitySchema,

  sourceRecord: sourceRefSchema,
});

export type CanonicalObservation = z.infer<typeof canonicalObservationSchema>;
