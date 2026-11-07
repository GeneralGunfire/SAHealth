# SAHealth explorer (DEXA)

A public, sourced reference for how South African health data systems exist **today**: which systems hold health information, who runs them, what they hold, and how (or whether) they connect. It does not describe what DEXA will build.

Built for partners, funders and officials first, and for the general public too. Same brand system as DEXA Forged (framed white panel, Inter, black and white). No login. Motion respects the reduced-motion setting.

## Run it

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # type check + production build (output in dist/)
```

## Deploy (Vercel)

Import this repository in Vercel. It is detected as a Vite project, so the defaults are right: build command `npm run build`, output directory `dist`. No environment variables are needed. `vercel.json` already carries the single-page routing and the security headers.

## Pages

| Route | What |
|---|---|
| `/` | Overview: headline numbers, plain-words summary, where to start, how to read it |
| `/map` | The full landscape: rows are what a system does, columns are who runs it. Hover a system to preview its connections, select it to pin them; find a system by name |
| `/systems`, `/systems/:id` | Searchable, filterable, sortable directory (cards or list), and a full page for each system |
| `/journeys`, `/journeys/:id` | Each journey plays like a short film: a data packet travels between systems, with captions, a scrubbable timeline, speed control and a barrier where the data stops |
| `/provinces` | A tile map of the nine provinces, a detail panel, and a side-by-side comparison |
| `/gaps` | Which pairs of systems are not connected, and the main reason: a proportion bar and a crosshair matrix you can pin cells on |
| `/sources` | Ground rules, confidence levels and all sources |

Press **Ctrl+K** (or **/**) on any page to search systems, journeys, provinces, pages and sources.

## Where things are

| Path | What |
|---|---|
| `src/data/nodes.ts` | The systems (the facts shown on each page) |
| `src/data/flows.ts` | Connections between systems, and the journeys |
| `src/data/meta.ts` | Layers, sectors, provinces and the list of sources |
| `src/lib/model.ts` | Lookups and numbers worked out from the data (connections, gaps, headline figures) |
| `src/components/Shell.tsx` | The framed panel and floating top navigation |
| `src/components/JourneyPlayer.tsx` | The video-style journey player |
| `src/components/Palette.tsx`, `src/lib/search.ts` | Global search |
| `src/pages/` | One file per page |
| `src/styles/` | `base.css` (brand tokens, shared), `pages.css`, `dynamic.css` (navigation, search, motion, player, tiles, matrix) |

Every number on the overview is computed from the data files, so editing the data updates the site.

## Rules for the content

- Describe how things exist **now**. Nothing about how to fix them.
- Every claim carries a source id from `SOURCES` and a confidence: `confirmed`, `likely` or `uncertain`.
- If nothing was found, say so. Never guess.
- DEXA is spelled D-E-X-A.

## Known open items

- SANBS hospital-facing ordering interface: not found.
- Military hospital and prison health record systems: nothing public found.
- Limpopo "PHIS" attribution is `likely`, not confirmed.
- Thin entries: SAMHS, DCS, NGO clinics, donors.
