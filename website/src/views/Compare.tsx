import { useMemo, useState } from 'react'
import { BY_ID, NODES } from '../data/nodes'
import { LAYER_NAME, LINK_LABEL, SECTOR } from '../data/meta'
import { edgeBetween, edgesOf, journeysOf } from '../data/derived'
import { Icon } from '../components/Icon'
import { Conf, STATUS_HELP, StatusTag } from '../components/ui'
import { Gloss } from '../components/Gloss'
import { useNav } from '../nav'
import type { SysNode } from '../types'

const MISSING = 'Not recorded in the research'
type Row = { label: string; hint?: string; get: (n: SysNode) => string; render?: (n: SysNode) => React.ReactNode }

const ROWS: Row[] = [
  { label: 'Layer', hint: 'What it does', get: (n) => LAYER_NAME[n.layer] },
  { label: 'Sector', hint: 'Who runs it, broadly', get: (n) => SECTOR[n.sector].name },
  { label: 'Status', get: (n) => n.status, render: (n) => <><StatusTag status={n.status} /> <small className="muted">{STATUS_HELP[n.status]}</small></> },
  { label: 'Operator', get: (n) => n.who ?? MISSING },
  { label: 'Information it holds', get: (n) => n.holds ?? MISSING },
  { label: 'Information it does not hold', get: (n) => n.notHolds ?? MISSING },
  { label: 'Standards and formats', get: (n) => n.standards ?? MISSING },
  { label: 'Scale', get: (n) => n.scale ?? MISSING },
  { label: 'Documented connections', get: (n) => { const e = edgesOf(n.id); return e.length ? e.map((x) => `${BY_ID[x.a === n.id ? x.b : x.a].name} (${LINK_LABEL[x.type]})`).join('; ') : 'None documented' },
    render: (n) => { const e = edgesOf(n.id); return e.length ? <ul className="cmp-ul">{e.map((x) => { const o = BY_ID[x.a === n.id ? x.b : x.a]; return <li key={x.a + x.b}><i className={'lk lk-' + x.type} />{o.name}</li> })}</ul> : <span className="muted">None documented. That is not proof there is none.</span> } },
  { label: 'Journeys it appears in', get: (n) => String(journeysOf(n.id).length) },
  { label: 'Confidence', get: (n) => n.conf, render: (n) => <Conf conf={n.conf} /> },
  { label: 'Sources', get: (n) => n.src.join(', ') || 'None recorded yet' },
]

export function Compare() {
  const nav = useNav()
  const ids = nav.compare
  const items = ids.map((i) => BY_ID[i]).filter(Boolean)
  const [onlyDiff, setOnlyDiff] = useState(false)
  const sorted = useMemo(() => [...NODES].sort((a, b) => a.name.localeCompare(b.name)), [])
  const core = NODES.filter((n) => n.core)

  const pairs = useMemo(() => {
    const p: [SysNode, SysNode][] = []
    items.forEach((a, i) => items.slice(i + 1).forEach((b) => p.push([a, b])))
    return p
  }, [items])

  return (
    <div className="cmp">
      <div className="cmp-pick">
        <label htmlFor="cmp-add">Add a system</label>
        <select id="cmp-add" className="sel" value="" disabled={ids.length >= 4} onChange={(e) => { if (e.target.value) nav.setCompare([...ids, e.target.value]) }}>
          <option value="">{ids.length >= 4 ? 'Four systems is the most that fit' : 'Choose a system…'}</option>
          {sorted.filter((n) => !ids.includes(n.id)).map((n) => <option key={n.id} value={n.id}>{n.name}{n.alias ? ` (${n.alias})` : ''}</option>)}
        </select>
        <div className="chips">
          {items.map((n) => <button key={n.id} className="fchip on" onClick={() => nav.toggleCompare(n.id)} aria-label={`Remove ${n.name}`}>{n.name}<span aria-hidden> ×</span></button>)}
        </div>
        {items.length > 0 && <button className="link" onClick={() => nav.setCompare([])}>Clear all</button>}
        {items.length >= 2 && (
          <label className="chk"><input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} /> Show only what differs</label>
        )}
      </div>

      {items.length < 2 && (
        <div className="empty">
          <b>{items.length === 0 ? 'No systems chosen yet.' : 'Choose one more system to compare.'}</b>
          <p>Add two to four systems. You can also add them from any system’s details with “Add to comparison”. Rows that differ are highlighted.</p>
          <div className="empty-sub">Start with a key system</div>
          <div className="chips">{core.filter((n) => !ids.includes(n.id)).slice(0, 10).map((n) => <button key={n.id} className="chip" onClick={() => nav.setCompare([...ids, n.id].slice(0, 4))}><Icon name={n.icon} size={13} />{n.name}</button>)}</div>
        </div>
      )}

      {items.length >= 2 && (
        <>
          <div className="cmp-table" style={{ ['--n' as string]: items.length }} role="table" aria-label="System comparison">
            <div className="cmp-row cmp-head" role="row">
              <div className="cmp-l" role="columnheader" />
              {items.map((n) => (
                <div key={n.id} className="cmp-c" role="columnheader" style={{ ['--c' as string]: SECTOR[n.sector].color }}>
                  <span className="cmp-ico"><Icon name={n.icon} size={20} /></span>
                  <button className="cmp-name" onClick={() => nav.openNode(n.id)}>{n.name}</button>
                  {n.alias && <code>{n.alias}</code>}
                </div>
              ))}
            </div>
            {ROWS.map((r) => {
              const vals = items.map((n) => r.get(n))
              const diff = new Set(vals).size > 1
              if (onlyDiff && !diff) return null
              return (
                <div key={r.label} role="row" className={'cmp-row' + (diff ? ' diff' : ' same')}>
                  <div className="cmp-l" role="rowheader"><b>{r.label}</b>{r.hint && <small>{r.hint}</small>}<span className="cmp-flag">{diff ? 'Differs' : 'Same'}</span></div>
                  {items.map((n, i) => (
                    <div key={n.id} role="cell" className={'cmp-c' + (vals[i] === MISSING || vals[i] === 'None documented' || vals[i] === 'None recorded yet' ? ' none' : '')} data-sys={n.name}>
                      {r.render ? r.render(n) : <Gloss text={vals[i]} />}
                    </div>
                  ))}
                </div>
              )
            })}
            {onlyDiff && ROWS.every((r) => new Set(items.map((n) => r.get(n))).size === 1) && <div className="empty">These systems match on every row.</div>}
          </div>

          <h3 className="cmp-h">Do these systems connect to each other?</h3>
          <ul className="cmp-pairs">
            {pairs.map(([a, b]) => { const e = edgeBetween(a.id, b.id); return (
              <li key={a.id + b.id}>
                <button onClick={() => nav.openPair(a.id, b.id)}>
                  <b>{a.name} ↔ {b.name}</b>
                  {e ? <span className={'pstate ' + e.type}><i className={'lk lk-' + e.type} />{LINK_LABEL[e.type]}: {e.what}</span> : <span className="pstate none">No connection found. That does not prove none exists.</span>}
                </button>
              </li>) })}
          </ul>
        </>
      )}
    </div>
  )
}
