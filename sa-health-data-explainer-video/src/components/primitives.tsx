import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {getLength, getPointAtLength as gp} from '@remotion/paths';
const getPointAtLength = (d: string, l: number) => gp(d, l) ?? {x: 0, y: 0};
import {C, FONT, W, H} from '../theme';
import {ein, eout, fmt, keys, win} from '../lib/anim';
import {Icon, IconName} from './Icon';

/* ------------------------------------------------------------------ Stage */

export const Background: React.FC<{dark?: number}> = ({dark = 0}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: C.paper}} />
    <AbsoluteFill style={{background: C.night, opacity: dark}} />
    {/* paper grain */}
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity: 0.09 + dark * 0.05, mixBlendMode: dark > 0.5 ? 'screen' : 'multiply'}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(40,30,10,0.13) 100%)'}} />
  </AbsoluteFill>
);

/** Camera: keyframed scale / pan (in px of the 1920x1080 stage). */
export const Camera: React.FC<{
  s?: [number, number][];
  x?: [number, number][];
  y?: [number, number][];
  children: React.ReactNode;
}> = ({s = [[0, 1]], x = [[0, 0]], y = [[0, 0]], children}) => {
  const f = useCurrentFrame();
  const sc = keys(f, s);
  return (
    <AbsoluteFill style={{transform: `translate(${keys(f, x)}px, ${keys(f, y)}px) scale(${sc})`, transformOrigin: '50% 50%'}}>
      {children}
    </AbsoluteFill>
  );
};

/** Wraps a scene: fades in/out at its edges. */
export const SceneFade: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(ein(f, 0, 10), eout(f, frames - 10, 10));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** A slow constant push-in, the default "breathing" camera. */
export const Drift: React.FC<{frames: number; amount?: number; children: React.ReactNode}> = ({frames, amount = 0.035, children}) => (
  <Camera s={[[0, 1], [frames, 1 + amount]]}>{children}</Camera>
);

/* ------------------------------------------------------------------ Text */

type KineticProps = {
  text: string;
  at: number;
  x: number;
  y: number;
  size?: number;
  weight?: number;
  color?: string;
  font?: string;
  width?: number;
  align?: 'left' | 'center' | 'right';
  stagger?: number;
  hl?: string[]; // words to highlight with the marker
  hlColor?: string;
  hlAt?: number;
  exit?: number;
  lineHeight?: number;
  tracking?: number;
  upper?: boolean;
};

/** Word-by-word typographic reveal with optional highlighter strokes. */
export const Kinetic: React.FC<KineticProps> = ({
  text, at, x, y, size = 64, weight = 700, color = C.ink, font = FONT.display, width = 1400,
  align = 'left', stagger = 2.5, hl = [], hlColor = C.marker, hlAt, exit, lineHeight = 1.08, tracking = -0.02, upper,
}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  const out = exit === undefined ? 1 : eout(f, exit, 12);
  const left = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  return (
    <div style={{position: 'absolute', left, top: y, width, textAlign: align, fontFamily: font, fontWeight: weight, fontSize: size, lineHeight, letterSpacing: `${tracking}em`, color, opacity: out, textTransform: upper ? 'uppercase' : undefined}}>
      {words.map((w, i) => {
        const p = ein(f, at + i * stagger, 16);
        const clean = w.replace(/[^\w%'’-]/g, '');
        const isHl = hl.includes(clean);
        const hp = ein(f, (hlAt ?? at + i * stagger + 8), 14);
        return (
          <span key={i} style={{display: 'inline-block', position: 'relative', marginRight: '0.26em', opacity: p, transform: `translateY(${(1 - p) * 0.45}em)`, filter: `blur(${(1 - p) * 6}px)`}}>
            {isHl && (
              <span style={{position: 'absolute', left: '-0.08em', right: '-0.08em', top: '0.16em', bottom: '0.02em', background: hlColor, transformOrigin: 'left center', transform: `scaleX(${hp}) skewX(-6deg)`, zIndex: -1, borderRadius: 3}} />
            )}
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Small uppercase label. */
export const Label: React.FC<{text: string; at: number; x: number; y: number; color?: string; size?: number; align?: 'left' | 'center'; exit?: number; width?: number; weight?: number}> = ({
  text, at, x, y, color = C.muted, size = 20, align = 'left', exit, width = 800, weight = 600,
}) => {
  const f = useCurrentFrame();
  const o = win(f, at, exit);
  return (
    <div style={{position: 'absolute', left: align === 'center' ? x - width / 2 : x, top: y, width, textAlign: align, fontFamily: FONT.body, fontWeight: weight, fontSize: size, letterSpacing: '0.12em', textTransform: 'uppercase', color, opacity: o, transform: `translateY(${(1 - ein(f, at, 16)) * 10}px)`}}>
      {text}
    </div>
  );
};

/** Plain text block that fades/rises in. */
export const Text: React.FC<{children: React.ReactNode; at: number; x: number; y: number; size?: number; color?: string; width?: number; weight?: number; font?: string; align?: 'left' | 'center' | 'right'; exit?: number; lh?: number}> = ({
  children, at, x, y, size = 30, color = C.ink2, width = 700, weight = 500, font = FONT.body, align = 'left', exit, lh = 1.3,
}) => {
  const f = useCurrentFrame();
  const left = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  return (
    <div style={{position: 'absolute', left, top: y, width, textAlign: align, fontFamily: font, fontSize: size, fontWeight: weight, lineHeight: lh, color, opacity: win(f, at, exit), transform: `translateY(${(1 - ein(f, at, 18)) * 16}px)`}}>
      {children}
    </div>
  );
};

export const Counter: React.FC<{
  value: number; at: number; x: number; y: number; dur?: number; size?: number; color?: string; prefix?: string; suffix?: string;
  format?: (n: number) => string; align?: 'left' | 'center' | 'right'; width?: number; exit?: number; from?: number;
}> = ({value, at, x, y, dur = 36, size = 120, color = C.ink, prefix = '', suffix = '', format = fmt, align = 'left', width = 900, exit, from = 0}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, dur);
  const left = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  return (
    <div style={{position: 'absolute', left, top: y, width, textAlign: align, fontFamily: FONT.display, fontWeight: 800, fontSize: size, letterSpacing: '-0.035em', color, lineHeight: 1, opacity: win(f, at, exit, 8)}}>
      {prefix}{format(from + (value - from) * p)}{suffix}
    </div>
  );
};

/** Source line, bottom-left, Vox-style. */
export const Source: React.FC<{text: string; at?: number; exit?: number; dark?: boolean}> = ({text, at = 0, exit, dark}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 96, bottom: 44, fontFamily: FONT.body, fontSize: 17, fontWeight: 500, letterSpacing: '0.04em', color: dark ? C.nightMuted : C.muted, opacity: win(f, at + 6, exit) * 0.95}}>
      <span style={{fontWeight: 700, letterSpacing: '0.14em'}}>SOURCE </span>{text}
    </div>
  );
};

/* ------------------------------------------------------------------ Diagram */

export type CardProps = {
  x: number; y: number; w?: number; at: number; exit?: number;
  color?: string; kicker?: string; title: string; sub?: string; icon?: IconName;
  dim?: number; dark?: boolean; titleSize?: number; center?: boolean; h?: number;
};

/** System node. x/y is the top-left corner. */
export const Card: React.FC<CardProps> = ({x, y, w = 360, at, exit, color = C.ink, kicker, title, sub, icon, dim = 0, dark, titleSize = 30, center, h}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 20);
  const o = win(f, at, exit, 12);
  const bar = ein(f, at + 6, 22);
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: w, minHeight: h, boxSizing: 'border-box', padding: '22px 26px 24px',
      background: dark ? C.nightCard : C.card, border: `1.5px solid ${dark ? C.nightRule : C.rule}`, borderRadius: 14,
      boxShadow: dark ? '0 10px 30px rgba(0,0,0,0.35)' : '0 10px 28px rgba(60,45,20,0.10), 0 2px 6px rgba(60,45,20,0.06)',
      opacity: o * (1 - dim * 0.6), transform: `translateY(${(1 - p) * 28}px) scale(${0.965 + 0.035 * p})`,
      filter: `grayscale(${dim})`, overflow: 'hidden', textAlign: center ? 'center' : 'left',
    }}>
      <div style={{position: 'absolute', left: 0, top: 0, height: 6, width: `${bar * 100}%`, background: color}} />
      <div style={{display: 'flex', gap: 16, alignItems: 'center', justifyContent: center ? 'center' : 'flex-start'}}>
        {icon && <Icon name={icon} size={46} color={color} stroke={1.7} draw={ein(f, at + 4, 26)} />}
        <div>
          {kicker && <div style={{fontFamily: FONT.body, fontSize: 16, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color}}>{kicker}</div>}
          <div style={{fontFamily: FONT.display, fontSize: titleSize, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.1, color: dark ? C.nightInk : C.ink, marginTop: kicker ? 4 : 0}}>{title}</div>
        </div>
      </div>
      {sub && <div style={{fontFamily: FONT.body, fontSize: 21, fontWeight: 500, lineHeight: 1.35, color: dark ? C.nightMuted : C.ink2, marginTop: 12}}>{sub}</div>}
    </div>
  );
};

export const Chip: React.FC<{text: string; at: number; x: number; y: number; color?: string; fill?: string; exit?: number; size?: number; icon?: IconName; mono?: boolean}> = ({
  text, at, x, y, color = C.ink, fill, exit, size = 20, icon, mono,
}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 16);
  return (
    <div style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 999, background: fill ?? 'transparent', border: `1.5px solid ${color}`, color, fontFamily: mono ? FONT.mono : FONT.body, fontWeight: 600, fontSize: size, whiteSpace: 'nowrap', opacity: win(f, at, exit), transform: `scale(${0.9 + 0.1 * p})`, transformOrigin: 'left center'}}>
      {icon && <Icon name={icon} size={size * 1.15} color={color} stroke={2} />}
      {text}
    </div>
  );
};

/** Floating icon badge (circle). x/y = centre. */
export const Badge: React.FC<{icon: IconName; at: number; x: number; y: number; size?: number; color?: string; fill?: string; exit?: number; label?: string; labelColor?: string; ring?: boolean}> = ({
  icon, at, x, y, size = 110, color = C.ink, fill = C.card, exit, label, labelColor, ring = true,
}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 20);
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, opacity: win(f, at, exit, 10), transform: `scale(${0.7 + 0.3 * p})`}}>
      <div style={{width: size, height: size, borderRadius: '50%', background: fill, border: ring ? `2px solid ${color}` : undefined, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 22px rgba(60,45,20,0.12)'}}>
        <Icon name={icon} size={size * 0.52} color={color} stroke={1.7} draw={ein(f, at + 3, 24)} />
      </div>
      {label && (
        <div style={{position: 'absolute', top: size + 12, left: -110, width: size + 220, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 21, lineHeight: 1.25, color: labelColor ?? C.ink2}}>{label}</div>
      )}
    </div>
  );
};

/**
 * Connection line that draws on, with optional travelling packets.
 * Rendered as a full-stage SVG so coordinates are stage pixels.
 */
export const Wire: React.FC<{
  d: string; at: number; dur?: number; color?: string; width?: number; exit?: number;
  packets?: number; packetEvery?: number; packetColor?: string; packetSize?: number; arrow?: boolean; label?: string; labelAt?: number;
  labelOffset?: [number, number]; packetShape?: 'dot' | 'doc';
}> = ({d, at, dur = 24, color = C.ink2, width = 3, exit, packets = 0, packetEvery = 40, packetColor, packetSize = 9, arrow = true, label, labelOffset = [0, -18], packetShape = 'dot'}) => {
  const f = useCurrentFrame();
  const len = getLength(d);
  const p = ein(f, at, dur);
  const o = exit === undefined ? 1 : eout(f, exit, 12);
  const end = getPointAtLength(d, Math.max(0.01, len * p));
  const before = getPointAtLength(d, Math.max(0, len * p - 6));
  const ang = Math.atan2(end.y - before.y, end.x - before.x);
  const mid = getPointAtLength(d, len / 2);
  const dots: React.ReactNode[] = [];
  if (packets > 0 && f > at + dur) {
    const travel = Math.max(30, len / 9);
    for (let k = 0; k < packets; k++) {
      const t0 = at + dur + k * packetEvery;
      const local = ((f - t0) % (packetEvery * packets)) / travel;
      if (f < t0 || local > 1) continue;
      const pt = getPointAtLength(d, len * local);
      const fade = Math.min(1, local * 6, (1 - local) * 6);
      dots.push(packetShape === 'doc' ? (
        <rect key={k} x={pt.x - 9} y={pt.y - 12} width={18} height={24} rx={2} fill={C.card} stroke={packetColor ?? color} strokeWidth={2} opacity={fade} />
      ) : (
        <circle key={k} cx={pt.x} cy={pt.y} r={packetSize} fill={packetColor ?? color} opacity={fade} />
      ));
    }
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: o, pointerEvents: 'none'}}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {arrow && p > 0.02 && (
        <path d="M-12 -7 L0 0 L-12 7" transform={`translate(${end.x},${end.y}) rotate(${(ang * 180) / Math.PI})`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {dots}
      {label && (
        <text x={mid.x + labelOffset[0]} y={mid.y + labelOffset[1]} textAnchor="middle" fontFamily={FONT.body} fontWeight={600} fontSize={20} fill={color} opacity={ein(f, at + dur * 0.6, 14)}>
          {label}
        </text>
      )}
    </svg>
  );
};

/** Dashed line that reveals progressively (uses an SVG mask). */
export const DashWire: React.FC<{d: string; at: number; dur?: number; color?: string; width?: number; exit?: number; label?: string; labelOffset?: [number, number]; id: string; arrow?: boolean}> = ({
  d, at, dur = 26, color = C.manilaDark, width = 3, exit, label, labelOffset = [0, -18], id, arrow = true,
}) => {
  const f = useCurrentFrame();
  const len = getLength(d);
  const p = ein(f, at, dur);
  const o = exit === undefined ? 1 : eout(f, exit, 12);
  const end = getPointAtLength(d, Math.max(0.01, len * p));
  const before = getPointAtLength(d, Math.max(0, len * p - 6));
  const ang = Math.atan2(end.y - before.y, end.x - before.x);
  const mid = getPointAtLength(d, len / 2);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: o}}>
      <defs>
        <mask id={`m-${id}`} maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <path d={d} fill="none" stroke="#fff" strokeWidth={width + 8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
        </mask>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="1 11" strokeDashoffset={-f * 0.5} mask={`url(#m-${id})`} />
      {arrow && p > 0.02 && (
        <path d="M-12 -7 L0 0 L-12 7" transform={`translate(${end.x},${end.y}) rotate(${(ang * 180) / Math.PI})`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      )}
      {label && (
        <text x={mid.x + labelOffset[0]} y={mid.y + labelOffset[1]} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={26} fill={color} opacity={ein(f, at + dur * 0.6, 14)}>
          {label}
        </text>
      )}
    </svg>
  );
};

/** Section kicker, top-left, persistent across a chapter. */
export const ChapterTag: React.FC<{num: number; title: string; dark?: boolean; at?: number}> = ({num, title, dark, at = 0}) => {
  const f = useCurrentFrame();
  const o = ein(f, at, 16);
  return (
    <div style={{position: 'absolute', left: 96, top: 60, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.body, fontSize: 18, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: dark ? C.nightMuted : C.muted, opacity: o}}>
      <span style={{fontFamily: FONT.mono, fontWeight: 500, color: dark ? C.red : C.ink}}>{String(num).padStart(2, '0')}</span>
      <span style={{width: 28 * o, height: 2, background: dark ? C.nightRule : C.rule}} />
      {title}
    </div>
  );
};

/** Chapter card shown in the silent lead before a section's first line. */
export const ChapterCard: React.FC<{num: number; title: string; frames: number; dark?: boolean}> = ({num, title, frames, dark}) => {
  const f = useCurrentFrame();
  const inP = ein(f, 0, 16);
  const outP = ein(f, frames - 14, 14);
  const ink = dark ? C.nightInk : C.ink;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: 1 - outP}}>
      <div style={{position: 'relative', textAlign: 'center', transform: `translateY(${-outP * 30}px)`}}>
        <div style={{fontFamily: FONT.mono, fontSize: 30, fontWeight: 500, color: dark ? C.red : C.muted, opacity: inP, letterSpacing: '0.1em'}}>{String(num).padStart(2, '0')}</div>
        <div style={{height: 3, width: 520 * inP, background: dark ? C.red : C.ink, margin: '18px auto 22px'}} />
        <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 104, letterSpacing: '-0.035em', color: ink, clipPath: `inset(0 ${100 - inP * 100}% 0 0)`}}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Moves children from a start offset to their natural position. */
export const Fly: React.FC<{at: number; from: [number, number]; dur?: number; scaleFrom?: number; children: React.ReactNode}> = ({at, from, dur = 26, scaleFrom = 0.5, children}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, dur);
  return (
    <AbsoluteFill style={{transform: `translate(${(1 - p) * from[0]}px, ${(1 - p) * from[1]}px) scale(${scaleFrom + (1 - scaleFrom) * p})`, transformOrigin: '50% 50%', opacity: Math.min(1, p * 3)}}>
      {children}
    </AbsoluteFill>
  );
};
