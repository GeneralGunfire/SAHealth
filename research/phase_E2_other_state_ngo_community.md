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

