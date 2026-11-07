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
