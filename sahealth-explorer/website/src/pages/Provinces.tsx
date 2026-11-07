import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { PGRID, PROVINCES, PROV_DATA } from '../data/meta'
import { PageHead, SourceList } from '../components/ui'
import type { ProvinceInfo } from '../types'

const ROWS: { k: string; label: string; get: (p: ProvinceInfo) => string }[] = [
  { k: 'hosp', label: 'Hospital records', get: (p) => p.hosp ?? 'No hospital record system reported' },
  { k: 'phc', label: 'Clinic records', get: (p) => p.phc },
  { k: 'dc', label: 'Provincial data centre', get: (p) => p.dc ?? 'None found yet' },
  { k: 'hprs', label: 'Patient registry roll-out', get: (p) => p.hprs },
]

export default function Provinces() {
  const [params, setParams] = useSearchParams()
  const asked = params.get('select') ?? ''
  const sel = PROVINCES.includes(asked) ? asked : 'Western Cape'
  const [other, setOther] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)

  const choose = (p: string) => {
    const next = new URLSearchParams(params)
    next.set('select', p)
    setParams(next, { replace: true })
  }
  const p = PROV_DATA[sel]
  const none = PROVINCES.filter((x) => PROV_DATA[x].none)

  return (
    <div className="pg">
      <PageHead
        eyebrow="Provinces"
        title="Nine provinces, nine answers"
        blurb="National registries, labs and reporting work the same way everywhere. The hospital and clinic systems underneath are different in each province, and some provinces report no hospital record system at all."
      />

      <div className="pmap">
        <div className="pmap__tiles" role="group" aria-label="Choose a province">
          {PGRID.flat().map((name) => {
            const d = PROV_DATA[name]
            return (
              <button
                key={name} type="button"
                className={`ptile${d.none ? ' is-none' : ''}${sel === name ? ' is-sel' : ''}${other === name ? ' is-other' : ''}`}
                aria-pressed={sel === name}
                onClick={() => choose(name)}
                onMouseEnter={() => setHover(name)} onMouseLeave={() => setHover(null)}
              >
                <b>{name}</b>
                <small>{d.none ? 'No hospital system' : 'Hospital system'}</small>
                {d.beta > 0 && <span className="ptile__beta">{d.beta} EMR trial clinics</span>}
              </button>
            )
          })}
          <p className="pmap__legend">
            <span><i className="k-ok" />Hospital record system reported</span>
            <span><i className="k-none" />No hospital record system reported ({none.length} of {PROVINCES.length})</span>
          </p>
        </div>

        <article className="pdetail" key={sel} aria-live="polite">
          <div className="pdetail__head">
            <h2>{sel}</h2>
            {p.none && <span className="chip chip--break">No hospital system</span>}
          </div>
          <dl className="facts">
            {ROWS.map((r) => (
              <div key={r.k}>
                <dt>{r.label}</dt>
                <dd className={r.k === 'hosp' && p.none ? 'absent' : undefined}>{r.get(p)}</dd>
              </div>
            ))}
            {p.other && <div><dt>Other</dt><dd>{p.other}</dd></div>}
          </dl>
          {p.beta > 0 && <p className="chip">{p.beta} clinics in the National EMR trial</p>}
          <div className="pdetail__acts">
            <Link to={`/map?province=${encodeURIComponent(sel)}`} className="btn btn--dark btn--sm">See {sel} on the map</Link>
          </div>
          <details className="more-details">
            <summary>Sources</summary>
            <SourceList ids={p.src} />
          </details>
          {hover && hover !== sel && <p className="pdetail__hover">Hovering: {hover}. Select it to read the detail.</p>}
        </article>
      </div>

      <section className="sec" aria-labelledby="cmp-t">
        <div className="sec__head">
          <div>
            <h2 id="cmp-t">Compare with another province</h2>
            <p>{sel} against any other. Differences are highlighted.</p>
          </div>
          <select className="select" value={other ?? ''} onChange={(e) => setOther(e.target.value || null)} aria-label="Compare with">
            <option value="">Choose a province</option>
            {PROVINCES.filter((x) => x !== sel).map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        {other ? (
          <div className="tablewrap">
            <table className="cmp">
              <thead><tr><th /><th>{sel}</th><th>{other}</th></tr></thead>
              <tbody>
                {ROWS.map((r) => {
                  const x = r.get(PROV_DATA[sel])
                  const y = r.get(PROV_DATA[other])
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
        ) : (
          <p className="callout">Choose a second province to see the two side by side.</p>
        )}
      </section>

      <p className="callout" style={{ marginTop: 24 }}>
        Hospital counts come from parliamentary reply NW2014 (28 May 2026). Trial clinic counts come from reply NW4495 (1 August 2025).
        Other details come from provincial briefings to the Select Committee on Social Services (June 2025), press reports and the research notes.
      </p>
    </div>
  )
}
