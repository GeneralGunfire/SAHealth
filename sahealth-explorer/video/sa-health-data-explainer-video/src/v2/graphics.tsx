import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {getLength, getPointAtLength} from '@remotion/paths';
import {C, clamp01, E, FONT, lerp, prog, springAt} from './core';
import {DOT_H, DOT_PROV, DOT_W, DOTS} from '../data/sadots';

/* ============================================================ Dot-matrix map */
export type DotStyle = {color: string; r?: number; h?: number; o?: number};
/**
 * SA as a dot matrix. `style(i, provName, x, y)` returns per-dot colour/radius/spike height.
 * `tilt` (deg) leans the map back in 3D; `reveal` animates dots in from `revealAt` in a ripple.
 */
export const DotMap: React.FC<{
  x?: number; y?: number; scale?: number; tilt?: number; spin?: number; revealAt?: number; revealFrom?: [number, number];
  style: (i: number, prov: string, x: number, y: number) => DotStyle; glow?: boolean;
}> = ({x = 0, y = 0, scale = 1, tilt = 0, spin = 0, revealAt = 0, revealFrom = [700, 250], style, glow}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x - (DOT_W * scale) / 2, top: y - (DOT_H * scale) / 2, width: DOT_W * scale, height: DOT_H * scale, perspective: 2200}}>
      <div style={{width: '100%', height: '100%', transform: `rotateX(${tilt}deg) rotateZ(${spin}deg)`, transformStyle: 'preserve-3d', transformOrigin: '50% 60%'}}>
        <svg viewBox={`0 0 ${DOT_W} ${DOT_H}`} width={DOT_W * scale} height={DOT_H * scale} style={{overflow: 'visible'}}>
          {DOTS.map(([dx, dy, pi], i) => {
            const d = Math.hypot(dx - revealFrom[0], dy - revealFrom[1]);
            const a = clamp01((f - revealAt - d / 18) / 14);
            if (a <= 0) return null;
            const st = style(i, DOT_PROV[pi], dx, dy);
            const r = (st.r ?? 3.6) * (0.4 + 0.6 * E.out(a));
            const h = st.h ?? 0;
            return (
              <g key={i} opacity={(st.o ?? 1) * a}>
                {h > 0.5 && <line x1={dx} x2={dx} y1={dy} y2={dy - h} stroke={st.color} strokeWidth={2.2} strokeLinecap="round" opacity={0.85} />}
                <circle cx={dx} cy={dy - h} r={r} fill={st.color} />
              </g>
            );
          })}
        </svg>
        {glow && <div style={{position: 'absolute', inset: '-10%', background: 'radial-gradient(closest-side, rgba(59,123,255,0.25), transparent)', pointerEvents: 'none'}} />}
      </div>
    </div>
  );
};

/* ============================================================ Particle human figure */
const FIG: [number, number][] = (() => {
  const pts: [number, number][] = [];
  const inside = (x: number, y: number) => {
    if (Math.hypot(x, y + 165) < 46) return true; // head
    if (y > -112 && y < -100 && Math.abs(x) < 20) return true; // neck
    if (y >= -100 && y < 70) { const w = lerp(88, 64, (y + 100) / 170); if (Math.abs(x) < w) return true; } // torso
    if (y >= -95 && y < 60) { const ax = Math.abs(x); if (ax > 92 && ax < 118 - (y + 95) * 0.02 && ax < 120) return true; } // arms
    if (y >= 70 && y < 290) { const ax = Math.abs(x); if (ax > 8 && ax < 58 - (y - 70) * 0.08) return true; } // legs
    return false;
  };
  let k = 0;
  for (let y = -215; y < 290; y += 8) for (let x = -130; x <= 130; x += 8) {
    const jx = x + (random('fx' + k) - 0.5) * 7, jy = y + (random('fy' + k) - 0.5) * 7; k++;
    if (inside(jx, jy)) pts.push([jx, jy]);
  }
  return pts;
})();

/**
 * Dotted human. assemble: 0 scattered → 1 formed. ghost: 0 solid → 1 translucent drifting.
 */
export const ParticleFigure: React.FC<{x: number; y: number; scale?: number; assembleAt: number; ghostAt?: number; color?: string; ghostColor?: string; seed?: string; pulseAt?: number}> = ({
  x, y, scale = 1, assembleAt, ghostAt, color = C.white, ghostColor = C.blue2, seed = 'fig', pulseAt,
}) => {
  const f = useCurrentFrame();
  const g = ghostAt === undefined ? 0 : prog(f, ghostAt, 60, E.inOut);
  return (
    <svg style={{position: 'absolute', left: x - 400 * scale, top: y - 400 * scale, overflow: 'visible'}} width={800 * scale} height={800 * scale} viewBox="-400 -400 800 800">
      {pulseAt !== undefined && [0, 1, 2].map((k) => {
        const t = ((f - pulseAt - k * 20) % 60) / 60;
        if (f < pulseAt + k * 20) return null;
        return <circle key={k} cx={0} cy={0} r={120 + t * 260} fill="none" stroke={C.blue2} strokeWidth={2} opacity={(1 - t) * 0.5} />;
      })}
      {FIG.map(([px, py], i) => {
        const r0 = random(`${seed}${i}`), r1 = random(`${seed}b${i}`);
        const a = prog(f, assembleAt + r0 * 25, 40, E.out);
        const sx = (r0 - 0.5) * 1400, sy = (r1 - 0.5) * 900;
        const wob = noise2D(seed, i * 0.13, f * 0.01) * 6;
        const drift = g * (noise2D(seed + 'g', i * 0.07, f * 0.004) * 60);
        const cx = lerp(sx, px, a) + wob + drift, cy = lerp(sy, py, a) - g * r0 * 40;
        const col = g > 0.5 ? ghostColor : color;
        const rr = (1.3 + r1 * 2.4) * (0.6 + 0.4 * a);
        const tw = 0.7 + 0.3 * Math.sin(f / 11 + i);
        return <circle key={i} cx={cx} cy={cy} r={rr} fill={col} opacity={(0.2 + 0.8 * a) * (1 - g * 0.55 * r1) * tw} />;
      })}
    </svg>
  );
};

/* ============================================================ Data stream along a path */
export const Stream: React.FC<{d: string; at: number; color?: string; count?: number; speed?: number; width?: number; showPath?: boolean; endAt?: number; size?: number}> = ({
  d, at, color = C.blue2, count = 14, speed = 70, width = 2, showPath = true, endAt, size = 5,
}) => {
  const f = useCurrentFrame();
  const len = getLength(d);
  const draw = prog(f, at, 30, E.inOut);
  const fade = endAt === undefined ? 1 : 1 - prog(f, endAt, 20);
  if (f < at) return null;
  return (
    <svg width={4000} height={4000} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: fade}}>
      {showPath && <path d={d} fill="none" stroke={color} strokeOpacity={0.28} strokeWidth={width} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />}
      {Array.from({length: count}).map((_, k) => {
        const t = (((f - at) / speed + k / count) % 1 + 1) % 1;
        if (t > draw) return null;
        const p = getPointAtLength(d, t * len) ?? {x: 0, y: 0};
        const tail = getPointAtLength(d, Math.max(0, t * len - 26)) ?? p;
        const edge = Math.min(1, t * 8, (1 - t) * 8);
        return (
          <g key={k} opacity={edge}>
            <line x1={tail.x} y1={tail.y} x2={p.x} y2={p.y} stroke={color} strokeWidth={size * 0.9} strokeLinecap="round" opacity={0.35} />
            <circle cx={p.x} cy={p.y} r={size} fill={color} />
            <circle cx={p.x} cy={p.y} r={size * 2.6} fill={color} opacity={0.18} />
          </g>
        );
      })}
    </svg>
  );
};

/* ============================================================ Glass card */
export const Glass: React.FC<{w: number; h: number; at: number; children?: React.ReactNode; dark?: boolean; radius?: number; exitAt?: number; style?: React.CSSProperties}> = ({w, h, at, children, dark = true, radius = 28, exitAt, style}) => {
  const f = useCurrentFrame();
  const s = springAt(f, at, {damping: 18, stiffness: 110});
  const o = exitAt === undefined ? 1 : 1 - prog(f, exitAt, 14);
  return (
    <div style={{width: w, height: h, borderRadius: radius, position: 'relative', overflow: 'hidden',
      background: dark ? 'linear-gradient(160deg, rgba(40,60,110,0.55), rgba(12,20,44,0.75))' : 'linear-gradient(160deg, #FFFFFF, #F1F4FA)',
      border: dark ? '1px solid rgba(160,190,255,0.22)' : '1px solid rgba(20,30,60,0.08)',
      boxShadow: dark ? '0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)' : '0 2px 4px rgba(20,30,60,0.06), 0 30px 70px rgba(20,30,60,0.16)',
      transform: `translateY(${(1 - s) * 60}px) scale(${0.92 + 0.08 * Math.min(1.02, s)})`, opacity: Math.min(1, s * 1.5) * o, ...style}}>
      {children}
    </div>
  );
};

/* ============================================================ Patient monitor (cold open) */
export const Monitor: React.FC<{at: number; flat?: number; bpm?: number}> = ({at, bpm = 118}) => {
  const f = useCurrentFrame();
  const W = 1100, H = 620;
  const period = 330; // px between beats (reads as a heartbeat, not noise)
  const trace = (x: number) => {
    const ph = ((x + f * 7) % period) / period;
    if (ph > 0.40 && ph < 0.45) return -18 * Math.sin(((ph - 0.40) / 0.05) * Math.PI);
    if (ph > 0.48 && ph < 0.50) return 30 * ((ph - 0.48) / 0.02);
    if (ph >= 0.50 && ph < 0.53) return 30 - 230 * ((ph - 0.50) / 0.03);
    if (ph >= 0.53 && ph < 0.56) return -200 + 250 * ((ph - 0.53) / 0.03);
    if (ph >= 0.56 && ph < 0.58) return 50 - 50 * ((ph - 0.56) / 0.02);
    if (ph > 0.64 && ph < 0.74) return -30 * Math.sin(((ph - 0.64) / 0.10) * Math.PI);
    return 0;
  };
  const cursor = (f * 7) % W;
  let d = '';
  for (let x = 0; x <= W - 80; x += 3) d += `${x ? 'L' : 'M'}${x} ${230 + trace(x)}`;
  const s = springAt(f, at, {damping: 20, stiffness: 80});
  const hr = bpm + Math.round(Math.sin(f / 9) * 3);
  const spo2 = 91 + Math.round((Math.sin(f / 23) + 1) * 1.2);
  return (
    <div style={{width: W, height: H, borderRadius: 34, background: 'linear-gradient(180deg, #0D1424, #05080F)', border: '2px solid #1E2940',
      boxShadow: '0 60px 140px rgba(0,0,0,0.7), 0 0 120px rgba(57,217,138,0.08), inset 0 1px 0 rgba(255,255,255,0.06)', padding: 34, boxSizing: 'border-box',
      transform: `scale(${0.9 + 0.1 * s})`, opacity: Math.min(1, s * 1.4), position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 34, top: 26, fontFamily: FONT.mono, fontSize: 20, color: '#4E5B78', letterSpacing: '0.12em'}}>ECG · II · 25 mm/s</div>
      <svg width={W - 68} height={420} style={{position: 'absolute', left: 34, top: 70}}>
        {Array.from({length: 22}).map((_, i) => <line key={i} x1={i * 48} x2={i * 48} y1={0} y2={420} stroke="#10301F" strokeWidth={1} />)}
        {Array.from({length: 9}).map((_, i) => <line key={i} y1={i * 48} y2={i * 48} x1={0} x2={W} stroke="#10301F" strokeWidth={1} />)}
        <path d={d} fill="none" stroke={C.green} strokeWidth={4} strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 8px rgba(57,217,138,0.7))'}} />
        <rect x={cursor - 4} y={0} width={60} height={420} fill="#05080F" />
      </svg>
      <div style={{position: 'absolute', right: 40, top: 60, textAlign: 'right'}}>
        <div style={{fontFamily: FONT.mono, fontSize: 20, color: '#2F9E68'}}>HR</div>
        <div style={{fontFamily: FONT.head, fontWeight: 700, fontSize: 110, color: C.green, lineHeight: 1}}>{hr}</div>
      </div>
      <div style={{position: 'absolute', right: 40, bottom: 40, textAlign: 'right'}}>
        <div style={{fontFamily: FONT.mono, fontSize: 20, color: '#2E7CB8'}}>SpO₂ %</div>
        <div style={{fontFamily: FONT.head, fontWeight: 700, fontSize: 80, color: '#5DB8FF', lineHeight: 1}}>{spo2}</div>
      </div>
      <div style={{position: 'absolute', left: 34, bottom: 40, fontFamily: FONT.mono, fontSize: 22, color: C.red, opacity: Math.floor(f / 15) % 2 ? 1 : 0.35}}>● ALARM · TACHYCARDIA</div>
    </div>
  );
};

/** Pulsing location ping. */
export const Ping: React.FC<{x: number; y: number; at: number; color?: string; size?: number}> = ({x, y, at, color = C.blue2, size = 14}) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const s = springAt(f, at, {damping: 12, stiffness: 160});
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      {[0, 1].map((k) => {
        const t = (((f - at) / 50 + k * 0.5) % 1);
        return <div key={k} style={{position: 'absolute', left: -size * 3 * t - size / 2, top: -size * 3 * t - size / 2, width: size + size * 6 * t, height: size + size * 6 * t, borderRadius: '50%', border: `2px solid ${color}`, opacity: 1 - t}} />;
      })}
      <div style={{position: 'absolute', left: -size / 2, top: -size / 2, width: size, height: size, borderRadius: '50%', background: color, transform: `scale(${s})`, boxShadow: `0 0 20px ${color}`}} />
    </div>
  );
};
