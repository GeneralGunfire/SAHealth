import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { SECTOR, SRC } from '../data/meta'
import { CONF, STATUS_LABEL, sectorColor } from '../lib/model'
import type { Confidence, SysNode } from '../types'

export function PageHead({ eyebrow, title, blurb, action }: { eyebrow?: string; title: string; blurb?: string; action?: ReactNode }) {
  return (
    <header className="pg__head">
      <div>
        {eyebrow && <p className="pg__eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {blurb && <p>{blurb}</p>}
      </div>
      {action && <div className="pg__action">{action}</div>}
    </header>
  )
}

export function SysIcon({ node, size }: { node: SysNode; size?: 'sm' | 'lg' }) {
  return (
    <span className={`sysico${size ? ` sysico--${size}` : ''}`} style={{ ['--c' as string]: sectorColor(node) }}>
      <Icon name={node.icon} size={size === 'lg' ? 26 : size === 'sm' ? 12 : 18} />
    </span>
  )
}

export function ConfBadge({ conf }: { conf: Confidence }) {
  return <span className={`badge badge--${conf}`} title={CONF[conf].text}>{CONF[conf].label}</span>
}

export function StatusBadge({ status }: { status: SysNode['status'] }) {
  return <span className={`badge${status === 'paper' ? ' badge--paper' : ''}`}>{STATUS_LABEL[status]}</span>
}

export function SectorChip({ node }: { node: SysNode }) {
  const s = SECTOR[node.sector]
  return <span className="chip" style={{ ['--c' as string]: s.color }}><i />{s.name}</span>
}

export function SourceList({ ids }: { ids: string[] }) {
  const list = ids.map((id) => SRC[id]).filter(Boolean)
  if (!list.length) return <p className="callout">No public source was found for this entry. It is included because the system is known to exist.</p>
  return (
    <ul className="srcs">
      {list.map((s) => (
        <li key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.title}</a></li>
      ))}
    </ul>
  )
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="empty">
      <p>{title}</p>
      {text && <small>{text}</small>}
      {action}
    </div>
  )
}

export function SysLink({ node }: { node: SysNode }) {
  return (
    <Link to={`/systems/${node.id}`} className="syslink">
      <SysIcon node={node} size="sm" />
      <span>{node.name}</span>
    </Link>
  )
}
