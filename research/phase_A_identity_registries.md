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
