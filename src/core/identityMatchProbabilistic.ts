import type { CanonicalPatient } from "../canonical/index.js";
import { logger } from "./logger.js";

/**
 * Probabilistic identity matching (Backend_Research.docx Section 3.2's
 * backlog item), implemented as an explicit, separate, opt-in path — NOT a
 * replacement for deterministic matching. computeCanonicalPatientId in
 * identityMatch.ts is completely unchanged and unaffected by this module;
 * they share no state, and this module is only ever reached when a caller
 * explicitly requests probabilistic matching (see orchestrator.ts's
 * `matchingMode` parameter).
 *
 * Delegates the actual scoring to a separate Python sidecar
 * (sidecar-probabilistic-matching/), which runs Splink's Fellegi-Sunter
 * model over DuckDB in-process — no Docker, no persistent server state.
 * This module's job is only the HTTP contract and mapping canonical
 * Patient records to/from the sidecar's minimal JSON shape; it holds no
 * Splink-specific knowledge, so the sidecar could be replaced without this
 * module's callers noticing.
 */

/** Read per-call, not cached at module load, so tests can point this at an unreachable port without a module reload. */
function getSidecarBaseUrl(): string {
  return process.env.PROBABILISTIC_MATCHING_SIDECAR_URL ?? "http://localhost:5001";
}

export interface MatchGroup {
  candidateIds: string[];
  score: number;
}

interface SidecarCandidate {
  id: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  phone: string | null;
}

/**
 * Thrown when the sidecar cannot be reached or returns an error. Callers
 * must let this propagate as a distinct failure — NEVER catch it and
 * silently fall back to deterministic matching, since that would make the
 * response look like probabilistic matching ran when it did not.
 */
export class ProbabilisticMatchingUnavailableError extends Error {
  constructor(cause: unknown) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    super(`Probabilistic matching sidecar unavailable: ${reason}`);
    this.name = "ProbabilisticMatchingUnavailableError";
  }
}

/** Builds the opaque candidate id the sidecar treats as a plain string: "<sourceId>:<sourceRecordId>". */
function candidateId(patient: CanonicalPatient): string {
  const primary = patient.sourceRecords[0];
  return `${primary.sourceId}:${primary.sourceRecordId}`;
}

function toSidecarCandidate(patient: CanonicalPatient): SidecarCandidate {
  return {
    id: candidateId(patient),
    firstName: patient.name.given[0] ?? null,
    lastName: patient.name.family,
    dateOfBirth: patient.birthDate,
    gender: patient.gender,
    phone: patient.contact.phone,
  };
}

/**
 * Calls the probabilistic-matching sidecar with one canonical Patient per
 * contributing source and returns the probable-match groupings it finds.
 * Throws ProbabilisticMatchingUnavailableError if the sidecar cannot be
 * reached or returns a non-2xx response — this is deliberate: a caller
 * asking for probabilistic matching must be told clearly that it did not
 * run, never silently handed a deterministic result instead.
 */
export async function findProbableMatchGroups(patients: CanonicalPatient[]): Promise<MatchGroup[]> {
  const candidates = patients.map(toSidecarCandidate);

  let response: Response;
  try {
    response = await fetch(`${getSidecarBaseUrl()}/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidates }),
    });
  } catch (err) {
    logger.error("Probabilistic matching sidecar request failed.", {
      reason: err instanceof Error ? err.message : String(err),
    });
    throw new ProbabilisticMatchingUnavailableError(err);
  }

  if (!response.ok) {
    const reason = `sidecar returned ${response.status} ${response.statusText}`;
    logger.error("Probabilistic matching sidecar returned an error response.", { reason });
    throw new ProbabilisticMatchingUnavailableError(reason);
  }

  const body = (await response.json()) as { groups: MatchGroup[]; threshold: number };
  return body.groups;
}

/**
 * Probabilistic counterpart to identityMatch.ts's computeCanonicalPatientId.
 * Given the per-source canonical Patient records contributing to this
 * query, asks the sidecar whether they form a probable match group and
 * picks a canonical id.
 *
 * Unlike deterministic matching (which throws on ambiguity), this always
 * succeeds for any non-empty input: if the sidecar finds no group
 * containing (a majority of) these candidates, or finds a group that
 * doesn't include all of them, the function still returns an id derived
 * from the first candidate — probabilistic matching's job here is to
 * decide whether cross-source records SHOULD be treated as one canonical
 * identity, which the orchestrator uses to decide whether to merge at all
 * (see orchestrator.ts). A single contributing record needs no sidecar
 * call at all.
 */
export async function computeCanonicalPatientIdProbabilistic(patients: CanonicalPatient[]): Promise<{
  canonicalId: string;
  matchedGroup: string[] | null;
  score: number | null;
}> {
  if (patients.length === 1) {
    const [only] = patients;
    return { canonicalId: only.id, matchedGroup: null, score: null };
  }

  const idsInThisQuery = patients.map(candidateId);
  const groups = await findProbableMatchGroups(patients);

  const matchingGroup = groups.find((g) => idsInThisQuery.every((id) => g.candidateIds.includes(id)));

  if (matchingGroup) {
    return { canonicalId: idsInThisQuery[0], matchedGroup: matchingGroup.candidateIds, score: matchingGroup.score };
  }

  // No group covers all contributing records as a probable match — do not
  // merge. Distinct from deterministic matching's behaviour (which throws
  // on ambiguity/no-match for multiple records): probabilistic matching's
  // whole purpose is to sometimes conclude "these do not match," and that
  // is a valid, non-error outcome here.
  return { canonicalId: idsInThisQuery[0], matchedGroup: null, score: null };
}
