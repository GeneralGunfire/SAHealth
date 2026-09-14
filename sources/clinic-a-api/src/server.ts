import Fastify from "fastify";
import { pool } from "./db.js";

// Step 3: fail-fast config validation. API_KEY has a safe dev default so
// it stays optional; PORT does not have a safe "invalid" value (a
// malformed one would silently become NaN below), so it is format-checked
// eagerly, before Fastify is even constructed.
if (process.env.PORT !== undefined && !/^\d+$/.test(process.env.PORT)) {
  console.error(`FATAL: clinic-a-api cannot start — PORT is set to an invalid value ("${process.env.PORT}"). Must be a positive integer.`);
  process.exit(1);
}

// Structured logging (pino, Fastify's built-in): JSON to stdout, a
// `service` field identifying this process, and Fastify's default
// per-request `requestId`, matching the main backend/gateway's scheme.
const app = Fastify({
  logger: {
    base: { service: "clinic-a-api" },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
});
const API_KEY = process.env.API_KEY ?? "clinic-a-dev-key-change-me";

// Step 5: standard error shape { error: { code, message, details? } },
// matching the backend/gateway's own shape (src/api/errors.ts) — each
// source is an independently deployable package with no shared import
// path to that module, so the same tiny helper is inlined here.
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
 * Returns one patient's full record bundle in Clinic A's own native shape
 * (matching src/adapters/clinic-a/types.ts in the main backend). Returns
 * 404 if the patient_id is not known to this source — that is not an
 * error, just "this source has nothing for this id."
 */
app.get("/patients/:patientId", async (request, reply) => {
  const { patientId } = request.params as { patientId: string };

  const patientResult = await pool.query("SELECT * FROM patients WHERE patient_id = $1", [patientId]);
  if (patientResult.rows.length === 0) {
    return sendError(reply, 404, "not-found", "Patient not found in Clinic A.");
  }
  const p = patientResult.rows[0];

  const [visits, labResults, medications] = await Promise.all([
    pool.query("SELECT * FROM visits WHERE patient_id = $1", [patientId]),
    pool.query("SELECT * FROM lab_results WHERE patient_id = $1", [patientId]),
    pool.query("SELECT * FROM medications WHERE patient_id = $1", [patientId]),
  ]);

  return reply.send({
    patient: {
      patientRef: p.patient_id,
      identifiers: [
        ...(p.national_id ? [{ idType: "NAT-ID", idValue: p.national_id }] : []),
        { idType: "MRN", idValue: p.mrn },
      ],
      firstNames: p.first_name,
      surname: p.last_name,
      sex: p.sex,
      dob: formatDateDDMMYYYY(p.date_of_birth),
      cellNumber: p.mobile,
      emailAddress: p.email,
      addr: { street: p.street, town: p.town, province: p.province, zip: p.postal_code },
    },
    visits: visits.rows.map((v) => ({
      visitId: v.visit_id,
      patientRef: v.patient_id,
      visitStatus: v.status,
      visitType: v.visit_type,
      startedAt: formatDateTimeDDMMYYYY(v.started_at),
      endedAt: v.ended_at ? formatDateTimeDDMMYYYY(v.ended_at) : null,
    })),
    labResults: labResults.rows.map((r) => ({
      resultId: r.result_id,
      patientRef: r.patient_id,
      resultStatus: r.status,
      panel: r.panel,
      testCode: r.test_code,
      testName: r.test_name,
      resultDateTime: formatDateTimeDDMMYYYY(r.result_at),
      resultValue: Number(r.result_value),
      resultUnit: r.result_unit, // may be null — adapter must handle this explicitly
    })),
    medications: medications.rows.map((m) => ({
      medRecordId: m.med_id,
      patientRef: m.patient_id,
      medStatus: m.status,
      medicationFreeText: m.medication_text,
      startedAt: formatDateDDMMYYYY(m.started_at),
      instructions: m.instructions,
    })),
  });
});

/** `dateStr` is a raw "YYYY-MM-DD" string (see db.ts's DATE type parser override). */
function formatDateDDMMYYYY(dateStr: string): string {
  const [yyyy, mm, dd] = dateStr.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

/** TIMESTAMPTZ columns come back as real JS Date instants — safe to read via UTC getters. */
function formatDateTimeDDMMYYYY(date: Date): string {
  const d = new Date(date);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();
  const timePart = `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  return `${dd}/${mm}/${yyyy} ${timePart}`;
}

const port = Number(process.env.PORT ?? 4001);
app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`Clinic A source API listening on port ${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
