import { NODES } from '../data/nodes'
import { EDGES, JOURNEYS } from '../data/flows'
import { LAYER_NAME, PROV_DATA, PROVINCES, SECTOR, SOURCES } from '../data/meta'
import type { Confidence, Edge, Journey, LinkType, Status, SysNode } from '../types'

/* ---------- lookups ---------- */

export const NODE = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, SysNode>
export const JOURNEY = Object.fromEntries(JOURNEYS.map((j) => [j.id, j])) as Record<string, Journey>

export function neighbours(id: string): { other: SysNode; edge: Edge }[] {
  return EDGES.filter((e) => e.a === id || e.b === id)
    .map((e) => ({ other: NODE[e.a === id ? e.b : e.a], edge: e }))
    .filter((x) => !!x.other)
}

export const journeysFor = (id: string) => JOURNEYS.filter((j) => j.steps.some((s) => s.f === id || s.t === id))

export const sectorColor = (n: SysNode) => SECTOR[n.sector].color
export const layerName = (n: SysNode) => LAYER_NAME[n.layer]

/* ---------- labels ---------- */

export const STATUS_LABEL: Record<Status, string> = { live: 'In use', beta: 'Trial (beta)', legacy: 'Legacy', paper: 'Paper' }
export const CONF: Record<Confidence, { label: string; text: string }> = {
  confirmed: { label: 'Confirmed', text: 'Backed by a primary source or several consistent sources.' },
  likely: { label: 'Likely', text: 'One reputable source, or a strong inference from the evidence.' },
  uncertain: { label: 'Uncertain', text: 'A vendor claim, a secondary source, or not independently verified.' },
}
export const LINK_NAME: Record<LinkType | 'break', string> = {
  live: 'Live link', batch: 'Regular batch', manual: 'Retyped or carried by hand', break: 'Where it stops',
}
export const LINK_COLOR: Record<LinkType | 'break', string> = {
  live: '#2f5bff', batch: '#7c9bff', manual: '#c08a1e', break: '#dc2626',
}

/* ---------- gaps: which pairs are connected, and why not ---------- */

export const REASONS = [
  { k: 'paper', t: 'Paper-based', c: '#cfc6ae' },
  { k: 'owners', t: 'Public–private wall', c: '#c4b9d8' },
  { k: 'noid', t: 'No shared patient ID', c: '#b5c3dc' },
  { k: 'std', t: 'Different standards', c: '#b2d0cc' },
  { k: 'mandate', t: 'No mandate or funding', c: '#dcb9b4' },
] as const
export type Reason = (typeof REASONS)[number]

export function pairState(a: string, b: string): LinkType | 'none' {
  const e = EDGES.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))
  return e ? e.type : 'none'
}

export function reasonFor(a: SysNode, b: SysNode): Reason {
  if (a.id === 'paper' || b.id === 'paper' || a.status === 'paper' || b.status === 'paper') return REASONS[0]
  const pp = (a.sector === 'public' && b.sector === 'private') || (a.sector === 'private' && b.sector === 'public')
  if (pp) return REASONS[1]
  if (a.layer === 'standards' || b.layer === 'standards') return REASONS[3]
  const clinical = ['hospital', 'phc', 'lab', 'programme', 'pharmacy', 'emergency']
  if (clinical.includes(a.layer) && clinical.includes(b.layer)) return REASONS[2]
  return REASONS[4]
}

export function gapStats(list: SysNode[]) {
  let total = 0, live = 0, other = 0, none = 0
  const byReason: Record<string, number> = {}
  REASONS.forEach((r) => (byReason[r.k] = 0))
  list.forEach((a, i) => list.forEach((b, j) => {
    if (i >= j) return
    total++
    const st = pairState(a.id, b.id)
    if (st === 'live') live++
    else if (st === 'none') { none++; byReason[reasonFor(a, b).k]++ } else other++
  }))
  return { total, live, other, none, byReason, pct: total ? Math.round((none / total) * 100) : 0 }
}

/* ---------- headline numbers for the overview ---------- */

export function headline() {
  const keyGaps = gapStats(NODES.filter((n) => n.core))
  return {
    systems: NODES.length,
    links: EDGES.length,
    liveLinks: EDGES.filter((e) => e.type === 'live').length,
    noHospital: PROVINCES.filter((p) => PROV_DATA[p].none).length,
    provinces: PROVINCES.length,
    paper: NODES.filter((n) => n.status === 'paper').length,
    keyGapPct: keyGaps.pct,
    keyCount: NODES.filter((n) => n.core).length,
    journeys: JOURNEYS.length,
    sources: SOURCES.length,
  }
}

/* ---------- sources: where each one is used ---------- */

export function sourceUsage() {
  const use: Record<string, { systems: string[]; provinces: string[] }> = {}
  SOURCES.forEach((s) => (use[s.id] = { systems: [], provinces: [] }))
  NODES.forEach((n) => n.src.forEach((id) => use[id]?.systems.push(n.id)))
  PROVINCES.forEach((p) => PROV_DATA[p].src.forEach((id) => use[id]?.provinces.push(p)))
  return use
}

export const confCounts = () => ({
  confirmed: NODES.filter((n) => n.conf === 'confirmed').length,
  likely: NODES.filter((n) => n.conf === 'likely').length,
  uncertain: NODES.filter((n) => n.conf === 'uncertain').length,
})

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
export const provinceFromSlug = (s: string | undefined) => PROVINCES.find((p) => slug(p) === s)
