# Adding a new source adapter

1. Copy this folder to `src/adapters/<your-source-id>/`.
2. Define `types.ts` — the raw native shape returned by this source.
3. Add `mockData.ts` (or a real client) implementing data access.
4. Write `translate.ts` — converts raw shape to `CanonicalBundle`, pushing any
   ambiguous unit/coding/field-path decision onto the `warnings` array instead
   of resolving it silently (see `src/canonical` for the target shapes).
5. Export a `SourceAdapter` object as the default export from `index.ts`.
6. Add your source id to `src/config/sources.json` under `activeSources`,
   with any connection details it needs.

No other file changes are required. The registry (`src/core/registry.ts`)
discovers adapters by scanning this directory; the orchestrator
(`src/core/orchestrator.ts`) only ever loops over the registry.
