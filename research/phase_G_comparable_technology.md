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
