import { SRC } from '../data/meta'
import type { Confidence, Status } from '../types'

/** DEXA wordmark. The logo image files are not in the repository, so the mark is drawn here. */
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand">
      <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden><rect width="32" height="32" /><path d="M8 8h9a8 8 0 0 1 0 16H8z" /></svg>
      <span className="brand-word">DEXA</span>
      {!compact && <span className="brand-sub">SAHealth</span>}
    </span>
  )
}

export const CONF_TEXT: Record<Confidence, { label: string; def: string }> = {
  confirmed: { label: 'Confirmed', def: 'Primary source, or several consistent sources.' },
  likely: { label: 'Likely', def: 'One reputable source, or a strong inference.' },
  uncertain: { label: 'Uncertain', def: 'Vendor claim, secondary source, or not verified.' },
}

/** Confidence is shape-coded (solid, half, hollow) so it never competes with the connection colours. */
export function ConfGlyph({ conf, size = 12 }: { conf: Confidence; size?: number }) {
  return (
    <svg className={'cg cg-' + conf} width={size} height={size} viewBox="0 0 12 12" aria-hidden>
      <rect x="1" y="1" width="10" height="10" className="cg-box" />
      {conf === 'confirmed' && <rect x="1" y="1" width="10" height="10" className="cg-fill" />}
      {conf === 'likely' && <path d="M1 1h5v10H1z" className="cg-fill" />}
    </svg>
  )
}

export function Conf({ conf, long = false }: { conf: Confidence; long?: boolean }) {
  return (
    <span className={'conf conf-' + conf} title={CONF_TEXT[conf].label + ': ' + CONF_TEXT[conf].def}>
      <ConfGlyph conf={conf} />
      <b>{CONF_TEXT[conf].label}</b>
      {long && <em>{CONF_TEXT[conf].def}</em>}
    </span>
  )
}

export const STATUS_TEXT: Record<Status, string> = { live: 'Live', beta: 'Beta', legacy: 'Legacy', paper: 'Paper' }
export const STATUS_HELP: Record<Status, string> = { live: 'In use today.', beta: 'Being trialled or rolled out.', legacy: 'Old, but still running.', paper: 'A physical record.' }
export function StatusTag({ status }: { status: Status }) {
  return <span className={'stag stag-' + status}>{STATUS_TEXT[status]}</span>
}

/** Source list. Each source keeps its id visible so a claim can be traced. */
export function Sources({ ids, empty, onOpen }: { ids: string[]; empty?: string; onOpen?: (id: string) => void }) {
  const rows = ids.filter((s) => SRC[s])
  if (!rows.length) return <p className="none-note">{empty ?? 'No source recorded yet. This description is awaiting verification.'}</p>
  return (
    <ul className="srcs">
      {rows.map((s) => (
        <li key={s}>
          <code>{s}</code>
          <span>
            <a href={SRC[s].url} target="_blank" rel="noreferrer">{SRC[s].title}<span aria-hidden> ↗</span></a>
            {onOpen && <button className="src-use" onClick={() => onOpen(s)}>Where it is used</button>}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** The three explicit labels the project needs kept apart. */
export function Soon({ children = 'Coming soon' }: { children?: string }) {
  return <span className="soon-tag">{children}</span>
}
