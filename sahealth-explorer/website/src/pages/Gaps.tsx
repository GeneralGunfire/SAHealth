import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { NODES } from '../data/nodes'
import { LAYERS, SECTORS } from '../data/meta'
import { REASONS, gapStats, pairState, reasonFor, LINK_NAME } from '../lib/model'
import { CountUp } from '../components/Dynamic'
import { PageHead, SysIcon } from '../components/ui'
import type { SysNode } from '../types'

type Cell = { r: number; c: number }
type Item = { node: SysNode; group: string; groupStart: boolean }

export default function Gaps() {
  const [params] = useSearchParams()
  const asked = params.get('reason')
  const [keyOnly, setKeyOnly] = useState(true)
  const [group, setGroup] = useState<'layer' | 'sector'>('layer')
  const [filter, setFilter] = useState<string | null>(REASONS.some((r) => r.k === asked) ? asked : null)
  const [hover, setHover] = useState<Cell | null>(null)
  const [pin, setPin] = useState<Cell | null>(null)

  const groupName = (n: SysNode) => (group === 'layer' ? LAYERS.find((l) => l.id === n.layer)!.name : SECTORS.find((s) => s.id === n.sector)!.name)

  const items: Item[] = useMemo(() => {
    const order: string[] = group === 'layer' ? LAYERS.map((l) => l.id) : SECTORS.map((s) => s.id)
    const key = (n: SysNode) => (group === 'layer' ? n.layer : n.sector)
    const list = NODES.filter((n) => !keyOnly || n.core)
      .sort((a, b) => order.indexOf(key(a)) - order.indexOf(key(b)) || a.name.localeCompare(b.name))
    return list.map((node, i) => ({ node, group: groupName(node), groupStart: i === 0 || key(node) !== key(list[i - 1]) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyOnly, group])

  const list = items.map((x) => x.node)
  const stats = useMemo(() => gapStats(list), [list])
  const n = list.length
  const cs = n > 24 ? 22 : 30

  const focus = pin ?? hover
  const A = focus ? list[focus.r] : null
  const B = focus ? list[focus.c] : null
  const detail = A && B && A.id !== B.id ? { A, B, st: pairState(A.id, B.id), why: reasonFor(A, B) } : null

  // grid columns: a narrow gap before each new group
  const cols: (Item | 'gap')[] = []
  items.forEach((it, i) => { if (it.groupStart && i > 0) cols.push('gap'); cols.push(it) })
  const template = `190px ${cols.map((c) => (c === 'gap' ? '10px' : `${cs}px`)).join(' ')}`

  const total = stats.total || 1
  const seg = (v: number) => `${(v / total) * 100}%`

  return (
    <div className="pg">
      <PageHead
        eyebrow="Gaps"
        title="What is not connected, and why"
        blurb={'Every square is a pair of systems. The empty space is the finding. Colours show the main reason a pair is not connected: paper, the public–private wall, no shared patient ID, different standards, or no mandate.'}
      />

      <div className="stats">
        <div className="stat"><strong><CountUp to={stats.total} /></strong><span>possible pairs of systems</span></div>
        <div className="stat"><strong><CountUp to={stats.live} /></strong><span>live links</span></div>
        <div className="stat"><strong><CountUp to={stats.other} /></strong><span>regular or manual links</span></div>
        <div className="stat stat--hot"><strong><CountUp to={stats.pct} suffix="%" /></strong><span>{stats.none} pairs not connected at all</span></div>
      </div>

      <div className="split" aria-label="How the pairs divide" role="img" aria-description={`${stats.live} live, ${stats.other} other links, ${stats.none} not connected`}>
        <i style={{ width: seg(stats.live), background: 'var(--live)' }} title={`${stats.live} live links`} />
        <i style={{ width: seg(stats.other), background: 'var(--batch)' }} title={`${stats.other} regular or manual links`} />
        {REASONS.map((r) => (
          <i key={r.k} style={{ width: seg(stats.byReason[r.k]), background: r.c }} className={filter && filter !== r.k ? 'is-dim' : undefined} title={`${r.t}: ${stats.byReason[r.k]} pairs`} />
        ))}
      </div>

      <div className="bar" style={{ marginTop: 16 }}>
        <div className="bar__group">
          <div className="rchips" role="group" aria-label="Filter by reason">
            {REASONS.map((r) => (
              <button key={r.k} type="button" className="rchip" style={{ ['--rc' as string]: r.c }} aria-pressed={filter === r.k} onClick={() => setFilter(filter === r.k ? null : r.k)}>
                <i />{r.t} <b>{stats.byReason[r.k]}</b>
              </button>
            ))}
          </div>
        </div>
        <div className="bar__group bar__grow">
          <div className="seg" role="group" aria-label="Systems shown">
            <button type="button" aria-pressed={keyOnly} onClick={() => { setKeyOnly(true); setPin(null); setHover(null) }}>Key systems</button>
            <button type="button" aria-pressed={!keyOnly} onClick={() => { setKeyOnly(false); setPin(null); setHover(null) }}>All systems</button>
          </div>
          <div className="seg" role="group" aria-label="Group by">
            <button type="button" aria-pressed={group === 'layer'} onClick={() => setGroup('layer')}>What it does</button>
            <button type="button" aria-pressed={group === 'sector'} onClick={() => setGroup('sector')}>Who runs it</button>
          </div>
        </div>
      </div>

      <div className="mcard">
        <div className={`gdetail${detail ? ' is-on' : ''}`} aria-live="polite">
          {detail ? (
            <>
              <span className="gdetail__pair">
                <SysIcon node={detail.A} size="sm" /><b>{detail.A.name}</b><i aria-hidden="true">↔</i><SysIcon node={detail.B} size="sm" /><b>{detail.B.name}</b>
              </span>
              <span className="gdetail__verdict">
                {detail.st === 'none'
                  ? <><span className="gdetail__dot" style={{ background: detail.why.c }} />Not connected. Main reason: <b>{detail.why.t}</b></>
                  : <>{LINK_NAME[detail.st]}</>}
              </span>
              <span className="gdetail__links">
                <Link to={`/systems/${detail.A.id}`}>{detail.A.name}</Link>
                <Link to={`/systems/${detail.B.id}`}>{detail.B.name}</Link>
                {pin && <button type="button" className="btn btn--sm" onClick={() => setPin(null)}>Unpin</button>}
              </span>
            </>
          ) : (
            <span className="muted">Hover a square to read it. Click to pin it.</span>
          )}
        </div>

        <div className="mscroll">
          <div className="mgrid" style={{ ['--cs' as string]: cs + 'px', gridTemplateColumns: template }} onMouseLeave={() => setHover(null)}>
            {/* group labels */}
            <div />
            {cols.map((c, ci) => {
              if (c === 'gap') return <span key={`g${ci}`} />
              return c.groupStart ? <div key={c.node.id} className="mgl"><span>{c.group}</span></div> : <span key={c.node.id} />
            })}
            {/* column heads */}
            <div />
            {cols.map((c, ci) => {
              if (c === 'gap') return <span key={`gh${ci}`} />
              const j = list.indexOf(c.node)
              return <div key={c.node.id} className={'mhead' + (focus?.c === j ? ' hl' : '')}><span style={{ left: cs / 2 }}>{c.node.name}</span></div>
            })}

            {items.map((a, i) => (
              <Fragment2 key={a.node.id}>
                {a.groupStart && i > 0 && <div className="mrowgap" />}
                <div className={'mrow' + (focus?.r === i ? ' hl' : '')}>
                  <SysIcon node={a.node} size="sm" /><span>{a.node.name}</span>
                </div>
                {cols.map((c, ci) => {
                  if (c === 'gap') return <span key={`${a.node.id}g${ci}`} />
                  const j = list.indexOf(c.node)
                  const self = i === j
                  const st = self ? 'self' : pairState(a.node.id, c.node.id)
                  const why = st === 'none' ? reasonFor(a.node, c.node) : null
                  const faded = filter && !self && (st !== 'none' || why!.k !== filter)
                  const cross = focus && (focus.r === i || focus.c === j)
                  const pinned = pin && pin.r === i && pin.c === j
                  return (
                    <button
                      key={c.node.id} type="button" disabled={self}
                      className={`mcell ${st}${faded ? ' faded' : ''}${cross ? ' cross' : ''}${pinned ? ' pinned' : ''}`}
                      data-r={why?.k}
                      onMouseEnter={() => setHover({ r: i, c: j })} onFocus={() => setHover({ r: i, c: j })}
                      onClick={() => setPin(pin && pin.r === i && pin.c === j ? null : { r: i, c: j })}
                      aria-label={`${a.node.name} and ${c.node.name}: ${st === 'none' ? 'not connected' : st}`}
                    ><i /></button>
                  )
                })}
              </Fragment2>
            ))}
          </div>
        </div>

        <div className="mkey">
          <span><i className="live" />Live link</span>
          <span><i className="batch" />Regular batch</span>
          <span><i className="manual" />Retyped or carried by hand</span>
          <span><i className="none" />Not connected (colour shows why)</span>
        </div>
      </div>
    </div>
  )
}

function Fragment2({ children }: { children: React.ReactNode }) { return <>{children}</> }
