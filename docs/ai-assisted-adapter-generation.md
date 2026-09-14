# AI-assisted adapter generation

This implements the second named core innovation from `Backend_Research.docx`
Section 8.1: using a large language model to accelerate writing a new
adapter's `translate()` function and tests, with **mandatory human review**
before anything generated is trusted. It is a development-time tool only —
nothing in the running backend calls or depends on it.

## How it works

`npm run generate-adapter -- --source=<name> --sample=<path-to-json>`
(`scripts/generateAdapter.ts`) sends the project's canonical Zod schemas
(Patient/Encounter/Observation/MedicationStatement), the `SourceAdapter`
interface, one existing adapter as a style reference (Source C), and the
provided sample data to a local LLM router, and asks for a draft
`translate()` function plus a draft test file.

### The AI backend: OmniRoute, not a hosted API

There is no Anthropic (or other hosted-provider) API key available for
this project. Instead, this tool calls **OmniRoute**
(https://github.com/diegosouzapw/OmniRoute), a local multi-provider LLM
router already running on this machine for an unrelated personal project
("Udaan"), at `http://localhost:20128`. Its real request/response contract
was confirmed by reading Udaan's own working client
(`C:\Udaan\src\integrations\omniroute\client.ts`) — read-only; nothing in
Udaan was modified to build this tool — rather than assumed:

- `POST /v1/chat/completions`, OpenAI-compatible: `{ model, messages, stream: false }` in, a standard `chat.completion` object out.
- Auth: `Authorization: Bearer <key>` (this OmniRoute instance requires a key).
- `data.model` in the response reports which underlying model OmniRoute's
  free-tier auto-router actually used for that request — an internal
  routing codename (e.g. `big-pickle`), not a public model name, logged
  verbatim in every generated draft's header rather than normalised or
  hidden.
- **This tool has a hard runtime dependency on OmniRoute running locally.**
  The backend itself has no AI dependency at all — this is a one-way
  dependency that exists only for this development-time tool.

### Output location

Generated files are written **only** to
`src/adapters/_drafts/<source>/translate.draft.ts` and
`translate.draft.test.ts` — never into `src/adapters/`, which is the only
folder `src/core/registry.ts` scans for real, self-registering adapters.
`tsconfig.json` and `vitest.config.ts` both explicitly exclude
`src/adapters/_drafts/` from the real build and test run, specifically
because a draft is expected to be unreviewed and potentially broken (see
the worked example below — this was not a hypothetical concern).

Every draft carries a mandatory header: generation timestamp, which model
OmniRoute actually routed to, and an explicit
`DRAFT — NOT REVIEWED — DO NOT REGISTER` marker. Moving a draft into
`src/adapters/` to make it real is a manual, deliberate file-move a
developer performs by hand — the tool itself never does this. See
`src/adapters/_drafts/README.md` for the full step-by-step review workflow.

## Worked example: "Pharmacy E"

A synthetic fifth source, a pharmacy dispensing feed, was used as the real
test case — deliberately messy: abbreviated field names (`pat`, `rx`,
`sur`, `gv`, `sx`, `dtdisp`), a `DD-MMM-YYYY` date format distinct from
every existing source, and a genuinely ambiguous field (`rxstat: "DISP"`)
requiring real judgement to map correctly.

**The generation itself was not trivial to get working.** The first two
attempts failed outright with a network-level timeout, not a bad answer —
real, measured evidence of free-tier backend unreliability, not a glossed-
over detail:

- Isolated the cause by testing directly against the OmniRoute API: a large
  **input** prompt (~21,000 characters — the full canonical schemas plus
  the reference adapter this tool embeds) completed in ~3.5 seconds when
  the requested *output* was short.
- A request asking for a genuinely long **output** (~60 lines of generated
  code) took ~100 seconds on the routed backend (`big-pickle`), which
  streams a verbose internal `reasoning_content` chain-of-thought that
  appears to scale with output length.
- This tool asks for two full files (a translate function plus a complete
  test suite) — comfortably 150–250+ lines combined — so the fetch timeout
  had to be raised to 360 seconds, calibrated from this measurement, not
  guessed. The third attempt, with that timeout, succeeded.

**Model that actually handled the generation**: `big-pickle` (as reported
by OmniRoute's `/v1/chat/completions` response — an internal routing
codename for whichever free-tier backend combo was live at the time, not a
name that identifies a specific known model family).

### What it got right

- Correctly recognised Pharmacy E is a dispensing feed with no encounter or
  observation concepts, and did not hallucinate fake data to fill those
  resource types.
- Correctly parsed the `DD-MMM-YYYY` date format (`03-FEB-2026` → `2026-02-03`).
- Correctly handled the one deliberately ambiguous field it was told about
  structurally: a `null` `drugcd` (an OTC item with no formulary code)
  correctly fell back to the canonical model's `{ kind: "text" }`
  medication representation instead of crashing or fabricating a code.
- Followed this project's established convention of pushing an
  `AdapterWarning` rather than silently guessing, for unrecognised `sex`
  values — it clearly picked this pattern up from the Source C reference
  adapter supplied in the prompt.
- The generated test file's fixture and assertions were structurally sound
  and matched the project's existing test style.

### What it got wrong or left ambiguous — corrected by hand

1. **A real, build-breaking type error.** `const encounters = []` and
   `const observations = []` were left untyped, which fails this project's
   actual `strict: true` TypeScript build with `TS7034`/`TS7005` errors —
   confirmed by literally running `tsc --strict` against the draft before
   touching it. This is the clearest evidence that "the generated code
   compiled in isolation" is not the same as "the generated code would pass
   this project's real build."
2. **A subtly wrong business-logic assumption, presented as settled fact.**
   The draft mapped `rxstat: "DISP"` → canonical status `"active"`, with a
   single confident one-line comment. On reflection this is wrong: "DISP"
   only confirms the pharmacy handed the drugs over once — it says nothing
   about whether the patient is still taking the medication, which this
   source has no way of knowing at all. This was corrected to map to
   `"completed"` instead, with the ambiguity now explicitly logged as an
   `AdapterWarning` rather than presented as certain. This is the single
   most important correction: the code *looked* confident and reasonable,
   and would have shipped a wrong clinical inference if not checked against
   what the source data can actually support.
3. **Silently discarded data with no disclosure.** `qtydisp` and `dayssup`
   (supply-quantity fields) were dropped with only an inline code comment
   explaining the decision — no `AdapterWarning`. This project's own
   Section 2.3 convention (and the Source C reference adapter it was shown)
   requires that data with no canonical home be disclosed via a warning,
   not just quietly dropped. Added a warning.
4. **Inconsistent with its own reference example.** The Source C reference
   adapter (shown in the prompt) pushes a warning when a national identifier
   is missing, since identity matching for that record will then fail. The
   draft omitted this for a missing `nid`, despite being shown the exact
   pattern to follow. Added the missing warning.
5. **Wrong function signature relative to the real interface.** The draft's
   `translatePharmacyE` took the source-specific raw shape directly instead
   of the generic `RawSourceBundle<TRaw>` the real `SourceAdapter` interface
   requires (the same interface it was given in the prompt). Corrected to
   match.

### Conclusion

Roughly half of the generated logic was directly usable, and the parts
that needed correction were not obvious surface-level mistakes — they were
the kind of thing that looks plausible on a first read and would only be
caught by (a) actually running the real project's strict compiler and test
suite against the draft, and (b) a reviewer who understands the domain well
enough to notice that "dispensed" and "currently taking" are different
claims. This is the honest basis for treating this tool as "AI-assisted,
human-reviewed" — the review step caught a real, non-cosmetic bug and a
real, non-obvious clinical-inference error, not just formatting nitpicks.

The corrected adapter is now registered as a real fifth source
(`src/adapters/pharmacy-e/`, backed by `sources/pharmacy-e-api/`, a native
Postgres-backed service on port 4005) and passes through the orchestrator
and the full test suite exactly like the other four sources.
