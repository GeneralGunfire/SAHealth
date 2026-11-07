import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {ein, win} from '../lib/anim';
import {MAP_H, MAP_W, PROVINCES} from '../data/provinces';

/* ------------------------------------------------------------ Person */

export const Person: React.FC<{x: number; y: number; size?: number; color?: string; at?: number; exit?: number; label?: string; labelColor?: string; opacity?: number}> = ({
  x, y, size = 120, color = C.ink, at = 0, exit, label, labelColor = C.ink2, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 18);
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: win(f, at, exit, 10) * opacity, transform: `translateY(${(1 - p) * 18}px)`}}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="28" r="17" fill={color} />
        <path d="M18 98 C18 66 32 52 50 52 C68 52 82 66 82 98 Z" fill={color} />
      </svg>
      {label && (
        <div style={{position: 'absolute', top: size + 8, left: -150, width: size + 300, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 22, color: labelColor}}>{label}</div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------ Paper folder */

export type Hand = {text: string; at: number; color?: string; size?: number};

/** Manila clinic folder with a sheet; lines are "handwritten" on cue. x/y top-left. */
export const Folder: React.FC<{x: number; y: number; w?: number; at: number; exit?: number; lines?: Hand[]; title?: string; rot?: number; scale?: number; stamp?: {text: string; at: number}}> = ({
  x, y, w = 420, at, exit, lines = [], title = 'CLINIC FOLDER', rot = -2, scale = 1, stamp,
}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 22);
  const h = w * 1.22;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: win(f, at, exit, 12), transform: `translateY(${(1 - p) * 40}px) rotate(${rot * p}deg) scale(${scale})`, transformOrigin: 'top left'}}>
      {/* back cover + tab */}
      <div style={{position: 'absolute', left: 0, top: 26, width: w, height: h - 26, background: C.manila, borderRadius: 10, boxShadow: '0 16px 36px rgba(70,50,10,0.18)'}} />
      <div style={{position: 'absolute', left: 22, top: 0, width: w * 0.38, height: 40, background: C.manila, borderRadius: '10px 10px 0 0'}} />
      {/* sheet */}
      <div style={{position: 'absolute', left: 22, top: 46, width: w - 44, height: h - 70, background: '#FFFDF8', borderRadius: 4, boxShadow: '0 2px 6px rgba(0,0,0,0.08)', padding: '22px 26px', boxSizing: 'border-box',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 43px, rgba(79,95,168,0.18) 43px 45px)', backgroundPosition: '0 60px'}}>
        <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 15, letterSpacing: '0.16em', color: C.manilaDark, marginBottom: 14}}>{title}</div>
        {lines.map((l, i) => {
          const len = l.text.length;
          const q = ein(f, l.at, Math.max(10, len * 1.4), (t) => t);
          return (
            <div key={i} style={{fontFamily: FONT.hand, fontSize: l.size ?? 30, fontWeight: 400, color: l.color ?? '#233a8a', lineHeight: '44px', whiteSpace: 'nowrap', clipPath: `inset(-10px ${100 - q * 100}% -10px 0)`}}>{l.text}</div>
          );
        })}
      </div>
      {stamp && (
        <div style={{position: 'absolute', right: 26, bottom: 40, padding: '6px 14px', border: `3px solid ${C.red}`, color: C.red, fontFamily: FONT.body, fontWeight: 800, fontSize: 22, letterSpacing: '0.1em', transform: `rotate(-12deg) scale(${1.6 - 0.6 * ein(f, stamp.at, 10)})`, opacity: ein(f, stamp.at, 6), borderRadius: 4}}>
          {stamp.text}
        </div>
      )}
    </div>
  );
};

/** Single sheet of paper (letter / form). */
export const Sheet: React.FC<{x: number; y: number; w?: number; at: number; exit?: number; title: string; lines?: Hand[]; rot?: number; accent?: string; children?: React.ReactNode}> = ({
  x, y, w = 300, at, exit, title, lines = [], rot = 3, accent = C.ink, children,
}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 20);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, minHeight: w * 1.3, background: '#FFFDF8', borderRadius: 4, boxShadow: '0 12px 30px rgba(70,50,10,0.16)', padding: '20px 22px', boxSizing: 'border-box', opacity: win(f, at, exit, 10), transform: `translateY(${(1 - p) * 30}px) rotate(${rot * p}deg)`}}>
      <div style={{fontFamily: FONT.body, fontWeight: 800, fontSize: 15, letterSpacing: '0.14em', color: accent, borderBottom: `2px solid ${accent}`, paddingBottom: 8, marginBottom: 12, textTransform: 'uppercase'}}>{title}</div>
      {lines.map((l, i) => {
        const q = ein(f, l.at, Math.max(10, l.text.length * 1.3), (t) => t);
        return <div key={i} style={{fontFamily: FONT.hand, fontSize: l.size ?? 24, color: l.color ?? '#233a8a', lineHeight: 1.5, whiteSpace: 'nowrap', clipPath: `inset(-10px ${100 - q * 100}% -10px 0)`}}>{l.text}</div>;
      })}
      {!lines.length && !children && [0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{height: 8, width: `${90 - (i % 3) * 18}%`, background: C.rule, borderRadius: 4, margin: '14px 0'}} />)}
      {children}
    </div>
  );
};

/* ------------------------------------------------------------ App window */

export const Window: React.FC<{x: number; y: number; w: number; h: number; at: number; exit?: number; title: string; accent?: string; children?: React.ReactNode; dark?: boolean}> = ({
  x, y, w, h, at, exit, title, accent = C.ink, children, dark,
}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 20);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, background: dark ? C.nightCard : '#FFFFFF', borderRadius: 12, border: `1.5px solid ${dark ? C.nightRule : C.rule}`, boxShadow: '0 20px 50px rgba(40,30,10,0.16)', overflow: 'hidden', opacity: win(f, at, exit, 12), transform: `translateY(${(1 - p) * 30}px) scale(${0.97 + 0.03 * p})`}}>
      <div style={{height: 46, background: accent, display: 'flex', alignItems: 'center', padding: '0 18px', gap: 8}}>
        {[0, 1, 2].map((i) => <div key={i} style={{width: 11, height: 11, borderRadius: 6, background: 'rgba(255,255,255,0.45)'}} />)}
        <div style={{marginLeft: 14, fontFamily: FONT.body, fontWeight: 600, fontSize: 18, color: '#fff', letterSpacing: '0.02em'}}>{title}</div>
      </div>
      <div style={{position: 'relative', width: w, height: h - 46}}>{children}</div>
    </div>
  );
};

/** Form field that "types" its value. Coordinates relative to parent. */
export const Field: React.FC<{label: string; value: string; at: number; x: number; y: number; w?: number; accent?: string; mono?: boolean}> = ({label, value, at, x, y, w = 420, accent = C.ink, mono = true}) => {
  const f = useCurrentFrame();
  const n = Math.floor(Math.max(0, f - at) / 1.6);
  const shown = value.slice(0, n);
  const caret = f >= at && n <= value.length && Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, opacity: ein(f, at - 10, 10)}}>
      <div style={{fontFamily: FONT.body, fontSize: 14, fontWeight: 700, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase'}}>{label}</div>
      <div style={{marginTop: 6, height: 50, border: `1.5px solid ${f >= at && n <= value.length ? accent : C.rule}`, borderRadius: 8, display: 'flex', alignItems: 'center', padding: '0 14px', fontFamily: mono ? FONT.mono : FONT.body, fontSize: 24, color: C.ink, fontWeight: 500}}>
        {shown}
        {caret && <span style={{width: 2, height: 26, background: accent, marginLeft: 2}} />}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------ Tally register */

export const Register: React.FC<{x: number; y: number; rows?: number; cols?: number; cell?: number; at: number; dur?: number; exit?: number; collapse?: number; color?: string; headers?: string[]}> = ({
  x, y, rows = 10, cols = 8, cell = 44, at, dur = 90, exit, collapse, color = C.ink, headers,
}) => {
  const f = useCurrentFrame();
  const c = collapse === undefined ? 0 : ein(f, collapse, 26);
  const W = cols * cell, H = rows * cell;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: W, opacity: win(f, at - 12, exit)}}>
      {headers && (
        <div style={{display: 'flex', fontFamily: FONT.body, fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', color: C.muted, marginBottom: 8}}>
          {headers.map((h, i) => <div key={i} style={{width: cell, textAlign: 'center'}}>{h}</div>)}
        </div>
      )}
      <svg width={W} height={H} style={{overflow: 'visible', background: '#FFFDF8', boxShadow: '0 12px 30px rgba(70,50,10,0.14)'}}>
        {Array.from({length: rows + 1}).map((_, r) => <line key={'r' + r} x1={0} x2={W} y1={r * cell} y2={r * cell} stroke={C.rule} strokeWidth={1.2} />)}
        {Array.from({length: cols + 1}).map((_, k) => <line key={'c' + k} y1={0} y2={H} x1={k * cell} x2={k * cell} stroke={C.rule} strokeWidth={1.2} />)}
        {Array.from({length: rows * cols}).map((_, i) => {
          const r = Math.floor(i / cols), k = i % cols;
          if (random(`tick-${i}`) < 0.32) return null;
          const t = at + random(`t-${i}`) * dur;
          const q = ein(f, t, 6);
          const cx = k * cell + cell / 2, cy = r * cell + cell / 2;
          // collapse: ticks fly to the totals row below
          const ty = cy + (H + 150 - cy) * c;
          return (
            <path key={i} d={`M${cx - 9} ${ty} l6 7 l12 -15`} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} opacity={1 - c} />
          );
        })}
      </svg>
    </div>
  );
};

/* ------------------------------------------------------------ Map */

export type ProvStyle = {fill?: string; at?: number; hatch?: boolean; dim?: boolean};

export const SAMap: React.FC<{
  x: number; y: number; scale?: number; at: number; exit?: number; base?: string; stroke?: string;
  styles?: Record<string, ProvStyle>; dimAt?: number; dimExcept?: string[]; labels?: Record<string, {at: number; text?: string; dx?: number; dy?: number; color?: string}>;
  borderGlow?: {name: string; at: number; color: string};
  dark?: boolean;
}> = ({x, y, scale = 1, at, exit, base = C.paperDeep, stroke = C.ink2, styles = {}, dimAt, dimExcept = [], labels = {}, borderGlow, dark}) => {
  const f = useCurrentFrame();
  const draw = ein(f, at, 40);
  const dimP = dimAt === undefined ? 0 : ein(f, dimAt, 20);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: MAP_W * scale, height: MAP_H * scale, opacity: win(f, at, exit, 10)}}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W * scale} height={MAP_H * scale} style={{overflow: 'visible'}}>
        <defs>
          <pattern id="hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="12" height="12" fill={dark ? C.nightCard : '#E9E4DA'} />
            <line x1="0" y1="0" x2="0" y2="12" stroke={dark ? C.nightMuted : C.muted} strokeWidth="3" opacity="0.55" />
          </pattern>
        </defs>
        {PROVINCES.map((p) => {
          const st = styles[p.name] ?? {};
          const fp = st.at === undefined ? (st.fill ? 1 : 0) : ein(f, st.at, 18);
          const dim = dimP * (dimExcept.includes(p.name) ? 0 : 1);
          return (
            <g key={p.name} opacity={1 - dim * 0.72}>
              <path d={p.d} fill={base} opacity={ein(f, at + 10, 30)} />
              {st.fill && <path d={p.d} fill={st.fill} opacity={fp} />}
              {st.hatch && <path d={p.d} fill="url(#hatch)" opacity={fp} />}
              <path d={p.d} fill="none" stroke={stroke} strokeWidth={1.6 / scale} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            </g>
          );
        })}
        {borderGlow && (() => {
          const p = PROVINCES.find((q) => q.name === borderGlow.name)!;
          const g = ein(f, borderGlow.at, 30);
          return <path d={p.d} fill="none" stroke={borderGlow.color} strokeWidth={7 / scale} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g} />;
        })()}
      </svg>
      {PROVINCES.filter((p) => labels[p.name]).map((p) => {
        const l = labels[p.name];
        const q = ein(f, l.at, 14);
        return (
          <div key={p.name} style={{position: 'absolute', left: (p.cx + (l.dx ?? 0)) * scale - 150, top: (p.cy + (l.dy ?? 0)) * scale - 14, width: 300, textAlign: 'center', fontFamily: FONT.body, fontWeight: 700, fontSize: 18 , letterSpacing: '0.06em', textTransform: 'uppercase', color: l.color ?? C.ink, opacity: q, transform: `translateY(${(1 - q) * 8}px)`, lineHeight: 1.2}}>
            {l.text ?? p.name}
          </div>
        );
      })}
    </div>
  );
};

export const provinceCenter = (name: string, x: number, y: number, scale: number) => {
  const p = PROVINCES.find((q) => q.name === name)!;
  return {x: x + p.cx * scale, y: y + p.cy * scale};
};
