import type { Edge, Journey } from '../types'

const E = (a: string, b: string, type: Edge['type'], what: string): Edge => ({ a, b, type, what })

// Only connections supported by the research brief or by well-known standard practice.
export const EDGES: Edge[] = [
  E('hprs', 'dha', 'live', 'Identity verification'),
  E('hprs', 'hms2', 'live', 'Patient reference number'),
  E('hprs', 'paper', 'manual', 'Number written on the folder'),
  E('paper', 'tier', 'manual', 'Data capturers retype from the folder'),
  E('paper', 'nhls', 'manual', 'Sample sent, result written back by hand'),
  E('nhls', 'tier', 'manual', 'Results retyped by capturers'),
  E('paper', 'dhis2', 'manual', 'Tick registers totalled monthly'),
  E('tier', 'dhis2', 'batch', 'Monthly totals'),
  E('mfl', 'dhis2', 'live', 'Facility codes'),
  E('clinicom', 'phdc', 'live', 'Hospital events'),
  E('nhls', 'phdc', 'live', 'Lab results'),
  E('tier', 'phdc', 'batch', 'Register extract'),
  E('phcis', 'phdc', 'live', 'Clinic events'),
  E('muni', 'phdc', 'live', 'City clinic events'),
  E('paper', 'clinicom', 'manual', 'Paper referral letter'),
  E('paper', 'hms2', 'manual', 'Paper referral letter'),
  E('paper', 'ehealth', 'manual', 'Paper referral letter'),
  E('paper', 'gphis', 'manual', 'Paper referral letter'),
  E('ccmdd', 'tier', 'manual', 'Referrals entered by capturers'),
  E('goodx', 'switch', 'live', 'Claims'),
  E('careon', 'switch', 'live', 'Claims'),
  E('retailph', 'switch', 'live', 'Claims in real time'),
  E('switch', 'scheme', 'live', 'Claims'),
  E('scheme', 'healthid', 'batch', 'Claims history'),
  E('pathlab', 'healthid', 'batch', 'Pathology results'),
  E('pathlab', 'goodx', 'live', 'Results portal'),
  E('medclm', 'switch', 'live', 'Message format'),
  E('icd10', 'switch', 'live', 'Diagnosis codes'),
  E('icd10', 'scheme', 'live', 'Diagnosis codes'),
  E('nappi', 'switch', 'live', 'Product codes'),
  E('cms', 'scheme', 'live', 'Scheme register'),
  E('careconnect', 'careon', 'live', 'Hospital group records'),
  E('careconnect', 'scheme', 'live', 'Funder data'),
  E('careconnect', 'goodx', 'live', 'Practice records (first practice application joined Dec 2024)'),
  E('hms2', 'nhls', 'live', 'Lab requests and results (about 27 million integrated, Eastern Cape)'),
  E('careon', 'pathlab', 'live', 'Orders and results inside the group'),
  E('bluebird', 'pathlab', 'live', 'Results routed to doctors (vendor claim)'),
  E('ccmdd', 'retailph', 'batch', 'Parcels to external pick-up points'),
  E('paper', 'phis', 'manual', 'Paper referral letter'),
  E('ngoclinic', 'tier', 'manual', 'Funded capturers type records into TIER.Net'),
  E('ems', 'hms2', 'manual', 'Verbal handover, paper form'),
  E('ems', 'gphis', 'manual', 'Verbal handover, paper form'),
]

const S = (f: string, t: string, k: Journey['steps'][number]['k'], h: string, p: string, lbl = '') => ({ f, t, k, h, p, lbl })

export const GROUPS = {
  public: { name: 'Public', sub: 'clinics & hospitals', color: '#86A3BD' },
  private: { name: 'Private', sub: 'practices & hospital groups', color: '#E5865F' },
  cross: { name: 'Across both', sub: 'public and private', color: '#D3CCBC' },
} as const

// Simplified from published sources; refined in the research pass.
export const JOURNEYS: Journey[] = [
  { id: 'lab', g: 'public', title: 'Lab result at an HIV clinic', intro: 'Follow one blood test through the public system.', steps: [
    S('hprs', 'paper', 'manual', 'She is registered', 'Her ID number is looked up in the patient registry, and the registration number is written on a paper folder.', 'ID number'),
    S('paper', 'nhls', 'manual', 'Blood goes to the lab', 'The sample travels to the public lab and is logged in the lab’s own system.', 'sample'),
    S('nhls', 'paper', 'manual', 'The result comes back', 'It reaches the clinic by web viewer or a small SMS printer. A nurse writes it into the folder by hand.', 'result'),
    S('paper', 'tier', 'manual', 'A capturer retypes it', 'For HIV patients a data capturer types the same result into the treatment register. That is a third copy.', 'retyped'),
    S('tier', 'dhis2', 'batch', 'It becomes a monthly total', 'The register is summed into reporting totals. The result survives only as a count, with no name.', 'count'),
    S('paper', 'hms2', 'break', 'She is referred to a hospital', 'The folder’s contents do not reach the hospital system. Where a hospital system exists, it may pull her lab results from NHLS (the Eastern Cape does), but the clinic notes still travel as a paper letter.'),
  ] },
  { id: 'meds', g: 'public', title: 'Repeat medicine pick-up', intro: 'How a stable patient collects chronic medicine near home.', steps: [
    S('paper', 'ccmdd', 'manual', 'She is enrolled for pick-up', 'The clinic enrols her on the national CCMDD platform (SyNCH). More than 3.7 million patients are enrolled.', 'enrolment'),
    S('ccmdd', 'retailph', 'batch', 'A parcel goes to a pick-up point', 'The parcel is sent to one of about 3,000 external pick-up points, most of them private pharmacies. She collects it with an SMS code.', 'parcel'),
    S('ccmdd', 'tier', 'manual', 'The referral is typed into the register', 'For HIV patients, data capturers enter the CCMDD referral into the treatment register by hand.', 'referral'),
    S('ccmdd', 'svs', 'break', 'Stock is tracked, not patients', 'The stock tracker shows whether medicine is on the shelf. It holds no patient histories.'),
  ] },
  { id: 'ambulance', g: 'public', title: 'Ambulance to an Eastern Cape hospital', intro: 'What travels with a patient in an emergency, in a province that has a hospital system.', steps: [
    S('ems', 'hms2', 'manual', 'Handover at the door', 'Paramedics hand over verbally using a standard structure (DeMIST), then leave the paper patient report form behind.', 'handover'),
    S('hms2', 'nhls', 'live', 'Blood tests are requested on screen', 'The hospital system prints barcoded labels and sends the request to the national lab. This link is electronic.', 'request'),
    S('nhls', 'hms2', 'live', 'Results come straight back', 'The Eastern Cape system pulls lab results from the national lab (about 27 million have been integrated). The doctor sees them without anyone retyping them.', 'results'),
    S('hms2', 'sanbs', 'manual', 'Blood is requested', 'A blood request goes to the blood service. No hospital-facing ordering interface is documented, and each blood service keeps its own system.', 'request'),
    S('hms2', 'paper', 'break', 'Her clinic never sees the notes', 'Hospital notes do not flow back to her clinic folder. Outside the Eastern Cape the lab link above often does not exist.'),
  ] },
  { id: 'referral', g: 'public', title: 'Clinic referral to hospital', intro: 'A referral, and what happens if she moves province.', steps: [
    S('hprs', 'paper', 'manual', 'She is registered', 'Her registration number is written on the folder.', 'ID number'),
    S('paper', 'hms2', 'manual', 'A paper letter travels with her', 'What physically moves is a referral letter that the patient carries herself.', 'letter'),
    S('hms2', 'ehealth', 'break', 'If she moves province, nothing follows', 'Each province runs a different hospital system. Nothing moves between them.'),
  ] },
  { id: 'gp', g: 'private', title: 'GP visit and claim', intro: 'The one place where private data does flow end to end.', steps: [
    S('goodx', 'switch', 'live', 'The practice sends a claim', 'Every consultation produces an electronic claim with a diagnosis code.', 'claim'),
    S('switch', 'scheme', 'live', 'The claim reaches her scheme', 'The switch routes it to the scheme administrator, in real time for many providers.', 'claim'),
    S('scheme', 'healthid', 'batch', 'Claims become a history', 'Over time, claims form the most complete record of private care. It is billing data, not clinical notes.', 'history'),
    S('healthid', 'hms2', 'break', 'A public doctor cannot see it', 'The claims history is not visible to public hospitals.'),
  ] },
  { id: 'privlab', g: 'private', title: 'Private lab result', intro: 'A test ordered by a private doctor.', steps: [
    S('goodx', 'pathlab', 'live', 'The doctor orders a test', 'The order goes to a private lab.', 'order'),
    S('pathlab', 'goodx', 'live', 'The result is on a portal', 'Each lab has its own doctor portal or app.', 'result'),
    S('pathlab', 'healthid', 'batch', 'It also enriches the claims history', 'Pathology results can feed the scheme’s patient view.', 'result'),
    S('pathlab', 'nhls', 'break', 'Public and private labs do not share', 'A public doctor cannot see this result.'),
  ] },
  { id: 'privhosp', g: 'private', title: 'Private hospital stay', intro: 'A group-wide record that still stops at the group’s edge.', steps: [
    S('careon', 'switch', 'live', 'The hospital sends its claim', 'The hospital bills through the same switch network.', 'claim'),
    S('switch', 'scheme', 'live', 'The scheme is billed', 'The claim carries codes and amounts, not clinical notes.', 'claim'),
    S('careon', 'goodx', 'break', 'Her own GP never sees the notes', 'The hospital record serves that group only, and the specialists inside are independent practices.'),
  ] },
  { id: 'pharmacy', g: 'private', title: 'Pharmacy dispensing', intro: 'A prescription filled at a retail pharmacy.', steps: [
    S('goodx', 'retailph', 'manual', 'The script reaches the pharmacy', 'The patient carries the prescription.', 'script'),
    S('retailph', 'switch', 'live', 'The pharmacy claims in real time', 'Product codes go with the claim.', 'claim'),
    S('switch', 'scheme', 'live', 'The scheme pays', 'Billing data only.', 'claim'),
    S('retailph', 'goodx', 'break', 'Her GP never sees what was dispensed', 'Nothing flows back to the prescriber.'),
  ] },
  { id: 'cross', g: 'cross', title: 'From public clinic to private doctor', intro: 'The hard wall between the two sectors.', steps: [
    S('paper', 'goodx', 'manual', 'She carries a letter', 'A paper letter is the only link between the two sectors.', 'letter'),
    S('goodx', 'switch', 'live', 'Private care becomes a claim', 'The private side now has its own data trail.', 'claim'),
    S('switch', 'scheme', 'live', 'The scheme records it', 'Billing data in a different system.', 'claim'),
    S('scheme', 'paper', 'break', 'The public clinic never sees any of it', 'The public folder is unchanged by everything on the private side.'),
  ] },
  { id: 'antenatal', g: 'public', title: 'Pregnancy and delivery', intro: 'A woman is registered, texted, transferred and counted.', steps: [
    S('hprs', 'paper', 'manual', 'She is registered at the clinic', 'Her ID number is looked up and her registration number is written on the folder and on her Maternity Case Record.', 'ID number'),
    S('paper', 'momconnect', 'live', 'She joins MomConnect', 'Registering at a public facility signs her up for free pregnancy messages and a helpdesk. The programme uses the OpenHIM integration engine.', 'sign-up'),
    S('paper', 'hms2', 'manual', 'The Maternity Case Record travels with her', 'If she is transferred to a hospital, the paper record must travel with her. That is the only link.', 'record'),
    S('paper', 'dhis2', 'manual', 'The birth becomes a tick and a total', 'Staff tick a paper register, totals go onto a monthly form and are captured into the national reporting system. It holds counts, not names.', 'tick'),
    S('hms2', 'paper', 'break', 'The hospital notes stay at the hospital', 'Nothing flows back to the clinic folder automatically.'),
  ] },
  { id: 'wcape', g: 'public', title: 'The Western Cape: the one joined-up province', intro: 'Where public data does come together, and where it stops.', steps: [
    S('phcis', 'phdc', 'live', 'A clinic visit is recorded', 'The Western Cape’s clinic system sends visit data to the provincial data centre, usually daily.', 'clinic'),
    S('clinicom', 'phdc', 'live', 'A hospital stay is recorded', 'The hospital system feeds the same data centre. The hospital folder number is the patient index that links the sources.', 'hospital'),
    S('nhls', 'phdc', 'live', 'Lab results are added', 'Results from the public lab arrive in the same place (a file feed in the early set-up).', 'lab'),
    S('tier', 'phdc', 'batch', 'The HIV register is added', 'The treatment register is an extract source, so the HIV record sits beside the rest.', 'register'),
    S('phdc', 'clinicom', 'live', 'A doctor opens the Single Patient Viewer', 'About 8 million people are covered. A clinician can see one patient’s clinic, hospital, lab, pharmacy and register data together.', 'viewer'),
    S('phdc', 'hms2', 'break', 'It stops at the provincial border', 'Cross into the Eastern Cape and a different hospital system, with no link to this data centre, takes over.'),
  ] },
  { id: 'echosp', g: 'public', title: 'An Eastern Cape hospital admission', intro: 'An electronic hospital system, and what it still cannot reach.', steps: [
    S('hprs', 'hms2', 'live', 'Identity comes from the registry', 'The hospital system reads her details from the national patient registry through a one-way integration, so she is not re-registered from scratch.', 'identity'),
    S('hms2', 'nhls', 'live', 'Tests are requested electronically', 'Labels are barcoded and requests go to the national lab.', 'request'),
    S('nhls', 'hms2', 'live', 'Results appear in the hospital record', 'Previously requested tests are visible on screen.', 'results'),
    S('hms2', 'paper', 'break', 'The clinic that referred her sees none of it', 'The discharge summary still returns as a paper letter. The Eastern Cape has no provincial data centre like the Western Cape.'),
  ] },
  { id: 'careconnect', g: 'private', title: 'The private health exchange', intro: 'The one place private records are combined, with the patient’s consent.', steps: [
    S('careon', 'careconnect', 'live', 'Hospital groups contribute', 'Netcare, Mediclinic and Life Healthcare are founders. The exchange has run since April 2022 on InterSystems HealthShare.', 'hospital'),
    S('scheme', 'careconnect', 'live', 'Funders contribute', 'Discovery Health, Medscheme and Momentum Health are founders too, so claims-side data joins hospital data.', 'funder'),
    S('goodx', 'careconnect', 'live', 'Practices join', 'Altron HealthTech’s practice software joined in December 2024, the first practice management application on the platform.', 'practice'),
    S('careconnect', 'careon', 'live', 'A clinician sees the combined record', 'About 5.2 million patients had signed up by late 2023. Data is shared only with the patient’s consent.', 'record'),
    S('careconnect', 'hms2', 'break', 'It does not reach the public sector', 'Talks about linking to public systems such as the patient registry and the vaccination system were reported, with no go-live documented.'),
  ] },
]
