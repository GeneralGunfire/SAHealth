import { Link } from 'react-router-dom'
import { SECTORS } from '../data/meta'
import { CONF, JOURNEY, LINK_COLOR, LINK_NAME, headline } from '../lib/model'
import { CountUp, Reveal } from '../components/Dynamic'

export default function Overview() {
  const h = headline()
  const featured = JOURNEY.lab

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
                <p>A patient{'’'}s information is created at every visit, but it rarely travels with them.</p>
              </div>
              <Link to="/journeys" className="more">All {h.journeys} journeys →</Link>
            </div>
            <Link to="/journeys/lab" className="feat">
              <div className="feat__text">
                <span className="feat__kick">Featured journey</span>
                <h3>{featured.title}</h3>
                <p>{featured.intro}</p>
                <span className="btn btn--dark feat__btn">Watch it play</span>
              </div>
              <ol className="feat__steps" aria-label="The steps">
                {featured.steps.map((s, k) => (
                  <li key={k} className={s.k === 'break' ? 'is-break' : ''}>
                    <i style={{ background: LINK_COLOR[s.k] }} title={LINK_NAME[s.k]} />
                    <span>{s.h}</span>
                  </li>
                ))}
              </ol>
            </Link>
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
