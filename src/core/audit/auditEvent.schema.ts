import { z } from "zod";

/**
 * Audit event shape, modelled on FHIR AuditEvent / IHE BALP per
 * Backend_Research.docx Section 4.2: operation type, timestamp, actor,
 * outcome, purpose of use, and the specific resource(s) accessed.
 *
 * An audit log records that access occurred; it does not itself enforce
 * access control (that's consentGuard's job) — this module is purely
 * a record-keeping layer.
 */
export const auditOperationSchema = z.enum([
  "token-issue",
  "token-validation-failure",
  "patient-query",
  "audit-trail-read",
]);
export type AuditOperation = z.infer<typeof auditOperationSchema>;

export const auditOutcomeSchema = z.enum(["success", "partial-success", "failure"]);
export type AuditOutcome = z.infer<typeof auditOutcomeSchema>;

/**
 * Per-source status as recorded in the audit trail — the same shape the
 * orchestrator returns to callers (see SourceStatus in orchestrator.ts),
 * duplicated here rather than imported so the audit schema does not take a
 * compile-time dependency on orchestrator internals. Kept structurally
 * identical on purpose: what a caller was told about source availability
 * for a query and what the audit trail records about it must never diverge.
 */
const auditSourceStatusSchema = z.object({
  sourceId: z.string().min(1),
  displayName: z.string().min(1),
  queried: z.boolean(),
  reachable: z.boolean(),
  responseTimeMs: z.number().nullable(),
  queriedAt: z.string(),
  reason: z.string().nullable(),
});

export const auditEventSchema = z.object({
  id: z.string().min(1).optional(), // assigned by the DB on insert
  operation: auditOperationSchema,
  occurredAt: z.string(), // ISO-8601
  actor: z.string().min(1), // requesting party (token `sub`, or "unknown" pre-validation)
  patientId: z.string().nullable(), // synthetic national id the event concerns, if any
  outcome: auditOutcomeSchema,
  purpose: z.string().nullable(), // purpose of use, if a token was involved
  /** Which resource types were requested/covered by this event. */
  resourceTypes: z.array(z.string()),
  /** Per-source contribution/failure detail, reusing Phase 1's failure isolation. */
  detail: z.object({
    contributingSources: z.array(z.string()).default([]),
    failedSources: z.array(z.object({ sourceId: z.string(), reason: z.string() })).default([]),
    reason: z.string().nullable().default(null), // e.g. "token expired", "scope mismatch"
    /**
     * Full per-source status for this specific query attempt (Phase 3:
     * Backend_Research.docx Section 5.2's honest-disclosure requirement).
     * Optional/defaulted for backward compatibility with audit events
     * written before this field existed (token-issue, token-validation-failure,
     * and audit-trail-read events never populate this — only patient-query does).
     */
    sourceStatus: z.array(auditSourceStatusSchema).default([]),
    /**
     * Which identity-matching strategy ran for this query (Backend_Research.docx
     * Section 3.2's probabilistic-matching backlog item). Defaulted to
     * "deterministic" for backward compatibility with audit events written
     * before probabilistic matching existed, and for operations other than
     * patient-query where matching mode is not applicable.
     */
    matchingMode: z.enum(["deterministic", "probabilistic"]).default("deterministic"),
    /** Set only for a probabilistic-mode query where the sidecar found a probable-match group. */
    probabilisticMatch: z
      .object({ candidateIds: z.array(z.string()), score: z.number() })
      .nullable()
      .default(null),
  }),
});
export type AuditEvent = z.infer<typeof auditEventSchema>;

/**
 * Input type (pre-defaults) for callers constructing an event to record.
 * auditEventSchema is never actually run through .parse() at runtime today
 * (it exists purely as a type source), so callers should be typed against
 * what they're allowed to omit — fields with .default() — rather than the
 * fully-defaulted output shape.
 */
export type AuditEventInput = z.input<typeof auditEventSchema>;
