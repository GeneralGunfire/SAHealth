import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NODES } from '../data/nodes'
import { LAYERS, SECTORS } from '../data/meta'
import { layerName } from '../lib/model'
import { ConfBadge, Empty, PageHead, SectorChip, StatusBadge, SysIcon } from '../components/ui'
import type { Confidence, SectorId } from '../types'

export default function Systems() {
  const [q, setQ] = useState('')
  const [sector, setSector] = useState<SectorId | 'all'>('all')
  const [layer, setLayer] = useState('all')
  const [conf, setConf] = useState<Confidence | 'all'>('all')

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return NODES
      .filter((n) =>
        (sector === 'all' || n.sector === sector) &&
        (layer === 'all' || n.layer === layer) &&
        (conf === 'all' || n.conf === conf) &&
        (!t || [n.name, n.alias, n.summary, n.who].some((s) => s?.toLowerCase().includes(t))))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [q, sector, layer, conf])

  const filtered = q || sector !== 'all' || layer !== 'all' || conf !== 'all'
  const reset = () => { setQ(''); setSector('all'); setLayer('all'); setConf('all') }

  return (
    <div className="pg">
      <PageHead
        eyebrow="Systems"
        title="All systems"
        blurb={`${NODES.length} systems that hold or move health information in South Africa. Open any one for what it holds, who runs it, how it connects and where the evidence comes from.`}
      />

      <div className="bar">
        <input
          className="input input--search" type="search" placeholder="Search systems" aria-label="Search systems"
          value={q} onChange={(e) => setQ(e.target.value)}
        />
        <div className="bar__group">
          <span className="bar__label">Run by</span>
          <select className="select" value={sector} onChange={(e) => setSector(e.target.value as SectorId | 'all')} aria-label="Who runs it">
            <option value="all">Anyone</option>
            {SECTORS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="bar__group">
          <span className="bar__label">Does</span>
          <select className="select" value={layer} onChange={(e) => setLayer(e.target.value)} aria-label="What it does">
            <option value="all">Anything</option>
            {LAYERS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </div>
        <div className="bar__group">
          <span className="bar__label">Evidence</span>
          <div className="seg" role="group" aria-label="Confidence">
            {(['all', 'confirmed', 'likely', 'uncertain'] as const).map((c) => (
              <button key={c} type="button" aria-pressed={conf === c} onClick={() => setConf(c)}>{c === 'all' ? 'All' : c[0].toUpperCase() + c.slice(1)}</button>
            ))}
          </div>
        </div>
        {filtered && <button type="button" className="btn btn--sm bar__grow" onClick={reset}>Clear filters</button>}
      </div>

      <p className="count" aria-live="polite">{list.length} of {NODES.length} systems</p>

      {list.length === 0 ? (
        <Empty title="No systems match." text="Try a different search or clear the filters." action={<button type="button" className="btn" onClick={reset}>Clear filters</button>} />
      ) : (
        <div className="cards">
          {list.map((n) => (
            <Link key={n.id} to={`/systems/${n.id}`} className="card">
              <div className="card__row">
                <SysIcon node={n} />
                <div className="card__titles">
                  <h3>{n.name}</h3>
                  {n.alias && <small>{n.alias}</small>}
                </div>
              </div>
              <p className="clamp3">{n.summary}</p>
              <div className="card__tags">
                <SectorChip node={n} />
                <span className="chip">{layerName(n)}</span>
                <StatusBadge status={n.status} />
                <ConfBadge conf={n.conf} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
