import {
  canonicalPatientSchema,
  canonicalEncounterSchema,
  canonicalObservationSchema,
  canonicalMedicationStatementSchema,
  type CanonicalPatient,
  type CanonicalEncounter,
  type CanonicalObservation,
  type CanonicalMedicationStatement,
} from "../canonical/index.js";
import type { AdapterWarning, SourceAdapter } from "../types/sourceAdapter.js";
import { computeCanonicalPatientId } from "./identityMatch.js";
import { computeCanonicalPatientIdProbabilistic } from "./identityMatchProbabilistic.js";
import { logger } from "./logger.js";
import { classifySourceFailure, type SourceFailureReason } from "./sourceFailureReason.js";

/**
 * Which identity-matching strategy to use for a query. Deterministic is
 * the default and primary path (Backend_Research.docx Section 3.2) and its
 * behaviour is completely unchanged by the existence of the probabilistic
 * option — the two share no state, and the deterministic branch below runs
 * byte-for-byte the same code that ran before probabilistic matching
 * existed. Probabilistic matching is an explicit, opt-in alternative; a
 * caller must ask for it, and if the sidecar it depends on is unreachable
 * the query fails clearly (see identityMatchProbabilistic.ts) rather than
 * silently falling back to deterministic and misrepresenting what ran.
 */
export type MatchingMode = "deterministic" | "probabilistic";

/**
 * Explicit, per-source disclosure of what happened during THIS query
 * attempt — the completion of Phase 1's failure isolation per
 * Backend_Research.docx Section 5.2. Always covers every source in the
 * registry, not just the ones that failed or contributed, so a caller can
 * always confirm "all four sources are accounted for" without inferring
 * anything from absence.
 */
export interface SourceStatus {
  sourceId: string;
  displayName: string;
  /**
   * Whether this source was actually attempted for this query. False when
   * the resolver has no known mapping for the requested patient in this
   * source — e.g. Source D's separate SA-ID identifier scheme deliberately
   * has no entry for a query keyed by the shared synthetic identifier
   * (Backend_Research.docx Section 3.2's documented matching limitation).
   * This is NOT a failure of the source and must not be reported as
   * `reachable: false` — a source that was never asked a question was
   * never "unreachable" for this request.
   */
  queried: boolean;
  /** Meaningless when `queried` is false. */
  reachable: boolean;
  /** Wall-clock time spent on this source's fetchPatient+translate for this query, in ms. Null if never attempted. */
  responseTimeMs: number | null;
  /** ISO-8601 timestamp of this specific query attempt against this source (not a cached/stored time). */
  queriedAt: string;
  /** Only set when queried is true and reachable is false. */
  reason: SourceFailureReason | null;
}

/**
 * The result of a cross-source patient query: a combined canonical record,
 * plus explicit bookkeeping about which sources contributed and which
 * failed — never silently dropped (Section 5.2's honest-disclosure principle).
 *
 * contributingSources/failedSources are retained unchanged for backward
 * compatibility with existing callers/tests; sourceStatus is the richer,
 * complete-coverage view this phase adds on top, without altering the
 * failure-isolation mechanism itself (a failing source still cannot crash
 * the query — that behaviour is unchanged).
 */
export interface OrchestratorResult {
  canonicalPatientId: string | null;
  patient: CanonicalPatient | null;
  encounters: CanonicalEncounter[];
  observations: CanonicalObservation[];
  medicationStatements: CanonicalMedicationStatement[];
  contributingSources: string[];
  failedSources: { sourceId: string; reason: string }[];
  sourceStatus: SourceStatus[];
  warnings: AdapterWarning[];
  /**
   * Which matching strategy actually ran. Always "deterministic" unless a
   * caller explicitly requested "probabilistic" and the sidecar answered
   * successfully — never silently switches.
   */
  matchingMode: MatchingMode;
  /**
   * Set only in probabilistic mode, when the sidecar found a probable-match
   * group covering every contributing source's record for this query. Null
   * in deterministic mode, and null in probabilistic mode when no group was
   * found (contributing records were NOT merged).
   */
  probabilisticMatch: { candidateIds: string[]; score: number } | null;
}

/**
 * A per-source lookup: how to translate the externally-supplied query
 * identifier (a single value used across the demo) into that adapter's own
 * native patient id. In this Phase 1 prototype the mapping is a simple
 * per-source lookup table supplied by the caller (see tests / routes),
 * standing in for a real cross-reference service.
 *
 * TODO(Phase 2 - consent): this is also the natural place to check a
 * selective-disclosure consent token before any adapter is queried.
 */
export type SourcePatientIdResolver = (sourceId: string) => string | undefined;

/**
 * Given a registry of active adapters and a way to resolve each source's
 * native patient id, fetch + translate + validate every source's data and
 * combine it into one canonical result. Loops over the registry generically —
 * never references a specific adapter by name. A failing or invalid adapter
 * is logged and skipped; it never crashes the whole query.
 *
 * `matchingMode` defaults to "deterministic" — every existing caller that
 * does not pass it gets byte-for-byte the same behaviour as before
 * probabilistic matching existed. Passing "probabilistic" is the only way
 * to reach the sidecar-backed alternative path; it never activates itself.
 */
export async function queryPatientAcrossSources(
  registry: Map<string, SourceAdapter>,
  resolveSourcePatientId: SourcePatientIdResolver,
  matchingMode: MatchingMode = "deterministic"
): Promise<OrchestratorResult> {
  const warnings: AdapterWarning[] = [];
  const contributingSources: string[] = [];
  const failedSources: { sourceId: string; reason: string }[] = [];
  const sourceStatus: SourceStatus[] = [];

  const perSourcePatients: CanonicalPatient[] = [];
  const encounters: CanonicalEncounter[] = [];
  const observations: CanonicalObservation[] = [];
  const medicationStatements: CanonicalMedicationStatement[] = [];

  for (const adapter of registry.values()) {
    const queriedAt = new Date().toISOString();
    const sourcePatientId = resolveSourcePatientId(adapter.id);
    if (sourcePatientId === undefined) {
      // This source has no known mapping for the requested patient (e.g.
      // Source D's separate identifier scheme) — not a failure of the
      // source, so it is never attempted. Still always reported in
      // sourceStatus, as `queried: false`, so every registered source is
      // always accounted for in the response per Section 5.2's
      // honest-disclosure requirement, without misrepresenting "no mapping"
      // as "the source was down."
      sourceStatus.push({
        sourceId: adapter.id,
        displayName: adapter.displayName,
        queried: false,
        reachable: false,
        responseTimeMs: null,
        queriedAt,
        reason: null,
      });
      continue;
    }

    const startedAt = performance.now();
    try {
      const raw = await adapter.fetchPatient(sourcePatientId);
      const responseTimeMs = Math.round(performance.now() - startedAt);

      if (raw === null) {
        // The source was reachable and answered; it simply has no record for
        // this patient. Reachable, not a failure — reported as such, distinct
        // from a source that could not be reached or queried at all.
        sourceStatus.push({
          sourceId: adapter.id,
          displayName: adapter.displayName,
          queried: true,
          reachable: true,
          responseTimeMs,
          queriedAt,
          reason: null,
        });
        continue;
      }

      const translated = adapter.translate(raw, warnings);

      const patientParsed = canonicalPatientSchema.parse(translated.patient);
      const validEncounters = translated.encounters.map((e) => canonicalEncounterSchema.parse(e));
      const validObservations = translated.observations.map((o) => canonicalObservationSchema.parse(o));
      const validMedications = translated.medicationStatements.map((m) => canonicalMedicationStatementSchema.parse(m));

      // Stamp the real query time for this fetch attempt onto every
      // resource's provenance. Adapters cannot do this themselves
      // (translate() has no query-time context) — the orchestrator is the
      // only place that knows when this specific fetch actually happened.
      const withQueriedAt = <T extends { sourceRecord: { sourceId: string; sourceRecordId: string } }>(item: T): T => ({
        ...item,
        sourceRecord: { ...item.sourceRecord, queriedAt },
      });
      const patient: CanonicalPatient = {
        ...patientParsed,
        sourceRecords: patientParsed.sourceRecords.map((sr) => ({ ...sr, queriedAt })),
      };
      const stampedEncounters = validEncounters.map(withQueriedAt);
      const stampedObservations = validObservations.map(withQueriedAt);
      const stampedMedications = validMedications.map(withQueriedAt);

      perSourcePatients.push(patient);
      encounters.push(...stampedEncounters);
      observations.push(...stampedObservations);
      medicationStatements.push(...stampedMedications);
      contributingSources.push(adapter.id);
      sourceStatus.push({
        sourceId: adapter.id,
        displayName: adapter.displayName,
        queried: true,
        reachable: true,
        responseTimeMs,
        queriedAt,
        reason: null,
      });
    } catch (err) {
      const responseTimeMs = Math.round(performance.now() - startedAt);
      const reason = err instanceof Error ? err.message : String(err);
      const classifiedReason = classifySourceFailure(err);
      logger.error("Adapter failed or returned invalid data; skipping source for this query.", {
        sourceId: adapter.id,
        reason,
        classifiedReason,
      });
      failedSources.push({ sourceId: adapter.id, reason });
      sourceStatus.push({
        sourceId: adapter.id,
        displayName: adapter.displayName,
        queried: true,
        reachable: false,
        responseTimeMs,
        queriedAt,
        reason: classifiedReason,
      });
    }
  }

  if (perSourcePatients.length === 0) {
    return {
      canonicalPatientId: null,
      patient: null,
      encounters: [],
      observations: [],
      medicationStatements: [],
      contributingSources,
      failedSources,
      sourceStatus,
      warnings,
      matchingMode,
      probabilisticMatch: null,
    };
  }

  let canonicalPatientId: string;
  let mergeablePatients = perSourcePatients;
  let probabilisticMatch: { candidateIds: string[]; score: number } | null = null;

  if (matchingMode === "deterministic") {
    try {
      canonicalPatientId = computeCanonicalPatientId(perSourcePatients);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      logger.error("Identity matching failed across contributing sources.", { reason });
      return {
        canonicalPatientId: null,
        patient: null,
        encounters: [],
        observations: [],
        medicationStatements: [],
        contributingSources,
        failedSources: [...failedSources, { sourceId: "identity-match", reason }],
        sourceStatus,
        warnings,
        matchingMode,
        probabilisticMatch: null,
      };
    }
  } else {
    // Probabilistic mode: unreachable-sidecar failures propagate as a
    // thrown ProbabilisticMatchingUnavailableError, deliberately NOT
    // caught here — the caller must see this query failed clearly, never
    // get a result that quietly ran deterministic matching instead.
    const probResult = await computeCanonicalPatientIdProbabilistic(perSourcePatients);
    canonicalPatientId = probResult.canonicalId;
    if (probResult.matchedGroup) {
      probabilisticMatch = { candidateIds: probResult.matchedGroup, score: probResult.score! };
    } else if (perSourcePatients.length > 1) {
      // The sidecar ran successfully but did not find a probable-match
      // group covering every contributing record — honesty requires NOT
      // merging them. Only the first contributing source's data is
      // combined into the result; the rest are disclosed via a warning
      // rather than silently dropped.
      const excludedSources = perSourcePatients.slice(1).flatMap((p) => p.sourceRecords.map((sr) => sr.sourceId));
      warnings.push({
        sourceId: "identity-match-probabilistic",
        sourceRecordId: canonicalPatientId,
        message: `Probabilistic matching did not find a probable-match group covering all contributing sources; only ${perSourcePatients[0].sourceRecords[0]?.sourceId} was combined. Excluded: ${excludedSources.join(", ")}.`,
      });
      mergeablePatients = [perSourcePatients[0]];
    }
  }

  // Merge per-source Patient demographic records into one canonical Patient,
  // preferring the first source's demographics and unioning identifiers/sourceRecords.
  // In probabilistic mode with no group match, `mergeablePatients` has
  // already been narrowed to just the primary source above.
  const [primary, ...rest] = mergeablePatients;
  const mergedPatient: CanonicalPatient = {
    ...primary,
    id: canonicalPatientId,
    identifiers: [...primary.identifiers, ...rest.flatMap((p) => p.identifiers)],
    sourceRecords: [...primary.sourceRecords, ...rest.flatMap((p) => p.sourceRecords)],
  };

  const mergedSourceIds = new Set(mergeablePatients.flatMap((p) => p.sourceRecords.map((sr) => sr.sourceId)));
  const filterToMerged = <T extends { sourceRecord: { sourceId: string } }>(items: T[]): T[] =>
    items.filter((item) => mergedSourceIds.has(item.sourceRecord.sourceId));

  const rebind = <T extends { subject: { id: string } }>(items: T[]): T[] =>
    items.map((item) => ({ ...item, subject: { ...item.subject, id: canonicalPatientId } }));

  return {
    canonicalPatientId,
    patient: mergedPatient,
    encounters: rebind(filterToMerged(encounters)),
    observations: rebind(filterToMerged(observations)),
    medicationStatements: rebind(filterToMerged(medicationStatements)),
    contributingSources,
    failedSources,
    sourceStatus,
    warnings,
    matchingMode,
    probabilisticMatch,
  };
}

// TODO(Phase 4+): if a durable last-known-good store is ever introduced, the
// "omit vs. clearly-separate" choice made in this phase (see
// src/core/audit/recordAccess.ts) will need revisiting — today there is no
// cache to leak stale data from, so omission on failure is automatic, not a
// filter that has to actively suppress anything.
