import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BY_ID } from '../data/nodes'
import { EDGES, GROUPS, JOURNEYS } from '../data/flows'
import { LAYER_NAME, LINK_COLOR, SECTORS, SECTOR } from '../data/meta'
import { crv, qd, qpt, type Quad } from '../geom'
import { Icon } from '../components/Icon'
import { Conf } from '../components/ui'
import { useIsMobile } from '../hooks'
import type { Journey, JStep } from '../types'

const LANE_H = 290
const LEFT = 150
const GAP = 205
const EASE = [0.22, 1, 0.36, 1] as const
const BREAK = '#C2371F'
const INK = '#1F1D1B'
const reduceMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props { jid: string; setJid: (id: string) => void; sel: string | null; onSelect: (id: string) => void }

const KINDS = { live: 'Live link', batch: 'Regular batch', manual: 'Retyped or carried by hand', break: 'Data stops here' } as const
const kcolor = (k: JStep['k']) => (k === 'break' ? BREAK : LINK_COLOR[k])

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

/** Why a step stops or moves the way it does, taken from the system records and the connection list. */
function whyFor(st: JStep) {
  const e = EDGES.find((x) => (x.a === st.f && x.b === st.t) || (x.a === st.t && x.b === st.f))
  if (st.k === 'break') {
    const n = [BY_ID[st.t], BY_ID[st.f]].find((x) => x.why)
    return n ? { text: n.why!, from: n.name, conf: n.conf, src: n.src } : null
  }
  return e ? { text: e.what + '.', from: 'Connection record', conf: null, src: [] as string[] } : null
}

export function JourneyPlayer({ jid, setJid, sel, onSelect }: Props) {
  const mobile = useIsMobile()
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
  }, [mobile])

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
  const toggle = () => {
    if (idx >= n) { go(-1); setPlaying(true) } else setPlaying((p) => !p)
  }
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,select,textarea')) return
      if (e.key === 'ArrowRight') go(idx + 1)
      if (e.key === 'ArrowLeft') go(idx - 1)
      if (e.key === ' ' && !(e.target as HTMLElement).closest('button')) { e.preventDefault(); toggle() }
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  })

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
  const pk = q ? Array.from({ length: 16 }, (_, i) => qpt(q, i / 15)) : null
  const sc = step ? kcolor(step.k) : INK
  const why = step ? whyFor(step) : null
  const pct = Math.min(100, (idx < 0 ? prog * 0 : idx >= n ? 1 : (idx + prog) / n) * 100)

  const picker = mobile ? (
    <div className="jp-pick">
      <label htmlFor="jsel">Journey</label>
      <select id="jsel" className="sel" value={jid} onChange={(e) => setJid(e.target.value)}>
        {(Object.keys(GROUPS) as (keyof typeof GROUPS)[]).map((k) => (
          <optgroup key={k} label={GROUPS[k].name}>{JOURNEYS.filter((x) => x.g === k).map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}</optgroup>
        ))}
      </select>
    </div>
  ) : (
    <aside className="jp-side">
      <h4 className="jp-h">Thirteen journeys</h4>
      {(Object.keys(GROUPS) as (keyof typeof GROUPS)[]).map((k) => (
        <div className="jp-grp" key={k}>
          <div className="jp-gh">{GROUPS[k].name}<small>{GROUPS[k].sub}</small></div>
          {JOURNEYS.filter((x) => x.g === k).map((x) => (
            <button key={x.id} className="jp-item" aria-pressed={x.id === jid} onClick={() => setJid(x.id)}>{x.title}</button>
          ))}
        </div>
      ))}
    </aside>
  )

  const narration = (
    <div className="jp-cap">
      <div className="jp-bar" aria-hidden><motion.i style={{ width: `${pct}%` }} /></div>
      <AnimatePresence mode="wait">
        <motion.div key={jid + idx} className="jp-text" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} aria-live="polite">
          {idx < 0 && <><div className="jkick">{g.name} journey</div><h3>{j.title}</h3><p>{j.intro}</p></>}
          {step && <>
            <div className="jkick">Step {idx + 1} of {n} · <span className={'kind k-' + step.k}><i />{KINDS[step.k]}</span></div>
            <h3>{step.h}</h3><p>{step.p}</p>
            <div className="jflow"><button onClick={() => onSelect(step.f)}>{BY_ID[step.f].name}</button><b>{step.k === 'break' ? '⊣' : '→'}</b><button onClick={() => onSelect(step.t)}>{BY_ID[step.t].name}</button></div>
            <dl className="jtriad">
              <div><dt>What moves</dt><dd>{step.k === 'break' ? 'Nothing moves on from here.' : step.lbl || '—'}</dd></div>
              <div><dt>How</dt><dd>{KINDS[step.k]}</dd></div>
              <div><dt>{step.k === 'break' ? 'Why it stops' : 'Connection record'}</dt>
                <dd>{why ? <>{why.text}<small>{why.from}{why.conf && <> · <Conf conf={why.conf} /></>}{why.src.length > 0 && <> · {why.src.map((x) => <code key={x}>{x}</code>)}</>}</small></> : 'No written reason recorded for this step yet.'}</dd></div>
            </dl></>}
          {idx >= n && <><div className="jkick">The end of the journey</div>
            <h3>{copies} copies of the data, {hand} retyped by hand</h3>
            <p>{j.steps[n - 1].k === 'break' ? 'And then it stopped. ' : ''}Press replay to watch it again, or choose another journey.</p></>}
        </motion.div>
      </AnimatePresence>
      <div className="counters"><div><b>{copies}</b><span>copies of the data</span></div><div><b>{hand}</b><span>retyped by hand</span></div></div>
    </div>
  )

  const controls = (
    <div className="jp-ctl" data-tour="jp-ctl" role="group" aria-label="Playback">
      <button className="btn" onClick={() => go(-1)} title="Restart" aria-label="Restart">⏮</button>
      <button className="btn" onClick={() => go(idx - 1)} disabled={idx < 0} title="Previous step" aria-label="Previous step">◀</button>
      <button className="btn primary playb" onClick={toggle}>{idx >= n ? 'Replay' : playing ? 'Pause' : 'Play'}</button>
      <button className="btn" onClick={() => go(idx + 1)} disabled={idx >= n} title="Next step" aria-label="Next step">▶</button>
      <div className="dots">{j.steps.map((_, i) => <button key={i} className={i === idx ? 'on' : i < idx ? 'past' : ''} onClick={() => go(i)} aria-label={`Step ${i + 1}`} aria-current={i === idx} />)}</div>
      <div className="seg" role="group" aria-label="Speed"><button aria-pressed={speed === 0.7} onClick={() => setSpeed(0.7)}>0.7×</button><button aria-pressed={speed === 1} onClick={() => setSpeed(1)}>1×</button><button aria-pressed={speed === 1.6} onClick={() => setSpeed(1.6)}>1.6×</button></div>
    </div>
  )

  if (mobile) {
    return (
      <div className="jp jp-m">
        {picker}
        {narration}
        {controls}
        <ol className="jp-steps" data-tour="jp-chap">
          {j.steps.map((st, i) => (
            <li key={i} className={(i === idx ? 'on ' : i < idx ? 'past ' : '') + 'k-' + st.k}>
              <button onClick={() => go(i)}>
                <i>{i + 1}</i>
                <span><b>{st.h}</b>
                  <small>{BY_ID[st.f].name} {st.k === 'break' ? '⊣' : '→'} {BY_ID[st.t].name}</small>
                  <em className={'kind k-' + st.k}><i />{KINDS[st.k]}{st.lbl && st.k !== 'break' ? ` · ${st.lbl}` : ''}</em></span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className="jp">
      {picker}
      <section className="jp-main" style={{ ['--gc' as string]: g.color }}>
        <div className="jp-stage" ref={box}>
          <div className="jp-vp" style={{ width: geo.W, height: geo.H, transform: `translate(${ox}px, ${oy}px) scale(${s})` }}>
            {geo.lanes.map((l, i) => (
              <div key={l.id} className={'jp-lane' + (i % 2 ? ' alt' : '')} style={{ top: i * LANE_H, height: LANE_H }}>
                <div className="jp-lanelabel" style={{ width: LEFT }}><i style={{ background: l.color }} /><b>{l.name}</b><small>{l.sub}</small></div>
              </div>
            ))}
            <svg className="jp-svg" width={geo.W} height={geo.H}>
              {/* earlier steps: a quiet trail */}
              {j.steps.slice(0, Math.max(0, idx)).map((st, i) => st.k === 'break' ? null : (
                <path key={'t' + i} d={qd(arrowQuad(geo.pos[st.f], geo.pos[st.t]))} fill="none" stroke={kcolor(st.k)} strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
              ))}
              {step && q && (
                <g key={jid + idx}>
                  <motion.path d={qd(q)} fill="none" strokeLinecap="round" strokeWidth={5} stroke={sc}
                    strokeDasharray={step.k === 'break' ? '9 10' : step.k === 'batch' ? '16 10' : step.k === 'manual' ? '2 13' : undefined}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.3 / speed, ease: EASE, delay: 0.25 }} />
                  {step.k !== 'break' && (
                    <motion.polygon points={headPts(q)} fill={sc} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (1.45 / speed) }} />
                  )}
                  {step.k === 'break' && mid && (
                    <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 / speed, type: 'spring', stiffness: 300, damping: 16 }} style={{ transformOrigin: `${mid[0]}px ${mid[1]}px` }}>
                      <circle cx={mid[0]} cy={mid[1]} r={24} fill="#F3EFE7" stroke={BREAK} strokeWidth={3} />
                      <path d={`M${mid[0] - 9},${mid[1] - 9} L${mid[0] + 9},${mid[1] + 9} M${mid[0] + 9},${mid[1] - 9} L${mid[0] - 9},${mid[1] + 9}`} stroke={BREAK} strokeWidth={4} strokeLinecap="round" />
                      <text x={mid[0]} y={mid[1] + 46} fill={BREAK} fontSize={15} fontWeight={700} textAnchor="middle" fontFamily="IBM Plex Mono, monospace" letterSpacing="1.5">STOPS HERE</text>
                    </motion.g>
                  )}
                  {step.k !== 'break' && step.lbl && mid && (
                    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 / speed }}>
                      <rect x={mid[0] - (step.lbl.length * 5 + 16)} y={mid[1] - 46} width={step.lbl.length * 10 + 32} height={30} rx={2} fill="#F3EFE7" stroke={sc} strokeWidth={1.6} />
                      <text x={mid[0]} y={mid[1] - 31} fill={INK} fontSize={15} fontWeight={600} textAnchor="middle" dominantBaseline="central" fontFamily="IBM Plex Mono, monospace">{step.lbl}</text>
                    </motion.g>
                  )}
                  {pk && step.k !== 'break' && (
                    <motion.circle r={10} fill={sc} stroke="#F3EFE7" strokeWidth={3}
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
              const num = on ? geo.order.indexOf(id) + 1 : 0
              return (
                <motion.button key={jid + id} className={'jn st-' + nd.status + (active ? ' active' : '') + (sel === id ? ' sel' : '')}
                  style={{ left: p.x - 110, top: p.y - 50, ['--c' as string]: SECTOR[nd.sector].color }}
                  initial={false} animate={{ opacity: on ? 1 : ghost ? 0.2 : 0, scale: on ? 1 : 0.9 }} transition={{ duration: 0.5, ease: EASE }}
                  onClick={() => onSelect(id)} aria-label={nd.name}>
                  <span className="jn-tile"><Icon name={nd.icon} size={32} />{num > 0 && <span className="stepn">{num}</span>}</span>
                  <b>{nd.name}</b>
                  {nd.alias && <i>{nd.alias}</i>}
                  <em>{LAYER_NAME[nd.layer]}</em>
                </motion.button>
              )
            })}
          </div>
        </div>
        {narration}
        {controls}
      </section>
      <ol className="jp-chapters" data-tour="jp-chap" aria-label="Chapters">
        <h4 className="jp-h">Chapters</h4>
        {j.steps.map((st, i) => (
          <li key={i}><button className={(i === idx ? 'on' : i < idx ? 'past' : '') + ' k-' + st.k} onClick={() => go(i)}><i>{i + 1}</i>{st.h}</button></li>
        ))}
      </ol>
    </div>
  )
}
