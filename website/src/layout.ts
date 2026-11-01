import { NODES } from './data/nodes'
import { LAYERS, SECTORS, PROV_DATA } from './data/meta'
import type { SysNode } from './types'

export interface Pos { x: number; y: number; visible: boolean }
export interface Row { id: string; name: string; y: number; h: number }
export interface Col { x: number; w: number; id: string; name: string; sub: string; color: string }
export interface LayoutResult { pos: Record<string, Pos>; height: number; rows: Row[]; cols: Col[]; note?: { x: number; y: number; w: number } }
export interface LayoutOpts { W: number; view: 'landscape' | 'sim' | 'journey'; simple: boolean; prov: string; jnodes: Set<string> | null }

export const CHAPTERS = [
  { id: 'care', name: 'Care delivery', layers: ['phc', 'hospital', 'programme', 'emergency'] },
  { id: 'identity', name: 'People & registries', layers: ['identity', 'registry'] },
  { id: 'labs', name: 'Labs & medicines', layers: ['lab', 'pharmacy'] },
  { id: 'money', name: 'Money & standards', layers: ['money', 'integration', 'standards'] },
  { id: 'all', name: 'Everything', layers: [] as string[] },
] as const
export type ChapterId = (typeof CHAPTERS)[number]['id']

export function isVisible(n: SysNode, o: LayoutOpts): boolean {
  if (o.view === 'sim') return true
  if (o.view === 'journey') return !!o.jnodes?.has(n.id)
  if (o.prov !== 'all' && n.provs && !n.provs.includes(o.prov)) return false
  return o.simple ? !!n.core : true
}

export function layoutLandscape(o: LayoutOpts): LayoutResult {
  const top = 10, pitch = 130, baseH = 106
  const colW = o.W / SECTORS.length
  const cap = Math.max(1, Math.floor(colW / pitch))
  const vis = NODES.filter((n) => isVisible(n, o))
  const provNone = o.view === 'landscape' && o.prov !== 'all' && PROV_DATA[o.prov]?.none
  const rows: Row[] = []
  let y = top
  for (const L of LAYERS) {
    const here = vis.filter((n) => n.layer === L.id)
    if (!here.length && !(L.id === 'hospital' && provNone)) continue
    let sub = 1
    for (const S of SECTORS) sub = Math.max(sub, Math.ceil(here.filter((n) => n.sector === S.id).length / cap))
    rows.push({ id: L.id, name: L.name, y, h: sub * baseH })
    y += sub * baseH
  }
  const cols: Col[] = SECTORS.map((s, i) => ({ x: i * colW, w: colW, id: s.id, name: s.name, sub: s.sub, color: s.color }))
  const pos: Record<string, Pos> = {}
  for (const n of NODES) pos[n.id] = { x: 0, y: 0, visible: false }
  for (const r of rows) {
    SECTORS.forEach((S, si) => {
      const cell = vis.filter((n) => n.layer === r.id && n.sector === S.id)
      cell.forEach((n, k) => {
        const sr = Math.floor(k / cap), m = Math.min(cap, cell.length - sr * cap), ci = k % cap
        const li = LAYERS.findIndex((l) => l.id === r.id)
        const jit = cell.length === 1 ? ((li % 3) - 1) * colW * 0.14 : 0
        pos[n.id] = { x: si * colW + (colW * (ci + 0.5)) / m + jit, y: r.y + sr * baseH + 34, visible: true }
      })
    })
  }
  let note: LayoutResult['note']
  if (provNone) { const hr = rows.find((r) => r.id === 'hospital')!; note = { x: 10, y: hr.y + 20, w: colW - 20 } }
  return { pos, height: y + 12, rows, cols, note }
}
