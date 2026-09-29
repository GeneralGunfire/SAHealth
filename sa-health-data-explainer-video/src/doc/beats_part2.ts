import type {BeatSpec} from './beats';

/**
 * Part 2 of the podcast, authored in PART-2-LOCAL seconds (`near`, numeric `at`).
 * beats.ts shifts these onto the clean master timeline.
 */
export const PART2_LOCAL: BeatSpec[] = [
  // ------------------------------------------------------------ 05 medicines (cont.)
  {t: 'Headline', at: 'bypass the clinic infrastructure', near: 23.5, g: 'paper', lines: ['Skip the queue.', 'Collect *closer to home*.']},
  {t: 'Triptych', at: 'designated pickup point', near: 32, g: 'paper', title: 'CCMDD pick-up points', cols: [
    {icon: 'pill', head: 'Retail pharmacy', sub: 'near work', at: 'retail pharmacy'},
    {icon: 'doctor', head: 'Private GP', sub: 'a GP’s office', at: "GP's office"},
    {icon: 'building', head: 'Adherence club', sub: 'a community hall', at: 'adherence club', accent: true},
  ]},
  {t: 'Headline', at: 'taking thousands of stable patients', near: 48, g: 'ink', lines: ['Stable patients out,', 'nurses free for *the sick*.']},
  {t: 'Headline', at: 'Stock Visibility System', near: 65.8, g: 'navy', lines: ['SVS'], size: 240, subtitle: 'Stock Visibility System — running since 2013'},
  {t: 'Hero', at: 'mobile and web-based application', near: 72.5, g: 'paper', icon: 'box', title: 'What’s *on the shelf*?', sub: 'Clinic staff scan and record medicine stock in real time.'},
  {t: 'Headline', at: 'tracks the boxes', near: 92, g: 'ink', lines: ['It tracks *boxes*.', 'Not patients.'], hlAt: 'boxes'},
  {t: 'Headline', at: 'barcode on the cardboard', near: 109.3, g: 'paper', lines: ['The barcode on the cardboard —', 'not *the heartbeat*.'], serif: true, size: 84},

  // ------------------------------------------------------------ 06 hospital
  {t: 'Chapter', at: 'medical crisis', near: 122, g: 'ink', n: 6, title: 'The public hospital', sub: 'A different system in every province'},
  {t: 'Flow', at: 'referral', near: 131.8, g: 'paper', title: 'Moving up a tier', nodes: [
    {icon: 'clinic', label: 'Clinic', at: 0},
    {icon: 'hospital', label: 'Public hospital', at: 'public hospital', accent: true},
  ]},
  {t: 'Headline', at: 'travels right in her hands', near: 146.6, g: 'navy', lines: ['It travels', '*in her hands*.'], size: 130},
  {t: 'Hero', at: 'physical paper referral letter', near: 153, g: 'paper', icon: 'doc', title: 'A paper *referral letter*', sub: 'Written by the clinic nurse — carried by Nomsa on the taxi ride.'},
  {t: 'Headline', at: 'literal carrier of their own data', near: 161.4, g: 'ink', lines: ['The patient', 'is *the network*.']},
  {t: 'Headline', at: 'no single national software system', near: 181.9, g: 'paper', lines: ['No single national', '*hospital system*.']},
  {t: 'Headline', at: 'provincial mandate', near: 201.4, g: 'navy', lines: ['Hospitals are a', '*provincial* mandate.']},
  {t: 'Quote', at: 'parliamentary reply', near: 208.8, g: 'ink', text: 'A province-by-province *audit* of the digital infrastructure.', attr: 'Parliamentary reply NW4495 · 1 August 2025', hlAt: 'fascinating'},
  {t: 'MapBeat', at: "let's begin with the Western Cape", near: 221.2, g: 'paper', lines: ['Western Cape:', '*Clinicom*'], note: '53 hospitals · since 1998 · plus PHCIS in 308 clinics', noteAt: '53', prov: {'Western Cape': {state: 'blue', at: 0.4, label: 'WC'}}, zoom: {name: 'Western Cape', at: 1.5, s: 1.35}},
  {t: 'MapBeat', at: "let's look at the Eastern Cape", near: 252, g: 'paper', lines: ['Eastern Cape:', '*HMS2*'], note: 'In-house system · 44 hospitals', noteAt: '44', prov: {'Western Cape': {state: 'on', at: 0, label: 'WC'}, 'Eastern Cape': {state: 'blue', at: 0.5, label: 'EC'}}},
  {t: 'MapBeat', at: 'move into the free state', near: 268, g: 'paper', lines: ['Free State:', '*HMS2 + Meditech*'], note: 'HMS2 in 16 hospitals · Meditech in 3', noteAt: 'Meditech', prov: {'Western Cape': {state: 'on', at: 0, label: 'WC'}, 'Eastern Cape': {state: 'on', at: 0, label: 'EC'}, 'Free State': {state: 'blue', at: 0.5, label: 'FS'}}},
  {t: 'Headline', at: 'even if you stay inside', near: 285.8, g: 'ink', lines: ['Two hospitals,', 'two *software languages*.']},
  {t: 'MapBeat', at: 'KwaZulu-Natal took', near: 297.9, g: 'paper', lines: ['KwaZulu-Natal:', '*eHealth*'], note: 'Built in-house · 42 hospitals · since 2020', noteAt: '42', prov: {'Western Cape': {state: 'on', at: 0, label: 'WC'}, 'Eastern Cape': {state: 'on', at: 0, label: 'EC'}, 'Free State': {state: 'on', at: 0, label: 'FS'}, 'KwaZulu-Natal': {state: 'blue', at: 0.5, label: 'KZN'}}},
  {t: 'MapBeat', at: 'economic hub', near: 312, g: 'paper', lines: ['Gauteng:', '*SAP-based HIS*'], note: 'Replaced legacy Medicom and PAAB · 37 hospitals, 31 community health centres', noteAt: '37 hospitals', prov: {'Western Cape': {state: 'on', at: 0, label: 'WC'}, 'Eastern Cape': {state: 'on', at: 0, label: 'EC'}, 'Free State': {state: 'on', at: 0, label: 'FS'}, 'KwaZulu-Natal': {state: 'on', at: 0, label: 'KZN'}, Gauteng: {state: 'blue', at: 0.5, label: 'GP'}}},
  {t: 'List', at: 'let me consolidate', near: 337, g: 'navy', title: 'Five provinces, six systems', numbered: false, items: [
    {text: 'Clinicom · PHCIS', at: 'Clinicom'},
    {text: 'HMS2 · Meditech', at: 'HMS2'},
    {text: 'eHealth · SAP', at: 'e-health'},
  ]},
  {t: 'Headline', at: 'nine provinces', near: 351.3, g: 'paper', lines: ['Nine provinces.', 'We’ve named *five*.']},
  {t: 'MapBeat', at: 'the reality in those four', near: 359.9, g: 'paper', title: 'And the other *four*?', prov: {
    'Western Cape': {state: 'on', at: 0}, 'Eastern Cape': {state: 'on', at: 0}, 'Free State': {state: 'on', at: 0}, 'KwaZulu-Natal': {state: 'on', at: 0}, Gauteng: {state: 'on', at: 0},
    Mpumalanga: {state: 'hatch', at: 0.6, label: 'MP'}, 'North West': {state: 'hatch', at: 0.9, label: 'NW'}, Limpopo: {state: 'hatch', at: 1.2, label: 'LP'}, 'Northern Cape': {state: 'hatch', at: 1.5, label: 'NC'},
  }},
  {t: 'Quote', at: 'not currently implementing', near: 368.3, g: 'navy', text: 'Not currently implementing patient information or *EMR systems* at hospitals.', attr: 'National Department of Health · parliamentary reply, 1 August 2025', hlAt: 'EMR'},
  {t: 'Folder', at: 'the hospital record is entirely physical', near: 380.2, g: 'paper', lines: [{text: 'Admitted: ••/••', at: 'admission'}, {text: 'Discharged: ••/••', at: 'discharge'}], caption: 'Paper, from *admission to discharge*', captionAt: 'paper folders'},

  // ------------------------------------------------------------ Western Cape PHDC
  {t: 'Headline', at: 'integration is succeeding', near: 396, g: 'blue', lines: ['Where integration', '*works*.']},
  {t: 'Headline', at: 'Provincial Health Data Center', near: 407.1, g: 'navy', lines: ['PHDC'], size: 240, subtitle: 'Provincial Health Data Centre — Western Cape'},
  {t: 'Chain', at: 'reaches into all these separate silos', near: 419.3, g: 'paper', steps: [
    {icon: 'clinic', label: 'Clinic visits', at: 'clinic visit'},
    {icon: 'hospital', label: 'Admissions', at: 'hospital admission'},
    {icon: 'flask', label: 'NHLS results', at: 'lab results'},
    {icon: 'pill', label: 'Pharmacy', at: 'pharmacy dispensing'},
    {icon: 'db', label: 'TIER.Net', at: 'chronic disease', kind: 'digital'},
  ]},
  {t: 'Hero', at: 'single identifier', near: 438.4, g: 'paper', icon: 'card', title: 'One patient number', sub: 'Everything tied to the Clinicom folder number.', accent: true},
  {t: 'Stat', at: 'roughly eight million', near: 451.9, g: 'navy', value: 8, prefix: '≈ ', suffix: 'M', label: 'people linked', countAt: 'eight million', source: 'Boulle et al., IJPDS (2019)'},
  {t: 'Headline', at: 'single-patient viewer', near: 460.6, g: 'paper', kicker: 'The front end', lines: ['The Single', '*Patient Viewer*'], subtitle: 'The most integrated view of a patient in the public sector'},
  {t: 'MapBeat', at: 'entirely constrained by geography', near: 481.9, g: 'paper', title: 'It stops at the *border*', prov: {'Western Cape': {state: 'blue', at: 0, label: 'WC'}, 'Eastern Cape': {state: 'hatch', at: 'crosses the provincial line', label: 'EC'}}},

  // ------------------------------------------------------------ 07 emergencies
  {t: 'Chapter', at: 'acute trauma', near: 501.9, g: 'ink', n: 7, title: 'Emergencies', sub: 'Ambulance, blood, imaging'},
  {t: 'Hero', at: 'if she arrives via ambulance', near: 518.7, g: 'paper', icon: 'ambulance', title: 'The patient *report form*', sub: 'In many services, still a paper form — filled out in the back of the ambulance.'},
  {t: 'Headline', at: 'oldest data transfer mechanism', near: 540.7, g: 'navy', lines: ['The oldest protocol:', '*speech*.']},
  {t: 'List', at: 'demographics', near: 565.1, g: 'ink', title: 'DeMIST handover', numbered: false, items: [
    {text: 'De — Demographics', at: 'demographics'},
    {text: 'M — Mechanism of injury', at: 'mechanism'},
    {text: 'I — Injuries found', at: 'injuries found'},
    {text: 'S — Signs & symptoms', at: 'signs and symptoms'},
    {text: 'T — Treatment given', at: 'treatment given'},
  ]},
  {t: 'Headline', at: 'leave the paper patient report form', near: 583, g: 'paper', lines: ['Then the form', 'is *left on the desk*.']},
  {t: 'Hero', at: 'massive blood transfusion', near: 602, g: 'paper', icon: 'drop', title: 'Blood is *tracked separately*', sub: 'Specialised, standalone systems.'},
  {t: 'MapBeat', at: 'eight of the nine provinces', near: 615.6, g: 'paper', lines: ['SANBS', 'in *8 of 9* provinces'], note: 'South African National Blood Service · new “eProgresa” system', noteAt: 'progressa', prov: {
    'Eastern Cape': {state: 'on', at: 0.3}, 'Free State': {state: 'on', at: 0.4}, Gauteng: {state: 'on', at: 0.5}, 'KwaZulu-Natal': {state: 'on', at: 0.6}, Limpopo: {state: 'on', at: 0.7}, Mpumalanga: {state: 'on', at: 0.8}, 'North West': {state: 'on', at: 0.9}, 'Northern Cape': {state: 'on', at: 1.0},
    'Western Cape': {state: 'blue', at: 'Western Cape Blood Service', label: 'WCBS'},
  }},
  {t: 'Headline', at: 'regional silos extend', near: 641.2, g: 'ink', lines: ['Silos, even in', 'the *blood supply*.']},
  {t: 'Hero', at: 'picture archiving', near: 656.8, g: 'paper', icon: 'image', title: 'PACS', sub: 'Picture Archiving and Communication System — where scans live.'},
  {t: 'Split', at: 'highly variable', near: 665.4, g: 'paper', left: {title: 'Public', sub: 'Patchy access'}, right: {title: 'Private', sub: 'Standard in radiology'}, rightAt: 'standard in private', source: 'Clinician survey, Charlotte Maxeke Johannesburg Academic Hospital (PMC10244939)'},
  {t: 'Triptych', at: 'depending on the hospital', near: 692.6, g: 'navy', title: 'The infrastructure *dictates the medium*', cols: [
    {icon: 'laptop', head: '3D model on a monitor', at: 'crisp', accent: true},
    {icon: 'image', head: 'Film on a light box', at: 'light box'},
  ]},

  // ------------------------------------------------------------ recap of the public highway
  {t: 'List', at: 'thoroughly mapped the public highway', near: 707.7, g: 'ink', title: 'The public highway, so far', numbered: false, items: [
    {text: '68 million records in HPRS', at: '68 million'},
    {text: 'Handwritten folders', at: 'handwritten folders'},
    {text: 'Anonymous DHIS2 ticks', at: 'DHIS2 ticks'},
    {text: 'Offline TIER.Net computers', at: 'offline'},
    {text: 'SMS printers', at: 'SMS printers'},
    {text: 'A patchwork of provincial software', at: 'provincial software'},
  ]},
  {t: 'Headline', at: 'brilliantly improvised ecosystem', near: 734, g: 'paper', lines: ['A *brilliantly improvised*', 'ecosystem.'], serif: true, size: 96},

  // ------------------------------------------------------------ 08 private sector
  {t: 'Chapter', at: 'execute a major shift', near: 738.3, g: 'blue', n: 8, title: 'The private highway', sub: 'Nomsa gets medical scheme cover'},
  {t: 'Dots', at: 'she gets a new job', near: 746.9, g: 'paper', total: 62, per: 'One dot ≈ one million people', groups: [{n: 9, label: 'Now one of the 9.17 million', at: '9.17', color: 'accent'}], splitAt: 'crosses the tracks'},
  {t: 'Hero', at: 'persistent, terrible cough', near: 769.3, g: 'paper', icon: 'doctor', title: 'A private *GP*', sub: 'In her neighbourhood — paid through her medical aid.', accent: true},
  {t: 'Headline', at: 'private practice management software', near: 784.4, g: 'navy', kicker: 'Practice management software', lines: ['GoodX', 'Healthbridge'], size: 120, subtitle: 'Running on the practice’s own local computers'},
  {t: 'Triptych', at: 'primary architectural purpose', near: 808.6, g: 'paper', title: 'Built for *money*', cols: [
    {icon: 'card', head: 'Billing', at: 'billing', accent: true},
    {icon: 'chart', head: 'Scheduling', at: 'schedule appointments'},
    {icon: 'doc', head: 'Claims', at: 'generate financial claims', accent: true},
  ]},
  {t: 'Hero', at: 'intimate clinical narrative', near: 821.5, g: 'ink', icon: 'laptop', title: 'Her notes stay *on this computer*', sub: 'The clinical story lives on one practice’s hard drive.'},
  {t: 'Headline', at: 'financial bill has to travel', near: 835.4, g: 'paper', lines: ['The notes stay.', 'The *bill* travels.']},
  {t: 'Flow', at: 'generates an electronic claim', near: 845.3, g: 'paper', title: 'The claim’s journey', nodes: [
    {icon: 'doctor', label: 'GP software', at: 0},
    {icon: 'swap', label: 'Switch', sub: 'claims clearing house', at: 'switch', accent: true},
    {icon: 'building', label: 'Medical scheme', sub: 'one of 71', at: '71 medical schemes'},
  ]},
  {t: 'Headline', at: 'Healthbridge and MediCredit', near: 872.2, g: 'navy', kicker: 'The switches', lines: ['Healthbridge', 'MediKredit'], size: 120},
  {t: 'Stat', at: 'close to 9,000', near: 883.7, g: 'paper', value: 9000, prefix: '≈ ', label: 'providers on MediKredit’s HealthNet ST', sub: 'Switching claims in real time', countAt: '9,000', source: 'MediKredit, HealthNet ST'},
  {t: 'Headline', at: 'PHISC MEDCLM', near: 903.7, g: 'ink', kicker: 'A universal language', lines: ['PHISC MEDCLM'], size: 150, subtitle: 'A national claims standard, built on EDIFACT'},
  {t: 'Hero', at: 'shipping containers', near: 914.4, g: 'paper', icon: 'box', title: 'A standard *shipping container*', sub: 'Same box every time — whatever is inside.'},
  {t: 'Triptych', at: 'two vital pieces', near: 933.7, g: 'paper', title: 'What’s inside the container', cols: [
    {icon: 'doc', head: 'Tariff code', sub: 'what was done', at: 'tariff codes'},
    {icon: 'heart', head: 'ICD-10 code', sub: 'why it was done', at: 'ICD-10', accent: true},
  ]},
  {t: 'Headline', at: 'alpha-numeric billing codes', near: 946, g: 'navy', lines: ['Codes,', 'not *clinical notes*.']},
  {t: 'Headline', at: 'profound, counterintuitive insight', near: 954, g: 'ink', kicker: 'The counterintuitive part', lines: ['Built for billing.', 'Never meant to be', 'a *medical record*.']},
  {t: 'Headline', at: 'inadvertently become', near: 980.2, g: 'paper', lines: ['The billing database is the', '*most complete history*', 'of private care.']},
  {t: 'Headline', at: 'the money trail effectively', near: 1001.2, g: 'blue', lines: ['The money trail', 'became the *medical history*.'], size: 110},
  {t: 'Headline', at: 'Discovery Health', near: 1016.8, g: 'navy', kicker: 'Discovery Health', lines: ['HealthID'], size: 220, subtitle: 'A clinical view built on claims and pathology data'},
  {t: 'Triptych', at: 'utilizes the claims data', near: 1039, g: 'paper', title: 'A timeline, *reverse-engineered*', cols: [
    {icon: 'pill', head: 'An asthma pump', sub: 'claimed on ••/••', at: 'asthma'},
    {icon: 'heart', head: 'Diabetes', sub: 'ICD-10 code billed', at: 'diabetes', accent: true},
  ]},
  {t: 'Hero', at: 'explicit patient consent', near: 1056.4, g: 'paper', icon: 'lock', title: 'Consent, *per doctor*', sub: 'She grants it doctor by doctor — and can revoke it at any time.', accent: true},
  {t: 'Headline', at: 'gatekeeper', near: 1074.7, g: 'ink', lines: ['She’s the *gatekeeper*.']},
  {t: 'Headline', at: 'major private pathology', near: 1091.8, g: 'paper', kicker: 'Private pathology', lines: ['Ampath', 'Lancet', 'PathCare'], size: 110},
  {t: 'Hero', at: 'dedicated digital portals', near: 1107.8, g: 'paper', icon: 'tablet', title: 'Each lab, *its own app*', sub: 'e.g. PathCare’s “PathProvider” for referring doctors.'},
  {t: 'Flow', at: 'prescribes antibiotics', near: 1126, g: 'paper', title: 'Yet another ecosystem', nodes: [
    {icon: 'pill', label: 'Retail pharmacy', at: 'retail pharmacy'},
    {icon: 'laptop', label: 'ProPharm', sub: 'dispensing software', at: 'prevalent system'},
    {icon: 'swap', label: 'Its own claim', sub: 'through a switch', at: 'separate financial claim', accent: true},
  ]},
  {t: 'Headline', at: 'brain is completely severed', near: 1156.7, g: 'ink', lines: ['The pharmacy’s brain,', '*severed* from the GP’s.']},
  {t: 'Hero', at: 'severe pneumonia', near: 1161.6, g: 'paper', icon: 'hospital', title: 'A private *hospital*', sub: 'Absorbed into that group’s own digital ecosystem.'},
  {t: 'Headline', at: 'group-wide system called', near: 1178.4, g: 'navy', kicker: 'Netcare', lines: ['CareOn'], size: 240, subtitle: 'A genuinely group-wide electronic medical record'},
  {t: 'Stat', at: '45 of its hospitals', near: 1193, g: 'paper', value: 45, label: 'Netcare hospitals on CareOn', sub: 'Implementation completed April 2024', countAt: '45', source: 'Netcare Integrated Report 2024'},
  {t: 'Bars', at: 'more than 13,000 iPads', near: 1203.9, g: 'paper', title: 'The bedside, *on tablets*', max: 32000, bars: [
    {label: 'iPads in the wards', value: 13000, display: '13 000+', at: '13,000', accent: true},
    {label: 'Active users', value: 31000, display: '≈ 31 000', at: '31,000'},
  ], source: 'Netcare Integrated Report 2024'},
  {t: 'Headline', at: 'strictly within the walls', near: 1224.6, g: 'ink', lines: ['Seamless —', '*within Netcare’s walls*.']},
  {t: 'Triptych', at: 'transferred to a medical clinic', near: 1231.6, g: 'paper', title: 'Every group, *its own silo*', cols: [
    {icon: 'hospital', head: 'Netcare', sub: 'CareOn', at: 0},
    {icon: 'hospital', head: 'Mediclinic', sub: 'own systems', at: 'medical clinic'},
    {icon: 'hospital', head: 'Life Healthcare', sub: 'own systems', at: 'life healthcare'},
  ]},
  {t: 'Hero', at: 'specialists operating', near: 1244.6, g: 'paper', icon: 'doctor', title: 'Specialists: *independent*', sub: 'Their own practices, their own software, their own notes.'},
  {t: 'Wall', at: 'meticulously mapped', near: 1266.8, g: 'ink', left: ['Paper folders', 'Provincial systems', 'NHLS'], right: ['EDIFACT claims', 'Private apps', 'Hospital silos'], wallAt: 0.2},

  // ------------------------------------------------------------ 09 how a doctor finds out
  {t: 'Chapter', at: 'human reality', near: 1284.8, g: 'ink', n: 9, title: 'How a doctor finds out', sub: 'Six steps, in the order they’re tried'},
  {t: 'Headline', at: 'brand new doctor', near: 1289.1, g: 'navy', lines: ['A new doctor.', 'A patient they’ve *never met*.']},
  {t: 'Hero', at: 'ask her directly', near: 1311.8, g: 'paper', icon: 'person', title: 'Step 1: *ask her*', sub: 'What brings you in? Has this happened before? What medicines do you take?', accent: true},
  {t: 'Hero', at: 'read the documents', near: 1328.9, g: 'paper', icon: 'doc', title: 'Step 2: *read what she carries*', sub: 'A referral letter · a clinic card'},
  {t: 'Triptych', at: 'if she is pregnant', near: 1340.5, g: 'paper', title: 'Records the patient holds', cols: [
    {icon: 'doc', head: 'Referral letter', at: 0},
    {icon: 'book', head: 'Maternity case record', at: 'maternity', accent: true},
    {icon: 'book', head: 'Road to Health booklet', at: 'road to health'},
  ]},
  {t: 'Headline', at: 'physical courier', near: 1351.8, g: 'ink', lines: ['The patient is', 'the *courier*.']},
  {t: 'Headline', at: 'sized and designed to be carried', near: 1355.2, g: 'paper', lines: ['Sized for a handbag —', 'because a *universal record* doesn’t exist.'], hlAt: 'universal', size: 84},
  {t: 'Hero', at: 'searching the laboratory portals', near: 1367.2, g: 'paper', icon: 'search', title: 'Step 3: *lab portals*', sub: 'NHLS TrakCare WebView, or PathProvider — if they have a login, and suspect a test was ordered.'},
  {t: 'Hero', at: 'search the local digital system', near: 1384.8, g: 'paper', icon: 'laptop', title: 'Step 4: *the local system*', sub: 'Only useful if she was treated in the same silo.'},
  {t: 'Triptych', at: 'net care ward', near: 1395.9, g: 'navy', title: 'Same silo, or nothing', cols: [
    {icon: 'tablet', head: 'Netcare ward', sub: 'search CareOn', at: 0},
    {icon: 'hospital', head: 'Western Cape hospital', sub: 'Clinicom · Single Patient Viewer', at: 'Western Cape'},
    {icon: 'x', head: 'Anywhere else', sub: 'nothing', at: 'any other system', accent: true},
  ]},
  {t: 'Hero', at: 'step five is applicable', near: 1413, g: 'paper', icon: 'lock', title: 'Step 5: *HealthID*', sub: 'Only if she’s a Discovery member — and consents, on her phone, to this doctor.'},
  {t: 'Headline', at: 'when all the portals', near: 1432.2, g: 'ink', lines: ['And when', 'all of that *fails*?']},
];
