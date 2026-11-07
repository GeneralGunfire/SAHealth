import { NODES } from '../data/nodes'
import { JOURNEYS } from '../data/flows'
import { PROVINCES, SOURCES } from '../data/meta'
import { layerName } from './model'

export type HitType = 'Page' | 'System' | 'Journey' | 'Province' | 'Source'
export type Hit = { type: HitType; title: string; sub?: string; to: string }
type Indexed = Hit & { hay: string; alias?: string }

export const PAGES: Hit[] = [
  { type: 'Page', title: 'Overview', sub: 'Headline numbers and where to start', to: '/' },
  { type: 'Page', title: 'Map', sub: 'Every system, by what it does and who runs it', to: '/map' },
  { type: 'Page', title: 'Systems', sub: 'Searchable directory', to: '/systems' },
  { type: 'Page', title: 'Journeys', sub: 'Follow a patient’s data step by step', to: '/journeys' },
  { type: 'Page', title: 'Provinces', sub: 'Nine provinces, nine answers', to: '/provinces' },
  { type: 'Page', title: 'Gaps', sub: 'What is not connected, and why', to: '/gaps' },
  { type: 'Page', title: 'Sources and method', sub: 'How we know what we know', to: '/sources' },
]

const INDEX: Indexed[] = [
  ...PAGES.map((p) => ({ ...p, hay: `${p.title} ${p.sub ?? ''}`.toLowerCase() })),
  ...NODES.map((n): Indexed => ({
    type: 'System', alias: n.alias?.toLowerCase(), title: n.name, sub: [n.alias, layerName(n)].filter(Boolean).join(' · '), to: `/systems/${n.id}`,
    hay: `${n.name} ${n.alias ?? ''} ${layerName(n)} ${n.who ?? ''} ${n.summary}`.toLowerCase(),
  })),
  ...JOURNEYS.map((j): Indexed => ({ type: 'Journey', title: j.title, sub: j.intro, to: `/journeys/${j.id}`, hay: `${j.title} ${j.intro}`.toLowerCase() })),
  ...PROVINCES.map((p): Indexed => ({ type: 'Province', title: p, sub: 'Province', to: `/provinces?select=${encodeURIComponent(p)}`, hay: p.toLowerCase() })),
  ...SOURCES.map((s): Indexed => ({ type: 'Source', title: s.title, sub: 'Source', to: `/sources?q=${encodeURIComponent(s.title.split(' ').slice(0, 4).join(' '))}`, hay: s.title.toLowerCase() })),
]

// at equal relevance, a system or page beats a source that merely mentions the word
const BONUS: Record<HitType, number> = { Page: 2, System: 2, Province: 2, Journey: 1, Source: 0 }
const ORDER: Record<HitType, number> = { Page: 0, System: 1, Journey: 2, Province: 3, Source: 4 }

export function search(q: string, limit = 14): Hit[] {
  const tokens = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!tokens.length) return PAGES
  return INDEX
    .map((it) => {
      if (!tokens.every((t) => it.hay.includes(t))) return null
      const title = it.title.toLowerCase()
      let score = BONUS[it.type]
      for (const t of tokens) {
        score += title.startsWith(t) || it.alias?.startsWith(t) ? 4 : title.includes(t) || it.alias?.includes(t) ? 3 : 1
      }
      return { it, score }
    })
    .filter((x): x is { it: Indexed; score: number } => !!x)
    .sort((a, b) => b.score - a.score || ORDER[a.it.type] - ORDER[b.it.type])
    .slice(0, limit)
    .map((x) => ({ type: x.it.type, title: x.it.title, sub: x.it.sub, to: x.it.to }))
}
