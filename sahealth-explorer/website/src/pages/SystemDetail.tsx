import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { NODE, LINK_COLOR, LINK_NAME, journeysFor, layerName, neighbours } from '../lib/model'
import { LAYER_DESC, detailDepth, detailFields, factSheet, related } from '../lib/facts'
import { ConfBadge, SectorChip, SourceList, StatusBadge, SysIcon, SysLink } from '../components/ui'

function Block({ title, children, missing }: { title: string; children?: ReactNode; missing?: boolean }) {
  return (
    <section className={`dblock${missing ? ' dblock--missing' : ''}`}>
      <h3>{title}</h3>
      {missing ? <p>Not documented in public sources.</p> : children}
    </section>
  )
}

export default function SystemDetail() {
  const { id = '' } = useParams()
  const n = NODE[id]
  if (!n) return <Navigate to="/systems" replace />

  const conns = neighbours(n.id)
  const journeys = journeysFor(n.id)
  const facts = factSheet(n)
  const depth = detailDepth(n)
  const missing = detailFields(n).filter((f) => !f.has).map((f) => f.k)
  const more = related(n)

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

      <p className="dlead">{n.summary}</p>

      <section className="fsheet" aria-label="Fact sheet">
        {facts.map((f) => (
          <div key={f.label} title={f.hint}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </section>

      <div className="dgrid">
        <div className="dmain">
          <Block title="What this kind of system does">
            <p>{LAYER_DESC[n.layer]}</p>
          </Block>

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

          {missing.length > 0 && (
            <section className="dblock dblock--gaps">
              <h3>Not yet documented</h3>
              <p>
                No public source was found for: {detailFields(n).filter((f) => !f.has).map((f) => f.label.toLowerCase()).join(', ')}.
                We list what is missing rather than guess.
              </p>
            </section>
          )}

          <Block title="Evidence">
            <div className="evid">
              <ConfBadge conf={n.conf} />
              <span>{factSheet(n).find((f) => f.label === 'Evidence')?.hint}</span>
            </div>
            <div className="meter" role="img" aria-label={`${depth.have} of ${depth.total} detail fields documented`}>
              <div className="meter__bar"><i style={{ width: `${(depth.have / depth.total) * 100}%` }} /></div>
              <small>{depth.have} of {depth.total} detail fields documented</small>
            </div>
          </Block>
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

      {more.length > 0 && (
        <section className="sec" aria-labelledby="rel-t">
          <div className="sec__head"><div><h2 id="rel-t">Related systems</h2><p>Same layer or run by the same kind of organisation.</p></div></div>
          <div className="relgrid">
            {more.map((m) => (
              <Link key={m.id} to={`/systems/${m.id}`} className="rel">
                <SysIcon node={m} />
                <span><b>{m.name}</b><small>{layerName(m)}</small></span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
