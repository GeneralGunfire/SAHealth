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

Vite 5, React 18, TypeScript, framer-motion 11. Plain CSS variables (no Tailwind). Fonts: Fraunces, Public Sans, IBM Plex Mono.

## Where things are

| Path | What |
|---|---|
| `src/data/nodes.ts` | 48 systems (the facts shown in the drawer) |
| `src/data/flows.ts` | Edges (connections) and the 13 Journeys |
| `src/data/meta.ts` | Layers, sectors, provinces (`PROV_DATA`), and ~65 `SOURCES` with URLs |
| `src/layout.ts` | Landscape layout engine (layers as rows, sectors as columns) |
| `src/design.css` | The whole design system: tokens, every view, mobile layouts |
| `src/hooks.ts` | `useIsMobile` (820px breakpoint) and safe `sessionStorage` helpers |
| `src/components/ui.tsx` | Brand mark, confidence glyphs, status tags, source list, Coming-soon tag |
| `src/components/Canvas.tsx` | Zoom and pan atlas (Landscape and Simulation) |
| `src/components/Drawer.tsx` | The detail dossier (system or pair), bottom sheet on mobile |
| `src/views/JourneyPlayer.tsx` | Auto-playing journeys (swimlane on desktop, step list on mobile) |
| `src/views/Matrix.tsx`, `gaps.ts` | Gaps grid and the rules that assign a reason and a certainty to each pair |
| `src/views/Provinces.tsx` | Province map, ledger and comparison. Outlines in `data/provinceShapes.ts` |
| `src/views/LayerList.tsx` | Mobile form of the Landscape and Simulation |
| `src/components/Intro.tsx`, `Tour.tsx` | Cover, six-card story deck, guided tour |
| `../research/` | Raw research by phase, and `research_master.md` (compiled) |
| `../research_round6_supplementary.md` | Supplementary research |
| `../website_plan.md` | Original plan |

## Design rules

- Connection colours carry meaning only: green live link, blue regular batch, amber retyped by hand, vermilion cut mark for a break. Do not use them decoratively.
- Confidence is shape-coded (solid, half, hollow) so it never competes with those colours.
- Gap reasons come from rules in `views/gaps.ts`, so the UI calls them an interpretation. A pair's certainty is the weaker of its two systems' confidence.
- The DEXA logo image files are not in the repo. `Brand` in `components/ui.tsx` draws a placeholder mark.

## Rules for the content

- Describe how things exist **now**. Nothing about how to fix them. Anything DEXA will build is labelled "Coming soon".
- Every claim carries a source id from `SOURCES` and a confidence: `confirmed`, `likely` or `uncertain`.
- If nothing was found, say so. Never guess.
- DEXA is spelled D-E-X-A.

## Known open items

- SANBS hospital-facing ordering interface: not found.
- Military hospital and prison health record systems: nothing public found.
- Limpopo "PHIS": the 2023 attribution is confirmed (NW3319 names Limpopo). Linking it to the 1997 system in the 2014 article rests on that article's headline and dateline only.
- Thin nodes: SAMHS, DCS, NGO clinics, donors.
- Journey arrows were re-routed to clear labels; check by eye in every journey.
- `../research/research_master.md` and the Master/Timeline docs are partly stale.
