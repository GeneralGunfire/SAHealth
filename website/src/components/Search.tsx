import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { search, type Hit, type HitKind } from '../data/derived'
import { useNav } from '../nav'

const ORDER: HitKind[] = ['system', 'journey', 'province', 'source', 'connection', 'layer', 'sector', 'term']
const LABEL: Record<HitKind, string> = { system: 'Systems', journey: 'Journeys', province: 'Provinces', source: 'Research sources', connection: 'Connections', layer: 'Layers', sector: 'Sectors', term: 'Glossary' }
const PER = 6
const TRY = ['HPRS', 'Western Cape', 'lab result', 'NHLS', 'medical scheme', 'paper']

function Mark({ text, q }: { text: string; q: string }) {
  const words = q.trim().split(/\s+/).filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!words.length) return <>{text}</>
  const parts = text.split(new RegExp(`(${words.join('|')})`, 'ig'))
  const set = new Set(q.toLowerCase().trim().split(/\s+/))
  return <>{parts.map((p, i) => (set.has(p.toLowerCase()) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}</>
}

export function Search({ onClose }: { onClose: () => void }) {
  const nav = useNav()
  const [q, setQ] = useState('')
  const [cur, setCur] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)

  const grouped = useMemo(() => {
    const hits = search(q, 120)
    // groups are ordered by their best match, so an exact province or short name is never buried under weaker system hits
    const best = (k: HitKind) => Math.max(0, ...hits.filter((h) => h.kind === k).map((h) => h.score ?? 0))
    const order = [...ORDER].sort((a, b) => best(b) - best(a) || ORDER.indexOf(a) - ORDER.indexOf(b))
    const out: Hit[] = []
    for (const k of order) out.push(...hits.filter((h) => h.kind === k).slice(0, PER))
    return out
  }, [q])
  useEffect(() => { setCur(0) }, [q])
  useEffect(() => { input.current?.focus() }, [])
  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [cur])

  const pick = (h: Hit) => {
    onClose()
    switch (h.kind) {
      case 'system': nav.openNode(h.id); break
      case 'journey': nav.goJourney(h.id); break
      case 'province': nav.goProvince(h.id); break
      case 'source': nav.goSource(h.id); break
      case 'connection': { const [a, b] = h.id.split('|'); nav.openPair(a, b); break }
      case 'layer': nav.showLayer(h.id); break
      case 'sector': nav.showSector(h.id); break
      case 'term': nav.goGlossary(h.id); break
    }
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCur((c) => Math.min(grouped.length - 1, c + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCur((c) => Math.max(0, c - 1)) }
    else if (e.key === 'Enter' && grouped[cur]) { e.preventDefault(); pick(grouped[cur]) }
    else if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'Tab') { e.preventDefault(); input.current?.focus() }
  }

  let lastKind: HitKind | null = null
  return (
    <motion.div className="srch-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="srch" role="dialog" aria-modal="true" aria-label="Search DEXA" onKeyDown={onKey}>
        <div className="srch-in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search systems, aliases, journeys, provinces, sources…" role="combobox" aria-expanded="true" aria-controls="srch-list" aria-activedescendant={grouped[cur] ? 'sr-' + cur : undefined} autoComplete="off" spellCheck={false} />
          <kbd>Esc</kbd>
        </div>
        <div className="srch-list" id="srch-list" role="listbox" ref={list}>
          {!q.trim() && (
            <div className="srch-empty">
              <b>Find anything in DEXA.</b>
              <p>Search covers all systems and their short names, journeys, provinces, research sources, connections, layers, sectors and glossary terms.</p>
              <div className="chips">{TRY.map((t) => <button key={t} className="chip" onClick={() => setQ(t)}>{t}</button>)}</div>
            </div>
          )}
          {q.trim() && grouped.length === 0 && (
            <div className="srch-empty"><b>No results for “{q}”.</b><p>Nothing in the research matches that. Try a short name such as HPRS, a place, or a plain word such as “lab”.</p></div>
          )}
          {grouped.map((h, i) => {
            const head = h.kind !== lastKind; lastKind = h.kind
            return (
              <div key={h.kind + h.id}>
                {head && <div className="srch-h">{LABEL[h.kind]}</div>}
                <button id={'sr-' + i} role="option" aria-selected={i === cur} className={'srch-r' + (i === cur ? ' on' : '')} onMouseMove={() => setCur(i)} onClick={() => pick(h)}>
                  <b><Mark text={h.title} q={q} /></b>
                  <small><Mark text={h.sub} q={q} /></small>
                </button>
              </div>
            )
          })}
        </div>
        <div className="srch-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span><span className="mute">{grouped.length ? `${grouped.length} shown` : ''}</span></div>
      </div>
    </motion.div>
  )
}
