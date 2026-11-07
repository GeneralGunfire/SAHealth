import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { NODES } from '../data/nodes'
import { LAYERS, PROVINCES, PROV_DATA, SECTORS } from '../data/meta'
import { NODE, LINK_COLOR, LINK_NAME, neighbours, layerName } from '../lib/model'
import { ConfBadge, PageHead, StatusBadge, SysIcon } from '../components/ui'
import type { Lens } from '../types'

const LENSES: [Lens, string][] = [['all', 'All'], ['identity', 'Identity'], ['clinical', 'Clinical'], ['aggregate', 'Reporting'], ['lab', 'Lab'], ['claims', 'Claims']]
const ROWS = [...LAYERS].reverse() // people and registries first, standards last

type Line = { id: string; d: string; color: string; dash?: string }

export default function MapPage() {
  const [params, setParams] = useSearchParams()
  const prov = PROVINCES.includes(params.get('province') ?? '') ? (params.get('province') as string) : 'all'
  const [lens, setLens] = useState<Lens>('all')
  const [keyOnly, setKeyOnly] = useState(false)
  const [sel, setSel] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([])

  const gridRef = useRef<HTMLDivElement>(null)
  const pills = useRef<Record<string, HTMLButtonElement | null>>({})

  const visible = useMemo(
    () => NODES.filter((n) =>
      (lens === 'all' || n.lens.includes(lens)) &&
      (!keyOnly || n.core) &&
      (prov === 'all' || !n.provs || n.provs.includes(prov))),
    [lens, keyOnly, prov],
  )
  const ids = useMemo(() => new Set(visible.map((n) => n.id)), [visible])
  const provNone = prov !== 'all' && PROV_DATA[prov]?.none
  const links = sel ? neighbours(sel).filter((x) => ids.has(x.other.id)) : []
  const related = new Set(links.map((x) => x.other.id))
  const current = sel ? NODE[sel] : null

  useEffect(() => { if (sel && !ids.has(sel)) setSel(null) }, [ids, sel])

  // draw lines from the selected system to the ones it connects to
  useLayoutEffect(() => {
    const g = gridRef.current
    if (!g || !sel) { setLines([]); return }
    const draw = () => {
      const gr = g.getBoundingClientRect()
      const centre = (id: string) => {
        const el = pills.current[id]
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { x: r.left - gr.left + r.width / 2, y: r.top - gr.top + r.height / 2 }
      }
      const a = centre(sel)
      if (!a) { setLines([]); return }
      const out: Line[] = []
      for (const { other, edge } of neighbours(sel)) {
        const b = centre(other.id)
        if (!b) continue
        const my = (a.y + b.y) / 2
        out.push({
          id: other.id,
          d: `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`,
          color: LINK_COLOR[edge.type],
          dash: edge.type === 'batch' ? '7 5' : edge.type === 'manual' ? '2 5' : undefined,
        })
      }
      setLines(out)
    }
    draw()
    const ro = new ResizeObserver(draw)
    ro.observe(g)
    return () => ro.disconnect()
  }, [sel, visible])

  const setProvince = (p: string) => {
    const next = new URLSearchParams(params)
    if (p === 'all') next.delete('province'); else next.set('province', p)
    setParams(next, { replace: true })
  }

  return (
    <div className="pg">
      <PageHead
        eyebrow="Map"
        title="Every system, in one picture"
        blurb="Rows show what a system does. Columns show who runs it. Select any system to see exactly what it connects to, and how."
      />

      <div className="bar">
        <div className="bar__group">
          <span className="bar__label">Show</span>
          <div className="seg" role="group" aria-label="Filter by kind of data">
            {LENSES.map(([id, l]) => <button key={id} type="button" aria-pressed={lens === id} onClick={() => setLens(id)}>{l}</button>)}
          </div>
        </div>
        <div className="bar__group">
          <span className="bar__label">Province</span>
          <select className="select" value={prov} onChange={(e) => setProvince(e.target.value)} aria-label="Province">
            <option value="all">All of South Africa</option>
            {PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="bar__group bar__grow">
          <div className="seg" role="group" aria-label="Detail">
            <button type="button" aria-pressed={!keyOnly} onClick={() => setKeyOnly(false)}>All systems</button>
            <button type="button" aria-pressed={keyOnly} onClick={() => setKeyOnly(true)}>Key systems</button>
          </div>
        </div>
      </div>

      {prov !== 'all' && (
        <div className={`callout${PROV_DATA[prov].none ? ' callout--warn' : ''}`} style={{ marginBottom: 14 }}>
          <strong>{prov}.</strong> Hospitals: {PROV_DATA[prov].hosp ?? 'no hospital record system reported'}. Clinics: {PROV_DATA[prov].phc}.{' '}
          <Link to="/provinces" className="inline">Compare provinces</Link>
        </div>
      )}

      <div className={`lmain${current ? ' lmain--open' : ''}`}>
        <div className="lmap__scroll">
          <div className="lmap" ref={gridRef}>
            <svg className="lmap__lines" aria-hidden="true">
              {lines.map((l) => (
                <path key={l.id} d={l.d} fill="none" stroke={l.color} strokeWidth={2.4} strokeLinecap="round" strokeDasharray={l.dash} />
              ))}
            </svg>

            <div className="lmap__cols">
              <div />
              {SECTORS.map((s) => (
                <div className="lmap__colhead" key={s.id}>
                  <b><i style={{ background: s.color }} />{s.name}</b>
                  <small>{s.sub}</small>
                </div>
              ))}
            </div>

            {ROWS.map((L) => {
              const inRow = visible.filter((n) => n.layer === L.id)
              const showNote = L.id === 'hospital' && provNone
              if (!inRow.length && !showNote) return null
              return (
                <div className="lmap__row" key={L.id}>
                  <div className="lmap__rowhead">{L.name}</div>
                  {SECTORS.map((s) => {
                    const cell = inRow.filter((n) => n.sector === s.id)
                    return (
                      <div className="lmap__cell" key={s.id}>
                        {showNote && s.id === 'public' && !cell.length && (
                          <div className="nobox">No hospital record system reported</div>
                        )}
                        {cell.map((n) => (
                          <button
                            key={n.id} type="button"
                            ref={(el) => { pills.current[n.id] = el }}
                            className={`pill${sel === n.id ? ' is-sel' : ''}${sel && related.has(n.id) ? ' is-rel' : ''}${sel && sel !== n.id && !related.has(n.id) ? ' is-dim' : ''}`}
                            aria-pressed={sel === n.id}
                            title={n.alias ? `${n.name} (${n.alias})` : n.name}
                            onClick={() => setSel(sel === n.id ? null : n.id)}
                          >
                            <SysIcon node={n} size="sm" />
                            <span>{n.name}</span>
                          </button>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <p className="lmap__count">
            Showing {visible.length} of {NODES.length} systems.
            {!sel && ' Select a system to draw its connections.'}
          </p>
        </div>

        {current && (
          <aside className="lpanel" aria-label={`${current.name}, details`}>
            <button type="button" className="lpanel__x" onClick={() => setSel(null)} aria-label="Close details">×</button>
            <div className="lpanel__head">
              <SysIcon node={current} size="lg" />
              <div>
                <h2>{current.name}</h2>
                {current.alias && <p className="lpanel__alias">{current.alias}</p>}
              </div>
            </div>
            <div className="lpanel__tags">
              <span className="chip">{layerName(current)}</span>
              <StatusBadge status={current.status} />
              <ConfBadge conf={current.conf} />
            </div>
            <p className="lpanel__sum clamp4">{current.summary}</p>
            <Link to={`/systems/${current.id}`} className="btn btn--dark btn--sm">Open full details</Link>

            <h3 className="lpanel__h">Connections ({links.length})</h3>
            {links.length === 0 ? (
              <p className="callout">No connection is documented between this system and any other shown here.</p>
            ) : (
              <ul className="conns">
                {links.map(({ other, edge }) => (
                  <li key={other.id}>
                    <button type="button" className="conn" onClick={() => setSel(other.id)}>
                      <SysIcon node={other} size="sm" />
                      <span className="conn__main">
                        <b>{other.name}</b>
                        <small>{edge.what}</small>
                      </span>
                      <span className="conn__type" style={{ ['--lc' as string]: LINK_COLOR[edge.type] }}>
                        <i />{LINK_NAME[edge.type]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        )}
      </div>

      <div className="legend legend--inline">
        {(['live', 'batch', 'manual'] as const).map((k) => (
          <span key={k}><span className="line" style={{ ['--lc' as string]: LINK_COLOR[k] }} data-k={k} />{LINK_NAME[k]}</span>
        ))}
        <span><span className="swatch swatch--hollow" />Not yet documented as connected</span>
      </div>
    </div>
  )
}
