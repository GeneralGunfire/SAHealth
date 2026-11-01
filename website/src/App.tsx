import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Canvas } from './components/Canvas'
import { Drawer, type DrawerTarget } from './components/Drawer'
import { Intro } from './components/Intro'
import { Tour } from './components/Tour'
import { Brand, Soon } from './components/ui'
import { Legend } from './components/Legend'
import { Matrix } from './views/Matrix'
import { JourneyPlayer } from './views/JourneyPlayer'
import { Provinces } from './views/Provinces'
import { LayerList } from './views/LayerList'
import { NODES } from './data/nodes'
import { PROVINCES, PROV_DATA } from './data/meta'
import { CHAPTERS, type ChapterId } from './layout'
import { ss, useIsMobile } from './hooks'
import type { Lens } from './types'

type View = 'landscape' | 'journey' | 'provinces' | 'matrix' | 'sim'
const VIEWS: { id: View; n: string; label: string; title: string; desc: string }[] = [
  { id: 'landscape', n: '01', label: 'Landscape', title: 'Every system, in one picture', desc: 'Each mark is a system that holds health data in South Africa. Rows show what a system does and columns show who runs it. Lines show the few places where data actually moves between them. Zoom in to read, or pick a province to see its own version.' },
  { id: 'journey', n: '02', label: 'Journeys', title: 'Follow the data', desc: 'A patient’s information is created at every visit, but it rarely travels with them. Pick a journey and step through it to see where the data goes, who retypes it, and where it stops.' },
  { id: 'provinces', n: '03', label: 'Provinces', title: 'Nine provinces, nine answers', desc: 'National registries, labs and reporting work the same way everywhere. The hospital and clinic systems underneath are different in each province, and four provinces report no hospital record system at all.' },
  { id: 'matrix', n: '04', label: 'Gaps', title: 'What is not connected, and why', desc: 'Every square is a pair of systems. The empty space is the finding. Letters show the main reason a pair is not connected: paper, the public–private wall, no shared patient ID, different standards, or no mandate.' },
  { id: 'sim', n: '05', label: 'Simulation', title: 'What DEXA models', desc: 'DEXA stands up stand-in databases for real systems, so the gateway can be built and tested without touching real patient data. Marked systems have a stand-in today. Outlined systems have none yet. Nothing here is a real connection.' },
]
const LENSES: [Lens, string][] = [['all', 'All'], ['identity', 'Identity'], ['clinical', 'Clinical'], ['aggregate', 'Aggregate'], ['lab', 'Lab'], ['claims', 'Claims']]
const readView = (): View => { const h = location.hash.slice(1) as View; return VIEWS.some((v) => v.id === h) ? h : 'landscape' }

export function App() {
  const mobile = useIsMobile()
  const [intro, setIntro] = useState(() => !ss.get('introSeen') && !location.search.includes('skipintro'))
  const [view, setViewS] = useState<View>(readView)
  const skipView = location.search.includes('skipview')
  const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({})
  const [simple, setSimple] = useState(true)
  const [conn, setConn] = useState<0 | 1>(1)
  const [lens, setLens] = useState<Lens>('all')
  const [prov, setProv] = useState('all')
  const [machine, setMachine] = useState(false)
  const [chapter, setChapter] = useState<ChapterId>('care')
  const [group, setGroup] = useState<'layer' | 'sector'>('layer')
  const [showWhy, setShowWhy] = useState(true)
  const [target, setTarget] = useState<DrawerTarget | null>(null)
  const [jid, setJid] = useState('lab')
  const [tour, setTour] = useState(false)
  const [key, setKey] = useState(false)

  const isOpen = (v: View) => noteOpen[v] ?? (!skipView && !ss.get('note:' + v))
  const setOpen = (v: View, o: boolean) => { setNoteOpen((m) => ({ ...m, [v]: o })); if (!o) ss.set('note:' + v, '1') }

  const setView = (v: View) => {
    setViewS(v); setTarget(null)
    try { history.replaceState(null, '', location.pathname + location.search + '#' + v) } catch { /* ignore */ }
    window.scrollTo({ top: 0 })
  }
  const endIntro = () => { setIntro(false); ss.set('introSeen', '1') }
  const meta = VIEWS.find((v) => v.id === view)!
  const sel = target?.kind === 'node' ? target.id : null

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape' && !tour) setTarget(null) }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [tour])
  useEffect(() => {
    const h = () => setViewS(readView())
    addEventListener('hashchange', h); return () => removeEventListener('hashchange', h)
  }, [])

  const pd = prov !== 'all' ? PROV_DATA[prov] : null
  const mapView = view === 'landscape' || view === 'sim'
  const fixed = !mobile && mapView
  const open = isOpen(view)

  return (
    <MotionConfig reducedMotion="user">
      <div className={'app' + (fixed ? ' app-fixed' : '')}>
        <AnimatePresence>{intro && <Intro onDone={(wantTour) => { endIntro(); setView('landscape'); if (wantTour) setTour(true) }} />}</AnimatePresence>

        <header className="mast">
          <div className="mast-in">
            <Brand compact={mobile} />
            <nav className="tabs" aria-label="Views" data-tour="nav">
              {VIEWS.map((v) => (
                <button key={v.id} aria-current={view === v.id ? 'page' : undefined} onClick={() => setView(v.id)}>
                  <code>{v.n}</code>{v.label}
                  {view === v.id && <motion.span layoutId="tabbar" className="bar" />}
                </button>
              ))}
            </nav>
            <div className="mast-act">
              <button className="link" onClick={() => setTour(true)}>Tour</button>
              <button className="link" onClick={() => setIntro(true)}>Intro</button>
            </div>
          </div>
        </header>

        <section className={'note' + (open ? ' open' : '')} aria-label="About this view">
          <div className="note-in">
            <div className="note-t"><code>{meta.n}</code><h1>{meta.title}</h1>
              <button className="note-b" aria-expanded={open} onClick={() => setOpen(view, !open)}>{open ? 'Hide note' : 'About this view'}</button></div>
            {open && <p>{meta.desc}</p>}
          </div>
        </section>

        <main key={view} className={'view view-' + view}>
          {(mapView || view === 'matrix') && (
            <div className="toolbar" role="toolbar" aria-label="Filters">
              {mapView && (
                <div className="tgroup"><label>Lens</label><div className="chips">{LENSES.map(([id, l]) => <button key={id} className="chip" aria-pressed={lens === id} onClick={() => setLens(id)}>{l}</button>)}</div></div>
              )}
              {view === 'landscape' && (
                <div className="tgroup"><label htmlFor="provsel">Province</label>
                  <select id="provsel" className="sel" value={prov} onChange={(e) => setProv(e.target.value)}>
                    <option value="all">All of South Africa</option>{PROVINCES.map((p) => <option key={p}>{p}</option>)}
                  </select></div>
              )}
              {mapView && !mobile && (
                <div className="tgroup" data-tour="zoomto"><label>Zoom to</label><div className="seg" role="group">
                  {CHAPTERS.map((c) => <button key={c.id} aria-pressed={chapter === c.id} onClick={() => setChapter(c.id)}>{c.name}</button>)}</div></div>
              )}
              {(mapView || view === 'matrix') && (
                <div className="tgroup"><label>Detail</label><div className="seg" role="group">
                  <button aria-pressed={simple} onClick={() => setSimple(true)}>Key systems</button><button aria-pressed={!simple} onClick={() => setSimple(false)}>All systems</button></div></div>
              )}
              {view === 'landscape' && !mobile && (
                <div className="tgroup"><label>Connections</label><div className="seg" role="group">
                  <button aria-pressed={conn === 0} onClick={() => setConn(0)}>Islands</button><button aria-pressed={conn === 1} onClick={() => setConn(1)}>What exists</button>
                  <button disabled title="Coming soon">Needed <Soon>Soon</Soon></button></div></div>
              )}
              {view === 'matrix' && (
                <>
                  <div className="tgroup"><label>Group by</label><div className="seg" role="group"><button aria-pressed={group === 'layer'} onClick={() => setGroup('layer')}>What it does</button><button aria-pressed={group === 'sector'} onClick={() => setGroup('sector')}>Who runs it</button></div></div>
                  <div className="tgroup"><label>Gaps</label><div className="seg" role="group"><button aria-pressed={!showWhy} onClick={() => setShowWhy(false)}>Plain</button><button aria-pressed={showWhy} onClick={() => setShowWhy(true)}>Show why</button></div></div>
                </>
              )}
              {view === 'sim' && !mobile && (
                <div className="tgroup"><label>Machine tags</label><div className="seg" role="group"><button aria-pressed={!machine} onClick={() => setMachine(false)}>Hide</button><button aria-pressed={machine} onClick={() => setMachine(true)}>Show</button></div></div>
              )}
              {mobile && mapView && <div className="tgroup"><button className="chip" aria-pressed={key} onClick={() => setKey((k) => !k)}>Key</button></div>}
            </div>
          )}

          {view === 'landscape' && pd && (
            <div className={'strip' + (pd.none ? ' warn' : '')}>
              <b>{prov}</b><span>Hospitals: <em>{pd.hosp ?? 'no hospital record system reported'}</em></span><span>Clinics: <em>{pd.phc}</em></span><span>Data centre: <em>{pd.dc ?? 'none found yet'}</em></span>
            </div>
          )}
          {view === 'sim' && (() => { const m = NODES.filter((n) => n.sim); const R = m.filter((n) => n.sim![1] === 'R').length; return (
            <div className="strip sim">
              <Soon>Simulation</Soon>
              <span><b>{m.length}</b> real systems have a stand-in today</span><span><b>{NODES.length - m.length}</b> do not yet</span>
              <span>{R} on Rajen's PC (databases and CSV files) · {m.length - R} on Partner's laptop</span>
              <span className="mute">The stand-ins are not connected to each other, or to any real system.</span>
            </div>) })()}

          {mapView && !mobile && (
            <Canvas view={view as 'landscape' | 'sim'} simple={simple} conn={conn} lens={lens} prov={prov} sel={sel} machine={machine} chapter={chapter} onSelect={(id) => setTarget({ kind: 'node', id })} />
          )}
          {mapView && mobile && (
            <>
              {key && <div className="legendwrap static"><Legend sim={view === 'sim'} onClose={() => setKey(false)} /></div>}
              <LayerList sim={view === 'sim'} simple={simple} lens={lens} prov={prov} sel={sel} onSelect={(id) => setTarget({ kind: 'node', id })} />
            </>
          )}
          {view === 'journey' && <JourneyPlayer jid={jid} setJid={setJid} sel={sel} onSelect={(id) => setTarget({ kind: 'node', id })} />}
          {view === 'matrix' && <Matrix simple={simple} group={group} showWhy={showWhy} onPair={(a, b) => setTarget({ kind: 'pair', a, b })} />}
          {view === 'provinces' && <Provinces onSee={(p) => { setProv(p); setView('landscape') }} onSystem={(id) => setTarget({ kind: 'node', id })} />}
        </main>

        <nav className="tabbar" aria-label="Views">
          {VIEWS.map((v) => (
            <button key={v.id} aria-current={view === v.id ? 'page' : undefined} onClick={() => setView(v.id)}><code>{v.n}</code>{v.label}</button>
          ))}
        </nav>

        {tour && <Tour onClose={() => { setTour(false); setView('landscape') }} setView={(v) => { setViewS(v as View); setTarget(null); setNoteOpen((m) => ({ ...m, [v]: false })) }} />}
        <AnimatePresence>{target && <Drawer key="d" target={target} onClose={() => setTarget(null)} onGo={(id) => setTarget({ kind: 'node', id })} />}</AnimatePresence>
      </div>
    </MotionConfig>
  )
}
