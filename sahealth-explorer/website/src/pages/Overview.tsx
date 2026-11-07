import { Link } from 'react-router-dom'
import { SECTORS } from '../data/meta'
import { CONF, LINK_COLOR, LINK_NAME, headline } from '../lib/model'

export default function Overview() {
  const h = headline()

  const stats = [
    { n: String(h.systems), l: 'systems mapped', s: 'across public, private and community care' },
    { n: String(h.links), l: 'known connections', s: `only ${h.liveLinks} of them are live links` },
    { n: `${h.noHospital} of ${h.provinces}`, l: 'provinces report no hospital record system', s: 'according to parliamentary replies' },
    { n: `${h.keyGapPct}%`, l: 'of key-system pairs are not connected', s: `among the ${h.keyCount} key systems` },
  ]

  const start = [
    { to: '/map', t: 'Map', d: 'Every system on one page, by what it does and who runs it. Select one to see what it connects to.' },
    { to: '/systems', t: 'Systems', d: `Search and browse all ${h.systems} systems, each with its sources.` },
    { to: '/journeys', t: 'Journeys', d: `Follow a patient’s data through ${h.journeys} real situations, and see where it stops.` },
    { to: '/provinces', t: 'Provinces', d: 'Nine provinces, nine different answers to the same question.' },
    { to: '/gaps', t: 'Gaps', d: 'Which systems are not connected to each other, and the main reason why.' },
    { to: '/sources', t: 'Sources and method', d: `${h.sources} sources, and how sure we are about each claim.` },
  ]

  const plain = [
    { t: 'A visit leaves a trail in one place', d: 'In most public clinics the paper folder is the clinical record. What is written in it stays at that clinic.' },
    { t: 'Each province does it differently', d: 'The hospital record system in the Western Cape is not the one used in the Eastern Cape or Gauteng, and nothing moves between them.' },
    { t: 'Public and private care are separate worlds', d: 'Private claims flow from practice to scheme electronically, but a public doctor cannot see any of it.' },
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
            <Link to="/systems" className="hero__btn hero__btn--ghost">Browse systems</Link>
          </div>
        </div>
      </section>

      <div className="pg pg--flush">
        <section className="sec" aria-labelledby="find-t">
          <div className="sec__head">
            <div>
              <h2 id="find-t">The picture in four numbers</h2>
              <p>Worked out from the research behind this site, not estimated.</p>
            </div>
          </div>
          <div className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.l}>
                <strong>{s.n}</strong>
                <span>{s.l}</span>
                <small>{s.s}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="sec" aria-labelledby="plain-t">
          <div className="sec__head">
            <div>
              <h2 id="plain-t">In plain words</h2>
              <p>What this means for a person who needs care.</p>
            </div>
          </div>
          <div className="cards cards--3">
            {plain.map((p) => (
              <article className="card card--soft" key={p.t}>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sec" aria-labelledby="start-t">
          <div className="sec__head">
            <div>
              <h2 id="start-t">Where to start</h2>
              <p>Every page works on its own. Begin with whichever question you have.</p>
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

        <p className="callout" style={{ marginTop: 36 }}>
          <strong>What this site is, and is not.</strong> It describes how things exist today, with a source for every claim.
          Where nothing public was found, it says so. It does not describe what DEXA will build.
        </p>
      </div>
    </>
  )
}
