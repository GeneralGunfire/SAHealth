/**
 * "Ad" visual language, mimicking the reference spot:
 * black text cards, Google-gradient light line, deep-blue glow stage,
 * one centred glass hero object, one short caption bottom-centre.
 */
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, E, FONT, prog, springAt} from './core';

export const GRAD = 'linear-gradient(90deg, #4285F4 0%, #34A853 38%, #FBBC05 68%, #EA4335 100%)';
export const GRAD_TOP = 'linear-gradient(120deg, #2F6BFF 0%, #2FB5A0 45%, #E9D24A 100%)';

/* ------------------------------------------------------------ backgrounds */
export const Stage: React.FC<{children?: React.ReactNode; hue?: 'blue' | 'teal'}> = ({children}) => (
  <AbsoluteFill style={{background: '#05070C'}}>{children}</AbsoluteFill>
);

/* ------------------------------------------------------------ text */
/** Words blur-in one after another (reference style). */
export const BlurWords: React.FC<{text: string; at?: number; size?: number; color?: string; weight?: number; stagger?: number}> = ({text, at = 0, size = 44, color = '#F2F5FF', weight = 400, stagger = 5}) => {
  const f = useCurrentFrame();
  return (
    <span style={{fontFamily: FONT.body, fontWeight: weight, fontSize: size, color, letterSpacing: '-0.005em', whiteSpace: 'nowrap'}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, at + i * stagger, 18, E.out);
        return <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: p, filter: `blur(${(1 - p) * 10}px)`, transform: `translateX(${(1 - p) * -6}px)`}}>{w}</span>;
      })}
    </span>
  );
};

/** Full black card with one short centred line. */
export const BlackCard: React.FC<{text: string; size?: number; y?: number}> = ({text, size = 48, y = 0}) => (
  <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{transform: `translateY(${y}px)`}}><BlurWords text={text} at={2} size={size} /></div>
  </AbsoluteFill>
);

/** Caption under the hero, with the thin indicator line. */
export const HeroCaption: React.FC<{text: string; at?: number}> = ({text, at = 6}) => {
  const f = useCurrentFrame();
  const l = prog(f, at + 10, 30, E.out);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 810, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <BlurWords text={text} at={at} size={40} />
      <div style={{marginTop: 14, width: 64 * l, height: 2, borderRadius: 2, background: 'rgba(160,190,255,0.55)'}} />
    </div>
  );
};

/* ------------------------------------------------------------ light line */
export const LightLine: React.FC<{at?: number; y?: number; width?: number; ecg?: boolean}> = ({at = 0, y = 540, width = 1100, ecg}) => {
  const f = useCurrentFrame();
  const dot = prog(f, at, 14, E.out);
  const grow = prog(f, at + 14, 34, E.inOut);
  const w = width * grow;
  if (!ecg) {
    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 960 - w / 2, top: y - 1.5, width: w, height: 3, borderRadius: 3, background: GRAD, boxShadow: '0 0 24px rgba(66,133,244,0.8)', opacity: grow > 0 ? 1 : 0}} />
        <div style={{position: 'absolute', left: 960 + w / 2 - 6, top: y - 6, width: 12, height: 12, borderRadius: 6, background: '#DDE7FF', boxShadow: '0 0 22px 6px rgba(120,170,255,0.9)', opacity: dot * (1 - prog(f, at + 50, 16))}} />
        <div style={{position: 'absolute', left: 960 - 500, top: y - 180, width: 1000, height: 360, background: 'radial-gradient(closest-side, rgba(66,133,244,0.28), transparent)', opacity: grow}} />
      </AbsoluteFill>
    );
  }
  // heartbeat drawn in the gradient
  const period = 360;
  const fy = (x: number) => {
    const ph = (((x + f * 6) % period) + period) % period / period;
    if (ph > 0.46 && ph < 0.49) return 30 * ((ph - 0.46) / 0.03);
    if (ph >= 0.49 && ph < 0.52) return 30 - 190 * ((ph - 0.49) / 0.03);
    if (ph >= 0.52 && ph < 0.55) return -160 + 190 * ((ph - 0.52) / 0.03);
    if (ph >= 0.55 && ph < 0.57) return 30 - 30 * ((ph - 0.55) / 0.02);
    if (ph > 0.64 && ph < 0.74) return -22 * Math.sin(((ph - 0.64) / 0.10) * Math.PI);
    return 0;
  };
  const x0 = 960 - width / 2;
  let d = '';
  for (let x = 0; x <= w; x += 3) d += `${x ? 'L' : 'M'}${x0 + x} ${y + fy(x)}`;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="gl" x1={x0} x2={x0 + width} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4285F4" /><stop offset="0.38" stopColor="#34A853" /><stop offset="0.68" stopColor="#FBBC05" /><stop offset="1" stopColor="#EA4335" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#gl)" strokeWidth={3} strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 10px rgba(66,133,244,0.8))'}} />
      </svg>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ glass */
export const Glass: React.FC<{w: number; h: number; children?: React.ReactNode; radius?: number; style?: React.CSSProperties; strong?: boolean}> = ({w, h, children, radius = 22, style, strong}) => (
  <div style={{width: w, height: h, borderRadius: radius, position: 'relative', overflow: 'hidden',
    background: strong ? 'linear-gradient(160deg, rgba(38,70,160,0.75), rgba(10,22,70,0.85))' : 'linear-gradient(160deg, rgba(40,72,170,0.42), rgba(10,22,70,0.6))',
    border: '1.5px solid rgba(120,160,255,0.5)', boxShadow: '0 30px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.14)', ...style}}>
    {children}
  </div>
);

/** Hero wrapper: pops in with a spring, then floats with a slow 3D sway. */
export const Hero: React.FC<{children: React.ReactNode; y?: number; tilt?: number}> = ({children, y = 450, tilt = 14}) => {
  const f = useCurrentFrame();
  const s = springAt(f, 0, {damping: 18, stiffness: 90});
  const ry = Math.sin(f / 70) * 6 - 8, rx = tilt + Math.cos(f / 90) * 3;
  return (
    <AbsoluteFill style={{perspective: 1800}}>
      <div style={{position: 'absolute', left: 960, top: y, transform: `translate(-50%, -50%) rotateX(${rx}deg) rotateY(${ry}deg) scale(${0.86 + 0.14 * Math.min(1, s)})`, opacity: Math.min(1, s * 1.4), transformStyle: 'preserve-3d'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Green-dot status chip (the "Security / Compliance" chips). */
export const Chip: React.FC<{text: string; at: number; tone?: 'green' | 'amber' | 'blue' | 'red'}> = ({text, at, tone = 'green'}) => {
  const f = useCurrentFrame();
  const s = springAt(f, at, {damping: 14, stiffness: 160});
  const col = {green: '#34D27B', amber: '#FBBC05', blue: '#6FA3FF', red: '#EA4335'}[tone];
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 18px 9px 12px', borderRadius: 999, background: 'rgba(12,40,40,0.75)', border: `1.5px solid ${col}88`,
      fontFamily: FONT.body, fontSize: 22, fontWeight: 500, color: '#E8FFF2', transform: `scale(${Math.max(0, s)})`, opacity: Math.min(1, s * 2), whiteSpace: 'nowrap'}}>
      <span style={{width: 20, height: 20, borderRadius: 10, background: col, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#04210F', fontSize: 14, fontWeight: 700}}>✓</span>
      {text}
    </div>
  );
};

/** Isometric stack of glass layers with a gradient top (the "full-stack" object). */
export const IsoStack: React.FC<{labels: string[]; at?: number}> = ({labels, at = 0}) => {
  const f = useCurrentFrame();
  const n = labels.length;
  return (
    <div style={{position: 'relative', width: 700, height: 560}}>
      {labels.map((l, i) => {
        const k = n - 1 - i; // top layer first in array
        const s = springAt(f, at + k * 5, {damping: 16, stiffness: 110});
        const y = 330 - k * 74 - (1 - s) * 60 + Math.sin(f / 40 + k) * 3;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: 90, top: y, width: 380, height: 380, transform: 'rotateX(60deg) rotateZ(-45deg)', transformOrigin: '50% 50%', borderRadius: 34,
              background: k === n - 1 ? GRAD_TOP : 'linear-gradient(160deg, rgba(70,110,230,0.8), rgba(30,60,170,0.85))', border: '2px solid rgba(160,195,255,0.7)',
              boxShadow: '0 30px 60px rgba(0,0,20,0.5)', opacity: Math.min(1, s * 1.5)}} />
            <div style={{position: 'absolute', left: 560, top: y + 170, fontFamily: FONT.body, fontSize: 22, color: 'rgba(220,232,255,0.85)', opacity: prog(f, at + 20 + k * 5, 20), whiteSpace: 'nowrap'}}>{l}</div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/** A small bar inside glass panels (placeholder UI line). */
export const UiLine: React.FC<{w: number; grad?: boolean; at?: number; h?: number}> = ({w, grad, at = 0, h = 12}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out});
  return <div style={{width: w * p, height: h, borderRadius: h, background: grad ? GRAD_TOP : 'rgba(160,190,255,0.35)', margin: '10px 0'}} />;
};

export {C};
