import type { ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'

const ico = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)

const NAV = [
  { to: '/', label: 'Overview', end: true, icon: ico(<><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /><path d="M10 20v-5h4v5" /></>) },
  { to: '/map', label: 'Map', icon: ico(<><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M3 14h18M9 4v16M15 4v16" /></>) },
  { to: '/systems', label: 'Systems', icon: ico(<><path d="M8 6h12M8 12h12M8 18h12" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>) },
  { to: '/journeys', label: 'Journeys', icon: ico(<><circle cx="5" cy="18" r="2" /><circle cx="19" cy="6" r="2" /><path d="M7 18h6a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h6" /></>) },
  { to: '/provinces', label: 'Provinces', icon: ico(<><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>) },
  { to: '/gaps', label: 'Gaps', icon: ico(<><path d="M9 7H7a4 4 0 0 0 0 8h2M15 7h2a4 4 0 0 1 0 8h-2" /><path d="M8 11h2M14 11h2" strokeDasharray="1 3" /></>) },
]
const REF = [
  { to: '/sources', label: 'Sources and method', icon: ico(<><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h11" /></>) },
]

export default function Shell() {
  const main = useRef<HTMLElement>(null)
  const { pathname } = useLocation()
  // each page starts at the top of the panel
  useEffect(() => { main.current?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }) }, [pathname])

  const link = (n: { to: string; label: string; icon: ReactNode; end?: boolean }) => (
    <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `ex__link${isActive ? ' is-active' : ''}`}>
      {n.icon}
      <span>{n.label}</span>
    </NavLink>
  )

  return (
    <div className="ex">
      <aside className="ex__side">
        <div className="ex__sidein">
          <Link to="/" className="ex__logo" aria-label="SAHealth by DEXA, overview">
            <img src="/dexa-logo-navy.png" alt="DEXA" />
            <span>SAHealth</span>
          </Link>

          <p className="ex__group">Explore</p>
          <nav className="ex__nav" aria-label="Explore">{NAV.map(link)}</nav>

          <p className="ex__group ex__group--gap">Reference</p>
          <nav className="ex__nav" aria-label="Reference">{REF.map(link)}</nav>

          <div className="ex__foot">
            <strong>A DEXA project</strong>
            <p>Describes how South African health data systems exist today, with sources. It does not describe what DEXA will build.</p>
          </div>
        </div>
      </aside>

      <main className="ex__main" id="main" ref={main}>
        <Outlet />
      </main>
    </div>
  )
}
