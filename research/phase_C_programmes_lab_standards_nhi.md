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
