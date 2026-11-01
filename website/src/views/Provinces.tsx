import { useState } from 'react'
import { PGRID, PROV_DATA, PROVINCES } from '../data/meta'
import { Icon } from '../components/Icon'
import { BY_ID } from '../data/nodes'
import { SECTOR, SRC } from '../data/meta'

export function Provinces({ onSee, onSystem }: { onSee: (p: string) => void; onSystem: (id: string) => void }) {
  const [cmp, setCmp] = useState<string[]>([])
  const withH = PROVINCES.filter((p) => !PROV_DATA[p].none).length
  const toggle = (p: string) => setCmp((c) => (c.includes(p) ? c.filter((x) => x !== p) : [...c, p].slice(-2)))
  const nat = ['hprs', 'nhls', 'dhis2', 'tier', 'hpcsa', 'icd10'].map((id) => BY_ID[id])
  const rows: [string, (d: (typeof PROV_DATA)[string]) => string][] = [
    ['Hospital records', (d) => d.hosp ?? 'None reported'],
    ['Clinic records', (d) => d.phc],
    ['National EMR beta clinics', (d) => String(d.beta)],
    ['Joined-up data centre', (d) => d.dc ?? 'None found yet'],
    ['Patient registry (HPRS) in use', (d) => d.hprs],
    ['Other digital activity', (d) => d.other ?? 'None found'],
  ]
  return (
    <div>
      <div className="pexplain">
        <div className="pbox">
          <h4>The same in every province</h4>
          <div className="chips">
            {nat.map((n) => <button key={n.id} className="chip" onClick={() => onSystem(n.id)} style={{ borderColor: SECTOR[n.sector].color }}>{n.name} · {n.alias}</button>)}
          </div>
          <p style={{ marginTop: 12 }}>National registries, labs, reporting and code sets work the same way everywhere. Click one to read about it.</p>
        </div>
        <div className="pbox">
          <h4>What changes by province</h4>
          <p><b style={{ color: 'var(--ink)' }}>{withH} of 9</b> provinces report a hospital record system and <b style={{ color: 'var(--red)' }}>{9 - withH}</b> report none. Even where one exists, each province runs a different system.</p>
        </div>
      </div>
      <div className="pgrid" data-tour="prov-grid">
        {PGRID.flat().map((p) => {
          const d = PROV_DATA[p]
          return (
            <div key={p} className={'pcard' + (d.none ? ' none' : '') + (cmp.includes(p) ? ' cmp' : '')}>
              <h3>{p}{d.none && <span className="tagno">no hospital EMR reported</span>}</h3>
              <div className="prow"><span className="pi"><Icon name="db" size={17} /></span><div><small>Hospital records</small>{d.hosp ?? <span className="absent">None reported</span>}</div></div>
              <div className="prow"><span className="pi"><Icon name="paper" size={17} /></span><div><small>Clinic records</small>{d.phc}
                {d.beta > 0 && <><div className="beta">{Array.from({ length: d.beta }, (_, i) => <i key={i} />)}</div><span style={{ fontSize: 12, color: 'var(--mute)' }}>{d.beta} clinics in the National EMR beta (Aug 2025)</span></>}</div></div>
              <div className="prow"><span className="pi"><Icon name="hub" size={17} /></span><div><small>Joined-up data centre</small>{d.dc ?? <span className="absent">None found yet</span>}</div></div>
              <div className="prow"><span className="pi"><Icon name="person" size={17} /></span><div><small>Patient registry (HPRS) in use</small>{d.hprs}</div></div>
              {d.other && <div className="prow"><span className="pi"><Icon name="image" size={17} /></span><div><small>Other digital activity</small>{d.other}</div></div>}
              <div className="psrc">{d.src.map((s) => SRC[s] && <a key={s} href={SRC[s].url} target="_blank" rel="noreferrer" title={SRC[s].title}>{SRC[s].title.split(/[,(:]/)[0]}</a>)}</div>
              <div className="acts">
                <button className="btn" aria-pressed={cmp.includes(p)} onClick={() => toggle(p)}>{cmp.includes(p) ? '✓ In comparison' : 'Add to comparison'}</button>
                <button className="btn" onClick={() => onSee(p)}>See on landscape</button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="cmp">
        {cmp.length < 2 ? (
          <div className="pbox" style={{ marginTop: 18 }}><h4>Compare two provinces</h4><p>Choose <b>Add to comparison</b> on any two province cards and they appear side by side here, with the differences highlighted.</p></div>
        ) : (
          <table style={{ marginTop: 18 }}>
            <thead><tr><th /><th>{cmp[0]}</th><th>{cmp[1]}</th></tr></thead>
            <tbody>{rows.map(([l, f]) => { const x = f(PROV_DATA[cmp[0]]), y = f(PROV_DATA[cmp[1]]); const diff = x !== y; return <tr key={l}><th>{l}</th><td className={diff ? 'diff' : ''}>{x}</td><td className={diff ? 'diff' : ''}>{y}</td></tr> })}</tbody>
          </table>
        )}
      </div>
      <p className="pnote">Hospital counts come from the parliamentary reply of 28 May 2026; clinic beta counts from the reply of 1 August 2025; registry details from provincial briefings in June 2025, press reports and the research notes. Gaps in a card mean nothing was found in public sources, not that nothing exists. Tile positions are a simplified layout, not a map.</p>
    </div>
  )
}
