import { Link, Navigate, useParams } from 'react-router-dom'
import { GROUPS, JOURNEYS } from '../data/flows'
import { JOURNEY, LINK_COLOR, LINK_NAME, NODE } from '../lib/model'
import { PageHead, SysLink } from '../components/ui'
import type { Journey } from '../types'

const breaks = (j: Journey) => j.steps.filter((s) => s.k === 'break').length
const byHand = (j: Journey) => j.steps.filter((s) => s.k === 'manual').length

export function Journeys() {
  return (
    <div className="pg">
      <PageHead
        eyebrow="Journeys"
        title="Follow the data"
        blurb={'A patient’s information is created at every visit, but it rarely travels with them. Pick a situation and step through it to see where the data goes, who retypes it, and where it stops.'}
      />
      {(['public', 'private', 'cross'] as const).map((g) => {
        const list = JOURNEYS.filter((j) => j.g === g)
        if (!list.length) return null
        return (
          <section className="sec sec--tight" key={g} aria-labelledby={`g-${g}`}>
            <div className="sec__head">
              <div>
                <h2 id={`g-${g}`}><i className="gdot" style={{ background: GROUPS[g].color }} />{GROUPS[g].name}</h2>
                <p>{GROUPS[g].sub}</p>
              </div>
            </div>
            <div className="cards">
              {list.map((j) => (
                <Link key={j.id} to={`/journeys/${j.id}`} className="card jcard" style={{ ['--gc' as string]: GROUPS[g].color }}>
                  <h3>{j.title}</h3>
                  <p className="clamp3">{j.intro}</p>
                  <div className="card__tags">
                    <span className="chip">{j.steps.length} steps</span>
                    {byHand(j) > 0 && <span className="chip">{byHand(j)} by hand</span>}
                    {breaks(j) > 0 && <span className="chip chip--break">{breaks(j)} {breaks(j) === 1 ? 'break' : 'breaks'}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
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
    <div className="pg pg--narrow">
      <Link to="/journeys" className="back">← All journeys</Link>
      <PageHead eyebrow={`${g.name} · ${g.sub}`} title={j.title} blurb={j.intro} />

      <div className="jstats">
        <div><strong>{j.steps.length}</strong><span>steps</span></div>
        <div><strong>{byHand(j)}</strong><span>retyped or carried by hand</span></div>
        <div className="jstats__hot"><strong>{breaks(j)}</strong><span>{breaks(j) === 1 ? 'place it stops' : 'places it stops'}</span></div>
      </div>

      <ol className="steps">
        {j.steps.map((s, k) => {
          const from = NODE[s.f]
          const to = NODE[s.t]
          return (
            <li key={k} className={`step${s.k === 'break' ? ' step--break' : ''}`} style={{ ['--lc' as string]: LINK_COLOR[s.k] }}>
              <span className="step__num">{k + 1}</span>
              <div className="step__body">
                <div className="step__route">
                  {from && <SysLink node={from} />}
                  <span className="step__arrow" aria-hidden="true">→</span>
                  {to && <SysLink node={to} />}
                  <span className="conn__type"><i />{LINK_NAME[s.k]}</span>
                </div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
                {s.lbl && <span className="chip">What travels: {s.lbl}</span>}
              </div>
            </li>
          )
        })}
      </ol>

      <nav className="jnav" aria-label="Other journeys">
        {prev ? <Link to={`/journeys/${prev.id}`} className="btn">← {prev.title}</Link> : <span />}
        {next ? <Link to={`/journeys/${next.id}`} className="btn">{next.title} →</Link> : <span />}
      </nav>
    </div>
  )
}
