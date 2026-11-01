import { EDGES } from '../data/flows'
import type { Confidence, SysNode } from '../types'

/** The five reasons a pair of systems is not connected. The letter keeps each one readable without colour. */
export const REASONS = [
  { k: 'paper', t: 'Paper-based', s: 'P', c: '#7a6f4c' },
  { k: 'owners', t: 'Public–private wall', s: 'W', c: '#6e5a85' },
  { k: 'noid', t: 'No shared patient ID', s: 'I', c: '#4f6c8f' },
  { k: 'std', t: 'Different standards', s: 'S', c: '#4d7a78' },
  { k: 'mandate', t: 'No mandate or funding', s: 'M', c: '#94554e' },
] as const
export type ReasonKey = (typeof REASONS)[number]['k']

/** How each category is assigned. These are rules over system attributes, so the category is an interpretation. */
export const RULE_TEXT: Record<ReasonKey, string> = {
  paper: 'Assigned because at least one of the two is a paper record.',
  owners: 'Assigned because one system is public-sector and the other private.',
  noid: 'Assigned because both are clinical or programme systems and the research records no shared patient identifier between them.',
  std: 'Assigned because one of the two is a standard or code set, not a data exchange.',
  mandate: 'Assigned as the remaining category: none of the other four rules applies, and no mandate or funding for a link was found.',
}

export function pairState(a: string, b: string) {
  const e = EDGES.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))
  return e ? e.type : 'none'
}

export function reasonFor(a: SysNode, b: SysNode) {
  if (a.id === 'paper' || b.id === 'paper' || a.status === 'paper' || b.status === 'paper') return REASONS[0]
  const pp = (a.sector === 'public' && b.sector === 'private') || (a.sector === 'private' && b.sector === 'public')
  if (pp) return REASONS[1]
  if (a.layer === 'standards' || b.layer === 'standards') return REASONS[3]
  const cl = ['hospital', 'phc', 'lab', 'programme', 'pharmacy', 'emergency']
  if (cl.includes(a.layer) && cl.includes(b.layer)) return REASONS[2]
  return REASONS[4]
}

const RANK: Record<Confidence, number> = { confirmed: 2, likely: 1, uncertain: 0 }
/**
 * How firmly a finding about a pair stands: never stronger than the weaker of the two system descriptions.
 * Confirmed means both systems are confirmed and no link was found. It does not mean the gap was proven.
 */
export function gapFinding(a: SysNode, b: SysNode): { conf: Confidence; why: string } {
  const conf = (RANK[a.conf] <= RANK[b.conf] ? a.conf : b.conf) as Confidence
  const weak = [a, b].filter((n) => n.conf !== 'confirmed').map((n) => `${n.name} (${n.conf})`)
  const why = conf === 'confirmed'
    ? 'Both system descriptions are confirmed, so this finding rests on firm ground.'
    : `The finding is only as firm as the weaker description: ${weak.join(' and ')}.`
  return { conf, why }
}
