import Fastify from "fastify";
import { pool } from "./db.js";

// Step 3: fail-fast config validation — see clinic-a-api/src/server.ts for rationale.
if (process.env.PORT !== undefined && !/^\d+$/.test(process.env.PORT)) {
  console.error(`FATAL: pharmacy-e-api cannot start — PORT is set to an invalid value ("${process.env.PORT}"). Must be a positive integer.`);
  process.exit(1);
}

// Structured logging (pino, Fastify's built-in): JSON to stdout, a
// `service` field identifying this process, and Fastify's default
// per-request `requestId`, matching the main backend/gateway's scheme.
const app = Fastify({
  logger: {
    base: { service: "pharmacy-e-api" },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
});
const API_KEY = process.env.API_KEY ?? "pharmacy-e-dev-key-change-me";

// Step 5: standard error shape { error: { code, message, details? } } — see clinic-a-api/src/server.ts.
function sendError(reply: import("fastify").FastifyReply, status: number, code: string, message: string) {
  return reply.code(status).send({ error: { code, message } });
}

app.addHook("onRequest", async (request, reply) => {
  const auth = request.headers.authorization;
  if (auth !== `Bearer ${API_KEY}`) {
    return sendError(reply, 401, "consent-rejected", "Missing or invalid API key.");
  }
});

/**
 * Returns one patient's full record bundle in Pharmacy E's own native
 * shape (matching src/adapters/pharmacy-e/types.ts in the main backend).
 * There is no encounter/observation data at all — this is a dispensing
 * feed, and the response reflects that structurally rather than returning
 * empty placeholder arrays for concepts this source doesn't have.
 */
app.get("/patients/:pid", async (request, reply) => {
  const { pid } = request.params as { pid: string };

  const patientResult = await pool.query("SELECT * FROM patients WHERE pid = $1", [pid]);
  if (patientResult.rows.length === 0) {
    return sendError(reply, 404, "not-found", "Patient not found in Pharmacy E.");
  }
  const p = patientResult.rows[0];

  const rxResult = await pool.query("SELECT * FROM dispensing_records WHERE pid = $1", [pid]);

  return reply.send({
    pat: {
      pid: p.pid,
      sur: p.surname,
      gv: p.given_name,
      dob: p.dob,
      sx: p.sex,
      cell: p.cell,
      nid: p.national_id,
    },
    rx: rxResult.rows.map((r) => ({
      rxid: r.rx_id,
      pid: r.pid,
      drugcd: r.drug_code,
      drugnm: r.drug_name,
      qtydisp: Number(r.qty_dispensed),
      dayssup: Number(r.days_supply),
      sig: r.sig,
      dtdisp: r.date_dispensed,
      rxstat: r.rx_status,
    })),
  });
});

const port = Number(process.env.PORT ?? 4005);
app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`Pharmacy E source API listening on port ${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
