import { useMemo, useState } from 'react'
import { NODES } from '../data/nodes'
import { LAYERS, LINK_LABEL, SECTORS, SECTOR } from '../data/meta'
import { EDGES } from '../data/flows'
import { Icon } from '../components/Icon'
import { Conf, ConfGlyph } from '../components/ui'
import { useIsMobile } from '../hooks'
import { useNav } from '../nav'
import { REASONS, gapFinding, pairState, reasonFor, type ReasonKey } from './gaps'
import type { SysNode } from '../types'

type Cert = 'all' | 'confirmed' | 'likely' | 'uncertain'
interface Props { simple: boolean; group: 'layer' | 'sector'; showWhy: boolean; onPair: (a: string, b: string) => void }

export function Matrix({ simple, group, showWhy, onPair }: Props) {
  const mobile = useIsMobile()
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null)
  const [rf, setRf] = useState<ReasonKey | null>(null)
  const [cert, setCert] = useState<Cert>('all')
  const key = (n: SysNode) => (group === 'layer' ? n.layer : n.sector)
  const ids = useMemo(() => {
    const order: string[] = group === 'layer' ? LAYERS.map((l) => l.id) : SECTORS.map((s) => s.id)
    const k = (n: SysNode) => (group === 'layer' ? n.layer : n.sector)
    return NODES.filter((n) => (simple ? n.core : true)).sort((a, b) => order.indexOf(k(a)) - order.indexOf(k(b)))
  }, [simple, group])
  const n = ids.length, cs = n > 24 ? 24 : 30

  const stats = useMemo(() => {
    let total = 0, live = 0, other = 0, none = 0
    const byConf = { confirmed: 0, likely: 0, uncertain: 0 }
    const rc: Record<string, number> = {}
    REASONS.forEach((r) => (rc[r.k] = 0))
    ids.forEach((a, i) => ids.forEach((b, j) => {
      if (i >= j) return
      total++
      const st = pairState(a.id, b.id)
      if (st === 'live') live++
      else if (st === 'none') { none++; rc[reasonFor(a, b).k]++; byConf[gapFinding(a, b).conf]++ } else other++
    }))
    const idset = new Set(ids.map((x) => x.id))
    const islands = ids.filter((x) => !EDGES.some((e) => (e.a === x.id || e.b === x.id) && idset.has(e.a) && idset.has(e.b)))
    return { total, live, other, none, byConf, rc, islands }
  }, [ids])

  const matches = (a: SysNode, b: SysNode) => cert === 'all' || gapFinding(a, b).conf === cert
  const info = hover ? (() => {
    const A = ids[hover.r], B = ids[hover.c]
    if (!A || !B || A.id === B.id) return null
    const st = pairState(A.id, B.id)
    return { A, B, st, conf: gapFinding(A, B).conf, why: reasonFor(A, B).t }
  })() : null

  return (
    <div className="gaps">
      <section className="gap-sum" data-tour="gaps-stats">
        <div className="gs-fig">
          <div><b>{stats.total}</b><span>possible pairs of systems</span></div>
          <div><b>{stats.live}</b><span>live links</span></div>
          <div><b>{stats.other}</b><span>batch or by-hand links</span></div>
          <div className="hot"><b>{Math.round((stats.none / Math.max(1, stats.total)) * 100)}%</b><span>{stats.none} pairs with no connection found</span></div>
        </div>
        <div className="gs-bar" role="group" aria-label="Why pairs are not connected">
          <div className="gs-bar-h"><label>Why they are not connected</label><small>Categories are assigned by rule: an interpretation, not a sourced finding.</small></div>
          <div className="gs-stack">
            {REASONS.map((r) => stats.rc[r.k] > 0 && (
              <button key={r.k} style={{ flexGrow: stats.rc[r.k], background: r.c }} aria-pressed={rf === r.k} className={rf && rf !== r.k ? 'dim' : ''}
                onClick={() => setRf(rf === r.k ? null : r.k)} title={`${r.t}: ${stats.rc[r.k]} pairs`}><b>{r.s}</b></button>
            ))}
          </div>
          <div className="gs-legend">
            {REASONS.map((r) => (
              <button key={r.k} className="rchip" aria-pressed={rf === r.k} onClick={() => setRf(rf === r.k ? null : r.k)}>
                <i style={{ background: r.c }}>{r.s}</i>{r.t}<b>{stats.rc[r.k]}</b>
              </button>
            ))}
          </div>
        </div>
        <div className="gs-cert">
          <label>How firm is the finding</label>
          <div className="seg" role="group" aria-label="Filter by certainty">
            <button aria-pressed={cert === 'all'} onClick={() => setCert('all')}>All</button>
            <button aria-pressed={cert === 'confirmed'} onClick={() => setCert('confirmed')}><ConfGlyph conf="confirmed" /> Confirmed <code>{stats.byConf.confirmed}</code></button>
            <button aria-pressed={cert === 'likely'} onClick={() => setCert('likely')}><ConfGlyph conf="likely" /> Likely <code>{stats.byConf.likely}</code></button>
            <button aria-pressed={cert === 'uncertain'} onClick={() => setCert('uncertain')}><ConfGlyph conf="uncertain" /> Uncertain <code>{stats.byConf.uncertain}</code></button>
          </div>
          <small>A pair is only as firm as the weaker of its two systems. “No connection found” is weaker than “proven absent”: it records what the research did not find.</small>
        </div>
        {stats.islands.length > 0 && (
          <div className="gs-islands"><label>Systems with no recorded connection</label>
            <p>{stats.islands.map((x, i) => <span key={x.id}>{i > 0 && ', '}{x.name}</span>)}</p>
          </div>
        )}
      </section>

      <PairFinder />

      {mobile ? (
        <PairList ids={ids} showWhy={showWhy} rf={rf} cert={cert} matches={matches} onPair={onPair} />
      ) : (
        <>
          <div className="gap-read" aria-live="polite">
            {info
              ? <><b>{info.A.name} ↔ {info.B.name}</b> {info.st === 'none' ? <>not connected · {info.why} · <Conf conf={info.conf} /></> : <>{LINK_LABEL[info.st as "live"]}</>}</>
              : 'Hover a square to read it. Click it for the explanation and sources.'}
          </div>
          <div className="mwrap">
            <div className="mgrid" style={{ ['--cs' as string]: cs + 'px', gridTemplateColumns: `240px repeat(${n}, ${cs}px)` }}>
              <div className="mcorner" />
              {ids.map((b, j) => (
                <div key={b.id} className={'mhead' + (hover?.c === j ? ' hl' : '') + (j > 0 && key(b) !== key(ids[j - 1]) ? ' gsepL' : '')}>
                  <span style={{ left: cs / 2 }}>{b.name}</span>
                </div>
              ))}
              {ids.map((a, i) => (
                <Row key={a.id}>
                  <div className={'mrow' + (hover?.r === i ? ' hl' : '') + (i > 0 && key(a) !== key(ids[i - 1]) ? ' gsepT' : '')} style={{ ['--c' as string]: SECTOR[a.sector].color }}>
                    <span className="mi"><Icon name={a.icon} size={12} /></span>{a.name}
                  </div>
                  {ids.slice(0, i + 1).map((b, j) => {
                    const self = i === j
                    const st = self ? 'self' : pairState(a.id, b.id)
                    const r = st === 'none' ? reasonFor(a, b) : null
                    const c = self ? 'confirmed' : gapFinding(a, b).conf
                    const faded = !self && ((rf && (st !== 'none' || r!.k !== rf)) || !matches(a, b) || (cert !== 'all' && st !== 'none'))
                    const sepL = j > 0 && key(b) !== key(ids[j - 1])
                    const sepT = i > 0 && key(a) !== key(ids[i - 1])
                    return (
                      <button key={b.id} disabled={self}
                        className={`mcell ${st} cert-${c}${st === 'none' && !showWhy ? ' plain cf-' + c : ''}${faded ? ' faded' : ''}${sepL ? ' gsepL' : ''}${sepT ? ' gsepT' : ''}${hover?.r === i || hover?.c === j ? ' xh' : ''}`}
                        style={r && showWhy ? { background: r.c } : undefined}
                        onMouseEnter={() => setHover({ r: i, c: j })} onMouseLeave={() => setHover(null)} onFocus={() => setHover({ r: i, c: j })}
                        onClick={() => onPair(a.id, b.id)}
                        aria-label={self ? a.name : `${a.name} and ${b.name}: ${st === 'none' ? 'not connected, ' + r!.t + ', ' + c : LINK_LABEL[st as 'live']}`}>
                        {r && showWhy ? <b>{r.s}</b> : <i />}
                      </button>
                    )
                  })}
                  {n - i - 1 > 0 && <span className="mvoid" style={{ gridColumn: `span ${n - i - 1}` }} />}
                </Row>
              ))}
            </div>
          </div>
        </>
      )}
      <GapKey showWhy={showWhy} />
    </div>
  )
}

/** Type two words, such as "lab" and "claims" or "HPRS", and see every pair that matches. Works across all systems. */
function PairFinder() {
  const nav = useNav()
  const [q, setQ] = useState('')
  const t = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
  const hay = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, `${n.name} ${n.alias ?? ''}`.toLowerCase()])), [])
  const hits = useMemo(() => {
    if (!t.length) return []
    const out: { a: SysNode; b: SysNode }[] = []
    for (let i = 0; i < NODES.length && out.length < 8; i++) for (let j = i + 1; j < NODES.length && out.length < 8; j++) {
      const a = NODES[i], b = NODES[j], h = hay[a.id] + ' | ' + hay[b.id]
      if (t.every((w) => h.includes(w))) out.push({ a, b })
    }
    return out
  }, [q]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="pfind" aria-label="Find a pair of systems">
      <label className="srcx-q"><span>Find a pair of systems</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="For example: hprs lab, or claims hospital" />
      </label>
      {t.length > 0 && hits.length === 0 && <p className="none-note">No pair has both words in its names. Try one word.</p>}
      {hits.length > 0 && (
        <ul className="pfind-list">
          {hits.map(({ a, b }) => { const st = pairState(a.id, b.id); return (
            <li key={a.id + b.id}><button onClick={() => nav.openPair(a.id, b.id)}>
              <b>{a.name} ↔ {b.name}</b>
              <span className={'pstate ' + st}><i className={'lk lk-' + st} />{st === 'none' ? 'No connection found' : LINK_LABEL[st]}</span>
            </button></li>) })}
        </ul>
      )}
    </section>
  )
}

function GapKey({ showWhy }: { showWhy: boolean }) {
  return (
    <div className="mkey">
      <span><i className="k live" />Live link</span>
      <span><i className="k batch" />Regular batch</span>
      <span><i className="k manual" />Retyped or carried by hand</span>
      <span><i className="k none" />{showWhy ? 'Not connected: the letter says why' : 'Not connected: darker means a firmer finding'}</span>
      <span className="mk-cert"><ConfGlyph conf="confirmed" />solid edge: both systems confirmed</span>
      <span className="mk-cert"><ConfGlyph conf="uncertain" />dashed edge: a less certain finding</span>
    </div>
  )
}

/** Small-screen alternative: pick one system, read its relationship with every other. */
function PairList({ ids, showWhy, rf, cert, matches, onPair }: { ids: SysNode[]; showWhy: boolean; rf: ReasonKey | null; cert: Cert; matches: (a: SysNode, b: SysNode) => boolean; onPair: (a: string, b: string) => void }) {
  const [pick, setPick] = useState(ids[0]?.id ?? '')
  const me = ids.find((x) => x.id === pick) ?? ids[0]
  const rows = ids.filter((x) => x.id !== me.id).map((x) => ({ x, st: pairState(me.id, x.id), r: reasonFor(me, x), f: gapFinding(me, x) }))
  const linked = rows.filter((r) => r.st !== 'none')
  const unlinked = rows.filter((r) => r.st === 'none' && (!rf || r.r.k === rf) && matches(me, r.x))
  return (
    <div className="pairlist">
      <label htmlFor="pairpick">Choose a system</label>
      <select id="pairpick" className="sel" value={me.id} onChange={(e) => setPick(e.target.value)}>
        {ids.map((x) => <option key={x.id} value={x.id}>{x.name}{x.alias ? ` (${x.alias})` : ''}</option>)}
      </select>
      <h4>Connected to {linked.length} of {rows.length}</h4>
      {linked.length === 0 && <p className="none-note">No recorded connections. This system is an island.</p>}
      <ul>{linked.map(({ x, st }) => (
        <li key={x.id}><button onClick={() => onPair(me.id, x.id)}><i className={'lk lk-' + st} /><span>{x.name}</span><em>{LINK_LABEL[st as 'live']}</em></button></li>
      ))}</ul>
      <h4>Not connected{rf || cert !== 'all' ? ' (filtered)' : ''}: {unlinked.length}</h4>
      <ul>{unlinked.map(({ x, r, f }) => (
        <li key={x.id}><button className={'cert-' + f.conf} onClick={() => onPair(me.id, x.id)}>
          <i className="rl" style={showWhy ? { background: r.c } : undefined}>{showWhy ? r.s : ''}</i><span>{x.name}</span><em>{showWhy ? r.t : f.conf}</em>
        </button></li>
      ))}</ul>
    </div>
  )
}

// grid helper: renders children without an extra wrapper box
function Row({ children }: { children: React.ReactNode }) { return <>{children}</> }
