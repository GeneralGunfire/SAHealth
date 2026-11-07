# Round 6 supplementary research: answers to the eleven named gap questions

*Compiled 2026-11-01. Each section below is the 'Round 6 gap findings' section from one research pass, unedited, plus the follow-up pass. For the full record see research_master.md.*

## Where each gap is answered

| # | Gap | Where |
|---|---|---|
| 1 | Provincial EMR systems outside the Western Cape (Gauteng, KZN, others) | Part B |
| 2 | HPRS active use per province | Parts A and H |
| 3 | FHIR pilots or production deployments | Parts C and F |
| 4 | NHI information systems build status | Part C |
| 5 | SANBS electronic blood ordering | Parts E1 and H (not found) |
| 6 | CCMDD scale and IT system | Part C |
| 7 | OpenHIM deployments outside the Western Cape | Part C |
| 8 | Meditech, Impilo and other public hospital HIS products | Part B |
| 9 | HL7 v2 interfaces between NHLS and public hospitals | Part C |
| 10 | SA Connect Phase 2 health facilities connected | Parts B and H |
| 11 | Provincial data warehouses outside the Western Cape | Parts B and H |


---

# From Part A: Patient identity and registries

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


---

# From Part B: Public-sector clinical systems and the nine provinces

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


---

# From Part C: Programme data, laboratory, standards and the NHI information systems

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


---

# From Part D: Private sector, medical schemes, claims and pharmacy

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


---

# From Part E: Emergency, blood, imaging, other state, NGO (first pass)

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


---

# From Part E2: Other state services, NGO/donor systems and community health (second pass)

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


---

# From Part F: Patient journeys, data formats, law and statistics

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


---

# From Part H: Follow-up pass: primary-source verification of open gaps

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
