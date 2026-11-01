import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { NODES, BY_ID } from '../data/nodes'
import { EDGES } from '../data/flows'
import { LAYERS, LINK_COLOR, SECTOR } from '../data/meta'
import { CHAPTERS, layoutLandscape, type ChapterId } from '../layout'
import { crv, qd } from '../geom'
import { Icon } from './Icon'
import { ConfGlyph, Soon } from './ui'
import { Legend } from './Legend'
import type { Lens } from '../types'

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
    () => layoutLandscape({ W: VW, view: p.view, simple: p.simple, prov: p.prov, jnodes: null }),
    [p.view, p.simple, p.prov],
  )
  const band = p.view === 'sim' ? BAND : 0
  const planeW = Math.max(300, box.w - RAIL), planeH = Math.max(200, box.h - HEAD - band)
  const fitAllS = Math.min(planeW / VW, planeH / lay.height)

  // where the camera should sit for the current chapter / focused row
  const target = useMemo(() => {
    let rs = lay.rows
    if (rowFocus) {
      const i = lay.rows.findIndex((r) => r.id === rowFocus)
      if (i >= 0) rs = lay.rows.slice(Math.max(0, i - 1), i + 2)
    } else if (p.chapter !== 'all') {
      const ids = CHAPTERS.find((c) => c.id === p.chapter)!.layers as readonly string[]
      const m = lay.rows.filter((r) => ids.includes(r.id))
      if (m.length) rs = m
    }
    const whole = rs === lay.rows
    const y0 = whole ? 0 : Math.min(...rs.map((r) => r.y))
    const y1 = whole ? lay.height : Math.max(...rs.map((r) => r.y + r.h))
    const span = y1 - y0
    const s = Math.min(planeW / VW, (planeH - 12) / span, 1.6)
    return { s, x: (planeW - VW * s) / 2, y: (planeH - span * s) / 2 - y0 * s }
  }, [lay, p.chapter, rowFocus, planeW, planeH])

  useEffect(() => { setRowFocus(null) }, [p.chapter, p.view, p.prov, p.simple])
  // glide when the user changes chapter / layer / filters; snap on first load and on window resize
  const lastKey = useRef<string | null>(null)
  const camKey = [p.chapter, p.view, rowFocus, p.prov, p.simple].join('|')
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
    setTf((t) => {
      const s = Math.min(3, Math.max(fitAllS * 0.9, t.s * factor))
      const k = s / t.s
      return { s, x: mx - (mx - t.x) * k, y: my - (my - t.y) * k }
    })
  }, [fitAllS])

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

  const chSet = p.chapter !== 'all' && !rowFocus ? new Set<string>(CHAPTERS.find((c) => c.id === p.chapter)!.layers) : null
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
    return o
  }
  const edgeShow = (i: number) => {
    const e = EDGES[i]
    if (!pos[e.a].visible || !pos[e.b].visible) return 0
    if (p.view === 'landscape') { if (!p.conn) return 0; return focus ? (e.a === focus || e.b === focus ? 1 : 0.05) : 0.7 }
    return 0
  }

  const onDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setAnim(false)
    drag.current = { x: e.clientX, y: e.clientY, tx: tf.x, ty: tf.y }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return
    const d = drag.current
    setTf((t) => ({ ...t, x: d.tx + e.clientX - d.x, y: d.ty + e.clientY - d.y }))
  }
  const onUp = () => { drag.current = null }

  const cls = 'vp' + (anim ? ' anim' : '') + (tf.s >= 0.6 ? ' lab' : '') + (tf.s >= 0.85 ? ' alias' : '')
  const ovl = anim ? ' anim' : ''
  const sim = p.view === 'sim'

  return (
    <div className={'atlas' + (sim ? ' atlas-sim' : '')} ref={stage}>
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
        <div className={cls} style={{ width: VW, height: lay.height, transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.s})` }}>
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
                className={'nd st-' + n.status + (n.core ? ' core' : '') + (p.sel === n.id ? ' sel' : '') + (modelled ? ' modelled' : '') + (hollow ? ' hollow' : '')}
                style={{ ['--c' as string]: SECTOR[n.sector].color, width: NODE_W, pointerEvents: q.visible ? 'auto' : 'none' }}
                initial={false} animate={{ x: q.x - NODE_W / 2, y: q.y - 28, opacity: nodeOpacity(n.id) }} transition={TR}
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
        <button onClick={() => { setRowFocus(null); setAnim(true); setTf(target); window.clearTimeout(animTimer.current); animTimer.current = window.setTimeout(() => setAnim(false), 700) }} className="wide">Reset</button>
        <button className="wide" data-tour="key" onClick={() => setShowLegend((v) => !v)} aria-pressed={showLegend}>Key</button>
      </div>

      {showLegend && <div className="legendwrap"><Legend sim={sim} onClose={() => setShowLegend(false)} /></div>}
      <div className="hint">Drag to move · scroll to zoom · click a layer to focus it</div>
      {tip && (
        <div className="tip" style={{ left: Math.min(window.innerWidth - 160, Math.max(160, tip.x)), top: tip.y }}>
          <b>{BY_ID[tip.id].name}</b><span>{BY_ID[tip.id].summary.split('. ')[0]}.</span>
        </div>
      )}
    </div>
  )
}
