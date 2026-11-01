import { useEffect, useMemo, useRef, useState } from 'react'
import { GLOSSARY } from '../data/derived'
import { LINK_LABEL } from '../data/meta'
import { useNav } from '../nav'

const LINES = [
  { k: 'live' as const, plain: 'Data moves between the two systems on its own, without a person.' },
  { k: 'batch' as const, plain: 'Data moves on a schedule, as a file or an extract, not instantly.' },
  { k: 'manual' as const, plain: 'A person copies, retypes or physically carries the data.' },
]

export function Glossary({ focus }: { focus: string | null }) {
  const nav = useNav()
  const [q, setQ] = useState('')
  const ref = useRef<HTMLLIElement>(null)
  const t = q.toLowerCase().trim()
  const list = useMemo(() => GLOSSARY.filter((g) => !t || (g.term + ' ' + g.plain).toLowerCase().includes(t)), [t])
  useEffect(() => { ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }, [focus])
  return (
    <div className="gls">
      <section className="gls-how">
        <h2>How information moves</h2>
        <p>These three words are used all over the site. They describe a connection between two systems.</p>
        <dl>{LINES.map((l) => <div key={l.k}><dt><i className={'lk lk-' + l.k} />{LINK_LABEL[l.k]}</dt><dd>{l.plain}</dd></div>)}
          <div><dt><i className="lk lk-break" />Data stops here</dt><dd>The point in a journey where information goes no further.</dd></div></dl>
      </section>
      <label className="srcx-q"><span>Search terms</span><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="HPRS, FHIR, lab…" /></label>
      <p className="srcx-note">Names of systems are explained from their records and carry their sources. General technology terms are marked as such and describe the technology, not South Africa.</p>
      <ul className="gls-list">
        {list.map((g) => (
          <li key={g.term} ref={g.term === focus ? ref : undefined} className={g.term === focus ? 'on' : ''}>
            <div className="gls-t"><b>{g.term}</b><em className={g.kind}>{g.kind === 'researched' ? 'System name' : 'General term'}</em></div>
            <p>{g.plain}</p>
            <div className="gls-a">
              {g.nodeId && <button className="link" onClick={() => nav.openNode(g.nodeId!)}>Open the system</button>}
              {g.src.map((s) => <button key={s} className="srcid" onClick={() => nav.goSource(s)}>{s}</button>)}
            </div>
          </li>
        ))}
      </ul>
      {list.length === 0 && <div className="empty"><b>No terms match “{q}”.</b><p>Try a shorter search.</p></div>}
    </div>
  )
}
