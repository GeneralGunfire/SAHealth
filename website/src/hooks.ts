import { useEffect, useState } from 'react'

/** True while the media query matches. Re-evaluates on change. */
export function useMedia(query: string): boolean {
  const get = () => (typeof matchMedia !== 'undefined' ? matchMedia(query).matches : false)
  const [m, setM] = useState(get)
  useEffect(() => {
    const mq = matchMedia(query)
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return m
}

export const useIsMobile = () => useMedia('(max-width: 820px)')

/** Read a value from sessionStorage without ever throwing. */
export const ss = {
  get(k: string): string | null { try { return sessionStorage.getItem(k) } catch { return null } },
  set(k: string, v: string) { try { sessionStorage.setItem(k, v) } catch { /* storage unavailable */ } },
}
