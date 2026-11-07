import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { NODES } from '../data/nodes'
import { ICON_LABEL, LAYERS, SECTOR, SECTORS, SRC } from '../data/meta'
import { layerName, neighbours } from '../lib/model'
import { ConfBadge, Empty, PageHead, SectorChip, StatusBadge, SysIcon } from '../components/ui'
import type { Confidence, SectorId } from '../types'

type Sort = 'name' | 'links' | 'evidence'
const EVIDENCE = { confirmed: 0, likely: 1, uncertain: 2 } as const

export default function Systems() {
  const [q, setQ] = useState('')
  const [sector, setSector] = useState<SectorId | 'all'>('all')
  const [layer, setLayer] = useState('all')
  const [conf, setConf] = useState<Confidence | 'all'>('all')
  const [sort, setSort] = useState<Sort>('name')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const linkCount = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, neighbours(n.id).length])), [])

  // counts per sector for the chips, given the other filters (so they stay honest as you filter)
  const base = (n: (typeof NODES)[number]) =>
    (layer === 'all' || n.layer === layer) && (conf === 'all' || n.conf === conf) &&
    (!q.trim() || [n.name, n.alias, n.summary, n.who].some((s) => s?.toLowerCase().includes(q.trim().toLowerCase())))
  const sectorCount = (s: SectorId | 'all') => NODES.filter((n) => base(n) && (s === 'all' || n.sector === s)).length

  const list_ = useMemo(() => {
    return NODES
      .filter((n) => base(n) && (sector === 'all' || n.sector === sector))
      .sort((a, b) =>
        sort === 'links' ? linkCount[b.id] - linkCount[a.id] || a.name.localeCompare(b.name)
        : sort === 'evidence' ? EVIDENCE[a.conf] - EVIDENCE[b.conf] || a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sector, layer, conf, sort])

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
        <div className="bar__group bar__grow">
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort by">
            <option value="name">Sort: A to Z</option>
            <option value="links">Sort: most connected</option>
            <option value="evidence">Sort: strongest evidence</option>
          </select>
          <div className="seg" role="group" aria-label="Layout">
            <button type="button" aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Cards</button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button>
          </div>
        </div>
      </div>

      <div className="schips" role="group" aria-label="Who runs it">
        {([{ id: 'all', name: 'Everyone', color: '' }, ...SECTORS] as { id: SectorId | 'all'; name: string; color: string }[]).map((s) => (
          <button key={s.id} type="button" className="schip" aria-pressed={sector === s.id} style={{ ['--c' as string]: s.color || '#0b1733' }} onClick={() => setSector(s.id)}>
            {s.color && <i />}{s.name}<b>{sectorCount(s.id)}</b>
          </button>
        ))}
        {filtered && <button type="button" className="btn btn--sm schips__clear" onClick={reset}>Clear filters</button>}
      </div>

      <p className="count" aria-live="polite">{list_.length} of {NODES.length} systems</p>

      {list_.length === 0 ? (
        <Empty title="No systems match." text="Try a different search or clear the filters." action={<button type="button" className="btn" onClick={reset}>Clear filters</button>} />
      ) : view === 'grid' ? (
        <div className="cards">
          {list_.map((n, i) => (
            <Link key={n.id} to={`/systems/${n.id}`} className="card card--in" style={{ animationDelay: `${Math.min(i, 14) * 25}ms` }}>
              <div className="card__row">
                <SysIcon node={n} />
                <div className="card__titles">
                  <h3>{n.name}</h3>
                  {n.alias && <small>{n.alias}</small>}
                </div>
              </div>
              <p className="clamp3">{n.summary}</p>
              <dl className="cmeta">
                <div><dt>Run by</dt><dd>{n.who ?? SECTOR[n.sector].name}</dd></div>
                <div><dt>Type</dt><dd>{ICON_LABEL[n.icon]}</dd></div>
                <div><dt>Used in</dt><dd>{n.provs?.length ? n.provs.join(', ') : 'Nationally, or varies'}</dd></div>
              </dl>
              <div className="card__tags">
                <SectorChip node={n} />
                <span className="chip">{layerName(n)}</span>
                <StatusBadge status={n.status} />
                <ConfBadge conf={n.conf} />
              </div>
              <span className="card__foot">
                {linkCount[n.id]} {linkCount[n.id] === 1 ? 'connection' : 'connections'} · {n.src.filter((s) => SRC[s]).length} {n.src.filter((s) => SRC[s]).length === 1 ? 'source' : 'sources'}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rowlist">
          {list_.map((n, i) => (
            <Link key={n.id} to={`/systems/${n.id}`} className="rowitem card--in" style={{ animationDelay: `${Math.min(i, 14) * 20}ms` }}>
              <SysIcon node={n} />
              <span className="rowitem__main"><b>{n.name}</b><small>{n.alias ?? layerName(n)}</small></span>
              <SectorChip node={n} />
              <span className="chip rowitem__layer">{layerName(n)}</span>
              <ConfBadge conf={n.conf} />
              <span className="rowitem__n">{linkCount[n.id]}<small>links</small></span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
