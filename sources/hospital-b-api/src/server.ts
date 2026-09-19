import Fastify from "fastify";
import { pool } from "./db.js";

// Step 3: fail-fast config validation — see clinic-a-api/src/server.ts for rationale.
if (process.env.PORT !== undefined && !/^\d+$/.test(process.env.PORT)) {
  console.error(`FATAL: hospital-b-api cannot start — PORT is set to an invalid value ("${process.env.PORT}"). Must be a positive integer.`);
  process.exit(1);
}

// Structured logging (pino, Fastify's built-in): JSON to stdout, a
// `service` field identifying this process, and Fastify's default
// per-request `requestId`, matching the main backend/gateway's scheme.
const app = Fastify({
  logger: {
    base: { service: "hospital-b-api" },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
});
const API_KEY = process.env.API_KEY ?? "hospital-b-dev-key-change-me";

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
 * Returns one patient's full record bundle in Hospital B's own legacy
 * native shape (matching src/adapters/hospital-b/types.ts in the main
 * backend). Hospital B's "native patient id" as exposed externally is its
 * hosp_no (a stable business identifier), NOT pat_seq (a pure internal
 * auto-increment with no meaning outside this database) — this mirrors how
 * a real hospital system would expose a hospital number, not a raw DB key,
 * to external callers.
 */
app.get("/patients/:hospNo", async (request, reply) => {
  const { hospNo } = request.params as { hospNo: string };

  const patientResult = await pool.query("SELECT * FROM pat_master WHERE hosp_no = $1", [hospNo]);
  if (patientResult.rows.length === 0) {
    return sendError(reply, 404, "not-found", "Patient not found in Hospital B.");
  }
  const p = patientResult.rows[0];

  const [admissions, observations, medications] = await Promise.all([
    pool.query("SELECT * FROM admissions WHERE pat_seq = $1", [p.pat_seq]),
    pool.query("SELECT * FROM obs_tbl WHERE pat_seq = $1", [p.pat_seq]),
    pool.query("SELECT * FROM rx_tbl WHERE pat_seq = $1", [p.pat_seq]),
  ]);

  return reply.send({
    patientRecord: {
      hb_patient_id: p.hosp_no,
      identifiers: { nationalId: p.nat_id_no, hospitalNumber: p.hosp_no },
      demographics: {
        fullName: { first: null, middle: null, last: p.surname, initials: p.initials },
        genderCode: p.sex_cd,
        dateOfBirth: p.pat_dob, // free text, inconsistent format — adapter must parse defensively
        telecom: { mobile: p.mobile_no, email: p.email_addr },
        residentialAddress: p.addr_line,
        suburb: p.suburb_txt,
        region: p.region_txt,
        postCode: p.post_cd,
      },
    },
    admissions: admissions.rows.map((a) => ({
      admissionId: `HB-A-${a.adm_seq}`,
      hb_patient_id: p.hosp_no,
      admissionStatus: a.adm_status,
      careLevel: a.care_lvl,
      admittedAtUtc: a.adm_dt, // free text, inconsistent format
      dischargedAtUtc: a.dis_dt,
    })),
    observations: observations.rows.map((o) => ({
      obsId: `HB-O-${o.obs_seq}`,
      hb_patient_id: p.hosp_no,
      obsStatus: o.obs_status,
      domain: o.domain_cd,
      loincLikeCode: o.loc_code,
      description: o.obs_desc,
      observedAtUtc: o.obs_dt, // free text, inconsistent format
      measurement: { amount: Number(o.obs_amt), units: o.obs_units }, // units may be null
    })),
    medications: medications.rows.map((m) => ({
      medId: `HB-M-${m.rx_seq}`,
      hb_patient_id: p.hosp_no,
      medStatus: m.rx_status,
      formularyCode: m.formulary_cd,
      formularyDisplay: m.formulary_txt,
      freeTextFallback: m.free_txt,
      prescribedAtUtc: m.rx_dt, // free text, inconsistent format
      dosageInstructions: m.dosage_txt,
    })),
  });
});

// Graceful shutdown on SIGTERM/SIGINT — see clinic-a-api/src/server.ts for
// why this small helper is inlined per source rather than shared.
let shuttingDown = false;
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    app.log.info(`Received ${signal}; shutting down gracefully.`);
    const forceExit = setTimeout(() => {
      app.log.error("Graceful shutdown timed out after 10000ms; force-closing.");
      process.exit(1);
    }, 10_000);
    forceExit.unref();
    void app
      .close()
      .then(() => pool.end())
      .then(() => {
        clearTimeout(forceExit);
        app.log.info("Graceful shutdown complete.");
        process.exit(0);
      })
      .catch((err) => {
        clearTimeout(forceExit);
        app.log.error(err, "Error during graceful shutdown.");
        process.exit(1);
      });
  });
}

const port = Number(process.env.PORT ?? 4002);
app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`Hospital B source API listening on port ${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
