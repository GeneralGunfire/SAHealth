import type {BeatSpec} from './beats';

/** Part 3 (PART-3-LOCAL seconds; kept audio starts at 208.6 s). */
export const PART3_LOCAL: BeatSpec[] = [
  // ------------------------------------------------------------ step 6
  {t: 'Hero', at: 'sheer manual administration', near: 209, g: 'paper', icon: 'phone', title: 'Step 6: *pick up the phone*', sub: 'Call, email or fax another facility directly.', accent: true},
  {t: 'Folder', at: 'legally signed patient consent', near: 222.8, g: 'paper', lines: [
    {text: 'Request: copies of records', at: 'consent form'},
    {text: 'Consent: signed ✓', at: 'formally request'},
    {text: 'Please photocopy + send', at: 'photocopy'},
  ], caption: 'A signed form, and a *photocopier*', captionAt: 'photocopy'},
  {t: 'Headline', at: 'phoning and faxing', near: 232.8, g: 'ink', lines: ['Phoning and faxing,', 'in *2026*.'], size: 120},
  {t: 'List', at: 'this intricate dance', near: 236.7, g: 'navy', title: 'Six steps', items: [
    {text: 'Ask her', at: 0},
    {text: 'Read what she carries', at: 0.3},
    {text: 'Search lab portals', at: 0.6},
    {text: 'Search the local system', at: 0.9},
    {text: 'Check HealthID', at: 1.2},
    {text: 'Phone, email, fax', at: 1.5},
  ]},

  // ------------------------------------------------------------ 10 law & policy
  {t: 'Chapter', at: 'the law dictates', near: 241, g: 'ink', n: 10, title: 'The rules', sub: 'Law, standards, and the NHI'},
  {t: 'Quote', at: 'Protection of Personal Information Act', near: 246.4, g: 'paper', text: 'Health professionals may process health information when it is *necessary for treatment*.', attr: 'POPIA, section 32 (paraphrased)', hlAt: 'necessary for the treatment'},
  {t: 'Headline', at: 'legal permission to build bridges', near: 260, g: 'navy', lines: ['The legal permission', 'to build bridges *exists*.']},
  {t: 'Timeline', at: 'as far back as 2014', near: 270.2, g: 'paper', title: 'The plan, on paper', items: [
    {year: '2014', text: 'Interoperability standards framework — points to HL7', at: '2014'},
    {year: 'HPRS', text: 'Meant to become the national master patient index', at: 2.5},
    {year: '15 MAY 2024', text: 'National Health Insurance Act signed', at: 4.5, accent: true},
  ]},
  {t: 'Headline', at: 'HL7', near: 278.7, g: 'ink', kicker: 'A common language', lines: ['HL7'], size: 240, subtitle: 'International messaging standards for health data'},
  {t: 'Hero', at: 'long-term architectural intention', near: 291.8, g: 'paper', icon: 'db', title: 'HPRS as the *master index*', sub: 'The long-term goal: one anchor tying every record together.', accent: true},
  {t: 'Headline', at: 'National Health Insurance Act', near: 307.4, g: 'navy', kicker: 'Signed 15 May 2024', lines: ['The NHI Act'], size: 150, subtitle: 'Goal: a unified national health information system'},
  {t: 'Headline', at: 'it has not yet come into full effect', near: 332.5, g: 'ink', lines: ['Signed —', 'but *not yet in effect*.'], hlAt: 'not yet'},

  // ------------------------------------------------------------ the turn
  {t: 'Headline', at: 'here is where it gets', near: 339.9, g: 'paper', lines: ['The map', 'is *drawn*.'], size: 150},
  {t: 'Chain', at: 'watched the data mutate', near: 352.2, g: 'paper', steps: [
    {icon: 'folder', label: 'Handwritten folders', kind: 'physical', at: 'handwritten'},
    {icon: 'printer', label: 'SMS printers', kind: 'physical', at: 'SMS printers'},
    {icon: 'tablet', label: '13,000 iPads', kind: 'digital', at: 'iPads'},
    {icon: 'flask', label: 'Millions of lab tests', kind: 'digital', at: 'lab tests'},
    {icon: 'swap', label: 'EDIFACT codes', kind: 'digital', at: 'billing codes'},
  ]},
  {t: 'Headline', at: 'elephants in the room', near: 366.5, g: 'navy', lines: ['You’ve probably noticed', 'a few *elephants*.']},
  {t: 'Headline', at: 'observation phase is officially over', near: 379.2, g: 'ink', lines: ['The observation', 'phase is *over*.'], size: 130},

  // ------------------------------------------------------------ 11 where it breaks
  {t: 'Chapter', at: "let's talk about the breaks", near: 396.3, g: 'ink', n: 11, title: 'Where it breaks', sub: 'Seven structural failures'},
  {t: 'Headline', at: 'break number one', near: 403.1, g: 'ink', kicker: 'Break 01', lines: ['There is no', '*shared record*.'], size: 130, hlAt: 'shared record'},
  {t: 'MapBeat', at: 'no single national system', near: 415.1, g: 'ink', lines: ['No national system', 'across *provinces*', '— or sectors.'], prov: {
    'Western Cape': {state: 'on', at: 0.3}, 'Eastern Cape': {state: 'on', at: 0.6}, 'Free State': {state: 'on', at: 0.9}, 'KwaZulu-Natal': {state: 'on', at: 1.2}, Gauteng: {state: 'on', at: 1.5},
    Mpumalanga: {state: 'hatch', at: 1.8}, 'North West': {state: 'hatch', at: 2.1}, Limpopo: {state: 'hatch', at: 2.4}, 'Northern Cape': {state: 'hatch', at: 2.7},
  }},
  {t: 'Headline', at: 'never in the same room', near: 436.1, g: 'paper', lines: ['The data is real.', 'It’s just *never in the room*', 'with the doctor.']},
  {t: 'Triptych', at: 'medical textbook', near: 446.3, g: 'navy', title: 'One textbook, *every chapter in a different library*', cols: [
    {icon: 'book', head: 'Chapter 1', sub: 'a clinic cabinet', at: 0.5},
    {icon: 'book', head: 'Chapter 2', sub: 'a provincial server', at: 1.2},
    {icon: 'book', head: 'Chapter 3', sub: 'a scheme’s claims database', at: 1.9, accent: true},
  ]},

  {t: 'Headline', at: 'break number two', near: 453.9, g: 'ink', kicker: 'Break 02', lines: ['An *identity* crisis.'], size: 130, hlAt: 'identity crisis'},
  {t: 'Bars', at: 'total population of 62 million', near: 470.2, g: 'ink', title: 'More records than people', max: 70, bars: [
    {label: 'Population', value: 62, display: '62M', at: '62 million'},
    {label: 'HPRS patient records', value: 68, display: '68M', at: '68 million', accent: true},
    {label: 'Verified with Home Affairs', value: 32.5, display: '32.5M', at: '32.5'},
  ], refLine: {value: 62, label: 'POPULATION', at: '6 million more'}, source: 'Stats SA Census 2022 · NDoH (2025)'},
  {t: 'Stat', at: '6 million more digital ghosts', near: 481.2, g: 'ink', value: 6, suffix: 'M', label: 'more records than people', countAt: '6 million'},
  {t: 'Duplicate', at: 'forgets to bring her ID', near: 501.3, g: 'ink', title: 'One person, *several records*', records: [
    {text: 'NOMSA  ·  ID ••••••••', at: 0.3},
    {text: 'NOMSSA  ·  no ID', at: 'spells'},
    {text: 'NOMSA  ·  new HPRN', at: 'brand new'},
  ]},
  {t: 'Triptych', at: 'ghost A', near: 518.1, g: 'ink', title: 'The dangerous blind spot', cols: [
    {icon: 'person', head: 'Record A', sub: 'what the doctor sees', at: 0.3},
    {icon: 'alert', head: 'Record B', sub: 'a severe reaction to anaesthesia', at: 'Ghost B', accent: true},
  ]},

  {t: 'Headline', at: 'break number three', near: 534.3, g: 'ink', kicker: 'Break 03', lines: ['Copied *by hand*.'], size: 130, hlAt: 'manual transcription'},
  {t: 'Chain', at: 'transcribed three separate times', near: 545.6, g: 'ink', steps: [
    {icon: 'printer', label: 'Printed', kind: 'physical', at: 'printed'},
    {icon: 'pen', label: 'Handwritten', kind: 'physical', at: 'handwritten'},
    {icon: 'keyboard', label: 'Typed into TIER.Net', kind: 'digital', at: 'keystroked'},
  ]},
  {t: 'List', at: 'a dropped zero', near: 570.5, g: 'ink', numbered: false, items: [
    {text: 'A dropped zero', at: 'dropped zero'},
    {text: 'A transposed digit', at: 'transposed'},
    {text: 'A misread decimal point', at: 'decimal'},
  ]},
  {t: 'Quote', at: 'peer-reviewed research', near: 578.9, g: 'ink', text: 'Patient outcomes were *misreported* in the national HIV treatment database.', attr: 'PMC7154050 — study of TIER.Net', hlAt: 'misreported'},
  {t: 'Split', at: 'failing treatment regimen', near: 596.4, g: 'ink', left: {title: 'Failing', sub: '…can look successful'}, right: {title: 'Healthy', sub: '…can look critically ill'}, rightAt: 'perfectly healthy'},

  {t: 'Headline', at: 'break number four', near: 604.9, g: 'ink', kicker: 'Break 04', lines: ['Paper is a single', '*point of failure*.'], size: 110, hlAt: 'single point'},
  {t: 'Flow', at: 'Johannesburg clinic', near: 622.3, g: 'ink', dashed: true, nodes: [
    {icon: 'folder', label: 'Folder in Johannesburg', at: 0},
    {icon: 'x', label: 'No network', at: 'lacks a network', accent: true},
    {icon: 'hospital', label: 'ER in Pretoria', at: 'Pretoria'},
  ]},
  {t: 'Triptych', at: 'misfiled in the wrong cabinet', near: 633.5, g: 'ink', title: 'Paper is vulnerable', cols: [
    {icon: 'folder', head: 'Misfiled', at: 'misfiled'},
    {icon: 'drop', head: 'Water-damaged', at: 'leaking roof'},
    {icon: 'x', head: 'Lost in transit', at: 'lost in transit', accent: true},
  ]},
  {t: 'Folder', at: 'cannot locate her folder', near: 644.3, g: 'ink', lines: [], caption: 'Her history *vanishes*', captionAt: 'vanishes', stamp: {text: 'NOT FOUND', at: 'cannot locate'}},

  {t: 'Headline', at: 'break number five', near: 659.9, g: 'ink', kicker: 'Break 05', lines: ['A provincial', '*patchwork*.'], size: 130, hlAt: 'provincial patchwork'},
  {t: 'Triptych', at: 'SAP does not natively', near: 676.3, g: 'ink', title: 'Systems that don’t talk', cols: [
    {icon: 'db', head: 'SAP ≠ Meditech', at: 'SAP'},
    {icon: 'db', head: 'Clinicom ≠ eHealth', at: 'Clinicom'},
    {icon: 'x', head: 'Isolated', at: 'completely isolated', accent: true},
  ]},
  {t: 'MapBeat', at: 'four remaining provinces', near: 686.7, g: 'ink', title: 'Four provinces: *zero*', note: 'No hospital patient-information or EMR system — parliamentary reply, 1 Aug 2025', noteAt: 'zero hospital', prov: {
    Mpumalanga: {state: 'hatch', at: 'Mpumulanga', label: 'MP'}, 'North West': {state: 'hatch', at: 'Northwest', label: 'NW'}, Limpopo: {state: 'hatch', at: 'Limpopo', label: 'LP'}, 'Northern Cape': {state: 'hatch', at: 'Northern Cape', label: 'NC'},
  }},
  {t: 'Headline', at: 'complete digital blackout', near: 712, g: 'ink', lines: ['A digital *blackout*,', 'set by a provincial border.'], hlAt: 'blackout'},

  {t: 'Headline', at: 'break number six', near: 721.9, g: 'ink', kicker: 'Break 06', lines: ['The wrong kind', 'of *data*.'], size: 130, hlAt: 'wrong type'},
  {t: 'Headline', at: 'aggregates and totals', near: 741.5, g: 'navy', kicker: 'DHIS2', lines: ['“50 people were treated for asthma.”', 'But *which* 50?'], size: 80},
  {t: 'Headline', at: 'money, not medicine', near: 770.1, g: 'ink', lines: ['Money,', 'not *medicine*.'], size: 150},
  {t: 'Triptych', at: 'ICD-10 code tells the insurer', near: 774, g: 'ink', title: 'An ICD-10 code can’t tell you…', cols: [
    {icon: 'heart', head: 'How severe the wheezing was', at: 'severe'},
    {icon: 'chart', head: 'Lung function results', at: 'lung function'},
    {icon: 'person', head: 'What she said', at: 'what she said', accent: true},
  ]},
  {t: 'Headline', at: 'not built to facilitate clinical continuity', near: 789.8, g: 'paper', lines: ['Built for *management*.', 'Not for continuity of care.']},

  {t: 'Headline', at: 'break number seven', near: 795.8, g: 'ink', kicker: 'Break 07', lines: ['The wall between', '*the sectors*.'], size: 120, hlAt: 'hard wall'},
  {t: 'Wall', at: 'two highways that never intersect', near: 804.6, g: 'ink', left: ['Clinic systems', 'Public labs', 'Provincial HIS'], right: ['Hospital groups', 'Private labs', 'Medical schemes'], wallAt: 0, walkAt: 'move back and forth'},
  {t: 'Headline', at: 'no single doctor', near: 836.4, g: 'ink', lines: ['No single doctor sees', 'the *whole picture*.'], hlAt: 'complete integrated'},

  // ------------------------------------------------------------ close
  {t: 'Headline', at: 'what does this all actually mean', near: 844, g: 'navy', lines: ['Not one ghost.', '*Many*.'], serif: true, size: 140, align: 'center', hlAt: 'she’s many'},
  {t: 'Headline', at: 'the data isn’t missing', near: 874.8, g: 'ink', lines: ['The data isn’t *missing*.', 'It’s created at every visit.'], size: 100, hlAt: 'missing'},
  {t: 'Headline', at: 'it just doesn’t travel', near: 884, g: 'paper', lines: ['It just doesn’t', '*travel with the patient*.'], size: 110, hlAt: 'travel'},
  {t: 'Headline', at: 'trapped within the architecture', near: 886.9, g: 'ink', lines: ['Trapped in the', 'architecture that *created it*.']},
  {t: 'Headline', at: 'artificial intelligence', near: 894.7, g: 'navy', kicker: 'The question', lines: ['AI, predictive algorithms,', 'digital medicine…'], subtitle: '…built on data trapped on receipt paper and offline computers?'},
  {t: 'Headline', at: 'data cannot speak to itself', near: 917.7, g: 'ink', lines: ['What happens when data', '*cannot speak to itself*?'], size: 96},
  {t: 'Triptych', at: 'simultaneously brilliant', near: 937.7, g: 'paper', title: 'A paradox', cols: [
    {icon: 'check', head: 'Brilliant', at: 'brilliant'},
    {icon: 'globe', head: 'Massive in scale', at: 'massive'},
    {icon: 'alert', head: 'Fundamentally fractured', at: 'fractured', accent: true},
  ]},
  {t: 'Headline', at: 'thank you so much', near: 954.3, g: 'ink', lines: ['How patient data moves', 'through South African', '*healthcare*'], size: 96, subtitle: 'Sources: research/RESEARCH.md'},
];
