import { useState } from 'react'
import { PROV_DATA, PROVINCES, SECTOR } from '../data/meta'
import { BY_ID } from '../data/nodes'
import { provinceJourneys, provinceSystems } from '../data/derived'
import { CENTRES, MAP_H, MAP_W, SHAPES } from '../data/provinceShapes'
import { Sources } from '../components/ui'
import { useNav } from '../nav'
import type { ProvinceInfo } from '../types'

type Metric = 'hosp' | 'beta' | 'dc' | 'hprs'
/** Three states keep "reported absent" apart from "not found". The data records both and they mean different things. */
type St = 'yes' | 'absent' | 'unknown'

const METRICS: { id: Metric; label: string; yes: string; absent: string; unknown: string }[] = [
  { id: 'hosp', label: 'Hospital records', yes: 'A hospital record system is reported', absent: 'The official reply reports none', unknown: '' },
  { id: 'beta', label: 'National EMR beta clinics', yes: 'Clinics in the beta (darker means more)', absent: 'None reported', unknown: '' },
  { id: 'dc', label: 'Joined-up data centre', yes: 'A data centre or pilot is documented', absent: '', unknown: 'None found in public sources' },
  { id: 'hprs', label: 'Patient registry (HPRS)', yes: 'Figures or detail reported', absent: '', unknown: 'No figures found' },
]
const MAXB = Math.max(...PROVINCES.map((p) => PROV_DATA[p].beta))
const state = (m: Metric, d: ProvinceInfo): St =>
  m === 'hosp' ? (d.none ? 'absent' : 'yes') : m === 'beta' ? (d.beta > 0 ? 'yes' : 'absent') : m === 'dc' ? (d.dc ? 'yes' : 'unknown') : /^No figures/.test(d.hprs) ? 'unknown' : 'yes'
const short = (d: ProvinceInfo) => (d.none ? 'None reported' : (d.hosp ?? '').split(' · ')[0])
const NUDGE: Record<string, [number, number]> = { Gauteng: [-74, -34], Mpumalanga: [16, 8] }

const ROWS: [string, (d: ProvinceInfo) => string][] = [
  ['Hospital records', (d) => d.hosp ?? 'None reported'],
  ['Clinic records', (d) => d.phc],
  ['National EMR beta clinics', (d) => String(d.beta)],
  ['Joined-up data centre', (d) => d.dc ?? 'None found in public sources'],
  ['Patient registry (HPRS) in use', (d) => d.hprs],
  ['Other digital activity', (d) => d.other ?? 'None found'],
]

export function Provinces({ sel, setSel }: { sel: string; setSel: (p: string) => void }) {
  const nav = useNav()
  const [metric, setMetric] = useState<Metric>('hosp')
  const [pins, setPins] = useState<string[]>(['Western Cape', 'Limpopo'])
  const withH = PROVINCES.filter((p) => !PROV_DATA[p].none).length
  const M = METRICS.find((m) => m.id === metric)!
  const d = PROV_DATA[sel]
  const togglePin = (p: string) => setPins((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p].slice(-4)))
  const sys = provinceSystems(sel)
  const jr = provinceJourneys(sel)

  const fill = (p: string) => {
    const x = PROV_DATA[p], s = state(metric, x)
    if (s === 'absent') return 'url(#hatch)'
    if (s === 'unknown') return 'url(#dots)'
    return metric === 'beta' ? `rgba(238, 147, 168, ${0.22 + 0.68 * (x.beta / MAXB)})` : '#e7e1d3'
  }
  const label = (p: string) => { const s = state(metric, PROV_DATA[p]); return s === 'yes' ? M.yes : s === 'absent' ? M.absent : M.unknown }

  // Where the selected province sits among the others, counted from the records.
  const same = (m: Metric) => PROVINCES.filter((p) => p !== sel && state(m, PROV_DATA[p]) === state(m, d)).length
  const dcList = PROVINCES.filter((p) => PROV_DATA[p].dc)

  return (
    <div className="prov">
      <section className="prov-lede" data-tour="prov-grid">
        <div className="pl-fig"><b>{withH}<small> of 9</small></b><span>provinces report a hospital record system</span></div>
        <div className="pl-fig bad"><b>{9 - withH}<small> of 9</small></b><span>report none, according to the parliamentary reply</span></div>
        <p className="pl-note">Each province that does run a hospital system runs a different one. Where this page says “none found”, nothing was found in public sources. That is different from a reported absence.</p>
      </section>

      <section className="prov-main">
        <div className="prov-mapcol">
          <div className="seg" role="group" aria-label="Map shows">
            {METRICS.map((m) => <button key={m.id} aria-pressed={metric === m.id} onClick={() => setMetric(m.id)}>{m.label}</button>)}
          </div>
          <svg className="pmap" viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="group" aria-label={`Map of the nine provinces coloured by: ${M.label}`}>
            <defs>
              <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="9" height="9" fill="#171513" /><line x1="0" y1="0" x2="0" y2="9" stroke="#6b6458" strokeWidth="2.2" />
              </pattern>
              <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill="#1c1a18" /><circle cx="5" cy="5" r="1.7" fill="#6f695d" />
              </pattern>
            </defs>
            {PROVINCES.map((p) => (
              <path key={p} d={SHAPES[p]} fill={fill(p)} className={'pshape' + (sel === p ? ' on' : '') + (pins.includes(p) ? ' pinned' : '')} tabIndex={0} role="button"
                aria-label={`${p}: ${label(p)}`} aria-pressed={sel === p}
                onClick={() => setSel(p)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(p) } }} />
            ))}
            {PROVINCES.map((p) => {
              const [cx, cy] = CENTRES[p]
              const [x, y] = [cx + (NUDGE[p]?.[0] ?? 0), cy + (NUDGE[p]?.[1] ?? 0)]
              const dark = state(metric, PROV_DATA[p]) === 'yes' && (metric !== 'beta' || PROV_DATA[p].beta / MAXB > 0.5)
              return (
                <g key={p} className={'plabel' + (dark ? ' lt' : '')} transform={`translate(${x} ${y})`} pointerEvents="none">
                  <text y={-4}>{p}</text>
                  {metric === 'beta' && <text y={20} className="pn">{PROV_DATA[p].beta}</text>}
                </g>
              )
            })}
          </svg>
          <div className="pkey" aria-label="Map key">
            <span><i className="y" />{M.yes}</span>
            {M.absent && <span><i className="n" />{M.absent}</span>}
            {M.unknown && <span><i className="u" />{M.unknown}</span>}
          </div>
        </div>

        <article className="prov-card" aria-live="polite">
          <div className="pc-head"><code>PROVINCE</code><h2>{sel}</h2>{d.none && <span className="tagno">no hospital EMR reported</span>}</div>
          <dl>
            <div><dt>Hospital records</dt><dd>{d.hosp ?? <span className="absent">None reported in the official reply</span>}</dd></div>
            <div><dt>Clinic records</dt><dd>{d.phc}{d.beta > 0 && <small>{d.beta} clinics in the National EMR beta (Aug 2025)</small>}</dd></div>
            <div><dt>Joined-up data centre</dt><dd>{d.dc ?? <span className="absent">None found in public sources</span>}</dd></div>
            <div><dt>Patient registry (HPRS)</dt><dd>{d.hprs}</dd></div>
            {d.other && <div><dt>Other digital activity</dt><dd>{d.other}</dd></div>}
          </dl>

          <h3>Where it sits among the nine</h3>
          <ul className="pc-ctx">
            <li><b>Hospital records:</b> {same('hosp')} of the other 8 provinces are in the same position ({state('hosp', d) === 'yes' ? 'a system reported' : 'none reported'}).</li>
            <li><b>Data centre:</b> documented in {dcList.map((p) => p).join(' and ')}; none found for the other {9 - dcList.length}.</li>
            <li><b>EMR beta:</b> {d.beta > 0 ? `${d.beta} clinics here. The most in any province is ${MAXB}.` : 'no clinics reported here.'}</li>
          </ul>

          <h3>Systems recorded for this province</h3>
          {sys.length === 0 ? <p className="none-note">No province-specific system is recorded. National systems apply here too.</p> : (
            <div className="chips">{sys.map((n) => <button key={n.id} className="chip" onClick={() => nav.openNode(n.id)}><i style={{ background: SECTOR[n.sector].color }} />{n.name}</button>)}</div>
          )}
          <h3>Journeys that pass through them</h3>
          {jr.length === 0 ? <p className="none-note">No journey follows this province’s systems.</p> : (
            <div className="chips">{jr.map((j) => <button key={j.id} className="chip" onClick={() => nav.goJourney(j.id)}>{j.title}</button>)}</div>
          )}

          <h3>Evidence</h3>
          <Sources ids={d.src} onOpen={nav.goSource} />
          <div className="acts">
            <button className="btn" aria-pressed={pins.includes(sel)} onClick={() => togglePin(sel)}>{pins.includes(sel) ? '✓ In comparison' : 'Add to comparison'}</button>
            <button className="btn" onClick={() => nav.goLandscapeProvince(sel)}>See it on the landscape</button>
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
                <span role="cell" className={'lg-dot' + (x.dc ? ' y' : '')}>{x.dc ? 'Documented' : 'None found'}</span>
                <span role="cell" className={'lg-dot' + (state('hprs', x) === 'yes' ? ' y' : '')}>{state('hprs', x) === 'yes' ? 'Detail reported' : 'No figures found'}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="prov-cmp">
        <h3>Compare two to four provinces</h3>
        <div className="chips">{PROVINCES.map((p) => <button key={p} className="chip" aria-pressed={pins.includes(p)} onClick={() => togglePin(p)}>{p}</button>)}</div>
        {pins.length < 2 ? <p className="none-note" style={{ marginTop: 12 }}>Choose at least two provinces to see them side by side. Differences are marked.</p> : (
          <div className="cmp-table prov-cmp-t" style={{ ['--n' as string]: pins.length }} role="table">
            <div className="cmp-row cmp-head" role="row"><div className="cmp-l" /> {pins.map((p) => <div key={p} className="cmp-c" role="columnheader"><button className="cmp-name" onClick={() => setSel(p)}>{p}</button></div>)}</div>
            {ROWS.map(([l, f]) => {
              const vals = pins.map((p) => f(PROV_DATA[p]))
              const diff = new Set(vals).size > 1
              return (
                <div key={l} role="row" className={'cmp-row' + (diff ? ' diff' : ' same')}>
                  <div className="cmp-l" role="rowheader"><b>{l}</b><span className="cmp-flag">{diff ? 'Differs' : 'Same'}</span></div>
                  {vals.map((v, i) => <div key={pins[i]} role="cell" className="cmp-c" data-sys={pins[i]}>{v}</div>)}
                </div>
              )
            })}
            <div role="row" className="cmp-row"><div className="cmp-l" role="rowheader"><b>Sources</b></div>
              {pins.map((p) => <div key={p} role="cell" className="cmp-c" data-sys={p}><div className="dos-src">{PROV_DATA[p].src.map((s) => <button key={s} className="srcid" onClick={() => nav.goSource(s)}>{s}</button>)}</div></div>)}</div>
          </div>
        )}
      </section>

      <p className="pnote">Hospital counts come from the parliamentary reply of 28 May 2026. Clinic beta counts come from the reply of 1 August 2025. Registry details come from provincial briefings in June 2025, press reports and the research notes. Hatching means a source reports none. Dots mean nothing was found in public sources, which does not mean nothing exists. Province outlines are simplified. National systems such as {BY_ID.hprs.alias} apply in every province.</p>
    </div>
  )
}
