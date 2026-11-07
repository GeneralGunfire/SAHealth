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
