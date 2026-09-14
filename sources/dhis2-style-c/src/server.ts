import Fastify from "fastify";
import { pool } from "./db.js";

// Step 3: fail-fast config validation — see clinic-a-api/src/server.ts for rationale.
if (process.env.PORT !== undefined && !/^\d+$/.test(process.env.PORT)) {
  console.error(`FATAL: dhis2-style-c-api cannot start — PORT is set to an invalid value ("${process.env.PORT}"). Must be a positive integer.`);
  process.exit(1);
}

// Structured logging (pino, Fastify's built-in): JSON to stdout, a
// `service` field identifying this process, and Fastify's default
// per-request `requestId`, matching the main backend/gateway's scheme.
const app = Fastify({
  logger: {
    base: { service: "dhis2-style-c-api" },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
});
const API_KEY = process.env.API_KEY ?? "dhis2-style-c-dev-key-change-me";

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
 * Returns one tracked entity's full record bundle in Source C's native
 * DHIS2-style shape: attribute values as key/value rows (not fixed
 * demographic columns), enrollments, and events whose clinical content is
 * itself a set of loose data-element key/value rows. This is the real
 * DHIS2 tracker model, not a relabelled patient-record shape — the adapter
 * is expected to do genuine structural translation, not field renaming.
 */
app.get("/tracked-entities/:teiUid", async (request, reply) => {
  const { teiUid } = request.params as { teiUid: string };

  const teiResult = await pool.query("SELECT * FROM tracked_entities WHERE tei_uid = $1", [teiUid]);
  if (teiResult.rows.length === 0) {
    return sendError(reply, 404, "not-found", "Tracked entity not found in Source C.");
  }
  const tei = teiResult.rows[0];

  const [attributes, enrollments] = await Promise.all([
    pool.query("SELECT attribute_code, value FROM tracked_entity_attributes WHERE tei_uid = $1", [teiUid]),
    pool.query("SELECT * FROM enrollments WHERE tei_uid = $1", [teiUid]),
  ]);

  const enrollmentUids = enrollments.rows.map((e) => e.enrollment_uid);
  const events = enrollmentUids.length
    ? await pool.query("SELECT * FROM events WHERE enrollment_uid = ANY($1)", [enrollmentUids])
    : { rows: [] };

  const eventUids = events.rows.map((e) => e.event_uid);
  const dataValues = eventUids.length
    ? await pool.query("SELECT event_uid, data_element_code, value FROM event_data_values WHERE event_uid = ANY($1)", [eventUids])
    : { rows: [] };

  return reply.send({
    trackedEntity: {
      teiUid: tei.tei_uid,
      orgUnitUid: tei.org_unit_uid,
      attributes: attributes.rows.map((a) => ({ code: a.attribute_code, value: a.value })),
    },
    enrollments: enrollments.rows.map((e) => ({
      enrollmentUid: e.enrollment_uid,
      teiUid: e.tei_uid,
      programCode: e.program_code,
      orgUnitUid: e.org_unit_uid,
      status: e.status,
      enrollmentDate: e.enrollment_date,
    })),
    events: events.rows.map((ev) => ({
      eventUid: ev.event_uid,
      enrollmentUid: ev.enrollment_uid,
      programStage: ev.program_stage,
      orgUnitUid: ev.org_unit_uid,
      status: ev.status,
      eventDate: ev.event_date,
      dataValues: dataValues.rows
        .filter((dv) => dv.event_uid === ev.event_uid)
        .map((dv) => ({ code: dv.data_element_code, value: dv.value })),
    })),
  });
});

const port = Number(process.env.PORT ?? 4003);
app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`Source C (DHIS2-style) API listening on port ${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
