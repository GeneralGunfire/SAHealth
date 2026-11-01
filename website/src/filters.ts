import type { Confidence, Status, SysNode } from './types'

/** Landscape filters. Layers, sectors, status and confidence hide systems. The text search and key highlight only dim them. */
export interface Filters { layers: string[]; sectors: string[]; status: Status[]; conf: Confidence[]; q: string; hlKey: boolean }
export const EMPTY_FILTERS: Filters = { layers: [], sectors: [], status: [], conf: [], q: '', hlKey: false }

export const activeCount = (f: Filters) => f.layers.length + f.sectors.length + f.status.length + f.conf.length + (f.q.trim() ? 1 : 0) + (f.hlKey ? 1 : 0)
export const isEmpty = (f: Filters) => activeCount(f) === 0

/** True when a system passes the hiding filters. An empty list means "no restriction". */
export const passes = (n: SysNode, f: Filters) =>
  (!f.layers.length || f.layers.includes(n.layer)) &&
  (!f.sectors.length || f.sectors.includes(n.sector)) &&
  (!f.status.length || f.status.includes(n.status)) &&
  (!f.conf.length || f.conf.includes(n.conf))

export const textMatch = (n: SysNode, q: string) => {
  const t = q.toLowerCase().trim()
  if (!t) return true
  const hay = `${n.name} ${n.alias ?? ''} ${n.id} ${n.who ?? ''}`.toLowerCase()
  return t.split(/\s+/).every((w) => hay.includes(w))
}

export const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
