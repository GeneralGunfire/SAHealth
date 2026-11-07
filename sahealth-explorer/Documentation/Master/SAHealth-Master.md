# SAHealth — Master Document

*Foundational reference: what we are building, what it does, and what each phase delivers.*

## 1. What SAHealth Is

SAHealth is a gateway that connects independently-owned South African healthcare
systems without replacing them. It does not become a new hospital system, a new
clinic system, or a new records vault — every existing system keeps running
exactly as it does today. SAHealth sits alongside them and, with proper consent
and audit, lets a treating doctor see a patient's information pulled live from
wherever it actually lives, instead of that information staying trapped in
whichever single system happened to capture it.

It has since been rebuilt in scope
as production-style integration software — architected as a real multi-client
platform from the start, even though it is still being built and tested only
against simulated data sources, not real institutions.

## 2. The Core Problem It Solves

South African healthcare data is scattered across hundreds of thousands of
independent systems — public hospitals, public clinics, private hospitals,
private GP practices, pharmacies, labs, medical schemes, and more — each
storing patient information differently, on its own timetable, with no shared
way to bring it together. A patient treated at a clinic, referred to a
hospital, seen by a private GP, and given medicine at a pharmacy typically ends
up with four disconnected records, and the professionals treating them have no
automatic way to see the others.

Where information does cross that gap today, it almost always happens through
manual, informal means — a phone call, a fax, an emailed PDF, a WhatsApp photo,
a printed referral letter the patient physically carries — not through any
system talking to another system.

## 3. Core Principles

- **Pull, not copy.** SAHealth queries source systems live, on demand. It does
  not maintain its own central copy of patient records.
- **Nothing gets replaced.** Every source system keeps operating independently,
  exactly as it does today. SAHealth is a connective layer above them, not a
  replacement for any of them.
- **Consent and audit are testable properties, not an afterthought.** Every
  access is scoped, time-limited, and logged — this is treated as core
  functionality to be verified, not a compliance checkbox added later.
- **Honest disclosure.** If a source is unreachable when a doctor queries it,
  the system says so plainly rather than silently returning an incomplete
  picture as if it were complete.
- **Built from the general case, not the test fixtures.** The technical design
  is built to handle healthcare data sources in general — the specific
  simulated sources used for testing are stand-ins, not the target.
- **AI stays out of the runtime data path.** Where AI is used at all (for
  example, helping map a new source's schema during onboarding), it is a
  build-time helper only. It never sees real patient data and it never sits
  between a doctor's request and a source's response.

## 4. Who Uses It

- **Doctors** — the first real client platform being built. A doctor-shaped
  API and, later, a doctor-facing app, giving authorised, consented,
  audited access to a patient's information across connected sources.
- **Patients** — deferred to a later phase. Eventually patients will have
  their own way to see and manage who has access to their information.
- **Government / analytics use** — a later, lower-priority phase, once the
  core platform is proven with real doctor use.

## 5. What Gets Built, Phase by Phase

### Phase 1 — Foundation
The core pipeline, built and proven against invented test data sources only.
This includes: the gateway itself, the canonical data model every source gets
translated into, the adapter pattern that lets a new source be added without
changing the core system, identity matching (working out that a record in one
source and a record in another belong to the same real person), consent and
audit logging, and honest handling of a source being unreachable. This phase
also covers setting up realistic simulated database sources across two
physical machines, so the pipeline is genuinely tested across real network
boundaries rather than all running on one machine.

### Phase 2 — Variety
Expanding the range of simulated sources — more database engines, more data
shapes, more of the real-world archetypes researched (pharmacy, laboratory,
medical scheme claims, imaging/PACS, blood bank, EMS, and others) — until the
pipeline can absorb almost any kind of source thrown at it, not just the
handful it was first built against.

### Phase 3 — Onboarding Pipeline
Building the process by which a brand-new, previously unknown source database
gets connected: AI-assisted schema mapping as a build-time aid, schema
introspection, validation, and a human review queue before anything goes live.
This is what would eventually let a new real-world institution be onboarded
without a developer hand-writing its integration from scratch.

### Phase 4 — Doctor Platform
The first real client platform, built for actual use rather than
demonstration: identity, roles, and multi-factor authentication; authorization
based on a doctor's actual relationship to a patient and their consent, with
field-level filtering (a doctor sees only what they're entitled to see); a
doctor-shaped, OpenAPI-first API; an emergency-access override that is always
flagged in the audit trail rather than silently granted; and full consent
grant/revoke management. The gateway itself becomes a real internet-facing
system at this stage — reachable over public HTTPS from any network, with real
rate limiting and TLS, while source systems themselves never face the internet
directly.

### Phase 5 — Other Clients and Real Network Separation
Expansion to additional client types (patient-facing, potentially
government/analytics), proper network separation matching a real production
deployment, and — only at this stage — any discussion of connecting to real
institutions or real data. Nothing before this phase touches real patient
data or a real institution's system.

**Target:** reach Phase 3 or 4 within a year. Not touching real hospitals or
real data before then.

## 6. Platforms

- **Website** — the public-facing entry point: a cinematic, skippable intro
  sequence, then three interactive onboarding paths (doctor / patient / just
  looking), each breaking down the platform interactively rather than as
  static text. Starts as a landing page; app UI design follows the website's
  visual language once it's established.
- **Doctor app** — the first real client application, built once the Phase 4
  doctor-platform backend work is in place.
- **Patient app** — deferred; not blocking earlier phases.
- **Database / simulated-sources setup** — the infrastructure work of
  standing up realistic stand-in data sources (see the Timeline document and
  the database-specific documents in `/database` for current status).

## 7. What This Document Does Not Cover

Specific build order and sequencing lives in the Timeline document, not here.
Backend architecture detail (schema design, matching algorithms, gateway
topology, etc.) lives in its own backend documentation, not here — this
document stays at the level of what the project is and what it delivers, not
how each piece is technically implemented.
