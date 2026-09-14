import { z } from "zod";
import { isoDateTime, referenceSchema, sourceRefSchema } from "./common.js";

/**
 * Canonical MedicationStatement resource.
 * Fields per Backend_Research.docx Section 2.2: status, medication code or text,
 * subject reference, effective date/time, dosage text.
 */
export const canonicalMedicationStatementSchema = z.object({
  resourceType: z.literal("MedicationStatement"),
  id: z.string().min(1),

  status: z.enum(["active", "completed", "stopped", "unknown"]),

  /** Either a coded medication or free-text fallback, matching the "code or text" spec. */
  medication: z.union([
    z.object({ kind: z.literal("coded"), system: z.string().min(1), code: z.string().min(1), display: z.string().min(1) }),
    z.object({ kind: z.literal("text"), text: z.string().min(1) }),
  ]),

  subject: referenceSchema,

  effectiveDateTime: isoDateTime,

  dosageText: z.string().min(1),

  sourceRecord: sourceRefSchema,
});

export type CanonicalMedicationStatement = z.infer<typeof canonicalMedicationStatementSchema>;
