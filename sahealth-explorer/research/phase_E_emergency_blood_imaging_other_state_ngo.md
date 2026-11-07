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
