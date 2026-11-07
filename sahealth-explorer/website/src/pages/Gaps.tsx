import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NODES } from '../data/nodes'
import { LAYERS, SECTORS } from '../data/meta'
import { REASONS, gapStats, pairState, reasonFor, LINK_NAME } from '../lib/model'
import { PageHead, SysIcon } from '../components/ui'
import type { SysNode } from '../types'

type Pair = { r: number; c: number }

export default function Gaps() {
  const [keyOnly, setKeyOnly] = useState(true)
  const [group, setGroup] = useState<'layer' | 'sector'>('layer')
  const [filter, setFilter] = useState<string | null>(null)
  const [pair, setPair] = useState<Pair | null>(null)

  const keyOf = (n: SysNode) => (group === 'layer' ? n.layer : n.sector)
  const list = useMemo(() => {
    const order: string[] = group === 'layer' ? LAYERS.map((l) => l.id) : SECTORS.map((s) => s.id)
    return NODES.filter((n) => !keyOnly || n.core)
      .sort((a, b) => order.indexOf(keyOf(a)) - order.indexOf(keyOf(b)) || a.name.localeCompare(b.name))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyOnly, group])

  const stats = useMemo(() => gapStats(list), [list])
  const n = list.length
  const cs = n > 24 ? 22 : 30

  const A = pair ? list[pair.r] : null
  const B = pair ? list[pair.c] : null
  const detail = A && B && A.id !== B.id
    ? (() => {
        const st = pairState(A.id, B.id)
        return { A, B, st, why: st === 'none' ? reasonFor(A, B) : null }
      })()
    : null

  return (
    <div className="pg">
      <PageHead
        eyebrow="Gaps"
        title="What is not connected, and why"
        blurb={'Every square is a pair of systems. The empty space is the finding. Colours show the main reason a pair is not connected: paper, the public–private wall, no shared patient ID, different standards, or no mandate.'}
      />

      <div className="stats">
        <div className="stat"><strong>{stats.total}</strong><span>possible pairs of systems</span></div>
        <div className="stat"><strong>{stats.live}</strong><span>live links</span></div>
        <div className="stat"><strong>{stats.other}</strong><span>regular or manual links</span></div>
        <div className="stat stat--hot"><strong>{stats.pct}%</strong><span>{stats.none} pairs not connected at all</span></div>
      </div>

      <div className="bar" style={{ marginTop: 20 }}>
        <div className="bar__group">
          <span className="bar__label">Reason</span>
          <div className="rchips">
            {REASONS.map((r) => (
              <button
                key={r.k} type="button" className="rchip" style={{ ['--rc' as string]: r.c }}
                aria-pressed={filter === r.k} onClick={() => setFilter(filter === r.k ? null : r.k)}
              >
                <i />{r.t} <b>{stats.byReason[r.k]}</b>
              </button>
            ))}
          </div>
        </div>
        <div className="bar__group bar__grow">
          <div className="seg" role="group" aria-label="Systems shown">
            <button type="button" aria-pressed={keyOnly} onClick={() => { setKeyOnly(true); setPair(null) }}>Key systems</button>
            <button type="button" aria-pressed={!keyOnly} onClick={() => { setKeyOnly(false); setPair(null) }}>All systems</button>
          </div>
          <div className="seg" role="group" aria-label="Group by">
            <button type="button" aria-pressed={group === 'layer'} onClick={() => setGroup('layer')}>What it does</button>
            <button type="button" aria-pressed={group === 'sector'} onClick={() => setGroup('sector')}>Who runs it</button>
          </div>
        </div>
      </div>

      <div className="callout gdetail" aria-live="polite">
        {detail ? (
          <>
            <strong>{detail.A.name} ↔ {detail.B.name}:</strong>{' '}
            {detail.st === 'none' ? <>not connected. Main reason: <b>{detail.why!.t}</b>.</> : <>{LINK_NAME[detail.st].toLowerCase()}.</>}{' '}
            <Link to={`/systems/${detail.A.id}`} className="inline">{detail.A.name}</Link>{' · '}
            <Link to={`/systems/${detail.B.id}`} className="inline">{detail.B.name}</Link>
          </>
        ) : 'Hover or select a square to read it.'}
      </div>

      <div className="mwrap">
        <div className="mgrid" style={{ ['--cs' as string]: cs + 'px', gridTemplateColumns: `210px repeat(${n}, ${cs}px)` }}>
          <div />
          {list.map((b, j) => (
            <div key={b.id} className={'mhead' + (pair?.c === j ? ' hl' : '')}>
              <span style={{ left: cs / 2 }}>{b.name}</span>
            </div>
          ))}
          {list.map((a, i) => (
            <Row key={a.id}>
              <div className={'mrow' + (pair?.r === i ? ' hl' : '') + (i > 0 && keyOf(a) !== keyOf(list[i - 1]) ? ' gsepT' : '')}>
                <SysIcon node={a} size="sm" />{a.name}
              </div>
              {list.map((b, j) => {
                const self = i === j
                const st = self ? 'self' : pairState(a.id, b.id)
                const why = st === 'none' ? reasonFor(a, b) : null
                const faded = filter && !self && (st !== 'none' || why!.k !== filter)
                const sepL = j > 0 && keyOf(b) !== keyOf(list[j - 1])
                const sepT = i > 0 && keyOf(a) !== keyOf(list[i - 1])
                return (
                  <button
                    key={b.id} type="button" disabled={self}
                    className={`mcell ${st}${faded ? ' faded' : ''}${sepL ? ' gsep' : ''}${sepT ? ' gsepT' : ''}`}
                    data-r={why?.k}
                    onMouseEnter={() => setPair({ r: i, c: j })} onFocus={() => setPair({ r: i, c: j })}
                    onClick={() => setPair({ r: i, c: j })}
                    aria-label={`${a.name} and ${b.name}: ${st === 'none' ? 'not connected' : st}`}
                  ><i /></button>
                )
              })}
            </Row>
          ))}
        </div>
        <div className="mkey">
          <span><i style={{ background: 'var(--live)' }} />Live link</span>
          <span><i style={{ background: 'var(--batch)' }} />Regular batch</span>
          <span><i style={{ background: 'repeating-linear-gradient(45deg,#e0b457 0 3px,#c08a1e 3px 6px)' }} />Retyped or carried by hand</span>
          <span><i style={{ background: 'var(--soft-2)', border: '1px solid var(--line)' }} />Not connected (colour shows why)</span>
        </div>
      </div>
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) { return <>{children}</> }
