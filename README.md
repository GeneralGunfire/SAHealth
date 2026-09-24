# SA Health Interoperability Platform

**Status: pre-restart implementation retired, rebuild pending.**

The source-querying pipeline that this repository previously demonstrated — a gateway,
an orchestrator, an adapter registry, and five simulated healthcare source services
(Clinic A, Hospital B, Source C/DHIS2-style, Source D/HPRS-style, Pharmacy E), plus
their database schemas, migrations and the probabilistic-matching sidecar — has been
removed. What remains is the consent-token and audit-trail subsystem, kept as the
foundation for the next implementation.

> **This is a prototype built on synthetic data.** It is not production software and is
> not connected to any real South African healthcare system.

---

## What's here now

- **Canonical model** (`src/canonical/`) — Zod schemas for `Patient`, `Encounter`,
  `Observation`, `MedicationStatement`, and the consent-token claims shape.
- **Consent** (`src/core/consent/`) — a signed, scope-limited token (JWT via `jose`).
  `POST /consent/tokens` issues one; `consentGuard` enforces it.
- **Audit + outbox** (`src/core/audit/`) — every token issue, audit-trail read, and
  consent rejection is recorded. Writes go first to an `audit_outbox` table (fast,
  local, never blocks the response), and a background publisher drains it into
  `audit_events` every 2 seconds; a temporarily-unavailable downstream write leaves the
  row in the outbox to retry rather than losing it.
- **Backend process** (`src/api/server.ts`) — a Fastify process on `BACKEND_PORT`
  (default `3010`) registering only the consent and audit routes above. Handles
  `SIGTERM`/`SIGINT` gracefully: stops accepting new connections, lets in-flight
  requests finish (10s budget), closes its database pool and stops the outbox
  publisher, then exits 0 — or non-zero if the drain timed out.

**Windows caveat:** Node on Windows cannot reliably deliver a catchable `SIGTERM` or
`SIGINT` to a running process's JS listeners. The shutdown handler logic was verified
by invoking the registered listener directly (a clean drain exits 0, a hung cleanup
times out and exits 1) — real signal delivery is only exercised on POSIX, i.e. in CI.

Everything that queried a source, translated its records into the canonical model, or
merged results across sources — the gateway, orchestrator, adapter registry, the five
source services and their databases/migrations, and the Splink sidecar — is gone. It is
not stubbed out or disabled; the code, dependencies, and database migration for it have
been deleted from this repository. A rebuild is expected in a future change.

---

## Prerequisites

- **Node.js** — CI pins **22**.
- **PostgreSQL** — CI uses **16**, for the backend's own database.
- **No Docker.** There is no `Dockerfile` or `docker-compose.yml` in the repository.

---

## Setup from a clean clone

```bash
npm install
psql -h localhost -U postgres -c "CREATE DATABASE sa_health;"
npm run db:migrate
```

There is currently no backend-owned table to migrate beyond what `node-pg-migrate`
tracks for itself — the canonical-model migration that used to live here was removed
along with the pipeline it backed. `audit_events` and `audit_outbox` are created by
whichever migration reintroduces them in the rebuild.

### Environment variables

| Variable | Required by | Behaviour if unset |
|---|---|---|
| `CONSENT_TOKEN_SIGNING_KEY` | backend | **Fatal.** The backend refuses to start — otherwise consent tokens would be signed with a publicly-known prototype secret. |
| `DATABASE_URL` | backend | Defaults to `postgres://postgres:postgres@localhost:5432/sa_health`. Format-validated if set. |
| `BACKEND_PORT` | backend | Defaults to `3010`. Rejected at startup if not a positive integer. |

### Start the backend

```bash
CONSENT_TOKEN_SIGNING_KEY=<key> npm run dev    # :3010
```

---

## Running the tests

```bash
npm test          # vitest run
npm run lint
npx tsc -p tsconfig.json --noEmit
```

What's left is a small, self-contained suite covering consent-token enforcement and
the audit outbox — no source services, sidecar, or gateway need to be running first.

**A known test race:** `tests/core/audit.outbox.test.ts` fails intermittently when
another backend process happens to be running against the same database — the live
outbox publisher's 2-second tick can drain the test's row before the test reads it
back. It is a test-isolation issue, not a defect in the outbox itself, and predates
this retirement. With no other backend running, that file passes consistently.

---

## Exploring the API with no frontend

With the backend running, open **<http://localhost:3010/docs>** (raw document at
`/docs/json`) for the current OpenAPI document — now covering only `/consent/tokens`
and the audit-trail read, since the patient-query and health-check routes were removed
with the pipeline they served.

```bash
TOKEN=$(curl -s -X POST http://localhost:3010/consent/tokens \
  -H "Content-Type: application/json" \
  -d '{
        "requestingParty": "demo-clinician",
        "patientId": "SYN-8801015800083",
        "scopes": ["Patient", "Encounter", "Observation", "MedicationStatement"],
        "purpose": "demonstration"
      }' | jq -r .token)

curl -s "http://localhost:3010/patients/SYN-8801015800083/audit-trail" \
  -H "Authorization: Bearer $TOKEN" | jq
```

There is nothing left to query yet — no adapters, no orchestrator — so the audit trail
above will be empty until a rebuilt query path starts recording events again.

---

## Known limitations

- **No source-querying pipeline.** The gateway, orchestrator, adapter registry, all
  five simulated source services, and the probabilistic-matching sidecar have been
  removed. Rebuilding them is the next piece of work, not something this repository
  currently does.
- **A known test race.** See "Running the tests" above.
- **No frontend.** API and Swagger UI only.
- **Prototype security posture carries over.** The consent token is properly signed and
  scope-checked, but there is no real identity provider behind `requestingParty` — a
  caller asserts who they are.
- **Single-node, no deployment story.** No Docker, no orchestration, no TLS.

---

## Project documents

`docs/` contains three documents describing the retired implementation, kept for
reference during the rebuild:

- [`docs/ai-assisted-adapter-generation.md`](docs/ai-assisted-adapter-generation.md)
- [`docs/data-governance.md`](docs/data-governance.md)
- [`docs/probabilistic-matching.md`](docs/probabilistic-matching.md)

`Backend_Research.docx`, `Research_Plan.docx`, `Research_Report.docx`, and any dated
session logs are referenced in prior source comments but are **not present in this
repository or its parent directory** — see `CONTRIBUTING.md` for where that research
document's claims and the code have previously diverged.
