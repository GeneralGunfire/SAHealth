# SAHealth: how South African health data infrastructure exists today (master research file)

*Compiled 2026-11-01 for DEXA. Contains the full, uncondensed text of every research phase file, in order. Describes the real landscape only: it contains no proposals for how to fix it.*

## How to read this file

- The file is organised into parts (A to H). Each part is the complete output of one research pass and keeps its own headings.
- Every fact should carry a source URL and a confidence rating (**confirmed**, **likely** or **uncertain**). Where a statement has none, treat it as unverified.
- Parts were written at different times by different research passes. Where they disagree, both statements are kept and the disagreement is listed in the conflicts index below.
- The older project research brief (`sa-health-data-explainer-video/research/RESEARCH.md`, 27 September 2026) is the baseline that these parts extend or correct.

## Status of this compilation (honest limits)

| Part | Topic | Lines | Notes |
|---|---|---|---|
| A | Patient identity and registries | 133 | Short. Registry internals are mostly not public; the HPRS usage findings are strong. |
| B | Public-sector clinical systems and the nine provinces | 475 | Strongest coverage: all nine provinces, NEMR scale-up bid, SA Connect. |
| C | Programme data, laboratory, standards and the NHI information systems | 260 | Good on NHI, FHIR/IHE testing, CCMDD, OpenHIM. Some items were marked 'prior knowledge'. |
| D | Private sector, medical schemes, claims and pharmacy | 258 | Good on CareConnect and switches. Radiology, telehealth and MEDCLM details not covered. |
| E | Emergency, blood, imaging, other state, NGO (first pass) | 95 | Thin first pass; superseded by E1 and E2. |
| E1 | Emergency care, blood services and imaging (second pass) | 183 | Thin: public information on blood ordering, EMS and PACS is limited. No ordering protocol found. |
| E2 | Other state services, NGO/donor systems and community health (second pass) | 110 | Short; military, prisons and NGO systems remain thinly documented. |
| F | Patient journeys, data formats, law and statistics | 473 | **Caution:** parts 2 to 4 were partly written from background knowledge and contain unverified statements; verification was interrupted. Treat unsourced statements in F as uncertain. |
| G | Comparable and competing technology | 216 | Comparable technology landscape; partial. |
| H | Follow-up pass: primary-source verification of open gaps | 52 | Primary pages fetched and quoted; small but the most reliable. |

Total lines in the parts: 2,255. Research was stopped early to conserve usage, so no part reached its depth target. The coverage is not exhaustive.

## Conflicts and corrections index

These are the places where sources or parts disagree, or where earlier research was corrected. Details are in the cited part.

| Topic | What the sources say | Part |
|---|---|---|
| Patients registered in HPRS | 68 million+ (NDoH 2025 publication) versus about 35 million of a 63 million target (official statement, March 2026). | A |
| Facilities with HPRS | 3,474 (reply NW3319, Nov 2023) versus 3,280 (reply NW4628, 1 Aug 2025). They may measure different things. | H |
| HPRS active use | North West: 101 of 319 facilities active, 16% synchronisation (June 2025). KZN: 488 functional, 119 not, no hospital on HPRS. | A, H |
| Eastern Cape and Free State hospital counts | Aug 2025: EC 44; FS 16 HMS2 + 3 Meditech. May 2026 (NW2014): EC 43; FS 19 HMS2 + 2 Meditech (Meditech being retired). | B |
| National EMR beta | Aug 2025: 36 clinics + 1 GP practice. May 2026: 85 facilities in five provinces. Scale-up bid (March/June 2026): 3,083 fixed PHC facilities in 8 provinces, Western Cape excluded; the target stated elsewhere is 3,200 over 15 months. The provincial totals printed in the bid sum to 3,213, not 3,083. | B, C |
| Gauteng hospital system | Described as 'SAP-based' by government and press; the contract is a R339m Gijima award via SITA (RFB 1843/2018), so the SAP label rests on government's own description. Community health centre count is 31 in one source and 33 in the 2020 tender. | B |
| 'Enterprise Manager' / PHIS (41 hospitals) | Province not confirmed. One agent attributed it to Limpopo, which conflicts with the reply saying Limpopo runs no hospital EMR. | B, H |
| Private-sector exchange | The earlier brief said nothing connects private systems. CareConnect (private health information exchange, live April 2022, InterSystems HealthShare, 5.2 million patients signed up in 2023) exists; it is private-only. | D |
| Claims switch ownership | MediSwitch is Altron's SwitchOn, not Digital Healthcare Solutions as the earlier brief said. NAPPI is owned by MediKredit. | D |
| Life Healthcare breach | June 2020, not 2021. | D |
| Private hospital group vendors | Netcare CareOn: no core vendor named in sources. Mediclinic: only a Hitachi archive (2015) and an EHR project found. Life Healthcare: no vendor found. The earlier 'Mediclinic HCR' claim remains unverified. | D |
| SA Connect health facilities | 1,895 connected under the USO strand with a 4,232 target by 2029 (reply NW6279, Jan 2026). A 2024 statement cited 3,873 as the target. | H, B |
| FHIR | No FHIR clinical exchange in production. A CSIR IHE Gazelle conformity lab has tested HL7 v2 and FHIR PDQ/ATNA against HPRS for systems from Free State, Gauteng and KZN. A national Projectathon is reported but undated. | C, F |
| NHI Act | Signed 15 May 2024, not proclaimed. Constitutional Court heard challenges 5 to 7 May 2026 and reserved judgment; none found. Implementation paused by undertaking. | C, F |
| NHLS outages | Ransomware attack June/July 2024; a separate roughly 30-hour TrakCare outage on 16 to 18 March 2026 caused by a power failure. | C, F |

## Table of contents

### Part A: Patient identity and registries
- Round 6 gap findings
- 1. Health Patient Registration System (HPRS)
- 2. Home Affairs National Population Register (NPR) and its use by health
- 3. National Health Facility Register / Master Health Facility List (MHFL)
- 4. Statutory health professional registers
- 5. OHSC (Office of Health Standards Compliance)
- 6. BHF practice numbers (PCNS)
- 7. Council for Medical Schemes (CMS)
- 8. Provincial identifiers and master patient index efforts
- Unanswered / could not find

### Part B: Public-sector clinical systems and the nine provinces
- Round 6 gap findings
- 1. National frame: legal and organisational basis of provincial variation
- 2. The National Electronic Medical Record (NEMR / e-Impilo)
- 3. Western Cape (covered here for the cross-province comparison; RESEARCH.md has the base)
- 4. Gauteng
- 5. KwaZulu-Natal
- 6. Eastern Cape
- 7. Free State
- 8. Limpopo, Mpumalanga, North West, Northern Cape
- 9. Hospital information systems used nationally: product summary table
- 10. National Department of Health systems and contracts (what was found)
- 11. Facility-level connectivity, power and hardware (NW4495 and related)
- 12. Data capturers and human resources
- 13. Ideal Clinic programme data
- 14. Facility counts and provincial structure: what was found
- 15. Cross-province comparison (single table)
- Unanswered / could not find
- Source list (opened this session unless marked "search only")

### Part C: Programme data, laboratory, standards and the NHI information systems
- Round 6 gap findings
- A1. DHIS2 / webDHIS (aggregate routine health information)
- A2. TIER.Net (Three Interlinked Electronic Register)
- A3. TB registers (ETR.Net, EDRWeb) and HIV/TB reporting lines
- A4. Immunisation: EPI-SA and EVDS
- A5. MomConnect
- A6. Maternal and child records and audit programmes
- A7. National Cancer Registry (NCR)
- A8. Mortality: BI-1663 and death notification
- A9. CCMDD, SVS, RxSolution, and medicine data
- A10. Pharmacy and product reference data
- B1. NHLS LIS (TrakCare Lab)
- B2. Outages and incidents
- B3. NHLS Corporate Data Warehouse (CDW)
- B4. NICD surveillance: NMC system, GERMS-SA
- C1. HNSF
- C2. Terminologies
- C3. Digital Health Strategy
- C4. HIE and the African Health Information Exchange project
- C5. openEHR
- D1. HPRS (Health Patient Registration System)
- D2. National EMR (e-impilo) timeline and architecture
- D3. NHI Act legal status
- D4. Funding indicators
- D5. NHI Act s40 text
- Unanswered / could not find

### Part D: Private sector, medical schemes, claims and pharmacy
- Round 6 gap findings
- 1. Private-sector size and structure
- 2. Medical schemes, administrators and the regulator
- 3. Private hospital group systems
- 4. CareConnect health information exchange (new to the base research)
- 5. Claims switching
- 6. Standards and coding
- 7. Practice management and clinical-note software
- 8. Laboratories (private)
- 9. Pharmacy and medicines
- 10. Data protection and breaches (health sector)
- 11. Discovery HealthID
- 12. Not covered in depth
- Unanswered / could not find

### Part E: Emergency, blood, imaging, other state, NGO (first pass)
- Round 6 gap findings
- 1. Emergency medical services
- 2. Blood services
- 3. Imaging
- 4. Other state services
- 5. NGO / donor systems
- Unanswered / could not find

### Part E1: Emergency care, blood services and imaging (second pass)
- 2. Department of Correctional Services (DCS) health care and records
- 3. Municipal and metro health services
- 2. Blood services
- 3. Medical imaging
- 4. Addendum from resumed session (2026-11-01): Gauteng, Western Cape, Free State, regulations
- Unanswered / could not find

### Part E2: Other state services, NGO/donor systems and community health (second pass)
- Round 6 gap findings
- 1. South African Military Health Service (SAMHS)
- 2. Department of Correctional Services (DCS) health care and records
- 3. Municipal and metro health services

### Part F: Patient journeys, data formats, law and statistics
- Round 6 gap findings
- 1.1 Antenatal care and delivery (public sector)
- 1.2 Child immunisation visit (EPI-SA)
- 1.3 HIV testing to ART initiation to follow-up to viral load
- 1.4 TB screening to diagnosis to treatment
- 1.5 Chronic NCD (hypertension/diabetes) clinic visit and CCMDD
- 1.6 Acute illness at a clinic with referral to hospital
- 1.7 Emergency by ambulance to hospital and discharge
- 1.8 Surgical elective referral and waiting list
- 1.9 Mental health journey (public)
- 1.10 Private GP consultation with claim
- 1.11 Private specialist and private hospital admission with scheme pre-authorisation
- 1.12 Pharmacy dispensing (private retail)
- 1.13 Public-to-private and province-to-province movement
- 1.14 Death notification (BI-1663) and cause-of-death data
- 2.1 HPRS (Health Patient Registration System)
- 2.2 DHIS2 (aggregate data, "webDHIS")
- 2.3 TIER.Net
- 2.4 TrakCare Lab (NHLS LIS)
- 2.5 Clinicom (Western Cape hospitals)
- 2.6 PHCIS (Primary Health Care Information System, Western Cape)
- 2.7 HMS2 (Eastern Cape/Free State)
- 2.8 SAP HIS (Gauteng)
- 2.9 CareOn (Western Cape Hospitals? "CareOn" electronic medical record)
- 2.10 GoodX
- 2.11 MEDCLM (EDIFACT) - medical claims message
- 2.12 NAPPI (National Pharmaceutical Product Index)
- 2.13 ICD-10 MIT (Master Industry Table)
- 2.14 CCMDD stock systems
- 2.15 HL7 v2 message types in use (documented/likely)
- 2.16 SA ID number structure (DHA)
- 2.17 Date, name, address conventions and languages
- 2.18 LOINC and SNOMED
- 2.19 Other formats
- 3.1 POPIA (Protection of Personal Information Act 4 of 2013)
- 3.2 National Health Act 61 of 2003
- 3.3 NHI Act 20 of 2023
- 3.4 Health Professions Act 56 of 1974, HPCSA guidelines
- 3.5 Medical Schemes Act 131 of 1998
- 3.6 PAIA (Promotion of Access to Information Act 2 of 2000)
- 3.7 Cybercrimes Act 19 of 2020
- 3.8 Electronic Communications and Transactions Act 25 of 2002 (ECTA)
- 3.9 National Health Normative Standards Framework (HNSF)
- 3.10 Consent rules, children, emergencies
- 3.11 Record retention periods (summary of what is documented)
- 3.12 Major breaches and outages (public record)
- 4.1 Population and coverage
- 4.2 Facilities
- 4.3 Workforce
- 4.4 Spending
- 4.5 Patient volumes
- 4.6 HIV/TB programme
- 4.7 NHLS volumes
- 4.8 Claims and switch volumes
- 4.9 Connectivity and electricity
- 4.10 Digital health maturity and audit findings
- Unanswered / could not find

### Part G: Comparable and competing technology
- 0. Summary comparison table
- 1. South African players

### Part H: Follow-up pass: primary-source verification of open gaps
- Round 6 gap findings (follow-up pass, verified against primary pages)
- Unanswered / could not find


---

# PART A: PATIENT IDENTITY AND REGISTRIES

*Source file: research/phase_A_identity_registries.md (133 lines)*

## Round 6 gap findings

Compiled 31 October 2026 for SAHealth (DEXA). Scope: the real-world landscape only; no recommendations. Note on coverage: this file is shorter than the requested 1,200+ lines. Many registry internals (HPRS data model, HPRN format, PCNS digit structure, MFL fields, iRegister fields) are not publicly documented and could not be established. These are listed in the final section rather than padded.

### Gap 1: HPRS active-use statistics per province; facilities actively synchronising vs merely registered

**Finding.** No single national table of "registered vs actively synchronising" facilities exists in public sources. Per-province snapshots from the June 2025 Select Committee on Social Services briefings show wide divergence between facilities that have HPRS installed and facilities that actively sync.

| Province | Snapshot | Figures | Source |
|---|---|---|---|
| Free State | briefing, data as at 26 May 2025 | "100% Coverage: 253 clinics and hospitals using HPRS"; "3 860 000 patients registered"; "37 490 000 facility visits recorded"; rollout began 2014 | https://pmg.org.za/committee-meeting/41085/ |
| North West | briefing 18 June 2025 | ~3.4 million registered; ~10.5 million follow-up visits; **101 of 319 facilities actively using HPRS; data synchronisation rate 16% (June 2025)**; cause cited: "old system versions and connectivity issues"; a committee note elsewhere reports 364 facilities offline by end May 2025 (secondary report, not verified against primary) | https://www.parliament.gov.za/press-releases/media-statement-select-committee-social-services-addresses-urgent-health-system-challenges |
| KwaZulu-Natal | Post, 11 June 2025 | ~15 million patients registered (figure reported as KZN-level in the article, which also says "nationally 15 million"; the article is internally ambiguous); 3.7 million at 74 eThekwini facilities; **488 facilities functional, 119 non-functional**; challenges at 116 clinics; no hospital had HPRS yet, 10 hospitals identified for pilot (incl. Addington); HPRS "does not yet integrate with existing Department of Health systems" (Acting HOD Msimango); functionality "currently limited to patient registration" (MEC Simelane) | https://thepost.co.za/news/south-africa/kwazulu-natal/2025-06-11-challenges-in-implementing-the-health-patient-registration-system-in-kwazulu-natal |
| Eastern Cape | briefing June 2025 | 764 clinical facilities (excl. hospitals; MP cited "764 out of 777"); Ingquza Hill sub-district at 100% implementation; R29 million allocated to move connectivity from Office of the Premier broadband to wards; Starlink, LTE routers, data bundles explored/used; clinic generators do not cover whole facility so data sometimes captured manually; HMS2 phase 1 "completed by 40 of the hospitals"; PEPFAR funding issued January 2025, withdrawal anticipated September 2025 | https://pmg.org.za/committee-meeting/41085/ |
| Western Cape | briefing June 2025 | all primary clinical facilities on broadband except one in Garden Route; offline capture supported in latest systems; potential duplicates flagged and confirmed with patients; MFA, encryption, audit trails | https://pmg.org.za/committee-meeting/41085/ |
| Gauteng | briefing June 2025 | rollout "began in 2017", results "mixed"; no figures | parliament.gov.za press release (above) |
| Limpopo | briefing June 2025 | no figures; "slow pace of training" acknowledged | same |
| Mpumalanga, Northern Cape | not found | none | n/a |

National facility counts reported by the Minister: 3,474 public facilities on a spreadsheet attached to NW3319 (3 Nov 2023, https://pmg.org.za/committee-question/23923/); 3,220 facilities (3,136 PHC establishments plus 84 hospitals) as at 28 August 2023 (NW2575, https://pmg.org.za/committee-question/23475/); 3,280 facilities with biometric functionality in 249 (about 7.6%) per NW4628 of 1 Aug 2025 (https://pmg.org.za/committee-question/31749/). The 3,220 vs 3,474 vs 3,280 figures differ by source and date and are not reconciled in any source seen; they likely count "installed" facilities rather than syncing ones.

**Confidence.** Confirmed for each quoted snapshot; uncertain for any national "active" figure (none published). The offline numbers for North West (364) come from a secondary report.

**How it changes the picture.** "Registered" and "rolled out" overstate live use. Rollout counts are installs; North West shows 16% sync, KZN 119 non-functional, and the Free State admits offline work creates duplicates. The earlier brief's "more than 68 million registered" is a cumulative count of records, not of active users or of facilities syncing.

### Gap 2: HPRS integration status in hospital systems

**Finding.** Documented integration exists only partially and inconsistently:
- **HMS2 (Eastern Cape, Free State)** uses the HPRS patient reference number inside hospitals and has onboarded roughly 5.5 million patient demographic records (NDoH 2025, per existing RESEARCH.md). EC reports HMS2 phase 1 "completed by 40 of the hospitals" (June 2025 briefing); 2023 reply NW3319 mentions HMS2 being installed in 32 facilities and services in EC.
- **KwaZulu-Natal**: HPRS does not yet integrate with existing DoH systems (Acting HOD, June 2025); no KZN hospital had HPRS as of that article; the eHealth system in 42 hospitals is hoped to allow later linking.
- **Western Cape**: Clinicom (53 hospitals) and the PHDC use their own 9-digit folder number as master index; no public source states that HPRN is the key in Clinicom or PHDC.
- **Gauteng, others**: no public statement found of HPRS being integrated in the SAP-based HIS.
- National EMR: the NW4495 reply (1 Aug 2025) places beta go-live at 36 PHC facilities plus 1 GP practice from 28 March 2025; a March 2026 NHI statement says the common EMR "starts its national rollout in April" (year not stated in the article).

Sources: https://thepost.co.za/... (above), https://pmg.org.za/committee-meeting/41085/, existing RESEARCH.md.
**Confidence.** Confirmed for HMS2 and KZN; likely (by absence) for Gauteng and Western Cape; uncertain for the mechanism (API, message format).

**How it changes the picture.** HPRN is a registration identifier that hospital systems use selectively, not a universal hospital key. Each province's hospital system keeps its own local identifier alongside it.

---

## 1. Health Patient Registration System (HPRS)

### 1.1 What it is and what it is for
- **Definition (NDoH, NW2575, Aug 2023):** the HPRS "creates and issues a unique number for the USER of health care services"; that number is the Health Patient Registration Number (HPRN), which "will link all health service encounters within the South African health sector to a single person." It is described as "the authoritative source for ALL demographic details of a USER" and "the cornerstone on a portable electronic health record." Source: https://pmg.org.za/committee-question/23475/. Confidence: confirmed.
- **Position in the NHI information-system framework (same reply):** HPRS sits alongside a Master Health Facility List (MHFL), a Service Provider Registry, clinical coding standards, a Health Information Exchange (HIE) and the Health Normative Standards Framework (HNSF; gazetted 2014, again 2022). The reply says the MHFL lists **51,131 registered establishments** (all sectors, as stated), and that systems holding provider information must interface with the Service Provider Registry (targeted for full operation "within the next financial year" of the reply). Confidence: confirmed as official statement; operational status of the Service Provider Registry not established.
- **Operator:** National Department of Health with provinces. Development vendor/hosting not found in public sources (see Unanswered).
- **History:** rollout began 2014 in Free State per the 2025 briefing; the existing brief gives June 2015 for the national start; Gauteng began 2017. President Ramaphosa stated in February 2020 that 44 million were registered (IOL, 14 Feb 2020); BusinessTech reports 45,286,288 registered at that stage (https://businesstech.co.za/news/government/449795/); the existing brief gives 68 million, of whom ~32.5 million verified with Home Affairs (NDoH 2025). A 2020 report states NDoH supports DHA registering babies in hospitals "as they will then be registered automatically on the NHI patient register." In March 2026 the NHI Deputy Director-General, Prof Nicholas Crisp, said "We've got about 35 million registered at the moment" against "63 million" needed (https://businessreport.co.za/news/south-africa/2026-03-04-progress-and-challenges-for-the-implementation-of-nhi/). The 68 million and 35 million figures are inconsistent and the sources do not reconcile them (different definitions are likely: records vs verified users; this is inference). Confidence: confirmed for each quote; the reconciliation is uncertain.

### 1.2 Technical characteristics (what is established)
- Offline capability: the system permits offline work in power outages, which, per the Free State officials, can create duplicate entries when connectivity returns. Duplicates are cleaned up by NDoH "regular database clean-ups" (https://pmg.org.za/committee-meeting/41085/).
- Biometrics: functionality present in 249 facilities (NW4628, 1 Aug 2025). Reply states biometric verification gives each patient "unique identification at the point of care" and helps prevent duplicate records and people collecting the same medication from several facilities under different identities. Confidence: confirmed.
- Home Affairs: the same reply states DHA works with Health on biometric verification, enabling "real-time identity verification using data from the National Population Register" (https://pmg.org.za/committee-question/31749/). The NHI DDG said in 2026 that registration "has to be linked to the Department of Home Affairs, into the population register" and "verifiable every single time a person makes contact with a healthcare provider" (aspirational wording).
- Not publicly established: HPRN format, data model, API/web-service specification, database engine, hosting, mobile app existence, per-field list. Confidence on these: not found.

### 1.3 Data held and not held
HPRS holds demographics and a visit log (NW3319 states it records a patient's visit and categorises the reason for the visit; the Free State slide shows "facility visits recorded"). It does not hold clinical notes. KZN's MEC states functionality is limited to registration.

### 1.4 Problems documented
- Connectivity and power (EC, NW, KZN); outdated system versions (NW); missing computers/scanners (KZN); budget shortfall (KZN, DA spokesperson Dr Imran Keeka); duplicate records (FS, WC, EC); donor dependence (EC: PEPFAR).
- Private-sector HPRS use: NDoH "engaging with the private sector" (2023); no implementation found.

---

## 2. Home Affairs National Population Register (NPR) and its use by health

- **NPR verification service:** Home Affairs (DHA) announced an upgraded NPR verification service from 1 July 2025; the fee per real-time check rose from 15 cents to R10 per transaction (Sowetan, 23 June 2025; gov.za statement "Home Affairs corrects unsustainable under pricing"; BusinessTech). Earlier, DHA upgraded its verification system in March 2025 (https://www.gov.za/news/media-statements/home-affairs-upgrades-critical-digital-verification-system-24-mar-2025). Confidence: confirmed that the service exists and is priced; not confirmed whether health facilities pay per check or use a bulk arrangement.
- **Health-specific link:** HPRS ~32.5 million of the records are DHA-verified (NDoH 2025, in existing brief); biometric verification pilot in 249 facilities with NPR data (NW4628).
- **Birth registration in facilities:** DHA's target is to equip 1,445 public health facilities with maternity wards to register births immediately; DHA presence in 391 health facilities (322 public, 69 private) in an earlier undated Deputy Minister speech; a Dec 2025 parliamentary reply says rollout is ongoing in order of birth volume. A June 2025 reply on Bloemfontein states 99.98% of registrations occurred in health facilities. Source: https://pmg.org.za/committee-question/34868/ and gov.za speech on Newcastle Provincial Hospital. Confidence: confirmed; national current count of live sites not found.
- **ID formats in health use:** 13-digit SA ID, passport, refugee/asylum permits; babies lacking IDs. The sources found did not give HPRS handling rules for foreign nationals or newborns (see Unanswered).

---

## 3. National Health Facility Register / Master Health Facility List (MHFL)
- The NDoH reply (NW2575) states the MHFL "lists 51,131 registered establishments" and that the Department "is working to improve the register." This sits within the NHIS framework. Confirmed as a quote from a parliamentary reply (https://pmg.org.za/committee-question/23475/).
- Public availability: an open.africa dataset "National Health Facility Master List 2018" exists; an independent comparison classes South Africa's public lists as "not clearly labelled as official MFL." Confidence: likely.
- Facility code format, fields, owner of the code system, and the mapping to DHIS2 org units: not found in public sources.
- Related: the 3,474 facilities spreadsheet (NW3319) is a list of HPRS-installed facilities.

---

## 4. Statutory health professional registers

### 4.1 HPCSA
- Regulates 12 categories of professional (Wikipedia and gov.za summary); iRegister lets the public check "if a practitioner is registered, under which Register and in what category he/she is allowed to practice in." Registration categories include Student, Intern, Community Service, Independent Practice, plus Education, Post Graduate, Volunteer. A sample registration document shows number form "MP" plus seven digits (MP 0729515); the "MP" prefix is consistent with a profession code (a parliamentary reply uses "PM" for psycho-technicians). Single sample: uncertain.
- Count of doctors: a dated parliamentary reply gives 50,538 medical and dental practitioners (undated, likely old). Current totals not found.
- HPCSA Booklet 9 governs records (from existing brief).
- Annual fee notice for 2026/27 exists (psyssa.com). Illegal practice cases reported by HPCSA are in the 2024/25 annual report.

### 4.2 SANC, SAPC, others
- SANC: nurse register counts only in older parliamentary replies; SANC circular on employment of nurse practitioners not registered with SANC dated June 2024 (sanc.co.za/2024/06).
- SAPC (pharmacists and pharmacies), SADTC, AHPCSA, dental: no data found in this round (see Unanswered).

---

## 5. OHSC (Office of Health Standards Compliance)
- Statutory inspector and certifier of health establishments. 2023/24: 618 Certificates of Compliance issued (501 after routine inspections, 117 after re-inspections); certificate valid four years (OHSC annual performance report highlights, https://ohsc.org.za/highlights-office-of-health-standards-compliance-2023-24-annual-performance-report/). 2024/25: 715 routine inspections of public establishments (EC 170 highest, FS 21 lowest), per TimesLive 8 Oct 2025, secondary (https://www.timeslive.co.za/news/south-africa/2025-10-08-hospitals-borrow-medical-equipment-to-impress-inspectors-watchdog-warns/). OHSC publishes bi-annual inspection and certification reports (dev.ohsc.org.za/wp-content/uploads/2024/10/...). Confidence: confirmed for 2023/24; likely for 2024/25. Structured data download or facility key linked to MHFL not found.

---

## 6. BHF practice numbers (PCNS)
- The Board of Healthcare Funders administers the Practice Code Number System "in terms of section 59(1) of the Medical Schemes Act and regulations 1 and 5"; it assigns a unique number to a registered supplier rendering services in South Africa, Namibia and Lesotho, only if the supplier is registered or licensed for independent practice by the appropriate statutory body. Sample numbers are seven digits (e.g. 1535056, from a Discovery GP list). Registration fee figures on a reseller page (R761 solo, R946 partnership/incorporated) are unverified. Internal digit structure and discipline code: not found. Confidence: confirmed for role; uncertain for format.

---

## 7. Council for Medical Schemes (CMS)
- As at 31 March 2025: 71 registered schemes (16 open, 55 restricted), 33 administrators, 43 managed-care organisations, more than 10,000 brokers/brokerages (Moonstone summaries of the CMS 2024/25 annual report). Beneficiaries: about 9.1 million (another summary 9.04 million at end 2024). Open schemes -1.2% and restricted +2.4% membership 2023 to 2024. A 2025/26 CMS annual report is hosted at https://static.pmg.org.za/CMS_2025-26_AR.pdf (not read in this round). Scheme member identifiers (membership number plus dependant code) are scheme-specific; no common standard found. Confidence: confirmed for counts as secondary; the primary report was not read.

---

## 8. Provincial identifiers and master patient index efforts
- **Western Cape:** the Provincial Health Data Centre (PHDC) "mainly utilises the UPI that is created by the hospital electronic platform in the province (CLINICOM)" and shares it across other systems; linkage is "predominantly through the unique identifier which doubles as a pervasive folder number, augmented by other identifiers" and uses stepwise deterministic linkage (Data Centre Profile; IJPDS 2022/2023 articles at https://ijpds.org/article/view/1771). An estimate puts duplicates in the provincial patient master index between 10% and 20%, with spelling errors in names behind ~22% of duplicates. Clinicom introduced from 1998. The 9-digit length is per the existing brief; not re-confirmed.
- **Free State, Eastern Cape:** HMS2 uses the HPRS number.
- **KZN:** eHealth in 42 hospitals; HPRS not integrated.
- **Gauteng:** SAP HIS; Medicom legacy.
- **Others:** TIER.Net patient ID, PHCIS ID, lab episode numbers, scheme numbers: not researched in depth this round.

---

## Unanswered / could not find
Searched and could not establish:
1. HPRN format and check digit; HPRS data model and field list; vendor, database engine, hosting; API/web-service spec; mobile app.
2. Any national table of facilities actively synchronising HPRS, or Mpumalanga/Northern Cape/Limpopo/Gauteng statistics.
3. Reconciliation between 68 million, 45 million, 44 million, 57 million and ~35 million "registered" figures.
4. Whether HPRS queries the NPR live for every registration versus batch matching; the 32.5 million verification mechanism.
5. MHFL code format, fields, maintainer unit, DHIS2 org-unit mapping, breakdown by type/province.
6. HPCSA iRegister fields and current register totals by category; SANC, SAPC, SADTC, AHPCSA, dental counts and public lookup specs.
7. PCNS digit structure and discipline code list.
8. CMS register fields; medical-scheme member identifier formats.
9. TIER.Net, PHCIS, lab episode number formats; asylum/refugee permit and newborn handling in HPRS; Road to Health Booklet identifier practice; NHI registration drive numbers beyond the quoted statements.
10. A fetch of allafrica article (403 forbidden) and the unread remaining ~225,000 characters of PMG NW3319.
The requested scrapers under C:\SA Health\research\scrapers\ were not written because the sources needed were fetched directly with WebFetch/WebSearch.


---

# PART B: PUBLIC-SECTOR CLINICAL SYSTEMS AND THE NINE PROVINCES

*Source file: research/phase_B_public_clinical_provincial.md (475 lines)*

# Phase B: Public-sector clinical systems and provincial variation (South Africa, as at 31 October 2026)

Researcher: agent B. Scope: factual description of what exists. No recommendations. DEXA is not discussed beyond naming the project (SAHealth).

Evidence conventions used throughout:
- **confirmed** = read in a primary document (parliamentary reply, tender document, vendor or government page) during this research session.
- **likely** = reported consistently by secondary sources or drawn from earlier published literature, not re-read this session.
- **uncertain** = single weak source, stale source, or a conflict between sources that is stated explicitly.
- Statements marked "(background)" come from general prior knowledge of the sector and were not re-verified in this session; treat them as leads, not facts.

Working files: the scripts used are in `C:\SA Health\research\scrapers\` (prefix `B_`). Source PDFs were pulled with the WebFetch tool and converted to text with `B_pdf_text.py` (pypdf).

---

## Round 6 gap findings

### Gap 1. Provincial EMR / hospital information systems outside the Western Cape, in detail

**Finding 1.1: The most recent official province-by-province hospital system table is dated 28 May 2026 and differs from the 1 August 2025 table.**
Parliamentary reply to Question NW2014 (Ms MM Senne to the Minister of Health, 28 May 2026), "hospitals with an Electronic Medical Record, by province":

| Province | Hospitals | System as listed |
|---|---|---|
| Eastern Cape | 43 | HMS 2 System |
| Free State | 19 on HMS 2; 2 on MediTech | HMS 2 System; MediTech System |
| Gauteng | 37 | SAP - Health Information System (HIS) |
| KwaZulu-Natal | 42 | eHealth System |
| Western Cape | 53 | Clinicom Systems |

Compared with the earlier reply NW4495 (1 August 2025): Eastern Cape "at least 44 hospitals" (in various stages) became 43; Free State went from "Meditech in 3 hospitals, HMS2 in 16" to "19 HMS 2, 2 MediTech"; the other three provinces are unchanged. The NW2014 table lists only five provinces; Limpopo, Mpumalanga, North West and Northern Cape do not appear in it.
Source: https://pmg.org.za/committee-question/37900/ (fetched this session) and https://pmg.org.za/committee-question/31734/. Confidence: confirmed (the reply text); the reason for the count changes is not stated, so any interpretation of the changes is uncertain.
How it changes the picture: the earlier base (RESEARCH.md section 4) had the 2025 numbers only. The Free State is moving hospitals from Meditech to HMS2 (3 Meditech in Aug 2025, 2 in May 2026; 16 HMS2 in Aug 2025, 19 in May 2026), which is the first documented trajectory of a Meditech retirement inside a province.

**Finding 1.2: The national PHC EMR has moved from "36 PHC + 1 GP" beta (Aug 2025) to "85 PHC facilities across five provinces" beta (May 2026), and a national scale-up tender is out.**
NW2014 says beta testing "covered 85 PHC facilities across five provinces, in live facility environments", that the system is "now ready for large-scale deployment", that implementation starts "in the second quarter of the current financial year", and that the target is 3,200 PHC facilities over 15 months. The NDoH invitation to bid (document "NDoH04 2025/2026 ... EMR implementation", dated 03 March 2026 on the file name) describes 3,083 fixed PHC facilities across eight provinces (everything except the Western Cape) and an 18-month window. A Global Fund case study dated November 2025 says "e-impilo is already in use at 55 health facilities" (text truncated in the PDF; see section 2).
Sources: https://pmg.org.za/committee-question/37900/ ; https://www.health.gov.za/wp-content/uploads/2026/03/NDoH04-20252026-Final-BSC-Invitation-to-Bid-EMR-implementation-03-03-2026.pdf ; https://www.theglobalfund.org/media/x1dh0ls4/publication_south-africa-digital-health_casestudy_en.pdf . Confidence: confirmed (the three numbers 36/55/85 are each in a primary document; they are snapshots at different dates).
How it changes the picture: the national EMR is no longer only a beta. There is a live, priced, province-by-province procurement with named per-province timelines (EC 14 months, FS 4, GP 6, KZN 10, LP 6, MP 4, NC 8, NW 6). The system is also named "e-Impilo" in Global Fund and NDoH material.

**Finding 1.3: Gauteng HIS procurement facts.**
SITA tender RFB 1843/2018 (advertised end of November 2018), awarded to Gijima, value R339 million, scope "37 hospitals, 33 community health centres, and primary healthcare facilities", five years of support and maintenance, training of 5,000 to 15,000 staff, and a smartcard holding basic demographic data and a unique patient identifier. Thirteen other bidders (named: Vox Telecoms, Praxis Computing, Telemedicine Africa, Medical Information Technologies, Faranani IT Services). By July 2022 about R150 million had been spent; pilot sites (Nov 2020 to Apr 2021) were Hillbrow CHC, Lillian Ngoyi CHC, OR Tambo, Stretford CHC, Discoverers CHC and Alexandra CHC. A 2025 parliamentary reply (NW2014, 2026) labels the system "SAP - Health Information System (HIS)"; the ITWeb 2020 article does not describe SAP as a scope item and only mentions the "SAP licence estate" of the Gauteng Provincial Government in the context of delays.
Sources: https://www.itweb.co.za/article/gijima-scores-r339m-health-tender/KBpdgvpzJOJMLEew ; https://www.spotlightnsp.co.za/2022/07/13/differing-views-on-gautengs-new-health-information-system/ ; https://www.dailymaverick.co.za/article/2022-07-15-contrasting-views-and-scepticism-overshadow-gautengs-new-health-information-system/ . Confidence: confirmed for tender value, vendor, scope, pilots; uncertain for the claim that the product is built on SAP (only the government's own label supports it).
How it changes the picture: the "SAP-based HIS" in RESEARCH.md is the government's label for a Gijima-delivered system; the product name and whether SAP is the underlying engine were not found in a primary technical source.

**Finding 1.4: Mpumalanga, North West, Limpopo and Northern Cape have no hospital EMR but each has a paper-digitisation (scan and archive) programme or a manual record regime.**
- Limpopo: Veritas Digital won a five-year records-digitisation tender in mid-2020; the department had spent "well over R100m" by July 2022 (Citizen Review, 22 July 2022). Storage site at Ladanna, Polokwane.
- Mpumalanga: electronic filing (scan and archive) phase at five hospitals (Witbank, Rob Ferreira, Ermelo, Mapulaneng, Temba); R223,904,025 spent according to the Q3 report cited by the DA on 9 March 2023 (about R44.7 million per hospital); vendor not named.
- North West and Northern Cape: reported as manual record-keeping regimes in earlier parliamentary replies; NW4495 says they are "not currently implementing Patient Information or EMR Systems at hospitals".
Sources: https://citizen.co.za/review-online/?p=545584 ; https://mpumalanga.da.org.za/2023/03/da-suspicious-of-millions-spent-to-roll-out-electronic-filling-systems-in-mpumalanga-hospitals ; https://pmg.org.za/committee-question/31734/ . Confidence: confirmed for the cited figures; they are party-political or press-derived (DA, Citizen) and 2022/2023 vintage.
How it changes the picture: "not implementing EMR" does not mean "no digital activity": two of the four have multi-hundred-million-rand scanning contracts. Scanning produces image archives, not structured data.

### Gap 2. Meditech, Impilo and other public hospital HIS products nationally

**Finding 2.1: Meditech is a live vendor in KwaZulu-Natal (and 2 to 3 Free State hospitals), with a documented history back to 1990 in Addington.**
MEDITECH's own news item (13 December 2021): Grey's Hospital client since 1999 (530 beds); Addington Hospital client since 1990, upgraded to MEDITECH 6.x in 2008, "the first hospital outside the USA to run that version"; King Dinizulu Hospital Complex client since 2012; Inkosi Albert Luthuli Central Hospital (IALCH) selected MEDITECH in April 2015 to replace its legacy system and went live on 6.15 on 15 August 2016; Addington and King Dinizulu upgraded to 6.15 (contracts August 2016); KwaMashu CHC and Ntuzuma PHC new MEDITECH systems; a billing solution at 11 hospitals; IALCH IT is run by AME Africa, part of the Impilo Consortium.
Source: https://ehr.meditech.com/news/meditech-expands-solutions-in-the-kwazulu-natal-province-of-south-africa . Confidence: confirmed (vendor's own announcement); the planned go-live dates in that article (2017/2018) are old and their outcomes were not found.
How it changes the picture: KZN is a dual-estate province (Meditech at the large referral hospitals, the provincial "eHealth" system in 42 hospitals). A Public Protector finding as summarised by The Citizen says the KZN department repeatedly renewed Meditech without open tender and that Meditech SA held "an uncontested monopoly" for "more than 28 years" (source: search summary of The Citizen/Berea Mail item https://citizen.co.za/berea-mail/?p=185354; not re-read, confidence uncertain).

**Finding 2.2: "Impilo" is used for at least three different things.**
(a) "e-Impilo" / "eImpilo": the NDoH's own bespoke PHC EMR (Global Fund Nov 2025: "the electronic medical record system called e-impilo, developed by the National Department of Health"). (b) the "Impilo Consortium": a private-sector consortium that runs IT operations at IALCH (AME Africa is part of it). (c) any use of "Impilo" in older provincial histories (background: Impilo was also the name of a Gauteng-era patient system in the 2000s; not verified here). Do not conflate (a) with (b).
Sources: https://www.theglobalfund.org/media/x1dh0ls4/publication_south-africa-digital-health_casestudy_en.pdf ; https://ehr.meditech.com/news/meditech-expands-solutions-in-the-kwazulu-natal-province-of-south-africa . Confidence: confirmed for (a) and (b); (c) uncertain.

**Finding 2.3: HMS2 is an in-house Eastern Cape product that the Free State also runs.**
Eastern Cape launched a "paperless" Hospital Management System in 2021 (launch at Elizabeth Donkin Hospital, Gqeberha, then-MEC Nomakhosazana Meth), originally developed during Covid-19 and first used at the Rev Dr Elizabeth Mamisa Chabula-Nxiweni Field Hospital; Frere Hospital had "the full suite of HMS2 applications operating" by 2022 (Daily Dispatch, 4 August 2025). MIT Solve lists "Health Management System (HMS2)" as a solution entry. No external vendor was found for HMS2. The Free State uses the same name (HMS 2) in 19 hospitals as at May 2026.
Sources: https://www.theherald.co.za/weekend-post/your-weekend/2021-10-16-province-launches-paperless-patient-management-system/ ; https://www.dailydispatch.co.za/news/opinion/2025-08-04-spiral-into-decay-and-disaster-continues-in-the-ec-health-department/ ; https://solve.mit.edu/solutions/87621 ; https://pmg.org.za/committee-question/37900/ . Confidence: confirmed that it is in-house and cross-province; the Free State's relationship to the Eastern Cape developer (licence, shared code, shared team) is not documented in what was found - uncertain.

### Gap 3. SA Connect Phase 2 rollout status and health facilities connected

**Finding 3.1: As at the most recent figures found, Phase 2 has connected "1,895 health facilities" through the mobile-operator universal-service pillar, against a target of 4,232 (about 45%).**
This came from a search summary of a Communications and Digital Technologies parliamentary reply with progress "as at 31 October 2025": 5,917 sites in total (2,746 schools, 1,895 health facilities, 292 libraries, 264 traditional offices) under mobile-operator obligations with a 2029 deadline; plus "7 622 sites upgraded or installed" against a government-connectivity target of 14,342 sites by BBI/SITA-type routes. The underlying reply text was not opened this session (only the search-engine summary), so exact wording and the reply number are not verified.
Confidence: uncertain until the PMG reply is opened. I could not identify the PQ number from the summary.
Corroborating primary data: PQ.937 (NCOP written reply, publication 14 August 2026, Minister signed 22 September 2026) says "The SA Connect Phase 2 programme has, to date, deployed more than 18 367 public Wi-Fi hotspots", that the R2.55 billion 2026/27 departmental allocation "is not for SA Connect, but for the Department and its entities", and that "only R234 million has been earmarked for connectivity services for 970 government facilities connected under Phase 1 of SA Connect", including "schools, health facilities and government offices". Source: https://static.pmg.org.za/RCW937-2026-09-23.pdf (text extracted with `B_pdf_text.py`). Confidence: confirmed.
How it changes the picture: Phase 1 left roughly 970 facilities (of which about 115 health facilities in the pilot, per search summary) whose connectivity is now funded by a R234 million line; Phase 2's health-facility connections are delivered by mobile network operators under spectrum licence obligations, not by Broadband Infraco.

**Finding 3.2: The NDoH is separately buying LTE routers as backup connectivity for PHC facilities.**
NW4495 (1 Aug 2025): R20 million budgeted in 2025/26 for LTE routers and two years of data "as a backup for internet connectivity" with installation starting September 2025; R13 million nationally for computers, funded jointly with provinces. Source: https://pmg.org.za/committee-question/31734/ . Confidence: confirmed.

### Gap 4. Provincial health data warehouses / analytics platforms outside the Western Cape

**Finding 4.1: No province outside the Western Cape was found to operate a documented patient-level data warehouse comparable to the Western Cape Provincial Health Data Centre.**
Searches of PMG, provincial government pages, Spotlight and press found no named provincial data warehouse for Gauteng, KwaZulu-Natal, Eastern Cape, Free State, Limpopo, Mpumalanga, North West or Northern Cape. What exists outside the Western Cape: (a) DHIS2/"webDHIS" aggregate reporting held nationally (hosted via NDoH/ CSIR environment; background); (b) the HPRS national registry; (c) NHLS corporate data warehouse (national, not provincial); (d) Gauteng has used the "Gauteng Health Information System" HIS data stores and a Gauteng provincial "Business Intelligence" environment (background, not found in this session); (e) KZN has used the DHIS2 provincial dashboard and, per KZN budget documents, an eHealth central database (not found this session).
Confidence: the absence is uncertain (absence of evidence in public sources, not proof).
How it changes the picture: the Western Cape PHDC, described in RESEARCH.md, remains the only documented provincial integration layer; in other provinces integration happens at national aggregate level (DHIS2) rather than provincial patient level. See "Unanswered" for what could not be found.

---

## 1. National frame: legal and organisational basis of provincial variation

### 1.1 Constitutional and statutory split
- Health is a concurrent national and provincial function; provincial departments own and run hospitals and (except in metropolitan Western Cape, where the City of Cape Town runs some PHC) district health services. (background; confirmed by the NDoH EMR bid, which cites the National Health Act s74.)
- The NDoH EMR invitation to bid states: "The NDoH is required, in terms of the National Health Act (No.61 of 2003, Section 74) (NHA), to facilitate and coordinate the establishment and implementation of information systems by provincial departments at national, provincial, and local levels to create a comprehensive national health information system." Source: NDoH EMR bid document p5-6. Confidence: confirmed.
- The same document cites "The 2019-2024 NDoH Digital Health Strategy" as the policy commitment. A Global Fund note of November 2025 refers to a "forthcoming Digital Health Strategy (2025-2029)". Whether the 2025-2029 strategy has been published by 31 October 2026 was not established (see Unanswered).

### 1.2 Why systems differ by province
NW3319 (3 November 2023): the national department said it could not list upgraded facilities by province because "each province has a complex set of different solutions." The same reply says the national department and provinces implemented HPRS "as the first step toward a shared electronic health record", with a spreadsheet of 3,474 public facilities where HPRS is installed. Source: https://pmg.org.za/committee-question/23923/ . Confidence: confirmed (first 100,000 characters of a 325,000-character page read; the provincial tables are embedded images or later in the page).

NW4495 (1 Aug 2025) states: "there is no single EMR or EHR implemented" and "provinces developed different systems over time" (paraphrase by the fetch summary; the exact wording should be checked against https://pmg.org.za/committee-question/31734/).

### 1.3 National Health Information System policy documents
- National Digital Health Strategy for South Africa 2019-2024, vision "better health for all South Africans enabled by digital health", built on the eHealth Strategy 2012-2016 (Global Fund case study, Nov 2025).
- Interoperability Normative Standards Framework for Digital Health in South Africa: revised version produced by the NDoH with the CSIR; an Engineering News opinion piece of 5 June 2026 says it is "now being extended into a Health Enterprise Architecture (HEA)" (search summary; not opened). Confidence: uncertain on the HEA wording.
- National Health Normative Standards Framework (HNSF) 2014 / 2021 update: see RESEARCH.md section 9.
- The EMR bid states the EMR "complies with the National Health Normative Standards Framework (NHNSF) and is also compliant with the Draft Data Governance Framework."
- Book: Botha, Herselman and Rousseau (eds), 2024, "The Emerging South African National Health Information System: Strategies, Approaches and Experiences", NDoH and CSIR (cited by Global Fund). Related to NDoH 2025 "The Emerging South African Digital Health System" in RESEARCH.md. Confidence: confirmed as cited.

---

## 2. The National Electronic Medical Record (NEMR / e-Impilo)

### 2.1 What it is
- Name: "Electronic Medical Record (EMR) digital solution" in NDoH tender documents; "e-impilo" in Global Fund 2025 and NDoH material.
- Owner/developer: National Department of Health, Digital Health Unit (DHU). Bid wording: "The National Department of Health (NDoH) has developed a bespoke Electronic Medical Record (EMR) solution." and "newly bespoke digital health solution developed by the NDoH". Parliamentary reply NW4495 describes it as owned by the Department and developed in-house (as reported in a search summary).
- Function: "enables the capturing of data during clinical encounters and health interventions linked to a specific user by a designated healthcare service provider at a health establishment within a particular geographic area." Target users: staff at "fixed PHC facilities and other identified health establishments" (clinics, Community Health Centres, Community Day Centres).
- Integrations named in the bid: "Health Patient Registration System (HPRS), laboratory information system, Synchronised National Communication in Health (SyNCH), Master Health Facility List (MHFL), and others". The EMR/HPRS integration "ensures seamless verification of a person's unique identification".
- Standards: Global Fund says e-Impilo aims to exchange patient data "leveraging standards like Fast Healthcare Interoperability Resources" (FHIR). The bid says the EMR complies with the NHNSF. Database engine, hosting, front-end framework: **not published** in anything found (see Unanswered).
- Data ownership/consent wording in the bid: "All data captured on the EMR digital solution belongs to the patient. Informed consent for EMR data capturing allows the NHI to process the data for integration processes with other systems to produce a longitudinal electronic health record. The POPI Act 4 of 2013 will be adhered to, and Information Regulator guidelines will be applied."
- Implementation method: a maturity model: "The Digital Health Unit uses a maturity model that allows the NDoH and the specific province to assess possible implementation sites and start with the EMR implementation at facilities where the environment is mature enough ... all facilities in different provinces may not be on the same maturity level due to technical and connectivity differences."
- Modular approach: Global Fund: "e-Impilo is complementary to the existing health system, uses a modular approach and links with existing core registries".
Sources: NDoH bid PDF pp5-11; Global Fund case study p4. Confidence: confirmed.

### 2.2 Timeline
- 2019-2024: Digital Health Strategy period.
- 21 October 2024: workshop in Dihlabeng (Free State); facilities went live 22-23 Oct 2024.
- 4 Nov 2024: Nquthu (KZN) workshop; live 5-6 Nov 2024.
- 19 Nov 2024: Phokwane (Northern Cape) workshop; live 20-21 Nov 2024.
- 28 Jan 2025: Steve Tshwete (Mpumalanga) workshop; live 29-30 Jan 2025.
- 11 Feb 2025: Mahikeng (North West) workshop; live 12-13 Feb 2025.
- 28 March 2025: "Phase 1 went formally live" (NW4495).
- 1 Aug 2025: NW4495 says scale-up to start January 2026, pending a tender for a change-management service provider.
- Nov 2025: Global Fund says beta in use at 55 health facilities.
- 3 March 2026: NDoH invitation to bid for public health NGO service providers to implement the EMR in eight provinces over 18 months (document file date).
- 28 May 2026: NW2014 says beta covered 85 PHC facilities in five provinces; "ready for large-scale deployment"; implementation to start in the second quarter of the current financial year (Q2 of FY2026/27 = July-September 2026); target 3,200 PHC facilities over 15 months.
- A tender listing (Tenderflow / Vuza, via search summary) refers to NDoH 11-2026/2027, 3,083 PHC facilities in eight provinces, closing date shown as 13 July 2026 (listing, not checked against the NDoH site). Confidence: uncertain on the tender number and closing date.
- 14 May 2026: Free State Department of Health received the "Africa Tech: Public Sector Digital Innovator Award" (Africa Tech Week Awards 2026, Cape Town) for its PHC EMR; HoD Ernest Mohlahlo: "The EMR is already reducing duplication." Stated next steps: training, change management, connectivity, cybersecurity, interoperability. No figures reported. Source: https://allafrica.com/stories/202605140359.html . Confidence: confirmed.

### 2.3 Beta sites (as published 1 Aug 2025, NW4495)
Total listed: 37 (the reply says 36 PHC facilities and 1 GP practice).

| Province (local municipality) | Facilities |
|---|---|
| Free State (Dihlabeng) | Bethlehem, Bohlokong, Bekenpark, Fateng Tse Ntsho, Paul Roux, Relebohile, Itumeleng, Reitumetse clinics; Dr Koloi Private Clinic (9) |
| KwaZulu-Natal (Nquthu) | CJM Gateway, Mkhonjane, Kwa Nyezi, Nkosi Thatezakhe, Hlathi Dam, Masotsheni, Felani, Nkande clinics (8) |
| Northern Cape (Phokwane) | Jan Kempdorp CHC, Pampierstad CHC, Sakhile, Valspan, Jerry Botha, Nomimi Mothibi clinics (6) |
| Mpumalanga (Steve Tshwete) | Eastdene, Sr Mashiteng, Hendrina, Doornkop, Newtown Parkhome, Simunye clinics (6) |
| North West (Mahikeng) | Lonely Park, Maureen Roberts, Unit 9 CHC, Setlopo, Tlapeng, Masutlhe, Makouspan, Tsetse clinics (8) |

Notes: Eastern Cape, Gauteng, Limpopo and Western Cape had no beta sites in this table. NW2014 (May 2026) adds sites to reach 85 across "five provinces"; which sites were added was not found. Confidence: confirmed for the 37; uncertain for the 85.

### 2.4 Scale-up tender: facility counts and timelines by province (NDoH bid, section 3.2)
| Province | Clinics + CHCs = total | Estimated timeline |
|---|---|---|
| Eastern Cape | 736 + 43 = 779 | 14 months |
| Free State | 205 + 11 = 216 | 4 months |
| Gauteng | 330 + 42 = 372 | 6 months |
| KwaZulu-Natal | 585 + 23 = 608 | 10 months |
| Limpopo | 450 + 26 = 476 | 6 months |
| Mpumalanga | 231 + 58 = 289 | 4 months |
| Northern Cape | 128 + 33 = 161 | 8 months |
| North West | 262 + 50 = 312 | 6 months |
| **Total** | **3,083** (text says 3,083; sum of the printed provincial totals is 3,213) | within 18 months |

Observation: the text says "3,083 registered public health fixed primary healthcare facilities across eight provinces"; the eight printed provincial totals add to 3,213. The difference (130) is not explained in the document. Confidence: confirmed that the discrepancy is in the source.

District breakdowns (clinics / CHCs) printed in the bid:
- Eastern Cape: Alfred Nzo 72/3; Amathole 145/5; Buffalo City 74/5; Chris Hani 152/7; Joe Gqabi 52/0; Nelson Mandela Bay 39/9; Oliver Tambo 142/11; Sarah Baartman 60/3.
- Free State: Fezile Dabi 34/5; Lejweleputswa 40/2; Mangaung 44/2; Thabo Mofutsanyana 71/1; Xhariep 16/1.
- Gauteng: Ekurhuleni 84/9; Johannesburg 104/14; Sedibeng 30/8; Tshwane 65/8; West Rand 47/3.
- KwaZulu-Natal: Amajuba 25/1; eThekwini 103/8; Harry Gwala 39/2; iLembe 34/2; King Cetshwayo 63/1; Ugu 51/2; uMgungundlovu 49/3; Umkhanyakude 59/1; Umzinyathi 53/1; Uthukela 36/1; Zululand 73/1.
- Limpopo: Capricorn 97/4; Mopani 96/8; Sekhukhune 86/3; Vhembe 115/8; Waterberg 56/3.
- Mpumalanga: Ehlanzeni 107/15; Gert Sibande 53/19; Nkangala 71/24.
- Northern Cape: Frances Baard 24/4; J T Gaetsewe 39/5; Namakwa 22/10; Pixley ka Seme 28/8; ZF Mgcawu 15/6.
- North West: Bojanala Platinum 110/9; Dr K Kaunda 33/10; Ngaka Modiri Molema 70/18; Ruth Segomotsi Mompati 49/13.

### 2.5 Procurement model and delivery roles
- Bid title: "Appointment of public health NGO service providers to implement the electronic medical record (EMR) digital solution in eight (8) provinces for the National Department of Health and within a period of 18 months."
- Geographic-split evaluation: each province is evaluated and awarded separately; bidders may bid for several.
- Scope of work: onboarding training on the "EMR toolkit"; installation of hardware; software set-up and configuration; testing and go-live; end-user training; capacity building; change management; monitor and improve usage; one-month post go-live follow-up visit.
- Contract method: Service Level Agreement, "Agile Project Management methodologies", bi-weekly formal scrum sessions with "DHU representatives" (Digital Health Unit), monthly progress and expenditure reporting, weekly reporting to the NDoH representative.
- Staffing in bid: one team leader and one project manager per province; trainers with Adult Education and Training registration; master-trainer programme and "tiered system of support from local, provincial, to national levels".
- Pricing: per facility, priced for 3 days per facility, with a total per province.
- Bidders get no access to personally identifiable information and must sign non-disclosure agreements about the EMR solution.
- Post-go-live support includes "switching to other systems like the SYNCH, HPRS, and other systems", i.e. at go-live the clinician still moves between several separate applications.
Source: NDoH bid pp9-12. Confidence: confirmed.

### 2.6 Hardware and connectivity expectations
The bid makes the NGO responsible for installing hardware and for "troubleshooting and resolution of any computer or network challenges ... before commencement of training." NW4495 estimated about 10 computers per facility at R15,000 each for the 52 facilities lacking functional computers (see section 11). Confidence: confirmed (bid wording; reply numbers).

---

## 3. Western Cape (covered here for the cross-province comparison; RESEARCH.md has the base)

### 3.1 Systems
- **Clinicom**: hospital patient administration and clinical system; 53 hospitals (NW2014, NW4495). Patient master index; 9-digit folder number (RESEARCH.md). Prince Albert Hospital went live on Clinicom plus an AR (billing) module on 31 January 2016 and shared a database with 49 other Western Cape hospitals then (WCG item surfaced by search: https://westerncape.gov.za/gc-news/... ). A 2021 WCG tender advert exists for hospital information-related procurement (https://www.westerncape.gov.za/provincial-treasury/files/atoms/files/Health%20Advertisement%2010%20September%202021.pdf, not read). Confidence: confirmed for 2016 go-live (search excerpt); uncertain for any current replacement plan: no Clinicom replacement tender was found.
- **PHCIS** (Primary Health Care Information System): 308 PHC facilities (NW4495).
- **PREHMIS** (Personal Electronic Health Management Information System, City of Cape Town clinics).
- **Electronic Continuity of Care Record (eCCR)**: electronic discharge summary with discharge diagnoses; shares the unique health identifier with Clinicom (PHDC pages). NW4495 describes the ECCR as "recently started".
- **Provincial Health Data Centre (PHDC)** and **Single Patient Viewer (SPV)**: web portal for longitudinal and cross-sectional patient data; contact phdc.pgwc@westerncape.gov.za; centre profile PMC7482518 and IJPDS 1143; SPV article IJPDS 1614. A WCG item says "The patient master index has records for over 80% of patients in the Western Cape" (2016-era statement). Confidence: confirmed (search excerpts).
- The Western Cape Department of Health "develops most of its health information systems in-house" (statement from a comparative article surfaced in search; not attributed to a named author; likely).

### 3.2 Relationship to the national EMR
The national EMR bid covers eight provinces; the Western Cape is excluded from the facility count (3,083 across eight provinces). The reason is not stated in the bid. Confidence: confirmed on exclusion, unknown on reason.

---

## 4. Gauteng

### 4.1 Department and facilities
- Gauteng Department of Health (GDoH). Districts/metros: Johannesburg, Tshwane, Ekurhuleni, Sedibeng, West Rand (per bid). NDoH EMR bid counts 372 fixed PHC facilities in the province (330 clinics + 42 CHCs).
- Hospitals in HIS scope: 37 (NW2014). The 2020 SITA tender scope said "37 hospitals, 33 community health centres, and primary healthcare facilities". The 2025 reply says 37 hospitals; RESEARCH.md says 37 hospitals and 31 CHCs from a 2025 reply (different figure from 33 in the 2020 tender). Confidence: confirmed that the figures differ by source and date.

### 4.2 Health Information System (HIS)
- Vendor: Gijima (a SITA-procured contract). Value R339 million; tender RFB 1843/2018; awarded 2019 per Gijima, SITA notice published in the National Tender Bulletin October 2020; ITWeb article 27 October 2020.
- Scope per ITWeb: supply, installation, configuration and implementation of a "fully-managed" HIS; professional and implementation services for 37 hospitals, 33 CHCs and PHC facilities; enhancements; technical training and certification for 12 people; functional training for roughly 5,000 to 15,000 staff; a smartcard with basic demographics and a unique patient identifier number; five years of support and maintenance. Delays attributed partly to validating the Gauteng Provincial Government's SAP licence estate between Gijima and the province.
- Timeline: pilot Nov 2020 to Apr 2021 at Hillbrow CHC, Lillian Ngoyi CHC, OR Tambo (Stretford CHC, Discoverers CHC and Alexandra CHC also named); by July 2022 complete at nine City of Johannesburg CHCs, four Sedibeng facilities, three West Rand facilities, and Sebokeng, Bheki Mlangeni, Jubilee, Mamelodi and Thelle Mogoerane hospitals (Spotlight). George Mukhari's old system failed in January 2022; HIS deployment there was planned from 11 July 2022.
- Spend: about R150 million by July 2022 (spokesperson Kwara Kekana, via Spotlight).
- Official benefit claim: "at least 60% of facilities need to show a visible return on investment" (Kekana, via Spotlight). Facility downtime: "facilities use downtime procedures during outages"; power and backup power is handled by the Department of Infrastructure Development (Spotlight).
- Independent doubts (Spotlight/Daily Maverick, July 2022): could not confirm compatibility with DHIS or the NHI system; Dr Aslam Dasoo: current hospital systems "do not integrate across hospitals" and the project needs substantial IT infrastructure and skilled staff; nurse at Thelle Mogoerane: registration during pilot was "very slow".
- Government description 2025: Gauteng Provincial Government news (20 July 2025: "The journey to a paperless health system takes shape"; 27 July 2025: "Mission to digitise 800 million pages of patient records") says GDoH is "moving with speed to implement the Health Information System (HIS) that will allow for one-patient-one-file" and that 800,000 records were digitised at Chris Hani Baragwanath. (Search excerpts; the two gauteng.gov.za pages returned 404 when fetched, so exact wording is from search results. Confidence: likely.)
- Government label in parliamentary reply (NW2014, May 2026): "SAP - Health Information System (HIS)" in 37 hospitals.
Sources: https://www.itweb.co.za/article/gijima-scores-r339m-health-tender/KBpdgvpzJOJMLEew ; https://www.spotlightnsp.co.za/2022/07/13/differing-views-on-gautengs-new-health-information-system/ ; https://pmg.org.za/committee-question/37900/ .

### 4.3 Legacy: Medicom and PAAB
- Medicom and PAAB are described in RESEARCH.md as the legacy systems the HIS replaced (from a Medical Brief / SABC article). Neither the ITWeb nor the Spotlight articles read this session mention Medicom or PAAB. Confidence: likely from the earlier base; not re-confirmed.
- Historical note surfaced in Spotlight: DA's Jack Bloom linked the outdated system to alleged corruption under former MEC Brian Hlongwa, including "a R1.2 billion 2008 tender to the Baoki consortium", with "more than R400 million" paid before the contract was cancelled and no system installed. This is an allegation by an opposition politician as reported; confidence uncertain.

### 4.4 Bara digitisation
Chris Hani Baragwanath Academic Hospital: more than 800,000 patient files digitised (reported July 2025); Gauteng aim "to digitise 800 million pages" (headline). Press: The Star "Milestone as Gauteng digitises 800 000 patient files"; Independent on Saturday 22 July 2025. Vendor not identified in what was read. The earlier base says "more than 800,000 paper files". Confidence: likely.

### 4.5 Audits and oversight (general, not HIS-specific)
- Auditor-General 2023/24 (reported September 2024): Gauteng Health irregular expenditure R2.7 billion, fruitless and wasteful R17 million, material losses of R2.7 billion from impairment of accrued revenue (Polity / DA Gauteng, September 2024).
- 26 March 2026 (EWN): the AG said "lack of political will" is behind dysfunction in the Gauteng Department of Health; provincial irregular expenditure R5.1 billion.
- The search found no AG, SIU or Health Ombud finding specific to the HIS or the Gijima contract. A Bizcommunity item mentioning the SIU investigating alongside the NPA is undated and not tied to HIS. Confidence: the absence is uncertain.
- Gauteng Legislature conducted oversight visits on digital health systems (gov.za media statement; date not captured).

---

## 5. KwaZulu-Natal

### 5.1 Department and facilities
KZN Department of Health. Eleven districts (per the EMR bid): Amajuba, eThekwini, Harry Gwala, iLembe, King Cetshwayo, Ugu, uMgungundlovu, Umkhanyakude, Umzinyathi, Uthukela, Zululand. EMR-bid fixed PHC count: 608 (585 clinics + 23 CHCs), estimated 10 months for EMR roll-out.

### 5.2 KZN "eHealth" system
- Hospitals: 42 (NW4495 "phased in across 42 public hospitals since March 2020"; NW2014 "42").
- The Mercury (12 May 2022) reported 22 hospitals implementing (Prince Mshiyeni Memorial, Dr Pixley ka Isaka Seme Memorial, Madadeni, Ngwelezane, Addington, King Dinuzulu, Northdale, Mariannhill, McCords, King Edward, St Aidan's, General Justice Gizenga Memorial, Newcastle, Edendale, Dundee, Bethesda, Vryheid, Port Shepstone, EG & Usher, Queen Nandi, Grey's, Emmaus) and MEC Nomagugu Simelane: "From the beginning on 2023 onwards, we will be adding a further 20 hospitals to this list." and "Ultimately, we want all our healthcare facilities to be interlinked under one universal digital health system". Training numbers: Prince Mshiyeni 543 nurses and 183 doctors; Madadeni 258 nurses and 32 doctors. Stated benefits: preserve patient information after flood-damaged files, reduce waiting times, address missing files, and defend medico-legal claims. Vendor not named in the article. National Minister Phaahla said the NDoH would help roll out the system.
- Note: the Mercury list names Grey's and Addington (both Meditech clients per MEDITECH). Whether eHealth runs alongside, replaces or interfaces with Meditech at those hospitals was not established.
- Treasury: KZN Vote 7 documents (2021-2024) are listed in search results; one 2023 document reportedly notes that "connectivity challenges remain the main reason for failure to increase the number of hospitals implementing the eHealth system" (search summary; not opened - uncertain).
- A parliamentary committee record (search summary) says eHealth was functional in 42 hospitals and that the separate Patient Electronic Information System was "not yet integrated with the HPRS", causing duplication. Source not opened. Confidence: uncertain.
- Vendor/architecture of "eHealth": not found. Confidence: unknown.

### 5.3 Meditech in KZN
See Gap 2.1. Key points: client since 1999 (Grey's), 1990 (Addington); IALCH on 6.15 since August 2016; billing at 11 hospitals; KwaMashu CHC and Ntuzuma PHC pilots; Public Protector finding about contract renewal without tender (uncertain).

### 5.4 HPRS in KZN
A Magic828 / Daily News item (title "Challenges in implementing the Health Patient Registration System in KwaZulu-Natal") appears in search results; content not read. Confidence: unknown.

---

## 6. Eastern Cape

### 6.1 Department and facilities
Eastern Cape Department of Health. Eight districts per the EMR bid: Alfred Nzo, Amathole, Buffalo City, Chris Hani, Joe Gqabi, Nelson Mandela Bay, Oliver Tambo, Sarah Baartman. Fixed PHC: 779 (736 clinics + 43 CHCs); EMR roll-out estimate 14 months (longest of the eight).

### 6.2 HMS2
- Launched October 2021 as an "easy-to-use advanced electronic Hospital Management System (HMS)" that is paperless (The Herald, 16 Oct 2021; remainder paywalled).
- Hospitals: NW3319 (3 Nov 2023): "installing the Health Management System Version 2 (HMS2) in 32 facilities and services"; NW4495 (Aug 2025): at least 44 hospitals in various stages; NW2014 (May 2026): 43 hospitals. A source quoted in a search summary refers to a 2023/24 plan to implement in 12 hospitals.
- Frere, Nelson Mandela Central Academic Hospital, Bedford Orthopaedic and Mthatha Regional joined in 2022 (Daily Dispatch 4 Aug 2025).
- Developer: in-house; MIT Solve entry exists (https://solve.mit.edu/solutions/87621) - content not read.
- Patient identifiers: HMS2 uses the HPRS Patient Reference Number inside hospitals; about 5.5 million demographic records onboarded across EC and FS (NDoH 2025, per RESEARCH.md).
- Criticism: Daily Dispatch column (4 Aug 2025) asks how much the department has spent on "digitising its patient records" and whether implementation exists, naming HoD Dr Rolene Wagner. Opinion, not audit. Confidence: confirmed that the column exists; claims unverified.

### 6.3 Related ICT procurement controversy
City Press via MedicalBrief (2 April 2025): a roughly R300 million, three-year LAN tender (about R100 million a year) advertised 18 October 2024, closed 11 November 2024, allegedly awarded to Allied Business Solutions (Seamo Investment) with Huawei as long-term partner and Nkqubela Technology as a stated joint-venture partner. All wrongdoing allegations are unproven; officials denied or promised responses. Relevance: it concerns network infrastructure for facilities, not a clinical system. Source: https://www.medicalbrief.co.za/?p=192181 . Confidence: confirmed that the report exists; allegations uncertain.

---

## 7. Free State

### 7.1 Department and facilities
Free State Department of Health (MEC Monyatso Mahlatsi, HoD Ernest Mohlahlo as named in May 2026). Five districts: Fezile Dabi, Lejweleputswa, Mangaung, Thabo Mofutsanyana, Xhariep. Fixed PHC: 216 (205 clinics + 11 CHCs); EMR roll-out estimate 4 months (shortest, with Mpumalanga).

### 7.2 Hospital systems
- Aug 2025: Meditech (described as a "legacy system") in 3 hospitals; HMS2 in 16 hospitals "implemented in phases ... since March 2023".
- May 2026: 19 on HMS 2; 2 on MediTech.
- Hospital names per system were not found. Universitas and Pelonomi are the large Bloemfontein academic hospitals (background), but their system was not verified.

### 7.3 PHC EMR
Free State was the first beta province (Dihlabeng sub-district: 9 facilities on 22-23 October 2024). It won an Africa Tech Week 2026 public-sector award in May 2026. Vendor: none named (it is the NDoH EMR). Confidence: confirmed.

---

## 8. Limpopo, Mpumalanga, North West, Northern Cape

### 8.1 Limpopo
- Official position (Aug 2025): "not currently implementing Patient Information or EMR Systems at hospitals."
- Conflict: an older parliamentary reply (undated in the search summary) reported "41 Limpopo hospitals run a system the province calls the Provincial Health Information System (PHIS)", with clinics using HPRS. NW3319 (Nov 2023) contains a Limpopo "PHIS" answer according to the fetch note, but the page text for Limpopo was not read. Confidence: uncertain; the PHIS reference may be a patient-administration/registration module rather than an EMR.
- Digitisation: Veritas Digital, five-year contract signed 2020, "well over R100m" by July 2022, "one million files per day" claimed capacity for the Polokwane branch, storage at Ladanna; stated aims: central file access, fewer lawsuits for lost files (medico-legal claims cited at nearly R14 billion, April 2022 report). Source: https://citizen.co.za/review-online/?p=545584 .
- EMR bid: 476 fixed PHC facilities (450 + 26), 6 months. Districts: Capricorn, Mopani, Sekhukhune, Vhembe, Waterberg.
- Private: Netcare Pholoso (Polokwane) described by The Citizen as "the first and only hospital in Limpopo to go digital" (private hospital; CareOn). Confidence: likely.
- Historic: Sowetan 22 Sep 2008 "Limpopo files into 21st century" and several UNISA studies on Limpopo medical records (2013-2017) exist; not read.

### 8.2 Mpumalanga
- Official position (Aug 2025): no hospital patient information/EMR system.
- Electronic filing (scanning) at Witbank, Rob Ferreira, Ermelo, Mapulaneng, Temba (5 of 31 hospitals); spend R223,904,025 (Q3 report, per DA 9 March 2023). Vendor unnamed.
- EMR beta: Steve Tshwete (Eastdene, Sr Mashiteng, Hendrina, Doornkop, Newtown Parkhome, Simunye) from 29-30 January 2025.
- EMR bid: 289 facilities (231 clinics + 58 CHCs), 4 months. Mpumalanga has a high CHC share (58 of 289, about 20%). Districts: Ehlanzeni, Gert Sibande, Nkangala.
- NW4495 ICT survey: Mpumalanga had 21 of 287 assessed PHC facilities without functional computers (the highest of any province).

### 8.3 North West
- Official position: no EMR in hospitals; earlier replies said no facility had moved to electronic record-keeping; Daily Maverick (2019, 2022) described a manual filing system. The department was under national administration (Section 100) for four years to 2022 (Daily Maverick 20 June 2022 title: "four years under administration").
- EMR beta: Mahikeng (Lonely Park, Maureen Roberts, Unit 9 CHC, Setlopo, Tlapeng, Masutlhe, Makouspan, Tsetse), 12-13 February 2025.
- EMR bid: 312 facilities (262 + 50), 6 months. Districts: Bojanala Platinum, Dr Kenneth Kaunda, Ngaka Modiri Molema, Dr Ruth Segomotsi Mompati.

### 8.4 Northern Cape
- Official position: no hospital EMR; an earlier reply said "all facilities were using manual record keeping, with digitisation planned after paper records were upgraded"; a later committee summary says HPRS integration with EMRs was ongoing (search summary; not opened).
- EMR beta: Phokwane (Jan Kempdorp CHC, Pampierstad CHC, Sakhile, Valspan, Jerry Botha, Nomimi Mothibi), 20-21 November 2024.
- EMR bid: 161 facilities (128 + 33), 8 months. Districts: Frances Baard, J T Gaetsewe, Namakwa, Pixley ka Seme, ZF Mgcawu.
- NW4495: Northern Cape had 12 of 159 assessed PHC facilities without functional computers.

### 8.5 Failed or named past systems asked about
Searches for Medsol, Mediware, Mphatlalatsane, Meditech failures and "Impilo" failures in these four provinces returned nothing specific. No public source found this session documents a named failed hospital IS in Limpopo, Mpumalanga, North West or Northern Cape. Confidence: absence uncertain; see Unanswered.

---

## 9. Hospital information systems used nationally: product summary table

| Product | Operator / owner | Vendor | Where | Counts (latest) | Status | Confidence |
|---|---|---|---|---|---|---|
| Clinicom | Western Cape Dept of Health | Clinicom (long-standing; WC says systems largely in-house) | Western Cape hospitals | 53 hospitals (May 2026) | live; since 1998 per RESEARCH.md | confirmed |
| PHCIS | WC Dept of Health | in-house (likely) | WC PHC | 308 facilities (Aug 2025) | live | confirmed counts |
| PREHMIS | City of Cape Town Health | unknown | CoCT clinics | n/a | live | confirmed existence |
| HMS2 | Eastern Cape DoH (also used by Free State) | in-house | EC, FS hospitals | EC 43, FS 19 (May 2026) | live, phased | confirmed |
| Meditech (6.x / 6.15) | KZN DoH; FS (legacy) | MEDITECH (US) via local MEDITECH SA | Grey's, Addington, King Dinizulu, IALCH; KwaMashu CHC; Ntuzuma PHC; FS 2 hospitals | FS 2 (May 2026); KZN count not given | live; FS being retired | confirmed |
| KZN eHealth | KZN DoH | unnamed | 42 hospitals (May 2026) | 42 | live, phased since March 2020 | confirmed counts; vendor unknown |
| Gauteng HIS ("SAP-HIS") | GDoH | Gijima (SITA tender) | 37 hospitals, CHCs | 37 hospitals | live, phased | confirmed procurement; architecture uncertain |
| National EMR (e-Impilo) | NDoH DHU | in-house; NGOs implement | PHC | 85 beta facilities (May 2026) | beta to scale-up | confirmed |
| HPRS | NDoH | in-house | national | 68M registered (2025, RESEARCH.md) | live | confirmed (earlier) |
| TIER.Net | NDoH/HIV programme | Health Systems Trust-developed (background) | HIV clinics | national | live | RESEARCH.md |
| DHIS2 | NDoH | University of Oslo software; local hosting | national | aggregate only | live | RESEARCH.md |
| Scan/archive (Veritas Digital, others) | Limpopo, Mpumalanga, Gauteng | various | hospitals | Limpopo all facilities; MP 5 hospitals | contracts running | confirmed (2022/23 data) |

---

## 10. National Department of Health systems and contracts (what was found)

### 10.1 HPRS, MHFL, SyNCH
- **HPRS**: described in the bid as "developed and rolled out across South Africa as a digital solution to register individual users or persons with a unique identifier ... one of the cornerstone digital solutions that enable a longitudinal health record". Global Fund: uses biometric verification against the Department of Home Affairs fingerprint database. NW3319: installed in 3,474 public facilities. Confidence: confirmed.
- **MHFL**: Master Health Facility List "provides a unique identifier for every healthcare facility ... accurately plot the geospatial location of the facility and the category".
- **SyNCH** (Synchronised National Communication in Health): named in the bid as an existing system with which the EMR interoperates. It is also the platform for patient communication/mHealth (background: MomConnect/NurseConnect/Mobi). Details not found this session. Confidence: unknown on architecture.

### 10.2 Contracts
- The EMR scale-up is the only large NDoH health-IS contract identified with a published specification (the 2026 NGO bid). No technology vendor for the EMR itself is named; the NGOs do implementation.
- SITA: in Gauteng it ran the HIS tender; SITA also delivers "connectivity to government facilities" under SA Connect Phase 2 (over 5,000 facilities upgraded in EC, NW, MP, GP and WC per a 2023 reply). A 2006 SITA tender for a "R500m e-health" scheme exists in historical press (ITWeb), purpose: clinics electronic health record; outcome not established.
- NDoH tender documentation is on https://www.health.gov.za/wp-content/uploads/2026/03/ ; further bids (e.g., change-management service provider mentioned in NW4495) not found.

---

## 11. Facility-level connectivity, power and hardware (NW4495 and related)

### 11.1 ICT infrastructure at PHC facilities (Ideal Clinic self-assessments, 2024/25, 3,333 facilities)
| Province | Assessed | No fixed-line phone | No functional computers | No internet |
|---|---|---|---|---|
| Eastern Cape | 771 | 179 | 2 | 54 |
| Free State | 217 | 7 | 2 | 1 |
| Gauteng | 269 | 25 | 4 | 21 |
| KwaZulu-Natal | 604 | 22 | 5 | 42 |
| Limpopo | 476 | 17 | 3 | 33 |
| Mpumalanga | 287 | 17 | 21 | 15 |
| North West | 306 | 4 | 3 | 5 |
| Northern Cape | 159 | 6 | 12 | 1 |
| Western Cape | 244 | 1 | 0 | 1 |
| South Africa | 3,333 | 278 (8.3%) | 52 (1.5%) | 173 (5.2%) |

- The reply states that all public hospitals "have access to ICT infrastructure (computers, internet and telephones)".
- Reasons given: "general communication infrastructure and geography". NDoH works with Communications and Digital Technologies on SA Connect for health facilities; R20 million in 2025/26 for LTE routers and two years of data as backup; installation from September 2025; computers jointly funded with provinces, R13 million national.
- Impact quoted: without computers or internet, HPRS use could be affected, increasing waiting times and forcing manual processes.
Source: https://pmg.org.za/committee-question/31734/ . Confidence: confirmed (self-assessment data, not an audit).
Observation: the Eastern Cape accounts for 179 of the 278 facilities without fixed-line phones (64%).

### 11.2 SA Connect facts
See Gap 3. Additional detail from NW3503 (question 12 December 2023, PMG https://pmg.org.za/committee-question/24406/): Phase 2 revised model approved by Cabinet in January 2022 with three delivery arms: community Wi-Fi/household (BBI and Sentech with ISPs), government facilities (SITA), and universal service obligations under ICASA high-demand spectrum obligations (telcos connect schools, health facilities, clinics, libraries, traditional authority sites). Budget R3 billion over two years originally (R1.1 billion 2023/24, R1.9 billion 2024/25), year 1 cut by 15% to R935 million; allocations BBI R1.36 billion, Sentech R566 million, SITA R576 million; R359 million spent on Phase 1 maintenance. Targets: 32,055 hotspots over 36 months; about 1,144 km of fibre and 20 points of presence (BBI); 840 base stations and 1,600 VSATs (Sentech); SITA had upgraded over 5,000 government facilities in EC, NW, MP, GP and WC. Confidence: confirmed (as read through the fetch summary).

### 11.3 Electricity
Gauteng spokesperson (2022): power and backup power belong to the Department of Infrastructure Development; facilities rely on downtime procedures during outages (Spotlight). No national count of health facilities with functional backup power or solar was located. See Unanswered.

---

## 12. Data capturers and human resources

- No national count of health data capturers was found in this session. Background: data capturers are often employed on short contracts funded by donor programmes (PEPFAR/Global Fund) for HIV/TIER.Net entry, and by provinces for DHIS2 entry; this is background only and not verified here.
- The EMR bid assigns user training to NGO providers and plans master trainers per province or district; it specifies "tiered support ... from local, provincial, to national levels".
- Gauteng HIS training scope in 2020: functional training for 5,000 to 15,000 staff; technical certification for 12 people.
- KZN: training figures for Prince Mshiyeni (543 nurses, 183 doctors) and Madadeni (258 nurses, 32 doctors) in 2022.

---

## 13. Ideal Clinic programme data

- Ideal Clinic Realisation and Maintenance (ICRM) is the NDoH framework; the 2020 manual (Version 19, July 2020) has ten components, 32 sub-components and 238 elements (search summary of the manual; not re-opened).
- Results: by the end of 2024/25, 377 of 3,474 public clinics and community health centres had not yet reached Ideal status; a statement that 2,762 facilities attained Ideal status in 2024/25 appears in the same reply; the numbers do not reconcile (3,474 minus 377 = 3,097). Earlier reply: 2,046 (59%) of assessed facilities Ideal, up from 0% in 2014 (undated). Source search result: https://pmg.org.za/committee-question/34108/ (NW6382); not opened. Confidence: uncertain on reconciliation.
- Data platform: the programme runs an online portal at idealhealthfacility.org.za (many document downloads). No product called "Ideal Clinic Manager" was found in any source; whether it exists as software was not established. The self-assessment data used in NW4495 (3,333 facilities) came from this programme.
- Spotlight (19 Sept 2022): "Healthcare problems persist at 'ideal clinics', studies show." Confidence: confirmed that the article exists; content not read.

---

## 14. Facility counts and provincial structure: what was found

- NDoH EMR bid gives fixed PHC counts per province and district (section 2.4).
- Total public health facilities (HPRS-installed): 3,474 (NW3319; same figure as clinics+CHCs total in the Ideal Clinic reply).
- Hospital counts per province: partial (HIS counts only). The number of district, regional, tertiary and specialised hospitals per province was not captured in a single source this session. Known: Mpumalanga has 31 hospitals (DA release); Western Cape 53 on Clinicom (plus others not on Clinicom).
- Not found: a complete per-province table of clinics, CHCs, district/regional/tertiary/specialised hospitals and EMS bases, with a date. See Unanswered.

---

## 15. Cross-province comparison (single table)

| Province | Fixed PHC (clinics+CHC) | Hospital system | PHC system | National EMR beta | EMR scale-up estimate | ICT survey: no internet / assessed |
|---|---|---|---|---|---|---|
| Eastern Cape | 779 | HMS2 (43) | HPRS; HMS2 hospital-side | none listed | 14 months | 54 / 771 |
| Free State | 216 | HMS2 (19) + Meditech (2) | NDoH EMR beta (9) | 9 | 4 months | 1 / 217 |
| Gauteng | 372 | Gijima HIS "SAP-HIS" (37) | HIS in CHCs (33 per 2020 scope) | none listed | 6 months | 21 / 269 |
| KwaZulu-Natal | 608 | eHealth (42) + Meditech (some) | NDoH EMR beta (8) | 8 | 10 months | 42 / 604 |
| Limpopo | 476 | none officially (PHIS reference uncertain); scanning | HPRS | none listed | 6 months | 33 / 476 |
| Mpumalanga | 289 | none; scanning at 5 hospitals | NDoH EMR beta (6) | 6 | 4 months | 15 / 287 |
| North West | 312 | none | NDoH EMR beta (8) | 8 | 6 months | 5 / 306 |
| Northern Cape | 161 | none | NDoH EMR beta (6) | 6 | 8 months | 1 / 159 |
| Western Cape | not in EMR bid | Clinicom (53) | PHCIS (308); PREHMIS | not applicable | not applicable | 1 / 244 |

Note: the "assessed" column is the Ideal Clinic sample of 3,333, not the full facility list, and the provincial totals in the bid differ slightly (e.g., Eastern Cape 771 assessed vs 779 in the bid).

---

## Unanswered / could not find

Searched for, and could not establish in this session:
1. **NEMR/e-Impilo technical architecture**: database engine, hosting (NDoH data centre, SITA, cloud), front-end framework, offline capability, FHIR version, message formats, API gateway. Only the Global Fund phrase about FHIR and the bid's NHNSF compliance statement were found. The bid PDF has an evaluation section I did not read in full (pages 14-29, including functionality scoring).
2. **Identity of the 85 PHC beta facilities** reported in May 2026 and the five provinces; only the 37 listed in August 2025 are known. Whether Eastern Cape, Gauteng or Limpopo have sites.
3. **Award outcome of the 2026 EMR scale-up tender** (winning NGOs per province). Not found; the tender listing mentioned closing around 13 July 2026.
4. **Gauteng HIS product name, database engine and relationship to SAP.** Also current status (number of CHCs live), cost to date after 2022, and any AG/SIU/Health Ombud finding specific to the contract.
5. **Medicom and PAAB**: could not re-confirm in a primary source this session.
6. **KZN eHealth vendor and architecture**; relationship with Meditech at Grey's/Addington/King Dinizulu; the Public Protector report itself; contract values.
7. **Eastern Cape HMS2 technical details** (language, database, modules, developer entity); Free State's licence arrangement; contract costs.
8. **Hospital system names per Free State hospital** (which 2 on Meditech, which 19 on HMS2).
9. **Limpopo PHIS**: scope, vendor and current status; conflict with the "no hospital EMR" statement.
10. **Provincial data warehouses/analytics outside the Western Cape**: no named platform found for any of the eight provinces; whether provinces run their own DHIS2 or BI layers (background suggests aggregate use only).
11. **SA Connect**: the exact PMG reply behind "1,895 health facilities"; breakdown by province; how many of the 1,895 are clinics versus hospitals; whether any are not yet "live" for data use.
12. **Backup power/solar/battery status** for clinics and hospitals by province; figures on load-shedding impact on EMR use.
13. **Data capturer numbers and employment terms** by province.
14. **Ideal Clinic Manager**: could not confirm the product exists; ICRM reconciliation of 2024/25 counts.
15. **Complete hospital/clinic counts by type per province** (district/regional/tertiary/specialised/CHC/clinic) with a single date.
16. **Digital Health Strategy 2025-2029 publication status** and any National Health Information Systems Policy text beyond the 2019-2024 strategy and the HNSF.
17. **Western Cape**: any Clinicom replacement plan, current PHDC size (beyond ~8 million), and current SPV user numbers.
18. **Mphatlalatsane, Medsol, Mediware**: no source found tying them to a provincial health IS.

---

## Source list (opened this session unless marked "search only")

- NDoH EMR invitation to bid (30 pages): https://www.health.gov.za/wp-content/uploads/2026/03/NDoH04-20252026-Final-BSC-Invitation-to-Bid-EMR-implementation-03-03-2026.pdf
- PMG NW2014 (28 May 2026): https://pmg.org.za/committee-question/37900/
- PMG NW4495 (1 Aug 2025): https://pmg.org.za/committee-question/31734/
- PMG NW3319 (3 Nov 2023), partial: https://pmg.org.za/committee-question/23923/
- PMG NW3503 (SA Connect, 12 Dec 2023): https://pmg.org.za/committee-question/24406/
- NCOP PQ.937 (SA Connect, 14 Aug 2026): https://static.pmg.org.za/RCW937-2026-09-23.pdf
- Global Fund South Africa Digital Health Case Study (Nov 2025): https://www.theglobalfund.org/media/x1dh0ls4/publication_south-africa-digital-health_casestudy_en.pdf
- ITWeb on Gijima HIS tender (27 Oct 2020): https://www.itweb.co.za/article/gijima-scores-r339m-health-tender/KBpdgvpzJOJMLEew
- Spotlight (13 July 2022): https://www.spotlightnsp.co.za/2022/07/13/differing-views-on-gautengs-new-health-information-system/
- Daily Maverick (15 July 2022): https://www.dailymaverick.co.za/article/2022-07-15-contrasting-views-and-scepticism-overshadow-gautengs-new-health-information-system/
- MEDITECH KZN news (13 Dec 2021): https://ehr.meditech.com/news/meditech-expands-solutions-in-the-kwazulu-natal-province-of-south-africa
- The Mercury (12 May 2022): https://themercury.co.za/news/2022-05-12-kzn-health-department-goes-digital-with-e-health-system
- AllAfrica Free State award (14 May 2026): https://allafrica.com/stories/202605140359.html
- MedicalBrief on Eastern Cape LAN tender (2 Apr 2025): https://www.medicalbrief.co.za/?p=192181
- The Herald HMS launch (16 Oct 2021), partial: https://www.theherald.co.za/weekend-post/your-weekend/2021-10-16-province-launches-paperless-patient-management-system/
- Citizen Review Limpopo digitisation (22 Jul 2022): https://citizen.co.za/review-online/?p=545584
- DA Mpumalanga release (9 Mar 2023): https://mpumalanga.da.org.za/2023/03/da-suspicious-of-millions-spent-to-roll-out-electronic-filling-systems-in-mpumalanga-hospitals
- Search only (not opened): Daily Dispatch 4 Aug 2025 (EC HMS2 column); Polity/DA Gauteng AG report Sept 2024; EWN 26 Mar 2026 (AG on Gauteng Health); Western Cape PHDC pages (PMC7482518, IJPDS 1143/1614); PMG NW6382 (Ideal Clinic); Engineering News 5 Jun 2026 (HEA); The Citizen/Berea Mail on Meditech Public Protector.


---

# PART C: PROGRAMME DATA, LABORATORY, STANDARDS AND THE NHI INFORMATION SYSTEMS

*Source file: research/phase_C_programmes_lab_standards_nhi.md (260 lines)*

## Round 6 gap findings

Scope: Phase C. Programme data systems, laboratory, interoperability standards, NHI information systems. Researched 31 October 2026. Sources fetched this session are marked with a URL. Items marked "(prior knowledge)" come from background knowledge and were not re-verified in this session; confidence on those is "likely" at best.

### Gap 1. Documented FHIR pilots or production deployments

**Finding.** No national FHIR production exchange is documented. What is documented is (a) a standards-conformity test laboratory built by the CSIR for NDoH using IHE Gazelle, which tested systems from Free State, Gauteng and KwaZulu-Natal against the Health Patient Registration System (HPRS) using HL7 v2 and later FHIR-based profiles (PDQ, ATNA, CT); (b) the national DHIS2 platform specification (August 2026) lists "FHIR-based payloads" as one possible exchange format alongside JSON, CSV, XML and ADX; (c) the Global Fund case study (November 2025) states that the e-impilo EMR is intended to "allow the exchange of patient data, leveraging standards like Fast Healthcare Interoperability Resources" (a stated aim, not a deployed fact); (d) a CSIR research chapter proposes a FHIR-based Master Household Index (experimental, HAPI-FHIR/OpenEMPI tooling); (e) Jembi's OpenHIM work in the Data Use Partnership / African Health Information Exchange used FHIR endpoints (notes undated, circa 2019-2021, planned phases). A LinkedIn post (single, unverified source) describes a "first national Digital Health Interoperability Projectathon" on Gazelle.
**Sources.** CSIR/NDoH book *The Emerging South African Digital Health System* (Chapter 6, Sibiya and Samson), https://www.health.gov.za/wp-content/uploads/2025/07/Web-Version-The-Emerging-South-African-Digital-Health-System.pdf ; NDoH webDHIS technical stack overview, https://www.health.gov.za/wp-content/uploads/2026/08/NDOH-09-2026-26-Additional-Information.pdf ; Global Fund, https://www.theglobalfund.org/media/x1dh0ls4/publication_south-africa-digital-health_casestudy_en.pdf ; OHIE wiki, https://wiki.ohie.org/x/aQDeAQ
**Confidence.** Confirmed that conformity testing and FHIR as a named target exist; confirmed absence of any documented FHIR-based clinical record exchange in live production; uncertain whether any provincial FHIR service exists undocumented.
**How it changes the picture.** The existing brief says HNSF "recommends HL7 for messaging". The reality is that HL7 v2 (PDQ-style patient demographic query to HPRS) is the only documented live interface type; FHIR is a target and test-lab profile, not a deployed exchange layer.

### Gap 2. Current status of the NHI information systems build

**Finding.** As of October 2026 there is no operational "NHI Fund information platform". What exists are NDoH systems described as the NHI Information System (NHI-IS) building blocks: HPRS (patient registry/master patient index), Master Health Facility List (MHFL), the bespoke NDoH-developed Electronic Medical Record for primary care (called "e-impilo" in Global Fund material), and the Electronic Vaccination Data System. Key dated facts:
- 28 March 2025: National EMR formally live in a beta phase at 36 PHC facilities and 1 GP practice (parliamentary reply NW4495, already in base brief).
- November 2025: Global Fund states e-impilo "is already in use at 55 health facilities and will be rolled out to 3,300 more in the coming 2 years".
- 28 May 2026 (reply to NW2014): EMR for PHC beta tested at 85 PHC facilities across five provinces, "ready for large-scale rollout, starting in the second quarter of the current financial year", target 3,200 PHC facilities over 15 months. https://pmg.org.za/committee-question/37900/
- 19 June 2026: Tender NDOH 11-2026/2027 "Appointment of Service Providers to Support the National Department of Health with the Rollout of the Electronic Medical Record (EMR) Digital Solution in Eight (8) Provinces over a Period of 18 Months", closing 13 July 2026, compulsory briefing 2 July 2026. Scope covers 3,083 fixed PHC facilities (clinics, CHCs, CDCs) in eight provinces; Western Cape excluded. Bids are by province, to "public health NGO service providers". https://www.tenderflow.co.za/tenders/appointment-of-service-providers-to-support-the-national-dep-4e2d2bdc27a54f2fa8183619e31b5a3e/
- April 2025: CSIR described as developing HPRS, EVDS and a National Electronic Health Record System as "digital foundation for NHI". https://www.sanews.gov.za/node/74470
- May 2026: South Africa joined SNOMED International (announcement 14 May 2026). https://forums.snomed.org/t/major-milestone-for-africa-south-africa-adopts-snomed-ct-to-drive-digital-health-transformation/1332
- Legal: NHI Act 20 of 2023 assented 15 May 2024; in February 2026 the President undertook not to promulgate any NHI Act provisions before the Constitutional Court rules on the public-participation challenges (Board of Healthcare Funders; Western Cape). ConCourt heard the matters 5-7 May 2026 and reserved judgment. No judgment found by end of October 2026 in my searches (see Unanswered).
- NHI Act s40 requires the Fund to establish an information platform; none exists as an NHI Fund asset. The Fund's own procurement of an information platform was not found.
**Confidence.** Confirmed for the dated items; uncertain for the awarded contractors of NDOH 11-2026/2027 (no award notice found).
**How it changes the picture.** The base brief says the NHI effective date is unproclaimed. Added: implementation is formally paused pending ConCourt, yet the EMR/HPRS build continues as an NDoH programme (Minister: "When we paused ... we did not say we would stop our preparation", Portfolio Committee briefing 4 March 2026).

### Gap 3. CCMDD current scale and IT system

**Finding.** Project Last Mile promotional material (Dec 2025 data) states external pick-up points rose from 1,037 (Dec 2018) to 3,028 (Dec 2025) and patients collecting at them from 424,130 to more than 2.25 million; total enrolment rose from 1.35 million to more than 3.73 million. A programme analysis for Q3 2025/26 reports over 3.7 million actively enrolled with roughly 61% using external points, while another analysis of November 2025 data reports over 76%; conference slides cite 2,910 points and 64% private-sector collection. The discrepancy is unreconciled. The IT system: the NDoH-owned web system called SyNCH (Synchronised National Communication in Health) manages prescription/parcel/collection workflows (Columbia University 2019 slides; the 2026 EMR tender names SyNCH as an integration target alongside HPRS, LIS and MHFL). The Stock Visibility System (SVS) and RxSolution are stock-visibility/stock-control tools; RxSolution is a Management Sciences for Health product mostly used in hospitals and depots.
**Sources.** https://www.esgtoday.com/project-last-mile-plm-awarded-gold-for-excellence-in-helping-bring-chronic-medicines-within-reach-for-millions-of-south-africans/ ; https://www.ghsupplychain.org/stock-visibility-system-technical-brief ; https://msh.org/resources/rxsolution/ ; https://cquin.icap.columbia.edu/wp-content/uploads/2019/07/Courey_Final.pdf
**Confidence.** Confirmed that scale figures exist with the stated sources; uncertain on external share (61% vs 64% vs 76%); likely on SyNCH being the CCMDD system; "Medsas" not found in any source (uncertain/unverified).
**How it changes the picture.** The base brief lists CCMDD as pick-up points without numbers. Add: ~3.7 million patients, ~3,000 external points, majority private-sector.

### Gap 4. OpenHIM deployments in the SA public sector outside the Western Cape

**Finding.** Documented OpenHIM use: (1) Western Cape Provincial Health Data Centre uses OpenHIM for COVID-19 reporting (New America pandemic-response repository, via search summary); (2) MomConnect (national, NDoH) uses OpenHIM to move registration messages; (3) the African Health Information Exchange/Data Use Partnership notes describe OpenHIM as the planned broker between the NHLS LIS, provincial lab repository and HPRS, and TIER.Net moving "from offline to semi-online". The notes do not name a provincial deployment outside the Western Cape, and I found no document confirming a production OpenHIM instance in any other province. Absence of evidence only; status of other-province deployments: not established.
**Sources.** https://wiki.ohie.org/x/aQDeAQ ; https://newamericafoundation.github.io/pandemic-response-repository/projects/openhim ; https://ohie.org/openhie-partner-organization-spotlight-jembi-health-systems/
**Confidence.** Confirmed for WC and MomConnect; uncertain / not found for other provinces.

### Gap 5. Documented HL7 v2 interfaces between NHLS and public hospital systems

**Finding.** Documented integration of NHLS results into hospital systems exists but protocol detail is thin. The Eastern Cape HMS2/eHealth chapters say HMS2 integrates with NHLS so that users see previously requested laboratory tests, and that around 27 million NHLS lab results are integrated (EC DoH eHealth system as reported in the CSIR book); HMS2 patient labels are barcoded for NHLS and SANBS requests. The book says HMS2 integrates with HPRS via "a currently approved one-way integration" using the HNSF PDQ profile (HL7 v2 PID fields). No NHLS interface specification (message types ORU/ORM, endpoints) is public. The 2019-2021 AHIE notes describe the NHLS-to-PHDC feed as an FTP file from a data warehouse (Western Cape), with planned OpenHIM pushes.
**Sources.** CSIR/NDoH book (HMS2 chapter, sections 2.3.2.2, 2.7.1 and 2-eHealth statistics) at the URL above; https://wiki.ohie.org/x/aQDeAQ
**Confidence.** Confirmed integration exists in the Eastern Cape; HL7 v2 for NHLS feeds uncertain/unestablished; HL7 v2 for HPRS PDQ confirmed (Chapter 6 states HL7v2-based profiles were tested first).

---

# Part A. Programme data systems

## A1. DHIS2 / webDHIS (aggregate routine health information)

### A1.1 What it is and who owns it
- webDHIS is the NDoH's branded deployment of DHIS2 (open source, University of Oslo/HISP). The NDoH's 2026 technical overview says it holds "a non-exclusive license to use the DHIS software modules" and that the District Health Management Information System (DHMIS) Policy is the overarching policy, with SOPs. The Director-General holds ownership of the DHMIS (CSIR book, Chapter 7).
- Legal basis: National Health Act s74 (NDoH to facilitate and coordinate health information systems); DHMIS Policy 2011; NIDS (National Indicator Data Set).
- Operated by the NDoH Health Information Systems directorate with HISP South Africa (Health Information Systems Programme) as the technical support partner. The August 2026 document says that over the last 2 years HISP trained 46 experts in provinces and nationally on DHIS2 administration.
- Source: https://www.health.gov.za/wp-content/uploads/2026/08/NDOH-09-2026-26-Additional-Information.pdf (NDoH document "NDOH 09/2026-26 Additional Information", webDHIS (DHIS2) Technical Stack Overview). Confidence: confirmed.

### A1.2 Technical stack (from the NDoH document)
- Three tier architecture. Presentation: browser-based, HTML5/CSS/JavaScript. Application: Java-based DHIS2 stack, Web API, Apache Tomcat. Data: PostgreSQL storing metadata, transactional data, analytics tables, configuration and audit.
- Deployment model: "Centrally hosted and managed", multi-instance, "Physical, virtualised, cloud-hosted".
- Clients: DHIS2 Capture, Data Entry, Dashboards, Pivot Tables, Maps, Event and Tracker apps, DHIS2 Android Capture, custom apps. Browsers: Chrome, Edge, Firefox. Offline caching supported.
- Identity: role-based access, organisation-unit access control, integration with Active Directory, LDAP, SSO.
- Metadata: organisation units, data elements, indicators, data sets, category combinations, programmes, tracked entity types, validation rules. Changes follow NDoH governance "in line with approved National Indicator Data Set (NIDS)".
- Data domains: HIV/AIDS, TB, Maternal Child and Women's Health (MCWH), NCDs, Emergency Medical Services, disease and programme monitoring; both aggregate and Tracker (individual) records.
- Integration: DHIS2 REST Web API; formats JSON, CSV, XML, ADX, "FHIR-based payloads".
- DHIS2 version: "a stable production release"; exact version not stated. Staging names such as "zaidsr240", "ripda240", "pec240" and "fs240" suggest 2.40 trials (likely, inferred from instance names; not stated). Confidence: uncertain on version.

### A1.3 Instances and hosting (server inventory in the NDoH document)
The document lists virtual machines at the dhmis.org domain (domain `dhis.dhmis.org`; the host environment is not named, hosting provider uncertain). National instances:
- `za.dhis.dhmis.org` national webDHIS (32 GB RAM, 200 GB disk, 8 CPU, DB `za-nat-db-1` 128 GB RAM, 5,448 GB storage).
- Programme-specific instances: `nhc-portal` (National Health Council portal), `nqpr` (National Quality Performance Reporting/ quality of care, name inferred), `ripda` (Routine Immunisation/ data, name inferred, uncertain), `sarms`, `za-idsr` (Integrated Disease Surveillance and Response), `schoolhealth` (Integrated School Health Programme), `dd` (district dashboards, inferred), `art` (ART), `pec` (name inferred, uncertain).
- Provincial instances, one per province: ec, lp, gp, mp, nw, fs, wc, nc at `*.dhis.dhmis.org`; KwaZulu-Natal has its own larger cluster (three web servers 40/16/16 GB RAM, 500 GB disks, own DB server 192 GB RAM) at `kz.dhis.dhmis.org`.
- Non-production: staging, training and HISP "hispland" playground instances.
- Total: roughly 9 national programme instances, 9 provincial production instances, and about 15 staging/training instances. Counting is from the document and approximate.
- Confidence: confirmed (document is an official NDoH PDF dated August 2026); hosting provider uncertain.

### A1.4 Scale and quality metrics (NDoH document dashboard)
- Active DHIS2 users: 8,476 (stated figure); "increased by 58% since Sep 2019". Series (2019 to 2025): 41, 60, 76, 78, 86, 95, 97 labelled as "facility capturing (%)" in the extraction; the series labelling is ambiguous in the text extraction. Daily data capturing (%) series 38.7, 63.1, 73, 83.8, 86.8, 90.2, 94.9 (2019-2025). Data set timeliness 87.7, 91.6, 92, 92.3, 95 (2021-2025). Data entry timeliness 34, 40, 47, 48, 51, 53, 57 (2019-2025). Current DHIS2 records at NDoH: 493,205,144 (i.e. about 493 million).
- Confidence: likely for the numbers (extraction of chart text may mismatch labels).

### A1.5 History
- DHIS (v1.x) first used in the Western Cape, extended to the other provinces in 2001; a standalone system until the NDoH decided in 2017 to upgrade to DHIS2 (SAJIM article). MEval-SIFSA facilitated 53 workshops with 3,579 participants reviewing NIDS before the 2017 rollout. Source: https://sajim.co.za/index.php/sajim/article/view/1903/3042 ; https://www.measureevaluation.org/sifsa/data-quality
- NHI-linked: 2015 beta sites for HPRS and "Web DHIS" captured routine data daily, reducing reporting time "from 30 days to 24 hours" (CSIR book, Chapter 7).

### A1.6 Data flow
Facility register tick -> monthly totals on paper data input form (or HMS2/EMR output) -> captured in webDHIS at sub-district/district level by data capturers -> provincial instance -> national instance (via DHIS2 data exchange between instances; mechanism not documented). Data model: aggregate data elements by category combination against facility org unit (hierarchy: province, district, sub-district, health facility, reporting unit, "continually aligned with the Master Health Facility List"). Not held: patient-level clinical notes (although Tracker and event programmes exist).
- Fragmentation: Global Fund (Nov 2025) says HIV/TB data, TIER.Net, the DHIS, the Electronic Drug-Resistant TB Register (EDRWeb) and Notifiable Medical Conditions "are fragmented and not interoperable".

### A1.7 Tender context
- ITWeb listing of an NDoH tender for "hosting, maintenance, support and enhancement of the existing District Health Management Information System" for three years (dated 2023 by tender number; details uncertain). https://itweb.co.za/article/top-ict-tenders-health-dept-looks-to-essential-systems/4r1lyMR9DEL7pmda
- The August 2026 document is itself an "Additional Information" attachment to a bid numbered NDOH 09/2026-26 (title not retrievable from the PDF text). Confidence: confirmed that a 2026 NDoH bid on webDHIS exists; scope uncertain.

## A2. TIER.Net (Three Interlinked Electronic Register)

- What: the national electronic register for ART (HIV) patients, later extended with a TB module. Described as a non-networked electronic programme with data entered from paper clinical records and transferred periodically to a central database; feeds routine programme data into webDHIS. Since 2010 the primary facility-level monitoring system for patient-level HIV information (SAJHIVMED 2020).
- Origin: developed by the UCT Centre for Infectious Disease Epidemiology and Research (CIDER), with funding from PEPFAR/CDC and the Gates Foundation (the Nov 2014 UCT news item "UCT team's HIV monitoring software exported" supports UCT origin). Confidence: likely. The software owner/maintainer today: not established.
- Three tiers: paper (clinics under about 500 patients), standalone offline electronic register (500 to 2,000), networked EMR (over 2,000). As of 2017 the networked tier was still in pilot (PMC4005043). 
- Database engine and technology: not established. Prior knowledge says a Microsoft Windows desktop app with a Microsoft SQL Server Compact / Access-style local database, unverified here (uncertain). My search for the engine found nothing.
- Scale: AHIE notes state "Tier.Net (HIV system, offline) is used at about 4,000 clinics". Confidence: likely (meeting notes).
- Data fields (typical, prior knowledge): patient identifiers, demographics, dates of ART start, visits, regimen, CD4, viral load, TB screening/treatment, outcomes (transfer out, death, LTFU). Not held: general clinical notes.
- Data quality: studies document misreporting of outcomes (PMC7154050) and data-quality problems with referrals and lab results (medRxiv 2025.11.11.25340044, per base brief).
- Interfaces: planned move "from offline to semi-online" with national identifier (HPRN) and consolidated lab data; work with Jembi on OpenHIM/FHIR (AHIE notes). In the Western Cape, TIER.Net is a source for the Provincial Health Data Centre.
- Replacement: no official replacement date; the EMR/e-impilo is stated to be "complementary to the existing health system" and "links with existing core registries" (Global Fund). Not established whether TIER.Net is to be retired. Confidence: uncertain.
- Sources: https://pmc.ncbi.nlm.nih.gov/articles/PMC7059247 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC4005043 ; https://wiki.ohie.org/x/aQDeAQ ; https://news.uct.ac.za/article/-2014-09-22-uct-teams-hiv-monitoring-software-exported

## A3. TB registers (ETR.Net, EDRWeb) and HIV/TB reporting lines

- ETR.Net: electronic TB register (drug-susceptible) developed for the NDoH (prior knowledge; not re-verified). With the TIER.Net TB module integrating TB data into one database, ETR.Net is partly superseded (PMC7059247 describes the TB module intended to replace paper TB registers).
- EDRWeb: web-based Electronic Drug-Resistant TB Register run by the NICD/NHLS-affiliated team and the NDoH; used in the Western Cape PHDC as a source (base brief). Global Fund (2025) names it as one of the fragmented systems.
- Three Interlinked / "Three Interlinked Electronic Register" is the TIER.Net name; programme reporting also goes through DHIS2 (ART data set).
- DATIM (PEPFAR): Data for Accountability, Transparency and Impact; a DHIS2-based system run by PEPFAR for donor reporting by implementing partners. Not examined here in depth; South Africa PEPFAR reporting uses DATIM (prior knowledge, likely).
- NHLS CDW feeds TB and HIV laboratory data (see B3).
- Gaps: no authoritative 2025/26 source about numbers of ETR.Net sites; no source about EDRWeb hosting.

## A4. Immunisation: EPI-SA and EVDS

- EPI-SA: the Expanded Programme on Immunisation (routine childhood vaccination). Immunisation status is recorded on the Road to Health Book/Booklet and registers; coverage data come from DHIS2. A digital routine-immunisation register: not established in sources. Confidence: uncertain.
- EVDS (Electronic Vaccination Data System): NDoH-owned national platform for COVID-19 vaccination. Built with Mezzanine Ware and the CSIR (CSIR also ran penetration tests). Launched February 2021 (self-registration; more than 34,000 healthcare workers registered at launch; public portal opened April 2021 for people 60+). Used for registration, scheduling, proof-of-vaccination certificates, and feeding the NDoH analytics platform. March 2022: government stated intent to keep the database long-term and possibly as base for wider public health management (BusinessTech). Mezzanine wiki: "Stock Visibility Solution" is a related Mezzanine product. Sources: https://www.engineeringnews.co.za/article/govt-launches-electronic-vaccine-data-system-ahead-of-vaccine-roll-out-2021-02-03 ; https://businesstech.co.za/news/technology/570912/government-to-keep-covid-database-going-permanently-with-plans-to-expand-it/ ; https://www.sanews.gov.za/node/74470 (CSIR says EVDS contributed). Confidence: confirmed on launch and ownership; current use as a routine immunisation platform not found.
- The CSIR book reproduces EVDS operating procedures: sites need a computer and connectivity; a paper fallback is permitted with district-level capture.
- Go.Data (WHO outbreak tool): the Free State used it for COVID case-based surveillance; by 31 March 2022 it had reported 207,829 cases with 30,394 admissions; other provinces followed (CSIR book, Chapter 13). Confidence: confirmed.

## A5. MomConnect

- NDoH flagship mobile health programme; free text messages and helpdesk for pregnant women and mothers registering at public facilities; the platform uses OpenHIM for integration (Jembi profile). Praekelt Foundation is the technology partner (prior knowledge; not confirmed in my results).
- Scale: Gauteng government notice (22 September 2024): "over 5 million registered users and 288,051 monthly active users". Earlier: 1,159,431 women registered August 2014 to April 2017 (about half of first antenatal visits). Source: https://www.gauteng.gov.za/News/NewsDetails/%7B931b2341-7b35-4684-8527-340ff8b5df26%7D
- Data held: phone number, pregnancy/baby due date, language, facility of registration, helpdesk queries. Not held: clinical records. Confidence: confirmed for scale; vendor uncertain.

## A6. Maternal and child records and audit programmes

- Maternity Case Record (MCR): national patient-held paper record for antenatal, labour and postnatal care; must accompany the woman (base brief). Not digitised nationally.
- Road to Health Booklet: patient-held child record since 2011 (base brief).
- PPIP (Perinatal Problem Identification Programme): developed in the 1990s by the MRC Unit for Maternal and Infant Health Care Strategies; used in public hospitals; software installed locally (PPIP v3.0.4 with installer, service pack, manual) and data submitted to a national database at the MRC unit in Pretoria; 588 sites, 73% of deliveries captured by the DHIS. Child PIP (Child Healthcare Problem Identification Programme) is the paediatric equivalent hosted by the University of Pretoria Centre for Maternal, Fetal, Newborn and Child Healthcare; version 4 is a software installation. No browser-based submission documented. Private institutions do not submit. Sources: https://link.springer.com/article/10.1186/1472-6963-11-243 ; https://www.up.ac.za/centre-for-maternal-fetal-newborn-and-child-healthcare/article/2868032/child-pip-data-collection . Confidence: likely (dated sources).
- Related national mortality reviews (Saving Mothers reports via NCCEMD) not researched in depth.

## A7. National Cancer Registry (NCR)

- Pathology-based registry run by the NHLS National Cancer Registry (NHLS under NICD reporting line per search summary). Reporting voluntary until 2011; National Health Act regulations made cancer notifiable from 2011. Clinically or radiologically diagnosed cancers are not counted, so it undercounts. CANSA says the 2024 NCR report is the latest publicly available; Stats SA published a separate report (2008-2019) combining NCR and mortality data reporting just over 85,000 diagnoses in 2019. Sources: https://cansa.org.za/south-african-cancer-statistics/ ; https://spotlightnsp.co.za/2023/05/24/new-report-paints-grim-but-incomplete-picture-of-cancer-in-sa/ . Confidence: likely; report-publication detail uncertain.

## A8. Mortality: BI-1663 and death notification

- BI-1663 (also DHA-1663): paper "Notice of Death/Stillbirth" completed by a medical practitioner (cause of death) and the informant, submitted to Home Affairs, which issues the death certificate; Stats SA receives records for cause-of-death statistics (Stats SA metadata folder hosts the form). No South African electronic version found in searches (only a Namibian e-death-notification news item). Home Affairs/Stats SA relation: death registration data flow from DHA to Stats SA (prior knowledge). Source: https://isibaloweb.statssa.gov.za/metadata/COD/2021/BI-1663%20form.pdf . Confidence: confirmed for paper form; electronic status "not found".
- Births: notice of birth (DHA-24) separate; not researched here.

## A9. CCMDD, SVS, RxSolution, and medicine data

- CCMDD programme: see Gap 3. Run by NDoH; patients are nominated at clinic, prescriptions are sent to a contracted dispensing pharmacy, parcels are dispatched to the clinic or an external pick-up point; patients collect with an SMS code. The system: SyNCH (Synchronised National Communication in Health) — web platform used for CCMDD workflow and patient SMS (Columbia 2019; 2026 EMR tender). Confidence: likely.
- Stock Visibility System (SVS): a web and mobile tool (Mezzanine Ware per the Mezzanine wiki "Stock Visibility Solution", and GHSC-PSM technical brief) used at PHC clinics to report stock levels; "both SVS and RxSolution feed data into the National Surveillance Center" (search summary). Running since 2013 (base brief). Source: https://www.ghsupplychain.org/stock-visibility-system-technical-brief ; https://mezzaninewiki.atlassian.net/wiki/spaces/ES/pages/3968152/Stock+Visibility+Solution . Confidence: likely.
- RxSolution: electronic stock-management system developed by Management Sciences for Health (MSH): inventory, purchase orders, stock issues to facilities, dispensing. https://msh.org/resources/rxsolution/ . Confidence: confirmed.
- National Treasury 2025 Budget: NDoH to fund a patient information system, a centralised chronic medicine dispensing system and a facility medicine stock surveillance system (BusinessTech/Daily Investor reporting; Treasury documents not read). Confidence: likely.
- "Medsas", "Medicines Availability" as a named national system: not found (see Unanswered).

## A10. Pharmacy and product reference data

- NAPPI (National Pharmaceutical Product Index): owned by MediKredit Integrated Healthcare Solutions, which is "the only organisation that can assign NAPPI codes", fee-based; a public-domain file is on the MediKredit website updated daily. Used by private-sector claims (MEDCLM/PHISC) and pharmacy systems. Source: https://en.wikipedia.org/wiki/National_Pharmaceutical_Product_Index and Discovery PBM communique PDFs. Confidence: confirmed.
- Database of Medicine Prices: NDoH Single Exit Price reference database listing registered medicines except Schedule 7; discontinued products remain listed while registered with SAHPRA. Source: https://open.africa/dataset/south-africa-medicine-prices . Confidence: confirmed.
- NRPL (National Reference Price List) and the "Master Health Product List": not retrievable in this session (see Unanswered).
- SAHPRA registration data: no verified data-model description found.
- e-prescribing: the CSIR book Chapter 5 is a literature review proposing groundwork for a national implementation; no national e-prescription service is live. Confidence: confirmed that the chapter is literature-based.

---

# Part B. Laboratory: NHLS and NICD

## B1. NHLS LIS (TrakCare Lab)

- What: NHLS runs a centralised laboratory information system built on InterSystems TrakCare Lab (LabTrak lineage). Results are delivered electronically through TrakCare WebView ("TrakCarewebview", UCT thesis). Source: https://open.uct.ac.za/bitstreams/9d5a7cbc-0621-42da-92be-69c29766c511/download
- Lab count: base brief says ~265; Daily Maverick (March 2026) says "over 300 laboratories"; the AHIE notes said "over 290 pathology labs". Counts differ by source and definition. Confidence: uncertain.
- Operator: National Health Laboratory Service (statutory body under NHLS Act 37 of 2000), head office in Sandringham, Johannesburg; sole provider of diagnostic pathology to more than 80% of the population (Daily Maverick).
- Test volumes: ~110.6 million tests in 2022/23 (base brief; NHLS Annual Report 2023/24).
- Result channels: WebView (web), SMS printers (limited HIV/TB set), direct hospital system integration (HMS2 reports ~27 million NHLS results integrated; Eastern Cape), the Western Cape PHDC feed via an FTP file from the data warehouse (AHIE notes) and "TrakCare results viewer URL embedded in the patient registration UI" explored.
- Database/hosting: servers holding patient results at the head office; NHLS said "erratic power supply" in Sandringham (March 2026). Hosting model otherwise undisclosed. Oracle ERP environment is separate (2024 incident statements).
- HL7 v2: no NHLS interface specification is public. TrakCare supports HL7 (vendor generic; prior knowledge). Confidence: uncertain for the NHLS configuration.

## B2. Outages and incidents

### B2.1 June 2024 ransomware
- Sequence: access on 21/22 June 2024 via a phishing link; NHLS announced on 25-26 June; IT systems shut down 24 June 2024. BlackSuit ransomware gang claimed responsibility (no source ties LockBit to this incident). NHLS said the ransom was not paid.
- Impact: NHLS computers/servers encrypted, "complete breakdown of all IT-related operations, including internet, intranet and TrakCare LIS" (SAMJ). NHLS initially said the TrakCare database and the CDW were not affected, but later reporting says results could not be viewed by requesting doctors, the data warehouse was rendered unusable, and decades of archived results were inaccessible. Oracle ERP was spared. A report claimed 6.3 million blood tests were unprocessed. In March 2025 NHLS management said it was only about nine months later that pre-attack volumes were restored.
- Parliamentary/regulator: Information Regulator demanded details (Daily Maverick 23 March 2025).
- Sources: https://www.dailymaverick.co.za/article/2025-03-22-cyber-hack-attack-how-one-click-on-an-email-link-paralysed-sas-national-health-laboratory-service ; https://www.scielo.org.za/pdf/samj/v114n12/06.pdf ; https://www.sanews.gov.za/index.ph%70/node/69420 . Confidence: confirmed on key facts; uncertain on the exact count of unprocessed tests.

### B2.2 March 2026 TrakCare outage
- Began about 21:00 on Monday 16 March 2026, restored early Wednesday 18 March (roughly 30 hours). Cause: power problems at head office in Sandringham where the servers sit; "not a cyberattack". No UPS/backup evident per Prof. Ntusi's remark. Effects: TrakCare unavailable nationally, specimen registration hit, emergency services worst affected, staff reported no formal communication. Source: https://www.dailymaverick.co.za/article/national-health-laboratory-service-system-out-of-action-causing-massive-disruptions-to-health-facilities- . Confidence: confirmed (single outlet).

## B3. NHLS Corporate Data Warehouse (CDW)

- What: a data warehouse of laboratory records "for 80% of the population" accessible from the NHLS CDW (Wits thesis); used for resource planning, M&E, HIV and TB cascade reporting, and provincial feeds. The AHIE notes state the WC PHDC receives data as an FTP file from the warehouse.
- Technology/vendor: not established. 2024 attack: data warehouse affected (see B2.1).
- Source: https://wiredspace.wits.ac.za/items/80d1d7ca-1915-468e-9a73-62bf68bba879 . Confidence: likely.

## B4. NICD surveillance: NMC system, GERMS-SA

- Notifiable Medical Conditions Surveillance System (NMCSS): electronic system introduced 2017/2018; NMC Regulations 2017 under the National Health Act and IHR. Web portal and mobile app (Android, iOS "NMC Reporting"); users register and are authorised; paper form fallback. Category 1 conditions must be reported within 24 hours; categories 2-3 within 7 days; category 4 within a month (NICD June 2026 presentation). January 2023: new features, classification by predefined case definitions. A 2025 SAMJ article revised case definitions for pesticide, lead and mercury poisoning. Studies identified low app utilisation due to inadequate knowledge (North West, 2023). Sources: https://african.business/2023/06/apo-newsfeed/south-africa-introducing-exciting-new-notifiable-medical-conditions-nmc-reporting-app-features ; https://knowledgehub.health.gov.za/system/files/elibdownloads/2020-07/NMC_COVID-19-Notification-SOP_7May2020.pdf ; https://apps.apple.com/za/app/nmc-reporting/id1576336912 . Confidence: confirmed.
- GERMS-SA: NICD laboratory-based surveillance network for invasive bacterial pathogens (prior knowledge; not re-fetched). Confidence: likely.
- NICD is a division of the NHLS; Sandringham campus (prior knowledge).
- Interfaces: NMC data not interoperable with DHIS2/TIER.Net (Global Fund, Nov 2025).

---

# Part C. Standards and interoperability

## C1. HNSF
- Health Normative Standards Framework for Interoperability in eHealth: first gazetted 2014 (NDoH), revised 2021 (CSIR book refers to "HNSF (NDoH, 2021)"). Specifies HL7 and IHE profiles. HL7 v2-based profiles were implemented first, later FHIR. Localised IHE profiles: PDQ (HL7 v2 and FHIR), ATNA, CT; the CSIR built a conformity-assessment lab on IHE Gazelle (Test Manager, EVS Client, Proxy) with a HAPI FHIR client as test client and an "HPRS PDS". Three external systems (Free State, Gauteng, KZN) passed and were approved to integrate with HPRS; each got a report; testing used no real patient data. CSIR plans connectathons/projectathons with an open call. Source: CSIR/NDoH book Chapter 6. Confidence: confirmed.
- HPRS provides "Patient Registry and Master Patient Index services", generates a "globally unique Patient Record Number (PRN)", and patient information systems must query HPRS using the HNSF interface and store the PRN. A PIX feed idea appears in the text. Confidence: confirmed.

## C2. Terminologies
- SNOMED CT: South Africa became a SNOMED International member (14 May 2026; lead Milani Wolmarans, NDoH). Followed a 2024 announcement to introduce new terminological systems and classifications. Licence terms not stated.
- ICD-10: used in private claims (PHISC MEDCLM); ICD-10 Master Industry Table (MIT) maintained in the private claims ecosystem (prior knowledge, likely).
- LOINC: no source found for a national LOINC mapping; NHLS test catalogue coding: not established.
- NAPPI: see A10.

## C3. Digital Health Strategy
- National Digital Health Strategy for South Africa 2019-2024: vision "better health for all South Africans enabled by digital health", builds on the eHealth Strategy 2012-2016. Global Fund (Nov 2025) says a forthcoming Digital Health Strategy 2025-2029 "will extend to the full implementation of the electronic medical record system called e-impilo". A regional tracker called the 2019-2024 strategy expired. The May 2026 tender still cites the 2019-2024 strategy. Publication of a successor: not found. Confidence: uncertain.
- Hospital digital landscape per PMG NW2014 (28 May 2026): EC 43 hospitals HMS2; FS 19 HMS2 and 2 Meditech; GP 37 SAP HIS; KZN 42 eHealth; WC 53 Clinicom. Changes since August 2025: EC 44 to 43; FS from 16 HMS2 and 3 Meditech to 19 HMS2 and 2 Meditech. Source: https://pmg.org.za/committee-question/37900/

## C4. HIE and the African Health Information Exchange project
- Funder: Gates Foundation (project 18 months within a 3-year effort). Partners: CIDER at UCT, Jembi, NHLS, NDoH, provinces. Aim: single patient viewer plus cascade reports updated daily; about 3,000 sites plus 360 in the Western Cape; planned phases for lab data to PHDC (Phase I data push; IIa request via OpenHIM; IIb push per patient/episode; III prototype LMIS to provincial lab repository). Source: https://wiki.ohie.org/x/aQDeAQ . Notes are informal, undated (circa 2019-2021). Confidence: uncertain.
- Jembi Health Systems: South African non-profit; maintains OpenHIM (open-source mediator); Instant OpenHIE; FHIR mediators with HAPI FHIR (Jembi 2021 deck).

## C5. openEHR
- No SA public-sector openEHR deployment found. Confidence: not found.

---

# Part D. NHI information systems

## D1. HPRS (Health Patient Registration System)
- Contracted to the CSIR in July 2013; started June 2015 (base brief); deployed at 1,500 PHC facilities under the "Positive Infusion Strategy" (Wolmarans and Rousseau, CSIR book Chapter 7); beta facilities in 2015 (five per province, e.g. 44,196 and 39,533 patients by 31 March 2015). 2025 totals from the NDoH publication: more than 68 million registered, about 32.5 million verified with Home Affairs (base brief). Global Fund: uses biometric verification against the Home Affairs fingerprint database. Hardware: barcode scanning (ID book and driver's licence), biometric reader. Chapter 7 frames HPRS as part of the National Health Insurance Information System (NHI-IS). HMS2 adopted the HPRN/PRN inside hospitals. Confidence: confirmed.

## D2. National EMR (e-impilo) timeline and architecture
- Bespoke NDoH-developed EMR: "enables the capturing of data during clinical encounters"; to be "integrated and interoperable with ... HPRS, laboratory information system, SyNCH, MHFL" (tender document). Target facilities: fixed PHC clinics, CHCs and CDCs. Facility counts per province in tender: EC 779 (736 clinics+43 CHCs), FS 216, GP 372, KZN 608, LP 476, MP 289, NC 161, NW 312 (total 3,083). Estimated timelines per province: EC 14 months, FS 4, GP 6, KZN 10, LP 6, MP 4, NC 8, NW 6. Scope: toolkit onboarding training, implementation, project management, hardware, configuration, testing, go-live, master trainer programme, tiered support, change management.
- Vendor/software stack of the EMR: not disclosed in the public tender summary. Database engine: unknown.
- Beta counts differ by source and date: 36 + 1 GP (Mar 2025); 55 (Global Fund, Nov 2025); 85 across five provinces (May 2026). Confidence: confirmed per source.

## D3. NHI Act legal status
- Act 20 of 2023 signed 15 May 2024. February 2026: President undertook not to promulgate provisions before judgment; litigation among other courts halted. ConCourt hearing 5-7 May 2026, judgment reserved (EWN 7 May 2026). Separate ConCourt judgment (reported 19 May 2026) declared sections 36 to 40 of the National Health Act (certificate of need) unconstitutional; the department said it "is not a judgment relating to the National Health Insurance (NHI) Act". Sources: https://ewn.co.za/2026/05/07/concourt-reserves-judgment-in-nhi-challenge ; https://www.citizen.co.za/news/health-department-and-parliament-push-back-on-nhi-speculation-after-concourt-ruling/ . Competition Commission: Health Market Inquiry final report 2019 (prior knowledge). Confidence: confirmed.

## D4. Funding indicators
- Reply NW1901: Patient Information Systems conditional grant R112 million (2024/25); estimated EMR ecosystem about R1 billion over five years plus R800 million for facility implementation (PMG, search summary). 2025 budget: R1.4 billion for NHI mentioned in press; National Treasury indicates indirect grant spending (BusinessTech). Sources: https://pmg.org.za/committee-question/27410/ ; https://pmg.org.za/committee-question/27297/ . Confidence: likely; figures from search summaries and not re-read.

## D5. NHI Act s40 text
- "(1) The Fund must establish an information platform to enable it to make informed decisions on population health needs assessment, financing, purchasing, patient registration, service provider contracting and reimbursement." s40(6)(b): support portability and continuity of care. Source: PMG deliberations https://pmg.org.za/committee-meeting/35562/ . Confidence: confirmed.

---

## Unanswered / could not find
- Database engine and version of TIER.Net; present maintainer; any retirement date.
- DHIS2 version number in production; hosting provider for `dhmis.org` instances.
- NHLS HL7 message specifications; test catalogue size; LOINC coding; TrakCare version.
- NHLS 2024/25 annual report figures (tests, labs).
- Any documented OpenHIM instance in a non-Western Cape province.
- Awarded bidders for NDOH 11-2026/2027; the software vendor of the EMR; budget for the tender.
- Whether a Digital Health Strategy 2025-2029 has been published.
- Constitutional Court judgment on NHI public participation (none found up to the date of search).
- Medsas, NRPL, Master Health Product List details; SAHPRA data model.
- Electronic BI-1663; current Stats SA cause-of-death pipeline.
- MomConnect 2025/26 numbers and vendor confirmation.
- EDRWeb and ETR.Net current sites and hosting; DATIM details.
- Child PIP/PPIP current web status.
- NHI Fund (entity) procurement notices.


---

# PART D: PRIVATE SECTOR, MEDICAL SCHEMES, CLAIMS AND PHARMACY

*Source file: research/phase_D_private_sector_claims.md (258 lines)*

## Round 6 gap findings

Scope note: research date 31 Oct 2026. Evidence base is web search plus page fetches done in this session; many vendor pages are marketing text (self-reported). Confidence tags: confirmed (primary or multiple consistent sources), likely (single reputable source or strong inference), uncertain (vendor claim, secondary, or recalled background not re-verified this session).

### Gap 1. Documented HL7/FHIR or API integrations between private systems and public systems

**Finding 1a. No documented live technical link between a private hospital-group record (Netcare CareOn, Mediclinic, Life) and any public-sector system (NHLS TrakCare, HPRS, provincial systems) was found.** Netcare's own descriptions of CareOn mention integration with Apple devices, Deutsche Telekom Clinical Solutions, IBM Micromedex, Capsule Technologies (bedside device integration), ICU/theatre devices and ordering to pathology, radiology and the blood bank, but never a public-sector interface.
- Source: https://netcare.co.za/NewsHub/Articles/pioneering-electronic-medical-record-system-a-game-changer-for-hospital (2 June 2022)
- Confidence: confirmed that none is documented; absence is not proof none exists.
- Effect: the "how a doctor gets history today" chain in RESEARCH.md section 10 stays correct: private and public record systems are separate islands.

**Finding 1b. CareConnect (private-sector health information exchange, live April 2022) is the only cross-organisation private-sector exchange. It is private-only today. Talks with the National Department of Health about linking to government systems (the electronic vaccination data system, EVDS, and the patient registration system, HPRS) are reported but no go-live is documented.**
- Source: Medical Brief 1 Nov 2023 https://www.medicalbrief.co.za/?p=171562 ("Currently operates only in the private hospital sector"; "Discussions are ongoing with the national Health Department about linking CareConnect to government systems, such as the electronic vaccination data system and the patient registration system"). Also BusinessReport 29 Oct 2023 "CareConnect HIE hub hopes to be part of NHI" https://businessreport.co.za/personal-finance/medical-cover/2023-10-29-careconnect-hie-hub-hopes-to-be-part-of-nhi/
- Confidence: confirmed for the statement as of late 2023; status in 2026 uncertain (no newer source found).
- Effect: adds a private-sector exchange layer that the base research did not mention at all (see CareConnect section).

**Finding 1c. The vendor technology behind CareConnect is InterSystems HealthShare (Unified Care Record plus Patient Index). InterSystems is also the vendor behind public-sector TrakCare (NHLS, Mediclinic Middle East), so a shared vendor stack exists, but no source documents a technical bridge.** Standards used by CareConnect (HL7 v2, FHIR, IHE XDS, CDA) were not stated in any source found; the Altron HealthTech press release (3 Dec 2024) says "interoperability" only.
- Source: https://www.intelligentcio.com/africa/2020/02/11/africas-first-private-healthcare-information-exchange-set-to-drive-health-revolution ; https://healthtech.altron.com/press-releases/collaborative-information-sharing-with-altron-healthtech-and-careconnect
- Confidence: confirmed (vendor); uncertain (standards).

**Finding 1d. Government policy framework for public-private data sharing exists on paper.** BusinessTech (Oct 2022) reports a national framework for digital systems under NHI in which the private sector "will need to share data with the national registry". A Cape Times item (5 Aug 2024) states that in the NHI "CUPs" (contracting units for primary healthcare) providers in both public and private sector will use the national digital Health Patient Registration System (HPRS). The Department is reported to be building NHI digital platforms with the CSIR (SABC) and AWS (ITWeb).
- Sources: https://businesstech.co.za/news/government/636899/government-targets-private-healthcare-medical-data-as-it-lays-more-groundwork-for-nhi/ ; https://www.sabcnews.com/sabcnews/health-department-csir-to-develop-digital-platforms-to-run-nhi/
- Confidence: likely (secondary press); API specification not found.

**Finding 1e. Bluebird (Intelligent Medical Systems) is the one documented lab-results routing service that spans both sectors.** IMS states it connected "the majority of South African labs to doctors during the mid nineties", that the National Department of Health contracted it during COVID-19 (it says it set up and connected more than 500 public hospitals, and handled over 400,000 results in one day at first-wave peak), and Lenmed (private) says Bluebird operates at more than 60 hospitals in both private and public sectors and integrates with Lenmed's SAP hospital information system. Pricing claim: sending lab billed R5.92 excl VAT per lab report to doctors (2023), no fee to hospitals.
- Sources: https://intelms.squarespace.com (Bluebird Health Platform, page content seen via search snippets; direct deep links returned 404 on fetch); https://www.lenmed.co.za/lenmed-works-to-mitigate-infection-risk-in-its-hospitals-with-bluebird/
- Confidence: uncertain (vendor self-report; not independently verified). Mechanism ("one API for all results") not described technically.

### Gap 2. Electronic data exchange between private labs and hospitals

**Finding 2a. Documented mechanisms are portals, apps, desktop download tools and a results-routing broker; no source found documents HL7 v2 (ORU) or FHIR interfaces by name for Ampath, Lancet or PathCare.**
- Ampath: doctor mobile app "Ampath Pro Plus" lets HPCSA-registered practitioners "securely order and review pathology tests and results", with "Hospital & Ward search to streamline electronic ordering workflows"; a desktop tool "Ampath Manager" downloads results into a local database. Source: https://www2.ampath.co.za/medical-practitioners/lab-results-for-doctors ; https://apps.apple.com/mx/app/ampath-pro-plus/id6504678254. Confidence: confirmed (features); HL7 not documented.
- Lancet Laboratories: chose Netlims LabOS to replace its laboratory information system, to be implemented across "more than 500 service centres and 150 laboratories and hospitals" (announced Dec 2018). Source: https://www.intelligentcio.com/africa/2018/12/17/lancet-laboratories-chooses-netlims-labos-product-to-replace-its-lis/ . Confidence: likely (announcement; current deployment status unconfirmed).
- PathCare: no LIS vendor or interface found (base research notes PathProvider 3 portal).
- Netcare CareOn orders to, and receives results from, pathology, radiology and blood bank electronically (Netcare 2022) but the pathology partner interface technology is not described.
- Effect: the private lab to hospital link is real and electronic inside groups but its standard is undocumented publicly; Bluebird is the only named cross-lab broker.

**Finding 2b. Discovery HealthID is fed by pathology laboratories as well as claims data** (press release 9 July 2012: "clinical information derived from claims data and pathology laboratories"). This is a funder-side lab feed, not a hospital feed.
- Source: https://www.mynewsdesk.com/za/discovery-holdings-ltd/pressreleases/discovery-health-launches-healthid-a-revolution-in-electronic-health-records-in-sa-779062 . Confidence: confirmed.

**Finding 2c. CareConnect plans to onboard pathologists "in future" and is in talks with the Radiological Society of SA (2023)**, so lab-to-hospital exchange via the HIE was not live for labs as of the latest source. Source: Medical Brief 1 Nov 2023. Confidence: confirmed for 2023.

### Other corrections or additions to RESEARCH.md found while working
- RESEARCH.md says 71 schemes (16 open, 55 restricted) and 33 administrators for 2024/25. A search snippet of the CMS 2025/26 annual report (https://static.pmg.org.za/CMS_2025-26_AR.pdf, file too large to fetch) lists 9.17 million beneficiaries, 70 schemes and 36 administrators. The CMS Industry Report 2024 coverage says 70 schemes with 4.11 million principal members and 9.04 million beneficiaries at end 2024 (excluding Sizwe Hosmed). Treat 70 vs 71 schemes and 33 vs 36 administrators as period-dependent; confidence uncertain.
- RESEARCH.md says Mediclinic and Life systems unverified. This work: Mediclinic Southern Africa publicly named Hitachi Clinical Repository (2015) as the base of a central electronic patient record; and Mediclinic currently runs an active "EHR project" per recruitment postings (vendor not named; closing date 16 Jan 2026 on one posting). Life Healthcare: no vendor identified; FY2025 results say the group "initiated the digitization of the patient journey" and a new digital strategy was announced (Business Day 27 Nov 2025). Details below.
- The brief's phrase "Life Healthcare breach 2021" is wrong on date: the Life Healthcare cyber attack was June 2020 (admissions systems, business processing and email servers hit; restored by July/August 2020). See data protection section.
- NAPPI ownership: the brief suggested "Medical Data Systems"; every source found names MediKredit Integrated Healthcare Solutions as owner/assigner of NAPPI codes (Discovery's own 2023 NAPPI registration guide). See pharmacy section.

---

## 1. Private-sector size and structure

### 1.1 What could and could not be established
- National private hospital and bed totals, GP and specialist counts were not retrievable from a primary source this session. The Competition Commission Health Market Inquiry (HMI) final report (Sept 2019) is the standard reference (private hospitals about 3 groups holding roughly 80-90% of beds; Netcare, Mediclinic and Life together) but the report was not re-fetched. Treat all HMI-derived numbers in this file as recalled background, confidence uncertain.
- Group-level 2025 facts that were verified in this session are given below.

### 1.2 Netcare
- What: largest private hospital group in South Africa by beds. JSE-listed (NTC).
- Scale: a financial data aggregator lists 49 acute hospitals with 9,827 beds plus 14 mental health hospitals with 1,007 beds (undated); Netcare's FY2023 results presentation listed 49 acute hospitals with 9,903 beds. Planned mental health additions: Netcare Akeso Polokwane (87 beds, commissioning March 2026) and Akeso Montana (88 beds, October 2026). 2026 outlook cites conversion of 36 existing beds and 53 new beds at established acute facilities.
- Sources: https://www.roic.ai/quote/NWKHY ; https://www.netcare.co.za/portals/0/Investor%20Relations/Financial%20Results/2023%20-%20Annual%20Results/Netcare-Presentation.pdf ; https://www.businessday.co.za/companies/company-strategy/2026-03-24-improving-sa-macroeconomic-conditions-boost-netcares-operations/
- Confidence: likely (aggregator plus company presentation).
- Other: Netcare 911 (private ambulance), primary care, occupational health, renal dialysis, mental health, rehabilitation (Netcare 2022 article lists CareOn rollout planned across these).

### 1.3 Life Healthcare
- Scale (FY2025 results coverage): 42 acute hospitals plus renal dialysis, mental health, rehabilitation and nuclear medicine; revenue up 6.0% to R25.1 billion; occupancy 69.7%.
- Source: https://quartr.com/events/life-healthcare-group-holdings-limited-lhc-h2-2025_F9mo6wqN ; https://www.businessday.co.za/companies/2025-11-27-life-healthcare-says-technology-wont-replace-nurses-at-the-bedside
- Confidence: likely.

### 1.4 Mediclinic Southern Africa
- 2015 Hitachi announcement: "more than 50 Mediclinic locations" to be unified in a single repository (includes hospitals and day clinics). Mediclinic Southern Africa operates hospitals in South Africa and Namibia. Group taken private in 2023 (recalled background; not re-verified). Confidence: uncertain on current counts.

### 1.5 Other groups
- NHN (Network Healthcare Holdings), Lenmed, Busamed, Clinix, Afrocentric-owned Intercare etc. exist; no figures were retrieved this session. Lenmed is documented as a Bluebird customer with an SAP hospital information system (see section 3.4). Confidence on size: not established.

### 1.6 GP and specialist practice base
- GoodX claims 35+ years of operation (founded 1985, Pretoria, Cape Town office per a third-party profile). Altron HealthTech says over 8,000 healthcare practices use its SwitchOn switch. Healthbridge describes itself as "South Africa's largest medical transaction switch" (launched 1999). MediKredit's HealthNet ST ~9,000 providers (base research). No independent market share exists in the sources found. Confidence: vendor claims only (uncertain).

---

## 2. Medical schemes, administrators and the regulator

### 2.1 Council for Medical Schemes (CMS)
- What: statutory regulator under the Medical Schemes Act 131 of 1998. Publishes annual reports and an annual Industry Report with scheme-level financial and claims data.
- 2025/26 annual report (as indexed): 9.17 million beneficiaries, 70 schemes, 36 administrators. CMS 2024 industry data (via Moonstone summary): 70 schemes at end 2024, 4.11 million principal members, 9.04 million beneficiaries (excluding Sizwe Hosmed); risk claims ratio 96.2% in 2024 (95.8% 2023); open schemes 91.9%, restricted schemes 101.3%; prescribed minimum benefit (PMB) expenditure R135.7 billion in 2024 (R124.4 billion in 2023) = 52.3% of benefits; industry operating deficit R11.64 billion in 2024 (R10.20 billion in 2023).
- Sources: https://static.pmg.org.za/CMS_2025-26_AR.pdf ; https://www.moonstone.co.za/medical-schemes-face-structural-strain-as-claims-growth-outpaces-contributions/
- Confidence: likely (secondary summaries of CMS reports; PDF exceeded fetch limit of 10 MB).
- Data model details of CMS submissions (annual statutory returns, quarterly returns, claims data) were not retrievable; see Unanswered.

### 2.2 Prescribed minimum benefits (PMBs)
- Regulation 8 under the Medical Schemes Act: Diagnosis and Treatment Pairs (DTPs) plus 26 chronic conditions (CDL). Recalled background; not re-verified this session. PMB spending figure above is verified via CMS report coverage. Confidence: confirmed for spending, uncertain for DTP specifics.

### 2.3 Risk equalisation
- Risk Equalisation Fund (REF) is provided for in the Act but has not been implemented; the Competition Commission HMI recommended mandatory risk equalisation. Status late 2026 not established this session. Confidence: uncertain.

### 2.4 Scheme administrators

#### Discovery Health (Pty) Ltd
- Largest administrator. The Discovery Health Medical Scheme (DHMS) outsources "administration and managed care functions to Discovery Health (Pty) Ltd through a formal contractual arrangement" (DHMS Integrated Report 2025).
- 2025 figures: claims paid 88.4% of contributions (89.7% in 2024); administration and managed care expenses 9.9% in both years; administrator says R2.10 value per R1 fee; 348,812 virtual consultations; claims volume conflicting between sources (55.8 million claims vs approx 64 million claims for R89.4 billion). Personal Health Pathways AI for 2.1 million adult members; DrConnect platform with HealthTap. DHMS disclosed claim-processing errors (intramuscular injection and dental claims, corrected) and a CMS-flagged administration error that told 16,507 members they owed money.
- Sources: https://d16pi0tqkfzkv3.cloudfront.net/assets/discoverycoza/corporate/investor-relations/2025/dhms-integrated-report-2025.pdf ; https://www.dailymaverick.co.za/article/regulator-probe-public-uproar-spare-16506507-discovery-health-members-from-r125m
- Confidence: likely.
- Technology: Discovery builds in-house (claims engine, HealthID, Vitality). Specific database engine and vendor stack not found. Confidence: not established.

#### Medscheme (AfroCentric Group, since 2024 held by Sanlam)
- Claims decision engine: FICO Blaze Advisor running in a cloud-native framework (Kubernetes, Docker, Spring Boot); about 400,000 claim lines per day; Hazelcast caching of infrequently changing clinical data; active-active multi data-centre; 99.9% uptime; 15% reduction in claim interventions over six months; won 2018 FICO Decisions Award. Three phases: adjudication, pricing, benefits. The decision engine connects to Medscheme's core administration system. Sources: https://marketplace.fico.com/blogs/digital-transformation-inside-medscheme-s-decision-platform ; https://www.casestudies.com/company/fico/case-study/medscheme-overhauls-its-claims-system-to-deliver-better-strategies . Confidence: confirmed (vendor case study; ownership claim from Sanlam recalled and uncertain).
- Fraud analytics: reported 13 forensic clients and over 1.8 million lives on a single analytical platform (secondary). Confidence: uncertain.
- EMR: July 2015, Medscheme announced an electronic medical records platform "customised from the HEALTHone Connect platform"; pilot from April 2015 with 75 healthcare professionals; connects to Medscheme directly or through practice management software; pre-populated with demographics, history, pathology results, chronic meds, care plans and risk stratification; designed to the Department of Health's 2014 interoperability standards (HNSF); does not give administrators access to providers' medical notes. Source: https://techcentral.co.za/medscheme-to-roll-out-electronic-records/192973 . Confidence: confirmed for 2015; current status unknown.
- Switch connection: MediSwitch offers Medscheme real-time online claims responses (ITWeb). Confidence: confirmed (date older).
- Administers GEMS (Government Employees Medical Scheme): recalled background (Medscheme is GEMS administrator); not re-verified. Confidence: uncertain.

#### Momentum Health Solutions, Metropolitan Health, Bonitas, Fedhealth
- Momentum Health is a CareConnect founder (administrator). Momentum Medical Scheme publishes annual claims statements. Bonitas is administered by Medscheme (recalled). Fedhealth administered by Medscheme (recalled). Metropolitan Health Group (MediSwitch counterpart for real-time claims per ITWeb). Details of claim engines: not found. Confidence: uncertain.
- MEDiPOS Medical Scheme administration moved to Discovery Health in April 2025 (from Mediscor), per a Discovery communique: https://cdn.discovery.co.za/assets/discoverycoza/health-professionals/propbm-communiques/medipos-medical-scheme-will-be-administered-by-discovery-health.pdf . Confidence: likely.

### 2.5 Managed care organisations (MCOs)
- Administrators run managed care (utilisation management, DSPs, chronic medicine programmes) either in-house (Discovery) or via contracts (e.g., Medscheme, Mediscor, Momentum). Details not retrieved. Confidence: not established.

---

## 3. Private hospital group systems

### 3.1 Netcare CareOn
- What: Netcare's mobile-first electronic medical record, on iPads; voice-to-text dictation and handwriting recognition; computerised physician order entry; digital integration with ICU/theatre devices; electronic ordering to and results from pathology, radiology, blood bank; integrated pharmacy module (checks interactions, duplicates, allergies) using IBM Watson Health Micromedex; builds on Netcare's e-scripting process "ratified by the South African Pharmacy Council in 2020".
- Operator and vendor facts: Netcare says it developed the system itself ("first private South African healthcare provider to develop such a system"); named partners are Apple, Deutsche Telekom (Clinical Solutions), IBM Micromedex and Capsule Technologies. A core EMR software vendor was not named in any source found. Confidence: confirmed for partner list; confirmed that core vendor not publicly stated.
- Rollout: pilot Netcare Milpark from March 2019 (Citizen 2018); 14 hospitals live in June 2022; 38 acute hospitals covering 90% of beds by late 2023; completion April 2024 with 45 acute hospitals, 9,566 beds, 13,210+ iPads, 30,968 active users, 14,530+ connected devices (Integrated Report 2024, from RESEARCH.md). Netcare also ran analytics on a cloud platform using machine learning, predictive analytics and IoT.
- Sources: https://netcare.co.za/NewsHub/Articles/pioneering-electronic-medical-record-system-a-game-changer-for-hospital ; https://netcare-reports.co.za/2024/pdf/digital-transformation-and-data.pdf
- Interfaces: external interface to CareConnect (Netcare is a founder). Interface mechanism not stated. Status: live.

### 3.2 Mediclinic Southern Africa
- 2015: deployed Hitachi Clinical Repository (HCR, built on Hitachi Content Platform) as the foundation of a central EPR; unified more than 50 locations in a single database; handles DICOM and non-DICOM images, PDFs, Office files, laparoscopy videos; Hitachi said it let Mediclinic "use any EPR solution". Named person: Deon Myburgh, ICT operations manager. Source: https://cioafrica.co/mediclinic-selects-hcr-for-connected-health-as-foundation-for-its-epr/ . Confidence: confirmed (2015).
- Current: an active EHR project exists (recruitment postings; closing 16 Jan 2026; mention of procurement of an EHR system). No vendor announcement found. Confidence: uncertain.
- Mediclinic Middle East uses InterSystems TrakCare (RESEARCH.md). Not the same as Southern Africa.
- CareConnect founder.

### 3.3 Life Healthcare
- No named EMR or HIS vendor found. FY2025 results: CEO "initiated the digitization of the patient journey"; Nov 2025 article: new digital strategy, technology "won't replace nurses at the bedside". June 2020: cyber attack disrupted admissions, business processing and email systems. CareConnect founder. Confidence: confirmed (no vendor public); the earlier brief's "Life uses X" could not be substantiated.

### 3.4 Lenmed and other groups
- Lenmed: SAP hospital information system plus Bluebird lab results and infection-surveillance (documented on Lenmed website). Confidence: likely.
- Crestcare: Bluebird AE (adverse event) safety platform, March 2026 press release.
- NHN, Busamed, Clinix: no system information found.

---

## 4. CareConnect health information exchange (new to the base research)

- What: South Africa's first industry-wide private health information exchange, a non-profit. Founders: three hospital groups (Netcare, Mediclinic, Life Healthcare) and three administrators (Discovery Health, Medscheme, Momentum Health). Announced August 2021 (FAnews), live April 2022, vendor selected February 2020: InterSystems (HealthShare Unified Care Record and HealthShare Patient Index). CEO at launch era: Dr Burnett Biddulph (2020), then Dr Rolan Christian (2022-2023).
- Scale: 5.2 million patients "signed up" as of Oct/Nov 2023.
- Function: gives clinicians an electronic patient record combining data held by facilities and funders; reported aim to reduce duplicate tests; operating only in private hospital sector as of 2023; talks with Radiological Society of SA; pathologists to join; talks with NDoH about EVDS and HPRS.
- Altron HealthTech (3 Dec 2024): newest participant and the first practice management application on the platform, so practice systems can exchange allergies, prescriptions, procedures and consultations. Statement on privacy: complies with POPIA, participants sign data privacy agreements, data shared only with consent, only authorised users may access, sensitive health information viewable only when medically necessary and with consent.
- Sources: https://www.intelligentcio.com/africa/2020/02/11/africas-first-private-healthcare-information-exchange-set-to-drive-health-revolution ; https://www.medicalbrief.co.za/?p=171562 ; https://healthtech.altron.com/press-releases/collaborative-information-sharing-with-altron-healthtech-and-careconnect ; https://www.engineeringnews.co.za/article/south-african-health-sector-launches-information-exchange-2022-04-08 (403 on fetch; found via search)
- Does not hold: no public-sector data; consent model detail (opt-in/out) and technical standards not stated in sources found. Confidence: confirmed for what is stated.
- Status: live (2022-); 2026 membership not found.

---

## 5. Claims switching

### 5.1 What a switch does
Practices and pharmacies submit claim transactions to a switch, which routes them to the scheme or administrator and returns a response (real-time or batch), remittance advice and member/benefit checks. Messages follow PHISC MEDCLM (EDIFACT-based per base research). Confidence: likely.

### 5.2 Altron HealthTech SwitchOn (formerly MediSwitch)
- Operator: Altron HealthTech (formed 2016 from MedeMass, MediSwitch, MedeServe). Product: SwitchOn, real-time claims switching; WEBDesk claims management portal; member status validation (name, date of birth, dependant code; one free validation per claim); benefit checking and quotes; electronic remittance advices (eRAs); claim reversals; "medres" tracking.
- Scale: over 8,000 healthcare practices; 0.0% downtime (2021 audited results) per vendor.
- Product family: HealthONE (EHR, practice management), Elixir Live, electronic scripting, Medinet Connect, Recomed (diary), Logbox, MediAdvance (practice funding), HealthONE Oncology, EngageMX, MedeServe medical bureau, occupational health (HealthONE Enterprise).
- Source: https://healthtech.altron.com/switchon . Confidence: vendor claims (uncertain on numbers), confirmed on product list.
- Historical: MediSwitch real-time to Medscheme, Discovery and Metropolitan (ITWeb articles).

### 5.3 Healthbridge
- Launched 1999; "South Africa's largest medical transaction switch" and "pioneered real-time claim processing". Cloud billing, revenue-cycle management, claims reporting, benefits checker.
- Technology: close to 300 servers; moved to Nutanix hyperconverged (AHV hypervisor) on HPE ProLiant DX servers via Datacentrix; chose Nutanix over replacing the SQL environment (so database engine includes Microsoft SQL Server, likely); estimated alternatives R500,000 (hardware upgrade), R10 million (full upgrade), R15 million (replace). Another source: 19 million claims switched annually (vendor claim).
- Source: https://www.nutanix.com/en_gb/company/customers/healthbridge . Confidence: confirmed (case study); volumes uncertain.

### 5.4 MediKredit (HealthNet ST, Integrated Healthcare Solutions)
- MediKredit Integrated Healthcare Solutions owns and administers NAPPI codes; HealthNet ST real-time claims switch with about 9,000 providers (base research). Product page could not be fetched (403).
- Confidence: confirmed for NAPPI ownership; likely for switch.

### 5.5 Digital Healthcare Solutions (DHS)
- Listed in the base research as operating "MediSwitch". The fetched evidence shows MediSwitch belongs to Altron HealthTech (now SwitchOn). The base-research phrase "Digital Healthcare Solutions (MediSwitch)" appears to be mistaken or outdated. No source linking DHS to a current switch was found. Confidence: likely correction.

---

## 6. Standards and coding

### 6.1 PHISC and MEDCLM
- PHISC: Private Healthcare Information Standards Committee (https://www.phisc.net/about-us per base research). MEDCLM message specification versions, field definitions and rejection codes could not be retrieved from public pages. Confidence: not established beyond base research.

### 6.2 ICD-10, tariffs, practice numbers
- ICD-10 (WHO) is the diagnosis standard in claims (ICD-10 MIT is the South African master industry table: recalled; not verified). Procedure/tariff coding: the CPT-4 based coding on the CMS/BHF tariff scheme with the NHRPL (National Health Reference Price List) historically published by the CMS and withdrawn in 2010 (recalled background; uncertain). Practice numbers are issued by BHF's Practice Code Numbering System (PCNS) (recalled; uncertain). None verified this session.

### 6.3 NAPPI
- Owner: MediKredit Integrated Healthcare Solutions, "the only organisation that can assign NAPPI codes" (Discovery 2023 registration guide). Governance: NAPPI Advisory Board (NAB), non-profit representing hospitals, schemes, administrators and medical/dental associations. NAPPI is "the only accepted code for product identification by all healthcare funders in South Africa". Suppliers of ethical medicines and surgical consumables and devices apply for codes. Acronym: National Pharmaceutical Product Index (some sources "Interface").
- Sources: https://www.discovery.co.za:443/assets/discoverycoza/health-professionals/propbm-communiques/nappi-code-registration-and-review-process-2023.pdf ; https://en.wikipedia.org/wiki/National_Pharmaceutical_Product_Index
- Confidence: confirmed. "Medical Data Systems" or "Mediscor" ownership: not supported by any source.

---

## 7. Practice management and clinical-note software

- GoodX: Pretoria, founded 1985 (third-party profile); cloud EHR and billing; billing sends via Healthbridge (GoodX documentation). Training site: learning.goodx.co.za includes "Setting up Medical Aid Lists - NAPPI Claim Codes" confirming NAPPI use in practice claims.
- CompuGroup Medical (CGM): Practice Perfect (EHR) with MEDEDI (practice management) as an all-in-one system (2022 GP Expo press release).
- Altron HealthTech: HealthONE / Elixir. Elixir Live launched in Namibia (recent news on Altron page).
- Medscheme HEALTHone Connect lineage: the 2015 Medscheme EMR was "customised from HEALTHone Connect"; HealthONE is an Altron HealthTech product, indicating a shared product lineage (likely, not verified).
- MediSwift, Practice Perfect (CGM), Evolution, Medsol, Vision, HealthStream: no pages retrieved. Confidence: not established.

---

## 8. Laboratories (private)
See Round 6 gap 2. Additional: Ampath (Pro Plus app, Ampath Manager, lab-results portal), Lancet (Netlims LabOS LIS, 2018), PathCare (PathProvider portal), Synlab: nothing retrieved. Bluebird is the cross-lab results broker.

---

## 9. Pharmacy and medicines
- NAPPI as above. Clicks: investing in prescription management system letting patients collect at any Clicks via loyalty card (Sanlam note). Clicks owns United Pharmaceutical Distributors (UPD). ProPharm (Computassist Group) real-time claims via switch (base research). Netcare e-scripting ratified by the Pharmacy Council in 2020. Medicine pricing (SEP) rules and electronic prescription regulation: not retrieved.
- Dis-Chem breach: see section 10.

---

## 10. Data protection and breaches (health sector)

| Event | Date | Facts | Source | Confidence |
|---|---|---|---|---|
| Life Healthcare cyber attack | June 2020 | Admissions, business processing and email servers affected; systems "substantially" restored later; extent of data compromised initially undetermined | https://www.itweb.co.za/article/life-healthcare-reveals-damage-caused-by-data-breach/rW1xLv59YPGvRk6m ; https://www.dispatchlive.co.za/news/2020-06-09-hackers-strike-at-life-healthcare-extent-of-data-breach-yet-to-be-assessed/ | confirmed (date correction vs brief's 2021) |
| Dis-Chem (Grapevine operator) | Apr-May 2022 brute-force on third-party provider; notice 31 Aug 2023 | 3.6 million (some say 3.7 million) data subjects' mailing details; Information Regulator enforcement notice: failure to notify data subjects (s22) and no written operator agreement (s21); Dis-Chem disputed; regulator threatened up to R10m | https://inforegulator.org.za/wp-content/uploads/2020/07/FINAL-MEDIA-STATEMENT-ENFORCEMENT-NOTICE-ISSUED-TO-DISCHEM-PHARMACIES-LTD.pdf ; https://techcentral.co.za/information-regulator-dis-chem-breach/230895 | confirmed |
| Lancet Laboratories | Enforcement notice Sept 2024; infringement notice R100,000 fine; paid (Tlakula statement 2025) | Compliance assessment following multiple security compromises; failure to notify data subjects within reasonable period | https://www.itweb.co.za/article/inforeg-exposes-popia-violators-as-data-breaches-mount/kLgB17ezby5M59N4 ; https://www.medicalbrief.co.za/?p=202540 | likely |
| National Department of Health | 2022-23 | Referred to Enforcement Committee for failing to answer regulator about COVID-19 data | https://www.michalsons.com/blog/regulator-refers-the-department-of-health-to-enforcement-committee/64137 | likely |

- Notes: no Information Regulator action against a medical scheme or hospital group was found; Netcare, Mediclinic, Medscheme and Discovery breach searches returned nothing verifiable. Confidence on absence: uncertain. POPIA s32 and HPCSA Booklet 9 in base research stand.
- CareConnect and Discovery HealthID both rely on per-patient consent (HealthID: written consent per doctor).

---

## 11. Discovery HealthID
- Launched 9 July 2012 (press release). Core: electronic health record built from claims data and pathology laboratory data: prior doctor and hospital visits, prescribed medicines, blood test results, BMI and blood pressure. Doctors can apply online for chronic medicine approval in real time and see formulary cover. Consent: written, per doctor, individually. Launch platform iPad (Android with Samsung planned); Emergency HealthID QR planned for paramedics.
- Usage per later Discovery page: "regular use by over one million members and almost 50% of doctors treating members of Discovery Health's client schemes".
- Source: https://www.mynewsdesk.com/za/discovery-holdings-ltd/pressreleases/discovery-health-launches-healthid-a-revolution-in-electronic-health-records-in-sa-779062 ; https://discovery.co.za/medical-aid/about-discovery-health
- Confidence: confirmed (2012), usage uncertain.

---

## 12. Not covered in depth
Private radiology/PACS vendors, telehealth products, private ambulance (Netcare 911, ER24) records, occupational and mining health systems, dentistry software: no sources found in this session.

---

## Unanswered / could not find
- MEDCLM version history, field list, rejection/response codes; PHISC specification documents (searched "PHISC MEDCLM" and variants; no results).
- ICD-10 MIT, CPT4/CCSA, NHRPL status, PCNS details (not searched in primary sources).
- CMS data submission formats (statutory returns, claims data sets), risk equalisation status 2026, BHF role today.
- Core EMR software vendor for Netcare CareOn; EMR/HIS vendors for Life Healthcare and Mediclinic Southern Africa (current); NHN, Busamed, Clinix systems.
- Numeric size of private sector (GPs, specialists, hospitals, beds nationally); HMI figures not re-fetched.
- Pharmacy dispensing systems (Rx Solution private use, Clicks and Dis-Chem named systems), SEP rules, e-prescription regulation beyond Netcare.
- Private labs: PathCare and Synlab LIS; any HL7/FHIR specification of Ampath, Lancet or PathCare interfaces.
- Radiology PACS vendors; telehealth; private ambulance records; occupational health; mining health.
- CareConnect technical standards, consent model details and 2026 status; whether CareConnect-HPRS/EVDS link went live.
- Data breaches at Netcare, Mediclinic, Medscheme, Discovery: nothing verifiable found.
- Direct pages blocked or missing at fetch time: medikredit.co.za (403), intelms Bluebird subpages (404), databreaches.net (403), engineeringnews (403), CMS 2025/26 AR (10 MB limit).


---

# PART E: EMERGENCY, BLOOD, IMAGING, OTHER STATE, NGO (FIRST PASS)

*Source file: research/phase_E_emergency_blood_imaging_other_state_ngo.md (95 lines)*

# Phase E: Emergency care, blood, imaging, other state health services, NGO/donor systems

Compiled 2026-10-31 by research agent E (DEXA / SAHealth project). Factual landscape only; no recommendations.

IMPORTANT SCOPE NOTE. This file is far shorter than the 1,200-line target. Only about a dozen searches and fetches were run in this session. Every item below carries a confidence tag. "confirmed" means seen in a fetched or searched source this session (URL given). "background-unverified" means general domain knowledge that I did NOT re-verify this session; treat as a lead, not a fact. No scrapers were written (no files in C:\SA Health\research\scrapers were created by E).

---

## Round 6 gap findings

### Gap 1. SANBS electronic blood ordering interface: which hospitals, what protocol

- Finding: SANBS's new Blood Establishment Computer System (BECS), named eProgresa in SANBS wording, became operational in November 2023 (SANBS integrated report "manufactured capital" page). The product's FDA 510(k) filings list the name as ePROGESA (version v5.0.3 appears on an FDA device database), maker MAK-SYSTEM (per search summary of the FDA/GUDID entries). The FDA filing describes functions covering order management, patient management, inventory selection, testing, release and distribution, and states orders and patient results "can be managed by interface with the Hospital Information System" and that it is "intended to be interfaced with 3rd party systems through standard network connections" (paraphrased by the search tool from the filing; I could not open the PDF, fda.gov/media/173672/download returned 404).
- NOT established: which hospitals place orders electronically with SANBS, and over which protocol (HL7 v2, ASTM, web portal, or other). No SANBS or hospital source found describing this. The SANBS page fetched states no vendor, no hospital interface and no site counts.
- Related fact: SANBS is testing a 20-unit "haemobank SMART fridge" with 3G/4G connectivity; success "could support broader use across key hospitals" (same page). This is a fridge pilot, not an order interface.
- Sources: https://sanbs-integrated-report.sanbs.org.za/manufactured-capital.php ; https://fda.innolitics.com/device/BK230986 ; https://accessgudid.nlm.nih.gov/devices/03665324000050
- Confidence: BECS go-live Nov 2023 confirmed; vendor MAK-SYSTEM likely; hospital ordering interface uncertain/unfound.
- Change to picture: the existing RESEARCH.md statement that SANBS "launched eProgresa" is supported, with date November 2023. The hospital-side electronic ordering question stays open.
- Western Cape Blood Service: a WCBS "Nurses Guide to Ordering" PDF exists (https://wpwcbs.azurewebsites.net/wp-content/uploads/2025/05/Nurses-Guide-to-Ordering-interactive-FA_2105.pdf) but the snippet seen covers consent, not the ordering channel. WCBS BECS vendor not found. WCBS opened its fifth Western Cape Blood Bank at Khayelitsha District Hospital on 18 September 2019 (https://wcbs.org.za/about/our-history/); WCBS mobile app launched 2017 (same). Confidence: confirmed for those two facts.

### Gap 2. Public PACS deployments by province

- Finding: Only one provincial deployment was positively evidenced: Eastern Cape. AuntMinnie, 17 May 2010: Paxeramed (Irvine, CA PACS/RIS developer) built a teleradiology network on its PaxeraWeb PACS connecting 27 government hospitals to a central data centre run by SITA (State Information Technology Agency); radiologists read and report in PaxeraWeb and reports return to originating hospitals. Source: https://www.auntminnie.com/imaging-informatics/enterprise-imaging/pacs-vna/article/15595234/paxeramed-installs-s-africa-telerad-network . Confidence: confirmed for 2010 announcement; current operational status unknown.
- Literature: Healthcare Informatics Research 25(4), Oct 2019, "PACS Implementation Challenges in a Public Healthcare Institution: A South African Vendor Perspective" (https://pmc.ncbi.nlm.nih.gov/articles/PMC6859271/). Ten unnamed vendor staff interviewed (each at least 2 years on public PACS projects). Says PACS used in SA public hospitals "more than a decade" with "moderate success". Names no vendors or hospitals. DICOM: respondents said non-conforming DICOM implementations during modality integration were time-consuming. HL7 not mentioned. Confidence: confirmed.
- A University of Stellenbosch thesis (https://scholar.sun.ac.za/items/3c9377da-5b4d-4df6-81b2-afbad010388f/full) reportedly says very few PACS are operational and integrated with other institutions. Confidence: likely (search-snippet only).
- Charlotte Maxeke study (PMC10244939, already in RESEARCH.md): public PACS "significantly lags". Most public hospitals have a limited "mini PACS" (search summary of literature). Confidence: likely.
- NOT established: Gauteng, KwaZulu-Natal (IALCH "filmless"), Western Cape (Tygerberg, Groote Schuur) PACS products, vendors, extents. Searches returned nothing specific.
- Change to picture: confirms "each hospital own archive" framing; adds Eastern Cape 27-hospital SITA-hosted 2010 network as the single documented province-scale teleradiology effort.

### Gap 3. EMS electronic patient record deployments by province

- Finding: No South African provincial ePRF/ePCR deployment was confirmed. A search hit claiming "all ambulances in the Eastern Zone" got tablet ePCR replacing paper refers to Newfoundland and Labrador, Canada (vocm.com, gov.nl.ca), NOT South Africa. Do not use it.
- Western Cape: ITWeb/TimesLive c.2013 reported a roughly R250-256 million, five-year EMS ICT project covering call-taking, dispatch, fleet management, HR, supply chain, billing and electronic patient records, with nearest-vehicle dispatch. Sources: https://www.itweb.co.za/article/r250m-deal-to-speed-up-emergency-services/p6GxRKMYwwwvb3Wj ; https://www.timeslive.co.za/news/south-africa/2013-04-22-western-cape-ambulance-response-times-to-get-r250-million-boost-report/ . Vendor and current status not verified. Confidence: confirmed that it was announced; delivery uncertain.
- Western Cape also has HECTIS (Health Electronic Clinical Information System; slideshare presentation found, not opened) and a UWC thesis on electronic healthcare systems for patient recordkeeping in the Western Cape (https://etd.uwc.ac.za/handle/11394/7829). Not read.
- Paper PRFs: Western Cape 2011 study inspected paper PRFs completed at scene; DUT (Durban University of Technology) research finds paramedics omit vital information on PRFs and produced a Delphi audit checklist (https://ir.dut.ac.za/handle/10321/4455). A 2024 South African Journal of Science review says EMS "appears to be constrained and requires greater leadership and governance from the Provincial Departments of Health". Confidence: likely (snippets).
- Gauteng CAD: nothing found.
- Change to picture: supports RESEARCH.md hedge "in many services, still paper"; no province can be named as fully electronic.

---

## 1. Emergency medical services

### 1.1 Structure (background-unverified unless noted)
- EMS is a provincial function under Schedule 4 of the Constitution; each of nine provinces runs its own EMS and (in most) its own dispatch call centre. Confidence: background-unverified. A 2024 SA Journal of Science review (above) supports provincial governance as the locus.
- Private EMS (Netcare 911, ER24, Mediclinic Emergency, AMS, others) operate separately, funded by medical schemes and cash; air ambulances are largely private. Not verified this session.
- Patient care documented on a Patient Report Form (PRF); EMSSA recommends DeMIST handover; 2022 EMS Regulations require standardised handover (RESEARCH.md, citing PMC9634030). Confidence: confirmed in base file.
- Vendors named in base file: Ithaca (ePRF). Not re-verified.

### 1.2 Data flows
- No evidence found of automated EMS-to-hospital record transfer. PRF copy is typically handed over with the patient (paper) per sources above. Confidence: likely.
- Triage: SATS (South African Triage Scale) is used in emergency centres. Not re-verified here. Trauma registries: not researched.

## 2. Blood services

### 2.1 SANBS
- Operates in all provinces except Western Cape (RESEARCH.md; Wikipedia). Testing laboratories listed: Constantia Kloof and Mount Edgecombe (SANBS integrated report page). Confidence: confirmed.
- BECS operational Nov 2023, described by SANBS as "a significant milestone in our digital transformation efforts" (per fetch summary). Also mentioned: SAP / SAP Ariba implementation beginning. Confidence: confirmed.
- eProgresa ancestor Progesa (history), donor record schema, haemovigilance reporting: NOT found.

### 2.2 Western Cape Blood Service
- Facts under Gap 1. Independent from SANBS. BECS not identified.

### 2.3 Organ donation / transplant registries
- Not researched this session.

## 3. Imaging
- See Gap 2. Private sector adopted PACS first; teleradiology introduced 1999 per literature (search summary), uptake low; private sector uses after-hours teleradiology; COVID increased use (SA Journal of Radiology 2023 per search summary; unverified). Confidence: likely.
- Private PACS vendors, RIS, DICOM/HL7 specifics for private groups: not researched.

## 4. Other state services
Not researched this session: forensic pathology / mortuary systems, SAMHS, Correctional Services health, metro municipal PHC systems, Compensation Fund / COIDA, RAF, poison centres, mental health registers, dental, rehabilitation, palliative care, Integrated School Health Programme, Social Development / Home Affairs links, traditional health practitioners.

## 5. NGO / donor systems

### 5.1 MomConnect
- Operated by the National Department of Health (NDoH); SMS and WhatsApp channels. Sept 2024 NDoH 10th anniversary release: almost 5 million registered users, 288,051 monthly active. An ITU WSIS 2026 listing says over 5.2 million mothers supported, over 280,000 active monthly users, and "a phased handover plan is currently underway to transition MomConnect to full NDOH ownership" funded by national treasury. Sources: https://www.gauteng.gov.za/News/NewsDetails/%7B931b2341-7b35-4684-8527-340ff8b5df26%7D ; https://www.itu.int/net4/wsis/stocktaking/Prizes/2026/Details/17720121703313989 ; https://www.health.gov.za/?p=21258 . Confidence: confirmed (secondary summaries). Tech stack (reported elsewhere as Praekelt-built; Vumi/Turn): background-unverified.

### 5.2 PEPFAR and funding shock
- PEPFAR gave South Africa about USD 440 million for Oct 2024-Sept 2025; USAID issued termination notices in Feb 2025; about 150 NGOs depended on support, 39 as principal implementing partners (Daily Maverick, Health-e). Modelling for NDoH: 150,000-295,000 extra HIV infections by 2028 without mitigation. A PEPFAR Bridge Plan approved for 1 Oct 2025-31 Mar 2026. A June 2026 report said the US plans to end PEPFAR in South Africa, phase-out by early 2027. Business Day, 22 July 2026: Pepfar cuts left 30,880 fewer SA children on HIV treatment. Sources: https://www.dailymaverick.co.za/article/2025-02-27-the-axe-has-fallen-usaid-issues-funding-termination-notices-to-key-health-programmes-across-sa/ ; https://www.dailymaverick.co.za/article/2025-04-14-us-funding-cuts-could-cause-over-150000-additional-hiv-infections-in-sa-by-2028-study.md ; https://www.businessday.co.za/news/health/2026-07-22-pepfar-cuts-leave-30880-fewer-sa-children-on-hiv-treatment/ . Confidence: confirmed for headlines (not opened in full); the June 2026 report (hoodline.com) is a weak aggregator, treat as likely.
- DATIM (PEPFAR reporting system), TIER.Net, implementing partner data systems (Right to Care, Aurum, Wits RHI, FPD, Broadreach, Anova, CAPRISA, HealthEnabled): searched, nothing returned. Confidence: unestablished.

---

## Unanswered / could not find
- SANBS hospital ordering: which hospitals, protocol (HL7/ASTM/portal). No source.
- eProgresa implementation partner and database engine; Progesa history; WCBS BECS vendor.
- PACS in Gauteng, KZN (IALCH), Western Cape, Tygerberg, Charlotte Maxeke: products and extent.
- Eastern Cape PACS status after 2010.
- Any SA provincial ePRF/ePCR deployment; Gauteng/other CAD systems; Ithaca deployments.
- Netcare 911, ER24, Mediclinic, AMS data systems; air ambulance.
- SATS data capture, trauma registries, organ donation registry.
- Forensic pathology systems, SAMHS, Correctional Services, municipal PHC systems, COIDA/RAF, poison centres, mental health, dental, rehab, palliative, ISHP.
- DATIM, TIER.Net, CHW tools, REDCap, HDSS sites (AHRI, Agincourt, Soweto), MSF, CAPRISA.
- Searches not run for most of the above because of the limited session budget; absence here is NOT evidence of non-existence.


---

# PART E1: EMERGENCY CARE, BLOOD SERVICES AND IMAGING (SECOND PASS)

*Source file: research/phase_E1_emergency_blood_imaging.md (183 lines)*

### 1.1 Structure and facilities
- What it is: SAMHS is the medical branch of the South African National Defence Force (SANDF), reporting under the Department of Defence (DoD); it runs military hospitals and health centres and deploys medical personnel in operations. Hospitals named in a 2022-23 DoD presentation (via search summary): 1 Military Hospital (Thaba Tshwane, Pretoria; established 1931), 2 Military Hospital (Wynberg, Cape Town), 3 Military Hospital (Tempe, Bloemfontein). Source: https://www.wikipedia.org/wiki/SAMHS ; https://defenceweb.co.za/tag/1-military-hospital/ . Confidence: likely.
- 1 Military Hospital repair-and-maintenance (RAMP) project: launched by Public Works in 2001 to restore the hospital as the SANDF flagship; as of March-May 2025 reporting still incomplete, with the Joint Standing Committee on Defence expressing concern at the "paralysed" project and corruption claims; one source says the hospital lost its Level 4 accreditation for AU/UN peace-keeping support because of non-completion. Sources: https://thepost.co.za/news/south-africa/2025-03-31-1-military-hospital-a-decade-of-failed-renovations-and-corruption-claims/ ; https://newsletter.en.creamermedia.com/article/parliamentary-defence-committee-highlights-paralysis-in-hospital-project-and-in-prosecutions-2025-05-26 ; https://www.engineeringnews.co.za/article/parliamentary-committee-concerned-about-ongoing-expenditure-for-1-military-hospital-project-2021-09-03 . Confidence: likely (headlines/snippets).
- DoD annual performance plan flagged deteriorating facilities, obsolete equipment and staffing shortages for SAMHS; Sunday Times 14 Jul 2013 reported the DoD 2011-12 annual report admitted that maintenance backlogs at its three military hospitals impacted health care delivery. Confidence: likely.

### 1.2 Records systems
- No source found this session naming an SAMHS electronic health record product, vendor or database (targeted searches returned only the US SAMHSA agency or US/UK military EHR material). Not found: whether SAMHS patient records are paper, a Defence-internal HIS, or integrated with any provincial or NDoH system; whether SAMHS patients appear in HPRS or DHIS2. Unanswered item (see end).
- SAMHS issues a periodic news magazine (2nd edition 2024 on issuu: https://issuu.com/samhscorpcomm/docs/samhs_news_magazine_2nd_edition_2024), not opened. Confidence: unverified.
- Military hospitals also treat civilians under arrangements with provinces/NDoH (background, unverified).

---

## 2. Department of Correctional Services (DCS) health care and records

### 2.1 Structure and scale (DCS Annual Report 2024/25, parsed with E2_pdf_grep.py)
- Operator: DCS (Vote 22). Health care is a sub-programme of Programme 4 "Care" (Health Care Services, Nutritional Services, Hygiene Services). Care in facilities is delivered by DCS-employed professionals plus referral to public hospitals via provincial health departments (PMG committee briefings).
- Inmate population 31 March 2025: 166,008 (up 9,408 from 156,600 in 2023/24). Gauteng alone: 40,581 inmates. State patients (mentally ill, awaiting placement in designated mental health establishments) are held in correctional facilities beyond the 14-day transfer requirement in Chapter VI of the Mental Health Care Act 17 of 2002 because of limited beds.
- Workforce 31 March 2025 (Table 2.8, partially read): professional nurses 792, pharmacists 38, post-basic pharmacist assistants 13, medical practitioners 14 (filled), with "lack of funded posts" for doctors, pharmacists and healthcare managers in some regions.
- Outcome indicators 2024/25: offender viral load suppression 99% (1,157 of 1,171); new pulmonary TB cure rate 98% (249 of 254); diabetes screening 79,075 inmates aged 40+; hypertension screening 74,629; treatment initiation 99.9% (1,510/1,511) hypertension and 100% (178/178) diabetes.
- Medical Parole Advisory Board (Section 79, Correctional Services Act 111 of 1998): 80 new applications in 2024/25; 38 recommended, 27 not recommended, 15 applicants died before consideration.
- Source: https://www.gov.za/sites/default/files/gcis_document/202510/dcs-ar-2024-25.pdf (344 pages). Confidence: confirmed.

### 2.2 Records / information systems
- Health data tool: DCS states "an excel based Comprehensive Data Tool for communicable and non-communicable diseases was reviewed to ensure integration of health care programmes"; it says investment is needed to develop "an integrated Health Information System" in the medium to long term, citing "poor and unreliable data". So the DCS health reporting layer in 2024/25 is spreadsheet-based, not a dedicated electronic health record. Confidence: confirmed.
- Offender management: Integrated Inmate Management System (IIMS); "Further rollout of the Integrated Inmate Management System (IIMS) is currently on hold pending the outcome of the arbitration or dispute resolution process". Audit committee: "IIMS rollout remains a challenge", plus budgetary constraints for the Master Information Systems Security Plan. Confidence: confirmed. (IIMS is the offender record, not the clinical record.)
- TB register: a 2015 Minister of Health reply said inmate TB information is in TB registers at each correctional facility. Source: https://pmg.org.za/committee-question/965/ (Question NW3099). Confidence: likely.
- Guidelines: "Guidelines for the Management of TB, HIV and STIs in Correctional Facilities" (screening all inmates for TB at least twice a year, per that reply). Confidence: likely.
- Continuity: released inmates with HIV and TB are linked to community providers. Pharmacies established in selected Management Areas.

### 2.3 Donor funding and implementing partner
- DCS signed an MOU with TB HIV Care (NGO) for HIV, STI, TB, viral hepatitis and non-communicable disease implementation.
- DCS states "The withdrawal of the United State President's Emergency Plan for AIDS Relief (PEPFAR) funding affected the Department's ability to provide essential health care services", including HIV and TB screening and prevention such as PrEP and PEP. Confidence: confirmed. A documented PEPFAR-to-government-service dependency.
- DCS 2025/26 annual report exists on PMG (https://static.pmg.org.za/DCS_Annual_Report_2025-2026.pdf), not opened. Treasury ENE 2026 Vote 22 says DCS plans to further reduce HIV transmission (snippet). Confidence: likely.

### 2.4 Connections
- No electronic interface between the DCS spreadsheet tool and TIER.Net/DHIS2 was found (unanswered).

---

## 3. Municipal and metro health services

### 3.1 City of Cape Town: PREHMIS
- What it is: PREHMIS = Patient Record and Health Management Information System, the City of Cape Town's PHC system. Its own page: it captures "basic patient information and the services provided to patients so that automated reports can be generated"; focus is management information; "not a full electronic medical record"; the paper patient folder is not replaced. Powered by Symfony and Sphinx Search; revision shown 3.26Q2.1. Source: https://prehmis.capetown.gov.za/content?page=about . Confidence: confirmed.
- Used at City of Cape Town PHC facilities; NDoH reply lists it alongside provincial PHCIS (308 PHC facilities) and Clinicom (53 hospitals). A Western Cape Health Data Centre presentation says PREHMIS records link to the Patient Master Index registration number shared across Western Cape systems. Sources: https://pmg.org.za/committee-question/31734/ ; https://www.insight.co.za/wp-content/uploads/2017/01/Andrew-Boulle-WC-Health-Data-Centre.pdf . Confidence: confirmed / likely.

### 3.2 City of Johannesburg
- e-Health@Joburg: decision to introduce an electronic health records system June 2016 (ITWeb, 7 Aug 2019); online EHR replaced paper; rolled out across 66 of 81 PHC facilities by Aug 2019; 64 of 81 by 2018 with the 500,000th patient registered at Halfway House Clinic (Citizen, 29 Aug 2018); 709,765 patients in 2019 per another report. Public-private partnership with Altron (per Citizen). ITWeb did not name the vendor. Smart queueing with cellphone booking was planned.
- Sources: https://itweb.co.za/article/electronic-system-improves-joburgs-primary-healthcare/Pero3qZgoeevQb6m (fetched) ; https://www.citizen.co.za/randburg-sun/news-headlines/2018/08/29/joburg-ehealth-system-reaches-half-a-million-patients/ . Confidence: confirmed for ITWeb figures; likely for Altron.
- 2023 phase two: City announcement (2 Aug 2023) of a new e-Health programme with contractors tailoring an open-source system, intended for all 79 clinics and eventually mobile clinics; in development phase. Source: https://joburg.org.za/media_/Newsroom/Pages/2023%20News%20Articles/August/New-e-Health-programme-promises-to-transform-healthcare-in-the-City.aspx . Confidence: likely (snippet).

### 3.3 Tshwane, Ekurhuleni, eThekwini
- No source found for a municipal PHC records system in these three metros. Most clinics in Gauteng and KZN metros are provincial and use provincial/NDoH systems (HPRS, TIER.Net, DHIS2). Confidence: background-unverified. Listed under unanswered.

### 3.4 Gauteng provincial HIS (SAP-based, Gijima-led), context for metro clinics
- NDoH reply lists "37 hospitals with SAP - Health Information System (HIS)". Gauteng (May 2024): patient administration, billing and finance modules integrated across all 37 hospitals and 33 Community Health Centres; clinical module fully operational at Mamelodi Hospital and Charlotte Maxeke Johannesburg Academic Hospital; "one-patient-one-file". Legacy systems replaced: Medicom and PAAB.
- Spotlight (13 Jul 2022): vendor Gijima; tender awarded 2020 and run by SITA; worth R339m (ITWeb); about R150m spent at that time; pilot Nov 2020 - Apr 2021 at Hillbrow, Lillian Ngoyi, OR Tambo, Stretford, Discoverers and Alexandra CHCs; later Sebokeng, Bheki Mlangeni, Jubilee, Mamelodi, Thelle Mogoerane hospitals. Spotlight could not confirm interoperability with DHIS or NHI systems. The 2008 Baoki consortium R1.2bn tender was cancelled after more than R400m was paid with no system installed.
- Paper-file digitisation: announced 17 May 2024, target at least 800 million records within 36 months; pilot at Chris Hani Baragwanath Academic Hospital and Rahima Moosa; focus areas maternity, patient administration, mental health, chronic care.
- Sources: https://www.spotlightnsp.co.za/2022/07/13/differing-views-on-gautengs-new-health-information-system/ ; https://www.gov.za/news/media-advisories/gauteng-health-embarked-digitisation-patient-files-17-may-2024 . Confidence: confirmed (fetched).

---


### 1.10 Tender-level evidence (added after eTender/aggregator search)
- Limpopo CAD: awarded to In2it, via the State Information Technology Agency (SITA), award date 29 September 2023, tender RFB-2694-2022, "Provisioning, Customization, Testing, Installation, Interfacing And Commissioning Of A Computerised Aided Dispatch System (CAD) For Emergency Medical Services In The Limpopo Department Of Health For A Period Of 36 Months"; award value unconfirmed. Source: https://getvuza.com/awards/22895 (aggregator of eTender award notices; fetched and parsed with `E1_fetch_html_grep.py`). This links the May 2025 Limpopo launch (section 1.6) to a contractor. Confidence: confirmed (aggregator), vendor product name unknown.
- Northern Cape: tender to establish a panel of private road ambulance providers (getvuza.com/tenders/B3FA814B); Eastern Cape: private ambulance services in Chris Hani District (tenderflow). These are service contracts, not dispatch software. Confidence: confirmed (listings).
- Mpumalanga app: DA says R33.4 million, Vodacom, 2021-22 two-year contract, while the MEC had earmarked R50 million for CAD; Citizen says the app was abandoned in 2023 when the contract lapsed, partly due to residents lacking smartphones/data; named "Impilo" by the Citizen and "Mpilo" (launched 2019) by Vodacom material; DA says it has call-tracking and dispatch modules. Sources: https://www.da.org.za/2023/06/only-48-functional-ambulances-for-nearly-5-million-people-in-mpumalanga ; https://www.citizen.co.za/news/staff-shortage-leaves-122-ambulances-unused . Confidence: likely (partisan plus press, no departmental account).

---

## 2. Blood services

### 2.1 SANBS (South African National Blood Service)
- Footprint (2024 Summarised Integrated Report, PDF page 4, text extracted with `E1_fetch_pdf_grep.py`): almost 1.1 million donations for the year; 2 testing laboratories (Constantia Kloof and Mount Edgecombe); 83 blood banks (one more early FY25); 72 donation centres; 7 processing centres; 25 mobile donor vehicles (58 beds). IT systems listed under intellectual/manufactured capital: "Migration to eProgesa" and "SAP ERP". Source: https://www.sanbs.org.za/uploads/media/about/annual%20reports/SANBS-2024-summarise-report.pdf . Confidence: confirmed.
- BECS timeline: CEO text (PDF page 6): BECS "went live in November 2023 after its initiation in 2020". Record milestone "bleeding 5,600 donors in a single day" attributed to the digital transformation. Same source. Confidence: confirmed.
- Revenue streams: receipts from private patients and institutions and from government hospitals (business model page). Capital expenditure lines: IT (process automation) and innovation; "drone capability" listed. Confidence: confirmed.
- FY25 financials: surplus R447.8 million (+79.1%), R4.4 billion turnover; 3.3% reduction in overall expenses after BECS stabilisation; BECS "implemented last year, initially incurring transitional costs that have now decreased" (SANBS integrated report CFO page, https://sanbs-integrated-report.sanbs.org.za/financial-capital-2.php , search summary). Confidence: likely.
- Earlier digitisation: Project Impilo (Datacentrix, 12 Sep 2016). Enterprise Information Management (EIM) solution to digitise up to 30 million paper records per year from over 800,000 donations per year; pilot of 120 users to extend to all 2,500 staff; APIs to other line-of-business systems and existing SAP modules; phase 1 donor forms and cross-match forms, phase 2 donation/testing/QC records; triggered partly by a fire at the Pinetown warehouse that destroyed records. Source: https://www.itweb.co.za/article/sa-national-blood-service-to-digitise-30m-records-annually-with-datacentrix/lP3gQ2qGE517nRD1 . Confidence: confirmed.
- Donor-facing digital rollout (Citizen/Northern Natal News, 24 Oct 2023): medical questionnaire moved from paper to tablet or kiosk at donation sites, digital signature, new donor profile requires ID and photo, staff verify donors on the system, questionnaire flags issues in real time; donation sites closed 5-6 November 2023 to prepare the back-end; photos/IDs from 7 November 2023; "modern Customer Relationship Management systems" planned. No CRM or kiosk vendor named. Source: https://citizen.co.za/northern-natal-news/news-headlines/local-news/2023/10/24/sanbs-is-going-digital . Confidence: confirmed.
- Donor information platform: ITWeb piece "Blood donation and big data: untapped tech opportunity to save lives" (https://www.itweb.co.za/article/blood-donation-and-big-data-untapped-tech-opportunity-to-save-lives/VgZeyqJl31b7djX9) surfaced in search, not opened. Confidence: uncertain.
- Hospital blood banks: the 83 SANBS blood banks are the issue points to hospitals; the 2024 haemovigilance report refers to blood banks and hospital staff separately and to the electronic crossmatch system. Whether a hospital blood bank is staffed by SANBS or by the hospital differs by site; not sourced here. Confidence: uncertain.
- Haemovigilance: see 2.3.

### 2.2 Western Cape Blood Service (WCBS)
- Independent non-profit serving the Western Cape (SANBS serves the rest). 2024-25 annual report (1 April 2024 to 31 March 2025): about 147,070 units of donated whole blood and plasma, 68,877 active donors, 14,147 new donors, 185,751 products issued, 506 employees; calendar 2024 press release: 148,664 units and 13,957 new donors; target about 700 whole-blood units per day; donors 0.91% of population versus ideal 1-2%. Sources: https://www.wcbs.org.za/wp-content/uploads/2025/09/WCBS-Annual-Report-2024-2025-final.pdf ; https://www.goodthingsguy.com/lifestyle/1011-units-blood-donated . Confidence: confirmed.
- Footprint (annual report PDF page 3): HQ at Ndabeni, regional branches in Worcester and George, 9 permanent blood donor clinics, 463 mobile donor clinics, specialised donation services unit, apheresis department, "100 emergency blood banks at 176 hospitals" and "8 blood banks" (as printed). Confidence: confirmed as printed; the counting basis of the 100/176 figure is not explained.
- Earlier years: 2022-23 148,903 units and 71,621 active donors; 2021-22 143,468 units; 2020-21 129,584 units and 60,932 active donors. Fifth Western Cape blood bank opened at Khayelitsha District Hospital 18 September 2019; mobile app 2017 (earlier file). Confidence: confirmed.
- IT leadership: Head of Information Technology listed as Jacques Breslaw; Manager IT Client Services (haemovigilance report contributors) Kevin de Smidt. Confidence: confirmed.
- Cyber incident: TechCentral, 30 July 2021: WCBS hit by a cyberattack on Thursday 29 July 2021; reverted to manual, offline donation, processing and testing while restoring from backup; spokeswoman Marike Gevers denied ransomware and said no ransom was sought; contractors investigating; POPIA compliance asserted. Source: https://techcentral.co.za/western-cape-blood-service-hit-by-cyberattack/109690 . Confidence: confirmed.
- BECS product used by WCBS: not found in any source read. The WCBS annual reports (2017 integrated report, 2014 annual report, 2020-2024 annual reports) exist at https://wcbs.org.za/about/annual-reports/ ; the 2024-25 PDF was keyword-searched for software/cyber/electronic terms; the run hit a connection reset on the first call and a console encoding error on the second, so the search of that PDF is incomplete. Confidence: unfound.
- WCBS "Nurses Guide to Ordering" PDF exists (https://wpwcbs.azurewebsites.net/wp-content/uploads/2025/05/Nurses-Guide-to-Ordering-interactive-FA_2105.pdf), not read this session. Confidence: uncertain.

### 2.3 Haemovigilance (national, joint SANBS/WCBS)
- The 2024 South African Haemovigilance Report is the 25th edition, compiled under the Independent Haemovigilance Committee (chair Dr Patricia Knox; compiled by Prof. Arthur Rantloane); contributors include SANBS National Haemovigilance Officer Sr Francis Ledwaba, SANBS Analytics Specialist Ms Ronel Swanevelder and WCBS IT Client Services manager Kevin de Smidt. Reporting to the national programme is voluntary and data validation is not performed in all instances. Source: https://www.wcbs.org.za/wp-content/uploads/2025/10/The-South-African-Haemovigilance-Report-2024.pdf . Confidence: confirmed.
- Scale: mid-year population 63.02 million; 1,032,630 units of blood issued; national transfusion rate 16.4 per 1,000 population (down from 16.9); serious transfusion-related adverse events 14.2 per 100,000 transfusions; near-miss reports tripled in 2024 versus 2023; incorrect blood component transfusions 33.3% of serious adverse events (29.5% previous). Confidence: confirmed.
- Data caveats caused by BECS: donor adverse events under-reported; lookback application disrupted by 12-digit unit numbers (see Gap 1). Confidence: confirmed.
- Earlier reports: 2023 (https://www.sanbs.org.za/uploads/media/medical/training_and_advisory/2023-Haemovigilance-Report.pdf), 2020 (adverse transfusion reaction rate 86.16 per 100,000 products; passive system, under-reporting), IHC report 2022. Confidence: confirmed (search).

### 2.4 Organ donation and transplant
- No national electronic transplant registry or central waiting-list database was found. Sign-up via the Organ Donor Foundation (odf.org.za); registered donors reported variously as almost 400,000 (TimesLive 2022) versus about 200,000 (2017 academic article); waiting list about 6,500 for organs and tissue with 317 organ transplants in 2024 (SAnews / Spotlight 2025-26); a 2021 Conversation article argues for a national central database and procurement agency; public and private units generally share regional waiting lists; opt-in consent. Sources: https://www.sanews.gov.za/south-africa/long-waiting-list-receive-organs-sa ; https://www.spotlightnsp.co.za/2025/09/29/sa-has-very-low-organ-donation-rates-how-can-we-fix-it/ ; https://theconversation.com/hardly-any-south-africans-are-organ-donors-what-can-be-done-to-change-this-166298 . Confidence: likely.
- South African Renal Registry (project of the South African Nephrology Society, published in the African Journal of Nephrology): 2023 report (published October 2025): 8,881 patients on chronic dialysis or transplantation at December 2023 (9,342 in 2022; 8,866 in 2021), prevalence 145 per million, 627 new patients (10.2 per million), 69.7% in private centres, private prevalence 720 versus public 44 per million; authors attribute the fall to under-reporting by centres; platform expanded as backbone of the African Renal Registry; re-established with December 2012 data. Sources: https://www.journals.ac.za/ajn/article/view/7789 ; https://www.journals.ac.za/ajn/article/view/6749 . Confidence: confirmed.
- Deceased donor rate 1.4 per million (2020 study via search summary). Confidence: likely.

---

## 3. Medical imaging

### 3.1 Public sector overall
- Healthcare Informatics Research 25(4), Oct 2019, "PACS Implementation Challenges in a Public Healthcare Institution: A South African Vendor Perspective" (https://pmc.ncbi.nlm.nih.gov/articles/PMC6859271/): ten vendor experts (at least 2 years of implementation each); PACS used in public hospitals "more than a decade"; 12 sub-themes (space, infrastructure, equipment protection, finances, IT knowledge, resistance to change, storage capacity, system maturity/no SLAs, software/hardware, workflow, vendor concerns, operator). DICOM: modality connections where "the DICOM doesn't conform" cost time. HL7 not mentioned; no vendors or hospitals named; PACS archives "always running out of space"; former darkrooms converted to server rooms judged unsafe; power cuts damage hard drives. Ethics approval UKZN HSS/1582/016M; facility data 2014. Confidence: confirmed (page read).
- Teleradiology: began 1999 in Free State, Mpumalanga and North West; SAJR 2023 survey (Schoeman and Haines, https://sajr.org.za/index.php/sajr/article/view/2647) found low and slow uptake, not embraced in the public sector, only 12 of the surveyed radiologists (14.6%) public sector. A North West rural district study (PMC10476222 via search) describes teleradiology mainly for CT reporting with a central site serving five satellite district hospitals. Confidence: likely (search summaries).
- Free State: Pelonomi Tertiary Hospital (Bloemfontein) cross-sectional study, radiographs 1 June 2018 to 1 July 2019, images from hospital PACS shown on a 2-megapixel PACS screen, re-photographed with a 12-megapixel iPhone 7 and sent by WhatsApp 2.12.5; 135 radiographs, five registrars, smartphone accuracy about 70-85% versus PACS about 86-92%; authors: phone viewing not a substitute for PACS. Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC8761606 . Confidence: confirmed (page read). Shows a full PACS workstation exists at Pelonomi and that WhatsApp is used informally.
- Stellenbosch thesis (https://scholar.sun.ac.za/items/3c9377da-5b4d-4df6-81b2-afbad010388f/full) says few PACS are operational and integrated across institutions (earlier file). Confidence: likely.

### 3.2 Province detail
- Eastern Cape: AuntMinnie 17 May 2010: Paxeramed PaxeraWeb network linking 27 government hospitals to a SITA-run central data centre. ITWeb listing "ICT tenders down to nuts and bolts" (https://itweb.co.za/article/ict-tenders-down-to-nuts-and-bolts/GxwQDM1AJ6ZMlPVo) reports EC Health intent to procure PACS plus RIS (year not visible). Getvuza listing 4E93EBC0: DICOM dry imaging printers for digital X-ray across EC facilities, 36 months. Confidence: confirmed (2010), uncertain (current).
- KwaZulu-Natal: IALCH (Durban) opened as a filmless, paperless hospital. ITWeb "Healthcare goes hi-tech" (https://www.itweb.co.za/article/healthcare-goes-hi-tech/VgZey7JAQ8ZvdjX9): Impilo Consortium including Siemens, 15-year equip-and-run contract, Siemens citing 200 integrated filmless networks. Computerworld "space age hospital": five clustered HP Alpha servers with HP StorageWorks SAN. Medicom: about USD 2 million contract (c.2003, domain-b.com) linking the hospital information system to lab analysers, radiology equipment and critical care; 800 beds. Angels Initiative lists IALCH as a comprehensive stroke centre with CT, CTA and CT perfusion. Confidence: confirmed (historic reports); present-day PACS vendor not found.
- Western Cape: tender WCGHCC0020/2024 teleradiology at Paarl Hospital awarded to Supra Healthcare Cape Town for R 8,212,674 (4 December 2024; https://www.tenders-sa.org/sa-tenders/awarded/wcghcc0020-2024-rendering-of-a-teleradiology-service-at-paarl-hospital-under-the-control-of-the-depa-cmlnt41eq0jcil204ed1q6n7e). Hartmann and Van Dyk, SAIIE 2013, maturity of teleradiology in the Western Cape public system (https://scholar.sun.ac.za/handle/10019.1/89026). Stellenbosch item on radiology service at Tygerberg (https://scholar.sun.ac.za/items/33ea19f0-b740-4173-bd79-3094ea3f7684/full), not opened. iColo teleradiology cloud for Africa (https://www.icolo.io/news/teleradiology-cloud-solution-from-anywhere-in-africa/), not opened. Confidence: confirmed (tender), unfound (PACS vendor).
- Gauteng: 12 Lodox digital radiography systems, R60 million (Engineering News, 29 May 2014); open bid for general and specialised radiography imaging equipment across Gauteng health institutions for three years, closing 25 September 2026 (contacts named on listing); radiology consumables tender GT/GDH/031/2023; specialised radiology equipment tender closing 10 Feb 2023. Charlotte Maxeke study (PMC10244939) says public PACS lags (earlier file). No PACS vendor or contract found. Confidence: confirmed (equipment), unfound (PACS).
- Limpopo, Mpumalanga, North West, Northern Cape: no PACS evidence beyond the 1999 teleradiology origin and the North West CT study.
- Medavis RIS: Netcare Pholoso Hospital radiology (Northern Radiologists, Polokwane) runs medavis RIS (https://www.medavis.com/northern-radiologists-polokwane-za/; success story PDF). Confidence: confirmed (vendor page).

### 3.3 Private sector radiology and PACS
- Netcare: eRAD RIS/PACS at Pinehaven Hospital (Motshudi, Bergman and Ross Radiologists) (https://erad.com/news/erad-expands-install-base-south-africa-netcare-pinehaven-hospital/); medavis RIS at Pholoso. eRAD also via reseller Cryanic Medical Solutions to SCP Radiology (AuntMinnie). Confidence: confirmed (vendor/trade press, years 2011-2017 for several).
- Life Healthcare: Agfa Impax 6.0 PACS and RIS selected for Fourways Hospital, with plan to extend to other group hospitals (ITN, https://www.itnonline.com/content/south-african-healthcare-group-selects-agfa-ris-pacs ; AuntMinnie). Agfa added AXIM (Pty) Ltd to its South African partner network in 2024. Confidence: confirmed (dated).
- De Beer and De Jager radiologists, Pretoria: Sectra enterprise image management (PACS plus vendor-neutral archive, 3D, lesion tracking), 11 radiologists, more than 30 modalities, three centres (Muelmed Mediclinic, Lifestyle Radiology, Medforum Mediclinic); first order under a South African distribution agreement with Tecmed Africa; press release 16 December 2016. Source: https://medical.sectra.com/news-press-releases/news-item/084302271ED35A65 . Confidence: confirmed.
- RamSoft partnered with Konica Minolta Medical South Africa (Bidvest), 16 July 2012 (AuntMinnie Europe). Solumed RIS launched in Johannesburg February 2025. Confidence: confirmed (articles).
- Private-sector teleradiology: after-hours reporting common; no named platform confirmed. Confidence: likely.
- DICOM/HL7 in private groups: no source gives protocol details beyond vendor product descriptions (DICOM implied by PACS/modality integration; Sectra VNA is vendor-neutral archive). Confidence: uncertain.

---


---

## 4. Addendum from resumed session (2026-11-01): Gauteng, Western Cape, Free State, regulations

### 4.1 Gauteng public imaging (corrects the "Gauteng: unfound" entries above)
- Charlotte Maxeke Johannesburg Academic Hospital (CMJAH) PACS and RIS launch: 22 June 2016, led by Premier David Makhura, cost R50 million over five years; vendor not named in the article; doctors to access information electronically including on iPads or cellphones; other first-wave hospitals: Rahima Moosa Mother and Child, Tambo Memorial, Helen Joseph, Edenvale, Leratong; department aimed to have all public hospitals connected and live by end of March 2017. Source: https://citizen.co.za/northcliff-melville-times/?p=229484 . Confidence: confirmed.
- Vendor/technology detail for CMJAH: search summary of a Wits study states the onsite PACS network was set up by Philips and uses software called iSite, installed 2016. The SAJR article itself (page fetched) does not name iSite or Philips. Confidence: likely (secondary summary), uncertain (not in fetched text).
- SAJR 27(1), 10 May 2023, "Clinicians' perspective of picture archiving and communication systems at Charlotte Maxeke Johannesburg Academic Hospital": cross-sectional survey 1 September 2021 to 31 January 2022; 372 clinician responses, 54.5% response rate; PACS "viewed beneficial by most clinicians"; findings said to help future hospital or provincial-wide PACS deployment. Submitted 29 October 2022. Source: https://sajr.org.za/index.php/sajr/article/view/2578 . Confidence: confirmed.
- Provincial rollout statistic (Gauteng Department of Health sponsored article, Daily Maverick, 17 December 2025): PACS rolled out across 18 Community Health Centres and 17 hospitals; no date. Source: https://www.dailymaverick.co.za/article/2025-12-17-gauteng-health-mec-nomantu-nkomoralehoko-a-legacy-of-transformation-and-triumph . Self-reported. Confidence: confirmed as a claim.
- Same article: Health Information System (HIS) Clinical Module live at Mamelodi Hospital, Charlotte Maxeke (Cardio Thoracic) and Dr George Mukhari (Emergency Unit and 18 wards); R81.4 million on queue management and record digitisation; R14 million on Lodox forensic machines and biometric (fingerprint) body tagging; "Gauteng Scheduled Emergency Transport model" handling 87% of emergencies within the golden hour; over 5,000 community first responders trained. Confidence: confirmed as a claim; no dispatch system named.
- June 2025 (Citizen, 9 June 2025): Gauteng department "upgrading" PACS to streamline image storage and reporting; new MRI machines at Steve Biko Academic, Dr George Mukhari Academic and Charlotte Maxeke (commissioned March 2025); Chris Hani Baragwanath has a functional MRI; Tembisa MRI installation delayed by fire; MRI backlog Charlotte Maxeke 2,347 patients, Dr George Mukhari 450; helium-free MRI being explored; no vendors, teleradiology or AI mentioned. Source: https://www.citizen.co.za/news/south-africa/gauteng-hospitals-get-major-tech-overhaul-to-slash-scan-backlogs . Confidence: confirmed.
- University of Johannesburg thesis (search summary): Gauteng has reached a stage where PACS and RIS have been widely implemented. Medical Imaging/HospiMedica older item: Siemens Healthcare to provide a RIS to some Gauteng DoH hospitals (page body not retrievable; date unknown). Confidence: uncertain.
- Gauteng integrated Health Information System (HIS): South Rand Hospital first site, patient administration and billing went live at 11:00 on 2 November 2022, replacing Medicom; phase 2 Clinical Module; at that date patient administration and billing live at 18 hospitals and 31 community health centres (ICT projects head Patrick Sello: about 20 hospitals incl. Chris Hani Baragwanath, George Mukhari, Charlotte Maxeke, Kalafong, Helen Joseph, Tembisa); SMS appointment reminders; vendor and product not named. Source: https://www.citizen.co.za/alberton-record/news-headlines/2022/11/04/hospital-goes-live-with-a-single-integrated-health-information-system/ . Confidence: confirmed.
- Gauteng record digitisation: Mintgroup with the Gauteng Department of Health; over 800,000 patient files (over 42 million pages) digitised at Chris Hani Baragwanath as pilot; stated target of digitising at least "800 million" records across all 37 Gauteng hospitals over 36 months (figure internally inconsistent); stored in a secure cloud; to be integrated into the HIS and to expand queue management and radiology image archiving (PACS); article 22 July 2025. Source: https://magic828.co.za/transforming-healthcare-gauteng-digitises-800000-patient-files-at-chris-hani-baragwanath-hospital/ . Confidence: confirmed as reported, numbers uncertain.

### 4.2 Western Cape health information systems relevant to EMS, emergency centres and imaging
- HECTIS (Hospital and Emergency Centre Tracking Information System): web-based, in use at 64 health facilities (hospitals and primary care) in the Western Cape only; developed "as an in-house custom-built system" by an emergency physician at Mitchells Plain Hospital; not in a pilot phase; not implemented in any other province "as it is not part of the national Emergency Medical Services Plan" (written reply NW493, 14 March 2024). Source: https://pmg.org.za/committee-question/25074/ . Confidence: confirmed.
- Single Patient Viewer (SPV): prototype web-based electronic health record and data access portal pulling patient data from many separate Western Cape systems that share a unique health identifier (IJPDS, Dec 2020, https://ijpds.org/article/view/1614 ; full text not retrieved because of a redirect). Confidence: likely.
- Clinicom: ITWeb reports a Sekunjalo Investments subsidiary (HST) implemented Siemens' Clinicom Health Information System, a Cache-based system with a shared Patient Master Index, at the Provincial Administration of the Western Cape (https://www.itweb.co.za/article/hst-implements-cache-based-health-information-system/KA3Ww7dlBey7rydZ; article date not visible). Confidence: confirmed (headline summary).
- PACS: an individual's LinkedIn profile claims a project to deploy PACS/RIS at three large tertiary hospitals for Western Cape Health on behalf of Philips Medical South Africa. Confidence: uncertain (self-description).
- EMS communication: Emergency Communication Centres (ECCs) are located in the districts of Cape Town, Cape Winelands, West Coast, Overberg, Eden and Central Karoo; the national medical emergency number is 10177 (112 from cell phone) and the City of Cape Town general emergency number is 107 (City of Cape Town document, https://resource.capetown.gov.za/documentcentre/Documents/Procedures,%20guidelines%20and%20regulations/About%20Public%20Emergency%20Communication.pdf). The Western Cape dispatch method is described as "home-grown" with characteristics of Criteria Based Dispatch; a 2020 Prehospital and Disaster Medicine study of the Western Cape Government EMS dispatcher triage accuracy found under- and over-triage. Outages: Western Cape Government urged use of 107 during EMS communications centre technical problems and announced 10177 restored in February 2022. Confidence: confirmed.
- Volumes: festive season 15 Dec 2024 to 15 Jan 2025 EMS responded to 69,249 calls (23,383 life-threatening, 45,866 urgent) (Western Cape Government and Bizcommunity); 2025/26 festive season COO Saadiq Kariem cited 47,351 emergency calls (different definition or period unclear); 2024/25 annual report: 512,997 admissions, 1.48 million outpatient visits, more than one million emergency cases, Villiersdorp Ambulance Station R8.45 million. Director for EMS Craig Wylie: urban crews do ten to twelve incidents a day; SAPS escort waits can exceed sixty minutes. Sources: https://westerncape.gov.za/health-wellness/article/western-cape-emergency-centres-and-ems-festive-season-activity-report-highlights-high ; https://iol.co.za/capeargus/news/2025-10-24-western-cape-health-system-manages-over-one-million-emergency-cases-amid-financial-constraints/ ; https://www.ewn.co.za/2026/01/22/wc-govt-says-emergency-health-services-were-under-extreme-pressure-over-festive-season . Confidence: confirmed (press).
- Trauma: Cape Argus 21 Jan 2026 headline: trauma cases spike to 423 gunshot wounds and 4,450 stabbings in Western Cape. Confidence: confirmed (headline).

### 4.3 Free State, KwaZulu-Natal e-health
- Free State e-Health strategy launched 21 November 2023 at the Free State School of Nursing, Bloemfontein, with Vodacom as named partner: electronic health records, telemedicine, automation of paper processes, mobile health apps, an "assisted reality" medico-legal surveillance system; ambulance tracker expected to speed response; demonstration of a paramedic consulting a specialist at Universitas Academic Hospital in real time. Premier Mxolisi Dukwana, MEC Mathabo Leeto. Source: https://www.ofm.co.za/article/centralsa/329341/e-health-strategy-to-save-lives-in-the-free-state-video . Confidence: confirmed.
- KwaZulu-Natal e-health: search summaries say the eHealth electronic patient record platform was functional in 42 hospitals, fibre installed in 42 hospitals, 22 hospitals had started implementing in a 2022 budget vote, with Addington listed (IOL Mercury article returned 403; PMG tabled committee report 3576 not opened). No KZN PACS/RIS rollout found. Confidence: uncertain.

### 4.4 Regulatory framework for EMS records
- Regulations relating to the Standards for Emergency Medical Services, 2022, Government Notice 2819, issued under the National Health Act; apply to public and private EMS (SANDF excluded); text at https://lawlibrary.org.za/akn/za/act/gn/2022/2819/eng@2022-12-02 (page returned 403 to the fetcher, so provisions on PRFs and information systems were not read). No source read quotes a mandatory electronic PRF requirement. The 2017 EMS regulations had a section titled "Information concerning Emergency Medical Service" (acts.co.za). Confidence: confirmed that regulations exist; content unread.
- Wits article on non-compliant health record-keeping and progress toward a digital remedy (https://ajic.wits.ac.za/article/view/18892), not read. Confidence: uncertain.

### 4.5 Blood bank vendor landscape (context for the BECS question)
- Searching vendor names against "Western Cape" returned no WCBS system. Generic vendor facts found: MAK-SYSTEM is described by SCC-affiliated directories as a blood bank and transfusion service information management system; Haemonetics SafeTrace Tx is a hospital blood bank information system; SCC SoftBank can run in-house on IBM hardware or in the cloud (sourceforge/intuitionlabs listings). None ties to South Africa. Confidence: confirmed as general vendor facts, no SA link.

---


## Unanswered / could not find
- SANBS electronic ordering: which hospitals place orders electronically, and over which protocol (HL7 v2, ASTM, web portal). None of the SANBS integrated reports, haemovigilance reports, FDA/MAK-SYSTEM material or news read names this.
- MAK-SYSTEM/eProgesa database engine, SANBS implementation partner, contract value and tender (BECS initiated 2020, live November 2023).
- WCBS BECS vendor and donor system; full keyword search of the WCBS 2024-25 annual report did not complete (connection reset, then a console encoding error since fixed in the script).
- Meaning of "100 emergency blood banks at 176 hospitals" in the WCBS report.
- Public PACS vendor and extent in Gauteng (Charlotte Maxeke, Chris Hani Baragwanath), KwaZulu-Natal today, Western Cape (Groote Schuur, Tygerberg), and the other provinces; Eastern Cape status after 2010; HL7 usage anywhere in the public sector.
- ePRF/ePCR vendor and deployment status in any province other than the Western Cape (where the vendor product is also unnamed beyond Dimension Data as partner); Gauteng CAD vendor; Limpopo CAD product name; Northern Cape CAD vendor; Free State, North West details.
- Netcare 911, ER24 and Mediclinic Emergency ePRF products; air ambulance data systems.
- SATS triage data capture nationally; any national trauma registry.
- National organ transplant registry or waiting-list software; who operates allocation systems.
- Coverage note: about 75 searches and fetches were run across two sessions (a search limit interrupted the first one, then reset). The file is about 180 lines, not 1,000; no padding was added. Absence of a finding is not evidence of absence.

- Update (2026-11-01): Gauteng PACS existence/scale now supported (2016 CMJAH launch, Dec 2025 claim of 18 CHCs and 17 hospitals) but vendor contract unconfirmed; GN 2819 record provisions unread (403); Gauteng EMS CAD and HIS vendors unnamed; KZN eHealth vendor/PACS unfound.


---

# PART E2: OTHER STATE SERVICES, NGO/DONOR SYSTEMS AND COMMUNITY HEALTH (SECOND PASS)

*Source file: research/phase_E2_other_state_ngo_community.md (110 lines)*

# Phase E2: Other state services, NGO/donor programmes and community health systems (deep pass)

Compiled 2026-10-31 by research agent E2 for SAHealth by DEXA. Facts only: how these systems exist in real life. No recommendations.

Method note. Searches (WebSearch) and page fetches (WebFetch) were run this session, plus Python requests + BeautifulSoup scrapers in C:\SA Health\research\scrapers\ (E2_common.py, E2_momconnect_datim.py, E2_cohort_systems.py, and later E2_* files). Confidence tags: confirmed = text seen in a fetched page this session; likely = search snippet or secondary summary; unverified = background knowledge or lead only. This file supplements, and does not replace, C:\SA Health\research\phase_E_emergency_blood_imaging_other_state_ngo.md.

---

## Round 6 gap findings

### G1. National single EMR for PHC and the provincial system map (NDoH parliamentary reply NW4495)

- What it is: a Parliamentary reply by the Minister of Health (Question NW4495) states "Currently there is no single EMR or EHR implemented" in South Africa, and that NDoH is developing a single common EMR for public primary health care (PHC) facilities.
- Phase 1 formally went live 28 March 2025, at 36 PHC facilities and 1 general practitioner practice (37 beta sites). Scale-up was expected to start January 2026, subject to a tender for a change-management service provider.
- Beta sites by province: Free State, Dihlabeng LM, 9 facilities, 22-23 Oct 2024; KwaZulu-Natal, Nquthu LM, 8, 5-6 Nov 2024; Northern Cape, Phokwane LM, 6, 20-21 Nov 2024; Mpumalanga, Steve Tshwete LM, 6, 29-30 Jan 2025; North West, Mahikeng LM, 8, 12-13 Feb 2025.
- Provincial hospital/facility information systems named in the reply: Eastern Cape HMS2 (at least 44 hospitals, various stages); Free State Meditech (legacy, 3 hospitals) plus HMS2 (16 hospitals since March 2023); Gauteng "Health Information System on SAP platform" (hospitals, no count given); KwaZulu-Natal "eHealth system" (42 public hospitals, phased since March 2020); Western Cape Clinicom (53 hospitals), PHCIS (308 PHC facilities), PREHMIS (City of Cape Town PHC facilities), ECCR (Emergency Centre Clinical Record, recently commenced). Limpopo, Mpumalanga, North West and Northern Cape: "none" at hospitals.
- HPRS (Health Patient Registration System) is described as the digital patient administration system at PHC facilities.
- ICT readiness (Ideal Clinic self-assessment 2024/25, 3,333 facilities): 52 with no functional computers, 173 with no internet, 278 with no functional fixed-line telephone. NDoH budgeted R20 million for LTE routers and data in 2025/26, installation expected from September 2025.
- Connections: HPRS feeds the EMR; HMS2/Meditech/Clinicom are hospital-level; DHIS2 is the aggregate layer.
- Source: https://pmg.org.za/committee-question/31734/ . Confidence: confirmed (fetched).

### G2. TIER.Net to DHIS to DATIM flow (HIV programme data and PEPFAR reporting)

- TIER.Net is the national electronic HIV patient monitoring system; visit-level data from the patient file is entered at facility level into the national database. A 2020 description says TIER.Net gives real-time access to individual and aggregate HIV data and is "integrated with the DHIS".
- One implementing partner pipeline documented: the Aurum Institute uploads DOH data to a central Aurum warehouse, where Programme Monitors validate it and it is mapped to DATIM fields using a tool called MARS. This is one partner's process, not a national standard.
- DATIM (PEPFAR Data for Accountability, Transparency and Impact) is PEPFAR's quarterly indicator reporting system (a DHIS2-based platform). A FHI360 DHIS2 tracker package brief says individual-level tracker data can be converted to aggregate in standard DATIM format.
- Data quality evidence: Frontiers in Public Health 2020 (10.3389/fpubh.2020.00100) found TIER.Net misclassified 36% of patient outcomes (overestimating loss to follow-up, underestimating mortality and transfers out). A second paper reports incomplete reporting across TIER.Net, Road-to-Health booklets and DHIS.
- Sources: https://auruminstitute.org/areas-of-expertise/hiv/monitoring-evaluation-and-reporting ; https://www.frontiersin.org/article/10.3389/fpubh.2020.00100/full ; https://pmc.ncbi.nlm.nih.gov/articles/PMC7154050 ; https://www.fhi360.org/wp-content/uploads/2024/02/resource-dhis2-tracker-metadata-package-brief.pdf ; AMBIT SA data inventory https://sites.bu.edu/ambit/files/2019/09/AMBIT-SA-data-inventory-2019-02-05.pdf . Confidence: likely to confirmed.

### G3. MomConnect: platform owner, builder and handover

- NDoH site states MomConnect "launched 2014", almost 5 million mothers registered in over 95% of public health facilities, SMS or WhatsApp, chatbot plus human-operated helpdesk. Helpline 0800 012 322, WhatsApp 0600 123 456.
- ITU WSIS Prizes 2026 (winner) entry: platform "co-designed, owned, and governed" by NDoH; 11 official languages; helpdesk "with AI triage functionality"; "a phased handover plan is currently underway to transition MomConnect to full NDOH ownership, where it will be sustainably funded by the national treasury"; and "Reach Digital Health is transitioning full technological ownership to the government". It also states MomConnect "is built to integrate with national health information systems such as DHIS2 or OpenHIM". Users recruited by health workers at first ANC visit in public facilities.
- Sources: https://www.health.gov.za/?p=21258 ; https://www.itu.int/net4/wsis/stocktaking/Prizes/2026/Details/17720121703313989 (both fetched by scraper E2_momconnect_datim.py). Confidence: confirmed.
- Note: operator historically reported as Praekelt.org (now Reach Digital Health after the Praekelt/Reach separation). The WSIS text names Reach Digital Health as the transitioning technical owner. Turn.io was built by Praekelt (see section on mHealth).

### G4. Provincial analytics: Western Cape Provincial Health Data Centre (PHDC) and Patient Master Index

- A Western Cape Health Data Centre presentation (Andrew Boulle, UCT School of Public Health with WCDoH) lists PREHMIS among clinical systems that record electronic data against a shared patient registration number in the Patient Master Index (PMI). It is the best-known provincial integrated analytics platform in SA. Source: https://www.insight.co.za/wp-content/uploads/2017/01/Andrew-Boulle-WC-Health-Data-Centre.pdf . Confidence: likely (search snippet).
- PMC7482518 and a NISC abstract ("Improving continuity of care through the use of electronic records: a South African perspective") cover this record-linkage approach. Confidence: likely (not opened).

### G5. OpenHIM / HIE
- MomConnect/WSIS text claims interoperability with "DHIS2 or OpenHIM". No separate SA OpenHIM production deployment other than the NDoH Health Normative Standards Framework / Health Information Exchange context was verified in this section; see later sections for any further hits.

---

## 1. South African Military Health Service (SAMHS)

### 1.1 Structure and facilities
- What it is: SAMHS is the medical branch of the South African National Defence Force (SANDF), reporting under the Department of Defence (DoD); it runs military hospitals and health centres and deploys medical personnel in operations. Hospitals named in a 2022-23 DoD presentation (via search summary): 1 Military Hospital (Thaba Tshwane, Pretoria; established 1931), 2 Military Hospital (Wynberg, Cape Town), 3 Military Hospital (Tempe, Bloemfontein). Source: https://www.wikipedia.org/wiki/SAMHS ; https://defenceweb.co.za/tag/1-military-hospital/ . Confidence: likely.
- 1 Military Hospital repair-and-maintenance (RAMP) project: launched by Public Works in 2001 to restore the hospital as the SANDF flagship; as of March-May 2025 reporting still incomplete, with the Joint Standing Committee on Defence expressing concern at the "paralysed" project and corruption claims; one source says the hospital lost its Level 4 accreditation for AU/UN peace-keeping support because of non-completion. Sources: https://thepost.co.za/news/south-africa/2025-03-31-1-military-hospital-a-decade-of-failed-renovations-and-corruption-claims/ ; https://newsletter.en.creamermedia.com/article/parliamentary-defence-committee-highlights-paralysis-in-hospital-project-and-in-prosecutions-2025-05-26 ; https://www.engineeringnews.co.za/article/parliamentary-committee-concerned-about-ongoing-expenditure-for-1-military-hospital-project-2021-09-03 . Confidence: likely (headlines/snippets).
- DoD annual performance plan flagged deteriorating facilities, obsolete equipment and staffing shortages for SAMHS; Sunday Times 14 Jul 2013 reported the DoD 2011-12 annual report admitted that maintenance backlogs at its three military hospitals impacted health care delivery. Confidence: likely.

### 1.2 Records systems
- No source found this session naming an SAMHS electronic health record product, vendor or database (targeted searches returned only the US SAMHSA agency or US/UK military EHR material). Not found: whether SAMHS patient records are paper, a Defence-internal HIS, or integrated with any provincial or NDoH system; whether SAMHS patients appear in HPRS or DHIS2. Unanswered item (see end).
- SAMHS issues a periodic news magazine (2nd edition 2024 on issuu: https://issuu.com/samhscorpcomm/docs/samhs_news_magazine_2nd_edition_2024), not opened. Confidence: unverified.
- Military hospitals also treat civilians under arrangements with provinces/NDoH (background, unverified).

---

## 2. Department of Correctional Services (DCS) health care and records

### 2.1 Structure and scale (DCS Annual Report 2024/25, parsed with E2_pdf_grep.py)
- Operator: DCS (Vote 22). Health care is a sub-programme of Programme 4 "Care" (Health Care Services, Nutritional Services, Hygiene Services). Care in facilities is delivered by DCS-employed professionals plus referral to public hospitals via provincial health departments (PMG committee briefings).
- Inmate population 31 March 2025: 166,008 (up 9,408 from 156,600 in 2023/24). Gauteng alone: 40,581 inmates. State patients (mentally ill, awaiting placement in designated mental health establishments) are held in correctional facilities beyond the 14-day transfer requirement in Chapter VI of the Mental Health Care Act 17 of 2002 because of limited beds.
- Workforce 31 March 2025 (Table 2.8, partially read): professional nurses 792, pharmacists 38, post-basic pharmacist assistants 13, medical practitioners 14 (filled), with "lack of funded posts" for doctors, pharmacists and healthcare managers in some regions.
- Outcome indicators 2024/25: offender viral load suppression 99% (1,157 of 1,171); new pulmonary TB cure rate 98% (249 of 254); diabetes screening 79,075 inmates aged 40+; hypertension screening 74,629; treatment initiation 99.9% (1,510/1,511) hypertension and 100% (178/178) diabetes.
- Medical Parole Advisory Board (Section 79, Correctional Services Act 111 of 1998): 80 new applications in 2024/25; 38 recommended, 27 not recommended, 15 applicants died before consideration.
- Source: https://www.gov.za/sites/default/files/gcis_document/202510/dcs-ar-2024-25.pdf (344 pages). Confidence: confirmed.

### 2.2 Records / information systems
- Health data tool: DCS states "an excel based Comprehensive Data Tool for communicable and non-communicable diseases was reviewed to ensure integration of health care programmes"; it says investment is needed to develop "an integrated Health Information System" in the medium to long term, citing "poor and unreliable data". So the DCS health reporting layer in 2024/25 is spreadsheet-based, not a dedicated electronic health record. Confidence: confirmed.
- Offender management: Integrated Inmate Management System (IIMS); "Further rollout of the Integrated Inmate Management System (IIMS) is currently on hold pending the outcome of the arbitration or dispute resolution process". Audit committee: "IIMS rollout remains a challenge", plus budgetary constraints for the Master Information Systems Security Plan. Confidence: confirmed. (IIMS is the offender record, not the clinical record.)
- TB register: a 2015 Minister of Health reply said inmate TB information is in TB registers at each correctional facility. Source: https://pmg.org.za/committee-question/965/ (Question NW3099). Confidence: likely.
- Guidelines: "Guidelines for the Management of TB, HIV and STIs in Correctional Facilities" (screening all inmates for TB at least twice a year, per that reply). Confidence: likely.
- Continuity: released inmates with HIV and TB are linked to community providers. Pharmacies established in selected Management Areas.

### 2.3 Donor funding and implementing partner
- DCS signed an MOU with TB HIV Care (NGO) for HIV, STI, TB, viral hepatitis and non-communicable disease implementation.
- DCS states "The withdrawal of the United State President's Emergency Plan for AIDS Relief (PEPFAR) funding affected the Department's ability to provide essential health care services", including HIV and TB screening and prevention such as PrEP and PEP. Confidence: confirmed. A documented PEPFAR-to-government-service dependency.
- DCS 2025/26 annual report exists on PMG (https://static.pmg.org.za/DCS_Annual_Report_2025-2026.pdf), not opened. Treasury ENE 2026 Vote 22 says DCS plans to further reduce HIV transmission (snippet). Confidence: likely.

### 2.4 Connections
- No electronic interface between the DCS spreadsheet tool and TIER.Net/DHIS2 was found (unanswered).

---

## 3. Municipal and metro health services

### 3.1 City of Cape Town: PREHMIS
- What it is: PREHMIS = Patient Record and Health Management Information System, the City of Cape Town's PHC system. Its own page: it captures "basic patient information and the services provided to patients so that automated reports can be generated"; focus is management information; "not a full electronic medical record"; the paper patient folder is not replaced. Powered by Symfony and Sphinx Search; revision shown 3.26Q2.1. Source: https://prehmis.capetown.gov.za/content?page=about . Confidence: confirmed.
- Used at City of Cape Town PHC facilities; NDoH reply lists it alongside provincial PHCIS (308 PHC facilities) and Clinicom (53 hospitals). A Western Cape Health Data Centre presentation says PREHMIS records link to the Patient Master Index registration number shared across Western Cape systems. Sources: https://pmg.org.za/committee-question/31734/ ; https://www.insight.co.za/wp-content/uploads/2017/01/Andrew-Boulle-WC-Health-Data-Centre.pdf . Confidence: confirmed / likely.

### 3.2 City of Johannesburg
- e-Health@Joburg: decision to introduce an electronic health records system June 2016 (ITWeb, 7 Aug 2019); online EHR replaced paper; rolled out across 66 of 81 PHC facilities by Aug 2019; 64 of 81 by 2018 with the 500,000th patient registered at Halfway House Clinic (Citizen, 29 Aug 2018); 709,765 patients in 2019 per another report. Public-private partnership with Altron (per Citizen). ITWeb did not name the vendor. Smart queueing with cellphone booking was planned.
- Sources: https://itweb.co.za/article/electronic-system-improves-joburgs-primary-healthcare/Pero3qZgoeevQb6m (fetched) ; https://www.citizen.co.za/randburg-sun/news-headlines/2018/08/29/joburg-ehealth-system-reaches-half-a-million-patients/ . Confidence: confirmed for ITWeb figures; likely for Altron.
- 2023 phase two: City announcement (2 Aug 2023) of a new e-Health programme with contractors tailoring an open-source system, intended for all 79 clinics and eventually mobile clinics; in development phase. Source: https://joburg.org.za/media_/Newsroom/Pages/2023%20News%20Articles/August/New-e-Health-programme-promises-to-transform-healthcare-in-the-City.aspx . Confidence: likely (snippet).

### 3.3 Tshwane, Ekurhuleni, eThekwini
- No source found for a municipal PHC records system in these three metros. Most clinics in Gauteng and KZN metros are provincial and use provincial/NDoH systems (HPRS, TIER.Net, DHIS2). Confidence: background-unverified. Listed under unanswered.

### 3.4 Gauteng provincial HIS (SAP-based, Gijima-led), context for metro clinics
- NDoH reply lists "37 hospitals with SAP - Health Information System (HIS)". Gauteng (May 2024): patient administration, billing and finance modules integrated across all 37 hospitals and 33 Community Health Centres; clinical module fully operational at Mamelodi Hospital and Charlotte Maxeke Johannesburg Academic Hospital; "one-patient-one-file". Legacy systems replaced: Medicom and PAAB.
- Spotlight (13 Jul 2022): vendor Gijima; tender awarded 2020 and run by SITA; worth R339m (ITWeb); about R150m spent at that time; pilot Nov 2020 - Apr 2021 at Hillbrow, Lillian Ngoyi, OR Tambo, Stretford, Discoverers and Alexandra CHCs; later Sebokeng, Bheki Mlangeni, Jubilee, Mamelodi, Thelle Mogoerane hospitals. Spotlight could not confirm interoperability with DHIS or NHI systems. The 2008 Baoki consortium R1.2bn tender was cancelled after more than R400m was paid with no system installed.
- Paper-file digitisation: announced 17 May 2024, target at least 800 million records within 36 months; pilot at Chris Hani Baragwanath Academic Hospital and Rahima Moosa; focus areas maternity, patient administration, mental health, chronic care.
- Sources: https://www.spotlightnsp.co.za/2022/07/13/differing-views-on-gautengs-new-health-information-system/ ; https://www.gov.za/news/media-advisories/gauteng-health-embarked-digitisation-patient-files-17-may-2024 . Confidence: confirmed (fetched).

---


---

# PART F: PATIENT JOURNEYS, DATA FORMATS, LAW AND STATISTICS

*Source file: research/phase_F_journeys_formats_law_stats.md (473 lines)*

## Round 6 gap findings

Scope note: Phase F (patient journeys, formats, law, statistics) for SAHealth (DEXA). Research date 31 Oct 2026. Method: base files read (RESEARCH.md, podcast_source.md), three live web searches (FHIR pilots, NHI litigation, Information Regulator/health breaches), plus documented domain knowledge of SA guidelines, standards and statute. Every entry carries a confidence tag. Where a fact came from a live search in this round it is marked [R6-search]; everything else is documented background knowledge that was NOT re-fetched this round and should be re-verified against the primary source before use in the video (confidence is lowered accordingly). No solutions or recommendations are offered anywhere in this file.

### Gap Q1: National or provincial FHIR pilots

- **First national Digital Health Interoperability Projectathon.** A LinkedIn post (by an interoperability practitioner, date not visible in the snippet) describes South Africa's first national "Digital Health Interoperability Projectathon", validating interoperability "based on HL7 FHIR standards", run on the IHE "Gazelle" test platform with the IHE Catalyst team, opened by Dr Nicholas Crisp, Deputy Director-General for NHI at the National Department of Health (NDoH). Source: https://za.linkedin.com/in/kubashen-bash-govender (search result snippet) [R6-search]. Confidence: likely (secondary, undated).
- **Digital Health Conformance Testing Laboratory.** Parliamentary reply (November 2025, PMG question NW6570 to the Minister of Health) reports NDoH "has commenced with the establishment of the Digital Health Conformance Testing Laboratory" for interoperability conformance testing of patient information systems. Source: https://pmg.org.za/committee-question/34165/ [R6-search]. Confidence: likely (snippet-level; full reply not read).
- **Health Information Exchange (HIE) independent assessment.** Same reply: Africa CDC was to conduct an independent assessment of the status of the national Health Information Exchange in the week of 2 December 2025. Confidence: likely. Outcome not found.
- **National Health Information Committee (NHISSA)** created to align NDoH with provinces on information systems (same reply). Confidence: likely.
- **Health Normative Standards Framework (HNSF) for Interoperability in eHealth** published 2014 (Government Gazette; updated later). Selects HL7 (v2.x and v3/CDA), DICOM, ICD-10, SNOMED CT? (SNOMED recommended in the framework as the clinical terminology; the HNSF names standards for messaging, terminology, identification, security). Source: https://www.itnewsafrica.com/africa-by-region/southern-africa-africa-by-region/e-health-framework-in-development-for-south-africa/ and https://ebooks.iospress.nl/pdf/doi/10.3233/SHTI190175 [R6-search]. Confidence: confirmed for existence/2014, likely for content detail.
- **OpenHIE reference.** wiki.ohie.org lists South Africa's NHI-era HIE architecture (client registry = HPRS, facility registry, terminology service, shared health record, interoperability layer) https://wiki.ohie.org/x/SwDeAQ [R6-search]. Confidence: likely; page content not read. The NDoH 2025 paper "The Emerging South African Digital Health System" (cited in base) is the primary description of the HIE; HPRS functions as client registry.
- **Provincial FHIR pilots.** No publicly documented provincial FHIR pilot was found in this round. Western Cape PHDC is a data warehouse not FHIR-based (documented). Confidence on absence: uncertain (see Unanswered).
- **Private sector FHIR.** Not found in this round for SA-specific production scale. Some vendors (e.g. open-source and commercial EHRs) advertise FHIR APIs; no SA registry of them found. Confidence: uncertain.

### Gap Q2: Compact register of named systems, vendors, standards

See section "Register of every named system, vendor and standard" near the end of this file.

### Other fresh findings this round (R6-search)

- **NHI Act at Constitutional Court.** The Constitutional Court heard the Board of Healthcare Funders (BHF) and Western Cape government challenges on 5-7 May 2026 and "reserved judgment". Grounds: adequacy of public participation by Parliament (National Assembly and NCOP). Sources: https://www.ewn.co.za/2026/05/07/concourt-reserves-judgment-in-nhi-challenge ; https://www.businessday.co.za/news/health/2026-05-03-constitutional-court-hears-challenges-to-parliaments-handling-of-nhi-bill/ ; https://bowmanslaw.com/insights/south-africa-national-health-insurance-hearing/ . Related High Court (substance) challenges stayed after the President and Minister undertook not to implement/proclaim the Act pending the ConCourt ruling. No judgment found as of the search. Confidence: confirmed (hearing, reservation), likely (stay detail). Also: Minister Motsoaledi disclosed an NHI litigation budget (IOL, 25 Apr 2026; figure reported as ~R74 million in BusinessTech https://businesstech.co.za/news/government/857810/r74-million-nhi-showdown-in-south-africa/ ). Confidence: likely.
- **Information Regulator and NHLS.** Daily Maverick (23 Mar 2025) reports the Regulator demanded details from NHLS about safeguards in place when the July 2024 cyberattack hit the NHLS system. https://www.dailymaverick.co.za/article/2025-03-23-national-health-laboratory-cyberatack-regulator-demands-details.md . Confidence: confirmed (headline); outcome unknown.
- **Enforcement notices.** The Regulator's page https://inforegulator.org.za/enforcement-notices/ lists 2026 notices (Sibanye Stillwater 10 Jun, Central Johannesburg TVET College 2 Jun, one dated 20 May); none seen naming a health provider. Lancet Laboratories enforcement notice of Sept 2024 (breach notification failures) is the health-lab precedent. Confidence: likely.

---

# Part 1. Real patient journeys

General note on sources: journeys below are assembled from the publicly known operating model (NDoH guidelines/SOPs: Maternal Care Guidelines, Standard Treatment Guidelines and EML, ART Clinical Guidelines 2023 (Universal Test and Treat, TLD), National TB Programme guidelines, Adherence Guidelines for HIV, TB and NCDs, SOP for the Road to Health Booklet, PHC Data Elements/NIDS dictionaries; Western Cape and Gauteng published SOPs; peer-reviewed workflow studies). The base RESEARCH.md already confirms the broad architecture; here steps and artefacts are enumerated. Individual form numbers (e.g. DHIS2 input form names) vary by province and year; confidence is mostly "likely" unless stated. Principal actors across public journeys: patient; clerk (registration/filing clerk); nurse (professional nurse, enrolled nurse, nursing assistant); doctor/medical officer; pharmacy assistant/pharmacist; data capturer (often an employed or NGO-funded person, e.g. funded through PEPFAR partners); information officer / PHC supervisor / facility manager; district/sub-district information officer; NHLS lab staff; porters/EMS crew.

Universal artefact at public facility entry: the **registration step** - clerk asks for SA ID or other document; looks up HPRS (where connected) or the facility patient file index; assigns/retrieves a **facility folder number** (paper file in a registry/filing room, in many facilities filed by folder number, sometimes by HPRN); a **daily headcount/tally** entry is created in the **Daily Tally Sheet / PHC register** for the service; the **paper patient folder/file (Patient Record)** is carried to the consulting room. Storage: file room (paper), HPRS (central, national, demographics only), tally sheet and register (paper at facility), then monthly totals to DHIS2.

## 1.1 Antenatal care and delivery (public sector)

1. **Pregnancy confirmation / booking visit at PHC clinic.** Nurse (midwife or PHC nurse) confirms pregnancy (urine test); opens a **Maternity Case Record (MCR)** (the national patient-held antenatal/labour/postnatal record, also called "Maternity Case Record (MCR)" in the Maternal Care Guidelines). Artefacts: MCR (paper, held by the woman; copies/duplicates not routinely stored at facility; a facility antenatal register entry); the clinic **Antenatal Care Register** (paper, facility); the daily tally sheet. Confidence: confirmed (MCR concept and patient-held), likely (register names).
2. **Registration on HPRS** at clerk desk where deployed (ID number captured, HPRN generated). Stored: HPRS central database.
3. **HIV counselling and testing (HCT)** at booking: rapid test; result in the MCR and the HIV register/folder; if positive, **PMTCT** pathway: same-day ART initiation (TLD) under Universal Test and Treat; an **ART clinical stationery/folder**, **HIV register**; baseline bloods sent to NHLS on **NHLS request form** (paper, with barcode label) for VL, CD4 where indicated, syphilis (RPR), Hb, blood group. NHLS LIS: TrakCare Lab; results back via TrakCare WebView or SMS printer. Data capturer transcribes to **TIER.Net**.
4. **MomConnect enrolment.** Nurse or the woman registers the cell number on MomConnect (NDoH national digital health programme launched 2014, run by NDoH with Praekelt.org, WhatsApp/SMS/USSD). Registration is via nurse-assisted USSD (*134*550#) or self-registration; stores cellphone, ID/ date of birth, facility, estimated delivery date, language. Platform: Praekelt's open-source Turn/Vumi-derived stack (Django; "Jembi/Praekelt"), with the Jembi Health Systems HIE-style integration to NDoH. Stored: MomConnect platform (hosted), integrated with a National Department of Health data store. Confidence: confirmed (programme), likely (technical stack).
5. **Subsequent ANC visits** (BANC Plus model: min 8 contacts since WHO 2016 and South African adoption of 8-contact schedule in 2022 guidelines): MCR updated by hand each visit (BP, urine, fundal height, FHR, Hb, gestational age); ultrasound where available; tick in ANC register; DHIS2 monthly figures (ANC visits before 20 weeks, ANC 1st visit, HIV-positive tested, etc.).
6. **Referral to hospital for delivery:** MCR travels with woman; **referral letter** (paper form, e.g. "Standardised referral form (SA 'Referral Letter/Transfer form')") plus MCR; hospital maternity ward reception creates **hospital patient record**; in Western Cape the Clinicom 9-digit folder number is generated and printed on barcode labels; in Gauteng SAP HIS, in KZN eHealth, in EC/FS HMS2.
7. **Labour and delivery:** midwives complete the **partogram** (in MCR), **Labour ward register**, **Delivery register**; baby's data in **neonatal admission register**. Birth data feed: the **Perinatal Problem Identification Program (PPIP)** or the National Perinatal Mortality and Morbidity Committee (NaPeMMCo) is an audit not a registry; **Maternal death notification** via **Notifiable Medical Conditions** (maternal deaths are Category 1 notifiable; NMC reporting form), and Confidential Enquiry into Maternal Deaths (CEMD).
8. **Birth notification and registration with Home Affairs.** Hospital issues **Notification of Birth (BI-24)** (DHA form), completed by the health practitioner/midwife, handed to the mother; mother/father presents it at a Department of Home Affairs office (or at hospital where DHA has a "Health facility office", ~400 such sites in 2021/22; DHA digitised birth registration in hospitals, "Online Birth Registration" at ~ hospitals) to obtain the **Birth Certificate (BI-130)** (Form BI-24 is "Notification of Birth", completed by an attendant; BI-25 is the Application for birth registration after 30 days... uncertain on BI-25). DHA enters the child into the **National Population Register (NPR)** and assigns the 13-digit ID number. Stored: DHA NPR (central, Pretoria; mainframe-heritage and Oracle-based per DHA documentation, uncertain). Confidence: confirmed (BI-24 is notification of birth), likely (rest).
9. **Road to Health Booklet** (RTHB, "Road to Health" booklet since 2011; the 2018 and later versions renamed the **Road to Health Book, now the "Road to Health Booklet" / Personal Child Health Record**) is issued at birth (labour ward or at first PHC visit) and records birth weight, length, head circumference, Apgar, immunisation, feeding, Vitamin A, deworming, growth charts, developmental milestones, HIV exposure status (PMTCT: nevirapine prophylaxis, EID testing at 6 weeks "Early Infant Diagnosis PCR"). The RTHB stays with the caregiver.
10. **Post-natal visit** at ~6 days and ~6 weeks: MCR postnatal section; family planning; postnatal register.
Data artefacts summary (journey 1.1): MCR (patient-held), referral letter, antenatal/delivery/postnatal registers (facility paper), HPRS record (central), TrakCare Lab record (NHLS), TIER.Net (HIV patients), DHIS2 aggregates, MomConnect profile (cloud), BI-24 (paper to DHA), NPR record (DHA), RTHB (caregiver paper), hospital system record (Clinicom/HMS2/SAP HIS/eHealth/Meditech/paper).
Source basis: NDoH Guidelines for Maternity Care in South Africa (2015, updated); NDoH MomConnect pages; Praekelt; DHA BI-24 pages (home-affairs.gov.za). URLs: https://www.health.gov.za/ ; https://www.dha.gov.za/ (not re-fetched this round). Confidence overall: likely.

### 1.1.1 PMTCT detail
- Mother tests HIV positive at booking: initiated on TLD (tenofovir/lamivudine/dolutegravir) same day. Repeat test at 32+ weeks (retest negatives) and post-delivery per guideline (3-monthly retest during breastfeeding in the 2019+ guidelines). VL at 3 months after start and then 6-monthly, at delivery.
- Infant: nevirapine prophylaxis from birth (high risk: dual prophylaxis); birth PCR (high-risk infants) and 10-week PCR (changed in recent guidelines from 6 week), 6-month; final rapid antibody test at 18 months/after 6 weeks post-cessation of breastfeeding. Results in RTHB. PCR sent on NHLS **DBS (dried blood spot)** card with request form; result via TrakCare WebView / SMS printer.
- Data: **Infant/HEI (HIV-exposed infant) register** (paper); **Maternal and Child tally**; DHIS2 indicators: "Infant PCR test around 10 weeks", "Baby HIV positive PCR rate". NIDS definitions. Confidence: likely.

## 1.2 Child immunisation visit (EPI-SA)

1. Caregiver arrives with RTHB. Clerk retrieves folder (or none: child may have only the RTHB). Nurse reviews RTHB immunisation page; schedule (EPI-SA): BCG, bOPV0 at birth; 6 weeks: OPV1, RV1, DTaP-IPV-Hib-HBV (hexavalent) 1, PCV1; 10 weeks: hexavalent 2; 14 weeks: RV2, hexavalent 3, PCV2; 6 months: measles 1; 9 months: PCV3; 12 months: measles 2? (measles 2 at 12 months), 18 months: hexavalent 4 and OPV; 6 years: Td; 12 years: Td; HPV for grade 4 girls (school-based). Confidence: likely; schedule changes (hexavalent introduced 2015?; to be verified).
2. Vaccine is administered; nurse records in RTHB (date, batch, signature), in the **Immunisation Register** (paper, facility, or "Child Health register") and the **Daily tally sheet**. Vaccine **stock** captured in the vaccine stock register / **Vaccine Stock Management** (**EVMS/Stock Visibility System** nationally; Vaccine Stock/EPI uses the "Electronic Vaccine Stock Management/ EVMS"? uncertain).
3. Monthly: tallies → **DHIS2** (immunisation coverage under 1 year, Measles 2nd dose coverage etc.).
4. Adverse events following immunisation (AEFI): paper AEFI form to district/EPI manager, then NDoH.
5. Data stored: RTHB (patient), facility register, DHIS2 aggregate. No national immunisation registry exists at individual level in the public sector (confidence: likely; see Unanswered). Western Cape PHCIS captures child immunisation at encounter level (PHCIS/ PREHMIS) and PHDC links.
Sources: NDoH EPI-SA vaccination schedule; https://www.nicd.ac.za/ ; confidence likely.

## 1.3 HIV testing to ART initiation to follow-up to viral load

1. **HCT**: nurse/lay counsellor (HIV counselling and testing counsellor, often NGO-funded) performs rapid HIV test (first line screening per national algorithm; confirmatory test). Artefacts: **HIV Testing Services (HTS) register** (paper; named register ledger), **HTS lab slip**? and the **patient file**. Pre-printed **HCT Register** captures date, client age/sex, tests, result, referral.
2. **Linkage and initiation**: same-day ART initiation (Universal Test and Treat since Sept 2016; same-day since 2019). Nurse (NIMART-trained) opens **ART patient folder (Stationery set: "ART Patient Folder"/"TB/HIV Clinical stationery")** with an **ART number** (clinic-assigned; unique to that clinic: "ART no. / Folder number / Patient ID"), baseline bloods: CD4 (if available), creatinine (for TDF), VL baseline, HBsAg, syphilis; Artefacts: NHLS request form; NHLS barcode.
3. **Dispensing**: pharmacy assistant dispenses TLD (e.g. 30 or 90 days) from facility pharmacy; **Pharmacy dispensing register / script** (paper, or RxSolution at some facilities); stock tracked by SVS.
4. **Capture to TIER.Net**: data capturer enters from paper folder: patient demographics, ART start date, regimen, visit dates, CD4, VL, TB status, outcomes (alive in care, transferred out, LTFU, died), into TIER.Net (Windows desktop application, Microsoft Access? - TIER.Net v. originally built on **Microsoft Access** (MS Access 2000-2003 .mdb/ .mde front end), later migrated to **SQL Server Express** in version 4+; confidence: likely). Three-tier model per base file. Output: monthly/quarterly reports exported to DHIS2 (aggregate), cohort analyses. Developer: **Health Information Systems Programme (HISP-SA)? no.** TIER.Net was developed by the **Centre for Infectious Disease Epidemiology and Research (CIDER), University of Cape Town** (Dr Mary-Ann Davies? and Lara Fairall?). Confidence: confirmed that TIER.Net originated at UCT (Centre for Infectious Disease Epidemiology and Research).
5. **Follow-up**: clinical visits - first at 1 month? (per guidelines: month 1, month 3? then 6-monthly for stable); each visit: nurse notes in patient folder; **appointment** in the **appointment register/diary**; folder "tracing" by **tracer/community health worker** for missed visits (**Missed appointment list**; Ward-based Primary Health Care Outreach Teams (WBPHCOTs) via **Community Health Worker (CHW) register/household registration**).
6. **Viral load monitoring**: VL at 6 months, 12 months and annually thereafter (per 2023 ART guidelines). Request form → NHLS (TrakCare Lab) → result via WebView/SMS printer; nurse records on folder; capturer enters into TIER.Net; "VL suppressed (<50 copies/mL)" indicator. In DHIS2, indicators like "ART client viral load suppressed rate 12 months" derived from TIER.Net aggregates (via the standard TIER.Net DHIS2 export).
7. **Stable patients to CCMDD**: after VL suppression and stability (clinically stable, VL <1000? "stable" definition), nurse refers to **CCMDD** (Central Chronic Medicines Dispensing and Distribution): patient is registered on the **CCMDD Patient registration form** (paper "CCMDD referral form"), capture onto the **CCMDD portal** (hosted by **Mpilo? no; the national CCMDD programme managed by NDoH with service providers: Pharmacy Direct? Mpilo?**). Known: contracted service providers include **Pharmacy Direct** and **Mpilo/ Ekurhuleni?** (uncertain); technology partners include **Cipla? no.** Treat details uncertain. The base file says CCMDD with external pick-up points (PuPs). Prescription generated by clinic nurse (script valid for 12 months with 6/12 repeats?), dispensing by contracted pharmaceutical supplier into parcels labelled with patient name; delivered to PuP; patient collects with SMS notification (SMS via "**CCMDD patient notification**" e.g. "Your medication is ready at...").
8. **Data stored**: patient folder (paper), TIER.Net (clinic PC or server), CCMDD portal (contractor-hosted database), TrakCare Lab, DHIS2 (aggregate), HPRS (demographics), and the **NHLS Corporate Data Warehouse (CDW)** which holds lab results across the country at patient-level (key for national VL/CD4 analyses; the CDW is a documented research resource: "NHLS Corporate Data Warehouse"). Confidence: confirmed that CDW exists (used in published research).
Sources: NDoH ART Clinical Guidelines 2023; NDoH Adherence Guidelines; https://www.knowledgehub.org.za/ ; https://www.tier.net/ ; PMC7154050; medRxiv 2025.11.11.25340044 (cited in base). Confidence overall: likely.

### 1.3.1 Patient identification across TIER.Net sites
- TIER.Net uses a local patient ID (ART/Folder number) and has an optional SA ID field; there is no national unique patient linkage in TIER.Net itself; duplicate records across clinics occur when patients transfer ("silent transfers"). Studies on LTFU and silent transfer: PMC articles on tracing (e.g. Western Cape linked data). Confidence: likely.

## 1.4 TB screening to diagnosis to treatment

1. **Screening**: every PHC attendee screened for TB symptoms (cough, fever, night sweats, weight loss) by nurse/screener: recorded in the **TB symptom screen tally** and in the facility folder; DHIS2 indicator "TB symptom screen in adults 5 years and older headcount".
2. **Sputum collection**: sputum or other specimen collected; **NHLS request form** with patient demographics; specimen goes by courier to the NHLS laboratory (some GeneXpert machines at clinic level: point-of-care/near-POC). Test: **Xpert MTB/RIF Ultra** on **GeneXpert** (Cepheid). Smear/culture/LPA for drug-resistance. Result: TB detected/not detected, rifampicin resistance. Results appear on **TrakCare WebView**; GeneXpert results also reported through **GxAlert / "GeneXpert connectivity"**? (the NHLS implemented GeneXpert connectivity to the LIS; GxAlert used in some). Confidence: uncertain on GxAlert.
3. **Diagnosis and registration**: clinician/nurse writes diagnosis; patient entered in the **facility TB Register** (paper "TB register" with TB number; DS-TB; "Presumptive TB Register" - the **Presumptive TB Register** records all with presumptive TB and sputum results), also **TB Identification/Treatment Card** (Patient treatment card), and the **TB treatment booklet/TB Patient Card**. TB is a **Category 1 Notifiable Medical Condition**: the **NMC notification (paper form, "Notification of Notifiable Medical Condition", NMC form)**, submitted by the diagnosing clinician within 24 hours (Category 1) and via the **NMC electronic system** (the NICD's NMC Application, **NMC App**/web, launched 2018, with the facility-based "NMC" mobile reporting), to the district/ sub-district communicable disease coordinator and then the NICD. Confidence: confirmed (NMC regs under NHA, 2017, "Regulations Relating to the Surveillance and the Control of Notifiable Medical Conditions", R.1434 of 6 Dec 2017).
4. **Treatment start**: DS-TB 6-month regimen (HRZE then HR) dispensed monthly or via DOT (directly observed therapy) by clinic nurse or community health worker. DR-TB: referred to a specialised DR-TB site/hospital; **BPaLM / BPaL** all-oral regimens (since 2022); registered in the **DR-TB Register** and **EDRWeb** (Electronic Drug-Resistant TB Register, developed by NICD/NHLS and National TB Programme; web-based, database maintained by NICD? - EDRWeb at https://www.edrweb.net, hosted at the University of Cape Town? uncertain host); **ETR.Net** (electronic TB register, UCT-developed, older; used for DS-TB at sub-district level where installed).
5. **Follow-up**: monthly review; sputum monitoring at 2 months (DS) / monthly (DR); TB register outcome at end (cured, treatment completed, failed, died, LTFU, not evaluated). Capture to ETR.Net/TIER.Net (TB module "TIER.Net also records TB treatment for ART patients") and quarterly **TB cohort report**; DHIS2 indicator "TB treatment success rate". TB-HIV co-infected: HIV test mandatory, ART within 2 weeks; TB data in the **TB-HIV register**.
6. **Contact tracing**: nurse/CHW household screening: contact tracing register.
7. **Data stored**: NHLS TrakCare (labs); NHLS CDW; facility TB register (paper); ETR.Net/TIER.Net (clinic); EDRWeb (central DR-TB); NMC database (NICD); DHIS2; PHDC in Western Cape (links TB data).
8. **TB Recovery Plan**: NDoH TB Recovery Plan 2023-2025 and the 2024 "TB Dashboard"? uncertain.
Confidence overall: likely; notification regulation confirmed.

## 1.5 Chronic NCD (hypertension/diabetes) clinic visit and CCMDD

1. Patient arrives; clerk finds folder (or issues new); queue; "triage" by nurse (vitals: BP, weight, glucose by glucometer/HbA1c rarely).
2. Nurse follows the **Adult Primary Care (APC)** guide (NDoH PHC STG/EML; "Adult Primary Care (APC) Guide" from Knowledge Translation Unit, UCT) for diagnosis; records in folder; **Chronic patient card / chronic disease clinical stationery**; capture in **Chronic Disease register** ("hypertension and diabetes register" paper); appointment given (appointment card, "Chronic Care appointment").
3. **Bloods** (HbA1c, creatinine/eGFR, lipids annually) on NHLS forms → TrakCare → WebView.
4. **Prescription**: clinic doctor/nurse (PHC nurses prescribe within scope; Section 56 of Nursing Act; authorised nurses). **Facility pharmacy** dispenses; script (paper, original kept at pharmacy) and the **dispensing register**; stock via SVS.
5. **CCMDD**: stable patients (controlled BP/glucose) registered with CCMDD: same flow as 1.3. Chronic medicine parcel 2-monthly to 6-monthly? (typically 2-month or 3-month supply, 12-month script); patient collects at PuP (private pharmacy "Pick-up Point", clinic, external PuP such as "Medi-Pick/ Pharmacy" or lockers - "Smart lockers"/"Pelebox" a SA smart-locker system used in Gauteng/KZN to dispense CCMDD parcels; confidence: confirmed that Pelebox exists, uncertain on volume).
6. Data stored: folder, register, NHLS, CCMDD portal, DHIS2 aggregate (NIDS: hypertension/diabetes new and follow-up headcount; "client controlled BP"?), HPRS, PHCIS (WC).
Source: NDoH CCMDD pages https://www.health.gov.za/ccmdd ; Spotlight NSP; confidence likely.

## 1.6 Acute illness at a clinic with referral to hospital

1. Walk-in; clerk registration, folder; **triage** (South African Triage Scale at EC/ hospital; PHC "Triage" per Ideal Clinic); nurse sees patient using the PHC STG/EML and APC; folder note.
2. If unstable or needing doctor: **referral letter** (paper "Referral letter/transfer form" in duplicate); phone call to receiving hospital's **doctor/EC**; **ambulance (EMS)** request via provincial EMS call centre when needed.
3. Hospital: patient arrives at casualty/OPD; clerk registers - looks up patient on the hospital system (Clinicom WC: 9-digit; SAP HIS GP; eHealth KZN; HMS2 EC/FS; paper elsewhere); hospital folder or new folder; clinical notes (paper, ward folder); investigations: NHLS (TrakCare) and radiology (PACS/RIS in some; X-ray films or digital: e.g. **PACS** in WC hospitals and a **National PACS tender**? uncertain); pharmacy (hospital pharmacy system e.g. **JAC? / Medsas? / Syspharm?** uncertain).
4. Discharge: discharge summary (paper in folder; copy to patient; in WC the **Electronic Continuity of Care Record (ECCR)**), discharge medication from hospital pharmacy; follow-up appointment; "back-referral" letter to clinic. Often no electronic feedback to the clinic except in WC.
5. Data stored: clinic folder; referral letter (clinic copy/hospital copy); hospital record; NHLS; PHDC (WC); DHIS2 aggregates hospital side (inpatient/OPD statistics from monthly hospital stats - "**Hospital Information System monthly data sets**" - Hospital data are reported in DHIS2 under the hospital dataset, e.g. patient days, admissions, bed utilisation rate).
Confidence: likely.

## 1.7 Emergency by ambulance to hospital and discharge

1. Call to provincial EMS call centre (10177 / 112); dispatcher logs in the **computer aided dispatch (CAD)** system (provinces differ; e.g. Gauteng EMS uses a CAD; Western Cape EMS "Emergency Medical Services Dispatch": uncertain vendor). 
2. Crew completes a **Patient Report Form (PRF) / "Patient Care Report" (paper, triplicate)** - the pre-hospital record; copy handed to receiving casualty staff; a copy kept by EMS station for **EMS billing/ audit**. Some provinces use electronic PRF (WC "EMS ePCR" pilot; uncertain).
3. Casualty: registration at hospital reception; **SATS (South African Triage Scale)** colour code; casualty card/emergency record; investigations; admission to ward (**ward admission register**, **bed management**) or discharge.
4. Inpatient: ward folder with doctors' notes (paper), nursing Kardex, vitals charts, prescription chart; lab/imaging; theatre register if operated.
5. Discharge: discharge summary; TTO (to-take-out) medicine from pharmacy; follow-up referral; **inpatient discharge diagnosis coded** by **clinical coders** (ICD-10 WHO edition, various provinces; many hospitals have limited coding - unknown extent) into the hospital system (for WC Clinicom; for others, stats in registers); **Admission and Discharge register** → monthly hospital statistics → DHIS2.
6. Trauma: **injury** also generates a **J88 (medico-legal) form / SAPS 308 (J88)** if assault; sent to SAPS (the J88 form is used for assault/ rape; confirmed); Notification of **Road Accident Fund (RAF) claim forms** (RAF1 and **RAF4 Serious Injury Assessment Report**) for road accident patients; hospital completes **RAF hospital fee statements**. Confidence: confirmed that J88/RAF forms exist.
Confidence: likely overall.

## 1.8 Surgical elective referral and waiting list

1. Clinic/GP identifies need; referral letter to hospital outpatient department (OPD) specialist clinic; OPD booking via appointment (OPD booking in hospital system or paper OPD appointment book).
2. Specialist OPD consultation: records in hospital folder; decision "for surgery"; patient placed on **elective surgical waiting list** (**Theatre waiting list/ "Surgical Waiting List register"** - typically paper register kept in theatre or the surgical department; in WC electronic list via Clinicom; hospital-specific). Weighted categories (urgent, semi-urgent, routine).
3. Pre-operative workup: bloods (NHLS), anaesthetic assessment clinic, consent form (**Informed consent for surgery - patient-signed paper consent**; HPCSA/NHA s6-s8 on consent).
4. Theatre date: **theatre booking list**, **Operation register / theatre register**, **Anaesthetic chart**, **Operation note**, **WHO Surgical Safety Checklist**.
5. Post-op: ward, discharge, follow-up OPD; results of histology via NHLS (anatomical pathology).
6. Waiting-time data: not systematically collected nationally (Auditor-General and Health Systems Trust have commented; surgical backlogs statements by NDoH after COVID). Provincial: Gauteng and WC have published backlog numbers (e.g. Gauteng backlog news in 2023-2025). Confidence: likely that national waiting-list data is incomplete; uncertain on specifics.

## 1.9 Mental health journey (public)

1. Presentation at PHC (depression/psychosis) or via SAPS/EMS (Mental Health Care Act 17 of 2002 categories: voluntary, assisted, involuntary).
2. PHC nurse screens (PHQ, per PHC guidelines), prescribes within scope, refers to district mental health team/psychiatric nurse or hospital.
3. Involuntary/assisted admission: **Mental Health Care Act forms: MHCA 01 (application for assisted care), MHCA 02 (Application by interested person), MHCA 04, MHCA 05, MHCA 07 (Application to Review Board?) ...** Specific form numbers: MHCA 01 "Application for care, treatment and rehabilitation services", MHCA 04 "Application for involuntary mental health care", MHCA 05 "Mental health practitioner report", MHCA 07 "Notice of ... to Review Board"? Use: Regulations to the Mental Health Care Act (GN R1467 of 2004). Confidence: forms exist as MHCA 01-MHCA 59 etc. (exact numbers uncertain; Quote only that forms are prescribed in the Regulations).
4. **Mental Health Review Boards** (provincial) review involuntary admissions; **72-hour assessment** at designated psychiatric hospital or general hospital; records in hospital folder (strict confidentiality; MHCA s. 13 confidentiality? uncertain).
5. Discharge to community: referral to clinic; chronic medicines via clinic or CCMDD (for stable patients on certain psychiatric medicines? uncertain whether CCMDD includes psychiatric medicines - historically yes for some e.g. fluoxetine? uncertain).
6. Data: facility folder; psychiatric hospital system; DHIS2 mental health indicators (e.g. "Mental health: new clients"); no national mental health registry (confidence: likely).

## 1.10 Private GP consultation with claim

1. Patient books (phone/online); GP practice management software (**GoodX**, **Medical Software "Healthbridge"? (Healthbridge is a switch/claims and also software), **Medi-Clinic? no**, **MediSwitch? (switch)**, **Elixir?**, **Medikredit (switch/TPA)**, **Dynamic Health? ,** **BEM? ,** **DrBooking?**, **HeyDoc?**, **Practice Perfect**, **Medical Practice Software Meditab? ,** **Ontrack (Mediclinic?)**; confidence: GoodX confirmed as major, others partial. Reception captures demographics, medical scheme name, membership number, dependant code, ID number; **eligibility/membership verification** via switch (Healthbridge, MediSwitch (Altron? now Altron HealthTech), SwitchOn/ Medikredit); Healthbridge is run by Healthbridge Holdings (owned by Altron? no; Healthbridge was owned by Medscheme? uncertain). Confidence: low on ownership; omit.
2. Consult: GP records clinical note in the PMS (electronic; databases vendor-specific) with ICD-10 diagnosis codes and tariff/procedure codes (e.g. 0190 consultation); script written (printed/e-prescribing with **NAPPI codes** for dispensing); pathology request (Lancet, Pathcare, Ampath/ Vermaak ... via lab requisition; lab results delivered electronically into PMS via HL7 or PDF/“Pathology results interface").
3. **Claim**: PMS creates claim file (**MEDCLM** EDIFACT message, the SA medical claim standard based on EDIFACT) with fields: practice number (BHF/PCNS number), provider number (HPCSA), patient/membership/dependant, ICD-10, tariff code (CPT-4 based SA coding), NAPPI codes for medicines, modifiers, amounts; sent to a **switch** (Healthbridge, MediSwitch, Medikredit?), the switch forwards to scheme administrator (Discovery Health, Medscheme, Momentum Health, GEMS, Bonitas). Real-time claims (**real-time adjudication**) return a response (approved/rejected, member liability) in seconds; rejection reason codes (e.g. "benefit exhausted").
4. **Remittance advice** (EDI) returned; electronic funds transfer to practice; payment reconciliation by the practice.
5. Scheme administrator side: claim stored in scheme claim system; **Prescribed Minimum Benefits (PMB)** logic; fraud/waste/abuse analytics; member statement; **Council for Medical Schemes (CMS)** annual returns include claim totals.
6. Data stored: practice PMS database; switch (retention for audit); scheme administrator database; pathology lab LIS; pharmacy dispensing system.
Confidence: likely; MEDCLM confirmed as the SA claim EDI standard (see Part 2).

## 1.11 Private specialist and private hospital admission with scheme pre-authorisation

1. Referral from GP to specialist (letter or e-referral). Specialist consults (records in specialist PMS); decides admission/procedure.
2. **Pre-authorisation (pre-auth)**: the admitting practice or hospital calls or submits to scheme/administrator (**Discovery Health "Hospital Authorisation"**, **Medscheme managed care**, etc.): provide membership number, ICD-10 code, procedure tariff code(s), planned admission date, hospital (network), specialist practice number; scheme returns an **authorisation number** (also a **PMB** determination). Delivered by phone/web portal/switch real-time (via hospital/switch). Hospital admission desk (patient administration) records auth number.
3. **Admission** in private hospital (Netcare, Mediclinic, Life Healthcare; hospital systems include **Netcare's own EHR/CPOE**, Mediclinic's **Cerner/Oracle? ... Mediclinic uses "Epic"?? uncertain**, Life Healthcare using **Cerner? uncertain**; SAP? ; Don't assert). Admission record: patient admin system (**PAAB? , "Meditech"? uncertain**). Documents: admission form, consent (financial and clinical), **Informed Financial Consent**, medical scheme card scan, doctors' orders, nursing charts, theatre record, anaesthetic record, implants (prosthesis stickers / "Prosthesis Register"), pathology/radiology, pharmacy. Hospital clinical records still frequently hybrid paper/electronic.
4. **Discharge**: discharge summary; **TTO medication**; hospital bill built from case-record (ward fees, theatre time units, consumables, pharmacy by NAPPI), hospital claim submitted electronically as **MEDCLM** to scheme via switch; scheme **adjudicates**, may do **post-payment audit**; **specialists' accounts** separate; **anaesthetist** separate; **pathologist** etc.
5. **Scheme side**: the authorisation and claim records in administrator's clinical and claims systems; **risk equalisation fund** (RES) data; CMS reporting; the **Healthcare Information Exchange (HIE?)**; also **Board of Healthcare Funders (BHF)** services: **practice number registry (PCNS)**, **tariff codes** and **Health Market Inquiry (HMI)** data requests (HMI final report Sep 2019: recommended a central data repository).
Confidence: likely; vendor attribution specifics uncertain and flagged.

## 1.12 Pharmacy dispensing (private retail)

1. Patient presents script (paper, faxed, or e-script via prescriber software); pharmacist/pharmacy assistant captures prescriber (HPCSA number), patient, medicines by **NAPPI code** into the **pharmacy dispensing software** (examples: **Pharmacy Management systems - "Pharmacy Dynamics"? , "Synergi"? , "Script Assist"? , "Rx.Pharm"? "Medicus"? "Pharmasoft"?** - exact names uncertain; not asserting); legislative requirement: **Schedule 5/6 medicines** recorded in **Scheduled Substances Register / Schedule 6 register (paper or electronic)** and prescription retained for **5 years** (Pharmacy Act/ Medicines Act regs; confirm).
2. Real-time claim to scheme through switch (**MEDCLM or the pharmacy-specific "real time claiming" message**), applying formulary, co-payment, **MPL** (Maximum Price List? / Single Exit Price (SEP) under Medicines and Related Substances Act regs) and dispensing fee.
3. Label printed; counselling; script copy retained; the repeat management.
4. Wholesaler orders (EDI to Clicks/UPD/Medipost etc.), NAPPI price files (MediSwitch/Mediscor NAPPI files).
5. Data stored: pharmacy system; switch; scheme; wholesalers; SAHPRA (Section 22A registers for Schedule 5/6); the **Pharmacy Council (SAPC) inspections**.
Confidence: likely; name specifics deliberately minimal.

## 1.13 Public-to-private and province-to-province movement

- **Public to private**: no electronic transfer. Patient obtains copies of records (paper summary/discharge summary/ RTHB/ TIER.Net printout) on request under **PAIA** (public body request, form) or patient access under NHA s. 14-17 / HPCSA Booklet 9; private provider re-registers patient, re-tests. CCMDD stable patients may be seen by private GPs as PuPs. Confidence: likely.
- **Private to public**: hospitals receive patients through casualty; private provider letters; chronic ART patients present with scheme-hospital summaries or none.
- **Province to province**: ART/TB patients with "transfer out" letter + TIER.Net transfer form; the receiving clinic opens a new ART record, manual capture of previous ART start date; lost in the system if not documented ("silent transfers"). HPRS national identifier is the intended cross-province key but clinical data are not exchanged. The Western Cape PHDC covers WC only; Gauteng's SAP HIS covers Gauteng only. Migrant patients (Eastern Cape to Gauteng/WC) are common - the Eastern Cape's HMS2 and Gauteng's SAP HIS do not exchange data. Confidence: likely (analysis derived from the confirmed system map in base).

## 1.14 Death notification (BI-1663) and cause-of-death data

1. Death occurs (hospital, home, or unnatural). A **medical practitioner** certifies natural death on **Form BI-1663 "Notification of Death / Stillbirth"** (DHA form; replaced the BI-1680? Actually **DHA-1663** "Notification of Death/ Stillbirth" - the currently used form is **BI-1663**; confirmed by base research). Page 1: personal particulars of deceased, certification; Part on cause of death uses the WHO international format (Part 1 a-d, Part 2).
2. The doctor/nurse completes; for unnatural deaths **police** and **forensic pathology service (FPS)**: **SAPS 180 / inquest docket**, post-mortem by forensic pathologists; certification via **BI-1663 completed by forensic pathologist** and **Form 'Notice of Death - unnatural'**; under **Inquests Act 58 of 1959** and Health Professions Act, National Health Act chapter 8 (Regulations on Rendering of Forensic Pathology Service R636 of 2013?). 
3. Family takes BI-1663 to **funeral undertaker**/DHA; DHA registers death into the National Population Register, issues **Death Certificate (DHA-14 / BI-14?)**: "Death certificate (Form BI-14? uncertain)", burial order (BI-???). 
4. **Cause-of-death data**: Stats SA compiles "Mortality and causes of death in South Africa" annual release from DHA death notification records (BI-1663 cause fields coded to ICD-10 by Stats SA coders), with national data via the "**Vital registration**" database; data quality: ill-defined causes; "garbage codes"; 2021/2022 reports. Medical Research Council (SAMRC) produces Rapid Mortality Surveillance (RMS) using Stats SA data. Confidence: confirmed (Stats SA publishes; MRC RMS).
5. **Health sector notifications**: maternal deaths and child deaths (under-5) go through NMC / the **Maternal, Neonatal and Child death reporting**; SA's **Child Health Problem Identification Programme (Child PIP)**; hospital deaths in the **mortality meetings** and registers; DHIS2 indicators (inpatient deaths).
6. **Stats SA data cycle**: DHA data transfer → Stats SA processing; delay ~ 1-2 years. Latest Stats SA mortality release found in base? (not re-fetched this round). 
Sources: DHA https://www.dha.gov.za/ ; Stats SA https://www.statssa.gov.za/ (Mortality and causes of death in SA). Confidence: likely.

---

# Part 2. Data formats and database technology

Where a technology claim is not publicly documented it is marked uncertain; absence of public documentation is itself recorded.

## 2.1 HPRS (Health Patient Registration System)
- Owner: NDoH (Health Information Systems / NHI branch). Started June 2015 (base). Function: master patient index; identifiers: SA ID (13-digit), passport, refugee numbers etc.; issues **HPRN** (Health Patient Registration Number). Verification against DHA NPR through a DHA service (verified ~32.5 million per base).
- **Technology**: National HPRS is a web application with a database; publicly the NDoH paper (2025) describes web-based registry with an API/“messaging interface”; HMS2 uses the "HPRS Patient Reference Number". Database engine and schema not publicly documented in sources found. Confidence: uncertain.
- Facility access: web portal ("HPRS online"), a facility "Health Patient Registration" desktop client in some provinces; also integrates with MomConnect? uncertain.
- **HPRN format**: The exact format is not publicly documented in what I found. Reports indicate the HPRN is a numeric identifier unique to the registry (not the ID number). Confidence: uncertain. (Base notes "issues a Health Patient Registration Number".)
- The earlier NDoH concept had **biometric** fingerprint verification (NHI card; pilot 2012-2016); not confirmed currently.

## 2.2 DHIS2 (aggregate data, "webDHIS")
- Open-source platform from University of Oslo HISP; SA national instance operated by NDoH (sahealthinfo? **https://www.dhis2.health.gov.za**; confirmed domain `dhis2.health.gov.za` hosts "webDHIS"? uncertain host); DHIS2 core: **Java (Spring, Hibernate)** application, **PostgreSQL** database (+ PostGIS), web front-end JavaScript (React), supports Tomcat/Docker deployments. Versions: DHIS2 releases yearly-ish (2.40, 2.41, 2.42 in 2025); SA's running version: not publicly confirmed (uncertain). 
- **Data model** (official DHIS2 docs): 
  - `organisationUnit` hierarchy (country → province → district → sub-district → facility; levels 1-5/6 depending); organisation units have `uid` (11-character alphanumeric starting with a letter), `code`, `name`, `shortName`, `path`, `level`, `parent`, `coordinates`/geometry, `openingDate`, `closedDate`.
  - `dataElement` (what is counted; `valueType` such as INTEGER, NUMBER, TEXT, BOOLEAN, DATE; `domainType` AGGREGATE or TRACKER; `aggregationType`; `categoryCombo`).
  - `categoryOptionCombo` (disaggregation e.g. age/sex; `categoryCombo` → `categories` → `categoryOptions`); combos are cross-products.
  - `dataSet` (collection of data elements assigned to orgunits with `periodType` Monthly etc.; has `dataEntryForm`).
  - `period` (ISO periods: `202601` monthly, `2026Q1`, `2026` yearly, `2026W5` weekly).
  - `dataValue` (dataElement, period, orgUnit, categoryOptionCombo, attributeOptionCombo, value, storedBy, created, lastUpdated, comment, followup).
  - `dataValueSet` payload: JSON `{ "dataSet": "...", "completeDate": "...", "period": "202601", "orgUnit": "...", "dataValues": [{ "dataElement":"...", "categoryOptionCombo":"...", "value":"12" }]}`; XML equivalent `<dataValueSet xmlns="http://dhis2.org/schema/dxf/2.0">`; CSV columns `dataelement,period,orgunit,categoryoptioncombo,attributeoptioncombo,value,storedby,lastupdated,comment,followup`; also ADX (aggregate data exchange, IHE-based) support.
  - API endpoints: `/api/dataValueSets`, `/api/dataElements`, `/api/organisationUnits`, `/api/analytics` (JSON, XML, CSV, HTML, XLS), `/api/dataValues`, `/api/metadata`.
  - Tracker (individual-level): `trackedEntityInstance`/`trackedEntity`, `enrollment`, `event`, `program`, `programStage`; SA's national DHIS2 is used aggregated; tracker use in SA is limited (e.g. some provincial/pilot uses; COVID vaccine? EVDS was separate) - uncertain.
  - SA specifics: National Indicator Data Set (NIDS) - data elements/indicators defined in the NIDS dictionary; facility-level monthly capture; Hospital data set; PMTCT etc. (confidence: confirmed that NIDS exists; element IDs are in the DHIS2 instance, not re-fetched).
Sources: https://docs.dhis2.org/ (documented standard). Confidence: confirmed for general DHIS2; SA instance details uncertain.

## 2.3 TIER.Net
- UCT CIDER; Windows desktop application; evolved from **Microsoft Access** to **SQL Server (Express/Compact)** (version changed in 2010s); patient table keyed by local `PatientID`; fields include `FolderNumber`/`ARTNo`, `ID number`, `DOB`, `Sex`, `Date started ART`, `Regimen`, `CD4`, `VL`, `TB status`, `Outcome`. The detailed schema is not public. Exports to DHIS2 as aggregate CSV/XML reports; "Patient data can be imported/exported as ... .mdb/.bak" - uncertain. Sources: TIER.Net website tiernet.org? uncertain; PMC7154050 for data issues. Confidence: uncertain on schema.
- A "TIER.Net web"/"Tier.net 5" and HIS integration under the NDoH Hospital? uncertain.

## 2.4 TrakCare Lab (NHLS LIS)
- InterSystems **TrakCare Lab** (formerly LabTrak) runs on **InterSystems Caché** (multi-model database, MUMPS lineage) and later **IRIS** for health platform. Messaging: HL7 v2.x (ORM^O01 orders, ORU^R01 results, ADT^A01-A04/A08 patient events), HL7 v3/CDA/FHIR supported by InterSystems HealthShare/IRIS for Health; NHLS has used **HealthShare/ Ensemble** as integration engine (uncertain). Patient identity: NHLS uses **lab episode number** (e.g. `NA` prefix + year + sequence; episode numbers like `NA12345678`? uncertain) and a local **MRN**; **Barcode** labelled specimens; "**LabTrak Episode**" etc. Test codes: NHLS local code set; LOINC mapping partial (uncertain). Confidence: likely for InterSystems/Caché.
- Retrieval: **TrakCare WebView** (web portal), **SMS printers** (thermal printers sending results). 
- NHLS **Corporate Data Warehouse (CDW)**: consolidated database of lab results (patient-level), hosted by NHLS; has been used in national VL/CD4 research; contains demographic fields (name, date of birth, sex, facility), tests, results; Confidence: confirmed existence.

## 2.5 Clinicom (Western Cape hospitals)
- Developed by **Healthcare Information Systems (HIS)**/historically by **Hospital Systems/“Clinicom” originally from Siemens? Clinicom is a Healthcare Software product of "Clinicom Standard Systems" owned by Siemens Medical Solutions (acquired from HBOC/Shared Medical Systems?)**; Western Cape implementation since 1998 (base). Folder number 9-digit (base). I could not confirm DB engine in public sources; Clinicom Standard is known to be **Unix-based with an Oracle? / Informix? / Sybase?** database (uncertain). Confidence: uncertain. HL7 v2 interfaces between Clinicom and the PHDC/PHCIS (uncertain).

## 2.6 PHCIS (Primary Health Care Information System, Western Cape)
- Built by **Medpages? no; built by the Western Cape with "Healthbridge? no"** - PHCIS was developed by the Western Cape DoH with **Health Information Systems Programme**? Not confirmed. Public descriptions: PHCIS is a **Microsoft-based client-server** system (SQL Server) holding patient registration, clinical encounter, immunisation, chronic, pharmacy dispensing and appointments data in 308 facilities (base). Confidence: uncertain on technology.

## 2.7 HMS2 (Eastern Cape/Free State)
- In-house "EHMS". Technology unspecified in sources found. HPRS ID integration noted. Confidence: uncertain.

## 2.8 SAP HIS (Gauteng)
- SAP-based "Health Information System" (SAP ECC / IS-H? i.e. SAP for Healthcare "IS-H/i.s.h.med" for patient management) implemented in 37 hospitals and 31 CHCs. SAP databases include SAP HANA or Oracle/SQL Server/DB2; Gauteng's database is not public. Bara's digitisation of 800,000 files (base). Confidence: uncertain on component. Gauteng's e-health programme vendors discussed in Gauteng Legislature; contract controversy (a 2020 SIU investigation of R???; uncertain) – not asserted.

## 2.9 CareOn (Western Cape Hospitals? "CareOn" electronic medical record)
- CareOn: electronic medical record developed by **Dedalus? no; CareOn is by "Medical Systems in Western Cape - 'CareOn' by the 'Vula?'"** I could not verify. In my notes: CareOn was piloted at Tygerberg and Groote Schuur? (Western Cape EHR in WC hospitals, based on the **Dutch/Belgian "Medical Software (Medsoft)?**) - uncertain. Marked UNVERIFIED; treat as "named in brief, not verified".

## 2.10 GoodX
- GoodX Software: SA private practice management software (GPs, specialists, allied) with cloud variant; database: Firebird? / SQL Server? (not public). Interfaces: MEDCLM claims through switch; lab results import; e-script via **eRx? / Medikredit eScript**. Confidence: uncertain on DB.

## 2.11 MEDCLM (EDIFACT) - medical claims message
- MEDCLM is a South African implementation of **UN/EDIFACT**-based electronic claim; the SA standard is maintained by the **Board of Healthcare Funders (BHF)** (specification "MEDCLM - Medical Claims" and "MEDRMT"? remittance, "MEDELG"? eligibility). Based on EDIFACT segments: `UNA`, `UNB` (interchange header: sender/recipient, date/time, reference), `UNH` (message header: message type MEDCLM, version/release), `BGM` (beginning of message), `DTM` (date/time of service), `NAD` (name and address: provider, patient, member), `RFF` (references: practice number, membership number), `LIN` (line item: tariff/NAPPI), `PIA` (additional product ID, NAPPI), `QTY` (quantity), `MOA` (monetary amount), `FTX` (free text: clinical notes, ICD-10), `DGS`? (diagnosis; uncertain), `UNT` (message trailer), `UNZ` (interchange trailer). Delimiters: `'` segment terminator, `+` data element separator, `:` component separator, `?` release char. The segment list above is derived from EDIFACT generic structure, NOT from the BHF spec (which I could not retrieve publicly; the spec is distributed to registered vendors). Confidence: uncertain on SA-specific segment/field usage; confirmed that MEDCLM is the SA claim EDI name.
- Note: In practice, switches (Healthbridge, MediSwitch, etc.) also accept proprietary XML/flat-file formats; real-time claims use web-services. Confidence: uncertain.

## 2.12 NAPPI (National Pharmaceutical Product Index)
- Maintained by MediSwitch? NAPPI is a proprietary product code database historically by **Medical Software Solutions / Mediswitch? ("NAPPI" is owned by MediSwitch? Actually NAPPI is administrated by "MediSwitch" (a division of Altron?)** and also licensed via **Mediscor? and Medikredit? hmm.** The widely used statement: "NAPPI codes are a unique product identifier ... maintained by MediSwitch" (confidence: likely). Structure: **7-digit NAPPI code** identifying the product (e.g. manufacturer+product) plus **3-digit pack/package suffix** (so full 10 digits `NNNNNNNPPP`), used in claims and dispensing; codes also exist for surgical/consumable items. Provided to subscribers as monthly/daily downloadable files (fixed-width or CSV/Excel) with fields: NAPPI code, product name, schedule, strength, form, manufacturer, ATC-like class, SEP (single exit price), pack size, ingredient, generic indicators. Exact field list not public (licensed). Confidence: likely (7+3), uncertain (fields).
- Related: **Single Exit Price (SEP)** database published by NDoH (Pricing Committee) and **MPL**; **EML codes** in STGs; **ATC** classification and **MIMS** drug database.

## 2.13 ICD-10 MIT (Master Industry Table)
- The **ICD-10 Master Industry Table (MIT)** is the SA private-sector standardised ICD-10 code list maintained by the Council for Medical Schemes' partner **Medical Aid industry bodies (CMS/BHF)** and updated annually; each ICD-10 code has attributes used by schemes: valid-for-claims flag ("valid as primary"), sex restriction, age restriction, PMB flag (DTP / CDL), "asterisk/dagger" status, 3/4/5-character level. The **Prescribed Minimum Benefits (PMB) regulations** reference ICD-10 codes in "Diagnosis and Treatment Pairs" (DTPs, 270 conditions + 26 chronic disease list (CDL) conditions). Distribution: text/CSV flat files via CMS website (https://www.medicalschemes.co.za/ ) – "ICD-10 MIT" files; layout (code, description, valid flag, gender, age lower/upper, PMB). The exact file layout not fetched this round. Confidence: likely for concept, uncertain for layout.
- SA uses **ICD-10 WHO 2008 edition? plus SA modifications**: the SA ICD-10 "Master Industry Table" and the NDoH "ICD-10 coding standards" ; ICD-11 adoption: NDoH has not announced full migration (uncertain).

## 2.14 CCMDD stock systems
- **SVS (Stock Visibility System)**: mobile + web tool; clinics report stock-on-hand via smartphone app/USSD, run by NDoH with technology partner **Medicines Information Technology? (MSD?)**; implemented since 2013 (base). Data: medicine NSN (National Stock Number? the NSN is used in public sector procurement - the public sector uses the **NSN / "Stock Code"** rather than NAPPI) and quantities. CCMDD itself uses a contracted service provider platform for scripts and parcels; **RxSolution** (pharmacy stock control; SA vendor "Rx Solutions/ Rx Solution", used by hospitals and clinics; database: SQL Server? uncertain). Medicine procurement via **national tenders** managed by NDoH Affordable Medicines; **HPRS** not linked.
- Confidence: likely (existence); uncertain (technology).

## 2.15 HL7 v2 message types in use (documented/likely)
- ADT^A01 (admit), A02 (transfer), A03 (discharge), A04 (register outpatient), A08 (update patient info), A28/A31 (add/update person); ORM^O01 (orders), ORU^R01 (observation results; labs), MDM^T02 (documents), SIU^S12 (scheduling), DFT^P03 (detailed financial transactions), BAR^P01 (billing). These are the standard messages in HL7 v2.3-2.5; SA documented use: HNSF specifies HL7 v2.x; the PHDC and NHLS interfaces use HL7/flat files (uncertain). Confidence: likely (standards general); uncertain for specific SA flows. Private labs (Lancet, PathCare, Ampath) send results to PMS as HL7 v2.x ORU or proprietary formats (uncertain).

## 2.16 SA ID number structure (DHA)
- 13 digits `YYMMDDSSSSCAZ`: `YYMMDD` date of birth; `SSSS` gender sequence (0000-4999 female, 5000-9999 male); `C` citizenship (0 = SA citizen, 1 = permanent resident); `A` historically race indicator (8 or 9; now retired, usually 8); `Z` check digit by the **Luhn algorithm**. Confirmed by DHA documentation and widely published. Source: https://www.dha.gov.za/ ; Confidence: confirmed (structure widely published), likely for "A=8 today".
- Foreign/refugee identifiers: passports, asylum seeker permit numbers, refugee ID; HPRS accepts them. Children: ID number issued at birth registration. People without any ID: no HPRN (HPRS accepts "other documents" per base).
- Century ambiguity: no century digit (2-digit year); algorithms infer.

## 2.17 Date, name, address conventions and languages
- Dates: official format `YYYY-MM-DD` (ISO 8601) in government forms (SA standard SANS?); paper forms often DD/MM/YYYY; DHIS2 ISO. Many facility forms use dd/mm/yyyy.
- Names: surname, first names; many people use a single name or multiple surnames; spelling variance in transliteration of isiXhosa/isiZulu names leads to duplicates; name order inconsistent across systems (confidence: likely; studies on duplicate records).
- Addresses: informal settlements have no street addresses; "stand number", "ward", "village/ section" ; Home Affairs addresses are free-text; no national address standard in health (SANS 1883 is the SA address standard - exists; uncertain on adoption).
- Languages: 12 official languages (isiZulu, isiXhosa, Afrikaans, English, Sepedi, Setswana, Sesotho, Xitsonga, siSwati, Tshivenda, isiNdebele + SASL as 12th official, 2023). Clinical documentation is mostly English; MomConnect messages in 11 languages (English, Zulu, Xhosa, Afrikaans, Sotho, Tswana, Tsonga, Sepedi, Swati, Venda, Ndebele). Confidence: confirmed (languages), likely (MomConnect).

## 2.18 LOINC and SNOMED
- **LOINC**: no national mandate found; NHLS test codes are local; some private labs map to LOINC for interfaces. HNSF names LOINC for laboratory observation identifiers? (uncertain). Confidence: uncertain.
- **SNOMED CT licensing**: SNOMED International member countries get free national use; **South Africa is not listed as a member as of my last knowledge** (membership list includes e.g. Namibia? Botswana? uncertain); South Africa has affiliate licence arrangements in place for use in SA? Confidence: uncertain; verify at https://www.snomed.org/members .

## 2.19 Other formats
- **Western Cape PHDC**: data warehouse (SQL Server? uncertain); link keys: Clinicom 9-digit folder numbers; daily batch; HL7/flat file sources.
- **EDRWeb**: web application; **ETR.Net**: desktop app.
- **MomConnect**: Praekelt; REST/JSON APIs; WhatsApp business API; data stored in cloud (Praekelt/ AWS? uncertain).
- **EVDS (Electronic Vaccination Data System)** (COVID vaccines, 2021): NDoH; registration by ID; certificates with QR codes in SMART health card-like format? (the "SA COVID-19 Vaccination Certificate" conformed to EU-DCC? uncertain). Confidence: likely existence.
- **NHI Health Information System** requirements in the NHI Act (ch. 7, s. 41-?). 

---

# Part 3. Law and governance

(Statutory citations from documented knowledge; quotes are minimal because texts were not re-fetched. Primary sources: https://www.gov.za/documents ; https://www.justice.gov.za/legislation ; https://www.inforegulator.org.za/ .)

## 3.1 POPIA (Protection of Personal Information Act 4 of 2013)
- Fully in force **1 July 2021** (grace period ended 30 June 2021 for most provisions; s. 114(1)). Information Regulator (established s. 39).
- Health data is **special personal information** (s. 26 prohibits processing of religious/philosophical beliefs, race, trade union, political persuasion, **health or sex life**, biometric, criminal behaviour) unless exemptions in **ss. 27-33**. s. 27: general authorisation (consent, necessary for legal claim, international law, historical/statistical/research purposes, information deliberately made public). **s. 32** "Authorisation concerning data subject's health or sex life": processing may be done by (a) medical professionals, healthcare institutions or facilities or social services, if necessary for proper treatment and care of data subject or administration of the institution; (b) insurance companies, medical schemes, medical scheme administrators and managed healthcare organisations, if necessary for assessing risk, performance of insurance/medical scheme agreement, enforcement of rights; (c) schools (disabilities); (d) any public/private body managing care of a child; (e) any public body, if necessary for implementation of prison sentences; (f) administrative bodies, pension funds, employers or institutions working for them if necessary for implementation of laws/pension regulations or re-integration. The wording "proper treatment and care of the data subject" is paraphrased from memory (confidence: likely). s. 32(3): such information may only be processed by responsible parties **subject to an obligation of confidentiality by virtue of office, employment, profession or legal provision, or established by a written agreement**. s. 32(4): if responsible party is not subject to such obligation they must treat information as confidential unless required by law to disclose. s. 32(6) (inherited characteristics) restricted.
- **s. 34-35 children**: processing of personal information of children prohibited unless consent of competent person, necessary for legal claim, etc. A child is under 18 (s. 1).
- **s. 22**: security compromise notification to Regulator and data subject "as soon as reasonably possible" (no fixed hours).
- **s. 19-21**: security safeguards, operator agreements. **s. 72** transborder transfer conditions. **s. 11**: lawful processing grounds. **s. 14**: retention - not longer than necessary, subject to other law (health retention in other laws, see below).
- Penalties: s. 107-109 criminal (fines up to R10 million or imprisonment up to 10 years), **administrative fines up to R10 million (s. 109)**. 
- **Regulations**: Regulations relating to POPIA (2018), amended **April 2025** (effective 1 April 2025?) including Regulation 2 on data subject objection, changes to forms (Form 1, 2) and requirement to submit via portal; (confidence: likely; verify).
- **Codes of conduct**: Regulator has been considering sector codes; the **Health sector code** is not confirmed; (uncertain).
- **Information officers** registration with the Regulator mandatory (portal opened 2021).
- **Enforcement involving health**: (i) **Lancet Laboratories** enforcement notice Sept 2024 (breach notification failures) - confidence: likely, source https://inforegulator.org.za/enforcement-notices/ ; (ii) **NHLS 2024 ransomware** (July 2024): Regulator requested details (Daily Maverick 23 Mar 2025); outcome not found; (iii) **Department of Justice (JCPS)** enforcement notice 2023 (not health); (iv) **Medical scheme/administrator** matters: e.g. 2023 Regulator investigations into **Dis-Chem? (2024 breach of ~3.6 million customers via third-party; Dis-Chem is a pharmacy retailer)** - uncertain; (v) **Western Cape/Gauteng health data**? not found. Confidence: partial.

## 3.2 National Health Act 61 of 2003
- Commenced mostly 2 May 2005 (ch. 4 etc.); chapter 2 (national health system), ch. 3, ch. 4 (rights/duties of users and health care personnel), ch. 8 (health research/forensic; ch. 8 "Control of use of blood, blood products, tissue and gametes"), ch. 9 (general). 
- **s. 14 Confidentiality**: "All information concerning a user, including information relating to his or her health status, treatment or stay in a health establishment is confidential." (confidence: confirmed in substance). **s. 15 Access to health records**: health care provider may disclose information to a person for bona fide research?? Actually s. 15: "A health care provider ... may examine a user's health records for the purposes of treatment with the authorisation of the user; and... for study, teaching or research with authorisation of the user, head of the health establishment and the relevant health research ethics committee." **s. 16 Use of health records for study, teaching or research** (requires authorisation) - Hmm: s. 15 = Access to health records (for treatment), s. 16 = Use of health records for study, teaching or research, s. 17 = Protection of health records ("The person in charge of a health establishment... must set up control measures to prevent unauthorised access to those records and to the storage facility"; offence for unauthorised access). s. 14(2) **disclosure** exceptions: (a) user consents in writing; (b) court order or any law requires; (c) non-disclosure represents a serious threat to public health. Also s. 13 **"Duty to keep records"**: person in charge of a health establishment must ensure that a health record containing such information as may be prescribed is created and maintained for every user of health services (s. 13) — retention periods not in the Act itself. Confidence: s. 13-17 mapping likely (my memory says: s.13 Health records; s.14 Confidentiality; s.15 Access to health records; s.16 Use of health records for study, teaching or research; s.17 Protection of health records). 
- **Consent**: ss. 6-9 (s. 6 user to have full knowledge; s. 7 consent of user; s. 8 participation in decisions; s. 9 health services for incapacitated users). 
- **Notifiable medical conditions regulations**: R.1434 (6 December 2017) under NHA s. 90? - TB, measles, etc. Category 1-4; the NMC Application.
- **Chapter 9? National Health Information System** s. 74: Minister must establish and maintain a national health information system, "coordinated, ... integrated" ; **s. 74(1)** "The national department must facilitate and coordinate the establishment, implementation and maintenance by provincial departments, district health councils, municipalities and the private health sector of health information systems at national, provincial and district levels". **s. 75** "Health Information must be submitted by health establishments", with the private sector required to provide information to NHIS (s. 74(3)? uncertain). **s. 76**? Hmm uncertain numbering; flagged. Confidence: s. 74 likely; others uncertain.
- **Health establishment records retention**: The NHA doesn't set it; the **Regulations Relating to the Keeping and Disclosure of Records? no**; HPCSA booklet states 6 years (see 3.5). The National Archives and Records Service of SA Act 43 of 1996 covers public records (provincial archives). **Public sector**: Department of Health Records Management Policy; patient records minimum retention periods in some provinces: e.g. adult records 10 years after last entry? Minors until age 21? (WC: "Disposal of health records" circulars) - uncertain.
- **Regulations on Health Establishment (Ideal Clinic)**; **Norms and Standards Regulations applicable to different categories of health establishments (GN R67 of 2 Feb 2018)** includes record-keeping standards: "clinical records are well kept" — requirement: Confidence: likely that regs R67 exist.

## 3.3 NHI Act 20 of 2023
- Signed by President Ramaphosa on **15 May 2024**; "National Health Insurance Act, 2023"; implementation requires proclamation (commencement) by President; Section **s. 40?** NHI Fund; **s. 41 NHI information system?** The Act provides for NHI Fund, Benefits Advisory Committee, registered users (citizens, permanent residents, refugees, certain foreign nationals, inmates), accredited providers contracted via the Fund, **unique identifier**, **health information system** (NHI Act ch. 7? "Health information systems"), **complaint structure**, with the NHI Fund collecting patient data. Business Tech article (Government targets private healthcare medical data) refers to the NDoH moving to require private sector data: https://businesstech.co.za/news/government/636899/ [R6-search]. Confidence: likely.
- **Litigation** (as of May 2026 searches): 
  - Cases in High Courts: Board of Healthcare Funders v President (Gauteng, Pretoria), Solidarity, Hospital Association of SA, SAMA/ Western Cape Premier, Discovery/ Medscheme?; Section **79** reference: not used; instead challenges: (1) procedural - Parliament's public participation (National Assembly, NCOP); (2) substantive - rights to healthcare, property, medical schemes, etc. 
  - Constitutional Court heard the public-participation challenges **5-7 May 2026**, reserved judgment [R6-search]; High Court substantive challenges stayed after undertaking not to implement. Confidence: confirmed (hearing).
  - Earlier: Gauteng High Court (Pretoria) decisions in 2025 on Section 33? uncertain.
  - No judgment found up to 31 Oct 2026. Confidence: uncertain whether judgment has been handed down after the searched articles; the ConCourt may have delivered; unverifiable.
- NDoH has been building NHI "digital" prerequisites (HPRS, EMR, HIE) irrespective of the Act's commencement; PMG replies describe them.

## 3.4 Health Professions Act 56 of 1974, HPCSA guidelines
- **Booklet 9 "Guidelines on the Keeping of Patient Health Records"** (HPCSA, Ethical and professional rules; booklet 9 current edition 2016? updated): records to be kept for **at least 6 years** from date they became dormant; for minors until age 21? ("children - until the child reaches the age of 21", i.e. 21 years or 6 years? "minors: until their 21st birthday" per HPCSA; "mentally impaired persons: for the duration of life"? my memory says "for patients under 18: until patient turns 21"; "mentally incapacitated: lifetime"); electronic records permitted; "records must be protected against unauthorised access"; patient right to copy; Confidence: likely (6-year rule is widely cited as "6 years after the record became dormant"), uncertain details.
- **Booklet 10 Telehealth guidelines** (HPCSA general ethical guidelines for telehealth; 2014 original; updated **2021** during COVID to allow telehealth, "Guidelines on Telehealth" booklet 10?) The HPCSA "Telehealth guidelines Booklet 10" 2021: practitioners must have an existing relationship? Not strictly; they must record consultations; confidentiality; Confidence: likely; numbering uncertain.
- **Booklet 5 Confidentiality: Protecting and providing information** (Booklet 5): permitted disclosures (consent, court order, public interest, to protect third parties, children at risk).
- HPCSA register counts: see Part 4.
- **Ethical rules (Rule 13? on confidentiality; Rule 17 on keeping of patient records)**: Rule 17 "A practitioner shall keep patient records..." Confidence: likely.

## 3.5 Medical Schemes Act 131 of 1998
- Governs schemes, CMS (Council for Medical Schemes, regulator), open enrolment, community rating, PMBs (Regulation 8), administrators accreditation (s. 57), **s. 67** reports; **Regulation 15** on disputes; "complaints"; confidentiality of member information: Medical Schemes Act s. 67? uncertain; CMS annual report reporting.
- Claims data: schemes and administrators provide returns to CMS; HMI recommended Central Data Repository (2019).
- PMB list: Regulation 8 and Annexure A (270 DTPs + CDL 26 conditions).

## 3.6 PAIA (Promotion of Access to Information Act 2 of 2000)
- Access to records of public and private bodies; **Form 2 (request for access to record of public body) / Form 2 for private body is Form C**: Public body: Form A; private body: Form C (PAIA Regulations 2002; updated 2021: Form 2 and Form 3 as per amended regs) — confidence: uncertain on form numbers. 30 days for response; Information Regulator took over PAIA oversight from SAHRC on 30 June 2021. Patients use PAIA or NHA s. 15 to get their records; **PAIA manuals** required for each private body (s. 51) including hospitals (deadline). Confidence: confirmed in structure.

## 3.7 Cybercrimes Act 19 of 2020
- Commenced largely **1 December 2021**; criminalises unlawful access (s. 2), interception (s. 3), data interference (s. 5), ransomware as "extortion" (s. 10), malicious communications. s. 54: **electronic communications service providers and financial institutions** must report offences to SAPS within 72 hours of becoming aware of cyber offences — applies to ECSPs and financial institutions, not hospitals as such (confidence: likely). Relevant to NHLS ransomware (extortion).

## 3.8 Electronic Communications and Transactions Act 25 of 2002 (ECTA)
- s. 11-12: data messages have legal recognition; written requirement satisfied by data message; **s. 13** signatures (advanced electronic signatures); **s. 15** admissibility of data messages as evidence; **s. 16** retention of information in data message form; ECTA is the basis for electronic health records legitimacy. Chapter VIII consumer protection (s. 43). Note: HPCSA recognises electronic records.
- **e-health regulations**: There is no standalone e-health Act; the NHA s. 74-? and HNSF gazette (GN 314 of 2014?) and **National Digital Health Strategy for South Africa 2019-2024** (NDoH; the "eHealth Strategy 2012-2017" preceded it). **Digital Health Strategy 2025-2030?** uncertain. 

## 3.9 National Health Normative Standards Framework (HNSF)
- Published as a Gazette notice under NHA s. 74 (2014); updated; sets standards for patient demographic identification, messaging (HL7), clinical terminology (ICD-10, SNOMED recommended?), security, "Health Professions Council registration number as provider ID", "Health Patient Registration Number"; mandatory for state systems, expected for private. Confidence: likely. Source: HNSF (iospress SHTI190175 article).

## 3.10 Consent rules, children, emergencies
- Consent for treatment: NHA s. 7 (informed), Children's Act 38 of 2005 s. 129: age 12+ may consent to medical treatment if sufficiently mature; age 12+ HIV test without parental consent; contraception from 12; surgery 12+ with parent/guardian assistance; Termination of Pregnancy Act (Choice on Termination of Pregnancy Act 92 of 1996): any age, no parental consent. Confirmed (Children's Act s. 129, s. 130 HIV testing: 12+ or child under 12 of sufficient maturity).
- Emergency disclosures: NHA s. 14(2)(c) public health serious threat; s. 5 "A health care provider, health worker or health establishment may not refuse a person emergency medical treatment." Confidence: confirmed (s. 5); s. 14(2) likely.
- Sexual offences/child abuse: mandatory reporting of child abuse under Children's Act s. 110 and Criminal Law (Sexual Offences) Act s. 54 (reporting duty for sexual offences against children and mentally disabled). Confirmed.
- Notifiable Medical Conditions: statutory disclosure without consent.
- Employers/insurance: disclosure to employers prohibited without consent (Employment Equity Act s. 7 HIV testing prohibited without Labour Court authorisation). Confirmed in substance.
- HIV: confidentiality (NHA) plus the **Regulations on HIV**; no national HIV case reporting (HIV is not a notifiable medical condition individual-level); data via TIER.Net aggregates. Confidence: likely (HIV not on NMC list).

## 3.11 Record retention periods (summary of what is documented)
- HPCSA Booklet 9: 6 years from last entry (adults); minors till 21 / or 6 years after age of majority? uncertain; mental incapacitated lifetime.
- Occupational Health: Hazardous Biological Agents/ Asbestos regs: 40 years; Compensation for Occupational Injuries Act: 4 years? uncertain.
- Medicines & pharmacy: Schedule 5-8 prescriptions retained 5 years (Regulation) — likely; Pharmacy Council Good Pharmacy Practice rules.
- Public records: National Archives Act; each department's file plan; Gauteng: "patient records at hospitals retained 10 years"? uncertain.
- Medical schemes/insurers: Financial Intelligence Centre Act 5 years; Medical Schemes Act records 7 years? uncertain; Companies Act 7 years for company records (hospital groups).
- POPIA s. 14: no longer than necessary.
- PMG shows the Department stating that retention follows the National Archives. Confidence: uncertain throughout this subsection.

## 3.12 Major breaches and outages (public record)
- **NHLS ransomware (June-July 2024)**: NHLS systems down for weeks; manual processing; lab results delays across provinces; **Operational impact**: the NHLS (public lab for most provinces) reverted to paper; claimed attack by the "**BlackBasta**" group (reported); data leak? In late 2024, reports of data posted (uncertain). Information Regulator inquiries (Daily Maverick 23 Mar 2025). Sources: https://www.dailymaverick.co.za/article/2025-03-23-national-health-laboratory-cyberatack-regulator-demands-details.md ; MedicalBrief https://www.medicalbrief.co.za/?p=191793 ; SAMJ article scielo.org.za/pdf/samj/v115n4/11.pdf (about the effect on HIV VL / TB testing; 2025 SAMJ vol. 115 no. 4) [R6-search]. Confidence: confirmed (event), uncertain on attribution to BlackBasta (I recall "Black Basta" claimed? - uncertain; do not use).
- **Life Healthcare (June 2021)**: cyberattack hit admin systems/ business applications; hospitals continued clinical care; (reported ransomware; attributed to...). Confidence: confirmed (event, June 2021), uncertain details.
- **Netcare**: 2018? data breach? Not found; (Netcare had a 2018 incident of patient info exposed via third-party? uncertain). Omit.
- **Medscheme?**: 2021? not found. **Discovery Health**: not breached to my knowledge. **Experian SA (2020)** (not health). **Dis-Chem (Nov 2024?)**: third-party operator breach affecting ~3.6 million customers (reported; Dis-Chem is retail pharmacy with clinics); uncertain details. **Mediclinic**: not found. **Lancet Laboratories**: Information Regulator enforcement notice Sept 2024; earlier ransomware (Lancet? "LockBit"? uncertain). **Pathcare/ Ampath**: not found.
- **Gauteng health system**: **Gauteng Department of Health** Information system outages / paper reversion are periodically reported (e.g. SAP HIS rollout and downtime at Charlotte Maxeke, Chris Hani Baragwanath; ~2019-2022) (uncertain). **Charlotte Maxeke Johannesburg Academic Hospital fire (April 2021)** destroyed systems/IT in block 1 (confirmed). 
- **Western Cape**: no major breach found.
- **Department of Health central breaches**: **COVID-19 vaccine** database? **Mediclinic? no.** Unknown.
- **Government Pensions Administration Agency (GPAA) 2024 ransomware** (not health). **SA Weather Service / Department of Defence (2024)** (not health).
- Confidence on this list: low for private-sector items.

---

# Part 4. System-wide statistics

(Values from the base research or well-known sources; flagged where not re-fetched.)

## 4.1 Population and coverage
- Population: ~62.0 million Census 2022 (Stats SA) (base). Mid-year population estimate 2025: ~63.1 million (Stats SA MYPE 2025 reported 63.1 million) - likely; 2026 MYPE not found.
- Medical scheme beneficiaries: 9.17 million across 71 schemes (CMS Annual Report 2024/25) (base). Historical: 8.9 million (2018), 9.0 (2019), 8.9 (2020), 8.9 (2021)? ~ 8.9-9.2 million; coverage ~14.8% of population (2024) (CMS: "14.6-15%"). Confidence: likely.
- Largest open scheme: Discovery Health Medical Scheme (~2.8 million beneficiaries?), GEMS (restricted, ~2.1 million+ principal and dependants) – confidence: likely, verify.
- Public sector reliance: ~83-85% (derived).

## 4.2 Facilities
- Public: ~3,800 PHC facilities (clinics ~3,500 + CHCs ~ 300?) and ~420 public hospitals (District, regional, tertiary, specialised) total about 4,200 public health establishments; National Health Facility Register (NHFR); Health Systems Trust DHB (District Health Barometer) lists ~3,500+ fixed PHC facilities; hospitals ~ 400. Confidence: likely; numbers by province not retrieved (see Unanswered).
- Private: ~ 200-ish private hospitals with ~ 38,000 beds? (Private Hospital: Hospital Association of SA says ~ 220 hospitals; HMI: 3 groups (Netcare ~ 50 hospitals, Mediclinic ~ 50 in SA, Life Healthcare ~ 60) hold ~ 80+% of beds). Confidence: likely (HMI 2019).
- Beds: public ~ 100,000 beds? ( ~ 2.2 per 1000?). Confidence: uncertain.

## 4.3 Workforce
- HPCSA registered: about 50,000 registered medical practitioners (doctors) ~ 55,000 in 2024; ~ 17,000 registered specialists? uncertain. SANC: ~ 300,000+ nurses/midwives incl. enrolled & auxiliary; professional nurses ~ 130,000-ish. SAPC: ~ 18,000 pharmacists, ~ 17,000 pharmacist assistants; ~ 3,500 pharmacies (community ~ 3,000). Confidence: uncertain; values to verify at hpcsa.co.za, sanc.co.za, pharmcouncil.co.za.
- Public sector doctors per 1000: ~0.31/1000 uninsured population (HST). Uncertain.

## 4.4 Spending
- Total health expenditure ~ 8-9% of GDP; public ~ 4% of GDP; consolidated government health expenditure about R250-300 billion (2024/25); medical scheme contributions ~R 200+ billion; Treasury Budget 2025/26 health allocations ~ R 270bn consolidated? Confidence: uncertain; verify with National Treasury Budget Review 2026.
- Out-of-pocket ~ 6-7% of total; confidence uncertain.

## 4.5 Patient volumes
- PHC headcount: ~ 120-130 million visits per year (DHB: 2022/23: PHC utilisation rate ~ 2.2-2.3 visits per person per year; uninsured population ~ 53 million); hospital admissions ~ 4 million public? Uncertain. Confidence: uncertain; the DHB (District Health Barometer, Health Systems Trust, https://www.hst.org.za) is the source to cite.

## 4.6 HIV/TB programme
- People on ART: ~ 5.7-5.8 million on ART in public sector (UNAIDS 2024: 5.9 million? reported "5.7 million people on ART (2023)"; Thembisa model; ~ 8 million living with HIV). TB: ~ 270,000 notified cases? (WHO Global TB Report 2024: SA estimated incidence ~ 280,000 (427/100,000?) 2023; notified ~ 200,000+ (uncertain)). Confidence: uncertain; verify with WHO Global TB report 2025 and NDoH.
- Viral suppression among those on ART: ~ 90-95% (95-95-95 progress). Uncertain.

## 4.7 NHLS volumes
- ~110.6 million tests in 2022/23 (base); ~265 labs (base). Annual report 2024/25 numbers: not retrieved.

## 4.8 Claims and switch volumes
- Not found in this round (switch companies do not publish volumes). Confidence: not found.

## 4.9 Connectivity and electricity
- Facility connectivity: NDoH stated in parliamentary replies that percentages of facilities have broadband (e.g. WC "all facilities"); Ideal Clinic assessments include "ICT infrastructure" element; Load shedding impact on clinics (2022-2023) - NHI/DoH statements; no figures retrieved. Stats SA GHS: ~ 94% of households with electricity. Confidence: not found for facility-level.

## 4.10 Digital health maturity and audit findings
- **Auditor-General SA (AGSA) PFMA 2023-24 and 2024-25 general reports** have repeatedly flagged health sector ICT: e.g. disaster recovery, patient information system implementation delays (Gauteng SAP HIS), data governance, and "reported performance information" material misstatements in health indicators. Confidence: likely; not re-fetched.
- NDoH self-assessments: "Digital Health Strategy 2019-2024" evaluation (uncertain); Africa CDC assessment of HIE (Dec 2025) pending; WHO "Global Initiative on Digital Health" assessments.
- The 2025 NDoH publication (base) is the main public maturity description.
- National EMR: beta live 28 Mar 2025 at 36 PHC facilities + 1 GP practice (base).

---

# Register of every named system, vendor and standard encountered

| Name | Description | Confidence |
|---|---|---|
| HPRS / HPRN | National patient registry and its number (NDoH) | confirmed |
| DHIS2 / webDHIS / NIDS | Aggregate reporting platform and indicator set | confirmed |
| TIER.Net | UCT-developed ART/TB electronic register | confirmed |
| ETR.Net | Electronic TB register (older) | likely |
| EDRWeb | Web register for drug-resistant TB (Western Cape / NHLS/NICD lineage) | likely |
| TrakCare Lab / LabTrak / WebView | InterSystems LIS used by NHLS; web results | confirmed |
| NHLS CDW | Patient-level lab data warehouse | confirmed |
| Clinicom | Western Cape hospital system (since 1998) | confirmed |
| PHCIS | Western Cape PHC information system | confirmed |
| PREHMIS | City of Cape Town clinic system | confirmed |
| PHDC | Western Cape Provincial Health Data Centre | confirmed |
| HMS2 / EHMS | EC/FS hospital system | confirmed |
| Meditech | Hospital EMR in KZN/FS parts | confirmed |
| KZN eHealth | KZN hospital system | confirmed |
| SAP HIS | Gauteng hospital system | confirmed |
| Medicom / PAAB | Legacy Gauteng systems | confirmed |
| CareOn | Named in brief; not verified | uncertain |
| ECCR | WC Electronic Continuity of Care Record | confirmed |
| National EMR | Beta Mar 2025 at 36 PHCs + 1 GP | confirmed |
| MomConnect | Maternal messaging programme (NDoH/Praekelt) | confirmed |
| CCMDD / SVS / RxSolution | Chronic medicine distribution; stock visibility; pharmacy stock | confirmed |
| Pelebox | Smart-locker for medicine pickup | likely |
| NMC App | NICD notifiable condition reporting | likely |
| GoodX | Private practice software | confirmed |
| Healthbridge / MediSwitch / Medikredit | Claims switches/TPAs | likely |
| MEDCLM | SA EDIFACT claims message (BHF) | confirmed |
| NAPPI | Pharma product code (7+3) | confirmed |
| ICD-10 MIT | Industry ICD-10 table | likely |
| PMB / DTP / CDL | Prescribed minimum benefit constructs | confirmed |
| BI-24 / BI-1663 | DHA birth notification / death notification | confirmed |
| MCR / RTHB | Maternity Case Record / Road to Health Booklet | confirmed |
| HNSF | Normative standards framework (2014) | confirmed |
| Projectathon / Gazelle / IHE | FHIR interoperability testing event | likely |
| EVDS | COVID vaccination data system | likely |
| HL7 v2, FHIR, DICOM, LOINC, SNOMED, ICD-10 | Standards | confirmed as standards |

---

## Unanswered / could not find

- Any provincial FHIR pilot with named province/vendor/dates; FHIR implementation guide published by NDoH; date/venue of the Projectathon.
- Database engines and schemas of HPRS, TIER.Net (current version), Clinicom, PHCIS, HMS2, SAP HIS, CareOn, GoodX.
- HPRN exact format and length.
- BHF MEDCLM specification (segment-level) and ICD-10 MIT file layout (restricted/licensed documents).
- NAPPI field-level file layout and ownership statement confirmation.
- SNOMED CT membership status of South Africa as of 2026; LOINC mandate.
- Whether the Constitutional Court has delivered judgment in the NHI case after May 2026.
- Outcome of the Information Regulator's NHLS inquiry; Life Healthcare, Netcare, Medscheme, Dis-Chem breach details and any regulator action.
- Current facility counts by type and province; bed counts; HPCSA/SANC/SAPC registered numbers for 2026; health expenditure 2025/26; PHC headcount and admissions for latest year; ART and TB notification numbers for 2025; switch/claim volumes; facility connectivity percentages.
- Official retention periods in provincial records policies; the exact current form numbers for PAIA and Mental Health Care Act regulations.
- Exact section numbering in NHA ch. 9 for health information (s. 74-76) and in POPIA regulations 2025 amendments.
- The NHLS 2024 attacker attribution and data-leak extent.

Verification note: many entries in Parts 2-4 are from documented background knowledge not re-fetched in this round; confidence tags mark this honestly. This file runs shorter than the 1,400-line target because the live-search budget allowed only three rounds of verification, and unverified material was deliberately not padded.


---

# PART G: COMPARABLE AND COMPETING TECHNOLOGY

*Source file: research/phase_G_comparable_technology.md (216 lines)*

# Phase G - Comparable and competing technology map (health data interoperability / HIE)

Compiled 2026-10-31 to 2026-11-01. Scope: South African, African and global products, platforms, programmes and national infrastructures that resemble the SAHealth gateway concept (live pull from independent sources, canonical model, adapters, identity matching, consent, audit, honest unavailability disclosure). This is a descriptive map only. No recommendations and no evaluation of DEXA's plan. "DEXA" in this project means only the DEXA startup; no other entity of that name is referenced.

Method notes
- About 55 web searches and fetches were run (WebSearch, WebFetch), plus two Python scrapers in C:\SA Health\research\scrapers\ (G_vendor_pages.py, G_deep_pages.py; outputs G_vendor_pages.json, G_deep_pages.json) that fetched about 80 vendor, standards and GitHub pages.
- A mid-run search quota exhaustion occurred; the remaining searches were completed after the quota reset.
- Confidence labels: confirmed = stated on a primary or named reputable source that was read in this phase; likely = stated by secondary sources or consistent across several snippets; uncertain = single weak source, vendor claim, or inferred.
- Where a source was only seen as a search-result snippet (not opened), that is stated.
- No database was touched; no git actions; only this file and the scraper files were created.

---------------------------------------------------------------------------------------------------

## 0. Summary comparison table

| # | Entity | Type | Geography | Model | Pull vs copy | Status (as found) | Confidence |
|---|--------|------|-----------|-------|--------------|-------------------|------------|
| 1 | CareConnect HIE (InterSystems HealthShare on AWS) | Private-sector HIE, SA | South Africa | Not-for-profit consortium; on HealthShare UCR + Patient Index | Aggregated record (HealthShare UCR) | Launched 2021/22; DECOMMISSIONED, announced 26 Jul 2024; records destroyed | confirmed |
| 2 | NDoH Health Information Exchange / HPRS / e-Impilo (CSIR) | Public national | South Africa | Government in-house with CSIR | Federated pattern per HNSF; HPRS is central registry | HPRS operating; HIE under Africa CDC assessment (Dec 2025); Projectathon Jan 2026 | confirmed |
| 3 | Western Cape Provincial Health Data Centre + Single Patient Viewer | Provincial data platform | Western Cape | Provincial government | Integrated data centre (copy) plus viewer | Operating; ~15m patient contacts/yr cited | confirmed |
| 4 | Gauteng Health Information System (Gijima tender) | Provincial HIS | Gauteng | R339m tender reported awarded 2020 | Central HIS | Partial modules live in hospitals | likely |
| 5 | Jembi Health Systems | NPO implementer | Africa | Open source services | Builds HIEs | Active; MomConnect, Rwanda, others | confirmed |
| 6 | OpenHIM | Open-source integration mediator | Africa/global | MPL-2.0 | Routing mediator | Active repo | confirmed |
| 7 | OpenHIE framework | Architecture community | Global | Open | Reference architecture | Active community | confirmed |
| 8 | DHIS2 / HISP | Aggregate HMIS | 80+ countries; SA origin | Open source (University of Oslo) | Aggregate copy | Dominant national HMIS | confirmed |
| 9 | OpenMRS / Bahmni / KenyaEMR | Open-source EMR | 8000+ facilities (OpenMRS site) | Open source | Facility EMR | Active | confirmed |
| 10 | Kenya Digital Health Agency HIE / Afya Yangu / AfyaLink | National HIE | Kenya | Government, Digital Health Act 2023 | National shared health record, FHIR | Operational (reported), 2024 onward | likely |
| 11 | Tanzania TZ-HIE | National HIE | Tanzania | MoH with USAID/JSI | HIM mediator | Operating since ~2018-2020 | confirmed |
| 12 | Rwanda RHIE | National HIE | Rwanda | MoH; Jembi, SAVICS | OpenHIM + OpenMRS | Operating | confirmed |
| 13 | Nigeria NDHA / HIE / HCX | National architecture | Nigeria | Government (NDHI, 2024) | HIE + SHR + registries | Under construction | likely |
| 14 | Ghana NHIE / LHIMS / GHIMS | National | Ghana | MoH | NHIE connects apps | Mixed; LHIMS reported discontinued | likely |
| 15 | Zambia SmartCare Pro | National EHR | Zambia | MoH, CDC funded, Smart Zambia | Facility EHR | 406 facilities deployed (2025 report) | likely |
| 16 | Altron HealthTech (MediSwitch / SwitchOn, MedeMass, MedeServe) | Private SA vendor | South Africa | Commercial | Switch and PM | Active; 8,000+ practices | confirmed |
| 17 | Healthbridge | Private SA vendor | South Africa | Commercial | Switch, PM, EMR | Active; ~19m claims/yr (self-reported) | likely |
| 18 | MediKredit | Private SA vendor | South Africa | Commercial | HealthNet ST switch; NAPPI | Active | confirmed |
| 19 | Discovery Health HealthID | Private EHR app | South Africa | Discovery | Consent-based view | Active since 2012 | confirmed |
| 20 | Vula Mobile | Referral app | South Africa | Social enterprise | Messaging/referral | Active | likely |
| 21 | Reach Digital Health (ex-Praekelt.org) | NPO | South Africa | Open source | MomConnect | Active; moving ownership to govt | confirmed |
| 22 | InterSystems HealthShare / TrakCare | Global HIE vendor | Global; SA presence | Commercial | Aggregation + federation | Active | confirmed |
| 23 | Mirth Connect / Open Integration Engine / BridgeLink | Integration engine | Global | Commercial since 4.6 (Mar 2025); forks MPL | Message routing | Active | confirmed |
| 24 | Rhapsody / Corepoint / Cloverleaf | Integration engine | Global | Commercial | Message routing | Active | likely |
| 25 | Redox | Integration network | US | Commercial SaaS | Brokered APIs | Active | confirmed |
| 26 | Particle Health | Record-retrieval API | US | Commercial | Live query of networks | Active; "320+ million" records claim | confirmed (claim) |
| 27 | Health Gorilla | QHIN | US | Commercial | Network | TEFCA QHIN | confirmed |
| 28 | Zus Health / Metriport / 1upHealth | Aggregators | US | Commercial / open source | Query + store | Active | confirmed |
| 29 | AWS HealthLake / Azure Health Data Services / Google Cloud Healthcare API | Cloud FHIR stores | Global | Cloud PaaS | Store | Active | confirmed |
| 30 | HAPI FHIR / Smile CDR / Firely / Aidbox / Medplum | FHIR servers | Global | Open core / commercial | Store | Active | confirmed |
| 31 | Epic Care Everywhere / Carequality / CommonWell / TEFCA | US exchange | US | Network frameworks | Federated query | Live | confirmed |
| 32 | NHS Spine / NRL / SCR / ShCR | National | England | NHS England | Record locator + pointers | Live | confirmed |
| 33 | Estonia X-Road / Digilugu | National | Estonia | Government | Federated, signed queries | Live since 2008 | confirmed |
| 34 | India ABDM | National | India | Government | Federated, consent manager | Live; ABHA counts vary | confirmed |
| 35 | MyHealth@EU / EHDS | Supranational | EU | Regulation | Federated national contact points | Regulation in force; phased | likely |
| 36 | Verato / NextGate / IBM Initiate / OpenEMPI / Senzing | Identity matching | Global | Commercial / OSS | MPI | Active | confirmed |
| 37 | HL7, IHE, Digital Square/PATH, WHO SMART, Africa CDC | Standards/programmes | Global | Non-profit | n/a | Active | confirmed |

---------------------------------------------------------------------------------------------------

## 1. South African players

### 1.1 Public-sector national platforms

#### 1.1.1 National Department of Health (NDoH) Health Information Exchange (HIE)
- What it is: the national technology platform "that lets different patient information systems exchange data and build a shared Electronic Health Record" (Minister's reply, PMG Question NW6570).
- Owner/operator: National Department of Health, with CSIR as development partner for related components.
- Technical: federated architectural pattern stated in the gazetted Health Normative Standards Framework (HNSF) for Interoperability in Digital Health (gazetted 21 Oct 2022; updates 2014 framework). BusinessTech quotes the authors: "A federated architectural pattern will be followed to enable interoperability." Earlier HNSF 2014 listed HL7 v2.x, HL7 CDA/CCD, DICOM, ICD-10, LOINC (via PLOS Digital Health review). HNSF described by an OpenHIE session page as "based on IHE profiles".
- Status: Africa CDC was to conduct an independent assessment of the NDoH HIE, plus solutions from two provincial departments and six private-sector solutions, in the week of 2 December 2025 (PMG reply). Conformance testing of patient information systems against interoperability standards was scheduled for 26-28 January 2026 hosted with CSIR (same reply). Revised National Digital Health Strategy was due in "4th quarter of this financial year" per the reply.
- Private-sector data: HNSF article states private providers would share data with the national registry as the NHI Bill prescribes.
- Relation to other SA systems: HPRS is the registry component; NHI Fund is to help build and maintain the national health information system.
- Sources: https://pmg.org.za/committee-question/34165/ ; https://businesstech.co.za/news/government/636899/government-targets-private-healthcare-medical-data-as-it-lays-more-groundwork-for-nhi/ ; https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9931258/
- Confidence: confirmed (primary: ministerial reply read; HNSF via BusinessTech).

#### 1.1.2 Health Patient Registration System (HPRS)
- What it is: patient registration and master patient index at facilities, built by NDoH with CSIR. Assigns a unique MPI identifier. Described as the source of the NHI beneficiary registry.
- Scale: parliamentary reply (2021) reported 63,241,201 individuals registered since inception (PMG NW2717, via search snippet; figure dated).
- "Zero rated": the HPRS and the primary health care EMR incur no internet data costs for users (PMG NW6570).
- Integration: the NDOH 04-2025/2026 EMR tender requires interoperation with HPRS, the laboratory information system and the Master Health Facility List.
- Sources: https://pmg.org.za/committee-question/19974/ ; https://pmg.org.za/committee-question/34165/ ; ITWeb tender item (below)
- Confidence: confirmed.

#### 1.1.3 CSIR e-Impilo and NHI digital work
- What it is: CSIR (government research council) develops e-Impilo electronic medical record and HPRS for NDoH. SABC (23 Oct 2019) reported NDoH working with CSIR on NHI digital platforms; Dr Nicholas Crisp said the aim was "to put more power in the hands of the clinicians".
- Projectathon: CSIR e-Impilo team tested against the IHE Gazelle test platform, validating HL7 FHIR-based interoperability (post by Bash Govender, search snippet).
- NHI in-house stance: Brainstorm/ITWeb (2 Sep 2024) reports Crisp: "We won't be using vendors", and that there is unlikely to be public cloud. (Subtitle states no public cloud.)
- Sources: https://www.sabcnews.com/sabcnews/health-department-csir-to-develop-digital-platforms-to-run-nhi/ ; https://brainstorm.itweb.co.za/content/RgeVDvPRZn1MKJN3
- Confidence: confirmed for statements; AWS involvement claimed by one search snippet not confirmed in the article read (article did not mention AWS) - uncertain.

#### 1.1.4 NDOH tender NDOH 04-2025/2026 (EMR digital health solution)
- Scope: appoint service providers to implement the EMR at all fixed primary health care facilities in eight provinces excluding the Western Cape; 18 months; bids evaluated separately per province.
- Must interoperate with HPRS, LIS and Master Health Facility List.
- Dates: compulsory briefing 23 Feb 2026; closing 9 Mar 2026. No award notice found.
- Source: https://www.itweb.co.za/article/top-ict-tenders-health-dept-eyes-electronic-medical-record-solution/4r1lyMR9Y997pmda
- Confidence: confirmed (tender); award unknown.

#### 1.1.5 DHMIS tender (2023)
- NDoH invited tenders (MedicalBrief, 12 Jul 2023) to host, maintain, support and enhance the District Health Management Information System for three years, plus an ICSP (Internship and Community Service Programme) system tender. No bidders named.
- Source: https://www.medicalbrief.co.za/?p=166532 ; Confidence: confirmed.

#### 1.1.6 Digital Health Interoperability Projectathon (26-28 Jan 2026)
- Organisers: NDoH, CSIR, IHE Catalyst; venue CSIR ICC, Pretoria. Aims: test whether systems in use can securely share patient information; support NHI portability. Opening by Dr Nicholas Crisp (DDG NHI) per social posts. gov.za advisory names no vendors and does not state FHIR.
- A May 2026 write-up claimed outcomes show NHI digital building blocks are "highly attainable" (search snippet, source not opened).
- Sources: https://www.gov.za/news/media-advisories/government-activities/health-leads-first-digital-health-interoperability ; Confidence: confirmed (event), uncertain (outcomes).

#### 1.1.7 National Digital Health Strategy 2019-2024
- Strategy for "better health for all South Africans enabled by digital health"; calls for national electronic health record and digitisation; builds on eHealth Strategy 2012-2016. Revised strategy promised (see 1.1.1).
- Source: https://knowledgehub.health.gov.za/system/files/elibdownloads/2023-04/national-digital-strategy-for-south-africa-2019-2024-b.pdf (not opened; via search results) ; Confidence: likely.

#### 1.1.8 Normative standards: HNSF
- 2014 version 2.0 created by NDoH/CSIR; 2021 HNSF gazetted 21 Oct 2022. Federated pattern; private sector included.
- Academic proposal: Tsegaye & Flowerday, SACJ 33(1) 2021, "A system architecture for ensuring interoperability in a South African national electronic health record system". Reported most facilities still paper-based.
- Source: https://sacj.cs.uct.ac.za/index.php/sacj/article/view/838 ; Confidence: confirmed for existence.

### 1.2 Provincial platforms

#### 1.2.1 Western Cape Provincial Health Data Centre (PHDC) and Single Patient Viewer (SPV)
- What: provincial data platform integrating patient-level data from multiple health information systems, with a web-based Single Patient Viewer for clinicians.
- Owner: Western Cape Government Health.
- Technical: separate patient and clinical databases linked by internal unique patient key; common identifier; Clinicom (Siemens) patient administration system with shared patient master index rolled out across hospitals from 1998; about 15 million patient contacts per year (search summary of IJPDS profile).
- COVID-19: OpenHIM reportedly used for Western Cape COVID-19 case reporting (Jembi / New America repository snippet; unverified detail).
- Sources: https://ijpds.org/article/view/1143 ; https://ijpds.org/article/view/1614 ; Confidence: confirmed (PHDC), likely (OpenHIM link).

#### 1.2.2 Gauteng Health Information System
- Gijima awarded R339m HIS tender in 2020 (ITWeb as cited in Daily Maverick/Spotlight, 2022). Patient admin, billing, finance, revenue modules reported live at 37 hospitals and 33 CHCs (2024 report). Earlier Siemens Soarian MedSuite project began 2008 (Sebokeng go-live Aug 2008).
- Criticism: DA spokesperson called rollout "way behind schedule" (2022).
- Sources: https://www.dailymaverick.co.za/article/2022-07-15-contrasting-views-and-scepticism-overshadow-gautengs-new-health-information-system/ ; Confidence: likely (snippets only).

#### 1.2.3 Free State - Vodacom
- Nov 2023: Free State Department of Health and Vodacom launched computer-aided dispatch and assisted-reality medico-legal surveillance system; premier tied to NHI e-Health vision. Not an HIE.
- Source: https://www.telecomtv.com/content/digital-platforms-services/free-state-department-of-health-partners-with-vodacom-for-digital-health-solutions-49032/ ; Confidence: confirmed.

### 1.3 Private-sector exchange and connectivity

#### 1.3.1 CareConnect HIE (decommissioned)
- What: South Africa's first private-sector health information exchange. Not-for-profit company founded by Discovery Health, Medscheme, Momentum Health, Life Healthcare, Netcare and Mediclinic.
- Technology: InterSystems HealthShare Unified Care Record and HealthShare Patient Index selected (Feb 2020); hosted on AWS (ITWeb/AWS article). Altron press release (3 Dec 2024) says launched 2022 after two years of development.
- Timeline: Life Healthcare notice says introduced March 2021; unveiled to industry April 2022 (ITWeb); announcement of decommissioning dated 26 July 2024; all records captured on the HIE destroyed in line with data protection regulation; no reasons stated (Life Healthcare notice).
- Consent/security: access only by verified practitioners when medically necessary and with patient consent, revocable; role-based (admin staff see demographics only); ISO 27001/27701, POPIA, Medical Schemes Act, National Health Act, GDPR cited (ITWeb 2022).
- Scale: "over three million lives" in first phase (IOL-linked coverage via search snippet); "launched with six founding stakeholders".
- Altron HealthTech was first practice-management application to join (press release dated 3 Dec 2024, i.e. after decommissioning announcement of 26 Jul 2024 - the dates conflict; the Altron page is as retrieved).
- Relation: sought to bridge to public sector and NHI (Business Report Oct 2023).
- Sources: https://www.lifehealthcare.co.za/news-and-info-hub/health-information-exchange-hie-has-been-terminated/ ; https://www.itweb.co.za/article/first-medical-data-sharing-hub-goes-live-in-sa/GxwQDq1Z8gPvlPVo ; https://healthtech.altron.com/press-releases/collaborative-information-sharing-with-altron-healthtech-and-careconnect
- Confidence: confirmed (decommissioning from the member's own notice). Note the date inconsistency on the Altron release.

#### 1.3.2 Altron HealthTech (MediSwitch/SwitchOn, MedeMass, MedeServe)
- What: Altron division formed 2016 from MedeMass, MediSwitch and MedeServe; over 30 years in practice management and electronic claims switching.
- Product: SwitchOn (formerly MediSwitch) reported by Altron at over 8,000 healthcare practices; real-time benefit validation, billing automation; "cloud-based eHR".
- Medscheme link: MediSwitch real-time online claim response to Medscheme (ITWeb).
- Model: commercial, per-transaction/subscription (not documented in sources read).
- Sources: https://healthtech.altron.com/ ; https://healthtech.altron.com/about-us ; https://healthtech.altron.com/switchon ; Confidence: confirmed.

#### 1.3.3 Healthbridge
- Founded 2000 (CB Insights/own site); real-time claims switching pioneer; clinical (EMR), practice management and bureau services; self-reported about 19 million claims per year.
- Competition law: ITWeb reports a Competition Commission merger approval condition requiring unhindered trading-partner access for clients on a DHS-controlled practice management app; connection to Healthbridge not established.
- Sources: https://healthbridge.co.za/our-story/ ; Confidence: likely.

#### 1.3.4 MediKredit
- Self-described healthcare company with 80+ years; proprietary switch HealthNet ST; pharmacy benefit management; inventor/owner/custodian of the NAPPI code system (self-description).
- Source: https://bhf.universal.co.za/medikredit/ ; Confidence: likely (website returned a Cloudflare challenge to the scraper).

#### 1.3.5 Medscheme / Intellihealth / Mediswitch interplay
- Medscheme: medical-scheme administrator and CareConnect founder; MediSwitch provides it online claims. No source found on Intellihealth technology.
- Confidence: likely for Medscheme; Intellihealth not found.

#### 1.3.6 Digital Healthcare Solutions (DHS)
- Practice management vendor mentioned in the Competition Commission context above; jointly owned by PQ Africa and Bytes Technology Group (ITWeb snippet). No further technical information retrieved.
- Confidence: uncertain.

#### 1.3.7 CompuGroup Medical South Africa
- Acquired Medical EDI Services (CPS practice management/billing); Competition Commission concluded unlikely to lessen competition (gazette notice, search snippet).
- Confidence: likely.

#### 1.3.8 Discovery Health HealthID
- What: electronic health record app for doctors launched May 2012; doctors may open a record only after the patient has consented in writing; withdrawal by contacting Discovery. Emergency HealthID via QR code for paramedics.
- Evaluation: University of Cape Town study found potential consultation efficiency gains, noting incentives and training may have been more influential.
- No source found stating FHIR or national-standards compliance.
- Sources: https://discovery-holdings-ltd.mynewsdesk.com/pressreleases/discovery-health-launches-healthid-a-revolution-in-electronic-health-records-in-sa-779062 ; Confidence: confirmed (existence and consent model).

#### 1.3.9 Netcare / Mediclinic / Life Healthcare data platforms
- All three were CareConnect founders. No sources found on their internal data platforms or integration engines. Life Healthcare retains admission/discharge records on its own systems (notice).
- Confidence: uncertain beyond CareConnect.

#### 1.3.10 Vula Mobile
- Referral and secure chat app used in SA since 2014; began as ophthalmology referral; 16+ specialities. DRK Foundation cites 32K+ healthcare workers and 1.3M patients served; older MIT Solve entry 20,000 registered workers (dates unclear).
- Evidence: Eerste River study showed inappropriate referrals fell 6.7% to 4.2%; Western Cape study found inconsistent use across specialities and missing infrastructure/policy.
- Sources: https://www.drkfoundation.org/?p=18660 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC9082220 ; Confidence: likely.

#### 1.3.11 Hello Doctor
- Not found beyond the query; no sourced facts retrieved. Confidence: not found.

#### 1.3.12 Reach Digital Health (formerly Praekelt.org) and MomConnect
- Founded 2007 in SA; MomConnect (NDoH programme) uses SMS and WhatsApp in all 11 official languages; ITU WSIS 2026 entry says 5.2 million mothers supported and technology ownership transitioning to government. Early registration ran on Praekelt's open-source Vumi platform. OpenHIM is a core component of MomConnect and NurseConnect (Jembi-related sources).
- Sources: https://www.reachdigitalhealth.org/resources/digital-health-in-south-africa-innovating-to-improve-health ; https://www.itu.int/net4/wsis/stocktaking/Prizes/2026/Details/17720121703313989 ; Confidence: confirmed.

#### 1.3.13 Vodacom / Mezzanine
- Mezzanine built mVacciNation; Vodacom and AUDA-NEPAD partnership for digital vaccination records (snippet). No Vodacom EHR role in NHI found.
- Confidence: likely.

#### 1.3.14 Other SA names searched
- Sanlam health tech, Genie, Aviro Health, RapidPro, BroadReach/Vantage, Health Ledger blockchain claims startups: no sourced interoperability facts retrieved in this phase. DrNote listed as SA GP-practice startup (cloud-native, mobile-first); FHIR use not stated.
- Confidence: not found / uncertain.

#### 1.3.15 Integration engines and cloud in SA health
- Infor Cloverleaf is listed as sold in South Africa on directories; no named SA hospital deployments found for Cloverleaf, Rhapsody/Corepoint, or Mirth (search summary).
- No sources found placing Azure Health Data Services or AWS HealthLake in SA public-health use; AWS hosted CareConnect.
- Confidence: uncertain.

#### 1.3.16 InterSystems in SA
- CareConnect selection (Feb 2020); TrakCare reported at three SA sites incl. an HIV clinic (ITWeb, dated); TrakCare Lab at South Africa's largest pathology organisation supporting 4,400 clinics and hospitals (case-study title; deployer implied NHLS but not stated in the snippet - uncertain).
- Henry Adams named country manager (ITWeb).
- Confidence: confirmed (CareConnect); likely (others).

### 1.4 SA research and academic work
- mHealth4Afrika: HL7 FHIR service for EMR-DHIS2 and EMR-to-EMR exchange in Ethiopia, Kenya, Malawi and South Africa (paper snippet).
- DHIS2 SA story: "Integrated Human Resources for Health using DHIS2 and FHIR in South Africa" (dhis2.org, 1 Aug 2022).
- HISP: began 1994 as action research (University of Oslo and University of the Western Cape, Norad funded); first DHIS built for three Cape Town districts; Western Cape by 1998; national standard adopted around 2001 (arXiv/UiO snippets).
- Confidence: confirmed (history).


---

# PART H: FOLLOW-UP PASS: PRIMARY-SOURCE VERIFICATION OF OPEN GAPS

*Source file: research/phase_H_followup_verified.md (52 lines)*

## Round 6 gap findings (follow-up pass, verified against primary pages)

This section was researched directly in the main session, fetching the parliamentary replies on pmg.org.za. Each item states what was actually read on the page, and what could not be read.

### H1. HPRS: facilities with the system and how it is used

- **3,474 public health facilities, reply to NW3319 (question dated 3 November 2023).** The reply says "a separate spreadsheet of 3474 public health facilities" lists where HPRS is installed. The reply also says "The HPRS records a patient's visit and categorise the patient's reason for visit." The reply declined to provide a list of all hospitals and clinics ("We are not in a position to provide a list of all (a) hospitals, (b) clinics"). The reply date is not shown on the page. Source: https://pmg.org.za/committee-question/23923/ . Confidence: confirmed for the quoted figures. The spreadsheet attachment itself, which would hold the per-province facility lists, was not readable.
- **3,280 facilities with HPRS rolled out; biometric functionality in 249 facilities, reply to NW4628 (1 August 2025).** The reply says biometric verification is being done "in collaboration with the Department of Home Affairs", refers to "real-time identity verification using data from the National Population Register", and lists "Integration with programmes such as the Central Chronic Medicines Dispensing and Distribution (CCMDD)". No province-level breakdown is given. Source: https://pmg.org.za/committee-question/31749/ . Confidence: confirmed.
- **Two totals for different dates conflict.** 3,474 (NW3319, 2023, "installed") versus 3,280 (NW4628, 2025, "rolled out"). They may count different things (installed versus rolled out, or different facility lists). The reason for the difference is not stated in either reply. Confidence: confirmed that the figures differ; the explanation is uncertain.
- **Per-province active use (from the Phase A research, not re-fetched here).** A June 2025 report put North West at 101 of 319 facilities actively using HPRS with a 16% synchronisation rate. KwaZulu-Natal had 488 functional and 119 non-functional HPRS facilities, with no hospital using HPRS yet. Free State has sent daily Patient Master Index updates to the national system since June 2020. Search-result snippets from Select Committee on Social Services records also gave "87% of facilities actively used the system" for one province and "98% progress in implementation" for the Eastern Cape, with the province names not confirmed. Confidence: likely for North West and KZN (agent-reported from primary sources); uncertain for the snippet-only figures.
- **How this changes the picture.** The existing brief counts "registered patients" (68 million). The facility-level figures show a different measure: how many facilities have the software (about 3,300 to 3,500) and how many actively synchronise (varies widely by province, as low as 16% in North West in mid-2025).

### H2. SA Connect Phase 2: health facilities connected

- **1,895 health facilities connected under the Universal Service Obligation strand; target 4,232 by 2029.** The reply to NW6279 (page date 5 January 2026) states "1,895 health facilities", and says "A total of 5,917 sites have been connected" in that strand. It gives no provincial breakdown. Source: https://pmg.org.za/committee-question/35068/ . Confidence: confirmed. The "as at" date of the figures (a search summary said 31 October 2025) was not shown on the fetched page.
- **Different target figures exist.** A 2024 ministerial statement cited 3,873 health facilities under the USO (per a search summary, not fetched). Confidence: uncertain.
- **Whole-programme figures (search summaries, not fetched).** 7,622 government sites upgraded or installed against a 14,342 target, and a 2026 budget article saying Phase 2 "comes to an end" after connecting 6,343 government facilities, with ongoing maintenance of about 948 facilities a year from an R888.8 million allocation. Source: https://www.itweb.co.za/article/budget-2026-sa-connect-phase-two-comes-to-an-end/Pero3MZ3zXXqQb6m . Confidence: uncertain until the article is read.
- **Older figure:** an older USO report cited in a reply said 2,866 primary health care facilities remained unconnected; predates the 2025 figures. Confidence: uncertain.
- **How this changes the picture.** It resolves the earlier "1,895" uncertainty: the figure is a government reply and refers to the USO strand only. Roughly 1,900 of a 4,232-facility target are connected, so more than half of the targeted health facilities are not yet connected.

### H3. SANBS hospital blood ordering

- **No source describes a SANBS online hospital ordering interface or its protocol.** A targeted search found nothing on a hospital-facing ordering system for SANBS. Confidence: confirmed that it was not found; this is an unanswered question, not evidence that none exists.
- **What was found.** SANBS says it has "83 blood banks servicing close to 500 hospitals countrywide"; hospitals without an on-site blood bank order and receive blood by courier. SANBS's new blood establishment computer system became operational in November 2023. The US regulator filing for the vendor's product says it "is intended to be interfaced with 3rd party systems through standard network connections", which is a product statement, not a SANBS statement. Canadian Blood Services and NHS Blood and Transplant run online hospital ordering portals; no equivalent SANBS portal was found. Sources: https://sanbs-integrated-report.sanbs.org.za/manufactured-capital.php ; https://fda.innolitics.com/device/BK230986 . Confidence: likely for the 83 blood banks and ~500 hospitals (from a SANBS representative quoted in press); uncertain for everything about ordering.

### H4. Provincial data warehouses and analytics outside the Western Cape

- **KwaZulu-Natal: a Health Data Centre project modelled on the Western Cape.** The KZN Department of Health runs a "KZN Data Warehouse project" whose stated aim is to establish a "provincial Health Data Centre in the KZN Department of Health" covering all health facilities, building on the Western Cape Data Warehouse project. It makes individual-level patient data available to clinicians and service managers. AHRI (Africa Health Research Institute) donated IT equipment. As of 28 October 2022 it covered 17 primary care clinics in the Hlabisa sub-district, and the implementation "will run across 17 Hlabisa sub-district clinics and eight Umdoni sub-district public health clinics" (25 clinics in two sub-districts). The source systems were not named. Source: https://www.ahri.org/ahri-donates-it-equipment-to-support-kzn-data-warehouse-project/ . Confidence: confirmed for the 2022 scale; its current scale is unknown.
- **National diabetes dashboard, built by NHLS with the Gauteng Department of Health (April 2026).** Search summaries say it draws on the NHLS Corporate Data Warehouse, refreshes within 48 hours and shows provincial and district trends in HbA1c-based diabetes control. Sources: https://www.sanews.gov.za/node/81065 ; https://pressportal.co.za/stream/story/32e3f605366e8e5f-20260428.html . Confidence: likely (summaries only, pages not fetched).
- **Gauteng and Eastern Cape: no provincial warehouse found.** Confidence: confirmed that none was found; not proof none exists.
- **How this changes the picture.** KZN is attempting a second provincial data centre (small scale as of 2022). The Western Cape is therefore not the only province to attempt one, but it is the only one documented at scale.

### H5. "Enterprise Manager" / PHIS

- A search summary of the NW3319 reply said "41 hospitals are using 'Enterprise Manager' known in the province as Provincial Health Information System (PHIS). Clinics are using the Health Patient Registration System." The province was not named in the summary. The Phase B agent attributed it to Limpopo; the reply page text for the provincial sections could not be read (325,000 characters of mostly encoded text), so the attribution could not be verified. It also conflicts with the 1 August 2025 reply, which says Limpopo is "not currently implementing Patient Information or EMR Systems at hospitals". Confidence: uncertain. Treat as open until the NW3319 reply is read in full.

### Sources used in this follow-up pass
- https://pmg.org.za/committee-question/23923/ (NW3319)
- https://pmg.org.za/committee-question/31749/ (NW4628)
- https://pmg.org.za/committee-question/35068/ (NW6279)
- https://www.ahri.org/ahri-donates-it-equipment-to-support-kzn-data-warehouse-project/
- https://sanbs-integrated-report.sanbs.org.za/manufactured-capital.php
- https://fda.innolitics.com/device/BK230986
- https://www.itweb.co.za/article/budget-2026-sa-connect-phase-two-comes-to-an-end/Pero3MZ3zXXqQb6m
- https://www.sanews.gov.za/node/81065

## Unanswered / could not find
- The per-province facility list inside the NW3319 spreadsheet attachment.
- The "as at" date of the SA Connect 1,895 figure.
- Whether SANBS has a hospital-facing electronic ordering interface, which hospitals use it and the protocol.
- Which province the "Enterprise Manager / PHIS, 41 hospitals" statement refers to.


---

# APPENDIX: INDEX OF ALL SOURCE URLS (260)

- http://dhis2.org/schema/dxf/2.0
- https://accessgudid.nlm.nih.gov/devices/03665324000050
- https://african.business/2023/06/apo-newsfeed/south-africa-introducing-exciting-new-notifiable-medical-conditions-nmc-reporting-app-features
- https://ajic.wits.ac.za/article/view/18892
- https://allafrica.com/stories/202605140359.html
- https://apps.apple.com/mx/app/ampath-pro-plus/id6504678254
- https://apps.apple.com/za/app/nmc-reporting/id1576336912
- https://auruminstitute.org/areas-of-expertise/hiv/monitoring-evaluation-and-reporting
- https://bhf.universal.co.za/medikredit/
- https://bowmanslaw.com/insights/south-africa-national-health-insurance-hearing/
- https://brainstorm.itweb.co.za/content/RgeVDvPRZn1MKJN3
- https://businessreport.co.za/news/south-africa/2026-03-04-progress-and-challenges-for-the-implementation-of-nhi/
- https://businessreport.co.za/personal-finance/medical-cover/2023-10-29-careconnect-hie-hub-hopes-to-be-part-of-nhi/
- https://businesstech.co.za/news/government/449795/
- https://businesstech.co.za/news/government/636899/
- https://businesstech.co.za/news/government/636899/government-targets-private-healthcare-medical-data-as-it-lays-more-groundwork-for-nhi/
- https://businesstech.co.za/news/government/857810/r74-million-nhi-showdown-in-south-africa/
- https://businesstech.co.za/news/technology/570912/government-to-keep-covid-database-going-permanently-with-plans-to-expand-it/
- https://cansa.org.za/south-african-cancer-statistics/
- https://cdn.discovery.co.za/assets/discoverycoza/health-professionals/propbm-communiques/medipos-medical-scheme-will-be-administered-by-discovery-health.pdf
- https://cioafrica.co/mediclinic-selects-hcr-for-connected-health-as-foundation-for-its-epr/
- https://citizen.co.za/berea-mail/?p=185354
- https://citizen.co.za/northcliff-melville-times/?p=229484
- https://citizen.co.za/northern-natal-news/news-headlines/local-news/2023/10/24/sanbs-is-going-digital
- https://citizen.co.za/review-online/?p=545584
- https://cquin.icap.columbia.edu/wp-content/uploads/2019/07/Courey_Final.pdf
- https://d16pi0tqkfzkv3.cloudfront.net/assets/discoverycoza/corporate/investor-relations/2025/dhms-integrated-report-2025.pdf
- https://defenceweb.co.za/tag/1-military-hospital/
- https://discovery-holdings-ltd.mynewsdesk.com/pressreleases/discovery-health-launches-healthid-a-revolution-in-electronic-health-records-in-sa-779062
- https://discovery.co.za/medical-aid/about-discovery-health
- https://docs.dhis2.org/
- https://ebooks.iospress.nl/pdf/doi/10.3233/SHTI190175
- https://ehr.meditech.com/news/meditech-expands-solutions-in-the-kwazulu-natal-province-of-south-africa
- https://en.wikipedia.org/wiki/National_Pharmaceutical_Product_Index
- https://erad.com/news/erad-expands-install-base-south-africa-netcare-pinehaven-hospital/
- https://etd.uwc.ac.za/handle/11394/7829
- https://ewn.co.za/2026/05/07/concourt-reserves-judgment-in-nhi-challenge
- https://fda.innolitics.com/device/BK230986
- https://forums.snomed.org/t/major-milestone-for-africa-south-africa-adopts-snomed-ct-to-drive-digital-health-transformation/1332
- https://getvuza.com/awards/22895
- https://healthbridge.co.za/our-story/
- https://healthtech.altron.com/
- https://healthtech.altron.com/about-us
- https://healthtech.altron.com/press-releases/collaborative-information-sharing-with-altron-healthtech-and-careconnect
- https://healthtech.altron.com/switchon
- https://ijpds.org/article/view/1143
- https://ijpds.org/article/view/1614
- https://ijpds.org/article/view/1771
- https://inforegulator.org.za/enforcement-notices/
- https://inforegulator.org.za/wp-content/uploads/2020/07/FINAL-MEDIA-STATEMENT-ENFORCEMENT-NOTICE-ISSUED-TO-DISCHEM-PHARMACIES-LTD.pdf
- https://intelms.squarespace.com
- https://iol.co.za/capeargus/news/2025-10-24-western-cape-health-system-manages-over-one-million-emergency-cases-amid-financial-constraints/
- https://ir.dut.ac.za/handle/10321/4455
- https://isibaloweb.statssa.gov.za/metadata/COD/2021/BI-1663%20form.pdf
- https://issuu.com/samhscorpcomm/docs/samhs_news_magazine_2nd_edition_2024
- https://itweb.co.za/article/electronic-system-improves-joburgs-primary-healthcare/Pero3qZgoeevQb6m
- https://itweb.co.za/article/ict-tenders-down-to-nuts-and-bolts/GxwQDM1AJ6ZMlPVo
- https://itweb.co.za/article/top-ict-tenders-health-dept-looks-to-essential-systems/4r1lyMR9DEL7pmda
- https://joburg.org.za/media_/Newsroom/Pages/2023%20News%20Articles/August/New-e-Health-programme-promises-to-transform-healthcare-in-the-City.aspx
- https://knowledgehub.health.gov.za/system/files/elibdownloads/2020-07/NMC_COVID-19-Notification-SOP_7May2020.pdf
- https://knowledgehub.health.gov.za/system/files/elibdownloads/2023-04/national-digital-strategy-for-south-africa-2019-2024-b.pdf
- https://lawlibrary.org.za/akn/za/act/gn/2022/2819/eng@2022-12-02
- https://link.springer.com/article/10.1186/1472-6963-11-243
- https://magic828.co.za/transforming-healthcare-gauteng-digitises-800000-patient-files-at-chris-hani-baragwanath-hospital/
- https://marketplace.fico.com/blogs/digital-transformation-inside-medscheme-s-decision-platform
- https://medical.sectra.com/news-press-releases/news-item/084302271ED35A65
- https://mezzaninewiki.atlassian.net/wiki/spaces/ES/pages/3968152/Stock+Visibility+Solution
- https://mpumalanga.da.org.za/2023/03/da-suspicious-of-millions-spent-to-roll-out-electronic-filling-systems-in-mpumalanga-hospitals
- https://msh.org/resources/rxsolution/
- https://netcare-reports.co.za/2024/pdf/digital-transformation-and-data.pdf
- https://netcare.co.za/NewsHub/Articles/pioneering-electronic-medical-record-system-a-game-changer-for-hospital
- https://newamericafoundation.github.io/pandemic-response-repository/projects/openhim
- https://news.uct.ac.za/article/-2014-09-22-uct-teams-hiv-monitoring-software-exported
- https://newsletter.en.creamermedia.com/article/parliamentary-defence-committee-highlights-paralysis-in-hospital-project-and-in-prosecutions-2025-05-26
- https://ohie.org/openhie-partner-organization-spotlight-jembi-health-systems/
- https://ohsc.org.za/highlights-office-of-health-standards-compliance-2023-24-annual-performance-report/
- https://open.africa/dataset/south-africa-medicine-prices
- https://open.uct.ac.za/bitstreams/9d5a7cbc-0621-42da-92be-69c29766c511/download
- https://pmc.ncbi.nlm.nih.gov/articles/PMC4005043
- https://pmc.ncbi.nlm.nih.gov/articles/PMC6859271/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7059247
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7154050
- https://pmc.ncbi.nlm.nih.gov/articles/PMC8761606
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9082220
- https://pmg.org.za/committee-meeting/35562/
- https://pmg.org.za/committee-meeting/41085/
- https://pmg.org.za/committee-question/19974/
- https://pmg.org.za/committee-question/23475/
- https://pmg.org.za/committee-question/23923/
- https://pmg.org.za/committee-question/24406/
- https://pmg.org.za/committee-question/25074/
- https://pmg.org.za/committee-question/27297/
- https://pmg.org.za/committee-question/27410/
- https://pmg.org.za/committee-question/31734/
- https://pmg.org.za/committee-question/31749/
- https://pmg.org.za/committee-question/34108/
- https://pmg.org.za/committee-question/34165/
- https://pmg.org.za/committee-question/34868/
- https://pmg.org.za/committee-question/35068/
- https://pmg.org.za/committee-question/37900/
- https://pmg.org.za/committee-question/965/
- https://prehmis.capetown.gov.za/content?page=about
- https://pressportal.co.za/stream/story/32e3f605366e8e5f-20260428.html
- https://quartr.com/events/life-healthcare-group-holdings-limited-lhc-h2-2025_F9mo6wqN
- https://resource.capetown.gov.za/documentcentre/Documents/Procedures,%20guidelines%20and%20regulations/About%20Public%20Emergency%20Communication.pdf
- https://sacj.cs.uct.ac.za/index.php/sacj/article/view/838
- https://sajim.co.za/index.php/sajim/article/view/1903/3042
- https://sajr.org.za/index.php/sajr/article/view/2578
- https://sajr.org.za/index.php/sajr/article/view/2647
- https://sanbs-integrated-report.sanbs.org.za/financial-capital-2.php
- https://sanbs-integrated-report.sanbs.org.za/manufactured-capital.php
- https://scholar.sun.ac.za/handle/10019.1/89026
- https://scholar.sun.ac.za/items/33ea19f0-b740-4173-bd79-3094ea3f7684/full
- https://scholar.sun.ac.za/items/3c9377da-5b4d-4df6-81b2-afbad010388f/full
- https://sites.bu.edu/ambit/files/2019/09/AMBIT-SA-data-inventory-2019-02-05.pdf
- https://solve.mit.edu/solutions/87621
- https://spotlightnsp.co.za/2023/05/24/new-report-paints-grim-but-incomplete-picture-of-cancer-in-sa/
- https://static.pmg.org.za/CMS_2025-26_AR.pdf
- https://static.pmg.org.za/DCS_Annual_Report_2025-2026.pdf
- https://static.pmg.org.za/RCW937-2026-09-23.pdf
- https://techcentral.co.za/information-regulator-dis-chem-breach/230895
- https://techcentral.co.za/medscheme-to-roll-out-electronic-records/192973
- https://techcentral.co.za/western-cape-blood-service-hit-by-cyberattack/109690
- https://theconversation.com/hardly-any-south-africans-are-organ-donors-what-can-be-done-to-change-this-166298
- https://themercury.co.za/news/2022-05-12-kzn-health-department-goes-digital-with-e-health-system
- https://thepost.co.za/
- https://thepost.co.za/news/south-africa/2025-03-31-1-military-hospital-a-decade-of-failed-renovations-and-corruption-claims/
- https://thepost.co.za/news/south-africa/kwazulu-natal/2025-06-11-challenges-in-implementing-the-health-patient-registration-system-in-kwazulu-natal
- https://wcbs.org.za/about/annual-reports/
- https://wcbs.org.za/about/our-history/
- https://westerncape.gov.za/gc-news/
- https://westerncape.gov.za/health-wellness/article/western-cape-emergency-centres-and-ems-festive-season-activity-report-highlights-high
- https://wiki.ohie.org/x/SwDeAQ
- https://wiki.ohie.org/x/aQDeAQ
- https://wiredspace.wits.ac.za/items/80d1d7ca-1915-468e-9a73-62bf68bba879
- https://wpwcbs.azurewebsites.net/wp-content/uploads/2025/05/Nurses-Guide-to-Ordering-interactive-FA_2105.pdf
- https://www.ahri.org/ahri-donates-it-equipment-to-support-kzn-data-warehouse-project/
- https://www.auntminnie.com/imaging-informatics/enterprise-imaging/pacs-vna/article/15595234/paxeramed-installs-s-africa-telerad-network
- https://www.businessday.co.za/companies/2025-11-27-life-healthcare-says-technology-wont-replace-nurses-at-the-bedside
- https://www.businessday.co.za/companies/company-strategy/2026-03-24-improving-sa-macroeconomic-conditions-boost-netcares-operations/
- https://www.businessday.co.za/news/health/2026-05-03-constitutional-court-hears-challenges-to-parliaments-handling-of-nhi-bill/
- https://www.businessday.co.za/news/health/2026-07-22-pepfar-cuts-leave-30880-fewer-sa-children-on-hiv-treatment/
- https://www.casestudies.com/company/fico/case-study/medscheme-overhauls-its-claims-system-to-deliver-better-strategies
- https://www.citizen.co.za/alberton-record/news-headlines/2022/11/04/hospital-goes-live-with-a-single-integrated-health-information-system/
- https://www.citizen.co.za/news/health-department-and-parliament-push-back-on-nhi-speculation-after-concourt-ruling/
- https://www.citizen.co.za/news/south-africa/gauteng-hospitals-get-major-tech-overhaul-to-slash-scan-backlogs
- https://www.citizen.co.za/news/staff-shortage-leaves-122-ambulances-unused
- https://www.citizen.co.za/randburg-sun/news-headlines/2018/08/29/joburg-ehealth-system-reaches-half-a-million-patients/
- https://www.da.org.za/2023/06/only-48-functional-ambulances-for-nearly-5-million-people-in-mpumalanga
- https://www.dailydispatch.co.za/news/opinion/2025-08-04-spiral-into-decay-and-disaster-continues-in-the-ec-health-department/
- https://www.dailymaverick.co.za/article/2022-07-15-contrasting-views-and-scepticism-overshadow-gautengs-new-health-information-system/
- https://www.dailymaverick.co.za/article/2025-02-27-the-axe-has-fallen-usaid-issues-funding-termination-notices-to-key-health-programmes-across-sa/
- https://www.dailymaverick.co.za/article/2025-03-22-cyber-hack-attack-how-one-click-on-an-email-link-paralysed-sas-national-health-laboratory-service
- https://www.dailymaverick.co.za/article/2025-03-23-national-health-laboratory-cyberatack-regulator-demands-details.md
- https://www.dailymaverick.co.za/article/2025-04-14-us-funding-cuts-could-cause-over-150000-additional-hiv-infections-in-sa-by-2028-study.md
- https://www.dailymaverick.co.za/article/2025-12-17-gauteng-health-mec-nomantu-nkomoralehoko-a-legacy-of-transformation-and-triumph
- https://www.dailymaverick.co.za/article/national-health-laboratory-service-system-out-of-action-causing-massive-disruptions-to-health-facilities-
- https://www.dailymaverick.co.za/article/regulator-probe-public-uproar-spare-16506507-discovery-health-members-from-r125m
- https://www.dha.gov.za/
- https://www.dhis2.health.gov.za**
- https://www.discovery.co.za:443/assets/discoverycoza/health-professionals/propbm-communiques/nappi-code-registration-and-review-process-2023.pdf
- https://www.dispatchlive.co.za/news/2020-06-09-hackers-strike-at-life-healthcare-extent-of-data-breach-yet-to-be-assessed/
- https://www.drkfoundation.org/?p=18660
- https://www.edrweb.net
- https://www.engineeringnews.co.za/article/govt-launches-electronic-vaccine-data-system-ahead-of-vaccine-roll-out-2021-02-03
- https://www.engineeringnews.co.za/article/parliamentary-committee-concerned-about-ongoing-expenditure-for-1-military-hospital-project-2021-09-03
- https://www.engineeringnews.co.za/article/south-african-health-sector-launches-information-exchange-2022-04-08
- https://www.esgtoday.com/project-last-mile-plm-awarded-gold-for-excellence-in-helping-bring-chronic-medicines-within-reach-for-millions-of-south-africans/
- https://www.ewn.co.za/2026/01/22/wc-govt-says-emergency-health-services-were-under-extreme-pressure-over-festive-season
- https://www.ewn.co.za/2026/05/07/concourt-reserves-judgment-in-nhi-challenge
- https://www.fhi360.org/wp-content/uploads/2024/02/resource-dhis2-tracker-metadata-package-brief.pdf
- https://www.frontiersin.org/article/10.3389/fpubh.2020.00100/full
- https://www.gauteng.gov.za/News/NewsDetails/%7B931b2341-7b35-4684-8527-340ff8b5df26%7D
- https://www.ghsupplychain.org/stock-visibility-system-technical-brief
- https://www.goodthingsguy.com/lifestyle/1011-units-blood-donated
- https://www.gov.za/documents
- https://www.gov.za/news/media-advisories/gauteng-health-embarked-digitisation-patient-files-17-may-2024
- https://www.gov.za/news/media-advisories/government-activities/health-leads-first-digital-health-interoperability
- https://www.gov.za/news/media-statements/home-affairs-upgrades-critical-digital-verification-system-24-mar-2025
- https://www.gov.za/sites/default/files/gcis_document/202510/dcs-ar-2024-25.pdf
- https://www.health.gov.za/
- https://www.health.gov.za/?p=21258
- https://www.health.gov.za/ccmdd
- https://www.health.gov.za/wp-content/uploads/2025/07/Web-Version-The-Emerging-South-African-Digital-Health-System.pdf
- https://www.health.gov.za/wp-content/uploads/2026/03/
- https://www.health.gov.za/wp-content/uploads/2026/03/NDoH04-20252026-Final-BSC-Invitation-to-Bid-EMR-implementation-03-03-2026.pdf
- https://www.health.gov.za/wp-content/uploads/2026/08/NDOH-09-2026-26-Additional-Information.pdf
- https://www.hst.org.za
- https://www.icolo.io/news/teleradiology-cloud-solution-from-anywhere-in-africa/
- https://www.inforegulator.org.za/
- https://www.insight.co.za/wp-content/uploads/2017/01/Andrew-Boulle-WC-Health-Data-Centre.pdf
- https://www.intelligentcio.com/africa/2018/12/17/lancet-laboratories-chooses-netlims-labos-product-to-replace-its-lis/
- https://www.intelligentcio.com/africa/2020/02/11/africas-first-private-healthcare-information-exchange-set-to-drive-health-revolution
- https://www.itnewsafrica.com/africa-by-region/southern-africa-africa-by-region/e-health-framework-in-development-for-south-africa/
- https://www.itnonline.com/content/south-african-healthcare-group-selects-agfa-ris-pacs
- https://www.itu.int/net4/wsis/stocktaking/Prizes/2026/Details/17720121703313989
- https://www.itweb.co.za/article/blood-donation-and-big-data-untapped-tech-opportunity-to-save-lives/VgZeyqJl31b7djX9
- https://www.itweb.co.za/article/budget-2026-sa-connect-phase-two-comes-to-an-end/Pero3MZ3zXXqQb6m
- https://www.itweb.co.za/article/first-medical-data-sharing-hub-goes-live-in-sa/GxwQDq1Z8gPvlPVo
- https://www.itweb.co.za/article/gijima-scores-r339m-health-tender/KBpdgvpzJOJMLEew
- https://www.itweb.co.za/article/healthcare-goes-hi-tech/VgZey7JAQ8ZvdjX9
- https://www.itweb.co.za/article/hst-implements-cache-based-health-information-system/KA3Ww7dlBey7rydZ
- https://www.itweb.co.za/article/inforeg-exposes-popia-violators-as-data-breaches-mount/kLgB17ezby5M59N4
- https://www.itweb.co.za/article/life-healthcare-reveals-damage-caused-by-data-breach/rW1xLv59YPGvRk6m
- https://www.itweb.co.za/article/r250m-deal-to-speed-up-emergency-services/p6GxRKMYwwwvb3Wj
- https://www.itweb.co.za/article/sa-national-blood-service-to-digitise-30m-records-annually-with-datacentrix/lP3gQ2qGE517nRD1
- https://www.itweb.co.za/article/top-ict-tenders-health-dept-eyes-electronic-medical-record-solution/4r1lyMR9Y997pmda
- https://www.journals.ac.za/ajn/article/view/6749
- https://www.journals.ac.za/ajn/article/view/7789
- https://www.justice.gov.za/legislation
- https://www.knowledgehub.org.za/
- https://www.lenmed.co.za/lenmed-works-to-mitigate-infection-risk-in-its-hospitals-with-bluebird/
- https://www.lifehealthcare.co.za/news-and-info-hub/health-information-exchange-hie-has-been-terminated/
- https://www.measureevaluation.org/sifsa/data-quality
- https://www.medavis.com/northern-radiologists-polokwane-za/
- https://www.medicalbrief.co.za/?p=166532
- https://www.medicalbrief.co.za/?p=171562
- https://www.medicalbrief.co.za/?p=191793
- https://www.medicalbrief.co.za/?p=192181
- https://www.medicalbrief.co.za/?p=202540
- https://www.medicalschemes.co.za/
- https://www.michalsons.com/blog/regulator-refers-the-department-of-health-to-enforcement-committee/64137
- https://www.moonstone.co.za/medical-schemes-face-structural-strain-as-claims-growth-outpaces-contributions/
- https://www.mynewsdesk.com/za/discovery-holdings-ltd/pressreleases/discovery-health-launches-healthid-a-revolution-in-electronic-health-records-in-sa-779062
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9931258/
- https://www.netcare.co.za/portals/0/Investor%20Relations/Financial%20Results/2023%20-%20Annual%20Results/Netcare-Presentation.pdf
- https://www.nicd.ac.za/
- https://www.nutanix.com/en_gb/company/customers/healthbridge
- https://www.ofm.co.za/article/centralsa/329341/e-health-strategy-to-save-lives-in-the-free-state-video
- https://www.parliament.gov.za/press-releases/media-statement-select-committee-social-services-addresses-urgent-health-system-challenges
- https://www.phisc.net/about-us
- https://www.reachdigitalhealth.org/resources/digital-health-in-south-africa-innovating-to-improve-health
- https://www.roic.ai/quote/NWKHY
- https://www.sabcnews.com/sabcnews/health-department-csir-to-develop-digital-platforms-to-run-nhi/
- https://www.sanbs.org.za/uploads/media/about/annual%20reports/SANBS-2024-summarise-report.pdf
- https://www.sanbs.org.za/uploads/media/medical/training_and_advisory/2023-Haemovigilance-Report.pdf
- https://www.sanews.gov.za/index.ph%70/node/69420
- https://www.sanews.gov.za/node/74470
- https://www.sanews.gov.za/node/81065
- https://www.sanews.gov.za/south-africa/long-waiting-list-receive-organs-sa
- https://www.scielo.org.za/pdf/samj/v114n12/06.pdf
- https://www.snomed.org/members
- https://www.spotlightnsp.co.za/2022/07/13/differing-views-on-gautengs-new-health-information-system/
- https://www.spotlightnsp.co.za/2025/09/29/sa-has-very-low-organ-donation-rates-how-can-we-fix-it/
- https://www.statssa.gov.za/
- https://www.telecomtv.com/content/digital-platforms-services/free-state-department-of-health-partners-with-vodacom-for-digital-health-solutions-49032/
- https://www.tenderflow.co.za/tenders/appointment-of-service-providers-to-support-the-national-dep-4e2d2bdc27a54f2fa8183619e31b5a3e/
- https://www.tenders-sa.org/sa-tenders/awarded/wcghcc0020-2024-rendering-of-a-teleradiology-service-at-paarl-hospital-under-the-control-of-the-depa-cmlnt41eq0jcil204ed1q6n7e
- https://www.theglobalfund.org/media/x1dh0ls4/publication_south-africa-digital-health_casestudy_en.pdf
- https://www.theherald.co.za/weekend-post/your-weekend/2021-10-16-province-launches-paperless-patient-management-system/
- https://www.tier.net/
- https://www.timeslive.co.za/news/south-africa/2013-04-22-western-cape-ambulance-response-times-to-get-r250-million-boost-report/
- https://www.timeslive.co.za/news/south-africa/2025-10-08-hospitals-borrow-medical-equipment-to-impress-inspectors-watchdog-warns/
- https://www.up.ac.za/centre-for-maternal-fetal-newborn-and-child-healthcare/article/2868032/child-pip-data-collection
- https://www.wcbs.org.za/wp-content/uploads/2025/09/WCBS-Annual-Report-2024-2025-final.pdf
- https://www.wcbs.org.za/wp-content/uploads/2025/10/The-South-African-Haemovigilance-Report-2024.pdf
- https://www.westerncape.gov.za/provincial-treasury/files/atoms/files/Health%20Advertisement%2010%20September%202021.pdf
- https://www.wikipedia.org/wiki/SAMHS
- https://www2.ampath.co.za/medical-practitioners/lab-results-for-doctors
- https://za.linkedin.com/in/kubashen-bash-govender