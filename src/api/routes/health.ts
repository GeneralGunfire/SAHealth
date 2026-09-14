import type { FastifyInstance } from "fastify";
import { pool } from "../../db/pool.js";
import { loadConfig } from "../../config/loadConfig.js";
import { classifySourceFailure } from "../../core/sourceFailureReason.js";
import { getOutboxPublisherLastSuccessfulRunAt } from "../../core/audit/outboxPublisher.js";

/**
 * Step 2: health/readiness endpoints.
 *
 * /health — always fast, no dependency checks at all. Confirms only that
 * the process itself is up and responding. This is what a load balancer or
 * process supervisor should poll frequently.
 *
 * /healthz — a deep check across every real dependency this backend has:
 * its own Postgres DB, each of the five sources' reachability, the outbox
 * publisher's last successful tick, and the probabilistic-matching
 * sidecar. Reuses the SAME failure classification (classifySourceFailure)
 * Phase 3's orchestrator already uses, for the same per-source honesty —
 * this route does not invoke the orchestrator, any adapter's
 * fetchPatient/translate, or touch consent/audit logic at all; it only
 * does a lightweight reachability probe per source's base URL.
 *
 * Consistent with this project's existing offline-honesty design:
 * /healthz never collapses "4 of 5 sources up" into a single boolean. It
 * returns 200 with a full per-component breakdown — the HTTP status code
 * reports "this endpoint answered," not "everything downstream is healthy."
 */
export async function healthRoutes(app: FastifyInstance) {
  app.get("/health", async (_request, reply) => {
    return reply.send({ status: "ok" });
  });

  app.get("/healthz", async (_request, reply) => {
    const [db, sources, sidecar] = await Promise.all([checkDatabase(), checkSources(), checkSidecar()]);

    return reply.send({
      status: "ok", // this endpoint itself answered; see `components` for actual health
      timestamp: new Date().toISOString(),
      components: {
        database: db,
        sources,
        outboxPublisher: {
          lastSuccessfulRunAt: getOutboxPublisherLastSuccessfulRunAt(),
        },
        probabilisticMatchingSidecar: sidecar,
      },
    });
  });
}

async function checkDatabase(): Promise<{ reachable: boolean; reason: string | null }> {
  try {
    await pool.query("SELECT 1");
    return { reachable: true, reason: null };
  } catch (err) {
    return { reachable: false, reason: classifySourceFailure(err) };
  }
}

export interface SourceHealthComponent {
  sourceId: string;
  reachable: boolean;
  responseTimeMs: number | null;
  reason: string | null;
}

/**
 * Exported (not just used internally by /healthz) so tests can exercise the
 * real reachability-probe logic directly against an arbitrary source list —
 * including a deliberately-unreachable URL for the simulated-partial-outage
 * test — without needing to mutate the live src/config/sources.json file on
 * disk (which would risk leaving it corrupted if a test failed mid-write).
 */
export async function checkSources(
  sources: { id: string; connection: Record<string, unknown> }[] = loadConfig().activeSources
): Promise<SourceHealthComponent[]> {
  return Promise.all(
    sources.map(async (source) => {
      const connection = source.connection as { baseUrl?: string; apiKey?: string };
      if (!connection.baseUrl) {
        return { sourceId: source.id, reachable: false, responseTimeMs: null, reason: "invalid-response" };
      }

      const startedAt = performance.now();
      try {
        // A lightweight reachability probe only — no adapter's
        // fetchPatient/translate is invoked, so this never touches
        // orchestrator/matching logic. None of the five source services
        // expose a dedicated /health route (all require an API key on
        // every route via their onRequest hook), so this hits the base URL
        // directly: any HTTP response at all (even the expected 401 for an
        // unauthenticated request) proves the process is up and answering
        // — only a genuine network-level failure (nothing listening,
        // timeout, DNS failure) counts as unreachable here.
        await fetch(connection.baseUrl, { signal: AbortSignal.timeout(3000) });
        return { sourceId: source.id, reachable: true, responseTimeMs: Math.round(performance.now() - startedAt), reason: null };
      } catch (err) {
        return {
          sourceId: source.id,
          reachable: false,
          responseTimeMs: Math.round(performance.now() - startedAt),
          reason: classifySourceFailure(err),
        };
      }
    })
  );
}

async function checkSidecar(): Promise<{ reachable: boolean; responseTimeMs: number | null; reason: string | null }> {
  const sidecarUrl = process.env.PROBABILISTIC_MATCHING_SIDECAR_URL ?? "http://localhost:5001";
  const startedAt = performance.now();
  try {
    const response = await fetch(`${sidecarUrl}/health`, { signal: AbortSignal.timeout(3000) });
    if (!response.ok) {
      return { reachable: false, responseTimeMs: Math.round(performance.now() - startedAt), reason: "invalid-response" };
    }
    return { reachable: true, responseTimeMs: Math.round(performance.now() - startedAt), reason: null };
  } catch (err) {
    return { reachable: false, responseTimeMs: Math.round(performance.now() - startedAt), reason: classifySourceFailure(err) };
  }
}
