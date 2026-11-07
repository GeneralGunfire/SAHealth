import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LINK_COLOR, LINK_NAME, NODE } from '../lib/model'
import { SysIcon } from './ui'
import { reducedMotion } from './Dynamic'
import type { Journey } from '../types'

type P = { x: number; y: number }
const STEP_MS = 5600     // length of one step at 1x
const TRAVEL = 0.68      // share of each step spent travelling; the rest is a pause to read
const BREAK_AT = 0.64    // how far along a path a broken link gets before it stops

const lerp = (a: P, b: P, u: number): P => ({ x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u })
const bez = (a: P, c: P, b: P, u: number): P => {
  const m = 1 - u
  return { x: m * m * a.x + 2 * m * u * c.x + u * u * b.x, y: m * m * a.y + 2 * m * u * c.y + u * u * b.y }
}
const ease = (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2)

export default function JourneyPlayer({ journey, onStep, startAt = 0 }: { journey: Journey; onStep?: (i: number) => void; startAt?: number }) {
  const steps = journey.steps
  const n = steps.length

  const [i, setI] = useState(Math.max(0, Math.min(journey.steps.length - 1, startAt)))
  const [t, setT] = useState(() => (reducedMotion() ? 1 : 0)) // 0..1 within the current step
  const [playing, setPlaying] = useState(() => !reducedMotion())
  const [speed, setSpeed] = useState(1)
  const [portrait, setPortrait] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => { onStep?.(i) }, [i, onStep])

  // layout depends on the width of the stage
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setPortrait(e.contentRect.width < 620))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // the systems in the order they first appear
  const order = useMemo(() => {
    const seen: string[] = []
    steps.forEach((s) => { [s.f, s.t].forEach((id) => { if (NODE[id] && !seen.includes(id)) seen.push(id) }) })
    return seen
  }, [steps])
  const firstSeen = useMemo(() => Object.fromEntries(order.map((id) => [id, steps.findIndex((s) => s.f === id || s.t === id)])), [order, steps])

  const W = portrait ? 400 : 1000
  const H = portrait ? Math.max(430, order.length * 112) : 430
  const pos: Record<string, P> = useMemo(() => {
    const m = order.length
    return Object.fromEntries(order.map((id, k) => {
      if (portrait) return [id, { x: k % 2 === 0 ? 105 : 295, y: m === 1 ? H / 2 : 70 + k * ((H - 150) / (m - 1)) }]
      return [id, { x: m === 1 ? W / 2 : 95 + k * ((W - 190) / (m - 1)), y: k % 2 === 0 ? 150 : 270 }]
    }))
  }, [order, portrait, W, H])

  // each step's curve
  const curves = useMemo(() => steps.map((s) => {
    const a = pos[s.f], b = pos[s.t]
    if (!a || !b) return null
    const dx = b.x - a.x, dy = b.y - a.y
    const dist = Math.hypot(dx, dy) || 1
    const side = order.indexOf(s.f) < order.indexOf(s.t) ? -1 : 1
    const off = Math.min(86, Math.max(28, dist * 0.22)) * side
    const mid = lerp(a, b, 0.5)
    const c = { x: mid.x + (-dy / dist) * off, y: mid.y + (dx / dist) * off }
    return { a, b, c }
  }), [steps, pos, order])

  /* ---------- playback ---------- */
  useEffect(() => {
    if (!playing) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = now - last
      last = now
      setT((v) => v + dt / (STEP_MS / speed))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, speed])

  useEffect(() => {
    if (t < 1) return
    if (i < n - 1) { setI(i + 1); setT(0) } else { setT(1); setPlaying(false) }
  }, [t, i, n])

  const go = useCallback((k: number, play?: boolean) => {
    const c = Math.max(0, Math.min(n - 1, k))
    setI(c)
    setT(reducedMotion() ? 1 : 0)
    if (play !== undefined) setPlaying(play)
  }, [n])

  const ended = i === n - 1 && t >= 1 && !playing
  const toggle = () => { if (ended) go(0, true); else setPlaying((p) => !p) }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === ' ' ) { e.preventDefault(); toggle() }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
    else if (e.key === 'Home') { e.preventDefault(); go(0) }
  }

  /* ---------- current frame ---------- */
  const s = steps[i]
  const curve = curves[i]
  const broken = s.k === 'break'
  const travel = Math.min(1, t / TRAVEL)
  const along = ease(travel) * (broken ? BREAK_AT : 1)
  const packet = curve ? bez(curve.a, curve.c, curve.b, along) : null
  const stopped = broken && travel >= 1
  const barrier = curve && broken ? bez(curve.a, curve.c, curve.b, BREAK_AT + 0.05) : null
  // the part of the curve drawn so far (exact sub-curve, so the trail and the packet always agree)
  const trail = curve ? (() => {
    const c2 = lerp(curve.a, curve.c, along)
    const p2 = bez(curve.a, curve.c, curve.b, along)
    return `M ${curve.a.x} ${curve.a.y} Q ${c2.x} ${c2.y} ${p2.x} ${p2.y}`
  })() : ''
  const color = LINK_COLOR[s.k]
  const pct = (p: P) => ({ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` })

  return (
    <section className="pj" aria-label={`${journey.title}, interactive journey`} tabIndex={0} onKeyDown={onKey}>
      <div className="pj__frame" ref={wrap}>
        <div className="pj__stage" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg className="pj__svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {steps.map((st, k) => {
              const c = curves[k]
              if (!c || k > i) return null
              const dashed = st.k === 'batch' ? '8 6' : st.k === 'manual' ? '2 7' : st.k === 'break' ? '5 7' : undefined
              return (
                <path key={k} d={`M ${c.a.x} ${c.a.y} Q ${c.c.x} ${c.c.y} ${c.b.x} ${c.b.y}`} fill="none" stroke={LINK_COLOR[st.k]}
                  strokeWidth={2.2} strokeLinecap="round" strokeDasharray={dashed} opacity={k < i ? 0.45 : 0.28} />
              )
            })}
            {trail && <path d={trail} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />}
          </svg>

          {order.map((id) => {
            const nd = NODE[id]
            const appeared = firstSeen[id] <= i
            const active = id === s.f || id === s.t
            const ghost = steps.slice(0, i + 1).some((st) => st.k === 'break' && st.t === id) && !steps.slice(0, i + 1).some((st) => st.k !== 'break' && (st.f === id || st.t === id))
            return (
              <div key={id} className={`pj__node${appeared ? ' is-in' : ''}${active ? ' is-active' : ''}${ghost ? ' is-ghost' : ''}`} style={pct(pos[id])}>
                <SysIcon node={nd} size="lg" />
                <span>{nd.name}</span>
              </div>
            )
          })}

          {barrier && travel > 0.9 && (
            <div className="pj__barrier" style={pct(barrier)} aria-hidden="true"><span>×</span><small>Stops here</small></div>
          )}

          {packet && (
            <div className={`pj__packet${stopped ? ' is-stopped' : ''}`} style={{ ...pct(packet), background: color }} aria-hidden="true">
              {s.lbl && <span>{s.lbl}</span>}
            </div>
          )}

        </div>

        <div className="pj__cap" key={i} aria-live="polite">
          <span className="pj__capnum" style={{ background: color }}>{i + 1}</span>
          <div>
            <div className="pj__captype" style={{ color }}><i style={{ background: color }} />{LINK_NAME[s.k]}</div>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </div>
        </div>
      </div>

      <div className="pj__bar">
        <div className="pj__btns">
          <button type="button" className="pj__btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous step">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 6h2v12H7zM20 6v12L10 12z" /></svg>
          </button>
          <button type="button" className="pj__btn pj__btn--play" onClick={toggle} aria-label={ended ? 'Replay' : playing ? 'Pause' : 'Play'}>
            {ended ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v4h4" /></svg>
            ) : playing ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <button type="button" className="pj__btn" onClick={() => go(i + 1)} disabled={i === n - 1} aria-label="Next step">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M15 6h2v12h-2zM4 6l10 6-10 6z" /></svg>
          </button>
        </div>

        <div className="pj__scrub" role="group" aria-label="Steps">
          {steps.map((st, k) => (
            <button key={k} type="button" className={`pj__seg${st.k === 'break' ? ' is-break' : ''}${k === i ? ' is-on' : ''}`} aria-label={`Step ${k + 1}: ${st.h}`}
              aria-current={k === i ? 'step' : undefined} onClick={() => go(k)} title={st.h}>
              <i style={{ width: `${k < i ? 100 : k === i ? Math.min(100, t * 100) : 0}%` }} />
            </button>
          ))}
        </div>

        <span className="pj__count">Step {i + 1} of {n}</span>
        <div className="seg pj__speed" role="group" aria-label="Speed">
          {[1, 1.5, 2].map((v) => <button key={v} type="button" aria-pressed={speed === v} onClick={() => setSpeed(v)}>{v}×</button>)}
        </div>
      </div>
      <p className="pj__hint">Space to play or pause. Arrow keys to step. Click a segment to jump.</p>
    </section>
  )
}
