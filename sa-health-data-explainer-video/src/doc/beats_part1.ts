import type {BeatSpec} from './beats';

/**
 * Part 1 of the podcast (clean timeline 0 – ~1428 s).
 * `at` = spoken phrase, resolved to the occurrence nearest `near` seconds.
 * Nested `at` / `*At` strings resolve to phrases inside the beat's window.
 */
export const PART1: BeatSpec[] = [
  // ------------------------------------------------------------ cold open
  {t: 'Ecg', at: 0, g: 'ink'},
  {t: 'Headline', at: 'doctors surrounding', near: 14, g: 'ink', kicker: 'The emergency room', lines: ['Seconds to decide.'], size: 130},
  {t: 'Headline', at: 'they need to know your story', near: 22, g: 'paper', lines: ['To decide safely,', 'they need *your story*.']},
  {t: 'List', at: 'allergic to penicillin', near: 26, g: 'ink', numbered: false, items: [
    {text: 'Allergic to penicillin?', at: 'penicillin'},
    {text: 'On blood thinners?', at: 'blood thinners'},
    {text: 'A heart condition?', at: 'heart condition'},
  ]},
  {t: 'Headline', at: 'physical matter of your body', near: 35, g: 'paper', lines: ['Your body is on the table.', 'Your history is *invisible*.'], hlAt: 'invisible'},
  {t: 'Headline', at: "welcome to today's deep dive", near: 46, g: 'ink', kicker: 'A documentary', lines: ['How patient data moves', 'through South African', '*healthcare*'], size: 112},
  {t: 'Headline', at: 'a ghost', near: 56, g: 'navy', lines: ['A ghost', 'in the machine.'], serif: true, size: 150, align: 'center'},
  {t: 'Hero', at: "we're going to call her", near: 66, g: 'paper', icon: 'person', title: 'Meet *Nomsa*', sub: 'A hypothetical patient. We follow her data — not her illness.', accent: true},
  {t: 'Headline', at: 'data really is the absolute life blood', near: 70, g: 'ink', lines: ['Data is the *lifeblood*', 'of modern healthcare.']},
  {t: 'Triptych', at: 'every single time a pulse', near: 85, g: 'paper', title: 'Every visit, *data is born*', cols: [
    {icon: 'heart', head: 'A pulse', at: 'pulse'},
    {icon: 'flask', head: 'A blood test', at: 'blood test'},
    {icon: 'pill', head: 'A prescription', at: 'prescription', accent: true},
  ]},
  {t: 'Headline', at: 'where does it go', near: 93, g: 'navy', lines: ['Where does it go?', 'Does it *travel with the patient?*'], hlAt: 'travel'},
  {t: 'Headline', at: 'ground rule', near: 104, g: 'paper', kicker: 'The ground rule', lines: ['First, we observe.', 'The *critique* comes last.'], hlAt: 'save all'},

  // ------------------------------------------------------------ 01 landscape
  {t: 'Chapter', at: 'it is a vast ecosystem', near: 146, g: 'ink', n: 1, title: 'The landscape', sub: 'Two systems, one country'},
  {t: 'Stat', at: '2022 census', near: 158, g: 'paper', value: 62, suffix: 'M', label: 'people in South Africa', sub: '62 million potential data trails', countAt: 'roughly 62', source: 'Stats SA, Census 2022'},
  {t: 'Headline', at: 'defining split', near: 175, g: 'navy', lines: ['The defining split:', '*medical schemes*'], subtitle: 'South Africa’s term for private health insurance', hlAt: 'medical schemes'},
  {t: 'Dots', at: 'out of those 62 million', near: 184, g: 'paper', total: 62, title: '62 million people', per: 'One dot ≈ one million people', groups: [
    {n: 9, label: '9.17 million on medical schemes', at: '9.17', color: 'accent'},
  ], source: 'Council for Medical Schemes, Annual Report 2024/25'},
  {t: 'Stat', at: 'distributed across 71', near: 196, g: 'navy', value: 71, label: 'different medical schemes', countAt: '71', source: 'Council for Medical Schemes, Annual Report 2024/25'},
  {t: 'Dots', at: 'let me do the math', near: 209, g: 'paper', total: 62, per: 'One dot ≈ one million people', groups: [
    {n: 9, label: 'Medical schemes', at: 0, color: 'accent'},
    {n: 53, label: 'Public system', at: 'five out of every six', color: 'fg'},
  ], splitAt: 'five out of every six'},
  {t: 'Headline', at: 'that is the reality of the distribution', near: 222, g: 'ink', lines: ['*5 in 6* people rely', 'on the public system.']},
  {t: 'Headline', at: 'two massive parallel highways', near: 230, g: 'ink', lines: ['Picture two', '*parallel highways*.']},
  {t: 'Highways', at: 'public highway is built', near: 250, g: 'paper', title: 'Two parallel highways', noBridgeAt: 'no bridge'},
  {t: 'Split', at: 'data created on the public highway', near: 283, g: 'paper', left: {title: 'Public', sub: 'Data created here stays here'}, right: {title: 'Private', sub: 'Data created here stays here'}, rightAt: 'private highway stays'},

  // ------------------------------------------------------------ 02 public clinic
  {t: 'Chapter', at: "let's start our journey", near: 289, g: 'ink', n: 2, title: 'The public clinic', sub: 'Where Nomsa’s data is born'},
  {t: 'Hero', at: 'front doors of a public', near: 300, g: 'paper', icon: 'clinic', title: 'The front desk', sub: 'Data creation begins with registration.'},
  {t: 'Headline', at: 'Health Patient Registration System', near: 318, g: 'navy', lines: ['HPRS'], size: 240, subtitle: 'Health Patient Registration System — a national digital register'},
  {t: 'Flow', at: 'generates a unique', near: 333, g: 'paper', title: 'A digital anchor', nodes: [
    {icon: 'card', label: 'ID or passport', at: 'South African ID'},
    {icon: 'db', label: 'HPRS', at: 'creates a dedicated'},
    {icon: 'doc', label: 'HPRN', sub: 'a unique registration number', at: 'unique identifier', accent: true},
  ]},
  {t: 'Timeline', at: 'launched in June 2015', near: 362, g: 'paper', title: 'A national register', items: [
    {year: 'JUNE 2015', text: 'HPRS launched', at: 'June 2015'},
    {year: 'NHI', text: 'Approved registration system for National Health Insurance', at: 'National Health Insurance', accent: true},
  ]},
  {t: 'Stat', at: 'more than 68 million', near: 392, g: 'navy', value: 68, suffix: 'M+', label: 'patient records in HPRS', countAt: '68 million', source: 'NDoH, The Emerging South African Digital Health System (2025)'},
  {t: 'Bars', at: 'approximately 32.5 million', near: 421, g: 'paper', title: 'Checked against Home Affairs', max: 70, bars: [
    {label: 'HPRS patient records', value: 68, display: '68M+', at: 0},
    {label: 'Verified with Home Affairs', value: 32.5, display: '≈ 32.5M', at: '32.5', accent: true},
  ], source: 'NDoH, The Emerging South African Digital Health System (2025)'},
  {t: 'Headline', at: 'digital bouncer', near: 437, g: 'ink', lines: ['Civic identity', '→ *health identity*']},
  {t: 'Headline', at: 'strictly a demographic database', near: 463, g: 'paper', lines: ['It records *who* she is.', 'Not *what* is wrong.'], hlAt: 'absolutely nothing'},
  {t: 'Headline', at: 'digital handshake', near: 476, g: 'navy', lines: ['“A digital handshake.”'], serif: true, align: 'center', size: 120},
  {t: 'Folder', at: 'goes to sit with a nurse', near: 488, g: 'paper', lines: [
    {text: 'c/o headaches × 2 wks', at: 'symptoms'},
    {text: 'BP 152/96', at: 'blood pressure'},
    {text: 'Dx: hypertension', at: 'diagnosis'},
  ], caption: 'Written by hand, in a *paper folder*', captionAt: 'with a pen'},
  {t: 'Hero', at: 'vast majority of public clinics', near: 512, g: 'paper', icon: 'folder', title: 'The folder *is* the record', sub: 'In most public clinics, the clinical record is paper.'},
  {t: 'Headline', at: 'carried to a filing room', near: 530, g: 'ink', lines: ['Filed on a shelf.', 'In *this* clinic only.']},
  {t: 'Triptych', at: 'undeniable reliability to paper', near: 541, g: 'paper', title: 'Paper doesn’t…', cols: [
    {icon: 'alert', head: 'Crash', at: 'crash'},
    {icon: 'laptop', head: 'Need updates', at: 'software update'},
    {icon: 'globe', head: 'Need internet', at: 'internet connection'},
  ]},
  {t: 'Headline', at: 'attempting to digitize', near: 555, g: 'blue', lines: ['Going *digital*?']},
  {t: 'Headline', at: 'March 28th', near: 570, g: 'navy', kicker: 'National electronic medical record', lines: ['Live since', '*28 March 2025*'], subtitle: 'Launched as a beta test'},
  {t: 'Stat', at: 'exactly 36', near: 589, g: 'paper', value: 36, label: 'clinics on the national EMR beta', sub: '+ one GP practice', countAt: '36', source: 'Parliamentary reply NW4495, 1 August 2025'},
  {t: 'MapBeat', at: 'five specific provinces', near: 605, g: 'paper', title: 'Beta in *five provinces*', prov: {
    'Free State': {state: 'accent', at: 3, label: 'FS'},
    'KwaZulu-Natal': {state: 'accent', at: 4, label: 'KZN'},
    'Northern Cape': {state: 'accent', at: 5, label: 'NC'},
    Mpumalanga: {state: 'accent', at: 6, label: 'MP'},
    'North West': {state: 'accent', at: 7, label: 'NW'},
  }, source: 'Parliamentary reply NW4495, 1 August 2025'},
  {t: 'Headline', at: 'software that manages human life', near: 622, g: 'paper', lines: ['A careful beta:', 'don’t slow the nurse,', '*don’t drop the data*.']},
  {t: 'Headline', at: 'bring our focus back', near: 633, g: 'ink', lines: ['Meanwhile, her story', 'is still *in the folder*.']},
  {t: 'Headline', at: 'macro-level tracking', near: 650, g: 'ink', lines: ['Counting everyone', 'starts with a *pen stroke*.']},
  {t: 'Tally', at: 'physical tick mark', near: 668, g: 'paper', caption: 'A tick for every service', collapseAt: 'total up all those ticks', label: 'Monthly data input form'},
  {t: 'Headline', at: 'called DHIS-2', near: 700, g: 'navy', lines: ['DHIS2'], size: 240, subtitle: 'District Health Information System — “webDHIS”'},
  {t: 'Triptych', at: 'how many primary care visits', near: 741, g: 'paper', title: 'The bird’s-eye view', cols: [
    {icon: 'clinic', head: 'Visits per district', at: 'primary care visits'},
    {icon: 'heart', head: 'Maternal check-ups', at: 'maternal'},
    {icon: 'pill', head: 'Childhood vaccines', at: 'vaccines'},
  ]},
  {t: 'Headline', at: 'contains absolutely no patient names', near: 754, g: 'ink', lines: ['No names.', 'It moves *counts*, not identities.'], hlAt: 'counts'},
  {t: 'Headline', at: 'utterly useless', near: 766, g: 'paper', lines: ['Powerful for planning.', '*Useless* for one patient.'], hlAt: 'useless'},
  {t: 'Triptych', at: "let's map", near: 773, g: 'navy', title: 'Three states of matter', cols: [
    {icon: 'db', head: 'Identity', sub: 'HPRS cloud · 68M records', at: 'identity is floating'},
    {icon: 'folder', head: 'Clinical story', sub: 'Paper folder, on a shelf', at: 'medical pain'},
    {icon: 'chart', head: 'A tick mark', sub: 'Anonymous count in DHIS2', at: 'anonymous', accent: true},
  ]},
  {t: 'Headline', at: 'fragmentation begin', near: 805, g: 'paper', lines: ['The fragmentation starts', 'at the *front door*.']},

  // ------------------------------------------------------------ 03 HIV & TIER.Net
  {t: 'Chapter', at: 'takes an HIV test', near: 818, g: 'ink', n: 3, title: 'HIV & TIER.Net', sub: 'A dedicated disease register'},
  {t: 'Headline', at: 'antiretroviral therapy', near: 823, g: 'navy', lines: ['Positive.', 'She starts *antiretroviral therapy*.'], hlAt: 'lifelong'},
  {t: 'Headline', at: 'Three Interlinked Electronic Register', near: 843, g: 'paper', lines: ['TIER.Net'], size: 220, subtitle: 'Three Interlinked Electronic Register — South Africa’s national ART register'},
  {t: 'Headline', at: 'largest HIV treatment programs', near: 855, g: 'ink', lines: ['One of the largest HIV', 'treatment programmes *in the world*']},
  {t: 'Flow', at: 'initial capture remains', near: 868, g: 'paper', title: 'It still starts *on paper*', dashed: true, nodes: [
    {icon: 'pen', label: 'Nurse writes', at: 'nurse writes'},
    {icon: 'folder', label: 'Paper folder', at: 'clinical folder'},
    {icon: 'keyboard', label: 'Data capturer types', at: 'type that information', accent: true},
  ]},
  {t: 'Headline', at: 'second entirely separate transcription', near: 905, g: 'navy', lines: ['A *second* transcription', 'of the same event.']},
  {t: 'Headline', at: 'architectural adaptability', near: 928, g: 'paper', lines: ['Built to survive', '*any* infrastructure.'], source: 'Three-tier ART monitoring framework, PMC4005043'},
  {t: 'Hero', at: 'entirely devoid of technology', near: 958, g: 'paper', icon: 'doc', title: 'Tier 1: *paper*', sub: 'Fewer than 500 patients. No computer, no server, no electricity needed.'},
  {t: 'Hero', at: 'graduate to', near: 995, g: 'paper', icon: 'laptop', title: 'Tier 2: *standalone PC*', sub: '500 – 2,000 patients. Stored locally — works offline.'},
  {t: 'Hero', at: 'fully networked', near: 1034, g: 'paper', icon: 'globe', title: 'Tier 3: *networked EMR*', sub: 'More than 2,000 patients. Shared local server, many terminals.', accent: true},
  {t: 'Triptych', at: 'one unified national reporting standard', near: 1056, g: 'navy', title: 'One standard, *three shapes*', cols: [
    {icon: 'doc', head: 'Paper', sub: '< 500 patients', at: 0},
    {icon: 'laptop', head: 'Standalone', sub: '500 – 2,000', at: 0.4},
    {icon: 'globe', head: 'Networked', sub: '> 2,000', at: 0.8, accent: true},
  ]},

  // ------------------------------------------------------------ 04 laboratory
  {t: 'Chapter', at: 'the laboratory system', near: 1080, g: 'ink', n: 4, title: 'The laboratory', sub: 'Blood leaves the building'},
  {t: 'Flow', at: 'transported to the National Health Laboratory', near: 1098, g: 'paper', nodes: [
    {icon: 'clinic', label: 'Clinic', at: 0},
    {icon: 'flask', label: 'NHLS', sub: 'National Health Laboratory Service', at: 'National Health Laboratory', accent: true},
  ]},
  {t: 'Stat', at: 'roughly 265 laboratories', near: 1115, g: 'navy', value: 265, label: 'public-sector laboratories', countAt: '265'},
  {t: 'Stat', at: '110.6 million', near: 1134, g: 'paper', value: 110.6, dec: 1, suffix: 'M', label: 'tests in a single year (2022/23)', countAt: '110.6', source: 'NHLS Annual Report 2023/24'},
  {t: 'Headline', at: 'This software is called', near: 1172, g: 'ink', lines: ['TrakCare Lab'], size: 170, subtitle: 'The NHLS laboratory information system — “LabTrak”'},
  {t: 'Headline', at: 'massive logistical hurdle', near: 1182, g: 'paper', lines: ['The result is *digital*.', 'The folder is paper.'], hlAt: 'miles away'},
  {t: 'Flow', at: 'two highly specific data pathways', near: 1203, g: 'navy', title: 'Two ways back', nodes: [
    {icon: 'flask', label: 'NHLS', at: 0},
    {icon: 'laptop', label: 'TrakCare WebView', sub: 'web portal', at: 1.2},
    {icon: 'printer', label: 'SMS printer', sub: 'over the cell network', at: 2.2, accent: true},
  ]},
  {t: 'Hero', at: 'standard digital portal', near: 1211, g: 'paper', icon: 'laptop', title: 'TrakCare *WebView*', sub: 'Any result, searchable — if the clinic is online.'},
  {t: 'Headline', at: 'terrible internet', near: 1233, g: 'ink', lines: ['No internet?', 'No computer?']},
  {t: 'Receipt', at: 'small SMS printer', near: 1250, g: 'paper', title: 'A text message, *printed on paper*', printAt: 'texts the result', lines: ['NHLS RESULT', 'PT   ••••••••', 'TEST HIV VL', 'RES  ••••', '', '--- END ---']},
  {t: 'Headline', at: 'faint cell phone signal', near: 1290, g: 'ink', lines: ['As long as there’s', 'a *cell signal*…']},
  {t: 'Folder', at: 'nurse retrieves that printed receipt', near: 1311, g: 'paper', lines: [
    {text: 'VL result: ••• copies/mL', at: 'handwrites'},
  ], caption: 'Copied *by hand* — again', captionAt: 'handwrites'},
  {t: 'Chain', at: "let's just trace it", near: 1349, g: 'paper', steps: [
    {icon: 'drop', label: 'Blood', kind: 'physical', at: 'physical blood'},
    {icon: 'db', label: 'TrakCare Lab', kind: 'digital', at: 'digital signal'},
    {icon: 'phone', label: 'SMS', kind: 'digital', at: 'cellular'},
    {icon: 'printer', label: 'Thermal receipt', kind: 'physical', at: 'receipt paper'},
    {icon: 'pen', label: 'Handwriting', kind: 'physical', at: 'cursive'},
    {icon: 'keyboard', label: 'TIER.Net', kind: 'digital', at: 'keystroked'},
  ]},
  {t: 'Headline', at: 'relentless metamorphosis', near: 1373, g: 'navy', lines: ['Physical → digital →', 'physical → *digital*']},

  // ------------------------------------------------------------ 05 medicines (continues in part 2)
  {t: 'Chapter', at: "now let's look at", near: 1388, g: 'ink', n: 5, title: 'Medicines', sub: 'The monthly refill'},
  {t: 'Headline', at: 'refill of her chronic medication', near: 1395, g: 'paper', lines: ['Every month,', 'a *refill*.']},
  {t: 'Headline', at: 'enrolled in a program', near: 1413, g: 'navy', lines: ['CCMDD'], size: 240, subtitle: 'Central Chronic Medicines Dispensing and Distribution'},
];
