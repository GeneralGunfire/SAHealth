import { useState } from 'react'
import { PROV_DATA, PROVINCES, SECTOR } from '../data/meta'
import { BY_ID } from '../data/nodes'
import { CENTRES, MAP_H, MAP_W, SHAPES } from '../data/provinceShapes'
import { Sources } from '../components/ui'
import type { ProvinceInfo } from '../types'

type Metric = 'hosp' | 'beta' | 'dc' | 'hprs'
const METRICS: { id: Metric; label: string; yes: string; no: string }[] = [
  { id: 'hosp', label: 'Hospital records', yes: 'A hospital record system is reported', no: 'None reported' },
  { id: 'beta', label: 'National EMR beta clinics', yes: 'Clinics in the beta (darker = more)', no: 'No beta clinics' },
  { id: 'dc', label: 'Joined-up data centre', yes: 'A provincial data centre or pilot', no: 'None found yet' },
  { id: 'hprs', label: 'Patient registry (HPRS)', yes: 'Figures or detail reported', no: 'No figures found' },
]
const MAXB = Math.max(...PROVINCES.map((p) => PROV_DATA[p].beta))
const has = (m: Metric, d: ProvinceInfo) => (m === 'hosp' ? !d.none : m === 'beta' ? d.beta > 0 : m === 'dc' ? !!d.dc : !/^No figures/.test(d.hprs))
const NUDGE: Record<string, [number, number]> = { Gauteng: [-74, -34], Mpumalanga: [16, 8] }
const short = (d: ProvinceInfo) => (d.none ? 'None reported' : (d.hosp ?? '').split(' · ')[0])

const ROWS: [string, (d: ProvinceInfo) => string][] = [
  ['Hospital records', (d) => d.hosp ?? 'None reported'],
  ['Clinic records', (d) => d.phc],
  ['National EMR beta clinics', (d) => String(d.beta)],
  ['Joined-up data centre', (d) => d.dc ?? 'None found yet'],
  ['Patient registry (HPRS) in use', (d) => d.hprs],
  ['Other digital activity', (d) => d.other ?? 'None found'],
]

export function Provinces({ onSee, onSystem }: { onSee: (p: string) => void; onSystem: (id: string) => void }) {
  const [metric, setMetric] = useState<Metric>('hosp')
  const [sel, setSel] = useState('Western Cape')
  const [pins, setPins] = useState<string[]>(['Western Cape', 'Limpopo'])
  const withH = PROVINCES.filter((p) => !PROV_DATA[p].none).length
  const nat = ['hprs', 'nhls', 'dhis2', 'tier', 'hpcsa', 'icd10'].map((id) => BY_ID[id])
  const M = METRICS.find((m) => m.id === metric)!
  const d = PROV_DATA[sel]
  const togglePin = (p: string) => setPins((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p].slice(-3)))

  const fill = (p: string) => {
    const x = PROV_DATA[p]
    if (!has(metric, x)) return 'url(#hatch)'
    if (metric === 'beta') return `rgba(109, 31, 47, ${0.25 + 0.65 * (x.beta / MAXB)})`
    return '#3d3a36'
  }

  return (
    <div className="prov">
      <section className="prov-lede" data-tour="prov-grid">
        <div className="pl-fig"><b>{withH}<small> of 9</small></b><span>provinces report a hospital record system</span></div>
        <div className="pl-fig bad"><b>{9 - withH}<small> of 9</small></b><span>report none. Even where one exists, each province runs a different system.</span></div>
        <div className="pl-same">
          <label>The same in every province</label>
          <div className="chips">{nat.map((n) => <button key={n.id} className="chip" onClick={() => onSystem(n.id)}><i style={{ background: SECTOR[n.sector].color }} />{n.name}<code>{n.alias}</code></button>)}</div>
        </div>
      </section>

      <section className="prov-main">
        <div className="prov-mapcol">
          <div className="seg" role="group" aria-label="Map shows">
            {METRICS.map((m) => <button key={m.id} aria-pressed={metric === m.id} onClick={() => setMetric(m.id)}>{m.label}</button>)}
          </div>
          <svg className="pmap" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label={`Map of the nine provinces coloured by: ${M.label}`}>
            <defs>
              <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="9" height="9" fill="#efe9dc" /><line x1="0" y1="0" x2="0" y2="9" stroke="#b9ad98" strokeWidth="2.2" />
              </pattern>
            </defs>
            {PROVINCES.map((p) => (
              <path key={p} d={SHAPES[p]} fill={fill(p)} className={'pshape' + (sel === p ? ' on' : '')} tabIndex={0} role="button"
                aria-label={`${p}: ${has(metric, PROV_DATA[p]) ? M.yes : M.no}`}
                onClick={() => setSel(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(p) } }} />
            ))}
            {PROVINCES.map((p) => {
              const [cx, cy] = CENTRES[p]
              const [x, y] = [cx + (NUDGE[p]?.[0] ?? 0), cy + (NUDGE[p]?.[1] ?? 0)]
              const dark = has(metric, PROV_DATA[p]) && (metric !== 'beta' || PROV_DATA[p].beta / MAXB > 0.35)
              return (
                <g key={p} className={'plabel' + (dark ? ' lt' : '')} transform={`translate(${x} ${y})`} pointerEvents="none">
                  <text y={-4}>{p}</text>
                  {metric === 'beta' && <text y={20} className="pn">{PROV_DATA[p].beta}</text>}
                </g>
              )
            })}
          </svg>
          <div className="pkey">
            <span><i className="y" />{M.yes}</span><span><i className="n" />{M.no}</span>
          </div>
        </div>

        <article className="prov-card" aria-live="polite">
          <div className="pc-head"><code>PROVINCE</code><h2>{sel}</h2>{d.none && <span className="tagno">no hospital EMR reported</span>}</div>
          <dl>
            <div><dt>Hospital records</dt><dd>{d.hosp ?? <span className="absent">None reported</span>}</dd></div>
            <div><dt>Clinic records</dt><dd>{d.phc}{d.beta > 0 && <small>{d.beta} clinics in the National EMR beta (Aug 2025)</small>}</dd></div>
            <div><dt>Joined-up data centre</dt><dd>{d.dc ?? <span className="absent">None found yet</span>}</dd></div>
            <div><dt>Patient registry (HPRS)</dt><dd>{d.hprs}</dd></div>
            {d.other && <div><dt>Other digital activity</dt><dd>{d.other}</dd></div>}
          </dl>
          <h3>Sources</h3>
          <Sources ids={d.src} />
          <div className="acts">
            <button className="btn" aria-pressed={pins.includes(sel)} onClick={() => togglePin(sel)}>{pins.includes(sel) ? '✓ In comparison' : 'Add to comparison'}</button>
            <button className="btn" onClick={() => onSee(sel)}>See on the landscape</button>
          </div>
        </article>
      </section>

      <section className="prov-ledger">
        <h3>All nine at a glance</h3>
        <div className="ledger" role="table" aria-label="Provinces compared">
          <div className="lg-h" role="row"><span role="columnheader">Province</span><span role="columnheader">Hospital system</span><span role="columnheader">Clinic EMR beta</span><span role="columnheader">Data centre</span><span role="columnheader">HPRS</span></div>
          {PROVINCES.map((p) => {
            const x = PROV_DATA[p]
            return (
              <button key={p} role="row" className={'lg-r' + (sel === p ? ' on' : '') + (x.none ? ' none' : '')} onClick={() => { setSel(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                <b role="cell">{p}</b>
                <span role="cell" className={x.none ? 'absent' : ''}>{short(x)}</span>
                <span role="cell" className="lg-beta"><span className="bars">{Array.from({ length: MAXB }, (_, i) => <i key={i} className={i < x.beta ? 'on' : ''} />)}</span>{x.beta}</span>
                <span role="cell" className={'lg-dot' + (x.dc ? ' y' : '')}>{x.dc ? 'Yes' : 'None found'}</span>
                <span role="cell" className={'lg-dot' + (has('hprs', x) ? ' y' : '')}>{has('hprs', x) ? 'Detail reported' : 'No figures'}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="prov-cmp">
        <h3>Compare up to three</h3>
        <div className="chips">{PROVINCES.map((p) => <button key={p} className="chip" aria-pressed={pins.includes(p)} onClick={() => togglePin(p)}>{p}</button>)}</div>
        {pins.length < 2 ? <p className="none-note">Choose at least two provinces to see them side by side, with differences marked.</p> : (
          <div className="cmp-scroll">
            <table>
              <thead><tr><th />{pins.map((p) => <th key={p}>{p}</th>)}</tr></thead>
              <tbody>{ROWS.map(([l, f]) => {
                const vals = pins.map((p) => f(PROV_DATA[p]))
                const diff = new Set(vals).size > 1
                return <tr key={l}><th scope="row">{l}</th>{vals.map((v, i) => <td key={pins[i]} className={diff ? 'diff' : ''}>{v}</td>)}</tr>
              })}</tbody>
            </table>
          </div>
        )}
      </section>

      <p className="pnote">Hospital counts come from the parliamentary reply of 28 May 2026; clinic beta counts from the reply of 1 August 2025; registry details from provincial briefings in June 2025, press reports and the research notes. A blank or hatched entry means nothing was found in public sources, not that nothing exists. Province outlines are simplified for display.</p>
    </div>
  )
}
