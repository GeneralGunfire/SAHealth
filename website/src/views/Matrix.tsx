import { useMemo, useState } from 'react'
import { NODES } from '../data/nodes'
import { EDGES } from '../data/flows'
import { LAYERS, SECTORS, SECTOR } from '../data/meta'
import { Icon } from '../components/Icon'
import type { SysNode } from '../types'

export const REASONS = [
  { k: 'paper', t: 'Paper-based', c: '#cfc6ae' },
  { k: 'owners', t: 'Public–private wall', c: '#c4b9d8' },
  { k: 'noid', t: 'No shared patient ID', c: '#b5c3dc' },
  { k: 'std', t: 'Different standards', c: '#b2d0cc' },
  { k: 'mandate', t: 'No mandate or funding', c: '#dcb9b4' },
] as const

export function pairState(a: string, b: string) {
  const e = EDGES.find((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a))
  return e ? e.type : 'none'
}
export function reasonFor(a: SysNode, b: SysNode) {
  if (a.id === 'paper' || b.id === 'paper' || a.status === 'paper' || b.status === 'paper') return REASONS[0]
  const pp = (a.sector === 'public' && b.sector === 'private') || (a.sector === 'private' && b.sector === 'public')
  if (pp) return REASONS[1]
  if (a.layer === 'standards' || b.layer === 'standards') return REASONS[3]
  const cl = ['hospital', 'phc', 'lab', 'programme', 'pharmacy', 'emergency']
  if (cl.includes(a.layer) && cl.includes(b.layer)) return REASONS[2]
  return REASONS[4]
}

interface Props { simple: boolean; group: 'layer' | 'sector'; showWhy: boolean; onPair: (a: string, b: string) => void }

export function Matrix({ simple, group, showWhy, onPair }: Props) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null)
  const [rf, setRf] = useState<string | null>(null)
  const ids = useMemo(() => {
    const order: string[] = group === 'layer' ? LAYERS.map((l) => l.id) : SECTORS.map((s) => s.id)
    const key = (n: SysNode) => (group === 'layer' ? n.layer : n.sector)
    return NODES.filter((n) => (simple ? n.core : true)).sort((a, b) => order.indexOf(key(a)) - order.indexOf(key(b)))
  }, [simple, group])
  const key = (n: SysNode) => (group === 'layer' ? n.layer : n.sector)
  const n = ids.length, cs = n > 24 ? 24 : 30

  const stats = useMemo(() => {
    let total = 0, live = 0, other = 0, none = 0
    const rc: Record<string, number> = {}
    REASONS.forEach((r) => (rc[r.k] = 0))
    ids.forEach((a, i) => ids.forEach((b, j) => {
      if (i >= j) return
      total++
      const st = pairState(a.id, b.id)
      if (st === 'live') live++
      else if (st === 'none') { none++; rc[reasonFor(a, b).k]++ } else other++
    }))
    return { total, live, other, none, rc }
  }, [ids])

  const info = hover ? (() => {
    const A = ids[hover.r], B = ids[hover.c]
    if (A.id === B.id) return null
    const st = pairState(A.id, B.id)
    return `${A.name} ↔ ${B.name}: ${st === 'none' ? 'not connected · ' + reasonFor(A, B).t : st === 'live' ? 'live link' : st === 'batch' ? 'regular batch link' : 'manual link (retyped or carried)'}`
  })() : null

  return (
    <div>
      <div className="mstats" data-tour="gaps-stats">
        <div className="mstat"><b>{stats.total}</b><span>possible pairs of systems</span></div>
        <div className="mstat"><b>{stats.live}</b><span>live links</span></div>
        <div className="mstat"><b>{stats.other}</b><span>regular or manual links</span></div>
        <div className="mstat hot"><b>{Math.round((stats.none / stats.total) * 100)}%</b><span>{stats.none} pairs not connected at all</span></div>
      </div>
      <div className="rchips">
        <label>Why they are not connected</label>
        {REASONS.map((r) => (
          <button key={r.k} className="rchip" style={{ ['--rc' as string]: r.c }} aria-pressed={rf === r.k} onClick={() => setRf(rf === r.k ? null : r.k)}>
            <i />{r.t} <b>{stats.rc[r.k]}</b>
          </button>
        ))}
      </div>
      <div className="strip" style={{ minHeight: 44, marginBottom: 12 }}>{info ?? 'Hover a square to read it. Click it for details.'}</div>
      <div className="mwrap">
        <div className="mgrid" style={{ ['--cs' as string]: cs + 'px', gridTemplateColumns: `250px repeat(${n}, ${cs}px)` }}>
          <div />
          {ids.map((b, j) => (
            <div key={b.id} className={'mhead' + (hover?.c === j ? ' hl' : '')}>
              <span style={{ left: cs / 2 }}>{b.name}</span>
            </div>
          ))}
          {ids.map((a, i) => (
            <Row key={a.id}>
              <div className={'mrow' + (hover?.r === i ? ' hl' : '') + (i > 0 && key(a) !== key(ids[i - 1]) ? ' gsepT' : '')} style={{ ['--c' as string]: SECTOR[a.sector].color }}>
                <span className="mi"><Icon name={a.icon} size={12} /></span>{a.name}
              </div>
              {ids.map((b, j) => {
                const self = i === j
                const st = self ? 'self' : pairState(a.id, b.id)
                const r = st === 'none' ? reasonFor(a, b) : null
                const faded = rf && !self && (st !== 'none' || r!.k !== rf)
                const sepL = j > 0 && key(b) !== key(ids[j - 1])
                const sepT = i > 0 && key(a) !== key(ids[i - 1])
                return (
                  <button key={b.id} disabled={self}
                    className={`mcell ${st}${st === 'none' && !showWhy ? ' plain' : ''}${faded ? ' faded' : ''}${sepL ? ' gsep' : ''}${sepT ? ' gsepT' : ''}`}
                    data-r={r?.k} style={st === 'none' && showWhy ? undefined : undefined}
                    onMouseEnter={() => setHover({ r: i, c: j })} onMouseLeave={() => setHover(null)}
                    onClick={() => onPair(a.id, b.id)} aria-label={`${a.name} and ${b.name}: ${st}`}>
                    <i />
                  </button>
                )
              })}
            </Row>
          ))}
        </div>
        <div className="mkey">
          <span><i style={{ background: 'var(--live)' }} />Live link</span>
          <span><i style={{ background: 'var(--batch)' }} />Regular batch</span>
          <span><i style={{ background: 'repeating-linear-gradient(45deg,#e0b457 0 3px,#c08a1e 3px 6px)' }} />Retyped or carried by hand</span>
          <span><i style={{ background: 'var(--surface2)', border: '1px solid var(--line2)' }} />Not connected (colour shows why)</span>
          <span style={{ marginLeft: 'auto' }}>Thick lines separate {group === 'layer' ? 'layers' : 'sectors'}.</span>
        </div>
      </div>
    </div>
  )
}
// grid helper: renders children without an extra wrapper box
function Row({ children }: { children: React.ReactNode }) { return <>{children}</> }
