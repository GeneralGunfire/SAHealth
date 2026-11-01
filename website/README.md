# SAHealth explorer (DEXA)

An interactive website that explains how South African health data infrastructure exists **today** (not what DEXA will build). It maps systems, how data moves between them, and where it stops.

## Run it

```bash
cd website
npm install
npm run dev        # http://127.0.0.1:5173
npx tsc --noEmit   # type check
```

Dev URL params: `?skipintro`, `?skipview`, `?jstep=N` (journey start step, paused), `?story=N`.

## Stack

Vite 5, React 18, TypeScript, framer-motion 11. Plain CSS variables (no Tailwind). Fonts: Inter, Inter Tight, IBM Plex Mono.

## Where things are

| Path | What |
|---|---|
| `src/data/nodes.ts` | 48 systems (the facts shown in the drawer) |
| `src/data/flows.ts` | Edges (connections) and the 13 Journeys |
| `src/data/meta.ts` | Layers, sectors, provinces (`PROV_DATA`), and ~65 `SOURCES` with URLs |
| `src/layout.ts` | Landscape layout engine (layers as rows, sectors as columns) |
| `src/components/Canvas.tsx` | Zoom and pan map |
| `src/views/JourneyPlayer.tsx` | Auto-playing journey swimlane player |
| `src/components/Intro.tsx`, `Tour.tsx` | Site intro, story deck, guided tour |
| `../research/` | Raw research by phase, and `research_master.md` (compiled) |
| `../research_round6_supplementary.md` | Supplementary research |
| `../website_plan.md` | Original plan |

## Rules for the content

- Describe how things exist **now**. Nothing about how to fix them. Anything DEXA will build is labelled "Coming soon".
- Every claim carries a source id from `SOURCES` and a confidence: `confirmed`, `likely` or `uncertain`.
- If nothing was found, say so. Never guess.
- DEXA is spelled D-E-X-A.

## Known open items

- SANBS hospital-facing ordering interface: not found.
- Military hospital and prison health record systems: nothing public found.
- Limpopo "PHIS" attribution is `likely`, not confirmed.
- Thin nodes: SAMHS, DCS, NGO clinics, donors.
- Journey arrows were re-routed to clear labels; check by eye in every journey.
- `../research/research_master.md` and the Master/Timeline docs are partly stale.
