import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Icon } from './Icon'
import type { IconName } from '../types'

const NAME = 'SAHealth'
const LINE = 'is a project proudly worked on by DEXA.'
const BODY = 'A map of how South African health data is stored, shared and, mostly, not shared: the real landscape today, and the simulation DEXA is building on top of it.'

// when each piece starts typing (ms) and how fast (ms per character)
const T = { name: [2400, 160], line: [4300, 62], body: [7000, 40] } as const
const chars = (t: number, s: readonly [number, number], len: number) => Math.max(0, Math.min(len, Math.floor((t - s[0]) / s[1])))

/* ---------------- the click-through story ---------------- */
interface Slide { kicker: string; title: string; text: string; visual: 'scatter' | 'split' | 'copies' | 'cost' | 'sim' | 'pages' }
const SLIDES: Slide[] = [
  { kicker: 'The problem', title: 'Health data is created at every visit. It rarely travels with the patient.', text: 'A clinic, a hospital, a lab, a pharmacy and a medical scheme each record their own part of the same person’s story, in their own system, on their own timetable. There is no shared record that ties them together.', visual: 'scatter' },
  { kicker: 'The scale', title: 'Two health systems, almost entirely separate.', text: 'About 62 million people live in South Africa. Around 9 million are covered by a medical scheme, so roughly five in six rely mainly on the public system. The two sectors run on separate software, funding and networks, with close to no data crossover by default.', visual: 'split' },
  { kicker: 'How it works today', title: 'One lab result can be copied three times by hand.', text: 'A result is printed or viewed, written into a paper folder by a nurse, then typed again into a treatment register by a data capturer. Studies of that register document misreported outcomes. Moving between clinics, hospitals or provinces means starting again.', visual: 'copies' },
  { kicker: 'Why it matters', title: 'The cost is paid in repeated tests, missing history and errors.', text: 'The data is not missing. It is created constantly and stored somewhere. It just is not where the doctor who needs it is. National plans for universal health coverage depend on knowing exactly what exists today, and that is what this site sets out.', visual: 'cost' },
  { kicker: 'What SAHealth is', title: 'A faithful simulation of the real landscape.', text: 'DEXA builds stand-in databases that mirror real systems, 13 so far across two machines, with no real patient data. None are linked to each other, just like the real ones. They let a gateway be built and tested before it ever touches a real institution.', visual: 'sim' },
  { kicker: 'This website', title: 'Five ways to see the same landscape.', text: 'Every claim carries a source and a confidence rating. Where something could not be found, it says so. Start with the map, follow a journey, compare provinces, see what is not connected, and see what DEXA models.', visual: 'pages' },
]

function Visual({ kind }: { kind: Slide['visual'] }) {
  const pop = (i: number) => ({ initial: { opacity: 0, scale: 0.4 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.25 + i * 0.09, type: 'spring' as const, stiffness: 260, damping: 18 } })
  const chip = (i: number, name: IconName, label: string, color = '#0b1b36') => (
    <motion.div key={label} className="sv-chip" style={{ ['--c' as string]: color }} {...pop(i)}><span><Icon name={name} size={26} /></span><b>{label}</b></motion.div>
  )
  if (kind === 'scatter') return <div className="sv-row">{[['person', 'Registry'], ['paper', 'Clinic folder'], ['db', 'Hospital system'], ['flask', 'Lab'], ['pill', 'Pharmacy'], ['receipt', 'Medical scheme']].map(([ic, l], i) => chip(i, ic as IconName, l, ['#2f5bff', '#0d9488', '#0d9488', '#0d9488', '#ea580c', '#ea580c'][i]))}</div>
  if (kind === 'split') return (
    <div className="sv-bars">
      <div><small>Rely mainly on the public sector</small><motion.i style={{ background: '#0d9488' }} initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ delay: 0.3, duration: 1.1 }} /><b>about 5 in 6</b></div>
      <div><small>Covered by a medical scheme</small><motion.i style={{ background: '#ea580c' }} initial={{ width: 0 }} animate={{ width: '15%' }} transition={{ delay: 0.6, duration: 1.1 }} /><b>9.17 million</b></div>
    </div>)
  if (kind === 'copies') return (
    <div className="sv-row">
      {chip(0, 'flask', 'Result')}<motion.span className="sv-arrow" {...pop(1)}>→</motion.span>
      {chip(2, 'paper', 'Paper folder', '#0d9488')}<motion.span className="sv-arrow" {...pop(3)}>→</motion.span>
      {chip(4, 'db', 'Treatment register', '#0d9488')}<motion.span className="sv-arrow x" {...pop(5)}>×</motion.span>
      {chip(6, 'db', 'Hospital system', '#0d9488')}
    </div>)
  if (kind === 'cost') return <div className="sv-row">{chip(0, 'flask', 'Repeated tests', '#dc2626')}{chip(1, 'paper', 'Missing history', '#dc2626')}{chip(2, 'registry', 'Retyping errors', '#dc2626')}</div>
  if (kind === 'sim') return (
    <div className="sv-machines">
      <motion.div {...pop(0)}><small>Machine 1</small>{[0, 1, 2].map((i) => <Icon key={i} name="db" size={28} />)}</motion.div>
      <motion.span className="sv-arrow x" {...pop(2)}>×</motion.span>
      <motion.div {...pop(3)}><small>Machine 2</small>{[0, 1].map((i) => <Icon key={i} name="db" size={28} />)}</motion.div>
    </div>)
  return <div className="sv-row">{['Landscape', 'Journeys', 'Provinces', 'Gaps', 'Simulation'].map((l, i) => <motion.div key={l} className="sv-page" {...pop(i)}>{l}</motion.div>)}</div>
}

function Story({ onDone }: { onDone: (tour: boolean) => void }) {
  const [i, setI] = useState(Number(new URLSearchParams(location.search).get('story') || 0))
  const [dir, setDir] = useState(1)
  const last = i === SLIDES.length - 1
  const go = (n: number) => { if (n < 0 || n >= SLIDES.length) return; setDir(n > i ? 1 : -1); setI(n) }
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); if (last) onDone(true); else go(i + 1) }
      if (e.key === 'ArrowLeft') go(i - 1)
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  })
  const s = SLIDES[i]
  return (
    <div className="story">
      <div className="story-top"><span>{i + 1} / {SLIDES.length}</span></div>
      <div className="story-stage">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={i} className="story-card" custom={dir}
            initial={{ opacity: 0, x: dir * 70 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -70 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            <div className="story-kicker">{s.kicker}</div>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
            <Visual kind={s.visual} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="story-nav">
        <button className="btn" onClick={() => go(i - 1)} disabled={i === 0}>Back</button>
        <div className="story-dots">{SLIDES.map((_, k) => <button key={k} className={k === i ? 'on' : k < i ? 'past' : ''} onClick={() => go(k)} aria-label={`Slide ${k + 1}`} />)}</div>
        {last ? (
          <div className="story-end">
            <button className="btn" onClick={() => onDone(false)}>Go straight to the site</button>
            <button className="btn primary" onClick={() => onDone(true)}>Take the 1-minute tour</button>
          </div>
        ) : <button className="btn primary" onClick={() => go(i + 1)}>Next</button>}
      </div>
    </div>
  )
}

/* ---------------- the intro: typed title, then the story ---------------- */
export function Intro({ onDone }: { onDone: (tour: boolean) => void }) {
  const [phase, setPhase] = useState<'title' | 'story'>(new URLSearchParams(location.search).has('story') ? 'story' : 'title')
  const [t, setT] = useState(0)
  useEffect(() => {
    if (phase !== 'title') return
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const el = now - t0
      setT(el)
      if (el < 16000) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase])
  useEffect(() => {
    if (phase !== 'title') return
    const k = (e: KeyboardEvent) => { if (e.key === 'Enter') setPhase('story'); if (e.key === 'Escape') onDone(false) }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [phase, onDone])

  const n1 = chars(t, T.name, NAME.length), n2 = chars(t, T.line, LINE.length), n3 = chars(t, T.body, BODY.length)
  const active = n3 > 0 && n3 < BODY.length ? 3 : n2 > 0 && n2 < LINE.length ? 2 : n1 < NAME.length && t >= T.name[0] ? 1 : 0
  const done = n3 >= BODY.length
  const caret = (i: number) => (active === i || (done && i === 3)) && <span className="caret" />

  return (
    <motion.div className="intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <button className="skip" onClick={() => onDone(false)}>Skip intro</button>
      {phase === 'title' ? (
        <div className="tstack">
          <motion.img className="tlogo" src="/dexa-logo-navy.png" alt="DEXA"
            initial={{ opacity: 0, y: 26, scale: 0.9, clipPath: 'inset(0 100% 0 0)', filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
          <motion.div className="trule" initial={{ width: 0 }} animate={{ width: 150 }} transition={{ duration: 0.9, delay: 1.5, ease: [0.22, 1, 0.36, 1] }} />
          <div className="tname" aria-label={NAME}>
            {NAME.slice(0, n1).split('').map((c, i) => <span key={i} className={i >= 2 ? 'hl' : undefined}>{c}</span>)}{caret(1)}
          </div>
          <div className="tline">{LINE.slice(0, n2)}{caret(2)}</div>
          <div className="tline2">{BODY.slice(0, n3)}{caret(3)}</div>
          <div className="tcta">
            {done && (
              <motion.button className="btn primary big" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} onClick={() => setPhase('story')} autoFocus>
                Why this matters
              </motion.button>
            )}
          </div>
        </div>
      ) : <Story onDone={onDone} />}
    </motion.div>
  )
}
