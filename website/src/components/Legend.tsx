import { NODES } from '../data/nodes'
import { ICON_LABEL, SECTORS } from '../data/meta'
import { Icon } from './Icon'
import type { IconName } from '../types'

export function Legend() {
  const icons = [...new Set(NODES.map((n) => n.icon))] as IconName[]
  return (
    <div className="legendpanel">
      <h4>Icons</h4>
      <div className="lrow">{icons.map((k) => <span key={k} className="it"><i className="mi"><Icon name={k} size={13} /></i>{ICON_LABEL[k]}</span>)}</div>
      <h4>Lines</h4>
      <div className="lrow"><span className="it"><i className="ln" />Live link</span><span className="it"><i className="ln b" />Regular batch</span><span className="it"><i className="ln m" />Retyped or carried by hand</span></div>
      <h4>Who runs it</h4>
      <div className="lrow">{SECTORS.map((s) => <span key={s.id} className="it"><i className="dot" style={{ background: s.color }} />{s.name}</span>)}</div>
    </div>
  )
}
