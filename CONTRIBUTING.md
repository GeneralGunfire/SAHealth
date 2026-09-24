# Development guide

**The pre-restart implementation — the adapter pattern, the five simulated sources,
the orchestrator, the registry, the gateway, and the AI-assisted adapter-generation
tool this file used to document — has been retired.** This guide now covers only what
remains. For setup, environment variables and how to run what's left, see
[`README.md`](README.md).

---

## Repository structure (current)

| Path | What lives there |
|---|---|
| `src/api/` | `server.ts` is the backend (port `BACKEND_PORT`, default 3010). `routes/` holds `consent.ts` and `audit.ts`; `errors.ts` standardises every response onto `{ error: { code, message, details? } }`; `docs/` builds the OpenAPI document from the project's Zod schemas, now covering only the consent and audit-trail routes. |
| `src/canonical/` | The canonical model — Zod schemas for `Patient`, `Encounter`, `Observation`, `MedicationStatement`, plus the consent-token schema. |
| `src/core/` | `consent/`, `audit/`, `shutdown.ts`, `logger.ts`. |
| `src/db/` | The backend's own `pg` pool (`pool.ts`). |
| `migrations/` | Whatever schema the rebuild reintroduces via `node-pg-migrate`. The migration that used to define `patients`/`encounters`/etc. was removed with the pipeline it backed. |
| `tests/core/` | `audit.outbox.test.ts`, `audit.sourceStatus.test.ts`, `consent.guard.test.ts` — the only tests left, and the only ones that still pass against this repository as it stands. |
| `docs/` | Longer-form notes on the *retired* adapter generation tool, data governance and probabilistic matching — historical, not instructions for code that exists here now. |

Removed entirely: `src/api/gateway.ts`, `src/api/routes/{patient,health}.ts`,
`src/core/{orchestrator,registry,identityMatch,identityMatchProbabilistic,
sourcePatientDirectory,sourceFailureReason}.ts`, `src/adapters/`,
`src/types/sourceAdapter.ts`, `src/config/{sources.json,loadConfig.ts}`,
`src/db/repositories/`, `sources/` (all five source services), `scripts/
{generateAdapter,resetDemoData}.ts`, and `sidecar-probabilistic-matching/`.

---

## Rebuilding the pipeline

There is no adapter pattern, registry, or orchestrator to extend right now — that is
the point of this retirement. When the rebuild happens, this section should be
rewritten to describe the new design rather than resurrect the old one from git
history by default; the old approach (a `SourceAdapter` contract with `fetchPatient`/
`translate`, a registry that scans a directory and cross-references a config file, an
orchestrator that fans out and merges) is available in this repository's history if it
turns out to still be the right shape, but it should be a deliberate decision, not an
assumption.

---

## Conventions worth keeping

- **Comments explain *why*.** This codebase leans on long explanatory comments for
  non-obvious decisions. Keep that up; delete a comment only when the reason it
  records stops being true.
- **Fail fast on configuration.** Anything with no safe default is checked at startup
  with a specific, actionable message, never left to fail on the first request.
  `src/config/env.ts` is the current example.
- **Honesty over convenience.** When the system cannot do something, the correct
  behaviour is to say so in the response and the audit trail, not to quietly return
  less. This principle drove the deleted pipeline's per-source failure disclosure and
  should carry into whatever replaces it.

---

## Drift between `Backend_Research.docx` and this codebase

Source comments throughout the (now largely deleted) pipeline cited `Backend_Research.docx`
extensively by section number, but **that file is not in this repository**. Comparing
the code as it stood before this retirement against an extracted copy of that document
surfaced differences worth recording rather than quietly reconciling, kept here for
whoever picks up the rebuild:

- **Supabase was not used anywhere.** The research document is subtitled "…and the
  Supabase/local-server split" and refers to Supabase throughout, but there was **no
  Supabase reference anywhere in the code, configuration, dependencies or CI**. The
  backend and four sources used plain local PostgreSQL via `pg`; the fifth used SQLite.
  The "hosting split" that document describes was never built.
- **Offline resilience was narrower than described.** The document treats offline
  resilience and synchronisation as a major area. What existed was the **audit
  outbox** — which genuinely protects audit events against a transient failure of the
  downstream write, and is still here — plus per-source failure isolation and
  transient-failure retry on source calls, both now removed. There was no device-level
  offline mode and no store-and-forward sync engine.
- **Both "proposed innovations" were real, and both were qualified.** The
  scope-limited consent token is genuinely implemented and enforced (an under-scoped
  token is rejected with `scope-mismatch`) and survives this retirement. AI-assisted
  adapter generation existed as a working CLI with a mandatory human-review gate, but
  has been removed along with the adapters it generated.
- **POPIA compliance was a design influence, not an implemented control set.** The
  document devotes substantial space to POPIA. The surviving code reflects it in
  places — scope-limited consent, comprehensive audit — but nothing in this repository
  verifies or certifies compliance, and it should not be described as compliant.

`Research_Plan.docx`, `Research_Report.docx` and dated session logs are referenced in
the project's framing but are **not present in or alongside this repository**, so
nothing here can be checked against them.
