import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SOURCES } from '../data/meta'
import { CONF, NODE, confCounts, sourceUsage } from '../lib/model'
import { PageHead } from '../components/ui'

const RULES = [
  'Describe how things exist now. Nothing here says how they should be fixed. Anything DEXA will build is labelled as such.',
  'Every claim carries a source and a confidence level. If nothing public was found, the page says so. We never guess.',
  'Where sources disagree, both figures are shown with their dates, not averaged.',
  'Figures are dated. Systems and roll-outs change, so check the date beside each number.',
]

export default function Sources() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const counts = confCounts()
  const usage = useMemo(sourceUsage, [])
  const list = SOURCES.filter((s) => s.title.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="pg">
      <PageHead
        eyebrow="Sources and method"
        title="How we know what we know"
        blurb="Everything on this site comes from published sources: parliamentary replies, government reports, regulators, peer-reviewed studies, company reports and the press."
      />

      <section className="sec sec--tight" aria-labelledby="rules-t">
        <div className="sec__head"><div><h2 id="rules-t">Ground rules</h2></div></div>
        <ul className="rules">
          {RULES.map((r) => <li key={r}>{r}</li>)}
        </ul>
      </section>

      <section className="sec" aria-labelledby="conf-t">
        <div className="sec__head">
          <div>
            <h2 id="conf-t">How sure we are</h2>
            <p>Each system is rated on how well its description is supported.</p>
          </div>
        </div>
        <div className="cards cards--3">
          {(['confirmed', 'likely', 'uncertain'] as const).map((k) => (
            <div className="card card--soft" key={k}>
              <span className={`badge badge--${k}`} style={{ alignSelf: 'flex-start' }}>{CONF[k].label}</span>
              <strong className="bignum">{counts[k]}</strong>
              <p>{CONF[k].text}</p>
              <Link to="/systems" className="more">Browse systems →</Link>
            </div>
          ))}
        </div>
      </section>

      <section className="sec" aria-labelledby="all-t">
        <div className="sec__head">
          <div>
            <h2 id="all-t">All {SOURCES.length} sources</h2>
            <p>Each link opens the original document or page.</p>
          </div>
          <input className="input input--search" type="search" placeholder="Search sources" aria-label="Search sources" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {list.length === 0 ? (
          <p className="callout">No source matches that search.</p>
        ) : (
          <ul className="srclist">
            {list.map((s) => {
              const u = usage[s.id]
              return (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="srclist__title">{s.title}</a>
                  <small className="srclist__used">
                    {u.systems.length + u.provinces.length === 0 ? 'Background reading' : 'Used for: '}
                    {u.systems.map((id, i) => (
                      <span key={id}>{i > 0 && ', '}<Link to={`/systems/${id}`}>{NODE[id].name}</Link></span>
                    ))}
                    {u.systems.length > 0 && u.provinces.length > 0 && '; '}
                    {u.provinces.length > 0 && <>provinces: <Link to="/provinces">{u.provinces.join(', ')}</Link></>}
                  </small>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
