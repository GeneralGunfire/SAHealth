import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Palette from './Palette'

const NAV = [
  { to: '/', label: 'Overview', end: true },
  { to: '/map', label: 'Map' },
  { to: '/systems', label: 'Systems' },
  { to: '/journeys', label: 'Journeys' },
  { to: '/provinces', label: 'Provinces' },
  { to: '/gaps', label: 'Gaps' },
  { to: '/sources', label: 'Sources' },
]

export default function Shell() {
  const { pathname } = useLocation()
  const main = useRef<HTMLElement>(null)
  const nav = useRef<HTMLElement>(null)
  const items = useRef<(HTMLAnchorElement | null)[]>([])
  const [ind, setInd] = useState({ left: 0, width: 0, on: false })
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)

  const active = NAV.findIndex((n) => (n.end ? pathname === '/' : pathname.startsWith(n.to)))

  // slide the active indicator under the current page
  useLayoutEffect(() => {
    const place = () => {
      const el = items.current[active]
      if (!el) { setInd((s) => ({ ...s, on: false })); return }
      setInd({ left: el.offsetLeft, width: el.offsetWidth, on: true })
    }
    place()
    const ro = new ResizeObserver(place)
    if (nav.current) ro.observe(nav.current)
    return () => ro.disconnect()
  }, [active])

  // each page starts at the top; the mobile menu closes
  useEffect(() => { main.current?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); setMenu(false) }, [pathname])

  // Ctrl+K, Cmd+K or "/" opens search
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing = !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setSearch((v) => !v) }
      else if (e.key === '/' && !typing) { e.preventDefault(); setSearch(true) }
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [])

  return (
    <div className="ex">
      <header className={`ex__top${scrolled ? ' is-scrolled' : ''}`}>
        <div className="ex__bar">
          <Link to="/" className="ex__logo" aria-label="SAHealth by DEXA, overview">
            <img src="/dexa-logo-navy.png" alt="DEXA" />
            <span>SAHealth</span>
          </Link>

          <nav className="ex__nav" aria-label="Pages" ref={nav}>
            <span className={`ex__ind${ind.on ? ' is-on' : ''}`} style={{ transform: `translateX(${ind.left}px)`, width: ind.width }} aria-hidden="true" />
            {NAV.map((n, i) => (
              <Link
                key={n.to} to={n.to} ref={(el) => { items.current[i] = el }}
                className={`ex__link${i === active ? ' is-active' : ''}`} aria-current={i === active ? 'page' : undefined}
              >{n.label}</Link>
            ))}
          </nav>

          <button type="button" className="ex__search" onClick={() => setSearch(true)} aria-label="Search the explorer">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" /></svg>
            <span>Search</span>
            <kbd>Ctrl K</kbd>
          </button>

          <button type="button" className="ex__burger" onClick={() => setMenu((v) => !v)} aria-expanded={menu} aria-label="Menu">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {menu ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {menu && (
          <nav className="ex__sheet" aria-label="Pages (mobile)">
            {NAV.map((n, i) => (
              <Link key={n.to} to={n.to} className={`ex__sheetlink${i === active ? ' is-active' : ''}`}>{n.label}</Link>
            ))}
            <button type="button" className="ex__sheetlink" onClick={() => { setMenu(false); setSearch(true) }}>Search</button>
          </nav>
        )}
      </header>

      <main className="ex__main" id="main" ref={main} onScroll={(e) => setScrolled((e.currentTarget as HTMLElement).scrollTop > 6)}>
        <div className="page" key={pathname}>
          <Outlet />
        </div>
        <footer className="ex__foot">
          <span><b>A DEXA project.</b> Describes how South African health data systems exist today, with sources. It does not describe what DEXA will build.</span>
          <Link to="/sources">Sources and method</Link>
        </footer>
      </main>

      <Palette open={search} onClose={() => setSearch(false)} />
    </div>
  )
}
