import { useState } from 'react'
import { motion } from 'framer-motion'
import { BY_ID } from '../data/nodes'
import { EDGES } from '../data/flows'
import { LAYER_NAME, SECTOR, SRC } from '../data/meta'
import { Icon } from './Icon'
import { pairState, reasonFor } from '../views/Matrix'

export type DrawerTarget = { kind: 'node'; id: string } | { kind: 'pair'; a: string; b: string }

const confClass = { confirmed: 'ok', likely: 'mid', uncertain: 'low' } as const

export function Drawer({ target, onClose, onGo }: { target: DrawerTarget; onClose: () => void; onGo: (id: string) => void }) {
  const [level, setLevel] = useState<'simple' | 'tech'>('simple')
  return (
    <>
      <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside className="drawer" initial={{ x: 460 }} animate={{ x: 0 }} exit={{ x: 460 }} transition={{ type: 'spring', stiffness: 360, damping: 38 }} aria-label="Details">
        <button className="x" onClick={onClose} aria-label="Close">✕</button>
        {target.kind === 'node' ? <NodeBody id={target.id} level={level} setLevel={setLevel} onGo={onGo} /> : <PairBody a={target.a} b={target.b} onGo={onGo} />}
      </motion.aside>
    </>
  )
}

function NodeBody({ id, level, setLevel, onGo }: { id: string; level: 'simple' | 'tech'; setLevel: (l: 'simple' | 'tech') => void; onGo: (id: string) => void }) {
  const n = BY_ID[id]
  const cn = EDGES.filter((e) => e.a === id || e.b === id)
  const count = (t: string) => cn.filter((e) => e.type === t).length
  const sec = SECTOR[n.sector]
  const facts: [string, string | undefined][] = [
    ['Who runs it', n.who], ['What it holds', n.holds], ['What it does not hold', n.notHolds], ['Scale and dates', n.scale], ['Standards and formats', n.standards], ['Why it stays disconnected', n.why],
  ]
  const shown = facts.filter(([, v]) => v)
  return (
    <>
      <div className="dh" style={{ ['--c' as string]: sec.color }}>
        <span className="ico2"><Icon name={n.icon} size={28} /></span>
        <div><h2>{n.name}</h2>{n.alias && <div className="alias">{n.alias}</div>}</div>
      </div>
      <div className="badges">
        <span className="badge c" style={{ ['--c' as string]: sec.color }}>{sec.name}</span>
        <span className="badge">{LAYER_NAME[n.layer]}</span>
        <span className="badge">{n.status}</span>
        <span className={'badge ' + confClass[n.conf]} title="How sure we are of this description">{n.conf}</span>
      </div>
      <div className="seg" style={{ marginTop: 14 }}>
        <button aria-pressed={level === 'simple'} onClick={() => setLevel('simple')}>Plain</button>
        <button aria-pressed={level === 'tech'} onClick={() => setLevel('tech')}>Technical</button>
      </div>
      <p>{level === 'simple' ? n.summary : n.tech ?? n.summary}</p>
      {level === 'tech' && !n.tech && <p style={{ color: 'var(--mute)', fontSize: 13 }}>No further technical detail has been published or found yet.</p>}
      <h3>How connected is it?</h3>
      <div className="iso">
        <div><b>{count('live')}</b><span>live</span></div>
        <div><b>{count('batch')}</b><span>regular batch</span></div>
        <div><b>{count('manual')}</b><span>retyped or carried</span></div>
      </div>
      {shown.length > 0 && <h3>More about it</h3>}
      {shown.map(([l, v]) => <details key={l}><summary>{l}</summary><div className="db">{v}</div></details>)}
      <h3>Connects to</h3>
      {cn.length === 0 && <p style={{ color: 'var(--mute)' }}>No connections found. This system is an island.</p>}
      {cn.map((e) => { const o = BY_ID[e.a === id ? e.b : e.a]; return (
        <button key={e.a + e.b} className="conn" onClick={() => onGo(o.id)}>
          <span className={'lt ' + e.type} /><span>{o.name}<small>{e.what}</small></span><em>{e.type === 'manual' ? 'by hand' : e.type}</em>
        </button>) })}
      <h3>In the simulation</h3>
      {n.sim
        ? <div className="simbox">Modelled by <b className="mono">{n.sim[0]}</b><br /><span style={{ color: 'var(--mute)' }}>{n.sim[1] === 'R' ? "Rajen's PC" : "Partner's laptop"}</span></div>
        : <div className="simbox none">No stand-in database yet.</div>}
      <h3>Sources</h3>
      {n.src.length ? <ul className="srcs">{n.src.map((s) => SRC[s] && <li key={s}><a href={SRC[s].url} target="_blank" rel="noreferrer">{SRC[s].title}</a></li>)}</ul>
        : <p style={{ color: 'var(--mute)', fontSize: 13 }}>No source recorded yet. This description is awaiting verification.</p>}
    </>
  )
}

function PairBody({ a, b, onGo }: { a: string; b: string; onGo: (id: string) => void }) {
  const A = BY_ID[a], B = BY_ID[b]
  const st = pairState(a, b)
  const e = EDGES.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))
  const r = reasonFor(A, B)
  return (
    <>
      <div className="eyebrow" style={{ marginTop: 6 }}>Pair of systems</div>
      <h2 style={{ marginTop: 8 }}>{A.name} ↔ {B.name}</h2>
      <div className="reasonbox" style={{ marginTop: 18 }}>
        {st === 'none'
          ? <><b style={{ color: 'var(--red)' }}>Not connected.</b><p>Main reason: <b>{r.t}</b>.</p><p style={{ color: 'var(--mute)', fontSize: 13 }}>A fuller, sourced explanation of why these two systems do not exchange data arrives with the research pass.</p></>
          : <><b>{st === 'live' ? 'Live link' : st === 'batch' ? 'Regular batch link' : 'Manual link'}.</b><p>{e!.what}.</p></>}
      </div>
      <h3>Open a system</h3>
      {[A, B].map((n) => <button key={n.id} className="conn" onClick={() => onGo(n.id)}><span className="lt" />{n.name}</button>)}
    </>
  )
}
