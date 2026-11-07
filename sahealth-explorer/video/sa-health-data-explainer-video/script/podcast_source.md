# Source document for NotebookLM Audio Overview

Paste this whole document into NotebookLM as a source, then generate an
Audio Overview (podcast). It is written as source material for the two AI
hosts to discuss — not a script to be read verbatim — but it is structured,
paced, and sequenced so a 10–20 minute conversation follows this exact order
and covers every fact.

**Instructions to give NotebookLM alongside this source** (use the "Customize"
option before generating):
> Focus only on this document. Follow its section order exactly: walk through
> one patient's data journey end to end, sector by sector, and only discuss
> problems, gaps, or criticism in the final section, "Part 8: Where it
> breaks" — do not raise problems earlier. Keep every number exact. Aim for
> 15–18 minutes.

---

## Title
How Patient Data Actually Moves Through South African Healthcare

## Framing for the hosts
Follow one hypothetical patient, "Nomsa," through the health system, tracing
her data — not her medical condition — as it's created, stored, copied, and
(mostly) fails to follow her. Every system named below is real. All figures
are cited. Nothing in Parts 1–7 is a criticism; save every critical or
"this is a problem" observation for Part 8.

---

## Part 1: The landscape

South Africa's population is about 62 million people (Census 2022). Medical
schemes — private health insurance — cover about 9.17 million beneficiaries
across 71 schemes, per the Council for Medical Schemes Annual Report
2024/25. That means roughly five out of six people rely mainly on the
public health system. These two sectors — public and private — run on
almost entirely separate infrastructure, software, and funding. There is
close to no data crossover between them by default.

## Part 2: The public clinic — registration

A patient, call her Nomsa, walks into a public clinic. She's registered on
the Health Patient Registration System (HPRS) — a national online registry
built to give every patient a unique Health Patient Registration Number
(HPRN), using her ID number (or passport). HPRS started in June 2015 and was
approved as the registration system for National Health Insurance (NHI). As
of the National Department of Health's 2025 publication "The Emerging South
African Digital Health System," HPRS holds **more than 68 million patient
records**, of which **approximately 32.5 million have been verified against
the Department of Home Affairs**. HPRS records who a patient is —
demographics — not what's wrong with them.

## Part 3: The paper folder — the actual clinical record

The clinical story — her symptoms, blood pressure, diagnosis, and
treatment — is still, in most public clinics, written by hand into a paper
folder kept at that clinic. A National Electronic Medical Record system did
go formally live on 28 March 2025, but only as a beta: 36 primary health
care facilities and 1 GP practice, across five provinces (Free State,
KwaZulu-Natal, Northern Cape, Mpumalanga, North West), per a parliamentary
reply dated 1 August 2025 (PMG reference NW4495).

## Part 4: Aggregate reporting — DHIS2

Every visit is also tallied. Clinic staff mark a paper tick register at each
service point. At month's end the ticks are totalled onto a monthly data
input form and captured into DHIS2 (the District Health Information
System, known locally as "webDHIS"), against a National Indicator Data Set.
DHIS2 stores aggregate counts only — how many visits, how many tests — with
**no patient names**. It tells the health department what's happening
across the system; it cannot tell a doctor what happened to one patient.

## Part 5: HIV/TB treatment — TIER.Net

Suppose Nomsa tests HIV-positive and starts antiretroviral therapy. Her
details now also go into TIER.Net (Three Interlinked Electronic Register),
the national ART register. A data capturer reads her paper folder and types
the same information in by hand — a second, separate transcription. TIER.Net
runs on three tiers depending on clinic size: **Tier 1**, plain paper, for
clinics under 500 patients; **Tier 2**, a standalone offline computer, for
500–2,000 patients; **Tier 3**, a networked EMR, for clinics over 2,000
patients (this three-tier design is documented in peer-reviewed literature,
e.g. PMC4005043).

## Part 6: The laboratory — NHLS

Her blood goes to the National Health Laboratory Service (NHLS), the
public-sector pathology network of roughly 265 laboratories, which performs
**more than 110 million tests a year** (NHLS Annual Report 2023/24: 110.6
million tests in 2022/23). Samples are logged into the lab's own system,
TrakCare Lab (also called LabTrak). Results reach the clinic two ways: a
web viewer called TrakCare WebView (all test types), or — for a limited set
of HIV and TB results — a small SMS printer physically installed at the
clinic. Many clinics use both. A nurse writes the result into the paper
folder by hand; a data capturer then copies it again into TIER.Net.

## Part 7: Medicines

Once stable, Nomsa's chronic medication can be dispensed through CCMDD
(Central Chronic Medicines Dispensing and Distribution) — a programme that
lets stable patients collect repeat medicine from a pick-up point near home
or work: a private pharmacy, a GP, or a community adherence club, instead
of queuing at the clinic every time. Separately, the Stock Visibility
System (SVS), running since 2013, is a mobile/web tool that tracks whether
clinics have medicine stock on the shelf — it tracks boxes of medicine, not
patients.

## Part 8: Public hospitals — a different system in every province

If Nomsa is referred to a hospital, what physically travels with her is a
paper referral letter. What system the hospital itself runs depends
entirely on the province. Per the parliamentary reply of 1 August 2025:

- **Western Cape**: Clinicom, in 53 hospitals (in use since 1998); 308 PHC
  facilities also run PHCIS.
- **Eastern Cape**: HMS2 (an in-house system), in 44 hospitals.
- **Free State**: HMS2 in 16 hospitals, Meditech in 3.
- **KwaZulu-Natal**: its own "eHealth" system, in 42 hospitals (since 2020).
- **Gauteng**: a SAP-based Health Information System, which replaced the
  legacy Medicom and PAAB systems, across 37 hospitals and 31 community
  health centres.
- **Mpumalanga, North West, Limpopo, and the Northern Cape**: quote from the
  official reply — **"not currently implementing Patient Information or EMR
  Systems at hospitals."**

The Western Cape goes one step further with the Provincial Health Data
Centre (PHDC): it links clinic visits, hospital admissions, lab results,
pharmacy dispensing, and disease registers (like TIER.Net) to a single
patient identifier — the Clinicom folder number — covering roughly 8
million people. Clinicians can browse this through a tool called the Single
Patient Viewer. It is the most integrated view of a single patient anywhere
in South Africa's public system — and it works only inside the Western
Cape's provincial border.

## Part 9: Emergency care and blood

If Nomsa arrives by ambulance, paramedics record her care on a Patient
Report Form — in many services, still a paper form. At the hospital, they
hand her over verbally using a standardised structure (EMS professionals in
South Africa commonly use the mnemonic "DeMIST": Demographics, Mechanism of
injury, Injuries found, Signs/symptoms, Treatment given), then leave the
paper form behind. If she needs a blood transfusion, it comes from the
South African National Blood Service (SANBS), which covers 8 of 9
provinces, or — uniquely — from the separate Western Cape Blood Service in
that one province. Each blood service runs its own computer system (SANBS
recently launched "eProgresa"). If she needs an X-ray or scan, it's stored
in a PACS (Picture Archiving and Communication System) — standard in
private radiology, much patchier in public hospitals (documented in
clinician surveys at Charlotte Maxeke Johannesburg Academic Hospital,
PMC10244939).

## Part 10: The private sector — GP and claims

Now suppose Nomsa has a job with medical scheme cover and sees a private
GP. The practice runs practice-management software — common products
include GoodX and Healthbridge — built primarily around billing,
scheduling, and clinical notes, but her notes live only on that one
practice's system. Every consultation generates an electronic claim, sent
through a "switch" (a claims-clearing intermediary) — major switches
include Healthbridge and MediKredit (whose HealthNet ST product handles
close to 9,000 providers in real time) — using a national standard called
PHISC MEDCLM (based on EDIFACT), which carries tariff codes and ICD-10
diagnosis codes to her medical scheme. This is billing data, not a
clinical record — but because it captures a diagnosis code and a date for
almost every private encounter, it is often the single most complete
longitudinal history of a person's private healthcare that exists anywhere.
Discovery Health built a product called HealthID directly on top of this
claims and pathology data, giving a doctor a summarized view of a patient's
history — but only if the patient has explicitly consented, **per
individual doctor**, and that consent can be withdrawn at any time.

## Part 11: Private labs, pharmacy, and hospitals

Private blood tests go to one of the big three labs — Ampath, Lancet, or
PathCare — each with its own results portal or app for referring doctors
(e.g., PathCare's "PathProvider" app). A prescription filled at a retail
pharmacy runs through dispensing software (e.g., ProPharm) that submits its
own separate claim through a switch. If Nomsa is admitted to a private
hospital, she enters that specific hospital group's system: Netcare's
CareOn, for example, is a genuinely group-wide electronic medical record —
completed across 45 of its hospitals in April 2024, running on more than
13,000 iPads with about 31,000 active users (Netcare Integrated Report
2024) — but CareOn only serves Netcare. Mediclinic and Life Healthcare run
their own separate systems. And the specialists who actually treat her
inside that hospital are mostly independent practices, each again running
their own separate software.

## Part 12: How a doctor actually finds out a patient's history, today

Pull this together into what a new doctor — one Nomsa hasn't seen
before — actually does, step by step, to learn her history, in the order
they'd typically try:

1. **Ask her directly.** This is the actual starting point every time.
2. **Read what she is physically carrying** — a referral letter, a clinic
   card, a Maternity Case Record, or (for a child) a Road to Health
   Booklet — all paper documents deliberately designed to be held by the
   patient herself, precisely because no shared electronic record exists.
3. **Check a lab results portal**, if they have access and if they ordered
   the test (or can find where it was ordered).
4. **Open the local system**, if — and only if — she was treated inside the
   same hospital group or the same province (e.g. CareOn within Netcare, or
   Clinicom/the Single Patient Viewer within the Western Cape).
5. **Check Discovery HealthID**, if she's a Discovery member and has
   consented for that specific doctor.
6. **Otherwise: phone, email, or fax** another facility directly, and send
   a signed patient consent form requesting copies of her records.

## Part 13: The legal and policy backdrop

None of this is accidental or illegal — it's the current state of policy.
The Protection of Personal Information Act (POPIA), section 32,
specifically permits registered health professionals and institutions to
process health information where necessary to treat a patient. South
Africa published a National Health Normative Standards Framework for
interoperability back in 2014, pointing toward international messaging
standards like HL7. HPRS is intended, eventually, to become the country's
national master patient index. And the National Health Insurance Act was
signed into law on 15 May 2024 — its stated goal includes one unified
national health information system — but as of now, it has **not yet come
into effect**; its implementation date hasn't been proclaimed.

---

## Part 14 (final section): Where it breaks

This is the only section where the hosts should discuss problems, gaps, or
criticism. Nothing before this point should be framed as a flaw — only as
"how it works."

1. **There is no shared record.** No national system lets any doctor pull a
   patient's full history across provinces, or across the public/private
   divide. Every piece of Nomsa's data described above is real and stored
   somewhere — it is simply never in the same place as the doctor who needs
   it.

2. **Identity itself is unreliable.** HPRS holds more than 68 million
   patient records — more than South Africa's entire population of 62
   million — while only about 32.5 million of those records have been
   verified against Home Affairs. Duplicate registrations can split one
   real patient into several different "patients" in the system, each
   holding only part of their history.

3. **Data is manually copied, repeatedly, by hand.** A single lab result
   for one patient can be transcribed three separate times: printed by an
   SMS printer, written into the paper folder by a nurse, then typed again
   into TIER.Net by a data capturer. Every retyping is a fresh chance for
   error — and peer-reviewed studies of TIER.Net have specifically
   documented patient outcomes being misreported as a result.

4. **Paper itself is a single point of failure.** A folder filed at one
   clinic simply cannot be read at another clinic. It can be lost,
   misfiled, or absent exactly when the patient needs it.

5. **Hospital systems form a provincial patchwork.** Different provinces
   run entirely different, non-interoperable hospital systems — and four
   full provinces (Mpumalanga, North West, Limpopo, Northern Cape) run no
   hospital patient-information or EMR system at all, per the government's
   own 2025 parliamentary reply.

6. **Even where data does move, it's often the wrong kind of data.** DHIS2
   moves totals and counts — never patient identities. Medical scheme
   claims move billing codes and payment amounts — never clinical notes,
   symptoms, or test results.

7. **There's a hard wall between the public and private sectors.** Public
   systems, private hospital groups, private labs, and medical schemes each
   hold a different, disconnected piece of the same patient's history. For
   the millions of South Africans who move between public and private
   care over a lifetime — which is common — no single doctor, in either
   sector, ever sees the complete picture.

**Closing line for the hosts to land on:** the data isn't missing — it's
created constantly, at every single visit, in every one of these
systems — it just doesn't travel with the patient.

---

## Source list (cite loosely if asked; do not read the raw URLs aloud)
- Council for Medical Schemes, Annual Report 2024/25
- Stats SA, Census 2022
- National Department of Health, *The Emerging South African Digital
  Health System* (2025)
- Parliamentary reply, PMG reference NW4495, National Department of
  Health, 1 August 2025
- NHLS Annual Report 2023/24
- Boulle et al., "Data Centre Profile: The Provincial Health Data Centre of
  the Western Cape Province, South Africa," IJPDS (2019)
- PMC4005043 — three-tier ART monitoring framework
- PMC7154050 — misreporting in the South African national HIV treatment
  database (TIER.Net)
- PMC10280246 — SMS printers and TrakCare WebView in South African clinics
- PMC10244939 — clinician survey on PACS at Charlotte Maxeke Johannesburg
  Academic Hospital
- Netcare Integrated Report 2024 — "Digital transformation and data"
- MediKredit, HealthNet ST product documentation
- Discovery Health, HealthID product documentation
- POPIA, section 32
- National Health Normative Standards Framework for Interoperability in
  eHealth in South Africa (2014)
- National Health Insurance Act 20 of 2023 (signed 15 May 2024)
