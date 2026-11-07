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
