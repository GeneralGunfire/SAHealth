# SAHealth explorer (DEXA)

A public, sourced reference for how South African health data systems exist **today**: which systems hold health information, who runs them, what they hold, and how (or whether) they connect. It does not describe what DEXA will build.

Built for partners, funders and officials first, and for the general public too. Same brand system as DEXA Forged (framed white panel, Inter, black and white). No login.

## Run it

```bash
cd website
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # type check + production build
```

## Pages

| Route | What |
|---|---|
| `/` | Overview: headline numbers, plain-words summary, where to start, how to read it |
| `/map` | The full landscape: rows are what a system does, columns are who runs it. Select a system to draw its connections |
| `/systems`, `/systems/:id` | Searchable directory of every system, and a full page for each |
| `/journeys`, `/journeys/:id` | Step-by-step stories of how a patient's data moves, and where it stops |
| `/provinces` | The nine provinces, with a side-by-side comparison |
| `/gaps` | Which pairs of systems are not connected, and the main reason |
| `/sources` | Ground rules, confidence levels and all sources |

## Where things are

| Path | What |
|---|---|
| `src/data/nodes.ts` | The systems (the facts shown on each page) |
| `src/data/flows.ts` | Connections between systems, and the journeys |
| `src/data/meta.ts` | Layers, sectors, provinces and the list of sources |
| `src/lib/model.ts` | Lookups and numbers worked out from the data (connections, gaps, headline figures) |
| `src/components/Shell.tsx` | The framed panel and sidebar |
| `src/pages/` | One file per page |
| `src/styles/` | `base.css` (brand, shell, shared) and `pages.css` |
| `../research/` | Raw research by phase |

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
