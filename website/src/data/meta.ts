import type { IconName, LayerId, LinkType, SectorId, ProvinceInfo, Source } from '../types'

export const LAYERS: { id: LayerId; name: string }[] = [
  { id: 'standards', name: 'Standards & codes' },
  { id: 'integration', name: 'Integration' },
  { id: 'money', name: 'Claims & money' },
  { id: 'lab', name: 'Lab & imaging' },
  { id: 'pharmacy', name: 'Pharmacy & medicines' },
  { id: 'emergency', name: 'Emergency & blood' },
  { id: 'programme', name: 'Programme data' },
  { id: 'hospital', name: 'Hospital systems' },
  { id: 'phc', name: 'Clinics & practices' },
  { id: 'registry', name: 'Registries' },
  { id: 'identity', name: 'Patient identity' },
]
export const LAYER_NAME = Object.fromEntries(LAYERS.map((l) => [l.id, l.name])) as Record<LayerId, string>

export const SECTORS: { id: SectorId; name: string; sub: string; color: string }[] = [
  { id: 'public', name: 'Public', sub: 'provincial health', color: '#0D9488' },
  { id: 'other', name: 'Other state', sub: 'municipal · military · prisons', color: '#8B5CF6' },
  { id: 'shared', name: 'National / shared', sub: 'run for everyone', color: '#2F5BFF' },
  { id: 'private', name: 'Private', sub: 'practices · hospitals · insurers', color: '#EA580C' },
  { id: 'ngo', name: 'NGO & donor', sub: 'programme partners', color: '#65A30D' },
]
export const SECTOR = Object.fromEntries(SECTORS.map((s) => [s.id, s])) as Record<SectorId, (typeof SECTORS)[number]>

export const ICON_LABEL: Record<IconName, string> = {
  db: 'Electronic record system', person: 'Patient identity', registry: 'Official register', paper: 'Paper record',
  flask: 'Laboratory', pill: 'Medicines', cross: 'Emergency care', drop: 'Blood service', receipt: 'Claims & payment',
  hub: 'Exchange / integration', braces: 'Standard or code set', image: 'Imaging', chart: 'Reporting totals',
}
export const LINK_COLOR: Record<LinkType, string> = { live: '#2F5BFF', batch: '#7C9BFF', manual: '#C08A1E' }
export const LINK_LABEL: Record<LinkType, string> = { live: 'Live link', batch: 'Regular batch', manual: 'Retyped or carried by hand' }

export const PROVINCES = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape']
export const PGRID = [['North West', 'Gauteng', 'Limpopo'], ['Northern Cape', 'Free State', 'Mpumalanga'], ['Western Cape', 'Eastern Cape', 'KwaZulu-Natal']]

// Hospital counts: parliamentary reply NW2014 (28 May 2026). Beta clinic counts: reply NW4495 (1 Aug 2025).
// HPRS and other details: Select Committee on Social Services briefings (June 2025), press, and the research notes.
export const PROV_DATA: Record<string, ProvinceInfo> = {
  'Western Cape': { hosp: 'Clinicom · 53 hospitals (since 1998)', phc: 'PHCIS · 308 facilities. City clinics use PREHMIS', beta: 0, dc: 'Provincial data centre, about 8 million people',
    none: false, hprs: 'All primary care facilities on broadband but one; offline capture supported; possible duplicates are checked with the patient', other: 'Excluded from the national EMR roll-out because it runs its own systems', src: ['pmg2', 'phdc', 'hprsprov'] },
  'Eastern Cape': { hosp: 'HMS2 · 43 hospitals (May 2026); built in-house, launched 2021', phc: 'Mostly paper', beta: 0, dc: null,
    none: false, hprs: '764 clinical facilities (excluding hospitals); generators do not cover whole clinics, so data is sometimes captured by hand; R29 million to move connectivity to wards', other: 'HMS2 pulls NHLS lab results (about 27 million integrated)', src: ['pmg2', 'hprsprov', 'hms2herald', 'ndoh25'] },
  'Free State': { hosp: 'HMS2 · 19 hospitals; Meditech · 2 (May 2026, being retired)', phc: 'Paper, plus the National EMR beta', beta: 9, dc: null,
    none: false, hprs: '253 clinics and hospitals using it (May 2025); has sent daily patient-index updates to the national system since June 2020; offline work creates duplicates', src: ['pmg2', 'hprsprov', 'pmg'] },
  'KwaZulu-Natal': { hosp: 'eHealth · 42 hospitals (since March 2020); Meditech at Addington, Grey’s, King Dinizulu and Inkosi Albert Luthuli', phc: 'Paper, plus the National EMR beta', beta: 8,
    dc: 'Provincial data-centre pilot: 25 clinics (2022)', none: false, hprs: '488 facilities working, 119 not; no hospital on it yet and 10 chosen for a pilot; it does not yet integrate with provincial systems', src: ['pmg2', 'kznhprs', 'kzndw', 'meditech'] },
  Gauteng: { hosp: 'SAP-labelled Health Information System · 37 hospitals and 31 community health centres (Gijima, R339m via SITA)', phc: 'Mostly paper', beta: 0, dc: null,
    none: false, hprs: 'Rolled out from 2017 with “mixed” results; no figures given', other: 'Charlotte Maxeke Hospital launched PACS (imaging archive) in 2016; Gauteng worked with NHLS on a national diabetes dashboard (2026)', src: ['pmg2', 'gijima', 'hprsprov'] },
  Mpumalanga: { hosp: null, phc: 'Paper, plus the National EMR beta', beta: 6, dc: null, none: true, hprs: 'No figures found',
    other: 'Scan-and-archive project at five hospitals (R224 million spent by March 2023, per a party report). Scanning makes image archives, not structured data', src: ['pmg', 'mpda'] },
  'North West': { hosp: null, phc: 'Paper, plus the National EMR beta', beta: 8, dc: null, none: true,
    hprs: '101 of 319 facilities actively using it; only 16% of data synchronising (June 2025), blamed on old versions and connectivity', other: 'Manual record keeping at hospitals', src: ['pmg', 'hprsprov'] },
  Limpopo: { hosp: 'No hospital EMR reported (2025). A legacy patient-administration system, PHIS (since 1997), is reported at about 41 hospitals', phc: 'Mostly paper', beta: 0, dc: null, none: true, hprs: 'No figures; slow training acknowledged (June 2025)',
    other: 'Records-digitisation (scanning) contract with Veritas Digital, well over R100 million by July 2022', src: ['pmg', 'hprsprov', 'limpopo', 'phis'] },
  'Northern Cape': { hosp: null, phc: 'Paper, plus the National EMR beta', beta: 6, dc: null, none: true, hprs: 'No figures found', other: 'Manual record keeping at hospitals', src: ['pmg'] },
}

export const SOURCES: Source[] = [
  { id: 'cms', title: 'Council for Medical Schemes, Annual Report 2024/25', url: 'https://www.medicalschemes.co.za/cms-annual-report-2024-25/' },
  { id: 'ndoh25', title: 'NDoH, The Emerging South African Digital Health System (2025)', url: 'https://www.health.gov.za/wp-content/uploads/2025/07/Web-Version-The-Emerging-South-African-Digital-Health-System.pdf' },
  { id: 'pmg', title: 'Parliamentary reply NW4495, 1 August 2025', url: 'https://pmg.org.za/committee-question/31734/' },
  { id: 'tiernet', title: 'TIER.Net data quality (PubMed 41838700)', url: 'https://pubmed.ncbi.nlm.nih.gov/41838700/' },
  { id: 'tiermis', title: 'Misreporting in the national HIV treatment database (PMC7154050)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7154050/' },
  { id: 'tier3', title: 'Three-tier ART monitoring framework (PMC4005043)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4005043/' },
  { id: 'phdc', title: 'Data Centre Profile: Western Cape Provincial Health Data Centre (PMC7482518)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7482518/' },
  { id: 'spv', title: 'Single Patient Viewer (IJPDS)', url: 'https://ijpds.org/article/view/1614' },
  { id: 'nhlswv', title: 'SMS printers vs TrakCare WebView (PMC10280246)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10280246/' },
  { id: 'nhlsar', title: 'NHLS Annual Report 2023/24', url: 'https://www.nhls.ac.za/wp-content/uploads/2025/03/NHLS_Annual_Report_2023-2024.pdf' },
  { id: 'netcare', title: 'Netcare 2024: digital transformation and data', url: 'https://netcare-reports.co.za/2024/pdf/digital-transformation-and-data.pdf' },
  { id: 'meditech', title: 'MEDITECH expands in KwaZulu-Natal', url: 'https://ehr.meditech.com/news/meditech-expands-solutions-in-the-kwazulu-natal-province-of-south-africa' },
  { id: 'gp1', title: 'New centralised info system for Gauteng health (MedicalBrief)', url: 'https://www.medicalbrief.co.za/new-centralised-info-system-for-gauteng-health/' },
  { id: 'gp2', title: 'Gauteng public hospital records going digital (SABC News)', url: 'https://www.sabcnews.com/sabcnews/gauteng-based-public-hospitals-patients-records-going-digital/' },
  { id: 'medikredit', title: 'MediKredit claims switching', url: 'https://www.medikredit.co.za/products-and-services/healthcare-claims-switching/' },
  { id: 'phisc', title: 'PHISC: about us', url: 'https://www.phisc.net/about-us' },
  { id: 'discovery', title: 'Discovery HealthID', url: 'https://www.discovery.co.za/medical-aid/health-id' },
  { id: 'sanbs', title: 'South African National Blood Service', url: 'https://en.wikipedia.org/wiki/South_African_National_Blood_Service' },
  { id: 'pacs', title: 'PACS in the public sector (PMC10244939)', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10244939/' },
  { id: 'ems', title: 'EMS patient report form and handover (PMC9634030)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9634030/' },
  { id: 'badem', title: 'The art of the EMS handover', url: 'https://badem.co.za/the-art-of-the-ems-handover-2/' },
  { id: 'svs', title: 'Stock Visibility System, RxSolution, CCMDD (PMC9945761)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9945761/' },
  { id: 'mcr', title: 'The Maternity Case Record', url: 'https://knowledgehub.health.gov.za/system/files/2024-02/The%20Maternity%20Case%20Record%20for%20Webinar.pdf' },
  { id: 'rthb', title: 'Road to Health Booklet (PMC11736536)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11736536' },
  { id: 'dhis2', title: 'DHIS2 in South Africa (SAJIM)', url: 'https://sajim.co.za/index.php/sajim/article/view/1903/3042' },
  { id: 'careconnect', title: 'CareConnect and Altron HealthTech (press release, Dec 2024)', url: 'https://healthtech.altron.com/press-releases/collaborative-information-sharing-with-altron-healthtech-and-careconnect' },
  { id: 'pmg2', title: 'Parliamentary reply NW2014, 28 May 2026 (hospital EMRs by province)', url: 'https://pmg.org.za/committee-question/37900/' },
  { id: 'nw4628', title: 'Parliamentary reply NW4628, 1 August 2025 (HPRS roll-out)', url: 'https://pmg.org.za/committee-question/31749/' },
  { id: 'nw3319', title: 'Parliamentary reply NW3319, November 2023 (HPRS facilities)', url: 'https://pmg.org.za/committee-question/23923/' },
  { id: 'nw6279', title: 'Parliamentary reply NW6279, January 2026 (SA Connect health facilities)', url: 'https://pmg.org.za/committee-question/35068/' },
  { id: 'hprsprov', title: 'Provincial HPRS briefings to the Select Committee on Social Services, June 2025', url: 'https://pmg.org.za/committee-meeting/41085/' },
  { id: 'kznhprs', title: 'Challenges in implementing HPRS in KwaZulu-Natal (The Post, 11 June 2025)', url: 'https://thepost.co.za/news/south-africa/kwazulu-natal/2025-06-11-challenges-in-implementing-the-health-patient-registration-system-in-kwazulu-natal' },
  { id: 'kzndw', title: 'AHRI donates IT equipment to support the KZN data warehouse project (Oct 2022)', url: 'https://www.ahri.org/ahri-donates-it-equipment-to-support-kzn-data-warehouse-project/' },
  { id: 'tender11', title: 'Tender NDOH 11-2026/2027: roll-out of the EMR in eight provinces', url: 'https://www.tenderflow.co.za/tenders/appointment-of-service-providers-to-support-the-national-dep-4e2d2bdc27a54f2fa8183619e31b5a3e/' },
  { id: 'globalfund', title: 'Global Fund: South Africa digital health case study (Nov 2025)', url: 'https://www.theglobalfund.org/media/x1dh0ls4/publication_south-africa-digital-health_casestudy_en.pdf' },
  { id: 'webdhis', title: 'NDoH webDHIS technical overview (Aug 2026)', url: 'https://www.health.gov.za/wp-content/uploads/2026/08/NDOH-09-2026-26-Additional-Information.pdf' },
  { id: 'sanews74470', title: 'CSIR to develop digital foundation for NHI (SAnews, April 2025)', url: 'https://www.sanews.gov.za/node/74470' },
  { id: 'snomed', title: 'South Africa adopts SNOMED CT (SNOMED International, May 2026)', url: 'https://forums.snomed.org/t/major-milestone-for-africa-south-africa-adopts-snomed-ct-to-drive-digital-health-transformation/1332' },
  { id: 'gijima', title: 'Gijima scores R339m health tender (ITWeb)', url: 'https://www.itweb.co.za/article/gijima-scores-r339m-health-tender/KBpdgvpzJOJMLEew' },
  { id: 'hms2herald', title: 'Province launches paperless patient management system (Eastern Cape, 2021)', url: 'https://www.theherald.co.za/weekend-post/your-weekend/2021-10-16-province-launches-paperless-patient-management-system/' },
  { id: 'limpopo', title: 'Limpopo records digitisation spend (Citizen, July 2022)', url: 'https://citizen.co.za/review-online/?p=545584' },
  { id: 'mpda', title: 'Mpumalanga electronic filing spend (DA, March 2023)', url: 'https://mpumalanga.da.org.za/2023/03/da-suspicious-of-millions-spent-to-roll-out-electronic-filling-systems-in-mpumalanga-hospitals' },
  { id: 'netcare22', title: 'Netcare CareOn: a game changer for hospital care (June 2022)', url: 'https://netcare.co.za/NewsHub/Articles/pioneering-electronic-medical-record-system-a-game-changer-for-hospital' },
  { id: 'mbcc', title: 'CareConnect health information exchange (Medical Brief, Nov 2023)', url: 'https://www.medicalbrief.co.za/?p=171562' },
  { id: 'ahie', title: 'African Health Information Exchange / OpenHIE notes', url: 'https://wiki.ohie.org/x/aQDeAQ' },
  { id: 'openhie', title: 'OpenHIE: Jembi Health Systems partner spotlight', url: 'https://ohie.org/openhie-partner-organization-spotlight-jembi-health-systems/' },
  { id: 'plm', title: 'Project Last Mile: CCMDD scale (ESG Today)', url: 'https://www.esgtoday.com/project-last-mile-plm-awarded-gold-for-excellence-in-helping-bring-chronic-medicines-within-reach-for-millions-of-south-africans/' },
  { id: 'svstech', title: 'Stock Visibility System technical brief', url: 'https://www.ghsupplychain.org/stock-visibility-system-technical-brief' },
  { id: 'ampath', title: 'Ampath: lab results for doctors', url: 'https://www2.ampath.co.za/medical-practitioners/lab-results-for-doctors' },
  { id: 'lancet', title: 'Lancet Laboratories chooses Netlims LabOS (2018)', url: 'https://www.intelligentcio.com/africa/2018/12/17/lancet-laboratories-chooses-netlims-labos-product-to-replace-its-lis/' },
  { id: 'bluebird', title: 'Lenmed and Bluebird results routing', url: 'https://www.lenmed.co.za/lenmed-works-to-mitigate-infection-risk-in-its-hospitals-with-bluebird/' },
  { id: 'healthid12', title: 'Discovery launches HealthID (2012)', url: 'https://www.mynewsdesk.com/za/discovery-holdings-ltd/pressreleases/discovery-health-launches-healthid-a-revolution-in-electronic-health-records-in-sa-779062' },
  { id: 'sanbscap', title: 'SANBS integrated report: manufactured capital', url: 'https://sanbs-integrated-report.sanbs.org.za/manufactured-capital.php' },
  { id: 'eprogesa', title: 'ePROGESA product filing (US FDA)', url: 'https://fda.innolitics.com/device/BK230986' },
  { id: 'phis', title: 'Limpopo information system flop, department admits fault (Citizen, 2014)', url: 'https://www.citizen.co.za/review-online/news-headlines/2014/10/16/lim-information-system-flop-dept-admits-fault/' },
  { id: 'dcsict', title: 'Correctional Services critical ICT systems still lag behind (2026)', url: 'https://www.pulse.bot/govtech/news/correctional-services-critical-ict-systems-still-lag-behind-db48a373-6f2e-46a5-9477-045cd1a4a00d' },
  { id: 'er24', title: 'ER24: logging a patient record request', url: 'https://www.er24.co.za/en/corporate/contact/medicolegalcontact.html' },
  { id: 'sacbc', title: 'SACBC AIDS Office: TIER.Net at St Mary\u2019s Hospital, Mariannhill', url: 'https://aidsoffice.sacbc.org.za/tier-net-st-marys-hospital-mariannhill-kzn/' },
  { id: 'pepfarexit', title: 'US phased withdrawal of PEPFAR funding from South Africa', url: 'https://www.academicjobs.com/za/global-news/us-phases-out-pepfar-funding-for-south-africa-hiv-programs-or-academicjobs-23950' },
  { id: 'nappireg', title: 'MediKredit (owner of NAPPI codes, per Discovery’s NAPPI registration guide)', url: 'https://www.medikredit.co.za/' },
  { id: 'goodx', title: 'GoodX', url: 'https://goodx.co.za/' },
  { id: 'propharm', title: 'ProPharm (Computassist Group)', url: 'https://www.computassistgroup.com/propharm' },
  { id: 'pathcare', title: 'PathCare doctors portal', url: 'https://www.pathcare.co.za/drs-portal/register-download-app/' },
  { id: 'popia', title: 'POPIA section 32', url: 'https://popia.co.za/section-32-authorisation-concerning-data-subjects-health-or-sex-life/' },
  { id: 'nhi', title: 'NHI Act: your top 10 questions (Bowmans)', url: 'https://bowmanslaw.com/insights/south-africa-the-national-health-insurance-act-your-top-10-questions-answered/' },
]
export const SRC = Object.fromEntries(SOURCES.map((s) => [s.id, s]))
export type { IconName }
