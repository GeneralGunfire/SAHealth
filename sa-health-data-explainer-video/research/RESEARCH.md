# How patient data moves in South African healthcare today: research brief

Research compiled 27 September 2026 as the factual basis for the explainer video. Every figure used in the script is listed here with its source. Where the original brief contained a claim that could not be verified, or that turned out to be wrong, this is marked **CORRECTION** or **UNVERIFIED**.

---

## 1. The two-sector landscape

| Fact | Figure | Source |
|---|---|---|
| Medical scheme beneficiaries (2024) | **9.17 million** across **71 schemes** (16 open, 55 restricted), 33 administrators | Council for Medical Schemes Annual Report 2024/25 |
| Population | ~62 million (Census 2022) | Stats SA Census 2022 |
| Share relying mainly on public sector | ~85% (≈ 5 in 6) | derived from the two figures above |

## 2. Public primary care (clinics)

**Patient registration: HPRS.** The Health Patient Registration System is an online national registry, approved as the NHI registration system. It identifies patients by SA ID number (or passport and other documents) and issues a Health Patient Registration Number (HPRN). It was started in June 2015. The NDoH's 2025 publication *The Emerging South African Digital Health System* reports **more than 68 million patients registered**, of whom **~32.5 million** have names and ID numbers **verified by the Department of Home Affairs**. HPRS holds demographics, not clinical notes. Some clinics now file paper folders by HPRN.

**The clinical record is mostly still paper.** In most public clinics the paper folder is the clinical record. Patient-held paper records are used by design: the **Road to Health Booklet** (since 2011) for children, and the **Maternity Case Record**, which must travel with the woman when she is transferred.

**National EMR.** According to a parliamentary reply dated **1 August 2025** (PMG NW4495), the National EMR "went formally live on 28 March 2025" in a beta phase at **36 PHC facilities and 1 GP practice** (FS 9, KZN 8, NC 6, MP 6, NW 8). *(This was missing from the original brief.)*

**Western Cape:** PHCIS runs in 308 PHC facilities, and City of Cape Town clinics use PREHMIS.

**DHIS2 (aggregate reporting).** Clinicians record in the folder and tick a register at each service point. Registers are totalled monthly onto a data input form and captured into DHIS2, known locally as webDHIS, against the National Indicator Data Set (NIDS). DHIS2 holds **aggregate counts, not patient-level records**. (The PostgreSQL backend is correct, since DHIS2 runs on PostgreSQL, but it has no bearing on the story.)

**TIER.Net (HIV/TB).** TIER.Net is the Three Interlinked Electronic Register, the national ART register. It has three tiers: **paper** for fewer than 500 patients, a **standalone offline electronic register** for 500 to 2,000, and a **networked EMR** for more than 2,000. Data capturers enter data from paper folders, including CCMDD referrals and viral load and CD4 results. Data aggregate to district, provincial and national level. Studies document misreporting of patient outcomes (PMC7154050) and data-quality problems for referrals and lab results (medRxiv 2025.11.11.25340044).

**ETR.Net** is the older electronic TB register. It is still referenced in the brief, but the Western Cape PHDC uses EDRWeb for drug-resistant TB, and TB is increasingly integrated into TIER.Net. The video does not name ETR.Net.

**Medicines.** CCMDD (Central Chronic Medicine Dispensing and Distribution) lets stable patients collect chronic medication at external pick-up points: private pharmacies, GPs, adherence clubs and other sites. The **Stock Visibility System (SVS)**, running since 2013, is a mobile and web tool that tracks medicine *stock* at clinics, not patients. **RxSolution** is used for stock control in some facilities.

## 3. Public laboratory: NHLS

- NHLS is the diagnostic pathology service for the public sector, with a network of ~265 laboratories. It performed **~110.6 million tests** in 2022/23 (NHLS Annual Report 2023/24).
- The LIS is **TrakCare Lab (LabTrak)** from InterSystems.
- Results reach clinics via **TrakCare WebView** (web, all test types) and **SMS printers** (a limited set of HIV/TB results). Many clinics use both (PMC10280246).
- A nurse writes results into the folder, and data capturers transcribe them into TIER.Net.

## 4. Public hospitals, by province

Source: parliamentary reply, 1 August 2025.

| Province | Hospital system |
|---|---|
| Western Cape | **Clinicom** in 53 hospitals, in use since 1998. The recently started Electronic Continuity of Care Record (ECCR) |
| Eastern Cape | **HMS2** (in-house EHMS) in 44 hospitals |
| Free State | **Meditech** in 3 hospitals, **HMS2** in 16 (since March 2023) |
| KwaZulu-Natal | **eHealth** system in 42 hospitals (since March 2020). Meditech is also used at some hospitals, e.g. Grey's since 1999 and Inkosi Albert Luthuli since 2016 |
| Gauteng | SAP-based **Health Information System**, which replaced the legacy **Medicom** and PAAB systems. It covers 37 hospitals and 31 CHCs. Bara digitised more than 800,000 paper files |
| Mpumalanga, North West, Limpopo, Northern Cape | "not currently implementing Patient Information or EMR Systems at hospitals" |

**CORRECTION:** The brief described Medicom as a current public hospital system. In Gauteng it is **legacy** and has been replaced by the SAP-based HIS. Meditech is real, but only in parts of KZN and FS. HMS2 (EC and FS) was missing from the brief.

HMS2 has onboarded ~5.5 million patient demographic records across EC and FS and uses the HPRS Patient Reference Number inside hospitals (NDoH 2025).

**Western Cape Provincial Health Data Centre (PHDC)** is the one genuine integration layer in the public sector. It links data using the Clinicom 9-digit folder number as the patient master index, printed on barcode labels. Sources include NHLS, pharmacy, TIER.Net, PHCIS, PREHMIS, EDRWeb and others, processed usually daily. It covers **~8 million unique individuals**. Clinicians access it via the web-based **Single Patient Viewer**, which ~100 clinicians were piloting at the time of the 2019/2020 profile paper. Its scope is **Western Cape only**.

## 5. Emergency medical services and blood

- **EMS:** Care is documented on a Patient Report Form (PRF). Handover is standardised, with EMSSA recommending **DeMIST**. Electronic PRFs exist (vendors such as Ithaca), but paper PRFs remain common. The 2022 EMS Regulations require a standardised handover. The video uses the hedge "in many services, still paper".
- **Blood:** **SANBS** supplies all provinces **except the Western Cape**, which is served by the **Western Cape Blood Service**. SANBS launched **eProgresa** as its new Blood Establishment Computer System.

## 6. Radiology and PACS

PACS started in the private sector. Public-sector PACS "significantly lags" because of funding (Charlotte Maxeke clinicians' study, PMC10244939). Each radiology practice or hospital has its own archive.

## 7. Private primary care, claims, labs and pharmacy

- **GP and specialist practice software** includes GoodX (3,000+ practices, billing, scheduling and clinical notes), Healthbridge, Elixir and CGM. It is billing-centric, and notes live on the practice's own system.
- **Claims switching:** Switches include Healthbridge, MediKredit (HealthNet ST, ~9,000 providers, real-time) and Digital Healthcare Solutions (MediSwitch). The message standard is **PHISC MEDCLM (EDIFACT)**, which carries tariff codes and **ICD-10** diagnosis codes. Claims go to the scheme administrator.
- **Private labs** are Ampath, Lancet and PathCare, each with its own doctor portal or app (e.g. PathCare PathProvider 3).
- **Pharmacy dispensing** uses systems such as **ProPharm** (Computassist Group), which claim in real time via a switch.
- **Discovery HealthID** is a claims-derived EHR with pathology results. Written patient consent is required **per doctor** and can be withdrawn.

## 8. Private hospitals

- **Netcare CareOn** is an electronic medical record, completed in April 2024. It covers 45 acute hospitals with 9,566 beds digitised, **13,210+ iPads**, **30,968 active users** and 14,530+ connected devices (Netcare Integrated Report 2024).
- **Mediclinic Southern Africa / Life Healthcare:** **UNVERIFIED**. The brief's "Mediclinic HCR" could not be confirmed from public sources. Mediclinic *Middle East* uses InterSystems TrakCare, and Mediclinic Parkview (Dubai) is a TrakCare site. The video therefore says only that these groups "run their own systems" and does not name vendors.
- Specialists are largely independent practices with their own software.

## 9. Law and standards

- **POPIA s32:** Health professionals and institutions may process health information where necessary for treatment and care, under a duty of confidentiality.
- **HPCSA Booklet 9:** Copies of records are released only with proper authorisation.
- **HNSF:** The National Health Normative Standards Framework for Interoperability in eHealth was published in **2014** and updated in 2021. It recommends HL7 for messaging, among other standards.
- **NHI Act 20 of 2023:** Signed **15 May 2024**. The effective date has not been proclaimed.

## 10. How a doctor actually gets a patient's history today (synthesis)

1. They ask the patient.
2. They read what the patient carries: a referral letter, clinic card, maternity case record or Road to Health booklet.
3. They look up results on a lab portal (TrakCare WebView for NHLS, or a private lab's portal), provided they ordered the test or have access.
4. They open the facility's or group's own system if the patient was seen inside the same hospital group or province, e.g. CareOn within Netcare, Clinicom or the SPV within the Western Cape.
5. They use a scheme's claims-derived view (HealthID) if the patient is a member of that scheme and consents for that doctor.
6. Otherwise they phone, fax or email another facility and send a signed request for copies.

## Sources

- CMS Annual Report 2024/25: https://www.medicalschemes.co.za/cms-annual-report-2024-25/
- NDoH, *The Emerging South African Digital Health System* (2025): https://www.health.gov.za/wp-content/uploads/2025/07/Web-Version-The-Emerging-South-African-Digital-Health-System.pdf
- PMG NW4495, reply 1 Aug 2025: https://pmg.org.za/committee-question/31734/
- TIER.Net data quality: https://pubmed.ncbi.nlm.nih.gov/41838700/ · misreporting: https://pmc.ncbi.nlm.nih.gov/articles/PMC7154050/ · three-tier framework: https://pmc.ncbi.nlm.nih.gov/articles/PMC4005043/
- WC PHDC profile: https://pmc.ncbi.nlm.nih.gov/articles/PMC7482518/ · SPV: https://ijpds.org/article/view/1614
- NHLS SMS printers vs WebView: https://pmc.ncbi.nlm.nih.gov/articles/PMC10280246/ · NHLS Annual Report 2023/24: https://www.nhls.ac.za/wp-content/uploads/2025/03/NHLS_Annual_Report_2023-2024.pdf
- Netcare 2024 digital transformation: https://netcare-reports.co.za/2024/pdf/digital-transformation-and-data.pdf
- MEDITECH in KZN: https://ehr.meditech.com/news/meditech-expands-solutions-in-the-kwazulu-natal-province-of-south-africa
- Gauteng HIS: https://www.medicalbrief.co.za/new-centralised-info-system-for-gauteng-health/ · https://www.sabcnews.com/sabcnews/gauteng-based-public-hospitals-patients-records-going-digital/
- MediKredit switching: https://www.medikredit.co.za/products-and-services/healthcare-claims-switching/ · PHISC: https://www.phisc.net/about-us
- Discovery HealthID: https://www.discovery.co.za/medical-aid/health-id · https://scielo.org.za/scielo.php?script=sci_arttext&pid=S0256-95742012000700007
- SANBS: https://en.wikipedia.org/wiki/South_African_National_Blood_Service · https://sanbs-integrated-report.sanbs.org.za/
- PACS in public sector: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10244939/
- EMS PRF / handover: https://pmc.ncbi.nlm.nih.gov/articles/PMC9634030/ · https://badem.co.za/the-art-of-the-ems-handover-2/
- SVS / RxSolution / CCMDD: https://pmc.ncbi.nlm.nih.gov/articles/PMC9945761/ · https://www.sanews.gov.za/south-africa/health-department-keeping-better-track-medicine-stock
- Maternity Case Record: https://knowledgehub.health.gov.za/system/files/2024-02/The%20Maternity%20Case%20Record%20for%20Webinar.pdf · RTHB: https://pmc.ncbi.nlm.nih.gov/articles/PMC11736536
- DHIS2 in SA: https://sajim.co.za/index.php/sajim/article/view/1903/3042
- POPIA s32: https://popia.co.za/section-32-authorisation-concerning-data-subjects-health-or-sex-life/ · HPCSA Booklet 9: https://www.sada.co.za/sites/default/files/content-files/HPCSA/HPCSA%20Ethical%20Guidelines/Booklet_9_Keeping_of_Patient_Records_Review%20Draft_vSept_2022.pdf
- NHI Act: https://bowmanslaw.com/insights/south-africa-the-national-health-insurance-act-your-top-10-questions-answered/
- GoodX: https://goodx.co.za/ · ProPharm: https://www.computassistgroup.com/propharm · PathCare portal: https://www.pathcare.co.za/drs-portal/register-download-app/
