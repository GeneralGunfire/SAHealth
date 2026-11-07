import type { IconName } from '../types'

const PATHS: Record<IconName, JSX.Element> = {
  db: (<><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>),
  person: (<><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3-6 7-6s7 2 7 6" /></>),
  registry: (<><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4v2h6V4M8.5 13l2.3 2.3 4.7-4.8" /></>),
  paper: (<><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>),
  flask: (<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /><path d="M8 15h8" /></>),
  pill: (<><rect x="3" y="8.5" width="18" height="7.5" rx="3.75" transform="rotate(-40 12 12.25)" /><path d="M9.3 8.8l5.4 6.9" /></>),
  cross: (<><circle cx="12" cy="12" r="9" /><path d="M12 7v10M7 12h10" /></>),
  drop: (<path d="M12 3c3.5 4.5 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 2.5-6.5 6-11z" />),
  receipt: (<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>),
  hub: (<><circle cx="12" cy="12" r="2.5" /><circle cx="5" cy="6" r="1.8" /><circle cx="19" cy="6" r="1.8" /><circle cx="5" cy="18" r="1.8" /><circle cx="19" cy="18" r="1.8" /><path d="M6.5 7l4 3.5M17.5 7l-4 3.5M6.5 17l4-3.5M17.5 17l-4-3.5" /></>),
  braces: (<path d="M9 4C6 4 7.5 8 5 12c2.5 4 1 8 4 8M15 4c3 0 1.5 4 4 8-2.5 4-1 8-4 8" />),
  image: (<><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M4 18l5-5 4 3 3-3 4 4" /></>),
  chart: (<path d="M5 20V10M12 20V4M19 20v-7" />),
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {PATHS[name]}
    </svg>
  )
}
