import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BY_ID } from '../data/nodes'
import { GROUPS, JOURNEYS } from '../data/flows'
import { LAYER_NAME, SECTORS, SECTOR } from '../data/meta'
import { crv, qd, qpt, type Quad } from '../geom'
import { Icon } from '../components/Icon'
import type { Journey } from '../types'

const LANE_H = 290
const LEFT = 150
const GAP = 205
const EASE = [0.22, 1, 0.36, 1] as const
const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props { jid: string; setJid: (id: string) => void; sel: string | null; onSelect: (id: string) => void }

function build(j: Journey) {
  const order: string[] = []
  j.steps.forEach((s) => [s.f, s.t].forEach((id) => { if (!order.includes(id)) order.push(id) }))
  const lanes = SECTORS.filter((s) => order.some((id) => BY_ID[id].sector === s.id))
  const W = LEFT + 120 + Math.max(order.length - 1, 1) * GAP + 120
  const H = lanes.length * LANE_H
  const pos: Record<string, { x: number; y: number; lane: number; i: number }> = {}
  order.forEach((id, i) => {
    const lane = lanes.findIndex((l) => l.id === BY_ID[id].sector)
    pos[id] = { x: LEFT + 120 + i * GAP, y: lane * LANE_H + LANE_H / 2 - 18, lane, i }
  })
  return { order, lanes, W, H, pos }
}

function arrowQuad(a: { x: number; y: number; lane: number; i: number }, b: { x: number; y: number; lane: number; i: number }): Quad {
  const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d
  if (Math.abs(dy) < 30) {
    const lift = Math.abs(a.i - b.i) > 1 ? -1.6 : 0
    return crv(a.x + ux * 62, a.y + uy * 62, b.x - ux * 72, b.y - uy * 72, lift)
  }
  // between lanes: leave and arrive clear of the labels that sit under each icon
  const down = dy > 0
  const sx = a.x + ux * 22, sy = down ? a.y + 178 : a.y - 66
  const ex = b.x - ux * 22, ey = down ? b.y - 70 : b.y + 178
  return crv(sx, sy, ex, ey, 0.12)
}
function headPts(q: Quad) {
  const dx = q.p1[0] - q.c[0], dy = q.p1[1] - q.c[1], d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d
  const bx = q.p1[0] - ux * 20, by = q.p1[1] - uy * 20
  return `${q.p1[0]},${q.p1[1]} ${bx - uy * 10},${by + ux * 10} ${bx + uy * 10},${by - ux * 10}`
}

export function JourneyPlayer({ jid, setJid, sel, onSelect }: Props) {
  const j = JOURNEYS.find((x) => x.id === jid)!
  const g = GROUPS[j.g]
  const n = j.steps.length
  const geo = useMemo(() => build(j), [j])
  const urlStep = new URLSearchParams(location.search).get('jstep')
  const [idx, setIdx] = useState(urlStep !== null ? Number(urlStep) : -1) // -1 title card, 0..n-1 steps, n end card
  const [playing, setPlaying] = useState(urlStep !== null ? false : !reduceMotion)
  const prevJid = useRef(jid)
  const [speed, setSpeed] = useState(1)
  const [prog, setProg] = useState(0)
  const box = useRef<HTMLDivElement>(null)
  const [dim, setDim] = useState({ w: 1100, h: 520 })

  useEffect(() => {
    if (prevJid.current === jid) return
    prevJid.current = jid
    setIdx(-1); setProg(0); setPlaying(!reduceMotion)
  }, [jid])
  useEffect(() => {
    if (!box.current) return
    const ro = new ResizeObserver(([e]) => setDim({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(box.current)
    return () => ro.disconnect()
  }, [])

  const dur = (i: number) => (i < 0 ? 3200 : i >= n ? 1e9 : 5200 + j.steps[i].p.length * 30)
  useEffect(() => {
    if (!playing) return
    let raf = 0, last = performance.now(), el = prog * dur(idx)
    const tick = (now: number) => {
      el += (now - last) * speed
      last = now
      const d = dur(idx)
      if (el >= d) {
        if (idx + 1 >= n) { setIdx(n); setProg(0); setPlaying(false); return }
        setIdx(idx + 1); setProg(0); return
      }
      setProg(el / d)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx, speed, jid])

  const go = (i: number) => { setIdx(Math.max(-1, Math.min(n, i))); setProg(0) }
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,select')) return
      if (e.key === 'ArrowRight') go(idx + 1)
      if (e.key === 'ArrowLeft') go(idx - 1)
      if (e.key === ' ' && !(e.target as HTMLElement).closest('button')) { e.preventDefault(); toggle() }
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  })
  const toggle = () => {
    if (idx >= n) { go(-1); setPlaying(true) } else setPlaying((p) => !p)
  }

  const s = Math.min(dim.w / geo.W, dim.h / geo.H, 1.3)
  const ox = (dim.w - geo.W * s) / 2, oy = (dim.h - geo.H * s) / 2
  const upto = Math.min(idx, n - 1)
  const shown = new Set<string>()
  j.steps.slice(0, upto + 1).forEach((st) => { shown.add(st.f); shown.add(st.t) })
  if (idx >= n) geo.order.forEach((id) => shown.add(id))
  const step = idx >= 0 && idx < n ? j.steps[idx] : null
  let copies = 1, hand = 0
  j.steps.slice(0, Math.max(0, Math.min(idx + 1, n))).forEach((st) => { if (st.k === 'manual') { copies++; hand++ } else if (st.k === 'batch') copies++ })
  const q = step ? arrowQuad(geo.pos[step.f], geo.pos[step.t]) : null
  const mid = q ? qpt(q, 0.5) : null
  const kinds = { live: 'Live link', batch: 'Regular batch', manual: 'Retyped or carried by hand', break: 'Data stops here' } as const
  const pk = q ? Array.from({ length: 16 }, (_, i) => qpt(q, i / 15)) : null

  return (
    <div className="jp">
      <aside className="jp-side">
        <div className="jgroups">
          {(Object.keys(GROUPS) as (keyof typeof GROUPS)[]).map((k) => (
            <button key={k} aria-pressed={j.g === k} onClick={() => setJid(JOURNEYS.find((x) => x.g === k)!.id)}>{GROUPS[k].name}</button>
          ))}
        </div>
        <div className="jlist2">
          {JOURNEYS.filter((x) => x.g === j.g).map((x) => (
            <button key={x.id} aria-pressed={x.id === jid} onClick={() => setJid(x.id)}>{x.title}</button>
          ))}
        </div>
        <h4 className="jp-h">Chapters</h4>
        <ol className="jp-chapters" data-tour="jp-chap">
          {j.steps.map((st, i) => (
            <li key={i}><button className={i === idx ? 'on' : i < idx ? 'past' : ''} onClick={() => go(i)}><i>{i + 1}</i>{st.h}</button></li>
          ))}
        </ol>
      </aside>

      <section className="jp-main" style={{ ['--gc' as string]: g.color }}>
        <div className="jp-stage" ref={box}>
          <div className="jp-vp" style={{ width: geo.W, height: geo.H, transform: `translate(${ox}px, ${oy}px) scale(${s})` }}>
            {geo.lanes.map((l, i) => (
              <div key={l.id} className="jp-lane" style={{ top: i * LANE_H, height: LANE_H, background: i % 2 ? '#f8fafd' : '#fff' }}>
                <div className="jp-lanelabel" style={{ width: LEFT }}><i style={{ background: l.color }} /><b>{l.name}</b><small>{l.sub}</small></div>
              </div>
            ))}
            <svg className="jp-svg" width={geo.W} height={geo.H}>
              {/* earlier steps: a quiet trail */}
              {j.steps.slice(0, Math.max(0, idx)).map((st, i) => st.k === 'break' ? null : (
                <path key={'t' + i} d={qd(arrowQuad(geo.pos[st.f], geo.pos[st.t]))} fill="none" stroke="#c9d3e6" strokeWidth={3} strokeLinecap="round" />
              ))}
              {step && q && (
                <g key={jid + idx}>
                  <motion.path d={qd(q)} fill="none" strokeLinecap="round" strokeWidth={5}
                    stroke={step.k === 'break' ? '#dc2626' : '#0b1b36'}
                    strokeDasharray={step.k === 'break' ? '9 10' : step.k === 'batch' ? '16 10' : step.k === 'manual' ? '2 13' : undefined}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3 / speed, ease: EASE, delay: 0.25 }} />
                  {step.k !== 'break' && (
                    <motion.polygon points={headPts(q)} fill="#0b1b36" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (1.45 / speed) }} />
                  )}
                  {step.k === 'break' && mid && (
                    <motion.text x={mid[0]} y={mid[1]} fill="#dc2626" fontSize={56} fontWeight={800} textAnchor="middle" dominantBaseline="central"
                      initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 / speed, type: 'spring', stiffness: 300, damping: 14 }} style={{ transformOrigin: `${mid[0]}px ${mid[1]}px` }}>×</motion.text>
                  )}
                  {step.k !== 'break' && step.lbl && mid && (
                    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 / speed }}>
                      <rect x={mid[0] - (step.lbl.length * 5 + 16)} y={mid[1] - 46} width={step.lbl.length * 10 + 32} height={32} rx={16} fill="#fff" stroke="#0b1b36" strokeWidth={1.5} />
                      <text x={mid[0]} y={mid[1] - 30} fill="#0b1b36" fontSize={16} fontWeight={700} textAnchor="middle" dominantBaseline="central">{step.lbl}</text>
                    </motion.g>
                  )}
                  {pk && step.k !== 'break' && (
                    <motion.circle r={11} fill="#2f5bff" stroke="#fff" strokeWidth={3}
                      initial={{ cx: pk[0][0], cy: pk[0][1], opacity: 0 }}
                      animate={{ cx: pk.map((p) => p[0]), cy: pk.map((p) => p[1]), opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] }}
                      transition={{ duration: 1.5 / speed, ease: 'easeInOut', delay: 0.25 }} />
                  )}
                </g>
              )}
            </svg>
            {geo.order.map((id) => {
              const nd = BY_ID[id], p = geo.pos[id]
              const on = shown.has(id), active = !!step && (step.f === id || step.t === id)
              const ghost = idx < 0 || (!on && idx < n)
              return (
                <motion.button key={jid + id} className={'jp-node' + (active ? ' active' : '') + (sel === id ? ' sel' : '')}
                  style={{ left: p.x - 110, top: p.y - 50, ['--c' as string]: SECTOR[nd.sector].color }}
                  initial={false} animate={{ opacity: on ? 1 : ghost ? 0.2 : 0, scale: on ? 1 : 0.86 }} transition={{ duration: 0.5, ease: EASE }}
                  onClick={() => onSelect(id)} aria-label={nd.name}>
                  <span className="ico"><Icon name={nd.icon} size={36} /></span>
                  <b>{nd.name}</b>
                  {nd.alias && <i>{nd.alias}</i>}
                  <em>{LAYER_NAME[nd.layer]}</em>
                </motion.button>
              )
            })}
          </div>
        </div>

        <div className="jp-cap">
          <div className="jp-bar"><motion.i style={{ width: `${Math.min(100, (idx < 0 ? prog : idx >= n ? 1 : (idx + prog) / n) * 100)}%` }} /></div>
          <AnimatePresence mode="wait">
            <motion.div key={jid + idx} className="jp-text" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              {idx < 0 && <><div className="jkick">{g.name} journey</div><h3>{j.title}</h3><p>{j.intro}</p></>}
              {step && <>
                <div className="jkick">Step {idx + 1} of {n} · <span className={'kind k-' + step.k}>{kinds[step.k]}</span></div>
                <h3>{step.h}</h3><p>{step.p}</p>
                <div className="jflow">{BY_ID[step.f].name} <b>→</b> {BY_ID[step.t].name}</div></>}
              {idx >= n && <><div className="jkick">The end of the journey</div>
                <h3>{copies} copies of the data, {hand} retyped by hand</h3>
                <p>{j.steps[n - 1].k === 'break' ? 'And then it stopped. ' : ''}Press replay to watch it again, or choose another journey.</p></>}
            </motion.div>
          </AnimatePresence>
          <div className="jp-side2">
            <div className="counters"><div><b>{copies}</b><span>copies of the data</span></div><div><b>{hand}</b><span>retyped by hand</span></div></div>
          </div>
        </div>

        <div className="jp-ctl" data-tour="jp-ctl">
          <button className="btn" onClick={() => go(-1)} title="Restart">⏮</button>
          <button className="btn" onClick={() => go(idx - 1)} disabled={idx < 0} title="Previous step">◀</button>
          <button className="btn primary playb" onClick={toggle}>{idx >= n ? 'Replay' : playing ? 'Pause' : 'Play'}</button>
          <button className="btn" onClick={() => go(idx + 1)} disabled={idx >= n} title="Next step">▶</button>
          <div className="dots">{j.steps.map((_, i) => <button key={i} className={i === idx ? 'on' : i < idx ? 'past' : ''} onClick={() => go(i)} aria-label={`Step ${i + 1}`} />)}</div>
          <div className="seg"><button aria-pressed={speed === 0.7} onClick={() => setSpeed(0.7)}>0.7×</button><button aria-pressed={speed === 1} onClick={() => setSpeed(1)}>1×</button><button aria-pressed={speed === 1.6} onClick={() => setSpeed(1.6)}>1.6×</button></div>
        </div>
      </section>
    </div>
  )
}
