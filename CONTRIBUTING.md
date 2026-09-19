# Development guide

How this repository is laid out, how to add a sixth source system, and how the
AI-assisted adapter-generation tool is meant to be used. For setup, environment
variables and how to run the demo, see [`README.md`](README.md).

---

## Repository structure

| Path | What lives there |
|---|---|
| `src/api/` | The two HTTP processes. `server.ts` is the backend (port 3010, internal); `gateway.ts` is the public entry point (port 3000) doing rate limiting, request logging and proxying. `routes/` holds `patient`, `consent`, `audit` and `health`; `errors.ts` standardises every response onto `{ error: { code, message, details? } }`; `docs/` builds the OpenAPI document from the project's Zod schemas. |
| `src/canonical/` | The canonical model — Zod schemas for `Patient`, `Encounter`, `Observation`, `MedicationStatement`, plus the consent-token schema. The single shape everything past an adapter reasons about. |
| `src/adapters/` | One folder per source (`types.ts`, `translate.ts`, `index.ts`). `retry.ts` wraps source calls with transient-failure retry. `_template/` documents the contract; `_drafts/` holds AI-generated, unreviewed drafts and is deliberately outside the registry's scan. |
| `src/core/` | Everything that is not HTTP and not source-specific: `registry.ts` (adapter discovery), `orchestrator.ts` (fan-out, failure isolation, merge), `identityMatch.ts` and `identityMatchProbabilistic.ts`, `sourcePatientDirectory.ts` (which source ids a patient resolves to), `sourceFailureReason.ts` (failure classification), `consent/`, `audit/`, `shutdown.ts`, `logger.ts`. |
| `src/config/` | `sources.json` (active sources and their connection details), `loadConfig.ts`, and `env.ts` — fail-fast environment validation that runs at import time, before the server listens. |
| `src/db/` | The backend's own `pg` pool and its repositories. |
| `src/types/` | `sourceAdapter.ts` — the `SourceAdapter` contract every adapter implements. |
| `sources/` | The five simulated source systems, each a standalone npm package with its own `package.json`, `migrations/`, `seed.sql` and server. Not part of the backend's build. |
| `sidecar-probabilistic-matching/` | Python/FastAPI + Splink sidecar (port 5001). `main.py` exposes `GET /health` and `POST /match`; `matching.py` holds the Splink model and `MATCH_THRESHOLD`. |
| `migrations/` | The backend's own schema (`node-pg-migrate`), including `audit_events` and `audit_outbox`. |
| `scripts/` | Development-time CLIs: `generateAdapter.ts` and `resetDemoData.ts` (`npm run reset-demo`). |
| `tests/` | `adapters/` (translation, pure), `core/`, `integration/`, and `fixtures/`. Mostly integration tests that expect the stack to be running. |
| `docs/` | Longer-form notes on adapter generation, data governance and probabilistic matching. |

---

## The adapter pattern

The core never imports a source by name. `src/core/registry.ts` scans `src/adapters/`
for directories (skipping anything starting with `_`), imports each one's `index.js`,
and keeps those whose id appears in `src/config/sources.json`. An adapter folder must
export a `SourceAdapter` as its **default export**, and its `id` must equal its folder
name — the registry throws if either is untrue.

`SourceAdapter` (`src/types/sourceAdapter.ts`) is two methods:

- **`fetchPatient(sourcePatientId)`** — fetch one patient's raw bundle in that source's
  native shape, or `null` if this source has no record for that id (not an error).
  May throw on connectivity or protocol failure; the orchestrator isolates that.
  The registry wraps this call in transient-failure retry, so an adapter does not
  implement retry itself.
- **`translate(raw, warnings)`** — convert a raw bundle to canonical shape. Pure, local,
  and never retried. Anything genuinely ambiguous — a missing unit, an unmappable code,
  a date whose format cannot be determined — must be pushed onto `warnings` as an
  `AdapterWarning` rather than guessed. Silent resolution of ambiguity is the one thing
  this layer must not do.

### Adding a sixth source

1. **Build the source system** under `sources/<name>/`, copying an existing package's
   layout. Use `clinic-a-api` for a straightforward PostgreSQL source, or
   `hprs-style-d` if you want a non-Postgres engine (it is SQLite, and is the proof
   that the adapter layer is storage-engine agnostic). Give it migrations, a `seed.sql`
   with deliberately messy records, and a bearer-API-key check.
2. **Write the adapter** at `src/adapters/<name>/`:
   - `types.ts` — the source's native response shape.
   - `translate.ts` — native → canonical, pushing warnings for anything ambiguous.
     `hospital-b` is the useful reference for genuinely hostile input (initials instead
     of names, inconsistent free-text dates); `dhis2-style-c` for entity–attribute–value
     data where a missing field is an absent row rather than a `NULL`.
   - `index.ts` — default-export a `SourceAdapter` whose `id` matches the folder name.
3. **Register it** by adding an entry to `src/config/sources.json` with its `baseUrl`
   and `apiKey`. No core file changes.
4. **Teach the resolver** which native id this source uses for a patient, in
   `src/core/sourcePatientDirectory.ts` — unless, like Source D, it deliberately uses
   its own unlinked identifier scheme.
5. **Test it**: a translation test under `tests/adapters/` (pure, no running services),
   and confirm it appears correctly in `/healthz` and in a query's `sourceStatus`.

---

## AI-assisted adapter generation

`npm run generate-adapter -- --source=<name> --sample=<path-to-json>` produces a **first
draft** of a `translate()` function and its tests from a handful of representative
native records.

```bash
npm run generate-adapter -- --source=pharmacy-e --sample=./samples/pharmacy-e.json
```

**The human review step is mandatory, and the tooling is built to enforce it.** Output
goes only to `src/adapters/_drafts/<source>/`, as `translate.draft.ts` and
`translate.draft.test.ts`, each carrying a header with the generation timestamp, the
model the router actually used, and a `NOT REVIEWED — DO NOT REGISTER` marker. Because
`_drafts/` starts with an underscore, the registry's scan skips it — a draft **cannot**
be auto-discovered and treated as a real source. No code path reads `_drafts/` at
runtime. The only way a draft becomes real is a developer moving it.

The review workflow, in full, is documented in
[`src/adapters/_drafts/README.md`](src/adapters/_drafts/README.md). The short version:
read both generated files start to finish, looking specifically for field mappings that
are plausible but wrong (the model can check the sample's *shape*, never its units, code
systems or business meaning), and for places where it silently guessed instead of
emitting an `AdapterWarning` — models reliably prefer guessing. Correct the draft, then
manually create the real adapter folder, move the test to `tests/adapters/`, add the
config entry, run the suite, and delete the draft.

`docs/ai-assisted-adapter-generation.md` records an honest worked example of what one
real generation attempt got right and wrong.

**Two caveats before you try it.** The tool depends on a local LLM router ("OmniRoute")
from an unrelated project on the original author's machine at `http://localhost:20128`,
so it will not run elsewhere without changes; and it carries a **hardcoded API key** in
the source. That key is local-only rather than a hosted-provider credential, but it
should not have been committed and should be moved to `OMNIROUTE_API_KEY` (which the
script already reads as an override) before this repository is shared more widely.

---

## Conventions worth knowing

- **Comments explain *why*.** This codebase leans on long explanatory comments for
  non-obvious decisions — the deterministic-nonce trade-off in Source D's encryption,
  why the `DATE` type parser is overridden in `clinic-a-api/src/db.ts`, why `_drafts/`
  sits outside the registry scan. Keep that up; delete a comment only when the reason
  it records stops being true.
- **Fail fast on configuration.** Anything with no safe default is checked at startup
  with a specific, actionable message, never left to fail on the first request.
- **Honesty over convenience.** When the system cannot do something — reach a source,
  link two records without a shared identifier — the correct behaviour is to say so in
  the response and the audit trail, not to quietly return less.
- **Sources stay independent.** No source imports from the backend or from another
  source. Shared-looking helpers (the `sendError` shape, the graceful-shutdown block)
  are deliberately duplicated per package rather than extracted, because these are
  separately deployable processes.
- **Tests need the stack.** Most of `tests/integration/` and parts of `tests/core/`
  expect the five sources, the sidecar and the backend to be running, exactly as
  `.github/workflows/ci.yml` arranges before `npm test`.

---

## Drift between `Backend_Research.docx` and this codebase

Source comments cite `Backend_Research.docx` extensively by section number, but **that
file is not in this repository**. Comparing the code against an extracted copy of that
document surfaced differences worth recording rather than quietly reconciling:

- **Supabase is not used anywhere.** The research document is subtitled "…and the
  Supabase/local-server split" and refers to Supabase throughout, but there is **no
  Supabase reference anywhere in the code, configuration, dependencies or CI**. The
  backend and four sources use plain local PostgreSQL via `pg`; the fifth uses SQLite.
  The "hosting split" that document describes was not built.
- **Offline resilience is narrower than described.** The document treats offline
  resilience and synchronisation as a major area. What exists is the **audit outbox** —
  which genuinely protects audit events against a transient failure of the downstream
  write — plus per-source failure isolation and, now, transient-failure retry on source
  calls. There is no device-level offline mode and no store-and-forward sync engine.
- **Both "proposed innovations" are real, and both are qualified.** The scope-limited
  consent token is genuinely implemented and enforced (an under-scoped token is rejected
  with `scope-mismatch`). AI-assisted adapter generation exists as a working CLI with a
  mandatory human-review gate — but see the portability and hardcoded-key caveats above.
- **POPIA compliance is a design influence, not an implemented control set.** The
  document devotes substantial space to POPIA. The code reflects it in places —
  field-level encryption of SA ID numbers, scope-limited consent, comprehensive audit —
  but nothing in this repository verifies or certifies compliance, and it should not be
  described as compliant.

`Research_Plan.docx`, `Research_Report.docx` and dated session logs are referenced in
the project's framing but are **not present in or alongside this repository**, so
nothing here can be checked against them.
