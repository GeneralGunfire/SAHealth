import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; resetKey: string; onHome: () => void }
interface State { error: Error | null }

/** Catches a crash inside one view so the rest of the site keeps working. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }
  static getDerivedStateFromError(error: Error): State { return { error } }
  componentDidUpdate(prev: Props) { if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }) }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="empty err" role="alert">
        <b>This view hit a problem and could not be shown.</b>
        <p>Nothing was lost. The research data is unchanged. You can try again, or go back to the Landscape.</p>
        <code>{this.state.error.message}</code>
        <div className="acts">
          <button className="btn primary" onClick={() => this.setState({ error: null })}>Try again</button>
          <button className="btn" onClick={() => { this.setState({ error: null }); this.props.onHome() }}>Go to the Landscape</button>
        </div>
      </div>
    )
  }
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="ld-bars" aria-hidden><i /><i /><i /><i /></div>
      <span>{label}…</span>
    </div>
  )
}
