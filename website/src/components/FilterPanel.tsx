import { LAYERS, SECTORS } from '../data/meta'
import { NODES } from '../data/nodes'
import { activeCount, isEmpty, toggle, type Filters } from '../filters'
import { Conf, STATUS_TEXT } from './ui'
import type { Confidence, Status } from '../types'

const STATUSES: Status[] = ['live', 'beta', 'legacy', 'paper']
const CONFS: Confidence[] = ['confirmed', 'likely', 'uncertain']

/** Count how many systems each option would show, so a filter never leads to a surprise empty map. */
const count = (pick: (n: (typeof NODES)[number]) => boolean) => NODES.filter(pick).length

export function FilterPanel({ f, set, onClose }: { f: Filters; set: (f: Filters) => void; onClose: () => void }) {
  const Chip = ({ on, label, n, onClick }: { on: boolean; label: React.ReactNode; n?: number; onClick: () => void }) => (
    <button className="fchip" aria-pressed={on} onClick={onClick}>{label}{n !== undefined && <small>{n}</small>}</button>
  )
  return (
    <div className="fpanel" role="dialog" aria-label="Filters">
      <div className="fp-head"><h4>Filter the landscape</h4>
        <div><button className="link" disabled={isEmpty(f)} onClick={() => set({ layers: [], sectors: [], status: [], conf: [], q: f.q, hlKey: false })}>Reset filters</button>
          <button className="link" onClick={onClose}>Done</button></div></div>
      <p className="fp-note">Layers, sectors, status and confidence hide systems that do not match. Choose none to show all.</p>
      <div className="fp-cols">
        <section><h5>Layers</h5><div className="fp-list">{LAYERS.map((l) => <Chip key={l.id} on={f.layers.includes(l.id)} label={l.name} n={count((n) => n.layer === l.id)} onClick={() => set({ ...f, layers: toggle(f.layers, l.id) })} />)}</div></section>
        <section><h5>Sectors</h5><div className="fp-list">{SECTORS.map((s) => <Chip key={s.id} on={f.sectors.includes(s.id)} label={<><i className="pip" style={{ background: s.color }} />{s.name}</>} n={count((n) => n.sector === s.id)} onClick={() => set({ ...f, sectors: toggle(f.sectors, s.id) })} />)}</div>
          <h5>Status</h5><div className="fp-list">{STATUSES.map((s) => <Chip key={s} on={f.status.includes(s)} label={STATUS_TEXT[s]} n={count((n) => n.status === s)} onClick={() => set({ ...f, status: toggle(f.status, s) })} />)}</div>
          <h5>Confidence</h5><div className="fp-list">{CONFS.map((c) => <Chip key={c} on={f.conf.includes(c)} label={<Conf conf={c} />} n={count((n) => n.conf === c)} onClick={() => set({ ...f, conf: toggle(f.conf, c) })} />)}</div>
          <h5>Emphasis</h5><div className="fp-list"><Chip on={f.hlKey} label="Highlight key systems" onClick={() => set({ ...f, hlKey: !f.hlKey })} /></div></section>
      </div>
    </div>
  )
}

/** The row of active filters under the toolbar, each removable. */
export function FilterBar({ f, set, shown, total, onReset }: { f: Filters; set: (f: Filters) => void; shown: number; total: number; onReset: () => void }) {
  if (isEmpty(f)) return null
  const lname = (id: string) => LAYERS.find((l) => l.id === id)!.name
  const sname = (id: string) => SECTORS.find((s) => s.id === id)!.name
  const X = ({ label, onClick }: { label: string; onClick: () => void }) => <button className="fchip on" onClick={onClick} aria-label={`Remove filter ${label}`}>{label}<span aria-hidden> ×</span></button>
  return (
    <div className="fbar" role="status">
      <span>Showing <b>{shown}</b> of {total} systems · {activeCount(f)} filter{activeCount(f) === 1 ? '' : 's'}</span>
      {f.layers.map((l) => <X key={l} label={lname(l)} onClick={() => set({ ...f, layers: toggle(f.layers, l) })} />)}
      {f.sectors.map((s) => <X key={s} label={sname(s)} onClick={() => set({ ...f, sectors: toggle(f.sectors, s) })} />)}
      {f.status.map((s) => <X key={s} label={STATUS_TEXT[s]} onClick={() => set({ ...f, status: toggle(f.status, s) })} />)}
      {f.conf.map((c) => <X key={c} label={c} onClick={() => set({ ...f, conf: toggle(f.conf, c) })} />)}
      {f.q.trim() && <X label={`“${f.q.trim()}”`} onClick={() => set({ ...f, q: '' })} />}
      {f.hlKey && <X label="Key systems highlighted" onClick={() => set({ ...f, hlKey: false })} />}
      <button className="link" onClick={onReset}>Reset all</button>
    </div>
  )
}
