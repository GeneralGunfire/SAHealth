import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas } from './components/Canvas'
import { Drawer, type DrawerTarget } from './components/Drawer'
import { Intro } from './components/Intro'
import { ViewIntro } from './components/ViewIntro'
import { Tour } from './components/Tour'
import { Matrix } from './views/Matrix'
import { JourneyPlayer } from './views/JourneyPlayer'
import { Provinces } from './views/Provinces'
import { NODES } from './data/nodes'
import { PROVINCES, PROV_DATA } from './data/meta'
import { CHAPTERS, type ChapterId } from './layout'
import type { Lens } from './types'

type View = 'landscape' | 'journey' | 'provinces' | 'matrix' | 'sim'
const VIEWS: { id: View; label: string; title: string; desc: string }[] = [
  { id: 'landscape', label: 'Landscape', title: 'Every system, in one picture', desc: 'Each icon is a system that holds health data in South Africa. Rows show what a system does and columns show who runs it. Lines show the few places where data actually moves between them. Zoom in to read, or pick a province to see its own version.' },
  { id: 'journey', label: 'Journeys', title: 'Follow the data', desc: 'A patient’s information is created at every visit, but it rarely travels with them. Pick a journey and step through it to see where the data goes, who retypes it, and where it stops.' },
  { id: 'provinces', label: 'Provinces', title: 'Nine provinces, nine answers', desc: 'National registries, labs and reporting work the same way everywhere. The hospital and clinic systems underneath are different in each province, and four provinces report no hospital record system at all.' },
  { id: 'matrix', label: 'Gaps', title: 'What is not connected, and why', desc: 'Every square is a pair of systems. The empty space is the finding. Colours show the main reason a pair is not connected: paper, the public–private wall, no shared patient ID, different standards, or no mandate.' },
  { id: 'sim', label: 'Simulation', title: 'What DEXA models', desc: 'DEXA stands up stand-in databases for real systems, so the gateway can be built and tested without touching real patient data. Solid icons have a stand-in today. Faded icons have none yet.' },
]
const LENSES: [Lens, string][] = [['all', 'All'], ['identity', 'Identity'], ['clinical', 'Clinical'], ['aggregate', 'Aggregate'], ['lab', 'Lab'], ['claims', 'Claims']]
const readView = (): View => { const h = location.hash.slice(1) as View; return VIEWS.some((v) => v.id === h) ? h : 'landscape' }

export function App() {
  const [intro, setIntro] = useState(() => { try { return !sessionStorage.getItem('introSeen') && !location.search.includes('skipintro') } catch { return true } })
  const [view, setViewS] = useState<View>(readView)
  const [viewIntro, setViewIntro] = useState(() => !location.search.includes('skipview'))
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

  const setView = (v: View, skipIntro = false) => {
    setViewS(v); setTarget(null); setViewIntro(!skipIntro)
    try { history.replaceState(null, '', '#' + v) } catch { /* ignore */ }
  }
  const endIntro = () => { setIntro(false); try { sessionStorage.setItem('introSeen', '1') } catch { /* ignore */ } }
  const meta = VIEWS.find((v) => v.id === view)!
  const sel = target?.kind === 'node' ? target.id : null

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTarget(null)
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [view, viewIntro])

  const pd = prov !== 'all' ? PROV_DATA[prov] : null
  const scrollPage = view === 'provinces' || view === 'matrix'

  return (
    <div className="app">
      <AnimatePresence>{intro && <Intro onDone={(wantTour) => { endIntro(); setView('landscape', wantTour); if (wantTour) setTour(true) }} />}</AnimatePresence>
      <header className="header">
        <div className="header-in">
          <div className="brand"><img src="/dexa-logo-navy.png" alt="DEXA" /><span className="sep" /><span className="prod">SA<span>Health</span></span></div>
          <nav className="nav" aria-label="Views" data-tour="nav">
            {VIEWS.map((v) => (
              <button key={v.id} aria-current={view === v.id} onClick={() => setView(v.id)}>
                {v.label}
                {view === v.id && <motion.span layoutId="navbar" className="bar" />}
              </button>
            ))}
          </nav>
          <div className="grow" />
          {!viewIntro && <button className="link" onClick={() => setViewIntro(true)}>About this page</button>}
          <button className="link" onClick={() => { setViewIntro(false); setTour(true) }}>Take the tour</button>
          <button className="link" onClick={() => setIntro(true)}>Replay intro</button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {viewIntro ? (
          <ViewIntro key={'i' + view} title={meta.title} desc={meta.desc} onContinue={() => setViewIntro(false)} />
        ) : (
          <motion.main key={'m' + view} className={'main' + (scrollPage ? ' scroll' : ' map')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {(view === 'landscape' || view === 'sim' || view === 'matrix') && (
              <div className="toolbar">
                {(view === 'landscape' || view === 'sim') && (
                  <div className="tgroup"><label>Lens</label><div className="chips">{LENSES.map(([id, l]) => <button key={id} className="chip" aria-pressed={lens === id} onClick={() => setLens(id)}>{l}</button>)}</div></div>
                )}
                {view === 'landscape' && (
                  <div className="tgroup"><label>Province</label>
                    <select className="sel" value={prov} onChange={(e) => setProv(e.target.value)} aria-label="Province view">
                      <option value="all">All of South Africa</option>{PROVINCES.map((p) => <option key={p}>{p}</option>)}
                    </select></div>
                )}
                {(view === 'landscape' || view === 'sim') && (
                  <div className="tgroup" data-tour="zoomto"><label>Zoom to</label><div className="seg">
                    {CHAPTERS.map((c) => <button key={c.id} aria-pressed={chapter === c.id} onClick={() => setChapter(c.id)}>{c.name}</button>)}</div></div>
                )}
                {(view === 'landscape' || view === 'matrix') && (
                  <div className="tgroup"><label>Detail</label><div className="seg">
                    <button aria-pressed={simple} onClick={() => setSimple(true)}>Key systems</button><button aria-pressed={!simple} onClick={() => setSimple(false)}>All systems</button></div></div>
                )}
                {view === 'landscape' && (
                  <div className="tgroup"><label>Connections</label><div className="seg">
                    <button aria-pressed={conn === 0} onClick={() => setConn(0)}>Islands</button><button aria-pressed={conn === 1} onClick={() => setConn(1)}>What exists</button>
                    <button disabled title="Coming soon">Needed<span className="soon">Soon</span></button></div></div>
                )}
                {view === 'matrix' && (
                  <>
                    <div className="tgroup"><label>Group by</label><div className="seg"><button aria-pressed={group === 'layer'} onClick={() => setGroup('layer')}>What it does</button><button aria-pressed={group === 'sector'} onClick={() => setGroup('sector')}>Who runs it</button></div></div>
                    <div className="tgroup"><label>Gaps</label><div className="seg"><button aria-pressed={!showWhy} onClick={() => setShowWhy(false)}>Plain</button><button aria-pressed={showWhy} onClick={() => setShowWhy(true)}>Show why</button></div></div>
                  </>
                )}
                {view === 'sim' && (
                  <div className="tgroup"><label>Machine tags</label><div className="seg"><button aria-pressed={!machine} onClick={() => setMachine(false)}>Hide</button><button aria-pressed={machine} onClick={() => setMachine(true)}>Show</button></div></div>
                )}
              </div>
            )}

            {view === 'landscape' && pd && (
              <div className={'strip' + (pd.none ? ' warn' : '')}>
                <span className="acc">{prov}</span><span>Hospitals: <b>{pd.hosp ?? 'no hospital record system reported'}</b></span><span>Clinics: <b>{pd.phc}</b></span><span>Data centre: <b>{pd.dc ?? 'none found yet'}</b></span>
              </div>
            )}
            {view === 'sim' && (() => { const m = NODES.filter((n) => n.sim); const R = m.filter((n) => n.sim![1] === 'R').length; return (
              <div className="strip"><span><b className="acc">{m.length}</b> real systems have a stand-in today</span><span><b>{NODES.length - m.length}</b> do not yet</span><span>{R} on Rajen's PC (databases and CSV files) · {m.length - R} on Partner's laptop</span><span style={{ color: 'var(--mute)' }}>The stand-ins are not yet connected to each other.</span></div>) })()}

            {(view === 'landscape' || view === 'sim') && (
              <Canvas view={view} simple={simple} conn={conn} lens={lens} prov={prov} sel={sel} machine={machine} chapter={chapter} onSelect={(id) => setTarget({ kind: 'node', id })} />
            )}

            {view === 'journey' && <JourneyPlayer jid={jid} setJid={setJid} sel={sel} onSelect={(id) => setTarget({ kind: 'node', id })} />}

            {view === 'matrix' && <Matrix simple={simple} group={group} showWhy={showWhy} onPair={(a, b) => setTarget({ kind: 'pair', a, b })} />}
            {view === 'provinces' && <Provinces onSee={(p) => { setProv(p); setView('landscape', true) }} onSystem={(id) => setTarget({ kind: 'node', id })} />}
          </motion.main>
        )}
      </AnimatePresence>

      {tour && <Tour onClose={() => { setTour(false); setView('landscape', true) }} setView={(v) => { setViewS(v as View); setTarget(null); setViewIntro(false) }} />}
      <AnimatePresence>{target && <Drawer key="d" target={target} onClose={() => setTarget(null)} onGo={(id) => setTarget({ kind: 'node', id })} />}</AnimatePresence>
    </div>
  )
}
