# SAHealth Website: Planning and Design Brief

*Prepared by DEXA for Rajen's review. Planning only. Nothing has been built.*

## 0. What this plan is based on

I read everything in `C:\SA Health` that carries project meaning:

- `Documentation/Master/SAHealth-Master.md` and `Documentation/Timeline/SAHealth-Timeline.md`
- `filestructure.txt` and `Databasescriptsschema_varchar.txt`
- `sa-health-data-explainer-video/research/RESEARCH.md` (the sourced fact base, with corrections and unverified flags)
- `script/podcast_source.md` and the video's `theme.ts` files, which show the existing visual language
- `public/data/za_adm1.geojson` (province boundaries, CC BY 4.0)

I did not open `C:\Database` or any database.

**Things to know before reading the plan:**

1. **The website scope has changed.** The Master and Timeline docs describe the site as a product landing page with a cinematic intro and three paths (doctor, patient, just looking). The new brief is a landscape explorer for SA health data infrastructure.
   - I recommend the landscape explorer *is* the "just looking" path, with the doctor and patient paths added later as thin entry points. See §1.8.
2. **The Master and Timeline docs are stale.** They describe four simulated sources, but the current setup is 10 databases and 3 CSVs.
   - The website should use the new numbers. The docs should be updated separately.
3. **The research base is solid but has known holes.** Examples are provinces with no hospital EMR, unverified Mediclinic and Life systems, and no data on blood-ordering interfaces.
   - Task 2 targets these. The site's data model carries a **confidence** field so unverified claims never look like confirmed ones.
4. **The 180 MB documentary MP4 cannot live in the repo.** It is git-ignored.
   - It would need external hosting (§3.6).

---

## 1. Recommended website structure

### 1.1 Design principle

The landscape is one dataset (systems, connections, provinces, journeys) shown through **several lenses**. Each view answers a different question from the same data. Selecting a system in one view highlights it in all the others.

| Question the visitor has | View |
|---|---|
| What exists, and how does it fit together? | **Landscape** (layered map) |
| What is this system, who runs it, what does it hold? | **Systems** (directory and detail) |
| What actually happens to a patient's data? | **Journeys** |
| Is this the same everywhere? | **Provinces** |
| What is *not* connected, and why? | **Gaps** (connectivity matrix) |
| What is DEXA building, and where does it plug in? | **The Simulation** |
| How do you know this is true? | **Sources** |

### 1.2 Sections and views

**1. Home (`/`): the thesis in 30 seconds**
- A hero line: *"The data isn't missing. It just doesn't travel with the patient."* This closes the existing video, so the two works echo each other.
- Three anchor numbers, each with a source link:
  - 68M HPRS records vs 62M people
  - ~85% rely on the public sector
  - 4 provinces with no hospital EMR
- A short animated "fragmentation" visual: dozens of nodes appear, and the few real connections draw in. It reads as "mostly islands".
- Three entry cards: *Explore the landscape*, *Follow a patient*, *What DEXA is building*.

**2. Landscape (`/landscape`): the signature view**
- A layered diagram. Rows are layers: identity, facility and workforce registries, clinical systems, programme databases, laboratory and diagnostics, emergency and blood, claims and money, integration, standards.
- Columns are sectors: public, private, national or shared.
- Nodes are systems. Edges are real connections, drawn by *type*:
  - solid = live automated
  - dashed = batch or periodic
  - dotted with a small icon = manual (phone, fax, paper, re-keying)
- A **"show connections" slider** goes from *Nothing* to *What exists* to *What would be needed*. It makes the fragmentation visible without a word of explanation.
- **Lenses** (filters) re-colour or dim the diagram:
  - *Data type*: identity, clinical, aggregate, lab, claims
  - *Sector*: public or private
  - *Status*: live, beta, legacy, planned
  - *Confidence*: confirmed, likely, uncertain
- Click a node to open the **detail drawer** (see Systems below).

**3. Systems (`/systems`, `/systems/:id`): filterable cards and a detail drawer**
- A grid of system cards with search and filters. Use it as the reference library.
- Each system has a fixed record:
  - What it is
  - What it does
  - Who operates it
  - What data it holds, and what it does *not* hold
  - Standards used
  - How or whether it connects to other systems (a linked list)
  - Status and scale
  - Sources and confidence
  - A "In the simulation" tag that shows which DEXA database models it, if any
- Every system has a permalink, so reviewers can cite one.

**4. Journeys (`/journeys/:slug`): follow the data**
- A scrollytelling stepper: the diagram stays pinned while the text steps advance and the path lights up system by system.
- Four journeys:
  1. **Follow a patient** ("Nomsa": clinic → lab → ART register → hospital → private GP → pharmacy). This mirrors the video.
  2. **Follow a lab result** (NHLS → SMS printer or WebView → paper folder → TIER.Net). It shows the same result being retyped.
  3. **Follow a claim** (practice → switch → scheme → CMS). It shows the one place where data *does* flow end to end.
  4. **How a doctor finds a history today** (the six-step ladder from the research: ask → read what she carries → lab portal → local system → HealthID → phone and fax).
- A live **"copies of this fact" counter** in the corner, and a **"manual hand-offs" counter**, so the cost of fragmentation is felt.

**5. Provinces (`/provinces`): variation**
- A province map (from the existing GeoJSON) with a metric switcher:
  - Hospital system
  - PHC system
  - EMR status
  - Facilities in the National EMR beta
- Click a province to see its profile: systems in use, counts, gaps, and sources.
- A **compare mode** puts two provinces side by side. Western Cape against Limpopo is the sharpest contrast.
- A **table view** is the accessible alternative, and works for screen readers and for printing.

**6. Gaps (`/gaps`): what is not connected, and why**
- A **connectivity matrix**. Systems run along both axes, and each cell is one of: integrated, partial, manual only, none.
- Click a cell for the *reason* it is not connected. Reasons are tagged: no shared identifier, incompatible standards, consent and legal limits, different owners, paper-based, and no funding or mandate.
- A summary strip counts the number of cells in each state.
- The matrix makes the empty space legible. A network diagram can only show what exists.

**7. The Simulation (`/simulation`): for technical reviewers**
- The same Landscape diagram, with a **"DEXA overlay"** on top:
  - The 10 databases and 3 CSVs appear as markers on the real systems they model, tagged *Rajen's PC* or *Partner's laptop*.
  - Real systems with **no simulated counterpart yet** stay visibly hollow. That is an honest coverage map, and it also shows Phase 2 direction.
- The gateway is drawn as a layer *above* the sources, with its design principles: pull not copy, nothing replaced, consent and audit, honest disclosure.
- A **phase timeline**: Phase 1 foundation (complete) → Phase 2 gateway → later phases, per the Master doc.
- A short *"why the simulation is designed this way"* explanation for each source.
- **Every claim states what is real and what is simulated.** The site never implies real patient data.

**8. Sources (`/sources`): the trust page**
- Every source with its URL, what it supports, and the confidence legend.
- A "corrections we made" list: Medicom is legacy, Mediclinic and Life are unverified. Showing these reads as rigour, not weakness.
- The data license note for the map boundaries (geoBoundaries, CC BY 4.0).

### 1.3 Navigation model

- **Top bar:** Landscape · Systems · Journeys · Provinces · Gaps · Simulation · Sources, plus search.
- **Persistent selection:** pick a system anywhere, and a small pill remains in the header ("Selected: TIER.Net ✕"). Every other view highlights it. This is what makes the views feel like one thing.
- **Deep links everywhere:** `?sys=hprs&lens=clinical&conn=live`. Reviewers can share an exact state.
- **"Next" footers:** each view ends with a suggested next view ("Now see where it breaks →"), which gives a guided path through the site.

### 1.4 Which interaction models, and why

| Model | Included? | Why |
|---|---|---|
| Layered diagram with connection slider | **Yes (core)** | It is the one visual that explains the landscape and the fragmentation together |
| Filterable cards and detail drawer | **Yes (core)** | Handles the volume of detail without cluttering the diagram |
| Scrollytelling journeys | **Yes (core)** | Best way to teach a non-technical viewer how data moves |
| Province map and compare | **Yes** | Provincial variation is a central finding |
| Connectivity matrix | **Yes** | Shows the *absence* of connections, which no network diagram can |
| Free-form force-directed "mind map" | **No** | The brief rules it out. It is also unreadable beyond ~25 nodes |
| Timeline of exists vs planned | **Folded into Simulation and system status** | A full separate timeline adds little beyond status tags and the phase strip |
| Separate "doctor / patient / just looking" paths | **Later** | See §1.8 |

### 1.5 How non-technical viewers are served

- **Plain-language first:** each system card opens with one sentence a non-specialist can follow, then the detail below.
- **A glossary:** hover or tap any acronym (HPRS, NHLS, TIER.Net) for a one-line definition.
- **Reading level toggle:** *Simple* or *Technical* text on each system. The technical text adds standards, protocols, and schema notes. This is how one site serves both audiences.
- **Analogies used sparingly**, and always labelled as analogies.

### 1.6 How technical reviewers are served

- Technical text tier, standards, and protocol fields on each system.
- The Simulation view: the real-to-simulated mapping, coverage gaps, and design principles.
- The Sources page with confidence ratings.

### 1.7 Content model (the data behind every view)

Because every view draws on the same data, the data is built first and treated as the product. Five typed collections:

- `systems`: id, name, layer, sector, plain summary, technical detail, operator, data held, data *not* held, standards, status, scale, province scope, confidence, source ids, simulated-by.
- `connections`: from, to, type (live, batch, manual, none), what moves, standard, notes, confidence, source ids.
- `provinces`: name, hospital system, PHC system, EMR status, counts, notes, source ids.
- `journeys`: ordered steps, each with the systems lit, the narration, and the counter values.
- `sources`: id, title, URL, publisher, date, type, what it supports.

Everything is validated at build time (§3.3). Task 2's findings feed straight into this data without any design changes.

### 1.8 Reconciling with the Master doc

I recommend:
- The landscape explorer ships first, as the "just looking" path and as the public face of DEXA's work.
- The cinematic intro is optional and goes last (Phase G). It must be skippable, as the Master doc requires.
- Doctor and patient paths become short pages that link into the relevant Journeys, until the gateway exists to demonstrate them.

**Decision for Rajen:** confirm this reorder.

---

## 2. Visual and interaction design brief

### 2.1 Overall feel

Authoritative, geometric, calm. It should look like a well-funded research institute rather than a startup landing page. Navy dominates. Information density is high but ordered. Every shape on the page has a reason.

DEXA's brand is navy, geometric and clean. The existing video already uses navy `#0B1B36`, electric blue `#2F5BFF`, and a highlighter yellow. The site should extend that, not invent a new look.

### 2.2 Colour

Dark-first for the exploration views (Landscape, Gaps, Simulation), because diagrams with glowing connections read best on navy. Narrative and reading areas use a light "paper" surface. Both come from one token set, with light and dark variants through CSS variables.

| Role | Token | Value |
|---|---|---|
| Primary ground | `--navy-900` | `#0B1B36` |
| Raised surface | `--navy-800` | `#13284D` |
| Hairlines on dark | `--navy-600` | `#233B66` |
| Primary accent / interactive | `--blue` | `#2F5BFF` |
| Soft blue (hover, secondary) | `--blue-soft` | `#A9BCFF` |
| Highlight / selected | `--yellow` | `#FFE14D` |
| **Break / gap / disconnect only** | `--red` | `#E5412F` |
| Paper (reading surfaces) | `--paper` | `#F3F0E8` |
| Ink on paper | `--ink` | `#0F1012` |

**Sector encoding** (needs a brighter tint on navy than the video's print values):
- Public: teal (e.g. `#3FB6BD`)
- Private: warm coral (e.g. `#F2825F`)
- National or shared: blue-soft

**Rules:**
- Red appears *only* where something fails to connect. Because it is used nowhere else, it keeps its meaning.
- Yellow means "you selected this". It is never decorative.
- Every colour pairing is checked for WCAG AA contrast.

### 2.3 Shape and geometry (the brand made functional)

Shapes encode system type, so the diagram is readable without colour and works for colour-blind viewers:

- **Circle:** identity and registries
- **Square:** clinical record systems
- **Diamond:** aggregate and programme data
- **Hexagon:** exchanges, switches, and integration layers
- **Triangle:** reference standards and codes

Connection style carries meaning too:
- **Solid thick line:** live automated
- **Dashed line:** batch
- **Dotted line with a small icon:** manual (phone, fax, paper)
- **Absent link, drawn as a faint red "×" in the Gaps view:** none

Layout sits on an 8px grid with thin 1px hairlines and generous spacing. Corners are barely rounded, almost square.

### 2.4 Typography

Continue the video's fonts for brand continuity. They are open-licensed and self-hostable.

| Use | Font | Notes |
|---|---|---|
| Headlines and display | **Inter Tight** (700–800) | Tight and confident |
| Body and UI | **Inter** (400–600) | Highly legible |
| Codes, DB names, acronyms | **IBM Plex Mono** | Signals "technical identifier" |

Fraunces (used as a serif accent in the video) is optional here. I would leave it out for now to keep the site cleaner. Kalam (handwriting) is **not** used. It belongs to the video's "paper folder" scenes.

- Fluid type scale using `clamp()`.
- Body at 17–18px on reading surfaces; 14–15px in dense diagram panels.

### 2.5 Layout

- **Max content width** 1280px for text-and-card pages. The Landscape and Gaps views use the full viewport.
- **Landscape and Gaps layout:** left lens panel, centre canvas, right detail drawer. The drawer slides in on selection and does not cover the diagram.
- **Narrative pages (Home, Journeys, Sources):** a single column with large type, and a pinned diagram where relevant.
- **Mobile:** the Landscape becomes a layered accordion list, one layer per section, with the connection slider kept. The Gaps matrix becomes a "pick a system, see what it connects to" list. The Provinces map stays, and the table view is the default on small screens. Every view must be usable at 400px width.

### 2.6 Motion

- Used to *explain*, never to decorate: connections draw in, journey steps light up the path, the drawer slides.
- 150–300ms eases for UI state, longer for the explanatory draw-ins.
- `prefers-reduced-motion` is honoured everywhere. Animations collapse to instant state changes.
- No parallax. No autoplaying video with sound.

### 2.7 How a user moves through the site

1. **Land on Home.** See the thesis, the three numbers, and the fragmentation visual (~30 seconds).
2. **Go to Landscape.** Drag the connection slider to see how little connects. Click a node to learn about it.
3. **Follow a Journey.** The patient story makes it concrete.
4. **Check Provinces and Gaps.** See the variation and the reasons.
5. **Finish at Simulation.** Understand what DEXA is building and why it is designed this way.
6. **Verify at Sources.** See the confidence ratings and citations.

Advanced visitors go straight to Systems, Gaps or Simulation through the top bar and deep links.

### 2.8 Accessibility (requirements, not extras)

- Every diagram has a **parallel keyboard-navigable list or table**. A screen-reader user gets the same information.
- All interactive items are focusable, with a visible focus ring in yellow.
- No information is conveyed by colour alone (shape and line style carry it too).
- Semantic landmarks, skip link, and alt or `aria` text for all graphics.
- Tested with a screen reader and keyboard-only before launch (Phase G).

### 2.9 Content tone and honesty rules

- Plain, factual, unsensational. The fragmentation is striking enough on its own.
- Every figure carries a source and a confidence tag.
- Real vs simulated is always labelled.
- The word "fix" is avoided. The site describes the landscape and what DEXA is simulating. It does not claim to solve national health IT.

---

## 3. Technical build plan

### 3.1 Recommendation: a static single-page app built with Vite

**Vite + React + TypeScript**, built to plain static files. No backend and no database.

**Why:**
- The site is interaction-heavy with shared state across views (selected system, lenses, journey position). That suits a component framework.
- Rajen and the partner already work in TypeScript and React (the video project uses React 19 and TypeScript), so the learning curve is near zero.
- The output is a folder of HTML, JS and CSS that deploys anywhere free.

**Alternatives considered:**
- **Astro:** excellent for content sites, but the interactive state sharing needs islands talking to each other, which fights the model.
- **Next.js:** capable, but overkill for a site with no server logic.
- **Plain HTML plus D3:** fine for one diagram, hard to maintain across seven views.

### 3.2 Libraries (kept deliberately small)

| Purpose | Library | Notes |
|---|---|---|
| UI | React 19, TypeScript | Matches existing projects |
| Routing | React Router (BrowserRouter with static fallback) | Deep links and shareable URLs |
| Diagram maths | `d3-scale`, `d3-shape`, `d3-geo`, `d3-array` | **Maths only. React renders the SVG.** Layout is hand-set in data for control and readability |
| Province map | `d3-geo` + simplified GeoJSON/TopoJSON | The existing `za_adm1.geojson` is reused and simplified |
| Animation | `motion` (Framer Motion) for UI; plain CSS for the rest | One animation library, not two |
| Scrollytelling | `IntersectionObserver` (native) | No heavy scroll library needed |
| Search | `fuse.js` | Client-side fuzzy search over systems |
| Data validation | `zod` | Already used in the gateway codebase |
| Styling | CSS custom properties + CSS Modules | No Tailwind needed; the token set is small and bespoke |
| Fonts | `@fontsource` (self-hosted Inter, Inter Tight, IBM Plex Mono) | No third-party requests, faster, private |
| Tests | Vitest (data and logic) + Playwright (smoke and a11y with axe) | Light, but enough to protect the data and the keyboard paths |

No chart library. The diagrams are bespoke SVG.

### 3.3 Data as typed JSON, validated at build time

- Content lives in `data/*.json`, one file per collection (§1.7).
- A `scripts/validate-data.ts` step (zod) runs before every build and fails it if:
  - a connection references a missing system
  - a system or connection lacks a confidence rating or at least one source
  - a source id is unknown
- This protects against the most likely failure of a research-heavy site: a claim with no source.
- Task 2 findings are added to these files. No design work is needed.

### 3.4 Proposed file structure

```
website/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ public/
│  ├─ og/                      # social preview images
│  └─ geo/za-provinces.topo.json   # simplified boundaries (+ attribution)
├─ data/
│  ├─ systems.json
│  ├─ connections.json
│  ├─ provinces.json
│  ├─ journeys.json
│  ├─ sources.json
│  ├─ simulation.json          # real system → DEXA database mapping
│  └─ glossary.json
├─ scripts/
│  └─ validate-data.ts
└─ src/
   ├─ main.tsx
   ├─ routes.tsx
   ├─ styles/
   │  ├─ tokens.css            # colours, type scale, spacing
   │  └─ global.css
   ├─ data/                    # typed loaders + zod schemas
   ├─ state/                   # selection, lenses (URL-synced)
   ├─ components/
   │  ├─ layout/               # Header, Footer, Drawer, Lens panel
   │  ├─ diagram/              # Node, Edge, Layer, ConnectionSlider
   │  ├─ cards/                # SystemCard, ProvinceCard
   │  ├─ journey/              # Stepper, CopiesCounter
   │  └─ a11y/                 # table fallbacks, SkipLink
   └─ views/
      ├─ Home.tsx
      ├─ Landscape.tsx
      ├─ Systems.tsx
      ├─ Journeys.tsx
      ├─ Provinces.tsx
      ├─ Gaps.tsx
      ├─ Simulation.tsx
      └─ Sources.tsx
```

The site lives in a new top-level `website/` folder. It stays separate from `sa-health-data-explainer-video/` and from the future gateway code.

### 3.5 Hosting (deliberately deferred)

Hosting is decided after the design is locked and while building. The build output is plain static files, so no choice made now locks us in. Any static host will do later.

### 3.6 The documentary video

The 180 MB MP4 is git-ignored and too large to serve from a static site.
- **Recommended:** upload to YouTube (unlisted or public) or Vimeo and embed with a click-to-load poster. This avoids loading a third-party player until the visitor asks for it.
- Use a still from the video as the poster.

### 3.7 Performance and quality budgets

- Initial JavaScript under ~250 KB gzipped, with each route lazy-loaded.
- Simplified province map under ~50 KB.
- Lighthouse performance and accessibility ≥ 90 on the main views.
- Fonts subset to Latin, and `font-display: swap`.

### 3.8 Risks

| Risk | Mitigation |
|---|---|
| Research gaps make some system pages thin | Confidence tags; Task 2 fills the biggest gaps; thin pages are labelled, not hidden |
| Claims presented as fact that turn out wrong | Build-time rule: no claim without source and confidence |
| Diagram becomes cluttered as nodes are added | Hand-set layout, lenses and the connection slider, plus the table fallback |
| Mobile experience of a diagram-heavy site | Mobile-specific list and accordion variants designed from the start |
| Site implies real patient data or a live product | Constant real-vs-simulated labelling; no demo with real data |
| Scope creep into the gateway demo | Simulation view is explanatory only until the gateway exists |

---

## 4. Phased build order

Each phase ends with something deployable and presentable. Sizes are relative (S, M, L). They are not dates, in line with the Timeline doc.

### Phase A: Foundation and reference library (M)
**Ships:** a good-looking, genuinely useful site.
- Design tokens, layout shell, header with search, footer
- Data model, zod schemas, and the validator
- Seed `systems.json` and `sources.json` from `RESEARCH.md` (~40 systems across the layers)
- **Home** (static version), **Systems** (cards, filters, detail pages), **Sources**
- Deployed to a preview URL

*Why first:* the data and the design system underpin everything else. This phase is useful on its own as a reference.

### Phase B: The Landscape view (L)
**Ships:** the signature view.
- Layered diagram, node shapes and edge types
- Connection slider and lenses
- Detail drawer linked to Systems pages
- Table fallback and keyboard navigation
- Seed `connections.json`

*Why second:* it is the highest-impact feature and everything else links into it.

### Phase C: Journeys (M)
**Ships:** the story that makes it click for non-technical visitors.
- Scrollytelling stepper over the Landscape
- "Follow a patient" and "Follow a lab result" first, then the claim and the doctor's ladder
- Copies and hand-offs counters

### Phase D: Provinces (M)
**Ships:** provincial variation.
- Simplified map, metric switcher, province profiles
- Compare mode and table view
- Task 2's provincial findings (Gauteng, KZN, others) slot in here

### Phase E: Gaps (M)
**Ships:** the "what is not connected, and why" view.
- Connectivity matrix and reason tags
- Mobile list variant

### Phase F: The Simulation (M)
**Ships:** the technical reviewers' view.
- DEXA overlay: the 10 databases and 3 CSVs mapped to real systems
- Coverage map showing real systems with no simulated counterpart
- Gateway layer and design principles
- Phase timeline

### Phase G: Polish and launch (M)
- Skippable cinematic intro (optional, per the Master doc)
- Documentary video embed
- Doctor and patient entry pages
- Accessibility audit with screen reader and keyboard
- Performance pass, social preview images, mobile pass
- Playwright smoke and axe tests

### Dependencies
- **Task 2 (the deep research pass) feeds Phases A, B, D and E.** Building can start in parallel after Rajen's go-ahead, because the data model is designed to absorb new findings. Systems that Task 2 may add or change (Gauteng and KZN detail, FHIR pilots, NHI build status, OpenHIM deployments, SA Connect) should be treated as *placeholders with confidence = uncertain* until verified.
- The gateway (Phase 2 of the project) is not needed for any website phase. The Simulation view (Phase F) can be updated when the gateway exists.

---

## 5. Visualization deep-dive: how each view actually looks and works

This section matters most, because the hard part of this site is presentation. Each view below has a concept, a wireframe, the interactions, and the reasoning.

### 5.0 The core idea: one canvas, five lenses

Instead of seven unrelated pages, the main experience is **one persistent canvas** (the Landscape) that other views re-arrange. The same ~40 nodes appear in every view, so the visitor builds a mental map once and recognises it everywhere.

- The nodes never change identity (same shape, same colour, same name).
- Views change **position and emphasis**: Landscape arranges by layer, Provinces arranges by geography, Gaps arranges as a grid, Journeys highlights a path.
- Nodes animate smoothly between arrangements, so the visitor sees *the same systems* regrouped. This is the single biggest "wow" and it teaches that the views are one truth seen five ways.

### 5.1 Landscape: layered map

```
 LENS: [All] [Identity] [Clinical] [Aggregate] [Lab] [Claims]     CONNECTIONS: ○──●──○  none · exists · needed
 ┌────────────────────────────────────────────────────────────────────────────────────┐
 │               PUBLIC                 │   NATIONAL / SHARED   │       PRIVATE        │
 │ STANDARDS     ▲HNSF                  │  ▲ICD-10 MIT ▲NAPPI   │   ▲PHISC MEDCLM      │
 │ INTEGRATION        ⬢ WC PHDC         │                       │   ⬢ Switches         │
 │ MONEY                                │                       │   ◆ Schemes ◆ HealthID│
 │ LAB / IMAGING   ■ NHLS LIS  ■ PACS   │                       │   ■ Ampath ■ Lancet  │
 │ PROGRAMME       ◆ TIER.Net ◆ CCMDD   │  ◆ DHIS2              │                      │
 │ CLINICAL (PHC)  ■ Paper ■ Nat. EMR   │                       │   ■ GoodX ■ Elixir   │
 │ CLINICAL (HOSP) ■ Clinicom ■ HMS2 …  │                       │   ■ CareOn           │
 │ REGISTRIES      ● HPCSA ● SANC       │  ● MFL                │   ● CMS ● BHF        │
 │ IDENTITY        ● HPRS               │  ● Home Affairs       │                      │
 └────────────────────────────────────────────────────────────────────────────────────┘
```

**Interactions**
- **Connection slider (the key interaction):**
  - Position 1 shows only the nodes: islands.
  - Position 2 draws the connections that actually exist, and the visitor sees how few there are.
  - Position 3 adds faint dashed lines for the connections a doctor *would need*, which shows the size of the gap.
- **Hover** a node to highlight its direct connections and dim everything else. **Click** to pin it and open the drawer.
- **"Isolation score"** badge on each node: number of live connections out of the number a clinician would plausibly need. A visual shorthand for "how stuck is this system".
- Layers can be collapsed to simplify the picture. "Simple mode" shows ~12 key systems and "Full mode" shows all of them.

**Why a layered grid and not a force graph:** layers give instant meaning (the visitor reads it like a building: foundations at the bottom), the layout is stable and predictable, and it scales to 40 nodes without becoming a hairball.

### 5.2 Systems: directory

- Card grid with search, filter chips (layer, sector, status, confidence), and a sort.
- Each card: shape icon, name, one-sentence plain summary, status chip, a mini connection bar (e.g. "connects to 2 of 9").
- Click opens a **side panel** (desktop) or **full page** (mobile) with the full record.
- The record has a small **ego-graph**: the selected system in the middle and its neighbours around it, with the lines styled by type. A visitor sees "who talks to this system" in two seconds.

### 5.3 Journeys: scrollytelling

```
 ┌───────────── pinned canvas ─────────────┐   ┌──── scrolling narration ────┐
 │   (Landscape, everything dimmed except  │   │ 1. Nomsa walks into a       │
 │    the systems on this step's path)     │   │    public clinic …          │
 │                                         │   │ 2. Registered on HPRS …     │
 │   ● HPRS ───▶ ■ Paper folder ┄┄▶ ◆ TIER │   │ 3. Blood goes to NHLS …     │
 │                                         │   │                             │
 │   Copies of this result:  ▮▮▮  (3)      │   │ [◀ Prev]  step 3/9  [Next ▶]│
 │   Manual hand-offs:       ▮▮   (2)      │   └─────────────────────────────┘
 └─────────────────────────────────────────┘
```

- The path is drawn step by step, with a small moving "data packet" dot travelling along each edge.
- A **packet icon** shows what moves (a name, a result, a claim code). It visibly changes shape when it is retyped, which shows the data degrading.
- The two counters (copies and manual hand-offs) tick up as the story advances.
- Works with scroll, with arrow keys, and with Prev and Next buttons.
- **"What if it were connected?"** toggle at the end replays the same journey with the gateway in the middle. This bridges to DEXA's work without a hard sell. It is clearly marked as illustrative.

### 5.4 Provinces: map plus comparison

- A real map from the existing GeoJSON, plus a **tile cartogram toggle**. Gauteng is tiny on a real map but matters most, and equal-size tiles stop small provinces being lost.
- **Metric switcher:** hospital system, PHC system, EMR status. Colour is by *system family*, not intensity, so the visitor sees "patchwork" directly.
- The map's four "no hospital EMR" provinces use a distinctive hatched pattern (not just a colour).
- Click a province to open a **profile card**; pick a second one for **compare mode**: two columns with matching rows and the differences highlighted.
- A **"provincial patchwork" view** shows all nine provinces as small stacked cards, each with its system logo-chips, as a one-glance poster.

### 5.5 Gaps: connectivity matrix

```
              HPRS  NHLS  TIER  DHIS2  Clinicom  CareOn  Switch  Scheme
   HPRS        —     ░     ░     ░       ▓        ·       ·       ·
   NHLS        ░     —     ✎     ·       ·        ·       ·       ·
   TIER.Net    ░     ✎     —     ▒       ·        ·       ·       ·
   …
   ▓ live   ▒ partial/batch   ✎ manual re-keying   · none   ░ unknown
```

- Rows and columns can be **grouped by layer or by sector**, so the big empty blocks (public ↔ private) stand out immediately.
- The empty space is the point. A summary strip reads, for example, "X of Y possible pairs have any connection at all."
- Click a cell: a card explains *why* (reason tags) and links both systems.
- Toggle **"show reasons"** to recolour the empty cells by reason (no shared ID, different standards, consent and legal, different owners, paper, no mandate). The visitor then sees the *causes* of the fragmentation as colour regions.

### 5.6 Simulation: DEXA overlay

- Same Landscape. Simulated sources appear as **solid-filled badges** on the real systems they model, with a machine label. Real systems with no simulated stand-in stay **outlined only**.
- A **gateway band** floats above the diagram. Clicking it opens a small animation of a request fanning out to the sources, and returning with an explicit "source unreachable" case.
- A **"real ↔ simulated" side-by-side** for any selected source: left, the real system (what we know); right, DEXA's stand-in (schema flavour, its deliberate imperfections, which machine).

### 5.7 Component inventory (what has to be built)

**Foundation (used everywhere)**
| Component | Purpose |
|---|---|
| `Shell` / `Header` / `Footer` | Layout, nav, search, selection pill |
| `Drawer` | Slide-in detail panel (desktop) or full page (mobile) |
| `Chip`, `Badge`, `StatusPill`, `ConfidenceTag` | Consistent small labels |
| `GlossaryTerm` | Hover or tap definition for acronyms |
| `SourceLink` / `CitationList` | Every claim traceable |
| `ReadingLevelToggle` | Simple vs Technical text |
| `DataTable` | The accessible fallback for every diagram |

**Diagram kit (the heart of the site)**
| Component | Purpose |
|---|---|
| `SystemNode` | One node: shape by type, colour by sector, states (default, hover, selected, dimmed, hollow) |
| `Edge` | Line with style by connection type, optional animated packet |
| `LayerBand` | A labelled row in the Landscape |
| `ConnectionSlider` | The three-position control |
| `LensBar` | Filter chips that dim non-matching nodes |
| `Canvas` | Holds nodes and handles animated transitions between arrangements (Landscape, Provinces, Matrix) |
| `EgoGraph` | Small neighbourhood diagram inside a system record |
| `IsolationBadge` | "connects to 2 of 9" |

**View-specific**
| Component | Purpose |
|---|---|
| `JourneyStepper`, `PacketMarker`, `Counters` | Journeys |
| `ProvinceMap`, `ProvinceCartogram`, `MetricSwitcher`, `ProvinceProfile`, `CompareView` | Provinces |
| `Matrix`, `MatrixCell`, `ReasonLegend`, `GapSummaryStrip` | Gaps |
| `SimBadge`, `GatewayBand`, `RealVsSimPanel`, `PhaseStrip` | Simulation |
| `Hero`, `FragmentationVisual`, `StatTriplet` | Home |

### 5.8 Practical UX decisions

- **Start simple:** the Landscape opens in "Simple mode" with ~12 key systems. "Show all" is one click. First impression must not be overwhelming.
- **Always answer "what am I looking at?"** Every canvas has a one-line caption that updates with the view and the lens, plus a "How to read this" legend that is open the first time and collapsed after.
- **Never trap the visitor in an animation:** every animated sequence has Skip and Replay.
- **State is shareable:** every selection, lens and step is in the URL.
- **Touch targets** at least 44px. Hover-only information has a tap equivalent.
- **Empty and loading states** are designed (for example "No live connections found for this lens", which is itself a finding).
- **Print-friendly Provinces and Gaps pages**, since reviewers may want to attach them to a report.

### 5.9 Biggest design risks and how to manage them

| Risk | Plan |
|---|---|
| Landscape feels overwhelming | Simple mode by default, the slider reveals complexity gradually |
| Animated transitions between views feel gimmicky or break on slow devices | Build static versions of every view first; add transitions last; skip them under reduced motion or low-power |
| Shape and line vocabulary is too much to learn | Compact legend always visible; ≤5 shapes and 4 line types; shown in context during the first journey |
| Gaps matrix reads as a spreadsheet | Group and colour by reason, with a headline sentence above it |
| Mobile loses the "wow" | Dedicated mobile designs: vertical layered list, swipeable journey cards, table-first Provinces |

### 5.10 Recommended next step before any code: low-fidelity wireframes

Before Phase A starts, produce **clickable wireframes for the Landscape, a System record, and one Journey step** (grey boxes, real labels, real content from the research). That is the cheapest way to confirm the layout and vocabulary with Rajen and the partner before any component is built. I can produce these as simple HTML wireframes when asked.

---

## 6. Decisions needed from Rajen

1. **Scope reorder (§1.8):** landscape explorer first, with the cinematic intro and the doctor and patient paths later. Agree?
2. **Visual direction (§5):** the one-canvas concept, the connection slider, and shape and line vocabulary. Anything to change?
3. **Do you want the wireframes (§5.10) before Phase A starts?** I recommend yes.
4. **Public machine labels:** the Simulation view labels sources *Rajen's PC* and *Partner's laptop*. Should these be neutral (*Machine 1* and *Machine 2*)?
5. **Stale docs:** the Master and Timeline docs mention four sources and a different website scope. Update them later?
6. **Parked until the design is locked:** hosting and domain, and where the documentary video is hosted.
7. **Confirm Task 1 is complete,** so I can begin Task 2 (the deep research pass).
