import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PROVINCES, PROV_DATA } from '../data/meta'
import { PageHead, SourceList } from '../components/ui'
import type { ProvinceInfo } from '../types'

const ROWS: { k: string; label: string; get: (p: ProvinceInfo) => string }[] = [
  { k: 'hosp', label: 'Hospital records', get: (p) => p.hosp ?? 'No hospital record system reported' },
  { k: 'phc', label: 'Clinic records', get: (p) => p.phc },
  { k: 'dc', label: 'Provincial data centre', get: (p) => p.dc ?? 'None found yet' },
  { k: 'hprs', label: 'Patient registry roll-out', get: (p) => p.hprs },
]

export default function Provinces() {
  const [a, setA] = useState('Western Cape')
  const [b, setB] = useState('Eastern Cape')
  const none = PROVINCES.filter((p) => PROV_DATA[p].none)

  return (
    <div className="pg">
      <PageHead
        eyebrow="Provinces"
        title="Nine provinces, nine answers"
        blurb="National registries, labs and reporting work the same way everywhere. The hospital and clinic systems underneath are different in each province, and some provinces report no hospital record system at all."
      />

      <div className="callout callout--warn">
        <strong>{none.length} of {PROVINCES.length} provinces report no hospital record system:</strong> {none.join(', ')}.
      </div>

      <div className="cards cards--wide" style={{ marginTop: 16 }}>
        {PROVINCES.map((name) => {
          const p = PROV_DATA[name]
          return (
            <article className={`card pcard${p.none ? ' pcard--none' : ''}`} key={name}>
              <div className="card__row">
                <h3>{name}</h3>
                {p.none && <span className="chip chip--break">No hospital system</span>}
              </div>
              <dl className="facts">
                {ROWS.slice(0, 3).map((r) => (
                  <div key={r.k}>
                    <dt>{r.label}</dt>
                    <dd className={r.k === 'hosp' && p.none ? 'absent' : undefined}>{r.get(p)}</dd>
                  </div>
                ))}
              </dl>
              {p.beta > 0 && <p className="chip">{p.beta} clinics in the National EMR trial</p>}
              <details className="more-details">
                <summary>More detail and sources</summary>
                <dl className="facts">
                  <div><dt>Patient registry roll-out</dt><dd>{p.hprs}</dd></div>
                  {p.other && <div><dt>Other</dt><dd>{p.other}</dd></div>}
                </dl>
                <SourceList ids={p.src} />
              </details>
              <Link to={`/map?province=${encodeURIComponent(name)}`} className="more">See {name} on the map →</Link>
            </article>
          )
        })}
      </div>

      <section className="sec" aria-labelledby="cmp-t">
        <div className="sec__head">
          <div>
            <h2 id="cmp-t">Compare two provinces</h2>
            <p>Differences are highlighted.</p>
          </div>
          <div className="bar" style={{ margin: 0 }}>
            <select className="select" value={a} onChange={(e) => setA(e.target.value)} aria-label="First province">
              {PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select className="select" value={b} onChange={(e) => setB(e.target.value)} aria-label="Second province">
              {PROVINCES.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="tablewrap">
          <table className="cmp">
            <thead>
              <tr><th /><th>{a}</th><th>{b}</th></tr>
            </thead>
            <tbody>
              {ROWS.map((r) => {
                const x = r.get(PROV_DATA[a])
                const y = r.get(PROV_DATA[b])
                return (
                  <tr key={r.k} className={x !== y ? 'diff' : undefined}>
                    <th scope="row">{r.label}</th>
                    <td>{x}</td>
                    <td>{y}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="callout" style={{ marginTop: 24 }}>
        Hospital counts come from parliamentary reply NW2014 (28 May 2026). Trial clinic counts come from reply NW4495 (1 August 2025).
        Other details come from provincial briefings to the Select Committee on Social Services (June 2025), press reports and the research notes.
      </p>
    </div>
  )
}
