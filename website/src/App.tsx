import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Canvas } from './components/Canvas'
import { Drawer, type DrawerTarget } from './components/Drawer'
import { Intro } from './components/Intro'
import { Tour } from './components/Tour'
import { Search } from './components/Search'
import { FilterBar, FilterPanel } from './components/FilterPanel'
import { SimGuide, simFocusOf } from './components/SimGuide'
import { ErrorBoundary, Loading } from './components/ErrorBoundary'
import { Brand, Soon } from './components/ui'
import { Legend } from './components/Legend'
import { Matrix } from './views/Matrix'
import { JourneyPlayer } from './views/JourneyPlayer'
import { Provinces } from './views/Provinces'
import { LayerList } from './views/LayerList'
import { NODES, BY_ID } from './data/nodes'
import { EDGES, JOURNEYS } from './data/flows'
import { PROVINCES, PROV_DATA, SRC } from './data/meta'
import { CHAPTERS, type ChapterId } from './layout'
import { EMPTY_FILTERS, activeCount, isEmpty, passes, type Filters } from './filters'
import { NavContext, type Nav, type View } from './nav'
import { ss, useIsMobile } from './hooks'
import type { Lens, SysNode } from './types'

const Compare = lazy(() => import('./views/Compare').then((m) => ({ default: m.Compare })))
const Sources = lazy(() => import('./views/Sources').then((m) => ({ default: m.Sources })))
const Glossary = lazy(() => import('./views/Glossary').then((m) => ({ default: m.Glossary })))

const withH = PROVINCES.filter((p) => !PROV_DATA[p].none).length
interface ViewMeta { id: View; n: string; label: string; title: string; desc: string; main: boolean }
const VIEWS: ViewMeta[] = [
  { id: 'landscape', n: '01', label: 'Landscape', main: true, title: `${NODES.length} systems hold South Africa’s health data. Few talk to each other.`, desc: 'Each mark is one system. Rows show what it does and columns show who runs it. Lines are the connections the research documents. Select a system to see how it connects, who relies on it and what evidence supports it.' },
  { id: 'journey', n: '02', label: 'Journeys', main: true, title: 'One patient, many copies of the same record.', desc: 'A patient’s information is created at every visit but rarely travels with them. Pick a journey and step through it: where the data starts, how it moves, who retypes it and where it stops.' },
  { id: 'provinces', n: '03', label: 'Provinces', main: true, title: `Only ${withH} of 9 provinces report a hospital record system.`, desc: 'National registries and labs work the same everywhere. Hospital and clinic systems do not: each province runs its own. Choose a province to read its record and sources, or compare several.' },
  { id: 'matrix', n: '04', label: 'Gaps', main: true, title: 'Most pairs of systems have no documented link.', desc: 'Every square is a pair of systems. The empty squares are the finding. Letters give the main reason for a gap and shading shows how firm the finding is. “No connection found” does not prove none exists.' },
  { id: 'sim', n: '05', label: 'Simulation', main: true, title: 'DEXA is testing on stand-in systems. Nothing here is live.', desc: 'Stand-ins are test copies of real systems. They hold no real patient data. The gateway that would join them is Coming soon. Step through to see what is real, what is simulated and what is planned.' },
  { id: 'sources', n: '', label: 'Research sources', main: false, title: `Every claim traces back to one of ${Object.keys(SRC).length} sources.`, desc: 'Search the directory, then choose a source to see which systems and provinces cite it. Each link goes to the original.' },
  { id: 'glossary', n: '', label: 'Glossary', main: false, title: 'Technical terms, in plain language first.', desc: 'Short names such as HPRS appear throughout the site. Each is explained here in plain words, with the evidence behind it.' },
  { id: 'compare', n: '', label: 'Compare systems', main: false, title: 'Compare systems side by side.', desc: 'Choose two to four systems. Rows that differ are highlighted. Information the research does not record is marked, not hidden.' },
]
const MAIN = VIEWS.filter((v) => v.main)
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
  const [flt, setFlt] = useState<Filters>(EMPTY_FILTERS)
  const [fpanel, setFpanel] = useState(false)
  const [focusId, setFocusId] = useState<string | null>(null)
  const [compare, setCompareS] = useState<string[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [selProv, setSelProv] = useState('Western Cape')
  const [srcSel, setSrcSel] = useState<string | null>(null)
  const [glossFocus, setGlossFocus] = useState<string | null>(null)
  const [simStep, setSimStep] = useState(0)

  const isOpen = (v: View) => noteOpen[v] ?? (!skipView && !ss.get('note:' + v))
  const setOpen = (v: View, o: boolean) => { setNoteOpen((m) => ({ ...m, [v]: o })); if (!o) ss.set('note:' + v, '1') }

  const setView = useCallback((v: View) => {
    setViewS(v)
    setMenu(false)
    try { history.replaceState(null, '', location.pathname + location.search + '#' + v) } catch { /* ignore */ }
    window.scrollTo({ top: 0 })
  }, [])
  const endIntro = () => { setIntro(false); ss.set('introSeen', '1') }
  const meta = VIEWS.find((v) => v.id === view)!
  const sel = target?.kind === 'node' ? target.id : null

  /* ---------- cross-view navigation ---------- */
  const nav: Nav = useMemo(() => ({
    view,
    goView: (v) => { setTarget(null); setView(v) },
    openNode: (id) => setTarget({ kind: 'node', id }),
    openPair: (a, b) => setTarget({ kind: 'pair', a, b }),
    goJourney: (j) => { setJid(j); setTarget(null); setView('journey') },
    goProvince: (p) => { setSelProv(p); setTarget(null); setView('provinces') },
    goSource: (id) => { setSrcSel(id); setTarget(null); setView('sources') },
    goLandscapeProvince: (p) => { setProv(p); setTarget(null); setView('landscape') },
    focusNode: (id) => { setFocusId(id); if (id) { setView('landscape') } },
    focusId,
    compare,
    toggleCompare: (id) => setCompareS((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id].slice(-4))),
    setCompare: (ids) => setCompareS(ids.slice(0, 4)),
    openSearch: () => setSearchOpen(true),
    showLayer: (id) => { setFlt({ ...EMPTY_FILTERS, layers: [id] }); setFocusId(null); setTarget(null); setView('landscape') },
    showSector: (id) => { setFlt({ ...EMPTY_FILTERS, sectors: [id] }); setFocusId(null); setTarget(null); setView('landscape') },
    goGlossary: (t) => { setGlossFocus(t); setTarget(null); setView('glossary') },
  }), [view, focusId, compare, setView])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input,textarea,select,[contenteditable]')
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); setSearchOpen(true) }
      else if (e.key === 'Escape' && !tour && !searchOpen) { setTarget(null); setMenu(false); setFpanel(false) }
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [tour, searchOpen])
  useEffect(() => {
    const h = () => { setViewS(readView()); setTarget(null); setMenu(false) }
    addEventListener('hashchange', h); return () => removeEventListener('hashchange', h)
  }, [])

  /* ---------- landscape filtering ---------- */
  const focusSet = useMemo(() => {
    if (!focusId) return null
    const s = new Set([focusId])
    EDGES.forEach((e) => { if (e.a === focusId) s.add(e.b); if (e.b === focusId) s.add(e.a) })
    return s
  }, [focusId])
  const pred = useMemo<((n: SysNode) => boolean) | undefined>(() => {
    const hide = flt.layers.length + flt.sectors.length + flt.status.length + flt.conf.length > 0
    if (!hide && !focusSet) return undefined
    return (n) => passes(n, flt) && (!focusSet || focusSet.has(n.id))
  }, [flt, focusSet])
  const predKey = pred ? [flt.layers, flt.sectors, flt.status, flt.conf, focusId].map((x) => (Array.isArray(x) ? x.join(',') : x ?? '')).join('|') : undefined
  const sectors = flt.sectors.length ? flt.sectors : undefined
  const shownCount = useMemo(() => NODES.filter((n) => (simple ? n.core : true) && (!pred || pred(n)) && (prov === 'all' || !n.provs || n.provs.includes(prov))).length, [simple, pred, prov])
  const resetFilters = () => { setFlt(EMPTY_FILTERS); setFocusId(null) }

  const panelW = target && !mobile && window.innerWidth < 1760 ? Math.round(Math.min(450, Math.max(380, window.innerWidth * 0.27))) : 0
  const pd = prov !== 'all' ? PROV_DATA[prov] : null
  const mapView = view === 'landscape' || view === 'sim'
  const fixed = !mobile && mapView
  const open = isOpen(view)
  const toolbarOn = mapView || view === 'matrix'

  /* ---------- breadcrumbs ---------- */
  const crumbs: string[] = (() => {
    const c: string[] = [meta.main ? meta.label : meta.id === 'compare' ? 'Compare' : 'Research']
    if (!meta.main && meta.id !== 'compare') c.push(meta.label)
    if (view === 'landscape') { if (focusId) c.push(`Focus: ${BY_ID[focusId].name}`); else if (prov !== 'all') c.push(prov); else if (sel) c.push(BY_ID[sel].name) }
    if (view === 'journey') c.push(JOURNEYS.find((j) => j.id === jid)!.title)
    if (view === 'provinces') c.push(selProv)
    if (view === 'matrix' && target?.kind === 'pair') c.push(`${BY_ID[target.a].name} ↔ ${BY_ID[target.b].name}`)
    if (view === 'sources' && srcSel && SRC[srcSel]) c.push(srcSel)
    if (view === 'compare') c.push(`${compare.length} system${compare.length === 1 ? '' : 's'}`)
    return c
  })()

  return (
    <NavContext.Provider value={nav}>
      <MotionConfig reducedMotion="user">
        <div className={'app' + (fixed ? ' app-fixed' : '') + (target && !mobile ? ' has-panel' : '')}>
          <a className="skip-link" href="#main">Skip to content</a>
          <AnimatePresence>{intro && <Intro onDone={(wantTour) => { endIntro(); setView('landscape'); if (wantTour) setTour(true) }} />}</AnimatePresence>

          <header className="mast">
            <div className="mast-in">
              <button className="brandbtn" onClick={() => nav.goView('landscape')} aria-label="DEXA, go to the Landscape"><Brand compact={mobile} /></button>
              <nav className="tabs" aria-label="Main views" data-tour="nav">
                {MAIN.map((v) => (
                  <button key={v.id} aria-current={view === v.id ? 'page' : undefined} onClick={() => nav.goView(v.id)}>
                    <code>{v.n}</code>{v.label}
                    {view === v.id && <motion.span layoutId="tabbar" className="bar" />}
                  </button>
                ))}
              </nav>
              <div className="mast-act">
                <button className="searchbtn" data-tour="search" onClick={() => setSearchOpen(true)} aria-label="Search (press slash)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
                  <span>Search</span><kbd>/</kbd>
                </button>
                <div className="menuwrap">
                  <button className="link" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>Research and tools<span aria-hidden> ▾</span></button>
                  {menu && (
                    <div className="menu" role="menu">
                      <button role="menuitem" onClick={() => nav.goView('sources')}><b>Research sources</b><small>Search all {Object.keys(SRC).length} sources</small></button>
                      <button role="menuitem" onClick={() => nav.goView('glossary')}><b>Glossary</b><small>Terms in plain language</small></button>
                      <button role="menuitem" onClick={() => nav.goView('compare')}><b>Compare systems</b><small>{compare.length ? `${compare.length} chosen` : 'Side by side'}</small></button>
                      <hr />
                      <button role="menuitem" onClick={() => { setMenu(false); setTour(true) }}><b>Take the tour</b><small>One minute</small></button>
                      <button role="menuitem" onClick={() => { setMenu(false); setIntro(true) }}><b>Replay the introduction</b></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <section className={'note' + (open ? ' open' : '')} aria-label="About this view">
            <div className="note-in">
              <nav className="crumbs" aria-label="Breadcrumb"><ol><li><button onClick={() => nav.goView('landscape')}>DEXA</button></li>{crumbs.map((c, i) => <li key={i} aria-current={i === crumbs.length - 1 ? 'page' : undefined}>{c}</li>)}</ol></nav>
              <div className="note-t"><h1>{meta.title}</h1>
                <button className="note-b" aria-expanded={open} onClick={() => setOpen(view, !open)}>{open ? 'Hide note' : 'About this view'}</button></div>
              {open && <p>{meta.desc}</p>}
            </div>
          </section>

          <main id="main" tabIndex={-1} key={view} className={'view view-' + view}>
            {toolbarOn && (
              <div className="toolbar" role="toolbar" aria-label="Filters">
                {view === 'landscape' && (
                  <div className="tgroup grow"><label htmlFor="findsys">Find a system</label>
                    <input id="findsys" className="finput" type="search" value={flt.q} onChange={(e) => setFlt({ ...flt, q: e.target.value })} placeholder="Name or short name, e.g. HPRS" /></div>
                )}
                {view === 'landscape' && (
                  <div className="tgroup">
                    <button className={'btn fbtn' + (activeCount(flt) ? ' has' : '')} aria-expanded={fpanel} onClick={() => setFpanel((o) => !o)}>Filters{activeCount(flt) > 0 && <span className="fcount">{activeCount(flt)}</span>}</button></div>
                )}
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
                <div className="tgroup"><label>Detail</label><div className="seg" role="group">
                  <button aria-pressed={simple} onClick={() => setSimple(true)}>Key systems</button><button aria-pressed={!simple} onClick={() => setSimple(false)}>All systems</button></div></div>
                {view === 'landscape' && !mobile && (
                  <div className="tgroup"><label>Connections</label><div className="seg" role="group">
                    <button aria-pressed={conn === 0} onClick={() => setConn(0)}>Islands</button><button aria-pressed={conn === 1} onClick={() => setConn(1)}>What exists</button>
                    <button disabled title="Coming soon">Needed <Soon>Soon</Soon></button></div></div>
                )}
                {view === 'matrix' && (
                  <>
                    <div className="tgroup"><label>Group by</label><div className="seg" role="group"><button aria-pressed={group === 'layer'} onClick={() => setGroup('layer')}>What it does</button><button aria-pressed={group === 'sector'} onClick={() => setGroup('sector')}>Who runs it</button></div></div>
                    <div className="tgroup"><label>Gaps</label><div className="seg" role="group"><button aria-pressed={!showWhy} onClick={() => setShowWhy(false)} title="Shading shows how firm each finding is">Plain: how firm</button><button aria-pressed={showWhy} onClick={() => setShowWhy(true)} title="Letters show the main reason for each gap">Show why</button></div></div>
                  </>
                )}
                {view === 'sim' && !mobile && (
                  <div className="tgroup"><button className="chip" aria-pressed={machine} onClick={() => setMachine((m) => !m)} title="Show which machine each stand-in database sits on">Machine tags</button></div>
                )}
                {mobile && mapView && <div className="tgroup"><label>Symbols</label><button className="chip" aria-pressed={key} onClick={() => setKey((k) => !k)}>Key</button></div>}
              </div>
            )}
            {fpanel && view === 'landscape' && <FilterPanel f={flt} set={setFlt} onClose={() => setFpanel(false)} />}
            {view === 'landscape' && <FilterBar f={flt} set={setFlt} shown={shownCount} total={NODES.length} onReset={resetFilters} />}

            {view === 'landscape' && pd && (
              <div className={'strip' + (pd.none ? ' warn' : '')}>
                <b>{prov}</b><span>Hospitals: <em>{pd.hosp ?? 'no hospital record system reported'}</em></span><span>Clinics: <em>{pd.phc}</em></span><span>Data centre: <em>{pd.dc ?? 'none found yet'}</em></span>
                <button className="link" onClick={() => setProv('all')}>Show all provinces</button>
              </div>
            )}
            {view === 'sim' && (() => { const m = NODES.filter((n) => n.sim); const R = m.filter((n) => n.sim![1] === 'R').length; return (
              <div className="strip sim">
                <Soon>Simulation</Soon>
                <span><b>{m.length}</b> real systems have a stand-in today</span><span><b>{NODES.length - m.length}</b> do not yet</span>
                <span>{R} on Rajen's PC (databases and CSV files) · {m.length - R} on Partner's laptop</span>
                <span className="mute">The stand-ins are not connected to each other, or to any real system.</span>
              </div>) })()}
            {view === 'sim' && <SimGuide step={simStep} setStep={setSimStep} />}

            <ErrorBoundary resetKey={view} onHome={() => nav.goView('landscape')}>
              <Suspense fallback={<Loading label="Loading this view" />}>
                {mapView && !mobile && (
                  <Canvas view={view as 'landscape' | 'sim'} simple={simple} conn={conn} lens={lens} prov={prov} sel={sel} machine={machine} chapter={chapter}
                    onSelect={(id) => setTarget({ kind: 'node', id })} pred={pred} predKey={predKey} sectors={sectors} q={flt.q} hlKey={flt.hlKey}
                    focusId={view === 'landscape' ? focusId : null} onExitFocus={() => setFocusId(null)} onReset={resetFilters}
                    simFocus={simFocusOf(simStep)} panelW={panelW} />
                )}
                {mapView && mobile && (
                  <>
                    {key && <div className="legendwrap static"><Legend sim={view === 'sim'} onClose={() => setKey(false)} /></div>}
                    <LayerList sim={view === 'sim'} simple={simple} lens={lens} prov={prov} sel={sel} pred={pred} q={flt.q} onSelect={(id) => setTarget({ kind: 'node', id })} onReset={isEmpty(flt) && !focusId ? undefined : resetFilters} />
                  </>
                )}
                {view === 'journey' && <JourneyPlayer jid={jid} setJid={setJid} sel={sel} onSelect={(id) => setTarget({ kind: 'node', id })} />}
                {view === 'matrix' && <Matrix simple={simple} group={group} showWhy={showWhy} onPair={(a, b) => setTarget({ kind: 'pair', a, b })} />}
                {view === 'provinces' && <Provinces sel={selProv} setSel={setSelProv} />}
                {view === 'sources' && <Sources selected={srcSel} />}
                {view === 'glossary' && <Glossary focus={glossFocus} />}
                {view === 'compare' && <Compare />}
              </Suspense>
            </ErrorBoundary>
          </main>

          {compare.length > 0 && view !== 'compare' && (
            <div className="cmptray" role="region" aria-label="Systems chosen for comparison">
              <span><b>{compare.length}</b> system{compare.length === 1 ? '' : 's'} chosen</span>
              <span className="cmptray-n">{compare.map((i) => BY_ID[i].name).join(' · ')}</span>
              <button className="btn primary" onClick={() => nav.goView('compare')} disabled={compare.length < 2}>{compare.length < 2 ? 'Add one more' : 'Compare'}</button>
              <button className="link" onClick={() => setCompareS([])}>Clear</button>
            </div>
          )}

          <nav className="tabbar" aria-label="Main views">
            {MAIN.map((v) => (
              <button key={v.id} aria-current={view === v.id ? 'page' : undefined} onClick={() => nav.goView(v.id)}><code>{v.n}</code>{v.label}</button>
            ))}
          </nav>

          {tour && <Tour onClose={() => { setTour(false); setView('landscape') }} setView={(v) => { setViewS(v as View); setTarget(null); setNoteOpen((m) => ({ ...m, [v]: false })) }} />}
          <AnimatePresence>{target && <Drawer key="d" target={target} onClose={() => setTarget(null)} />}</AnimatePresence>
          <AnimatePresence>{searchOpen && <Search key="s" onClose={() => setSearchOpen(false)} />}</AnimatePresence>
        </div>
      </MotionConfig>
    </NavContext.Provider>
  )
}
