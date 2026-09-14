import pino from "pino";

/**
 * Structured logging (pino), replacing the earlier hand-rolled
 * console.log-based logger. JSON to stdout only — no log aggregation
 * infrastructure (ELK/Loki), consistent with the production-hardening
 * scope explicitly deferred in Backend_Research.docx Section 11.1
 * ("centralised structured logging, metrics and alerting" is listed as
 * beyond-prototype work).
 *
 * Every log line carries: timestamp (pino's default `time`), level,
 * `service` (which process emitted it), and, via the `meta` object,
 * `requestId`/`patientId`/`actorId` where applicable to that call site.
 *
 * The `logger.info/warn/error(message, meta)` call signature is unchanged
 * from the previous hand-rolled version, so every existing call site in
 * core/ (orchestrator, identityMatch, audit, consent) needed zero changes.
 */
const pinoLogger = pino({
  base: { service: "sa-health-backend" },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    pinoLogger.info(meta ?? {}, message);
  },
  warn(message: string, meta?: Record<string, unknown>) {
    pinoLogger.warn(meta ?? {}, message);
  },
  error(message: string, meta?: Record<string, unknown>) {
    pinoLogger.error(meta ?? {}, message);
  },
};
