import { createContext, useContext } from 'react'

export type View = 'landscape' | 'journey' | 'provinces' | 'matrix' | 'sim' | 'sources' | 'glossary' | 'compare'

/** Everything a component needs to send the user somewhere else without losing context. */
export interface Nav {
  view: View
  goView: (v: View) => void
  openNode: (id: string) => void
  openPair: (a: string, b: string) => void
  goJourney: (jid: string) => void
  goProvince: (p: string) => void
  goSource: (id: string) => void
  goLandscapeProvince: (p: string) => void
  focusNode: (id: string | null) => void
  focusId: string | null
  compare: string[]
  toggleCompare: (id: string) => void
  setCompare: (ids: string[]) => void
  openSearch: () => void
  showLayer: (id: string) => void
  showSector: (id: string) => void
  goGlossary: (term: string) => void
}

export const NavContext = createContext<Nav | null>(null)
export const useNav = (): Nav => {
  const n = useContext(NavContext)
  if (!n) throw new Error('useNav outside provider')
  return n
}
