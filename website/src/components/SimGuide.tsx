import { useEffect } from 'react'
import { NODES } from '../data/nodes'
import { Soon } from './ui'

export type SimFocus = 'all' | 'real' | 'standin' | 'gateway'

const STAND = NODES.filter((n) => n.sim)
const R = STAND.filter((n) => n.sim![1] === 'R').length

interface Step { focus: SimFocus; tag: 'Existing infrastructure' | 'DEXA stand-in' | 'Coming soon'; title: string; text: string }
const STEPS: Step[] = [
  { focus: 'all', tag: 'Existing infrastructure', title: 'This is a simulation, not the real thing.', text: `The map shows the ${NODES.length} real systems from the Landscape. DEXA has built test copies, called stand-ins, for some of them. Step through to see which.` },
  { focus: 'real', tag: 'Existing infrastructure', title: `${NODES.length - STAND.length} real systems have no stand-in yet.`, text: 'They exist in the real world and appear as plain outlines here. DEXA has not modelled them.' },
  { focus: 'standin', tag: 'DEXA stand-in', title: `${STAND.length} stand-in databases mimic real systems.`, text: `They are marked in burgundy. They hold no real patient data. ${R} are on Rajen's PC and ${STAND.length - R} on Partner's laptop.` },
  { focus: 'standin', tag: 'DEXA stand-in', title: 'The stand-ins are not connected to each other.', text: 'This copies the real world, where these systems are not linked either. No line on this map is a working connection.' },
  { focus: 'gateway', tag: 'Coming soon', title: 'A gateway is planned. It does not exist yet.', text: 'The SAHealth gateway is planned for Phase 2. It is not built and not connected to anything. The dotted lines show which stand-ins it would reach.' },
]

export function SimGuide({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const s = STEPS[step]
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,select,textarea,[role=dialog]')) return
      if (e.key === 'ArrowRight') setStep(Math.min(STEPS.length - 1, step + 1))
      if (e.key === 'ArrowLeft') setStep(Math.max(0, step - 1))
    }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [step, setStep])
  return (
    <div className={'simguide tag-' + s.tag.split(' ')[0].toLowerCase()} role="region" aria-label="Simulation walkthrough">
      <div className="sg-n"><code>{step + 1} / {STEPS.length}</code>{s.tag === 'Coming soon' ? <Soon /> : <span className="sg-tag">{s.tag}</span>}</div>
      <div className="sg-t"><b>{s.title}</b><p>{s.text}</p></div>
      <div className="sg-a">
        <button className="btn" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</button>
        <button className="btn primary" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>Next</button>
        <div className="dots" aria-hidden>{STEPS.map((_, i) => <i key={i} className={i === step ? 'on' : i < step ? 'past' : ''} />)}</div>
      </div>
    </div>
  )
}
export const simFocusOf = (step: number): SimFocus => STEPS[step].focus
