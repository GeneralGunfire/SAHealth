import { z } from "zod";

/**
 * Shared building blocks used across canonical resources.
 * Defined once here so every resource schema and every adapter
 * refers to the same primitive shapes instead of redefining them.
 */

/** ISO-8601 date-time string, always UTC, as produced by adapters after normalisation. */
export const isoDateTime = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), { message: "must be a valid ISO-8601 date-time" });

/** ISO-8601 date (no time component), e.g. date of birth. */
export const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "must be an ISO-8601 date (YYYY-MM-DD)" });

/**
 * A reference to a canonical resource, e.g. an Encounter's subject.
 * `id` is always the canonical patient identifier (see identityMatch module),
 * never a raw source-native id.
 */
export const referenceSchema = z.object({
  resourceType: z.enum(["Patient", "Encounter", "Observation", "MedicationStatement"]),
  id: z.string().min(1),
});
export type Reference = z.infer<typeof referenceSchema>;

/**
 * Identifies which registered source system a record originated from, and
 * when that source was actually queried for the request that produced this
 * result. `queriedAt` is NOT set by adapters (translate() has no query-time
 * context) — it is stamped on by the orchestrator at combination time,
 * using the real timestamp of that specific fetch attempt, per
 * Backend_Research.docx Section 5.2's honest-disclosure requirement. It is
 * optional at the schema level because adapter-authored fixtures/tests
 * construct sourceRecord without it; the orchestrator always fills it in
 * for anything actually returned to a caller.
 */
export const sourceRefSchema = z.object({
  sourceId: z.string().min(1),
  sourceRecordId: z.string().min(1),
  queriedAt: isoDateTime.optional(),
});
export type SourceRef = z.infer<typeof sourceRefSchema>;

/** A single identifier attached to a Patient (e.g. national ID, source-native MRN). */
export const identifierSchema = z.object({
  system: z.string().min(1), // e.g. "synthetic-national-id", "clinic-a-mrn"
  value: z.string().min(1),
});
export type Identifier = z.infer<typeof identifierSchema>;

/** A quantity with an explicit unit, per Section 2.3's unit-mismatch requirement. */
export const quantitySchema = z.object({
  value: z.number(),
  unit: z.string().min(1), // UCUM-style unit string, e.g. "mmol/L", "mg"
});
export type Quantity = z.infer<typeof quantitySchema>;
