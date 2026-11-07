
---------------------------------------------------------------------------------------------------

## 2. African and global-south programmes and open-source platforms

### 2.1 Jembi Health Systems
- What it is: South African non-profit company (Jembi Health Systems NPC) that partners with aid organisations and governments to design human-centred, open-sourced health information systems (jembi.org, fetched).
- Owner/operator: non-profit; based in South Africa; work in Ethiopia, Kenya, Malawi, Cameroon, Rwanda, South Sudan, Lesotho (search summary).
- Technical: designed and maintains OpenHIM; built the Rwanda Terminology Service; SHR work with the OpenMRS community (Jembi-led deck).
- SA relevance: member of the African Health Information Exchange consortium in SA that supported the national unique health identifier (search summary); OpenHIM used in MomConnect and NurseConnect.
- Business model: grant- and contract-funded implementation services; software open source.
- Source: https://www.jembi.org/ ; https://ohie.org/?p=38773
- Confidence: confirmed.

### 2.2 OpenHIE (Open Health Information Exchange)
- What: a community of people building an open framework to support nations as they develop health information exchanges (ohie.org, fetched).
- Architecture: layered workflow with an interoperability layer, client registry, facility registry, health worker registry, shared health record, terminology service, and point-of-service applications (OpenHIE specification; wiki pages seen as search snippets).
- Reference implementations: OpenHIM (interoperability layer), OpenEMPI and others (client registry), OpenMRS/OpenSHR (shared record).
- Deployments listed in community pages: Rwanda; Tanzania (national facility registry, immunization data integration); Mozambique (vital events surveillance with Jembi); Nigeria (national biometrics collaborative with 85% of HIV patients captured; concept dictionary service from April 2023; health worker registry plans); Ethiopia; Philippines (2012-2014 pilot with OpenEMPI).
- Governance: 2023 Impact Report published 6 Feb 2024 (13 pages; PDF text could not be extracted).
- Source: https://ohie.org/ ; https://wiki.ohie.org/
- Confidence: confirmed.

### 2.3 OpenHIM
- What: middleware component designed to ease interoperability between disparate information systems; provides secure communications and data governance, routing, orchestrating and translating (openhim.org, fetched).
- Components: OpenHIM Core (Node.js; repo jembi/openhim-core-js), console, mediators (microservices registering with core), channel routing, transaction logging for audit, client authentication.
- Licence: MPL-2.0 (search summary); Docker images published under the jembi account on Docker Hub.
- Deployments: Rwanda RHIE (SAVICS phases Sept 2019 to June 2020 linking OpenMRS, LabWare, NIDA, DHIS2); PEPFAR DATIM reporting; SA MomConnect and NurseConnect; Western Cape COVID-19 reporting (claim from secondary page); Tanzania HIM; Ethiopia interoperability layer (OpenHIM mention not confirmed).
- Limits as stated: an OHIE Discourse thread "OpenHIM in production use" exists; no quantified scale retrieved.
- Source: https://openhim.org/ ; https://github.com/jembi/openhim-core-js
- Confidence: confirmed.

### 2.4 DHIS2 and HISP
- What: open-source web platform for aggregate and event data; dhis2.org says it is the world's largest Health Information Management System platform, in use by ministries of health in 80 low and middle-income countries (In Action page, fetched). Wikipedia snapshot end-2022: 75+ countries, 69 at national scale.
- Owner: developed by HISP at the University of Oslo; HISP groups in countries (HISP South Africa, HISP Uganda and others). DHIS2 recognised as Global Good for Climate and Health by PATH Digital Square in 2025.
- Origins: HISP began 1994 in post-apartheid South Africa; DHIS became national standard around 2001.
- Technical: Java (dhis2-core repo), REST Web API, FHIR integrations in some countries; aggregate focus, with Tracker for patient-level events.
- Relation to SA: the District Health Management Information System tender (2023) hosts the system; HRH integration with FHIR story (2022).
- Source: https://dhis2.org/in-action/ ; https://github.com/dhis2/dhis2-core
- Confidence: confirmed.

### 2.5 OpenMRS
- What: open-source EMR platform from a global community; homepage claims 3000+ community members and 8000+ facilities worldwide (openmrs.org, fetched).
- Deployments: Rwanda more than 300 health centres by 2013 (HIV care); AWS public-sector blog says use in 50+ countries.
- Technical: Java core (openmrs-core repo); distributions include KenyaEMR and Bahmni; aligned to OpenHIE as a point-of-service system.
- Confidence: confirmed.

### 2.6 Bahmni
- What: open-source EMR and hospital system built on OpenMRS; adopted in over 50 countries (bahmni.org); the Digital Public Goods registry reportedly lists 500+ implementations in 50 countries (search snippet; the registry page returned 404 to the fetch).
- Example: CURE hospital network across Africa including CURE Zambia.
- Confidence: confirmed (site) / likely (registry count).

### 2.7 KenyaEMR and the Kenya interoperability layer
- KenyaEMR: OpenMRS distribution, originally I-TECH, now supported by Palladium Kenya under KeHMIS; documentation cites deployment in 44 of 47 counties (September 2021).
- Interoperability layer: OpenHIE-based, PEPFAR/CDC Kenya funded, links 8 systems including KHIS (DHIS2), KenyaEMR, IQCare, Ushauri, T4A, Web ADT, mLab and 3PM. Field test: manual DHIS2 entry took over half an hour vs under one minute automated.
- OpenHIM named in these sources: no.
- Source: https://kenyahmis.org/documentation/summary-interoperability/
- Confidence: confirmed.

### 2.8 Kenya national Health Information Exchange (Digital Health Agency)
- What: the Digital Health Agency (DHA) operates the national HIE tied to Social Health Authority rollout from 1 Oct 2024; developers must register and use HIE APIs through AfyaLink; Afya Yangu national digital record reported operational in 17 counties (Ministry statement June 2025, per search summary); National Shared Health Record built on FHIR; legal basis Digital Health Act 2023.
- DHA site (fetched) describes a connected health system bringing together data, standards and infrastructure.
- Challenges cited by commentators: digital divide, standards, public trust, privacy.
- Source: https://www.dha.go.ke/about ; https://capitalfm.africa/digital-health-agency-pushes-interoperability-across-kenya/
- Confidence: likely.

### 2.9 Rwanda Health Information Exchange (RHIE)
- What: HIE on OpenHIE architecture; OpenHIM as interoperability layer; connects OpenMRS, LabWare, NIDA (national ID) and DHIS2 (OHIE case study "Creating a Health Information Exchange System in Rwanda").
- Builders: Jembi (original RHEA architecture, terminology service); SAVICS 2019-2020.
- Unique ID format reported as YYMMDD-FOSAID-RAND4, generated by the UPI service connected to the client registry (case study).
- Original RHEA scale: 197 facilities targeted, 150 deployed (Crichton et al. 2013).
- 2024: FHIR used in a limited way; national HIE development listed as a priority (snippet).
- Gates Foundation and OpenAI announced a USD 50 million AI health partnership beginning in Rwanda, Jan 2026 (press).
- Source: https://ohie.org/?p=44708
- Confidence: confirmed. Note: "SIMR" was searched; no source matching that term was found.

### 2.10 Tanzania Health Information Exchange (TZ-HIE)
- What: national HIE led by MoHCDGEC ICT department with USAID Maternal and Child Survival Program/JSI; built around the Health Information Mediator (HIM).
- Scale: exchange among about 15 systems (13 in another source); HIM supports seven largest national hospitals; tens of thousands of records per month (MCSP page).
- Source: Nsaghurwe et al., BMC Med Inform Decis Mak 2021, https://pmc.ncbi.nlm.nih.gov/articles/PMC8086308 ; JSI: "Tanzania Deploys the Most Advanced Health Information Exchange in sub-Saharan Africa".
- Gates Foundation USD 15 million for the Tanzania Digital Health Investment Road Map (PATH-led; 17 priority investments).
- Confidence: confirmed.

### 2.11 Nigeria
- National Digital Health Architecture (NDHA) endorsed via the National Council on Health; Nigeria Digital in Health Initiative (NDHI) launched March 2024. Pillars: interoperable network, Health Claims Exchange (HCX), HIE with shared health record and registries for clients, facilities and health workers; "one patient, one health record".
- New National Health Technology and Data Analytics Office (allAfrica).
- Earlier Health ICT strategic framework (2015-2020) had weak uptake (Frontiers 2023).
- An NHIS or "N-HIE" branded component: not found.
- Sources: https://allafrica.com/stories/202610020381.html ; https://www.frontiersin.org/journals/digital-health/articles/10.3389/fdgth.2023.1225092
- Confidence: likely.

### 2.12 Ghana
- LHIMS reported as a centralised national EHR not following FHIR; 2025 paper title describes it as discontinued ("Beyond a single system: Lessons from Ghana's discontinued national EHR").
- National Health Information Exchange (NHIE) connects existing applications; GHIMS announced 2025 as state-owned successor (Graphic Online).
- Source: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12877703/
- Confidence: likely.

### 2.13 Zambia SmartCare / SmartCare Pro
- Ministry of Health EHR, funded by US CDC; SmartCare Pro run by Smart Zambia Institute; 2025 announcement: 406 facilities deployed across Lusaka, Copperbelt, Southern; target 1,199 more by end September 2025. Older version: over 800 facilities (2014).
- BMJ Open 2019 qualitative study: structural challenges, little feedback to facilities.
- Underlying software stack and any OpenMRS relationship: not confirmed.
- Confidence: likely.

### 2.14 Ethiopia
- DHIS2 unified national HMIS from 2017; eCHIS (CommCare-based) community system; eHealth Architecture includes data warehouse, national health data dictionary, master facility registry and interoperability layer (JSI documents). DHIS2 configured with 37+ datasets and 4,322 data elements.
- OpenHIM role: OHIE session notes ask OpenHIM vs OpenFN; outcome not recorded.
- Source: ethiopiadup.jsi.com PDFs (search results)
- Confidence: likely.

### 2.15 Mozambique, Botswana, Uganda, Namibia, Egypt, Morocco
- Mozambique: SIS-COVE vital events community surveillance (INS; Ministry of Justice with Jembi); GeoPrism registry. Confidence: likely.
- Botswana: 2015 study cites weak central coordination and policy; national vision of single EHR; legal resolution of interoperability flagged (PLOS review). Confidence: likely.
- Uganda: Digital Health Atlas Uganda and dashboard studied; no national HIE detail found. Confidence: uncertain.
- Namibia: nothing found.
- Egypt: National Digital Health Strategy 2025-2029 (Daily News Egypt, 15 Nov 2025); Universal Health Insurance System: Health Information System in 265 primary care centres and 166 hospital departments across six governorates, laboratory information system at 299 facilities, radiology information system with PACS at 94 (Ahram Online); reported Vodafone and DXC Technology involvement (DXC Technology is a separate IT services company, unrelated to DEXA). GovStack piloting ID, information mediation and consent building blocks. Confidence: likely.
- Morocco: only a March 2026 preprint on national integrated care architecture; no official source found. Confidence: uncertain.

### 2.16 Africa CDC and the African Union
- Africa CDC set up an HIE Task Force (UNC announcement, Feb 2020) to draft HIE policy and standards; "African Union Health Information Exchange Guidelines and Standards" document exists (medbox). A digital health strategy launched at a Kigali conference (Devex; year not stated).
- PLOS Digital Health systematic review (Oct 2022): 17 eHealth strategy documents from 13 countries; only 4 countries reported an eHealth enterprise architecture; no continental HIE policy at the time; Tanzania and SA cited as reference models; Liberia proposed FHIR, ADX, CSD plus OpenHIE.
- Africa CDC assessing SA's HIE (Dec 2025).
- Source: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9931258/
- Confidence: confirmed.

### 2.17 GIZ and donor ecosystem
- GIZ initiative "Digital Health in Africa - Promoting Interoperability for an African Data Market" in Cameroon, Malawi, Rwanda, Senegal (community.globalhealthhub.de snippet). openIMIS community participates in OpenHIE meetings.
- Gates: USD 750,000 digital health funding call (older); Gates/OpenAI USD 50m AI health programme (Jan 2026).
- USAID digital health funding: no source retrieved.
- Global Digital Health Index: site unreachable by scraper; no content retrieved.
- Confidence: likely.
