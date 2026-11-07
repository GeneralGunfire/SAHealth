import { Link, Navigate, useParams } from 'react-router-dom'
import { NODE, LINK_COLOR, LINK_NAME, journeysFor, layerName, neighbours } from '../lib/model'
import { ConfBadge, SectorChip, SourceList, StatusBadge, SysIcon, SysLink } from '../components/ui'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="dblock">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

export default function SystemDetail() {
  const { id = '' } = useParams()
  const n = NODE[id]
  if (!n) return <Navigate to="/systems" replace />

  const conns = neighbours(n.id)
  const journeys = journeysFor(n.id)

  return (
    <div className="pg">
      <Link to="/systems" className="back">← All systems</Link>

      <header className="dhead">
        <SysIcon node={n} size="lg" />
        <div>
          <h1>{n.name}</h1>
          {n.alias && <p className="dhead__alias">{n.alias}</p>}
          <div className="dhead__tags">
            <SectorChip node={n} />
            <span className="chip">{layerName(n)}</span>
            <StatusBadge status={n.status} />
            <ConfBadge conf={n.conf} />
          </div>
        </div>
      </header>

      <div className="dgrid">
        <div className="dmain">
          <p className="dlead">{n.summary}</p>

          {(n.holds || n.notHolds) && (
            <div className="dpair">
              {n.holds && <div className="dpair__box"><h3>What it holds</h3><p>{n.holds}</p></div>}
              {n.notHolds && <div className="dpair__box dpair__box--no"><h3>What it does not hold</h3><p>{n.notHolds}</p></div>}
            </div>
          )}

          {n.who && <Block title="Who runs it"><p>{n.who}</p></Block>}
          {n.scale && <Block title="Scale and use"><p>{n.scale}</p></Block>}
          {n.tech && <Block title="How it works"><p>{n.tech}</p></Block>}
          {n.standards && <Block title="Standards"><p>{n.standards}</p></Block>}
          {n.why && (
            <Block title="Why it stays disconnected">
              <p className="callout callout--warn">{n.why}</p>
            </Block>
          )}
        </div>

        <aside className="dside">
          <section className="dside__box">
            <h3>Connections ({conns.length})</h3>
            {conns.length === 0 ? (
              <p className="muted">No connection to another system is documented.</p>
            ) : (
              <ul className="conns conns--plain">
                {conns.map(({ other, edge }) => (
                  <li key={other.id + edge.what}>
                    <SysLink node={other} />
                    <small>{edge.what}</small>
                    <span className="conn__type" style={{ ['--lc' as string]: LINK_COLOR[edge.type] }}><i />{LINK_NAME[edge.type]}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/map" className="more">See it on the map →</Link>
          </section>

          {journeys.length > 0 && (
            <section className="dside__box">
              <h3>Appears in {journeys.length} {journeys.length === 1 ? 'journey' : 'journeys'}</h3>
              <ul className="plainlist">
                {journeys.map((j) => <li key={j.id}><Link to={`/journeys/${j.id}`}>{j.title}</Link></li>)}
              </ul>
            </section>
          )}

          <section className="dside__box">
            <h3>Sources</h3>
            <SourceList ids={n.src} />
          </section>
        </aside>
      </div>
    </div>
  )
}
