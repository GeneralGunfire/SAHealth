import type { FastifyReply } from "fastify";

/**
 * Step 5: the one standard error response shape for the backend and
 * gateway — { error: { code, message, details? } }. Every route/guard/
 * global error handler in this process sends errors through
 * sendError()/errorBody() rather than constructing an ad-hoc object
 * inline, so the shape can never silently drift per-route.
 */
export type ErrorCode =
  | "validation-failed"
  | "consent-rejected"
  | "source-unreachable"
  | "rate-limited"
  | "not-found"
  | "internal-error";

export function errorBody(code: ErrorCode, message: string, details?: unknown) {
  return { error: { code, message, ...(details !== undefined ? { details } : {}) } };
}

export function sendError(reply: FastifyReply, status: number, code: ErrorCode, message: string, details?: unknown) {
  return reply.code(status).send(errorBody(code, message, details));
}
