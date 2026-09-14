# Data Governance

This is a prototype-scale governance summary for the interoperability
platform's own canonical store (the `sa_health` database and the audit
trail it maintains). It does not cover the four simulated source systems'
own internal governance, since a real deployment would treat those as
externally-owned systems this platform integrates with, not systems it
governs directly.

**Responsible party vs operator, and owner vs steward:** these are
distinct concepts. Under POPIA, a *responsible party* determines the
purpose and means of processing (accountable for compliance); an
*operator* processes data on the responsible party's instruction. *Data
owner* and *data steward* are organisational-governance roles that would
sit within whichever entity is the responsible party for a given
category. In a real deployment of a platform like this, the responsible
party would typically be the health authority or facility group whose
patients' data is being combined — this document assigns owner/steward
roles on that assumption, not as a claim about who operates this
prototype.

| Data category | Data owner (real deployment) | Data steward (real deployment) | Data-quality check currently enforced |
|---|---|---|---|
| **Patient demographics** (canonical `Patient`: identifiers, name, gender, DOB, contact, address) | The health authority or facility group under whose care the patient's records were created (e.g. the provincial Department of Health, for a public-sector patient) | A designated Health Information Officer / Master Patient Index administrator responsible for demographic data quality and duplicate management | Zod schema validation (`canonicalPatientSchema`) at the orchestrator boundary — every field, type, and required-vs-optional shape is checked before a record is combined or stored; a record failing validation is rejected and logged, never silently accepted |
| **Encounter data** (canonical `Encounter`: status, class, period, source reference) | The facility or system where the encounter took place (e.g. the clinic or hospital operating that source system) | A clinical records/HIM (Health Information Management) officer at that facility | Zod schema validation (`canonicalEncounterSchema`), plus Postgres `CHECK` constraints on `status`/`class` enum values and `NOT NULL` on `period_start` in the `encounters` table |
| **Lab observations** (canonical `Observation`: status, category, code, value, unit) | The laboratory or clinical service that produced the result (e.g. the hospital's pathology department) | A laboratory information system administrator or clinical data quality officer | Zod schema validation (`canonicalObservationSchema`); adapter-level unit normalisation and explicit logging of ambiguous/missing units (Backend_Research.docx Section 2.3) rather than silent guessing — see each adapter's `translate.ts` and the associated `AdapterWarning` records |
| **Medications** (canonical `MedicationStatement`: status, medication code/text, dosage) | The prescribing facility or pharmacy system | A pharmacy/medicines information officer | Zod schema validation (`canonicalMedicationStatementSchema`); a `medication` field that is a discriminated union (`coded` vs `text`) enforced at the schema level, so every record is traceably either terminology-coded or explicitly free text — never ambiguous about which |
| **Consent tokens** (`ConsentTokenClaims`: requesting party, patient, scopes, purpose, expiry) | The patient (or their legal guardian) whose consent the token represents | The platform's own consent-service administrator, responsible for token-issuance policy and key management | Zod schema validation (`consentTokenClaimsSchema`) on every claim; cryptographic integrity via JWT signature verification (HS256) and expiry enforcement (`consentGuard`/`verifyToken`) before any query is permitted to run |
| **Audit logs** (`AuditEvent`: operation, actor, patient, outcome, purpose, resource types, per-source detail) | The platform operator (the entity running this interoperability layer), since the audit trail is evidence of the platform's own access-control behaviour, not any single source's data | A security/compliance officer responsible for audit-log integrity and retention | Zod schema validation (`auditEventSchema`) on every event; the outbox pattern (`audit_outbox` → `audit_events`) guarantees no event is silently dropped even if the downstream write is transiently unavailable, and every access (including reads of the audit trail itself) is itself logged |

## Notes on scope

- **Source D's SA ID numbers** are the one field in this system subject to
  field-level encryption at rest (see `sources/hprs-style-d/src/encryption.ts`),
  reflecting their status as a genuine national identifier rather than a
  synthetic demo identifier — a narrower, more sensitive category than
  "patient demographics" generally.
- This table intentionally does not include a "sync/offline state" category:
  that is future (Phase 3) work per `Backend_Research.docx` Section 5.2 and
  does not yet exist as stored data.
- No production-scale governance tooling (a data catalogue, automated
  lineage tracking, a formal DPIA process) is implemented or assumed here —
  consistent with `Backend_Research.docx` Section 11.1's framing of that
  tier of work as production hardening beyond this prototype's scope.
