import { z } from "zod";
import { isoDateTime, referenceSchema, sourceRefSchema } from "./common.js";

/**
 * Canonical Encounter resource.
 * Fields per Backend_Research.docx Section 2.2: status, class, subject reference,
 * period start/end, source system reference.
 */
export const canonicalEncounterSchema = z.object({
  resourceType: z.literal("Encounter"),
  id: z.string().min(1),

  status: z.enum(["planned", "in-progress", "finished", "cancelled"]),

  /** FHIR-inspired encounter class, e.g. outpatient/inpatient/emergency. */
  class: z.enum(["ambulatory", "inpatient", "emergency", "virtual"]),

  subject: referenceSchema, // reference to canonical Patient

  period: z.object({
    start: isoDateTime,
    end: isoDateTime.nullable().default(null),
  }),

  sourceRecord: sourceRefSchema,
});

export type CanonicalEncounter = z.infer<typeof canonicalEncounterSchema>;

// Phase 2 note: audit logging for reads of this resource is implemented at the
// query-orchestration boundary (src/core/audit/recordAccess.ts), not per
// resource type here, since a single query fetches all resource types for a
// patient atomically and is audited as one event (Backend_Research.docx Section 4.2).
