import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {F, GROUND, Ground, K} from './theme';

export const EO = Easing.bezier(0.16, 1, 0.3, 1); // expo-out
export const EIO = Easing.bezier(0.65, 0, 0.35, 1);

export const p01 = (f: number, at: number, dur = 20, ease = EO) =>
  interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const useGround = (g: Ground = 'paper') => GROUND[g];

/* ------------------------------------------------------------ grain + vignette (always on top) */
export const Grain: React.FC<{strength?: number}> = ({strength = 0.07}) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 6; // subtle film-like flicker
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: strength, mixBlendMode: 'overlay'}}>
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1920} height={1080} filter={`url(#g${seed})`} />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 48%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.09) 100%)'}} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ masked text line */
export const MaskLine: React.FC<{children: React.ReactNode; at: number; style?: React.CSSProperties; dur?: number}> = ({children, at, style, dur = 22}) => {
  const f = useCurrentFrame();
  const p = p01(f, at, dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
      <div style={{transform: `translateY(${(1 - p) * 105}%)`, ...style}}>{children}</div>
    </div>
  );
};

/** Highlighter swipe behind a word/phrase. */
export const Mark: React.FC<{children: React.ReactNode; at: number; color?: string; ink?: string}> = ({children, at, color = K.yellow, ink}) => {
  const f = useCurrentFrame();
  const p = p01(f, at, 16);
  // background swipe that follows each wrapped line (box-decoration-break: clone)
  return (
    <span style={{
      backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: 'no-repeat',
      backgroundSize: `${p * 100}% 84%`, backgroundPosition: '0 70%',
      WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone', padding: '0 0.06em', margin: '0 -0.06em',
      color: p > 0.5 && ink ? ink : undefined,
    }}>{children}</span>
  );
};

/** Renders "text with *highlight* words" — asterisks mark highlighted spans. */
export const RichText: React.FC<{text: string; hlAt: number; hlColor?: string; hlInk?: string}> = ({text, hlAt, hlColor, hlInk}) => {
  const parts = text.split('*');
  return (
    <>
      {parts.map((s, i) => (i % 2 ? <Mark key={i} at={hlAt} color={hlColor} ink={hlInk}>{s}</Mark> : <React.Fragment key={i}>{s}</React.Fragment>))}
    </>
  );
};

/* ------------------------------------------------------------ small caps kicker */
export const Kicker: React.FC<{text: string; at: number; color: string; style?: React.CSSProperties}> = ({text, at, color, style}) => {
  const f = useCurrentFrame();
  const p = p01(f, at, 18);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 18, fontFamily: F.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.2em', textTransform: 'uppercase', color, opacity: p, ...style}}>
      <span style={{display: 'inline-block', width: 48 * p, height: 3, background: color}} />
      {text}
    </div>
  );
};

/* ------------------------------------------------------------ source line */
export const SourceLine: React.FC<{text?: string; color: string; at?: number}> = ({text, color, at = 10}) => {
  const f = useCurrentFrame();
  if (!text) return null;
  return (
    <div style={{position: 'absolute', left: 120, bottom: 64, fontFamily: F.body, fontSize: 18, fontWeight: 500, letterSpacing: '0.03em', color, opacity: p01(f, at, 20) * 0.85}}>
      <span style={{fontWeight: 700, letterSpacing: '0.16em', marginRight: 10}}>SOURCE</span>{text}
    </div>
  );
};

/* ------------------------------------------------------------ line icons (24 grid) */
const ICONS: Record<string, string[]> = {
  person: ['M12 3.5a3.5 3.5 0 1 0 .01 0', 'M5 21c0-4 3.1-7 7-7s7 3 7 7'],
  doctor: ['M12 3.5a3.5 3.5 0 1 0 .01 0', 'M5 21c0-4 3.1-7 7-7s7 3 7 7', 'M15 17.5h3.5M16.75 15.75v3.5'],
  clinic: ['M3 21V9.5l9-5.5 9 5.5V21', 'M1.5 21h21', 'M12 10v6M9 13h6'],
  hospital: ['M4 21V4h16v17', 'M2 21h20', 'M12 6.5v5M9.5 9h5', 'M10.5 21v-3.5h3V21'],
  folder: ['M2.5 5.5h6.5l2 2.2h10.5v12H2.5z'],
  doc: ['M6 2.5h9l4 4v15H6z', 'M15 2.5v4h4', 'M9 11h7M9 14h7M9 17h4.5'],
  flask: ['M9 3h6', 'M10 3v6.5l-5.3 8.8A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.7-2.7L14 9.5V3', 'M7.2 15h9.6'],
  printer: ['M7 9V3h10v6', 'M4 9h16v8H4z', 'M7 14h10v7H7z'],
  pill: ['M4.9 13.1l8.2-8.2a4 4 0 0 1 5.7 5.7l-8.2 8.2a4 4 0 0 1-5.7-5.7z', 'M9 9l6 6'],
  box: ['M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5z', 'M3 7.5l9 4.5 9-4.5', 'M12 12v9'],
  ambulance: ['M1.5 17V6.5h12V17', 'M13.5 10h4.5l4 4.2V17h-8.5', 'M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M15 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M7.5 8.5v5M5 11h5'],
  drop: ['M12 3s6.5 7.2 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.2 12 3 12 3z'],
  image: ['M3 4h18v16H3z', 'M3 16l5-5 4 4 3-3 6 6'],
  phone: ['M5 3h3.5l2 5-2.5 1.5a11 11 0 0 0 6.5 6.5L16 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z'],
  mail: ['M3 5h18v14H3z', 'M3 6l9 7 9-7'],
  laptop: ['M5 5h14v10H5z', 'M2 19h20l-2-4H4z'],
  card: ['M2.5 5.5h19v13h-19z', 'M7 9.2a1.8 1.8 0 1 0 .01 0', 'M13 10h6M13 13.5h4'],
  db: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z', 'M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6', 'M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'],
  tablet: ['M5.5 2.5h13v19h-13z', 'M11 18.5h2'],
  swap: ['M3 8h15l-3.5-3.5', 'M21 16H6l3.5 3.5'],
  building: ['M4 21V3h10v18', 'M14 8h6v13', 'M2 21h20'],
  law: ['M12 3v17', 'M6 21h12', 'M4 7h16', 'M6 7l-3 6.5a3 3 0 0 0 6 0z', 'M18 7l-3 6.5a3 3 0 0 0 6 0z'],
  chart: ['M4 20V11M10 20V5M16 20v-6M2 20h20'],
  search: ['M10.5 4a6.5 6.5 0 1 0 .01 0', 'M15.5 15.5L21 21'],
  keyboard: ['M2.5 7h19v10h-19z', 'M5.5 10h1M8.5 10h1M11.5 10h1M14.5 10h1M17.5 10h1M7 14h10'],
  book: ['M4 4.5h7a2 2 0 0 1 2 2V21a2 2 0 0 0-2-2H4z', 'M20 4.5h-7a2 2 0 0 0-2 2', 'M20 4.5V19h-7a2 2 0 0 0-2 2'],
  globe: ['M12 3a9 9 0 1 0 .01 0', 'M3 12h18', 'M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  alert: ['M12 3l10 18H2z', 'M12 10v5M12 18v.5'],
  heart: ['M12 20s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 5.8-8 11-8 11z'],
  pen: ['M4 20l4-1 11-11-3-3L5 16z', 'M14 6l3 3'],
  x: ['M6 6l12 12M18 6L6 18'],
  check: ['M4.5 12.5l5 5 10-11'],
  fax: ['M6 9V3h9l3 3v3', 'M3 9h18v9H3z', 'M7 18v3h10v-3', 'M7 13h4'],
};
export type IconName = keyof typeof ICONS;

export const LineIcon: React.FC<{name: IconName; size?: number; color: string; at?: number; stroke?: number; dur?: number}> = ({name, size = 120, color, at = 0, stroke = 1.3, dur = 30}) => {
  const f = useCurrentFrame();
  const paths = ICONS[name];
  const p = p01(f, at, dur, EIO);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible'}}>
      {paths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1}
          strokeDashoffset={1 - Math.max(0, Math.min(1, p * paths.length - i))} />
      ))}
    </svg>
  );
};

export const fmtN = (n: number, dec = 0) => {
  const s = n.toFixed(dec);
  const [a, b] = s.split('.');
  return a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (b ? '.' + b : '');
};
