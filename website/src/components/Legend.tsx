import { NODES } from '../data/nodes'
import { ICON_LABEL, LINK_LABEL, SECTORS } from '../data/meta'
import { Icon } from './Icon'
import { Conf, Soon } from './ui'
import type { IconName } from '../types'

const LINES = [
  { k: 'live', t: 'Live link', d: 'Data moves between the two systems on its own.' },
  { k: 'batch', t: 'Regular batch', d: 'Data moves on a schedule, as a file or an extract.' },
  { k: 'manual', t: 'Retyped or carried by hand', d: 'A person copies or carries it.' },
  { k: 'break', t: 'Data stops here', d: 'Shown in journeys: the point where it goes no further.' },
] as const

export function Legend({ sim = false, onClose }: { sim?: boolean; onClose?: () => void }) {
  const icons = [...new Set(NODES.map((n) => n.icon))] as IconName[]
  return (
    <div className="legendpanel" role="region" aria-label="Key">
      <div className="lp-head"><h4>Key</h4>{onClose && <button className="lp-x" onClick={onClose} aria-label="Close key">Close</button>}</div>
      <div className="lp-cols">
        <section>
          <h5>Connections</h5>
          {LINES.map((l) => (
            <div className="lp-line" key={l.k}><i className={'lk lk-' + l.k} /><span><b>{l.k === 'break' ? l.t : LINK_LABEL[l.k]}</b><small>{l.d}</small></span></div>
          ))}
        </section>
        <section>
          <h5>System status</h5>
          <div className="lp-st"><i className="nd-demo st-live" /><span><b>Live</b><small>In use</small></span></div>
          <div className="lp-st"><i className="nd-demo st-beta" /><span><b>Beta</b><small>Dashed outline: being rolled out</small></span></div>
          <div className="lp-st"><i className="nd-demo st-legacy" /><span><b>Legacy</b><small>Hatched: old but still running</small></span></div>
          <div className="lp-st"><i className="nd-demo st-paper" /><span><b>Paper</b><small>Dotted and hatched: a physical record</small></span></div>
          <div className="lp-st"><i className="nd-demo core" /><span><b>Key system</b><small>Inverted tile: shown in the short view</small></span></div>
        </section>
        <section>
          <h5>Who runs it</h5>
          {SECTORS.map((s) => <div className="lp-sec" key={s.id}><i style={{ background: s.color }} /><b>{s.name}</b><small>{s.sub}</small></div>)}
          <h5>How sure we are</h5>
          {(['confirmed', 'likely', 'uncertain'] as const).map((c) => <div key={c} className="lp-conf"><Conf conf={c} long /></div>)}
        </section>
        <section>
          <h5>Icons</h5>
          <div className="lp-icons">{icons.map((k) => <span key={k}><i><Icon name={k} size={14} /></i>{ICON_LABEL[k]}</span>)}</div>
          {sim && <>
            <h5>In the simulation</h5>
            <div className="lp-sim"><i className="nd-demo modelled" /><span><b>DEXA stand-in</b><small>A test database that mimics the real system. Not a real connection.</small></span></div>
            <div className="lp-sim"><i className="nd-demo hollow" /><span><b>No stand-in yet</b><small>The real system exists; DEXA has not modelled it.</small></span></div>
            <div className="lp-sim"><Soon /><span><small>Anything DEXA intends to build</small></span></div>
          </>}
        </section>
      </div>
    </div>
  )
}
