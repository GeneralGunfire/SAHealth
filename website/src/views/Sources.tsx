import { useEffect, useMemo, useRef, useState } from 'react'
import { SOURCES, PROV_DATA } from '../data/meta'
import { SOURCE_CATEGORIES, SOURCE_USE, sourceCategory, sourceHost } from '../data/derived'
import { Conf } from '../components/ui'
import { useNav } from '../nav'

const first = (s: string) => s.split(/(?<=\.)\s/)[0]

export function Sources({ selected }: { selected: string | null }) {
  const nav = useNav()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string | null>(null)
  const [used, setUsed] = useState<'all' | 'cited' | 'uncited'>('all')
  const [sel, setSel] = useState<string | null>(selected)
  const detail = useRef<HTMLElement>(null)
  useEffect(() => { if (selected) setSel(selected) }, [selected])
  useEffect(() => { if (sel && window.innerWidth <= 820) detail.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, [sel])

  const rows = useMemo(() => SOURCES.map((s) => ({ s, cat: sourceCategory(s.url), use: SOURCE_USE[s.id] })), [])
  const cited = rows.filter((r) => r.use.nodes.length + r.use.provinces.length > 0).length
  const counts = useMemo(() => Object.fromEntries(SOURCE_CATEGORIES.map((c) => [c, rows.filter((r) => r.cat === c).length])), [rows])
  const t = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const list = rows.filter((r) =>
    (!cat || r.cat === cat) &&
    (used === 'all' || (used === 'cited') === (r.use.nodes.length + r.use.provinces.length > 0)) &&
    t.every((w) => (r.s.title + ' ' + r.s.id + ' ' + sourceHost(r.s.url)).toLowerCase().includes(w)))
  const cur = rows.find((r) => r.s.id === sel)

  return (
    <div className="srcx">
      <div className="srcx-sum">
        <div><b>{SOURCES.length}</b><span>sources in the research</span></div>
        <div><b>{cited}</b><span>cited by at least one system or province</span></div>
        <div><b>{SOURCES.length - cited}</b><span>not cited by any record yet</span></div>
      </div>
      <div className="srcx-grid">
        <section className="srcx-list" aria-label="Source directory">
          <label className="srcx-q"><span>Search sources</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, id or website" />
          </label>
          <div className="chips">
            <button className="chip" aria-pressed={!cat} onClick={() => setCat(null)}>All types</button>
            {SOURCE_CATEGORIES.map((c) => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c} <code>{counts[c]}</code></button>)}
          </div>
          <div className="seg" role="group" aria-label="Filter by use">
            <button aria-pressed={used === 'all'} onClick={() => setUsed('all')}>All</button>
            <button aria-pressed={used === 'cited'} onClick={() => setUsed('cited')}>Cited</button>
            <button aria-pressed={used === 'uncited'} onClick={() => setUsed('uncited')}>Not cited</button>
          </div>
          <p className="srcx-note">Types are grouped by the publisher’s website. They describe who published a source, not how reliable it is.</p>
          <ul className="srcx-rows">
            {list.map(({ s, cat: c, use }) => (
              <li key={s.id}>
                <button className={s.id === sel ? 'on' : ''} onClick={() => setSel(s.id)}>
                  <code>{s.id}</code>
                  <span><b>{s.title}</b><small>{sourceHost(s.url)} · {c}</small></span>
                  <em>{use.nodes.length + use.provinces.length || '–'}</em>
                </button>
              </li>
            ))}
          </ul>
          {list.length === 0 && <div className="empty"><b>No sources match.</b><p>Try fewer words, or clear the type filter.</p><button className="btn" onClick={() => { setQ(''); setCat(null); setUsed('all') }}>Clear filters</button></div>}
        </section>

        <section className="srcx-detail" ref={detail} aria-live="polite">
          {!cur ? (
            <div className="empty"><b>Choose a source.</b><p>You will see every system and province whose record cites it, and a link to the original.</p></div>
          ) : (
            <>
              <code className="srcx-id">SOURCE · {cur.s.id}</code>
              <h2>{cur.s.title}</h2>
              <p className="srcx-meta">{cur.cat} · {sourceHost(cur.s.url)}</p>
              <a className="btn primary" href={cur.s.url} target="_blank" rel="noreferrer">Open the original ↗</a>

              <h3>Systems whose description cites it</h3>
              {cur.use.nodes.length === 0 ? <p className="none-note">No system record cites this source.</p> : (
                <ul className="srcx-use">
                  {cur.use.nodes.map((n) => (
                    <li key={n.id}><button onClick={() => nav.openNode(n.id)}>
                      <span><b>{n.name}</b>{n.alias && <code>{n.alias}</code>}</span>
                      <small>{first(n.summary)}</small>
                      <Conf conf={n.conf} />
                    </button></li>
                  ))}
                </ul>
              )}

              <h3>Provinces whose record cites it</h3>
              {cur.use.provinces.length === 0 ? <p className="none-note">No province record cites this source.</p> : (
                <ul className="srcx-use">
                  {cur.use.provinces.map((p) => (
                    <li key={p}><button onClick={() => nav.goProvince(p)}><span><b>{p}</b></span><small>{PROV_DATA[p].hosp ?? 'No hospital record system reported'}</small></button></li>
                  ))}
                </ul>
              )}
              {cur.use.nodes.length + cur.use.provinces.length === 0 && <p className="none-note">This source is listed in the research but no record cites it yet. It has not been tied to any claim.</p>}
              <p className="srcx-note">A source is linked to a whole system or province record, not to single sentences. The confidence shown is that of the record.</p>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
