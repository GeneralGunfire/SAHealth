import { Fragment } from 'react'
import { GLOSS_TIP } from '../data/derived'

const escape = (t: string) => t.replace(/[.*+?^$()|[\]\\{}]/g, (c) => '\\' + c)

// Only plain acronyms are annotated, so a tooltip never lands inside a longer name.
const TERMS = Object.keys(GLOSS_TIP).filter((k) => /^[A-Za-z][A-Za-z0-9.-]{2,}$/.test(k)).sort((a, b) => b.length - a.length)
const RE = new RegExp('\\b(' + TERMS.map(escape).join('|') + ')\\b', 'g')

/** Wraps known technical terms in a focusable tooltip. The plain-language meaning shows on hover and on keyboard focus. */
export function Gloss({ text }: { text: string }) {
  const parts = text.split(RE)
  return (
    <>
      {parts.map((p, i) => i % 2 === 1
        ? <span key={i} className="gl" tabIndex={0} role="note" data-tip={GLOSS_TIP[p]} aria-label={`${p}: ${GLOSS_TIP[p]}`}>{p}</span>
        : <Fragment key={i}>{p}</Fragment>)}
    </>
  )
}
