import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { NODES, BY_ID } from '../data/nodes'
import { EDGES } from '../data/flows'
import { LAYERS, LINK_COLOR, SECTOR } from '../data/meta'
import { CHAPTERS, layoutLandscape, type ChapterId } from '../layout'
import { crv, qd, qpt } from '../geom'
import { LINK_LABEL } from '../data/meta'
import { textMatch } from '../filters'
import { Icon } from './Icon'
import { Conf, ConfGlyph, Soon, StatusTag } from './ui'
import { Legend } from './Legend'
import type { Lens, SysNode } from '../types'

export interface CanvasProps {
  view: 'landscape' | 'sim'
  simple: boolean
  conn: 0 | 1
  lens: Lens
  prov: string
  sel: string | null
  machine: boolean
  chapter: ChapterId
  onSelect: (id: string) => void
  pred?: (n: SysNode) => boolean
  predKey?: string
  sectors?: string[]
  q?: string
  hlKey?: boolean
  focusId?: string | null
  onExitFocus?: () => void
  onReset?: () => void
  simFocus?: 'all' | 'real' | 'standin' | 'gateway'
  panelW?: number
}

const VW = 1500 // virtual design width of the map plane
const RAIL = 168 // fixed row-label rail (screen px)
const HEAD = 60 // fixed column-heading strip (screen px)
const BAND = 40 // fixed gateway strip, simulation view only (screen px)
const EASE = [0.65, 0, 0.35, 1] as const
const TR = { duration: 0.6, ease: EASE }
const NODE_W = 124

export function Canvas(p: CanvasProps) {
  const stage = useRef<HTMLDivElement>(null)
  const plane = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ w: 1300, h: 700 })
  const [tf, setTf] = useState({ s: 1, x: 0, y: 0 })
  const [anim, setAnim] = useState(false)
  const [smooth, setSmooth] = useState(false)
  const smoothTimer = useRef<number>()
  const [rowFocus, setRowFocus] = useState<string | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [tip, setTip] = useState<{ x: number; y: number; id: string } | null>(null)
  const [showLegend, setShowLegend] = useState(false)
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)
  const animTimer = useRef<number>()

  useEffect(() => {
    if (!stage.current) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(stage.current)
    return () => ro.disconnect()
  }, [])

  const lay = useMemo(
    () => layoutLandscape({ W: VW, view: p.view, simple: p.simple, prov: p.prov, jnodes: null, pred: p.pred, sectors: p.sectors }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.view, p.simple, p.prov, p.predKey],
  )
  const band = p.view === 'sim' ? BAND : 0
  const planeW = Math.max(300, box.w - RAIL), planeH = Math.max(200, box.h - HEAD - band)
  const fitAllS = Math.min(planeW / VW, planeH / lay.height)

  // where the camera should sit for the current chapter / focused row
  const target = useMemo(() => {
    // with the detail panel open, keep the selected system and its connections inside the visible part of the map
    if (p.sel && p.panelW && !p.focusId) {
      const nb = EDGES.filter((e) => e.a === p.sel || e.b === p.sel).map((e) => (e.a === p.sel ? e.b : e.a))
      const pts = [p.sel, ...nb].map((id) => lay.pos[id]).filter((q) => q && q.visible)
      if (pts.length) {
        const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y)
        const bw = Math.max(...xs) - Math.min(...xs) + NODE_W + 60, bh = Math.max(...ys) - Math.min(...ys) + 140
        const vw = planeW - p.panelW - 16
        const sc = Math.max(0.45, Math.min(1, vw / bw, (planeH - 30) / bh))
        const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2 + 14
        return { s: sc, x: vw / 2 - cx * sc, y: planeH / 2 - cy * sc }
      }
    }
    let rs = lay.rows
    if (rowFocus) {
      const i = lay.rows.findIndex((r) => r.id === rowFocus)
      if (i >= 0) rs = lay.rows.slice(Math.max(0, i - 1), i + 2)
    } else if (p.chapter !== 'all' && !p.predKey) {
      const ids = CHAPTERS.find((c) => c.id === p.chapter)!.layers as readonly string[]
      const m = lay.rows.filter((r) => ids.includes(r.id))
      if (m.length) rs = m
    }
    const whole = rs === lay.rows
    const y0 = whole ? 0 : Math.min(...rs.map((r) => r.y))
    const y1 = whole ? lay.height : Math.max(...rs.map((r) => r.y + r.h))
    const span = y1 - y0
    if (p.view === 'sim' && !rowFocus && !whole) {
      // the simulation opens at a readable scale on the chosen chapter; the rest of the map is a pan away
      const sc = Math.min(planeW / VW, 1)
      return { s: sc, x: (planeW - VW * sc) / 2, y: 8 - y0 * sc }
    }
    const s = Math.min(planeW / VW, (planeH - 12) / span, 1.6)
    return { s, x: (planeW - VW * s) / 2, y: (planeH - span * s) / 2 - y0 * s }
  }, [lay, p.chapter, rowFocus, planeW, planeH, p.sel, p.panelW, p.focusId, p.view, p.predKey])

  useEffect(() => { setRowFocus(null) }, [p.chapter, p.view, p.prov, p.simple, p.predKey])
  // glide when the user changes chapter / layer / filters; snap on first load and on window resize
  const lastKey = useRef<string | null>(null)
  const camKey = [p.chapter, p.view, rowFocus, p.prov, p.simple, p.predKey, p.sel, p.panelW].join('|')
  useEffect(() => {
    const changed = lastKey.current !== null && lastKey.current !== camKey
    lastKey.current = camKey
    setAnim(changed)
    setTf(target)
    window.clearTimeout(animTimer.current)
    if (changed) animTimer.current = window.setTimeout(() => setAnim(false), 700)
  }, [target, camKey])

  const zoomAt = useCallback((factor: number, mx: number, my: number) => {
    setAnim(false)
    setSmooth(true)
    window.clearTimeout(smoothTimer.current)
    smoothTimer.current = window.setTimeout(() => setSmooth(false), 220)
    setTf((t) => {
      const s = Math.min(3, Math.max(fitAllS * 0.9, t.s * factor))
      const k = s / t.s
      return { s, x: mx - (mx - t.x) * k, y: my - (my - t.y) * k }
    })
  }, [fitAllS])

  const fit = useCallback(() => {
    setRowFocus(null)
    setAnim(true)
    const sc = Math.min(planeW / VW, (planeH - 12) / lay.height, 1.6)
    setTf({ s: sc, x: (planeW - VW * sc) / 2, y: (planeH - lay.height * sc) / 2 })
    window.clearTimeout(animTimer.current)
    animTimer.current = window.setTimeout(() => setAnim(false), 700)
  }, [planeW, planeH, lay.height])

  useEffect(() => {
    const el = plane.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [zoomAt])

  const last = useRef<Record<string, { x: number; y: number }>>({})
  const pos: Record<string, { x: number; y: number; visible: boolean }> = {}
  for (const n of NODES) {
    const l = lay.pos[n.id]
    if (l.visible) { pos[n.id] = l; last.current[n.id] = { x: l.x, y: l.y } }
    else { const o = last.current[n.id] ?? { x: VW / 2, y: 60 }; pos[n.id] = { ...o, visible: false } }
  }

  const chSet = p.chapter !== 'all' && !rowFocus && !p.predKey ? new Set<string>(CHAPTERS.find((c) => c.id === p.chapter)!.layers) : null
  const focus = hover ?? p.sel
  const neighbours = useMemo(() => {
    if (!focus) return null
    const s = new Set([focus])
    EDGES.forEach((e) => { if (e.a === focus) s.add(e.b); if (e.b === focus) s.add(e.a) })
    return s
  }, [focus])

  const nodeOpacity = (id: string) => {
    const n = BY_ID[id]
    if (!pos[id].visible) return 0
    let o = 1
    if (neighbours && !neighbours.has(id)) o = 0.16
    if (p.lens !== 'all' && !n.lens.includes(p.lens)) o = Math.min(o, 0.16)
    if (chSet && !chSet.has(n.layer)) o = Math.min(o, 0.4)
    if (p.q && !textMatch(n, p.q)) o = Math.min(o, 0.14)
    if (p.hlKey && !n.core) o = Math.min(o, 0.4)
    if (p.view === 'sim' && p.simFocus === 'standin' && !n.sim) o = Math.min(o, 0.2)
    if (p.view === 'sim' && p.simFocus === 'real' && n.sim) o = Math.min(o, 0.35)
    return o
  }
  const edgeShow = (i: number) => {
    const e = EDGES[i]
    if (!pos[e.a].visible || !pos[e.b].visible) return 0
    if (p.view === 'landscape') {
      if (p.focusId) return e.a === p.focusId || e.b === p.focusId ? 1 : 0
      if (!p.conn) return 0
      return focus ? (e.a === focus || e.b === focus ? 1 : 0.05) : 0.55
    }
    return 0
  }

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setAnim(false)
    setSmooth(false)
    drag.current = { x: e.clientX, y: e.clientY, tx: tf.x, ty: tf.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const d = drag.current
    setTf((t) => ({ ...t, x: d.tx + e.clientX - d.x, y: d.ty + e.clientY - d.y }))
  }
  const onUp = () => { drag.current = null }

  const cls = 'vp' + (anim ? ' anim' : '') + (tf.s >= 0.66 ? ' lab' : '') + (tf.s >= 0.9 ? ' alias' : '') + (smooth ? ' smooth' : '')
  const ovl = anim ? ' anim' : ''
  const sim = p.view === 'sim'

  return (
    <div className={'atlas' + (sim ? ' atlas-sim' : '') + (sim && p.simFocus === 'gateway' ? ' sf-gateway' : '') + (p.focusId ? ' is-focus' : '')} ref={stage}>
      <div className="heads" style={{ left: RAIL, height: HEAD }}>
        {lay.cols.map((c) => (
          <div key={c.id} className={'colhead' + ovl} style={{ left: tf.x + c.x * tf.s, width: c.w * tf.s }}>
            <b><i style={{ background: c.color }} />{c.name}</b><small>{c.sub}</small>
          </div>
        ))}
      </div>
      <div className="rail" data-tour="rail" style={{ top: HEAD + band, width: RAIL }}>
        {lay.rows.map((r) => (
          <button key={r.id} className={'railrow' + (rowFocus === r.id ? ' on' : '') + (chSet && !chSet.has(r.id) ? ' out' : '') + ovl} style={{ top: tf.y + r.y * tf.s, height: r.h * tf.s }}
            onClick={() => setRowFocus(rowFocus === r.id ? null : r.id)} title="Zoom to this layer">
            <code>L{String(LAYERS.length - LAYERS.findIndex((l) => l.id === r.id)).padStart(2, '0')}</code>
            <span>{r.name}</span>
          </button>
        ))}
      </div>
      {sim && (
        <div className="gwband" style={{ top: HEAD, height: BAND }}>
          <Soon>Coming soon</Soon>
          <b>SAHealth gateway</b>
          <small>Planned for Phase 2. Not built, and not connected to anything yet. The dotted lines show which stand-ins it would reach.</small>
        </div>
      )}
      <div className="plane" data-tour="plane" ref={plane} style={{ left: RAIL, top: HEAD + band }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className={cls} style={{ width: VW, height: lay.height, ['--s' as string]: tf.s, transform: `translate(${Math.round(tf.x)}px, ${Math.round(tf.y)}px) scale(${tf.s})` }}>
          {lay.rows.map((r, i) => <div key={r.id} className={'band' + (i % 2 ? ' alt' : '')} style={{ top: r.y, height: r.h }} />)}
          {lay.cols.map((c, i) => i > 0 && <div key={c.id} className="colline" style={{ left: c.x }} />)}
          {lay.note && (
            <div className="nobox" style={{ left: lay.note.x, top: lay.note.y, width: lay.note.w }}>
              <b>No hospital record system reported for {p.prov}</b>
              <span>Source: parliamentary reply</span>
            </div>
          )}

          <svg className="edges">
            {EDGES.map((e, i) => {
              const a = pos[e.a], b = pos[e.b]
              return (
                <motion.path key={e.a + e.b} fill="none" stroke={LINK_COLOR[e.type]} strokeWidth={e.type === 'live' ? 2.6 : 2.2} strokeLinecap="round"
                  strokeDasharray={e.type === 'batch' ? '9 5' : e.type === 'manual' ? '1.5 6' : undefined}
                  initial={false} animate={{ d: qd(crv(a.x, a.y, b.x, b.y, i % 2 ? 1 : -1)), opacity: edgeShow(i) }} transition={TR} />
              )
            })}
            {p.focusId && EDGES.map((e, i) => {
              if (e.a !== p.focusId && e.b !== p.focusId) return null
              if (!pos[e.a].visible || !pos[e.b].visible) return null
              const a = pos[e.a], b = pos[e.b]
              const [mx, my] = qpt(crv(a.x, a.y, b.x, b.y, i % 2 ? 1 : -1), 0.5)
              return (
                <g key={'l' + e.a + e.b} className={'elabel el-' + e.type} transform={`translate(${Math.round(mx)} ${Math.round(my)})`}>
                  <text textAnchor="middle" y={-6}>{LINK_LABEL[e.type]}</text>
                  <text textAnchor="middle" y={9} className="el-what">{e.what}</text>
                </g>
              )
            })}
            {sim && NODES.filter((n) => n.sim && pos[n.id].visible).map((n) => (
              <motion.path key={'g' + n.id} className="gwlink" strokeWidth={1.2} strokeDasharray="2 5" fill="none" initial={false}
                animate={{ d: `M${pos[n.id].x},${pos[n.id].y - 30} L${pos[n.id].x},-4000` }} transition={TR} />
            ))}
          </svg>

          {NODES.map((n) => {
            const q = pos[n.id]
            const modelled = sim && !!n.sim
            const hollow = sim && !n.sim
            return (
              <motion.button key={n.id}
                className={'nd st-' + n.status + (n.core ? ' core' : '') + (neighbours && neighbours.has(n.id) ? ' nb' : '') + (p.sel === n.id ? ' sel' : '') + (modelled ? ' modelled' : '') + (hollow ? ' hollow' : '')}
                style={{ ['--c' as string]: SECTOR[n.sector].color, width: NODE_W, pointerEvents: q.visible ? 'auto' : 'none' }}
                initial={false} animate={{ x: Math.round(q.x - NODE_W / 2), y: Math.round(q.y - 28), opacity: nodeOpacity(n.id) }} transition={TR}
                onClick={() => p.onSelect(n.id)}
                onMouseEnter={(ev) => { setHover(n.id); const r = (ev.currentTarget as HTMLElement).getBoundingClientRect(); setTip({ x: r.left + r.width / 2, y: r.bottom + 8, id: n.id }) }}
                onMouseLeave={() => { setHover(null); setTip(null) }}
                aria-label={n.name + (n.alias ? ` (${n.alias})` : '') + `, ${n.status}, ${n.conf}`}>
                <span className="nd-tile">
                  <Icon name={n.icon} size={n.core ? 26 : 22} />
                  <i className="nd-sec" />
                  <span className="nd-conf"><ConfGlyph conf={n.conf} size={9} /></span>
                </span>
                <span className="nd-name">{n.name}</span>
                {n.alias && <span className="nd-alias">{n.alias}</span>}
                {modelled && <>
                  <span className="nd-stand">stand-in · {n.sim![0]}</span>
                  {p.machine && <span className="nd-mach">{n.sim![1] === 'R' ? "Rajen's PC" : "Partner's laptop"}</span>}
                </>}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="zoomctl">
        <button onClick={() => zoomAt(1.3, planeW / 2, planeH / 2)} aria-label="Zoom in">+</button>
        <button onClick={() => zoomAt(1 / 1.3, planeW / 2, planeH / 2)} aria-label="Zoom out">−</button>
        <button className="wide" onClick={() => fit()} title="Fit the whole map to the screen">Fit</button>
        <button className="wide" onClick={() => { setRowFocus(null); setAnim(true); setTf(target); window.clearTimeout(animTimer.current); animTimer.current = window.setTimeout(() => setAnim(false), 700) }} title="Return to the chosen chapter">Reset</button>
        <button className="wide" data-tour="key" onClick={() => setShowLegend((v) => !v)} aria-pressed={showLegend}>Key</button>
      </div>

      {p.focusId && (
        <div className="focusbar" role="status">
          <span><b>Focused on {BY_ID[p.focusId].name}.</b> Showing only its {EDGES.filter((e) => e.a === p.focusId || e.b === p.focusId).length} documented connection{EDGES.filter((e) => e.a === p.focusId || e.b === p.focusId).length === 1 ? '' : 's'}.</span>
          <button className="link" onClick={p.onExitFocus}>Show everything</button>
        </div>
      )}
      {lay.rows.length === 0 && (
        <div className="atlas-empty">
          <b>No systems match these filters.</b>
          <p>Nothing in the research fits every filter at once. Remove a filter or reset them all.</p>
          {p.onReset && <button className="btn primary" onClick={p.onReset}>Reset filters</button>}
        </div>
      )}
      {showLegend && <div className="legendwrap"><Legend sim={sim} onClose={() => setShowLegend(false)} /></div>}
      <div className="hint">Drag to move · scroll to zoom · click a layer to focus it</div>
      {tip && (() => { const t = BY_ID[tip.id]; const nl = EDGES.filter((e) => e.a === t.id || e.b === t.id).length; return (
        <div className="tip" style={{ left: Math.min(window.innerWidth - 160, Math.max(160, tip.x)), top: tip.y }}>
          <b>{t.name}{t.alias ? <code> {t.alias}</code> : null}</b>
          <span>{t.summary.split('. ')[0]}.</span>
          <small>{t.status} · {t.conf} · {nl} documented link{nl === 1 ? '' : 's'}{p.view === 'sim' && t.sim ? ' · has a DEXA stand-in' : ''}</small>
        </div>) })()}
    </div>
  )
}
