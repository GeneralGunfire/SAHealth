// Feedback goes to the DEXA Forged team inbox. The address and key below are the PUBLIC (publishable)
// ones; the database only allows this table to be written to, never read, by the public.
const URL = 'https://jtvrvgqlgburffagfxru.supabase.co'
const KEY = 'sb_publishable_q3McsS2ac1_hBKZFCYQ9lw_EPQ3mRy9'

export type FeedbackInput = { rating: number | null; message: string; contact: string; page: string; trap?: string }

export class FeedbackError extends Error {
  kind: 'throttle' | 'network' | 'rejected'
  constructor(kind: 'throttle' | 'network' | 'rejected', message: string) { super(message); this.kind = kind }
}

const LAST = 'sahealth.feedback.last'

export async function sendFeedback(i: FeedbackInput): Promise<void> {
  if (i.trap) return // a hidden field only bots fill in: pretend it worked, send nothing
  const message = i.message.trim().slice(0, 2000)
  if (i.rating == null && !message) throw new FeedbackError('rejected', 'Add a star rating or a message first.')

  try {
    const last = Number(localStorage.getItem(LAST) ?? 0)
    if (Date.now() - last < 30_000) throw new FeedbackError('throttle', 'Please wait a moment before sending another.')
  } catch (e) { if (e instanceof FeedbackError) throw e /* storage blocked: carry on */ }

  let res: Response
  try {
    res = await fetch(`${URL}/rest/v1/feedback`, {
      method: 'POST',
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ source: 'explorer', page: i.page.slice(0, 200), rating: i.rating, message, contact: i.contact.trim().slice(0, 200) }),
    })
  } catch {
    throw new FeedbackError('network', 'Could not reach the server. Check your connection and try again.')
  }
  if (!res.ok) throw new FeedbackError('rejected', 'Sorry, that could not be saved right now. Please try again later.')
  try { localStorage.setItem(LAST, String(Date.now())) } catch { /* ignore */ }
}
