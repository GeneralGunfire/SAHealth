import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { BY_ID, NODES } from '../data/nodes'
import { LAYER_NAME, LINK_LABEL, SECTOR } from '../data/meta'
import { directionOf, edgeBetween, edgesOf, journeysOf } from '../data/derived'
import { Icon } from './Icon'
import { Conf, CONF_TEXT, Soon, Sources, STATUS_HELP, StatusTag } from './ui'
import { Gloss } from './Gloss'
import { RULE_TEXT, gapFinding, pairState, reasonFor } from '../views/gaps'
import { useIsMobile } from '../hooks'
import { useNav } from '../nav'

export type DrawerTarget = { kind: 'node'; id: string } | { kind: 'pair'; a: string; b: string }

const SORTED = [...NODES].sort((a, b) => a.name.localeCompare(b.name))

export function Drawer({ target, onClose }: { target: DrawerTarget; onClose: () => void }) {
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
        {target.kind === 'node' ? <NodeBody id={target.id} level={level} setLevel={setLevel} /> : <PairBody a={target.a} b={target.b} />}
      </motion.aside>
    </>
  )
}

function NodeBody({ id, level, setLevel }: { id: string; level: 'simple' | 'tech'; setLevel: (l: 'simple' | 'tech') => void }) {
  const nav = useNav()
  const n = BY_ID[id]
  const es = edgesOf(id)
  const count = (t: string) => es.filter((e) => e.type === t).length
  const js = journeysOf(id)
  const sec = SECTOR[n.sector]
  const inCmp = nav.compare.includes(id)
  const facts: [string, string | undefined][] = [
    ['Who runs it', n.who], ['What it holds', n.holds], ['What it does not hold', n.notHolds], ['Scale and dates', n.scale], ['Standards and formats', n.standards],
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
        <div><dt>Status</dt><dd><StatusTag status={n.status} /><span className="dd-help">{STATUS_HELP[n.status]}</span></dd></div>
        <div><dt>Confidence</dt><dd><Conf conf={n.conf} /><span className="dd-help">{CONF_TEXT[n.conf].def}</span></dd></div>
      </dl>
      <div className="dos-actions">
        <button className="btn" onClick={() => nav.focusNode(nav.focusId === id ? null : id)} aria-pressed={nav.focusId === id}>{nav.focusId === id ? 'Showing only its links' : 'Focus on its links'}</button>
        <button className="btn" onClick={() => nav.toggleCompare(id)} aria-pressed={inCmp}>{inCmp ? '✓ In comparison' : 'Add to comparison'}</button>
      </div>

      <h3>What it is</h3>
      <div className="seg" role="group" aria-label="Level of detail">
        <button aria-pressed={level === 'simple'} onClick={() => setLevel('simple')}>Plain</button>
        <button aria-pressed={level === 'tech'} onClick={() => setLevel('tech')}>Technical</button>
      </div>
      <p className="dos-lede"><Gloss text={level === 'simple' ? n.summary : n.tech ?? n.summary} /></p>
      {level === 'tech' && !n.tech && <p className="none-note">No further technical detail has been published or found yet.</p>}
      {shown.length > 0 && (
        <dl className="dos-facts">
          {shown.map(([l, v]) => <div key={l}><dt>{l}</dt><dd><Gloss text={v!} /></dd></div>)}
        </dl>
      )}

      <h3>How it connects</h3>
      <div className="dos-links">
        <div className="lc live"><b>{count('live')}</b><span>live</span></div>
        <div className="lc batch"><b>{count('batch')}</b><span>regular batch</span></div>
        <div className="lc manual"><b>{count('manual')}</b><span>retyped or carried</span></div>
      </div>
      {es.length === 0 && <p className="none-note">No connection is documented in the research. That is not proof there is none.</p>}
      <ul className="dos-conn">
        {es.map((e) => {
          const o = BY_ID[e.a === id ? e.b : e.a]
          const d = directionOf(id, o.id)
          const dirText = d ? (d.from === id ? `Data moves from this system to ${o.name}` : `Data moves from ${o.name} to this system`) : 'Direction is not recorded in the research'
          return (
            <li key={e.a + e.b}>
              <button onClick={() => nav.openNode(o.id)}>
                <i className={'lk lk-' + e.type} aria-hidden />
                <span><b>{o.name}</b><small>{e.what}. {dirText}.</small></span>
                <em>{LINK_LABEL[e.type]}</em>
              </button>
            </li>)
        })}
      </ul>

      {n.why && (<><h3>Why it stays disconnected</h3><div className="dos-why"><p><Gloss text={n.why} /></p><small><Conf conf={n.conf} /> · {n.src.map((s) => <code key={s}>{s}</code>)}</small></div></>)}

      <h3>Journeys that include it</h3>
      {js.length === 0 ? <p className="none-note">No journey follows this system.</p> : (
        <ul className="dos-jr">{js.map((j) => <li key={j.id}><button onClick={() => nav.goJourney(j.id)}>{j.title}<span>Open journey →</span></button></li>)}</ul>
      )}

      {n.provs && n.provs.length > 0 && (<><h3>Where it runs</h3><div className="chips">{n.provs.map((p) => <button key={p} className="chip" onClick={() => nav.goProvince(p)}>{p}</button>)}</div></>)}

      <h3>Investigate a relationship</h3>
      <label className="dos-pick">Compare with another system
        <select className="sel" value="" onChange={(e) => { if (e.target.value) nav.openPair(id, e.target.value) }}>
          <option value="">Choose a system…</option>
          {SORTED.filter((x) => x.id !== id).map((x) => <option key={x.id} value={x.id}>{x.name}{x.alias ? ` (${x.alias})` : ''}</option>)}
        </select>
      </label>

      <h3>In the simulation</h3>
      {n.sim
        ? <div className="dos-sim"><Soon>Simulation only</Soon><p>DEXA has a stand-in database, <code>{n.sim[0]}</code>, that mimics this system. It sits on {n.sim[1] === 'R' ? "Rajen's PC" : "Partner's laptop"} and holds no real patient data. It is not connected to the real system.</p></div>
        : <p className="none-note">DEXA has no stand-in for this system yet.</p>}

      <h3>Evidence</h3>
      <Sources ids={n.src} onOpen={nav.goSource} />
    </>
  )
}

function PairBody({ a, b }: { a: string; b: string }) {
  const nav = useNav()
  const A = BY_ID[a], B = BY_ID[b]
  const st = pairState(a, b)
  const e = edgeBetween(a, b)
  const r = reasonFor(A, B)
  const f = gapFinding(A, B)
  const whys = [A, B].filter((n) => n.why)
  const d = e ? directionOf(a, b) : null
  const srcs = [...new Set([...A.src, ...B.src])]
  return (
    <>
      <div className="dos-kick"><code>RELATIONSHIP</code></div>
      <h2 className="dos-pair">{A.name} <span>↔</span> {B.name}</h2>

      <h3>1 · The two systems</h3>
      <ul className="dos-conn">
        {[A, B].map((n) => <li key={n.id}><button onClick={() => nav.openNode(n.id)}><i className="lk" aria-hidden /><span><b>{n.name}</b><small>{[n.alias, LAYER_NAME[n.layer], SECTOR[n.sector].name].filter(Boolean).join(' · ')}</small></span><em>open</em></button></li>)}
      </ul>

      <h3>2 · Is a connection documented?</h3>
      {st === 'none' ? (
        <div className="dos-verdict none"><b>No connection found</b><p>The research documents no exchange of data between these two systems. This means none was found. It does not prove none exists.</p></div>
      ) : (
        <div className={'dos-verdict ' + st}><b>Yes: {LINK_LABEL[st]}</b><p>{e!.what}.{' '}{d ? `In the journey “${d.journey.title}”, data moves from ${BY_ID[d.from].name} to ${BY_ID[d.to].name}.` : 'The direction is not recorded in the research.'}</p></div>
      )}

      {st === 'none' && (<>
        <h3>3 · What kind of gap</h3>
        <p className="dos-lede small"><b>{r.t}.</b> This label is an interpretation. {RULE_TEXT[r.k]}</p>
        <h3>4 · What the records say about why</h3>
        {whys.length === 0 && <p className="none-note">Neither system has a reason recorded for staying disconnected. The cause is not established.</p>}
        {whys.map((n) => (
          <div className="dos-quote" key={n.id}>
            <small>{n.name} · <Conf conf={n.conf} /></small>
            <p><Gloss text={n.why!} /></p>
            <div className="dos-src">{n.src.map((s) => <code key={s}>{s}</code>)}</div>
          </div>
        ))}
      </>)}
      <h3>{st === 'none' ? '5' : '3'} · How sure is the research</h3>
      <p className="dos-lede small"><Conf conf={f.conf} long /> {f.why}</p>
      <h3>{st === 'none' ? '6' : '4'} · Sources for these systems</h3>
      <Sources ids={srcs} empty="Neither system has a source recorded yet." onOpen={nav.goSource} />
      <div className="dos-actions" style={{ marginTop: 18 }}>
        <button className="btn" onClick={() => { nav.setCompare([a, b]); nav.goView('compare') }}>Compare the two systems</button>
      </div>
    </>
  )
}
