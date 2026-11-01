import { BY_ID } from '../data/nodes'
import { JOURNEYS } from '../data/flows'
import { LINK_LABEL, SECTOR } from '../data/meta'
import { journeyNodeIds } from '../data/derived'
import { useNav } from '../nav'
import type { Journey, JStep } from '../types'

/** Suggested pairs. They are only offered where both journeys exist in the data. The label says how close the pair is. */
export const SUGGESTED: { a: string; b: string; label: string }[] = [
  { a: 'lab', b: 'privlab', label: 'Public lab result and private lab result' },
  { a: 'echosp', b: 'privhosp', label: 'Public hospital admission and private hospital stay' },
  { a: 'referral', b: 'gp', label: 'Public clinic referral and private GP visit (closest available pair)' },
].filter((s) => JOURNEYS.some((j) => j.id === s.a) && JOURNEYS.some((j) => j.id === s.b))

const KIND = { live: 'Live link', batch: 'Regular batch', manual: 'Retyped or carried by hand', break: 'Data stops here' } as const
const stat = (j: Journey) => {
  const ids = journeyNodeIds(j)
  const cnt = { live: 0, batch: 0, manual: 0, break: 0 }
  j.steps.forEach((s) => { cnt[s.k]++ })
  const last = j.steps[j.steps.length - 1]
  const recv = new Set<string>()
  j.steps.forEach((s) => { if (s.k !== 'break') recv.add(SECTOR[BY_ID[s.t].sector].name) })
  return { ids, cnt, copies: 1 + cnt.manual + cnt.batch, stops: last.k === 'break' ? `${BY_ID[last.f].name}, then it stops` : 'It reaches the end of its path', sectors: [...recv].sort().join(', ') }
}

export function JourneyCompare({ aId, bId, setB, onClose }: { aId: string; bId: string; setB: (id: string) => void; onClose: () => void }) {
  const nav = useNav()
  const A = JOURNEYS.find((j) => j.id === aId)!, B = JOURNEYS.find((j) => j.id === bId)!
  const sa = stat(A), sb = stat(B)
  const both = sa.ids.filter((i) => sb.ids.includes(i)), onlyA = sa.ids.filter((i) => !sb.ids.includes(i)), onlyB = sb.ids.filter((i) => !sa.ids.includes(i))
  const rows: [string, string, string][] = [
    ['Steps', String(A.steps.length), String(B.steps.length)],
    ['Systems involved', String(sa.ids.length), String(sb.ids.length)],
    ['Live links', String(sa.cnt.live), String(sb.cnt.live)],
    ['Regular batches', String(sa.cnt.batch), String(sb.cnt.batch)],
    ['Retyped or carried by hand', String(sa.cnt.manual), String(sb.cnt.manual)],
    ['Copies of the data', String(sa.copies), String(sb.copies)],
    ['Points where data stops', String(sa.cnt.break), String(sb.cnt.break)],
    ['How it ends', sa.stops, sb.stops],
    ['Sectors that receive the data', sa.sectors, sb.sectors],
  ]
  const Chips = ({ ids }: { ids: string[] }) => ids.length ? <div className="chips">{ids.map((i) => <button key={i} className="chip" onClick={() => nav.openNode(i)}>{BY_ID[i].name}</button>)}</div> : <span className="muted">None</span>
  const Timeline = ({ j }: { j: Journey }) => (
    <ol className="jc-tl">
      {j.steps.map((s: JStep, i) => (
        <li key={i} className={'k-' + s.k}>
          <i className={'lk lk-' + s.k} aria-hidden />
          <div><b>{s.h}</b><small>{BY_ID[s.f].name} {s.k === 'break' ? '⊣' : '→'} {BY_ID[s.t].name}</small><em>{KIND[s.k]}{s.lbl && s.k !== 'break' ? ` · ${s.lbl}` : ''}</em></div>
        </li>
      ))}
    </ol>
  )
  return (
    <section className="jc" aria-label="Journey comparison">
      <div className="jc-head">
        <h3>Comparing two journeys</h3>
        <label>Compare “{A.title}” with
          <select className="sel" value={bId} onChange={(e) => setB(e.target.value)}>
            {JOURNEYS.filter((j) => j.id !== aId).map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </label>
        <button className="link" onClick={onClose}>Close comparison</button>
      </div>
      <div className="jc-table" role="table">
        <div className="jc-r jc-th" role="row"><span /><b>{A.title}</b><b>{B.title}</b></div>
        {rows.map(([l, x, y]) => (
          <div key={l} role="row" className={'jc-r' + (x !== y ? ' diff' : '')}><span role="rowheader">{l}</span><span role="cell" data-j={A.title}>{x}</span><span role="cell" data-j={B.title}>{y}</span></div>
        ))}
      </div>
      <div className="jc-sys">
        <div><h4>Only in “{A.title}”</h4><Chips ids={onlyA} /></div>
        <div><h4>In both</h4><Chips ids={both} /></div>
        <div><h4>Only in “{B.title}”</h4><Chips ids={onlyB} /></div>
      </div>
      <div className="jc-cols"><div><h4>{A.title}</h4><Timeline j={A} /></div><div><h4>{B.title}</h4><Timeline j={B} /></div></div>
      <p className="srcx-note">Journeys are simplified from published sources. This comparison is counted from the two journey records, so it shows how each is written up. It is not a measured audit of either system.</p>
    </section>
  )
}
