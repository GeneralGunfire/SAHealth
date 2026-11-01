import { NODES } from '../data/nodes'
import { EDGES } from '../data/flows'
import { LAYERS, SECTOR } from '../data/meta'
import { isVisible } from '../layout'
import { Icon } from '../components/Icon'
import { ConfGlyph, Soon, StatusTag } from '../components/ui'
import type { Lens } from '../types'

/** Small-screen form of the landscape: the same eleven layers as a readable list. */
export function LayerList({ sim, simple, lens, prov, sel, onSelect }: { sim: boolean; simple: boolean; lens: Lens; prov: string; sel: string | null; onSelect: (id: string) => void }) {
  const vis = NODES.filter((n) => isVisible(n, { W: 0, view: sim ? 'sim' : 'landscape', simple, prov, jnodes: null }) && (lens === 'all' || n.lens.includes(lens)))
  const links = (id: string) => EDGES.filter((e) => e.a === id || e.b === id).length
  return (
    <div className="layerlist">
      {sim && (
        <div className="ll-gw"><Soon>Coming soon</Soon><b>SAHealth gateway</b><small>Planned for Phase 2. Not built, and not connected to anything yet.</small></div>
      )}
      {LAYERS.map((L, li) => {
        const here = vis.filter((n) => n.layer === L.id)
        if (!here.length) return null
        return (
          <section key={L.id} className="ll-layer">
            <h3><code>L{String(LAYERS.length - li).padStart(2, '0')}</code>{L.name}<small>{here.length}</small></h3>
            <ul>
              {here.map((n) => (
                <li key={n.id}>
                  <button className={'ll-row st-' + n.status + (n.core ? ' core' : '') + (sel === n.id ? ' sel' : '') + (sim && !n.sim ? ' hollow' : '') + (sim && n.sim ? ' modelled' : '')} onClick={() => onSelect(n.id)} style={{ ['--c' as string]: SECTOR[n.sector].color }}>
                    <span className="ll-ico"><Icon name={n.icon} size={22} /><i /></span>
                    <span className="ll-t"><b>{n.name}</b>{n.alias && <code>{n.alias}</code>}
                      <small>{SECTOR[n.sector].name} · <ConfGlyph conf={n.conf} size={9} /> {n.conf} · {links(n.id)} link{links(n.id) === 1 ? '' : 's'}</small>
                      {sim && n.sim && <small className="ll-stand">stand-in · {n.sim[0]}</small>}</span>
                    <StatusTag status={n.status} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {vis.length === 0 && <p className="none-note">No systems match these filters.</p>}
    </div>
  )
}
