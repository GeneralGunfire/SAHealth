# SA Health Interoperability Platform — Phase 1 Prototype Backend

A working prototype that demonstrates health-record interoperability across five
**independently owned, deliberately incompatible simulated healthcare systems**. Each
source runs as its own process, with its own database, its own schema conventions and
its own authentication — exactly as separately-procured real systems would. The backend
queries them through per-source adapters, translates each into one canonical model,
merges what belongs to the same patient, and answers a single API request with the
result. Consent is enforced per request through a scope-limited token, every access is
audited, and when a source is unreachable the response says so explicitly instead of
quietly returning less data.

> **This is a prototype built on synthetic data.** It is not production software, it is
> not connected to any real South African healthcare system, and it contains no real
> patient data. Every patient record in this repository is invented, and identifiers
> are deliberately prefixed `SYN-` to make that unmistakable. Do not point it at real
> health data.

---

## Architecture

### The five simulated source systems

Each lives under `sources/<name>/` as a standalone npm package with its own
`package.json`, migrations, seed data and server process. None of them import anything
from the backend, and the backend never imports from them — they communicate only over
HTTP, authenticated with a per-source bearer API key.

The awkwardness in these schemas is the point: it is what makes the translation layer a
real exercise rather than a formality.

| Source | Port | Storage | Deliberately realistic awkwardness |
|---|---|---|---|
| `clinic-a-api` | 4001 | PostgreSQL (`clinic_a`) | Tidy, modern-looking schema — the "easy" source. Dates served as `DD/MM/YYYY` strings. Some records have `NULL` `national_id`, absent contact fields, or a lab result with a `NULL` unit. |
| `hospital-b-api` | 4002 | PostgreSQL (`hospital_b`) | Legacy-style abbreviated column names (`pat_master`, `nat_id_no`, `obs_tbl`, `rx_tbl`). Stores **initials only** (`P.`), not first names. Sex as a numeric code. Date fields are **free text with inconsistent formats across rows**. |
| `dhis2-style-c` | 4003 | PostgreSQL (`dhis2_style_c`) | DHIS2-shaped: demographics are not columns but **rows** in an entity–attribute–value table (`tracked_entity_attributes`), plus `org_units`, `enrollments`, `events` and `event_data_values`. A missing attribute is an **absent row**, not a `NULL`. |
| `hprs-style-d` | 4004 | **SQLite** (`hprs-style-d.sqlite`) | The strict source: required demographics, a validated 13-digit SA ID number, and its **own separate identifier scheme** (HPRS UUIDs) that does not cross-reference the others. `sa_id_number` is **encrypted at rest** (AES-256-GCM, deterministic nonce so the `UNIQUE` constraint still works). |
| `pharmacy-e-api` | 4005 | PostgreSQL (`pharmacy_e`) | Dispensing-only view of a patient — no clinical encounters. Dates as `DD-MON-YYYY` (`15-MAR-1979`). Some records have no national id, and OTC dispensing rows carry no drug code. |

Note that **four sources are PostgreSQL and one (Source D) is SQLite**. That is
intentional: it forces the adapter layer to be genuinely storage-engine agnostic.

### The backend

- **Canonical model** (`src/canonical/`) — Zod schemas for `Patient`, `Encounter`,
  `Observation` and `MedicationStatement`, plus the consent-token schema. This is the
  one shape the rest of the system reasons about; no source's native vocabulary leaks
  past its adapter.
- **Adapters** (`src/adapters/<source>/`) — one folder per source, each with
  `types.ts` (that source's native shape), `translate.ts` (native → canonical) and
  `index.ts` (exports a `SourceAdapter`). Ambiguities a translation cannot resolve
  honestly — a missing unit, an unmappable code — are pushed onto an `AdapterWarning`
  list rather than guessed.
- **Registry** (`src/core/registry.ts`) — discovers adapters by **scanning the
  `src/adapters/` directory** and filtering to the ids listed in
  `src/config/sources.json`. The core never imports a source by name, so adding a
  source is a new folder plus a config entry. The registry is also where each
  adapter's `fetchPatient` is wrapped with transient-failure retry.
- **Orchestrator** (`src/core/orchestrator.ts`) — fans out to every source that can
  resolve the requested patient, isolates failures per source (one source failing never
  fails the whole query), merges the results, and reports a per-source
  `sourceStatus` block distinguishing "not queried" from "queried but unreachable".
- **Gateway** (`src/api/gateway.ts`) — the public entry point on port **3000**, a thin
  Fastify process doing rate limiting and request logging before proxying to the
  backend on **3010**. It holds no database connection and no consent logic.
- **Consent** (`src/core/consent/`) — a signed, **scope-limited** token (JWT via
  `jose`). A token names the patient, the requesting party, a purpose, an expiry, and
  the specific resource types it covers. Requesting data outside that scope is rejected
  with `consent-rejected` / `scope-mismatch`, even for a token that is otherwise valid.
- **Audit + outbox** (`src/core/audit/`) — every token issue, query, audit-trail read
  and consent rejection is recorded. Writes go first to an `audit_outbox` table on the
  request path (fast, local, never blocks the response), and a background publisher
  drains the outbox into `audit_events` every 2 seconds. If that downstream write is
  temporarily unavailable the row stays in the outbox and is retried, so an audit event
  is never silently lost.

### The two identity-matching modes

- **Deterministic** (default, `src/core/identityMatch.ts`) — records merge only when
  they share the same synthetic national identifier. Honest and conservative: the
  four-way "Palesa Zulu" near-duplicate chain below does **not** merge, because no
  shared identifier exists.
- **Probabilistic** (opt-in, `?matching=probabilistic`) — delegates to a Python
  **Splink** sidecar (`sidecar-probabilistic-matching/`, FastAPI on port **5001**,
  `POST /match`). It scores fuzzy name and date-of-birth agreement and returns probable
  match *groups* above a threshold (`MATCH_THRESHOLD`, default **0.85**). It flags a
  probable match; it does not silently rewrite the deterministic result.

The demo case is deliberate: the same person appears as **Palesa** Zulu (Clinic A, with
a national id), initials-only **P.** Zulu (Hospital B, national id `NULL`), **Palesah**
Zulu (Source C, no national id attribute at all) and **Palesa** Zulu (Source D, under
its own separate HPRS identifier scheme) — all sharing DOB 1990-01-01.

---

## Prerequisites

- **Node.js** — CI pins **22**. There is no `engines` field in `package.json`, so this
  is the only version the project actually asserts. (Developed against Node 24 locally
  without issue.)
- **Python** — CI pins **3.11**, for the Splink sidecar only. The backend itself needs
  no Python.
- **PostgreSQL** — CI uses **16**. Needed for the backend database and four of the five
  sources. Source D needs nothing extra; SQLite is a file, created by its own setup.
- **No Docker.** This is a stated property of the project, not an omission: the CI
  workflow notes that Postgres is a GitHub Actions service container and that every
  step is runnable on a developer machine the same way, just without the service-container
  orchestration. There is no `Dockerfile` or `docker-compose.yml` in the repository.

---

## Setup from a clean clone

### 1. Install dependencies

```bash
npm install
npm install --prefix sources/clinic-a-api
npm install --prefix sources/hospital-b-api
npm install --prefix sources/dhis2-style-c
npm install --prefix sources/hprs-style-d
npm install --prefix sources/pharmacy-e-api
pip install -r sidecar-probabilistic-matching/requirements.txt
```

### 2. Create the five PostgreSQL databases

Source D is SQLite and is not in this list — its file is created by its own setup step.

```bash
for db in sa_health clinic_a hospital_b dhis2_style_c pharmacy_e; do
  psql -h localhost -U postgres -c "CREATE DATABASE $db;"
done
```

### 3. Run migrations and seed

```bash
npm run db:migrate                                   # backend's own tables
npm run db:setup --prefix sources/clinic-a-api       # migrate + seed, per source
npm run db:setup --prefix sources/hospital-b-api
npm run db:setup --prefix sources/dhis2-style-c
npm run db:setup --prefix sources/pharmacy-e-api
SA_ID_ENCRYPTION_KEY=<your-key> npm run db:setup --prefix sources/hprs-style-d
```

### Environment variables

Only two are genuinely required; everything else has a working dev default. The backend
validates its own configuration eagerly at startup (`src/config/env.ts`) and exits with
a specific message rather than failing on the first request.

| Variable | Required by | Behaviour if unset |
|---|---|---|
| `CONSENT_TOKEN_SIGNING_KEY` | backend | **Fatal.** The backend refuses to start — otherwise consent tokens would be signed with a publicly-known prototype secret. |
| `SA_ID_ENCRYPTION_KEY` | `hprs-style-d` (server **and** its seed step) | **Fatal.** Source D refuses to start. Must be the *same* key used to seed, or it will serve rows it cannot decrypt. |
| `DATABASE_URL` | backend, the 4 Postgres sources | Defaults to `postgres://postgres:postgres@localhost:5432/<that service's db>`. Format-validated if set. |
| `DATABASE_PATH` | `hprs-style-d` | Defaults to `./hprs-style-d.sqlite`. |
| `PORT` | gateway (3000) and each source (4001–4005) | Defaults as listed. Rejected at startup if not a positive integer. |
| `BACKEND_PORT` | backend, gateway | Defaults to `3010`. Same integer check. |
| `API_KEY` | each source | Defaults to `<source>-dev-key-change-me`, matching `src/config/sources.json`. |
| `PROBABILISTIC_MATCHING_SIDECAR_URL` | backend | Defaults to `http://localhost:5001`. Validated as a URL if set. |
| `MATCH_THRESHOLD` | sidecar | Defaults to `0.85`. |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW` | gateway | Default to `20` per `1 minute`. |

### 4. Start everything (eight processes)

Each in its own terminal, or backgrounded:

```bash
# five sources
npm run dev --prefix sources/clinic-a-api      # :4001
npm run dev --prefix sources/hospital-b-api    # :4002
npm run dev --prefix sources/dhis2-style-c     # :4003
SA_ID_ENCRYPTION_KEY=<key> npm run dev --prefix sources/hprs-style-d   # :4004
npm run dev --prefix sources/pharmacy-e-api    # :4005

# Splink sidecar
cd sidecar-probabilistic-matching && python -m uvicorn main:app --host 0.0.0.0 --port 5001

# backend and gateway
CONSENT_TOKEN_SIGNING_KEY=<key> npm run dev    # :3010
npm run dev:gateway                            # :3000  <- public entry point
```

All seven Node processes handle `SIGTERM`/`SIGINT` gracefully: they stop accepting new
connections, let in-flight requests finish (10s budget), close their database
connections, and exit 0 — or exit non-zero if the drain timed out. The backend also
stops its outbox publisher and waits for any publish already in progress.

**Windows caveat:** Node on Windows cannot reliably deliver a catchable `SIGTERM` or
`SIGINT` to a running process's JS listeners. The shutdown handler logic above was
verified directly instead (invoking the registered listener: a clean drain exits 0,
a hung cleanup times out and exits 1) — real signal delivery is only exercised on
POSIX, i.e. in CI (`ubuntu-latest`).

---

## Running the tests

```bash
npm test          # vitest run
npm run lint
npx tsc -p tsconfig.json --noEmit
```

**The suite is an integration suite, not a unit suite.** It expects the five sources,
the sidecar and the backend to already be running (this is exactly what the CI workflow
does before `npm test`). With nothing running, most integration tests fail with
`ECONNREFUSED`, which is an environment problem rather than a code problem.

---

## Exploring the API with no frontend

There is no UI. Two ways in:

**Swagger UI** — with the backend running, open **<http://localhost:3010/docs>**
(raw document at `/docs/json`). It is generated from the project's own Zod schemas, and
its "Try it out" button performs the same plain HTTP calls as below.

**curl** — the full consent → query → audit-trail flow:

```bash
# 1. Issue a scope-limited consent token.
#    Ask only for the resource types you need; the guard enforces exactly this list.
TOKEN=$(curl -s -X POST http://localhost:3000/consent/tokens \
  -H "Content-Type: application/json" \
  -d '{
        "requestingParty": "demo-clinician",
        "patientId": "SYN-8801015800083",
        "scopes": ["Patient", "Encounter", "Observation", "MedicationStatement"],
        "purpose": "demonstration"
      }' | jq -r .token)

# 2. Query that patient across every source that knows them.
curl -s "http://localhost:3000/patients/SYN-8801015800083" \
  -H "Authorization: Bearer $TOKEN" | jq

# 3. Read the audit trail — note this read is itself audited.
curl -s "http://localhost:3000/patients/SYN-8801015800083/audit-trail" \
  -H "Authorization: Bearer $TOKEN" | jq
```

The query response carries `contributingSources`, `failedSources`, a per-source
`sourceStatus` block, any adapter `warnings`, and the `matchingMode` used.

To see consent actually bite, request a token with `"scopes": ["Patient"]` only and
repeat step 2 — it is rejected with `scope-mismatch`, naming the resource types the
token does not cover.

---

## Demonstrating the interesting properties live

### Honest partial disclosure

Stop one source (for example Hospital B on 4002) and query a patient that source knows:

```bash
curl -s http://localhost:3010/healthz | jq .components.sources
curl -s "http://localhost:3000/patients/SYN-8801015800083" -H "Authorization: Bearer $TOKEN" | jq '{contributingSources, failedSources, sourceStatus}'
```

`/healthz` reports that source as unreachable with a classified reason, and the query
still succeeds — returning what the surviving sources hold, while naming the source it
could not reach. It does not pretend the missing data does not exist. The audit event
for that query records the same partial outcome.

### Deterministic vs probabilistic matching

Using the Palesa near-duplicate chain (`SYN-9001015800044`):

```bash
curl -s "http://localhost:3000/patients/SYN-9001015800044" -H "Authorization: Bearer $TOKEN" | jq .matchingMode
curl -s "http://localhost:3000/patients/SYN-9001015800044?matching=probabilistic" -H "Authorization: Bearer $TOKEN" | jq '{matchingMode, probabilisticMatch}'
```

Deterministic mode leaves the variants unmerged — honestly, since they share no
identifier. Probabilistic mode reports them as a probable match group with a score
above the threshold. Requires the sidecar to be running.

### Resetting between demos

```bash
SA_ID_ENCRYPTION_KEY=<same-key-as-the-service> npm run reset-demo
```

Truncates the backend's tables (including `audit_events` and `audit_outbox`) and all
five sources, then re-seeds every source from its existing seed data, messy records
included. **Data only** — schemas and applied migrations are untouched. Restart the
`hprs-style-d` service afterwards: SQLite holds an open file handle and may otherwise
keep serving the pre-reset snapshot.

---

## Known limitations

- **Synthetic data only.** No real patient data, no real integration with any South
  African health system. The five "source systems" are simulations written for this
  project.
- **Prototype-scale matching.** Splink is configured against a handful of seeded
  records — far below the volume its probabilistic model is designed for. Treat scores
  as a demonstration of the mechanism, not a validated accuracy claim.
- **A known test race.** `tests/core/audit.outbox.test.ts` fails intermittently **when a
  backend process is running against the same database**: the live outbox publisher's
  2-second tick can drain the test's row before the test reads it back, since
  `fetchUnpublished()` only returns rows where `published_at IS NULL`. It is a
  test-isolation issue, not a defect in the outbox itself, and it predates the current
  work. With no backend running, that file passes consistently.
- **No frontend.** API, Swagger UI and curl only.
- **Prototype security posture.** API keys between the backend and its sources are
  static strings with dev defaults committed to `src/config/sources.json`. The consent
  token is properly signed and scope-checked, but there is no real identity provider
  behind `requestingParty` — a caller asserts who they are.
- **Single-node, no deployment story.** No Docker, no orchestration, no TLS; everything
  binds to localhost and is started by hand.
- **`scripts/generateAdapter.ts` is not portable.** It depends on a local LLM router
  ("OmniRoute") from an unrelated project on the original author's machine, and carries
  a hardcoded local API key. It is a development-time tool, never touched by the running
  backend — but it will not work on another machine as-is.

---

## Project documents

`docs/` contains three documents verified to exist in this repository:

- [`docs/ai-assisted-adapter-generation.md`](docs/ai-assisted-adapter-generation.md) —
  an honest worked example of what one real generation attempt got right and wrong.
- [`docs/data-governance.md`](docs/data-governance.md)
- [`docs/probabilistic-matching.md`](docs/probabilistic-matching.md)

The source comments throughout this codebase cite a **`Backend_Research.docx`** by
section number (for example "Section 5.2's honest-disclosure requirement"). That file
is **not present in this repository or its parent directory**, and neither are
`Research_Plan.docx`, `Research_Report.docx`, or any dated session logs. They are
referenced but not tracked here — see `CONTRIBUTING.md` for where the research document's
claims and the code have diverged.
