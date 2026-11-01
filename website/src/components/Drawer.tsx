import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BY_ID } from '../data/nodes'
import { EDGES } from '../data/flows'
import { LAYER_NAME, LINK_LABEL, SECTOR } from '../data/meta'
import { Icon } from './Icon'
import { Conf, Soon, Sources, StatusTag } from './ui'
import { RULE_TEXT, gapFinding, pairState, reasonFor } from '../views/gaps'
import { useIsMobile } from '../hooks'

export type DrawerTarget = { kind: 'node'; id: string } | { kind: 'pair'; a: string; b: string }

export function Drawer({ target, onClose, onGo }: { target: DrawerTarget; onClose: () => void; onGo: (id: string) => void }) {
  const [level, setLevel] = useState<'simple' | 'tech'>('simple')
  const mobile = useIsMobile()
  const ref = useRef<HTMLElement>(null)
  useEffect(() => { ref.current?.scrollTo({ top: 0 }) }, [target])
  useEffect(() => { ref.current?.focus() }, [])
  const from = mobile ? { y: '100%' } : { x: 40, opacity: 0 }
  return (
    <>
      {mobile && <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />}
      <motion.aside ref={ref} tabIndex={-1} className="dossier" initial={from} animate={{ x: 0, y: 0, opacity: 1 }} exit={from} transition={{ type: 'spring', stiffness: 380, damping: 40 }} aria-label="Details">
        <button className="dos-x" onClick={onClose} aria-label="Close details">Close <kbd>Esc</kbd></button>
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
      <div className="dos-kick"><code>SYSTEM · {n.id}</code></div>
      <div className="dos-title" style={{ ['--c' as string]: sec.color }}>
        <span className="dos-ico"><Icon name={n.icon} size={26} /></span>
        <div><h2>{n.name}</h2>{n.alias && <div className="dos-alias">{n.alias}</div>}</div>
      </div>
      <dl className="dos-meta">
        <div><dt>Layer</dt><dd>{LAYER_NAME[n.layer]}</dd></div>
        <div><dt>Sector</dt><dd><i className="pip" style={{ background: sec.color }} />{sec.name}</dd></div>
        <div><dt>Status</dt><dd><StatusTag status={n.status} /></dd></div>
        <div><dt>Confidence</dt><dd><Conf conf={n.conf} /></dd></div>
      </dl>

      <div className="seg" role="group" aria-label="Level of detail">
        <button aria-pressed={level === 'simple'} onClick={() => setLevel('simple')}>Plain</button>
        <button aria-pressed={level === 'tech'} onClick={() => setLevel('tech')}>Technical</button>
      </div>
      <p className="dos-lede">{level === 'simple' ? n.summary : n.tech ?? n.summary}</p>
      {level === 'tech' && !n.tech && <p className="none-note">No further technical detail has been published or found yet.</p>}

      {shown.length > 0 && (
        <dl className="dos-facts">
          {shown.map(([l, v]) => <div key={l} className={l.startsWith('Why') ? 'why' : ''}><dt>{l}</dt><dd>{v}</dd></div>)}
        </dl>
      )}

      <h3>How connected is it</h3>
      <div className="dos-links">
        <div className="lc live"><b>{count('live')}</b><span>live</span></div>
        <div className="lc batch"><b>{count('batch')}</b><span>regular batch</span></div>
        <div className="lc manual"><b>{count('manual')}</b><span>retyped or carried</span></div>
      </div>
      {cn.length === 0 && <p className="none-note">No connections found in the research. This system is an island.</p>}
      <ul className="dos-conn">
        {cn.map((e) => { const o = BY_ID[e.a === id ? e.b : e.a]; return (
          <li key={e.a + e.b}>
            <button onClick={() => onGo(o.id)}>
              <i className={'lk lk-' + e.type} aria-hidden />
              <span><b>{o.name}</b><small>{e.what}</small></span>
              <em>{LINK_LABEL[e.type]}</em>
            </button>
          </li>) })}
      </ul>

      <h3>In the simulation</h3>
      {n.sim
        ? <div className="dos-sim"><Soon>Simulation only</Soon><p>DEXA stand-in database <code>{n.sim[0]}</code> mimics this system. It sits on {n.sim[1] === 'R' ? "Rajen's PC" : "Partner's laptop"} and holds no real patient data. It is not connected to the real system.</p></div>
        : <p className="none-note">No stand-in database yet.</p>}

      <h3>Sources</h3>
      <Sources ids={n.src} />
    </>
  )
}

function PairBody({ a, b, onGo }: { a: string; b: string; onGo: (id: string) => void }) {
  const A = BY_ID[a], B = BY_ID[b]
  const st = pairState(a, b)
  const e = EDGES.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))
  const r = reasonFor(A, B)
  const f = gapFinding(A, B)
  const whys = [A, B].filter((n) => n.why)
  return (
    <>
      <div className="dos-kick"><code>PAIR · {a} ↔ {b}</code></div>
      <h2 className="dos-pair">{A.name} <span>↔</span> {B.name}</h2>
      {st === 'none' ? (
        <>
          <div className="dos-verdict none">
            <b>No connection found</b>
            <p>The research found no recorded exchange of data between these two systems.</p>
          </div>
          <dl className="dos-meta">
            <div><dt>Main reason</dt><dd>{r.t}</dd></div>
            <div><dt>Finding</dt><dd><Conf conf={f.conf} /></dd></div>
          </dl>
          <p className="dos-lede small">
            <b>This category is an interpretation, not a sourced finding.</b> {RULE_TEXT[r.k]} {f.why}
          </p>
          {whys.length > 0 && <h3>What the system records say</h3>}
          {whys.map((n) => (
            <div className="dos-quote" key={n.id}>
              <small>{n.name} · <Conf conf={n.conf} /></small>
              <p>{n.why}</p>
              <div className="dos-src">{n.src.map((s) => <code key={s}>{s}</code>)}</div>
            </div>
          ))}
          {whys.length === 0 && <p className="none-note">Neither system has a written reason for staying disconnected yet.</p>}
        </>
      ) : (
        <>
          <div className={'dos-verdict ' + st}>
            <b>{LINK_LABEL[st]}</b>
            <p>{e!.what}.</p>
          </div>
          <dl className="dos-meta"><div><dt>Systems</dt><dd><Conf conf={f.conf} /> (lower of the two)</dd></div></dl>
        </>
      )}
      <h3>Open a system</h3>
      <ul className="dos-conn">
        {[A, B].map((n) => <li key={n.id}><button onClick={() => onGo(n.id)}><i className="lk" aria-hidden /><span><b>{n.name}</b><small>{n.alias ?? LAYER_NAME[n.layer]}</small></span><em>open</em></button></li>)}
      </ul>
      <h3>Sources</h3>
      <Sources ids={[...new Set([...A.src, ...B.src])]} empty="Neither system has a source recorded yet." />
    </>
  )
}
