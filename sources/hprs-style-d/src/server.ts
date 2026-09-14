import Fastify from "fastify";
import { db } from "./db.js";
import { decryptSaIdNumber } from "./encryption.js";

// Step 3: fail-fast config validation.
if (process.env.PORT !== undefined && !/^\d+$/.test(process.env.PORT)) {
  console.error(`FATAL: hprs-style-d-api cannot start — PORT is set to an invalid value ("${process.env.PORT}"). Must be a positive integer.`);
  process.exit(1);
}
// SA_ID_ENCRYPTION_KEY has no safe default (see encryption.ts) — previously
// this only surfaced as a thrown error on the first encrypt/decrypt call,
// i.e. the first real request. Checked eagerly here so a missing key fails
// at startup, not mysteriously on first use.
if (!process.env.SA_ID_ENCRYPTION_KEY) {
  console.error(
    "FATAL: hprs-style-d-api cannot start — SA_ID_ENCRYPTION_KEY is not set. " +
      "A 32-byte (or longer) secret is required to encrypt/decrypt sa_id_number."
  );
  process.exit(1);
}

// Structured logging (pino, Fastify's built-in): JSON to stdout, a
// `service` field identifying this process, and Fastify's default
// per-request `requestId`, matching the main backend/gateway's scheme.
const app = Fastify({
  logger: {
    base: { service: "hprs-style-d-api" },
    timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
  },
});
const API_KEY = process.env.API_KEY ?? "hprs-style-d-dev-key-change-me";

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

interface PatientRow {
  hprs_uuid: string;
  sa_id_number: string;
  given_name: string;
  family_name: string;
  sex: "M" | "F";
  date_of_birth: string;
  mobile_number: string;
  facility_code: string;
}

interface VisitRow {
  visit_uuid: string;
  hprs_uuid: string;
  visit_status: "OPEN" | "CLOSED";
  visit_date: string;
}

interface DiagnosisRow {
  diagnosis_uuid: string;
  visit_uuid: string;
  snomed_code: string;
  snomed_display: string;
  recorded_date: string;
}

interface MedicationRow {
  med_uuid: string;
  hprs_uuid: string;
  status: "ACTIVE" | "ENDED";
  medication_code: string;
  medication_name: string;
  dosage_text: string;
  prescribed_date: string;
}

/**
 * Returns one patient's full record bundle in Source D's native HPRS-style
 * shape: an HPRS-style UUID as the addressable id, a validated 13-digit SA
 * ID number, and required (never null) core demographic fields — this
 * source's archetype is stricter validation than the other three, not
 * looser.
 */
app.get("/patients/:hprsUuid", async (request, reply) => {
  const { hprsUuid } = request.params as { hprsUuid: string };

  const patient = db.prepare("SELECT * FROM patients WHERE hprs_uuid = ?").get(hprsUuid) as PatientRow | undefined;
  if (!patient) {
    return sendError(reply, 404, "not-found", "Patient not found in Source D.");
  }

  const visits = db.prepare("SELECT * FROM visits WHERE hprs_uuid = ?").all(hprsUuid) as VisitRow[];
  const visitUuids = visits.map((v) => v.visit_uuid);

  const diagnoses: DiagnosisRow[] = visitUuids.length
    ? (db
        .prepare(`SELECT * FROM diagnoses WHERE visit_uuid IN (${visitUuids.map(() => "?").join(",")})`)
        .all(...visitUuids) as DiagnosisRow[])
    : [];

  const medications = db.prepare("SELECT * FROM medication_records WHERE hprs_uuid = ?").all(hprsUuid) as MedicationRow[];

  return reply.send({
    patient: {
      hprsUuid: patient.hprs_uuid,
      // sa_id_number is stored encrypted at rest (see encryption.ts) and
      // decrypted here, at the point of serving it over the authenticated
      // API — the only other place this source's data leaves the process.
      saIdNumber: decryptSaIdNumber(patient.sa_id_number),
      givenName: patient.given_name,
      familyName: patient.family_name,
      sex: patient.sex,
      dateOfBirth: patient.date_of_birth,
      mobileNumber: patient.mobile_number,
      facilityCode: patient.facility_code,
    },
    visits: visits.map((v) => ({
      visitUuid: v.visit_uuid,
      hprsUuid: v.hprs_uuid,
      visitStatus: v.visit_status,
      visitDate: v.visit_date,
      diagnoses: diagnoses
        .filter((d) => d.visit_uuid === v.visit_uuid)
        .map((d) => ({
          diagnosisUuid: d.diagnosis_uuid,
          snomedCode: d.snomed_code,
          snomedDisplay: d.snomed_display,
          recordedDate: d.recorded_date,
        })),
    })),
    medications: medications.map((m) => ({
      medUuid: m.med_uuid,
      hprsUuid: m.hprs_uuid,
      status: m.status,
      medicationCode: m.medication_code,
      medicationName: m.medication_name,
      dosageText: m.dosage_text,
      prescribedDate: m.prescribed_date,
    })),
  });
});

const port = Number(process.env.PORT ?? 4004);
app
  .listen({ port, host: "0.0.0.0" })
  .then(() => app.log.info(`Source D (HPRS-style, SQLite) API listening on port ${port}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
