import type {
  CanonicalPatient,
  CanonicalEncounter,
  CanonicalObservation,
  CanonicalMedicationStatement,
} from "../canonical/index.js";

/**
 * Everything a single fetch from a source system returns, in that source's
 * own native shape, for one patient. `TRaw` is adapter-specific and never
 * seen outside that adapter's own folder.
 */
export interface RawSourceBundle<TRaw = unknown> {
  patient: TRaw;
  encounters: TRaw[];
  observations: TRaw[];
  medicationStatements: TRaw[];
}

/**
 * A translated bundle in canonical shape, before Zod validation.
 * The orchestrator validates each field against the canonical schemas;
 * adapters are expected to produce data that will pass validation, but
 * are not required to validate it themselves.
 */
export interface CanonicalBundle {
  patient: CanonicalPatient;
  encounters: CanonicalEncounter[];
  observations: CanonicalObservation[];
  medicationStatements: CanonicalMedicationStatement[];
}

/**
 * A mapping ambiguity or ignored discrepancy the adapter chose not to
 * resolve silently (Backend_Research.docx Section 2.3: unit mismatches,
 * coding-system mismatches, and field-path mismatches must be logged,
 * never silently resolved).
 */
export interface AdapterWarning {
  sourceId: string;
  sourceRecordId: string;
  message: string;
}

/**
 * The contract every source adapter must implement. The core (registry,
 * orchestrator) depends only on this interface — never on a specific
 * adapter's identity or internal shape.
 */
export interface SourceAdapter<TRaw = unknown> {
  /** Unique, stable id for this source. Used in config, logs, and sourceRecord refs. */
  id: string;

  /** Human-readable name for logs/diagnostics only. */
  displayName: string;

  /**
   * Fetch this source's raw data for one patient, keyed by that source's own
   * native patient identifier. Returns null if the source has no record for
   * that id. May throw on connectivity/protocol failure — the orchestrator
   * catches and logs this without crashing the whole query.
   */
  fetchPatient(sourcePatientId: string): Promise<RawSourceBundle<TRaw> | null>;

  /**
   * Translate a raw bundle into canonical shape. Must perform any structural,
   * unit, and terminology normalisation itself (Section 2.3); ambiguous or
   * unresolved mappings should be pushed onto `warnings` rather than guessed.
   * Canonical `id` fields may be left as a placeholder (e.g. the source-native id) —
   * the identity-matching module assigns the final canonical Patient id.
   */
  translate(raw: RawSourceBundle<TRaw>, warnings: AdapterWarning[]): CanonicalBundle;
}
