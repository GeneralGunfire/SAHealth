# SAHealth — Timeline Document

*Order of build, not dates. Check the summary below at a glance; the detail underneath expands on each step.*

## Summary — Order at a Glance

1. Retire the pre-restart codebase and database
2. Stand up the Phase 1 foundation — simulated database sources, schema-only, across two machines
3. Design and document the schema for each simulated source
4. Populate each source with realistic, deliberately imperfect data
5. Build the core pipeline against those sources (gateway, adapters, canonical model, identity matching, consent, audit)
6. Build the website — cinematic intro, doctor / patient / just-looking paths
7. Expand source variety (Phase 2) — more archetypes, more engines, more data shapes
8. Build the onboarding pipeline (Phase 3) — AI-assisted mapping, schema introspection, validation, review queue
9. Build the doctor platform for real (Phase 4) — auth, consent management, internet-facing gateway, doctor app
10. Expand to other clients and real network separation (Phase 5) — only after this does any real-institution conversation begin

## Detail

### 1. Retire the pre-restart codebase and database
The original gateway, orchestrator, adapter registry, and all five original
simulated sources are removed entirely rather than migrated. Useful ideas and
patterns from that earlier build carry forward conceptually, but none of the
old code or schemas do. Design documentation, README, and CI configuration are
kept, with stale references to the old sources stripped out.

### 2. Stand up the Phase 1 foundation — simulated sources, schema-only
Four simulated data sources are set up across two physical machines, so the
pipeline is later tested across a genuine network boundary rather than
entirely on one machine:
- Two SQL Server databases on the primary development machine — a clean
  private hospital/GP archetype, and a messier public provincial hospital
  archetype.
- A PostgreSQL database on the second machine, styled on DHIS2 — aggregate
  indicators only, never individual patient records.
- A file-based database on the second machine, styled on TIER.Net, the public
  clinic system — built to later hold sparse, delayed, and inconsistent data
  reflecting real paper-to-digital capture.

At this stage, all four exist purely as running, empty database engines — no
tables, no schema, and no data yet.

### 3. Design and document the schema for each simulated source
Once all four engines are confirmed running, each gets its actual schema
designed — deliberately shaped to reflect how its real-world counterpart
actually structures data, including that counterpart's real limitations. A
document is produced covering what was built, why, and how each archetype
links to and simulates the real system it's standing in for. This happens
before any data is populated.

### 4. Populate each source with realistic, deliberately imperfect data
Each source is given data that mimics real-world scale and, critically, real
imperfection — different, deliberate flaws per source: missing fields,
inconsistent formats, near-duplicate records, wrong data types, partial
history. No source is populated with clean, ideal data, because no real
source looks like that.

### 5. Build the core pipeline against those sources
With realistic sources in place, the actual Phase 1 integration code gets
built: the gateway, the self-registering adapter pattern, the canonical data
model every source translates into, identity matching between sources,
consent-scoped access, and audit logging with honest disclosure when a source
is unreachable.

### 6. Build the website
The public-facing entry point: a skippable, cinematic intro sequence, followed
by three interactive onboarding paths — doctor, patient, or just looking —
each with its own interactive breakdown rather than static text. This can
proceed in parallel with backend phases once foundation work is stable, since
it does not depend on later backend phases being complete.

### 7. Expand source variety (Phase 2)
More of the researched real-world archetypes get added as simulated sources —
pharmacy dispensing, diagnostic labs, medical scheme claims, imaging/PACS,
blood bank, EMS, and others — until the pipeline can absorb a genuinely wide
range of source shapes and engines, not just the original four.

### 8. Build the onboarding pipeline (Phase 3)
The process for connecting a brand-new, previously unknown source gets built:
AI-assisted schema mapping as a build-time aid only, schema introspection,
validation, and a human review queue before anything goes live.

### 9. Build the doctor platform for real (Phase 4)
The first real client platform: identity, roles, and multi-factor
authentication; consent- and relationship-based authorization with
field-level filtering; a doctor-shaped, OpenAPI-first API; an audited
emergency-access override; full consent grant/revoke management; and the
gateway becoming a genuine internet-facing system with real TLS and rate
limiting. The doctor-facing app itself is built on top of this.

### 10. Expand to other clients and real network separation (Phase 5)
Additional client types, production-matching network separation, and — only
once this phase is reached — the first real conversation about connecting to
an actual institution or real data. Nothing before this point touches real
patient data.

## Target Pace

Aim to reach Phase 3 or 4 within a year of the restart. No real hospitals or
real data before then.
