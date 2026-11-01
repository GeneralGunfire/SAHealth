import { useEffect } from 'react'

export function ViewIntro({ title, desc, onContinue }: { title: string; desc: string; onContinue: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onContinue() } }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [onContinue])
  return (
    <section className="vintro">
      <img className="vmark" src="/dexa-mark-navy.png" alt="" aria-hidden />
      <div className="vcenter">
        <h1 className="fu" style={{ animationDelay: '0.05s' }}>{title}</h1>
        <p className="fu" style={{ animationDelay: '0.2s' }}>{desc}</p>
        <div className="vactions fu" style={{ animationDelay: '0.35s' }}>
          <button className="btn primary big" onClick={onContinue} autoFocus>Continue to the data</button>
          <span className="vhint">or press Enter</span>
        </div>
      </div>
      <div className="vbrand"><img src="/dexa-logo-navy.png" alt="DEXA" /><span className="sep" /><span className="prod">SA<span>Health</span></span></div>
    </section>
  )
}
