import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { search, type Hit, type HitType } from '../lib/search'

const TYPE_HINT: Record<HitType, string> = { Page: 'Page', System: 'System', Journey: 'Journey', Province: 'Province', Source: 'Source' }

/** Global search: Ctrl+K, Cmd+K or "/" opens it from anywhere. */
export default function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const hits = useMemo(() => search(q), [q])

  useEffect(() => { if (open) { setQ(''); setI(0); requestAnimationFrame(() => input.current?.focus()) } }, [open])
  useEffect(() => { setI(0) }, [q])
  useEffect(() => { list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [i])

  if (!open) return null

  const go = (h: Hit | undefined) => { if (!h) return; onClose(); nav(h.to) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setI((n) => Math.min(hits.length - 1, n + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((n) => Math.max(0, n - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); go(hits[i]) }
  }

  return (
    <div className="pal" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="pal__box" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKey}>
        <div className="pal__field">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></svg>
          <input
            ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search systems, journeys, provinces, sources…"
            aria-label="Search" role="combobox" aria-expanded="true" aria-controls="pal-list" aria-activedescendant={hits[i] ? `pal-${i}` : undefined}
          />
          <kbd>Esc</kbd>
        </div>
        {hits.length === 0 ? (
          <p className="pal__none">Nothing matches “{q}”. Try a system name or a province.</p>
        ) : (
          <ul className="pal__list" id="pal-list" role="listbox" ref={list}>
            {hits.map((h, n) => (
              <li key={h.type + h.to} id={`pal-${n}`} role="option" aria-selected={n === i} className={n === i ? 'is-on' : undefined}
                onMouseMove={() => setI(n)} onClick={() => go(h)}>
                <span className={`pal__type pal__type--${h.type.toLowerCase()}`}>{TYPE_HINT[h.type]}</span>
                <span className="pal__main"><b>{h.title}</b>{h.sub && <small>{h.sub}</small>}</span>
                <span className="pal__go" aria-hidden="true">↵</span>
              </li>
            ))}
          </ul>
        )}
        <div className="pal__foot"><span><kbd>↑</kbd><kbd>↓</kbd> to move</span><span><kbd>↵</kbd> to open</span><span><kbd>Esc</kbd> to close</span></div>
      </div>
    </div>
  )
}
