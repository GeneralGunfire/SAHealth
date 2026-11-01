import { useEffect, useLayoutEffect, useState } from 'react'
import { motion } from 'framer-motion'

export interface TourStep { view: string; target?: string; title: string; text: string }

export const TOUR: TourStep[] = [
  { view: 'landscape', target: 'nav', title: 'Five pages, one landscape', text: 'These tabs move you between the map, step-by-step journeys, provinces, gaps and the simulation. Each page opens with a short introduction, and “About this page” brings it back.' },
  { view: 'landscape', target: 'zoomto', title: 'Zoom to a chapter', text: 'Jump to a part of the map: care delivery, registries, labs and medicines, or money and standards. Everything else fades back so you always know where you are.' },
  { view: 'landscape', target: 'plane', title: 'Explore the map', text: 'Drag to move and scroll to zoom. Hover an icon for a one-line description and to light up its connections. Click an icon to open its full record, with sources and a confidence rating.' },
  { view: 'landscape', target: 'rail', title: 'Layers on the left', text: 'Each row is something a system does: identity, registries, clinics, hospitals and so on. Click a layer name to zoom straight to it.' },
  { view: 'landscape', target: 'key', title: 'The key', text: 'Open the key any time to see what every icon, line style and colour means.' },
  { view: 'journey', target: 'jp-ctl', title: 'Journeys play like a short film', text: 'Choose a journey on the left and it plays by itself. Pause, step forward and back, or change the speed. Arrows show which way the data moves, and a red cross shows where it stops.' },
  { view: 'journey', target: 'jp-chap', title: 'Jump to any chapter', text: 'Every journey is split into chapters. Click one to skip straight to that moment.' },
  { view: 'provinces', target: 'prov-grid', title: 'Nine provinces, nine answers', text: 'Each card shows the hospital and clinic systems a province runs, how far the patient registry is used, and the sources. Use “Add to comparison” on two cards to see them side by side.' },
  { view: 'matrix', target: 'gaps-stats', title: 'What is not connected', text: 'Every square in the grid below is a pair of systems. The colours say why a pair is not connected. Click a reason to focus on it.' },
  { view: 'landscape', title: 'You are ready', text: 'Start with the map, then follow a journey. You can replay this tour from the header at any time.' },
]

export function Tour({ onClose, setView }: { onClose: () => void; setView: (v: string) => void }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState<DOMRect | null>(null)
  const step = TOUR[i]
  const last = i === TOUR.length - 1

  useLayoutEffect(() => { setRect(null); setView(step.view) }, [i])
  useEffect(() => {
    const find = () => {
      const el = step.target ? document.querySelector(`[data-tour="${step.target}"]`) : null
      setRect(el ? el.getBoundingClientRect() : null)
    }
    const t1 = setTimeout(find, 700)
    const t2 = setTimeout(find, 1500)
    addEventListener('resize', find)
    return () => { clearTimeout(t1); clearTimeout(t2); removeEventListener('resize', find) }
  }, [i, step.target])
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight' || e.key === 'Enter') { if (last) onClose(); else setI((n) => n + 1) }
      if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1))
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [last, onClose])

  const pad = 8
  const W = 360
  let left = (innerWidth - W) / 2, top = innerHeight / 2 - 120
  if (rect) {
    const below = rect.bottom + 16 + 210 < innerHeight
    top = below ? rect.bottom + 16 : Math.max(12, rect.top - 16 - 210)
    left = Math.min(innerWidth - W - 16, Math.max(16, rect.left + rect.width / 2 - W / 2))
    if (rect.height > innerHeight * 0.6) { top = Math.min(innerHeight - 240, rect.top + 40); left = Math.min(innerWidth - W - 16, Math.max(16, rect.left + 24)) }
  }

  return (
    <div className="tour" role="dialog" aria-label="Site tour">
      {rect ? (
        <motion.div className="tour-spot" initial={false} animate={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} />
      ) : <div className="tour-dim" />}
      <motion.div className="tour-card" key={i} style={{ left, top, width: W }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
        <div className="tour-step">{i + 1} of {TOUR.length}</div>
        <h4>{step.title}</h4>
        <p>{step.text}</p>
        <div className="tour-actions">
          <button className="link" onClick={onClose}>Skip tour</button>
          <span style={{ flex: 1 }} />
          <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
          <button className="btn primary" onClick={() => (last ? onClose() : setI(i + 1))}>{last ? 'Finish' : 'Next'}</button>
        </div>
      </motion.div>
    </div>
  )
}
