import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { FeedbackError, sendFeedback } from '../lib/feedback'

const LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

/** A small, friendly feedback form. Opens from the top bar. */
export default function Feedback({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const { pathname } = useLocation()
  const [rating, setRating] = useState<number | null>(null)
  const [hover, setHover] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [trap, setTrap] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) { d.showModal(); setDone(false); setErr(null) }
    if (!open && d.open) d.close()
  }, [open])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    setBusy(true)
    try {
      await sendFeedback({ rating, message, contact, page: pathname, trap })
      setDone(true)
      setRating(null); setMessage(''); setContact('')
    } catch (ex) {
      setErr(ex instanceof FeedbackError ? ex.message : 'Something went wrong. Please try again.')
    } finally { setBusy(false) }
  }

  const shown = hover ?? rating

  return (
    <dialog ref={ref} className="fbk" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose() }}>
      {open && (
        <div className="fbk__box">
          <header className="fbk__head">
            <h2>{done ? 'Thank you' : 'Send feedback'}</h2>
            <button type="button" className="fbk__x" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </header>

          {done ? (
            <div className="fbk__done">
              <p>Your feedback has reached the DEXA team. We read all of it.</p>
              <button type="button" className="btn btn--dark" onClick={onClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="fbk__lead">How useful was this site? Anything missing, unclear or wrong?</p>

              <div className="fbk__stars" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(null)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}: ${LABELS[n - 1]}`}
                    className={shown != null && n <= shown ? 'on' : ''}
                    onMouseEnter={() => setHover(n)} onClick={() => setRating(rating === n ? null : n)}
                  >
                    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.2l-5.4 2.9 1-6.1L3.2 9.7l6.1-.9z" /></svg>
                  </button>
                ))}
                <span className="fbk__word" aria-live="polite">{shown != null ? LABELS[shown - 1] : 'Optional'}</span>
              </div>

              <label className="fbk__field">
                <span>Your message</span>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={2000} placeholder="What were you looking for? What would make this better?" />
              </label>
              <label className="fbk__field">
                <span>Email, if you would like a reply <em>(optional)</em></span>
                <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={200} autoComplete="email" />
              </label>
              {/* hidden from people; bots tend to fill every field */}
              <input className="fbk__trap" tabIndex={-1} autoComplete="off" aria-hidden="true" value={trap} onChange={(e) => setTrap(e.target.value)} name="website" />

              <p className="fbk__page">This note will include the page you are on: <code>{pathname}</code></p>
              {err && <p className="fbk__err" role="alert">{err}</p>}
              <div className="fbk__foot">
                <button type="button" className="btn" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn--dark" disabled={busy}>{busy ? 'Sending…' : 'Send feedback'}</button>
              </div>
            </form>
          )}
        </div>
      )}
    </dialog>
  )
}
