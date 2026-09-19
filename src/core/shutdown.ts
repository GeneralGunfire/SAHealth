import type { FastifyInstance } from "fastify";

/**
 * Graceful shutdown for the backend and gateway processes.
 *
 * Purely operational: this changes only how a process *stops*, never how it
 * answers a request. Consent, audit, orchestration and matching behaviour are
 * untouched — an in-flight query runs to completion exactly as it would have
 * without a signal.
 *
 * On SIGTERM/SIGINT:
 *   1. `app.close()` stops accepting new connections and lets in-flight
 *      requests finish. Fastify's own `onClose` hooks run here, which is where
 *      the backend stops its outbox publisher interval (src/api/server.ts).
 *   2. Registered cleanup callbacks run (DB pool drain, etc.).
 *   3. Exit 0.
 *
 * If step 1+2 have not finished within `timeoutMs`, the process force-exits
 * with a non-zero code so an operator (or a supervisor/CI) can tell a clean
 * drain apart from one that had to be cut short.
 */
export interface ShutdownOptions {
  /** How long in-flight work gets to finish before a force-close. */
  timeoutMs?: number;
  /**
   * Cleanup to run after HTTP has drained — typically closing DB pools.
   * Errors here are logged, not thrown: a failed pool close must not turn a
   * clean drain into a hung process.
   */
  onCleanup?: () => Promise<void>;
}

export function installGracefulShutdown(app: FastifyInstance, options: ShutdownOptions = {}): void {
  const { timeoutMs = 10_000, onCleanup } = options;

  // A second signal during an in-progress shutdown must not start a second
  // drain (which would double-close the pool and race the timer).
  let shuttingDown = false;

  const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) {
      app.log.warn(`Received ${signal} while already shutting down; ignoring.`);
      return;
    }
    shuttingDown = true;
    app.log.info(`Received ${signal}; shutting down gracefully (up to ${timeoutMs}ms for in-flight requests).`);

    // The force-close path. `unref()` so this timer alone never keeps the
    // event loop alive if the drain finishes first.
    const forceExit = setTimeout(() => {
      app.log.error(`Graceful shutdown timed out after ${timeoutMs}ms; force-closing with in-flight work unfinished.`);
      process.exit(1);
    }, timeoutMs);
    forceExit.unref();

    try {
      // Stops accepting new connections, waits for in-flight requests, then
      // runs onClose hooks (outbox publisher interval is cleared there).
      await app.close();
      if (onCleanup) {
        await onCleanup();
      }
      clearTimeout(forceExit);
      app.log.info("Graceful shutdown complete.");
      process.exit(0);
    } catch (err) {
      clearTimeout(forceExit);
      app.log.error(err, "Error during graceful shutdown.");
      process.exit(1);
    }
  };

  for (const signal of ["SIGTERM", "SIGINT"] as const) {
    process.on(signal, () => {
      void shutdown(signal);
    });
  }
}
