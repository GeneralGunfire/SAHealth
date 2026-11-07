import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { GROUPS, JOURNEYS } from '../data/flows'
import { JOURNEY, LINK_COLOR, LINK_NAME, NODE } from '../lib/model'
import { Empty, PageHead, SysLink } from '../components/ui'
import JourneyPlayer from '../components/JourneyPlayer'
import type { Journey } from '../types'

const breaks = (j: Journey) => j.steps.filter((s) => s.k === 'break').length
const byHand = (j: Journey) => j.steps.filter((s) => s.k === 'manual').length

export function Journeys() {
  const [g, setG] = useState<'all' | Journey['g']>('all')
  const [q, setQ] = useState('')
  const list = useMemo(() => JOURNEYS.filter((j) =>
    (g === 'all' || j.g === g) && (!q.trim() || `${j.title} ${j.intro}`.toLowerCase().includes(q.trim().toLowerCase()))), [g, q])
  const count = (k: 'all' | Journey['g']) => JOURNEYS.filter((j) => k === 'all' || j.g === k).length

  return (
    <div className="pg">
      <PageHead
        eyebrow="Journeys"
        title="Follow the data"
        blurb={'A patient’s information is created at every visit, but it rarely travels with them. Pick a situation and watch it play out: where the data goes, who retypes it, and where it stops.'}
      />

      <div className="bar">
        <input className="input input--search" type="search" placeholder="Search journeys" aria-label="Search journeys" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="schips" role="group" aria-label="Sector" style={{ margin: 0 }}>
          {(['all', 'public', 'private', 'cross'] as const).map((k) => (
            <button key={k} type="button" className="schip" aria-pressed={g === k} style={{ ['--c' as string]: k === 'all' ? '#0b1733' : GROUPS[k].color }} onClick={() => setG(k)}>
              {k !== 'all' && <i />}{k === 'all' ? 'All' : GROUPS[k].name}<b>{count(k)}</b>
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <Empty title="No journeys match." text="Try a different search." action={<button type="button" className="btn" onClick={() => { setQ(''); setG('all') }}>Clear</button>} />
      ) : (
        <div className="cards">
          {list.map((j, i) => (
            <Link key={j.id} to={`/journeys/${j.id}`} className="card jcard card--in" style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}>
              <span className="jcard__group"><i style={{ background: GROUPS[j.g].color }} />{GROUPS[j.g].name}</span>
              <h3>{j.title}</h3>
              <p className="clamp3">{j.intro}</p>
              <div className="jdots" aria-hidden="true">
                {j.steps.map((s, k) => <i key={k} className={s.k === 'break' ? 'is-break' : ''} style={{ background: LINK_COLOR[s.k] }} />)}
              </div>
              <div className="card__tags">
                <span className="chip">{j.steps.length} steps</span>
                {byHand(j) > 0 && <span className="chip">{byHand(j)} by hand</span>}
                {breaks(j) > 0 && <span className="chip chip--break">{breaks(j)} {breaks(j) === 1 ? 'break' : 'breaks'}</span>}
              </div>
              <span className="card__go">Watch →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function JourneyDetail() {
  const { id = '' } = useParams()
  const j = JOURNEY[id]
  if (!j) return <Navigate to="/journeys" replace />
  const i = JOURNEYS.findIndex((x) => x.id === j.id)
  const prev = JOURNEYS[i - 1]
  const next = JOURNEYS[i + 1]
  const g = GROUPS[j.g]

  return (
    <div className="pg">
      <Link to="/journeys" className="back">← All journeys</Link>
      <PageHead eyebrow={`${g.name} · ${g.sub}`} title={j.title} blurb={j.intro} />

      <JourneyPlayer key={j.id} journey={j} />

      <div className="jstats">
        <div><strong>{j.steps.length}</strong><span>steps</span></div>
        <div><strong>{byHand(j)}</strong><span>retyped or carried by hand</span></div>
        <div className="jstats__hot"><strong>{breaks(j)}</strong><span>{breaks(j) === 1 ? 'place it stops' : 'places it stops'}</span></div>
      </div>

      <details className="textstory">
        <summary>Read the whole journey as text</summary>
        <ol className="tsteps">
          {j.steps.map((s, k) => {
            const from = NODE[s.f]
            const to = NODE[s.t]
            return (
              <li key={k} className={`tstep${s.k === 'break' ? ' is-break' : ''}`}>
                <span className="tstep__num">{k + 1}</span>
                <div className="tstep__body">
                  <div className="tstep__route">
                    {from && <SysLink node={from} />}
                    <span aria-hidden="true">→</span>
                    {to && <SysLink node={to} />}
                    <span className="conn__type" style={{ ['--lc' as string]: LINK_COLOR[s.k] }}><i />{LINK_NAME[s.k]}</span>
                  </div>
                  <h3>{s.h}</h3>
                  <p>{s.p}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </details>

      <nav className="jnav" aria-label="Other journeys">
        {prev ? <Link to={`/journeys/${prev.id}`} className="btn">← {prev.title}</Link> : <span />}
        {next ? <Link to={`/journeys/${next.id}`} className="btn">{next.title} →</Link> : <span />}
      </nav>
    </div>
  )
}
