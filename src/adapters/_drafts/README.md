# Adapter drafts — AI-assisted, human-reviewed

This folder holds **AI-generated first drafts only**, produced by
`npm run generate-adapter -- --source=<name> --sample=<path-to-json>`
(see `scripts/generateAdapter.ts`). It implements the second named core
innovation from `Backend_Research.docx` Section 8.1: using a large language
model to accelerate writing a new adapter's `translate()` function and
tests, with mandatory human review before anything here is trusted.

## Why this folder is separate from `src/adapters/`

`src/core/registry.ts` discovers every adapter by scanning `src/adapters/`
for a folder exporting a `SourceAdapter` as its default export. This folder
is **outside** that scan path specifically so a draft can never be
accidentally picked up and treated as a real, registered source. There is
no code path anywhere in this project that reads from `_drafts/` at
runtime — the only way a draft becomes real is a human moving it.

## The review workflow

1. Run the generator: `npm run generate-adapter -- --source=pharmacy-e --sample=./samples/pharmacy-e.json`
2. Two files appear under `src/adapters/_drafts/<source>/`:
   `translate.draft.ts` and `translate.draft.test.ts`. Each carries a
   header block stating the generation timestamp, which underlying model
   OmniRoute actually routed the request to, and an explicit
   `NOT REVIEWED — DO NOT REGISTER` marker.
3. **A developer reads both files start to finish.** Check specifically for:
   - Field mappings that look plausible but are actually wrong (the model
     has no way to verify units, code systems, or business meaning against
     the real source — only against the sample data's shape).
   - Silent guesses where the code should instead push an `AdapterWarning`
     (Backend_Research.docx Section 2.3 requires ambiguity to be logged,
     never silently resolved — models tend to guess instead unless
     corrected).
   - Whether the generated tests actually assert anything meaningful, or
     just check that the function doesn't throw.
4. Correct whatever needs correcting, directly in the draft file.
5. **Only once satisfied**, manually:
   - Create the real adapter folder under `src/adapters/<source>/`
     (`types.ts`, `translate.ts`, `index.ts` — the draft's translate
     function usually becomes `translate.ts` with the header stripped).
   - Write `index.ts` registering the `SourceAdapter` (copy the pattern
     from any existing adapter, e.g. `src/adapters/dhis2-style-c/index.ts`).
   - Move the corrected test into `tests/adapters/`, with the `.draft`
     suffix and header removed.
   - Add the new source's connection details to `src/config/sources.json`.
   - Run the full test suite and confirm the new adapter works through the
     orchestrator exactly like the others.
6. Delete the folder under `_drafts/` once the real adapter is in place —
   drafts are not meant to accumulate indefinitely once accepted.

## What this tool is not

- **Not a runtime feature.** Nothing in the running backend (server,
  gateway, orchestrator) calls this code or depends on it. It only runs
  when a developer invokes it from a terminal.
- **Not auto-trusted.** No draft is ever auto-registered, auto-tested
  against the real orchestrator, or treated as real until a human
  completes the steps above.
- **Not guaranteed to work.** OmniRoute routes to free-tier backends whose
  availability varies; a generation attempt can fail outright, and even a
  successful one is a first pass, not a finished adapter. See
  `docs/ai-assisted-adapter-generation.md` for an honest worked example of
  what a real generation attempt got right and wrong.
