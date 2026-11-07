import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTORS } from '../data/meta'
import { CONF, JOURNEY, LINK_COLOR, LINK_NAME, NODE, headline } from '../lib/model'
import { CountUp, Reveal, reducedMotion } from '../components/Dynamic'
import { SysLink } from '../components/ui'

/** Rotating one-line facts in the hero. Decorative: the same numbers appear below as real content. */
function FactTicker({ facts }: { facts: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reducedMotion()) return
    const t = setInterval(() => setI((n) => (n + 1) % facts.length), 4200)
    return () => clearInterval(t)
  }, [facts.length])
  return (
    <div className="ticker" aria-hidden="true">
      <span className="ticker__dot" />
      <span key={i} className="ticker__text">{facts[i]}</span>
    </div>
  )
}

/** A short auto-playing preview of one journey, with a link to the full player. */
function JourneyTeaser() {
  const j = JOURNEY.lab
  const [i, setI] = useState(0)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (hold || reducedMotion()) return
    const t = setInterval(() => setI((n) => (n + 1) % j.steps.length), 4800)
    return () => clearInterval(t)
  }, [hold, j.steps.length])
  const s = j.steps[i]
  const from = NODE[s.f], to = NODE[s.t]
  return (
    <div className="teaser" onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <div className="teaser__head">
        <span className="teaser__kick">Journey</span>
        <h3>{j.title}</h3>
        <p>{j.intro}</p>
        <Link to="/journeys/lab" className="btn btn--dark">Watch the full journey</Link>
      </div>
      <div className="teaser__stage" key={i} style={{ ['--lc' as string]: LINK_COLOR[s.k] }}>
        <div className="teaser__route">
          {from && <SysLink node={from} />}
          <span className="teaser__arrow" aria-hidden="true">→</span>
          {to && <SysLink node={to} />}
        </div>
        <span className="conn__type"><i />{LINK_NAME[s.k]}</span>
        <h4>{s.h}</h4>
        <p>{s.p}</p>
      </div>
      <div className="teaser__dots" role="tablist" aria-label="Steps">
        {j.steps.map((st, k) => (
          <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Step ${k + 1}`}
            className={`teaser__dot${k === i ? ' is-on' : ''}${st.k === 'break' ? ' is-break' : ''}`} onClick={() => setI(k)} />
        ))}
      </div>
    </div>
  )
}

export default function Overview() {
  const h = headline()

  const facts = [
    `${h.noHospital} of ${h.provinces} provinces report no hospital record system`,
    `Only ${h.liveLinks} of ${h.links} known connections are live links`,
    `${h.paper} of the ${h.systems} systems mapped are still paper`,
    `${h.keyGapPct}% of key-system pairs are not connected`,
  ]

  const stats = [
    { n: h.systems, l: 'systems mapped', s: 'across public, private and community care' },
    { n: h.links, l: 'known connections', s: `only ${h.liveLinks} of them are live links` },
    { n: h.noHospital, of: h.provinces, l: 'provinces report no hospital record system', s: 'according to parliamentary replies' },
    { n: h.keyGapPct, suffix: '%', l: 'of key-system pairs are not connected', s: `among the ${h.keyCount} key systems` },
  ]

  const questions = [
    { to: '/journeys/lab', q: 'Where does my information go after a clinic visit?', a: 'Follow one blood test, step by step.' },
    { to: '/provinces', q: 'Which provinces have no hospital record system?', a: 'Pick a province on the tile map.' },
    { to: '/gaps?reason=owners', q: 'Why can’t public and private care share data?', a: 'See every pair split by the public–private wall.' },
    { to: '/systems/hprs', q: 'What is the national patient registry?', a: 'What it holds, and what it does not.' },
  ]

  const start = [
    { to: '/map', t: 'Map', d: 'Every system on one page. Hover or select one to see what it connects to.' },
    { to: '/systems', t: 'Systems', d: `Search and filter all ${h.systems} systems, each with its sources.` },
    { to: '/journeys', t: 'Journeys', d: `Watch ${h.journeys} real situations play out, and see where the data stops.` },
    { to: '/provinces', t: 'Provinces', d: 'A tile map of the nine provinces, with a side-by-side comparison.' },
    { to: '/gaps', t: 'Gaps', d: 'Which systems are not connected to each other, and the main reason why.' },
    { to: '/sources', t: 'Sources and method', d: `${h.sources} sources, and how sure we are about each claim.` },
  ]

  return (
    <>
      <section className="hero" aria-label="Introduction">
        <div className="hero__content">
          <FactTicker facts={facts} />
          <p className="hero__kicker">SAHealth by DEXA</p>
          <h1>How health data works in South Africa, today.</h1>
          <p className="hero__sub">
            A sourced map of the systems that hold health information, who runs them, and how, or whether, they connect.
          </p>
          <div className="hero__cta">
            <Link to="/map" className="hero__btn hero__btn--white">Explore the map</Link>
            <Link to="/journeys" className="hero__btn hero__btn--ghost">Watch a journey</Link>
          </div>
        </div>
      </section>

      <div className="pg pg--flush">
        <Reveal>
          <section className="sec" aria-labelledby="find-t">
            <div className="sec__head">
              <div>
                <h2 id="find-t">The picture in four numbers</h2>
                <p>Worked out from the research behind this site, not estimated.</p>
              </div>
            </div>
            <div className="stats">
              {stats.map((s, i) => (
                <Reveal key={s.l} delay={i * 80}>
                  <div className="stat">
                    <strong>
                      <CountUp to={s.n} suffix={s.suffix ?? ''} />
                      {s.of !== undefined && <span className="stat__of"> of {s.of}</span>}
                    </strong>
                    <span>{s.l}</span>
                    <small>{s.s}</small>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="sec" aria-labelledby="watch-t">
            <div className="sec__head">
              <div>
                <h2 id="watch-t">See it happen</h2>
                <p>{'A patient’s information is created at every visit, but it rarely travels with them.'}</p>
              </div>
              <Link to="/journeys" className="more">All {h.journeys} journeys →</Link>
            </div>
            <JourneyTeaser />
          </section>
        </Reveal>

        <Reveal>
          <section className="sec" aria-labelledby="ask-t">
            <div className="sec__head">
              <div>
                <h2 id="ask-t">Start with a question</h2>
                <p>Pick the one closest to what you want to know.</p>
              </div>
            </div>
            <div className="qgrid">
              {questions.map((q) => (
                <Link key={q.q} to={q.to} className="qcard">
                  <b>{q.q}</b>
                  <span>{q.a}</span>
                  <i aria-hidden="true">→</i>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="sec" aria-labelledby="start-t">
            <div className="sec__head">
              <div>
                <h2 id="start-t">Where to start</h2>
                <p>Every page works on its own.</p>
              </div>
            </div>
            <div className="cards">
              {start.map((s) => (
                <Link key={s.to} to={s.to} className="card">
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                  <span className="card__go">Open →</span>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="sec" aria-labelledby="read-t">
            <div className="sec__head">
              <div>
                <h2 id="read-t">How to read it</h2>
                <p>The same colours and labels are used on every page.</p>
              </div>
            </div>
            <div className="legend">
              <div className="legend__col">
                <h3>Who runs a system</h3>
                <ul>
                  {SECTORS.map((s) => (
                    <li key={s.id}><span className="dot" style={{ background: s.color }} /><b>{s.name}</b><small>{s.sub}</small></li>
                  ))}
                </ul>
              </div>
              <div className="legend__col">
                <h3>How two systems connect</h3>
                <ul>
                  {(['live', 'batch', 'manual', 'break'] as const).map((k) => (
                    <li key={k}><span className="line" style={{ ['--lc' as string]: LINK_COLOR[k] }} data-k={k} /><b>{LINK_NAME[k]}</b></li>
                  ))}
                </ul>
              </div>
              <div className="legend__col">
                <h3>How sure we are</h3>
                <ul>
                  {(['confirmed', 'likely', 'uncertain'] as const).map((k) => (
                    <li key={k}><span className={`badge badge--${k}`}>{CONF[k].label}</span><small>{CONF[k].text}</small></li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  )
}
