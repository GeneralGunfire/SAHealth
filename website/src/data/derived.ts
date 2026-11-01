// Everything here is computed from the existing data files. Nothing in this module adds a fact.
import { NODES, BY_ID } from './nodes'
import { EDGES, JOURNEYS } from './flows'
import { LAYERS, SECTORS, PROVINCES, PROV_DATA, SOURCES, LAYER_NAME, SECTOR, LINK_LABEL } from './meta'
import type { Edge, Journey, SysNode } from '../types'

/* ---------- connections ---------- */
export const edgeBetween = (a: string, b: string): Edge | undefined =>
  EDGES.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))
export const edgesOf = (id: string) => EDGES.filter((e) => e.a === id || e.b === id)

/** Direction is only known where a journey step records it. Otherwise the research lists the link without a direction. */
export function directionOf(a: string, b: string): { from: string; to: string; journey: Journey } | null {
  for (const j of JOURNEYS) {
    for (const s of j.steps) {
      if (s.k !== 'break' && ((s.f === a && s.t === b) || (s.f === b && s.t === a))) return { from: s.f, to: s.t, journey: j }
    }
  }
  return null
}

export const journeysOf = (id: string): Journey[] => JOURNEYS.filter((j) => j.steps.some((s) => s.f === id || s.t === id))
export const journeyNodeIds = (j: Journey): string[] => {
  const o: string[] = []
  j.steps.forEach((s) => [s.f, s.t].forEach((id) => { if (!o.includes(id)) o.push(id) }))
  return o
}
export const provinceSystems = (p: string): SysNode[] => NODES.filter((n) => n.provs?.includes(p))
export const provinceJourneys = (p: string): Journey[] => {
  const ids = new Set(provinceSystems(p).map((n) => n.id))
  return JOURNEYS.filter((j) => j.steps.some((s) => ids.has(s.f) || ids.has(s.t)))
}

/* ---------- sources ---------- */
const HOST_CAT: Record<string, string> = {
  'pmg.org.za': 'Parliament',
  'health.gov.za': 'Government and public bodies', 'knowledgehub.health.gov.za': 'Government and public bodies', 'sanews.gov.za': 'Government and public bodies',
  'medicalschemes.co.za': 'Government and public bodies', 'nhls.ac.za': 'Government and public bodies', 'sanbs-integrated-report.sanbs.org.za': 'Government and public bodies',
  'pmc.ncbi.nlm.nih.gov': 'Academic and clinical journals', 'pubmed.ncbi.nlm.nih.gov': 'Academic and clinical journals', 'ncbi.nlm.nih.gov': 'Academic and clinical journals',
  'ijpds.org': 'Academic and clinical journals', 'sajim.co.za': 'Academic and clinical journals',
  'citizen.co.za': 'News and press', 'theherald.co.za': 'News and press', 'medicalbrief.co.za': 'News and press', 'sabcnews.com': 'News and press', 'itweb.co.za': 'News and press',
  'thepost.co.za': 'News and press', 'mynewsdesk.com': 'News and press', 'intelligentcio.com': 'News and press', 'esgtoday.com': 'News and press', 'pulse.bot': 'News and press',
  'phisc.net': 'Standards bodies and references', 'ohie.org': 'Standards bodies and references', 'wiki.ohie.org': 'Standards bodies and references',
  'forums.snomed.org': 'Standards bodies and references', 'en.wikipedia.org': 'Standards bodies and references', 'popia.co.za': 'Standards bodies and references', 'bowmanslaw.com': 'Standards bodies and references',
  'theglobalfund.org': 'Funders and NGOs', 'ghsupplychain.org': 'Funders and NGOs', 'ahri.org': 'Funders and NGOs', 'aidsoffice.sacbc.org.za': 'Funders and NGOs', 'mpumalanga.da.org.za': 'Funders and NGOs',
}
export const SOURCE_CATEGORIES = ['Parliament', 'Government and public bodies', 'Academic and clinical journals', 'News and press', 'Standards bodies and references', 'Funders and NGOs', 'Companies and vendors'] as const
export function sourceCategory(url: string): string {
  try {
    const h = new URL(url).hostname.replace(/^www\d?\./, '')
    return HOST_CAT[h] ?? 'Companies and vendors'
  } catch { return 'Companies and vendors' }
}
export const sourceHost = (url: string) => { try { return new URL(url).hostname.replace(/^www\d?\./, '') } catch { return url } }

export interface SourceUse { nodes: SysNode[]; provinces: string[] }
export const SOURCE_USE: Record<string, SourceUse> = (() => {
  const m: Record<string, SourceUse> = {}
  SOURCES.forEach((s) => { m[s.id] = { nodes: [], provinces: [] } })
  NODES.forEach((n) => n.src.forEach((s) => m[s]?.nodes.push(n)))
  PROVINCES.forEach((p) => PROV_DATA[p].src.forEach((s) => m[s]?.provinces.push(p)))
  return m
})()

/* ---------- glossary ---------- */
export interface Term { term: string; plain: string; kind: 'researched' | 'general'; nodeId?: string; src: string[] }
const first = (s: string) => s.split(/(?<=\.)\s/)[0]
/** General definitions for terms the site uses. They describe the technology, not South African facts, so they carry no source. */
const GENERAL: [string, string][] = [
  ['EMR', 'Electronic medical record. A patient’s clinical record kept on a computer system instead of paper.'],
  ['FHIR', 'Fast Healthcare Interoperability Resources. A modern international standard for sharing health records between systems.'],
  ['HL7', 'Health Level Seven. An older family of international standards for sending health messages between systems.'],
  ['EDIFACT', 'A long-standing format for exchanging business messages between computers. Medical claims messages use it.'],
  ['PACS', 'Picture archiving and communication system. Stores medical images such as X-rays so they can be viewed on screen.'],
  ['NHI', 'National Health Insurance. The planned national funding scheme for health care.'],
  ['SITA', 'State Information Technology Agency. The government body that buys and runs IT services for departments.'],
]
export const GLOSSARY: Term[] = (() => {
  const t: Term[] = NODES.filter((n) => n.alias && !['varies', 'administrators', 'clinic record'].includes(n.alias) && !n.alias.startsWith('e.g.')).map((n) => ({
    term: n.alias!, plain: `${n.name}. ${first(n.summary)}`, kind: 'researched', nodeId: n.id, src: n.src,
  }))
  // A general definition is skipped when a system already uses the same short name, so no term appears twice.
  GENERAL.forEach(([term, plain]) => { if (!t.some((x) => x.term === term)) t.push({ term, plain, kind: 'general', src: [] }) })
  return t.sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }))
})()
/** Short plain-language gloss for a term, used in tooltips. */
export const GLOSS_TIP: Record<string, string> = Object.fromEntries(GENERAL.map(([k, v]) => [k, v]))
NODES.forEach((n) => { if (n.alias && !GLOSS_TIP[n.alias]) GLOSS_TIP[n.alias] = n.name })

/* ---------- search index ---------- */
export type HitKind = 'system' | 'journey' | 'province' | 'source' | 'connection' | 'layer' | 'sector' | 'term'
export interface Hit { kind: HitKind; id: string; title: string; sub: string; hay: string; weight: number; extra?: string; score?: number; alias?: string }
const low = (...s: (string | undefined)[]) => s.filter(Boolean).join(' ¦ ').toLowerCase()
export const SEARCH_INDEX: Hit[] = (() => {
  const h: Hit[] = []
  NODES.forEach((n) => h.push({ kind: 'system', id: n.id, title: n.name, sub: [n.alias, LAYER_NAME[n.layer], SECTOR[n.sector].name].filter(Boolean).join(' · '), hay: low(n.name, n.alias, n.id, n.who, n.summary, LAYER_NAME[n.layer], SECTOR[n.sector].name), weight: n.core ? 3 : 2, alias: n.alias }))
  JOURNEYS.forEach((j) => h.push({ kind: 'journey', id: j.id, title: j.title, sub: j.intro, hay: low(j.title, j.intro, ...j.steps.map((s) => s.h + ' ' + s.lbl + ' ' + BY_ID[s.f].name + ' ' + BY_ID[s.t].name + ' ' + (BY_ID[s.f].alias ?? '') + ' ' + (BY_ID[s.t].alias ?? ''))), weight: 2 }))
  PROVINCES.forEach((p) => { const d = PROV_DATA[p]; h.push({ kind: 'province', id: p, title: p, sub: short(d.hosp ?? 'No hospital record system reported'), hay: low(p, d.hosp ?? undefined, d.phc, d.dc ?? undefined, d.hprs, d.other), weight: 2 }) })
  SOURCES.forEach((s) => h.push({ kind: 'source', id: s.id, title: s.title, sub: `${s.id} · ${sourceHost(s.url)}`, hay: low(s.title, s.id, s.url), weight: 1 }))
  EDGES.forEach((e) => h.push({ kind: 'connection', id: e.a + '|' + e.b, title: `${BY_ID[e.a].name} ↔ ${BY_ID[e.b].name}`, sub: `${LINK_LABEL[e.type]} · ${e.what}`, hay: low(e.what, BY_ID[e.a].name, BY_ID[e.b].name, BY_ID[e.a].alias, BY_ID[e.b].alias, LINK_LABEL[e.type]), weight: 1 }))
  LAYERS.forEach((l) => h.push({ kind: 'layer', id: l.id, title: l.name, sub: `${NODES.filter((n) => n.layer === l.id).length} systems`, hay: low(l.name, l.id), weight: 1 }))
  SECTORS.forEach((s) => h.push({ kind: 'sector', id: s.id, title: s.name, sub: s.sub, hay: low(s.name, s.sub, s.id), weight: 1 }))
  GLOSSARY.forEach((g) => h.push({ kind: 'term', id: g.term, title: g.term, sub: g.plain, hay: low(g.term, g.plain), weight: 1 }))
  return h
})()
function short(s: string) { return s.length > 90 ? s.slice(0, 88) + '…' : s }

export function search(q: string, limit = 40): Hit[] {
  const t = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!t.length) return []
  const out: { h: Hit; s: number }[] = []
  for (const h of SEARCH_INDEX) {
    if (!t.every((w) => h.hay.includes(w))) continue
    const title = h.title.toLowerCase(), sub = h.sub.toLowerCase(), al = (h.alias ?? '').toLowerCase()
    let s = h.weight
    for (const w of t) {
      // a short name such as HPRS counts as the system's own name
      if (al === w) s += 15
      else if (al && al.startsWith(w)) s += 8
      else if (al && al.includes(w)) s += 5
      if (title === w) s += 12
      else if (title.startsWith(w)) s += 7
      else if (title.includes(w)) s += 5
      else if (sub.includes(w)) s += 2
    }
    out.push({ h, s })
  }
  return out.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => ({ ...x.h, score: x.s }))
}
