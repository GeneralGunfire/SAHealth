import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { NODES, BY_ID } from '../data/nodes'
import { EDGES } from '../data/flows'
import { LINK_COLOR, SECTOR } from '../data/meta'
import { CHAPTERS, layoutLandscape, type ChapterId } from '../layout'
import { crv, qd, qpt, trim } from '../geom'
import { Icon } from './Icon'
import { Legend } from './Legend'
import type { Journey, Lens } from '../types'

export interface CanvasProps {
  view: 'landscape' | 'sim' | 'journey'
  simple: boolean
  conn: 0 | 1
  lens: Lens
  prov: string
  sel: string | null
  machine: boolean
  chapter: ChapterId
  journey?: { j: Journey; step: number }
  onSelect: (id: string) => void
}

const VW = 1500 // virtual design width of the map plane
const RAIL = 150 // fixed row-label rail (screen px)
const HEAD = 64 // fixed column-heading strip (screen px)
const EASE = [0.65, 0, 0.35, 1] as const
const TR = { duration: 0.6, ease: EASE }

export const journeyNodes = (j: Journey) => { const s = new Set<string>(); j.steps.forEach((x) => { s.add(x.f); s.add(x.t) }); return s }
const journeyOrder = (j: Journey) => { const o: string[] = []; j.steps.forEach((x) => { [x.f, x.t].forEach((id) => { if (!o.includes(id)) o.push(id) }) }); return o }
const reached = (j: Journey, upto: number) => { const s = new Set<string>(); j.steps.slice(0, upto + 1).forEach((x) => { s.add(x.f); s.add(x.t) }); return s }

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

  const jn = p.journey ? journeyNodes(p.journey.j) : null
  const lay = useMemo(
    () => layoutLandscape({ W: VW, view: p.view, simple: p.simple, prov: p.prov, jnodes: jn }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [p.view, p.simple, p.prov, p.journey?.j.id],
  )
  const planeW = Math.max(300, box.w - RAIL), planeH = Math.max(200, box.h - HEAD)
  const fitAllS = Math.min(planeW / VW, planeH / lay.height)

  // where the camera should sit for the current chapter / focused row
  const target = useMemo(() => {
    let rs = lay.rows
    if (p.view !== 'journey') {
      if (rowFocus) {
        const i = lay.rows.findIndex((r) => r.id === rowFocus)
        if (i >= 0) rs = lay.rows.slice(Math.max(0, i - 1), i + 2)
      } else if (p.chapter !== 'all') {
        const ids = CHAPTERS.find((c) => c.id === p.chapter)!.layers as readonly string[]
        const m = lay.rows.filter((r) => ids.includes(r.id))
        if (m.length) rs = m
      }
    }
    const whole = rs === lay.rows
    const y0 = whole ? 0 : Math.min(...rs.map((r) => r.y))
    const y1 = whole ? lay.height : Math.max(...rs.map((r) => r.y + r.h))
    const span = y1 - y0
    const s = Math.min(planeW / VW, (planeH - 12) / span, p.view === 'journey' ? 1.35 : 1.6)
    return { s, x: (planeW - VW * s) / 2, y: (planeH - span * s) / 2 - y0 * s }
  }, [lay, p.chapter, p.view, rowFocus, planeW, planeH])

  useEffect(() => { setRowFocus(null) }, [p.chapter, p.view, p.prov, p.simple])
  // glide when the user changes chapter / layer / filters; snap on first load and on window resize
  const lastKey = useRef<string | null>(null)
  const camKey = [p.chapter, p.view, rowFocus, p.prov, p.simple, p.journey?.j.id].join('|')
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

  const chSet = p.view !== 'journey' && p.chapter !== 'all' && !rowFocus ? new Set<string>(CHAPTERS.find((c) => c.id === p.chapter)!.layers) : null
  const focus = hover ?? p.sel
  const neighbours = useMemo(() => {
    if (!focus) return null
    const s = new Set([focus])
    EDGES.forEach((e) => { if (e.a === focus) s.add(e.b); if (e.b === focus) s.add(e.a) })
    return s
  }, [focus])
  const stepNodes = p.journey ? reached(p.journey.j, p.journey.step) : null
  const order = p.journey ? journeyOrder(p.journey.j) : []

  const nodeOpacity = (id: string) => {
    const n = BY_ID[id]
    if (!pos[id].visible) return 0
    if (p.view === 'journey') return stepNodes!.has(id) ? 1 : 0.35
    let o = 1
    if (neighbours && !neighbours.has(id)) o = 0.16
    if (p.lens !== 'all' && !n.lens.includes(p.lens)) o = Math.min(o, 0.16)
    if (chSet && !chSet.has(n.layer)) o = Math.min(o, 0.4)
    return o
  }
  const edgeShow = (i: number) => {
    const e = EDGES[i]
    if (!pos[e.a].visible || !pos[e.b].visible) return 0
    if (p.view === 'landscape') { if (!p.conn) return 0; return focus ? (e.a === focus || e.b === focus ? 1 : 0.05) : 0.6 }
    return 0
  }

  const step = p.journey?.j.steps[p.journey.step]
  const stepQ = step ? trim(pos[step.f], pos[step.t], 0.5) : null
  const mid = stepQ ? qpt(stepQ, 0.5) : null

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

  const cls = 'vp' + (anim ? ' anim' : '') + (tf.s >= 0.78 ? ' lab' : '') + (tf.s >= 1 ? ' alias' : '')
  const ovl = anim ? ' anim' : ''

  return (
    <div className="stage fill" ref={stage}>
      <div className="heads" style={{ left: RAIL, height: HEAD }}>
        {lay.cols.map((c) => (
          <div key={c.id} className={'colhead' + ovl} style={{ left: tf.x + c.x * tf.s, width: c.w * tf.s }}>
            <b style={{ color: c.color }}><i style={{ background: c.color }} />{c.name}</b><small>{c.sub}</small>
          </div>
        ))}
      </div>
      <div className="rail" data-tour="rail" style={{ top: HEAD, width: RAIL }}>
        {lay.rows.map((r, i) => (
          <button key={r.id} className={'railrow' + (i % 2 ? ' alt' : '') + (rowFocus === r.id ? ' on' : '') + (chSet && !chSet.has(r.id) ? ' out' : '') + ovl} style={{ top: tf.y + r.y * tf.s, height: r.h * tf.s }}
            onClick={() => setRowFocus(rowFocus === r.id ? null : r.id)} title="Click to zoom to this layer">
            <span>{r.name}</span>
          </button>
        ))}
      </div>
      <div className="plane" data-tour="plane" ref={plane} style={{ left: RAIL, top: HEAD }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className={cls} style={{ width: VW, height: lay.height, transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.s})` }}>
          {lay.rows.map((r, i) => <div key={r.id} className={'band' + (i % 2 ? ' alt' : '')} style={{ top: r.y, height: r.h }} />)}
          {lay.cols.map((c, i) => i > 0 && <div key={c.id} className="colline" style={{ left: c.x }} />)}
          {lay.note && (
            <div className="nobox" style={{ left: lay.note.x, top: lay.note.y, width: lay.note.w }}>
              No hospital record system reported for {p.prov}<br /><span style={{ color: '#6b7a99' }}>(parliamentary reply)</span>
            </div>
          )}
          {p.view === 'sim' && (
            <div className="gwband" style={{ left: 10, right: 10 }}>
              <img src="/dexa-mark-navy.png" alt="" height={20} /> SAHealth gateway <small>planned for Phase 2, not yet built</small>
            </div>
          )}

          <svg className="edges">
            <defs>
              <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#0b1b36" /></marker>
            </defs>
            {EDGES.map((e, i) => {
              const a = pos[e.a], b = pos[e.b]
              return (
                <motion.path key={e.a + e.b} fill="none" stroke={LINK_COLOR[e.type]} strokeWidth={e.type === 'live' ? 2.8 : 2.4} strokeLinecap="round"
                  strokeDasharray={e.type === 'batch' ? '8 6' : e.type === 'manual' ? '1.5 7' : undefined}
                  initial={false} animate={{ d: qd(crv(a.x, a.y, b.x, b.y, i % 2 ? 1 : -1)), opacity: edgeShow(i) }} transition={TR} />
              )
            })}
            {p.view === 'sim' && NODES.filter((n) => n.sim && pos[n.id].visible).map((n) => (
              <motion.path key={'g' + n.id} stroke="#9fb0d4" strokeWidth={1.4} strokeDasharray="2 4" fill="none" initial={false}
                animate={{ d: `M${pos[n.id].x},${pos[n.id].y - 30} L${pos[n.id].x},52` }} transition={TR} />
            ))}
            {p.journey && p.journey.j.steps.slice(0, p.journey.step).map((s, i) => s.k === 'break' ? null : (
              <path key={'t' + i} d={qd(trim(pos[s.f], pos[s.t], 0.5))} fill="none" stroke="#b9c4dc" strokeWidth={2.4} strokeLinecap="round" />
            ))}
            {step && stepQ && (
              <>
                <path d={qd(stepQ)} fill="none" stroke={step.k === 'break' ? '#dc2626' : '#0b1b36'} strokeWidth={4} strokeLinecap="round"
                  strokeDasharray={step.k === 'break' ? '7 7' : step.k === 'batch' ? '11 7' : step.k === 'manual' ? '1.5 9' : undefined}
                  markerEnd={step.k === 'break' ? undefined : 'url(#arr)'} />
                {step.k === 'break' && mid && <text x={mid[0]} y={mid[1]} fill="#dc2626" fontSize={38} fontWeight={800} textAnchor="middle" dominantBaseline="central">×</text>}
                {step.k !== 'break' && step.lbl && mid && (
                  <g transform={`translate(${mid[0]},${mid[1] - 18})`}>
                    <rect x={-(step.lbl.length * 4.2 + 12)} y={-13} width={step.lbl.length * 8.4 + 24} height={26} rx={13} fill="#0b1b36" />
                    <text fill="#fff" fontSize={14} fontWeight={600} textAnchor="middle" dominantBaseline="central">{step.lbl}</text>
                  </g>
                )}
              </>
            )}
          </svg>

          {NODES.map((n) => {
            const q = pos[n.id]
            const modelled = p.view === 'sim' && !!n.sim
            const hollow = p.view === 'sim' && !n.sim
            const num = p.view === 'journey' && stepNodes?.has(n.id) ? order.indexOf(n.id) + 1 : 0
            return (
              <motion.button key={n.id} className={'node' + (p.sel === n.id ? ' sel' : '') + (modelled ? ' modelled' : '') + (hollow ? ' hollow' : '')}
                style={{ ['--c' as string]: SECTOR[n.sector].color, pointerEvents: q.visible ? 'auto' : 'none' }}
                initial={false} animate={{ x: q.x - 62, y: q.y - 28, opacity: nodeOpacity(n.id) }} transition={TR}
                onClick={() => p.onSelect(n.id)}
                onMouseEnter={(ev) => { setHover(n.id); const r = (ev.currentTarget as HTMLElement).getBoundingClientRect(); setTip({ x: r.left + r.width / 2, y: r.bottom + 8, id: n.id }) }}
                onMouseLeave={() => { setHover(null); setTip(null) }}
                aria-label={n.name + (n.alias ? ` (${n.alias})` : '')}>
                <span className="ico"><Icon name={n.icon} size={28} />{num > 0 && <span className="stepn">{num}</span>}</span>
                <span className="lbl"><b>{n.name}</b>{n.alias && <i>{n.alias}</i>}</span>
                {modelled && <><span className="dbtag">{n.sim![0]}</span>{p.machine && <span className="mtag">{n.sim![1] === 'R' ? "Rajen's PC" : "Partner's laptop"}</span>}</>}
              </motion.button>
            )
          })}
        </div>
      </div>

      <div className="zoomctl">
        <button onClick={() => zoomAt(1.3, planeW / 2, planeH / 2)} aria-label="Zoom in">+</button>
        <button onClick={() => zoomAt(1 / 1.3, planeW / 2, planeH / 2)} aria-label="Zoom out">−</button>
        <button onClick={() => { setRowFocus(null); setAnim(true); setTf(target); window.clearTimeout(animTimer.current); animTimer.current = window.setTimeout(() => setAnim(false), 700) }} className="fitb">Reset</button>
        <button className="fitb" data-tour="key" onClick={() => setShowLegend((v) => !v)} aria-pressed={showLegend}>Key</button>
      </div>

      {showLegend && <div className="legendwrap"><Legend /></div>}
      <div className="hint">Drag to move · scroll to zoom</div>
      {tip && (
        <div className="tip" style={{ left: Math.min(window.innerWidth - 160, Math.max(160, tip.x)), top: tip.y }}>
          <b>{BY_ID[tip.id].name}</b><span>{BY_ID[tip.id].summary.split('. ')[0]}.</span>
        </div>
      )}
    </div>
  )
}
