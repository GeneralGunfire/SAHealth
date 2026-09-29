import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {F, K} from './theme';
import {EIO, IconName, LineIcon, MaskLine, p01, RichText, SourceLine, useGround} from './kit';
import type {Base} from './templates';

/* ============================================================ ECG line (cold open) */
export const Ecg: React.FC<Base & {lines?: string[]; flatAt?: number}> = ({g, lines, flatAt}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const W = 1920, y0 = 540;
  const beat = (x: number) => {
    if (flatAt !== undefined && f > flatAt) return 0;
    const ph = (((x + f * 9) % 480) + 480) % 480 / 480;
    if (ph > 0.42 && ph < 0.46) return -30 * Math.sin(((ph - 0.42) / 0.04) * Math.PI);
    if (ph > 0.48 && ph < 0.5) return 40 * ((ph - 0.48) / 0.02);
    if (ph >= 0.5 && ph < 0.53) return 40 - 260 * ((ph - 0.5) / 0.03);
    if (ph >= 0.53 && ph < 0.56) return -220 + 280 * ((ph - 0.53) / 0.03);
    if (ph >= 0.56 && ph < 0.58) return 60 - 60 * ((ph - 0.56) / 0.02);
    if (ph > 0.66 && ph < 0.74) return -36 * Math.sin(((ph - 0.66) / 0.08) * Math.PI);
    return 0;
  };
  let d = '';
  for (let x = 0; x <= W; x += 4) d += `${x ? 'L' : 'M'}${x} ${y0 + beat(x)}`;
  const reveal = p01(f, 0, 40, EIO);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="ecgFade" x1="0" x2="1">
            <stop offset="0" stopColor={G.fg} stopOpacity="0" />
            <stop offset="0.25" stopColor={G.fg} stopOpacity="0.9" />
            <stop offset="1" stopColor={G.fg} stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d={d} fill="none" stroke="url(#ecgFade)" strokeWidth={4} strokeLinejoin="round" style={{clipPath: `inset(0 ${100 - reveal * 100}% 0 0)`}} opacity={lines ? 0.3 : 1} />
      </svg>
      {lines && (
        <AbsoluteFill style={{justifyContent: 'center', padding: '0 170px'}}>
          {lines.map((l, i) => (
            <div key={i} style={{fontFamily: F.head, fontWeight: 800, fontSize: 96, letterSpacing: '-0.022em', lineHeight: 1.05, color: G.fg}}>
              <MaskLine at={10 + i * 8}><RichText text={l} hlAt={30 + lines.length * 8} hlInk={K.ink} /></MaskLine>
            </div>
          ))}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

/* ============================================================ Two highways */
export const Highways: React.FC<Base & {noBridgeAt?: number; title?: string}> = ({g, noBridgeAt, title}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const dash = (f * 6) % 60;
  const road = (y: number, col: string, label: string, delay: number) => {
    const p = p01(f, delay, 40, EIO);
    return (
      <g>
        <rect x={0} y={y - 70} width={1920 * p} height={140} fill={col} />
        <line x1={0} x2={1920 * p} y1={y} y2={y} stroke={G.bg} strokeWidth={5} strokeDasharray="40 20" strokeDashoffset={-dash} />
        <text x={140} y={y - 95} fontFamily={F.body} fontWeight={700} fontSize={26} letterSpacing="5" fill={G.fg} opacity={p01(f, delay + 20, 16)}>{label}</text>
      </g>
    );
  };
  const nb = noBridgeAt === undefined ? 0 : p01(f, noBridgeAt, 20);
  return (
    <AbsoluteFill>
      {title && (
        <div style={{position: 'absolute', left: 140, top: 110, fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: G.fg}}>
          <MaskLine at={0}><RichText text={title} hlAt={24} hlInk={K.ink} /></MaskLine>
        </div>
      )}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {road(430, G.fg, 'PUBLIC', 0)}
        {road(770, K.blue, 'PRIVATE', 10)}
        <g opacity={nb}>
          <line x1={960} x2={960} y1={510} y2={690} stroke={K.red} strokeWidth={5} strokeDasharray="10 12" />
          <circle cx={960} cy={600} r={46} fill={G.bg} stroke={K.red} strokeWidth={5} />
          <path d="M942 582 L978 618 M978 582 L942 618" stroke={K.red} strokeWidth={6} strokeLinecap="round" />
        </g>
      </svg>
      <div style={{position: 'absolute', left: 1040, top: 572, fontFamily: F.head, fontWeight: 800, fontSize: 44, color: K.red, opacity: nb, letterSpacing: '-0.01em'}}>No bridge by default</div>
    </AbsoluteFill>
  );
};

/* ============================================================ Tally register → monthly total */
export const Tally: React.FC<Base & {collapseAt?: number; total?: string; label?: string; caption?: string}> = ({g, collapseAt, total = 'Σ', label = 'Monthly total', caption}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const cols = 12, rows = 5, cw = 90, rh = 80, x0 = 960 - (cols * cw) / 2, y0 = 320;
  const c = collapseAt === undefined ? 0 : p01(f, collapseAt, 34, EIO);
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: rows + 1}).map((_, r) => (
          <line key={r} x1={x0} x2={x0 + cols * cw} y1={y0 + r * rh} y2={y0 + r * rh} stroke={G.line} strokeWidth={2} opacity={1 - c} />
        ))}
        {Array.from({length: rows * cols}).map((_, i) => {
          if (random(`tk${i}`) < 0.25) return null;
          const at = 6 + random(`tt${i}`) * 90;
          const q = p01(f, at, 8);
          const cx = x0 + (i % cols) * cw + cw / 2, cy = y0 + Math.floor(i / cols) * rh + rh / 2;
          const x = cx + (960 - cx) * c, y = cy + (820 - cy) * c;
          return <path key={i} d={`M${x - 14} ${y} l10 11 l20 -24`} fill="none" stroke={G.fg} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - q} opacity={1 - c * 0.95} />;
        })}
      </svg>
      {collapseAt !== undefined && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 740, textAlign: 'center', opacity: p01(f, collapseAt + 26, 16)}}>
          <div style={{fontFamily: F.head, fontWeight: 900, fontSize: 130, color: g === 'paper' ? K.blue : K.yellow, lineHeight: 1}}>{total}</div>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 24, letterSpacing: '0.2em', color: G.sub, marginTop: 10, textTransform: 'uppercase'}}>{label}</div>
        </div>
      )}
      {caption && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: F.head, fontWeight: 800, fontSize: 60, letterSpacing: '-0.02em', color: G.fg}}>
          <MaskLine at={0}><RichText text={caption} hlAt={20} hlInk={K.ink} /></MaskLine>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ============================================================ SMS printer receipt */
export const Receipt: React.FC<Base & {lines: string[]; title?: string; printAt?: number}> = ({g, lines, title, printAt = 20, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const p = p01(f, printAt, 70, (t) => t);
  const jitter = p > 0 && p < 1 ? Math.sin(f * 2.2) * 1.2 : 0;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 370, top: 590 - 460 * p, width: 320, height: 460 * p, background: '#FFFEFA', boxShadow: '0 10px 30px rgba(0,0,0,0.18)', overflow: 'hidden', transform: `translateX(${jitter}px)`}}>
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, padding: '26px', fontFamily: F.mono, fontSize: 22, lineHeight: 1.7, color: '#222'}}>
          {lines.map((l, i) => <div key={i} style={{whiteSpace: 'pre'}}>{l}</div>)}
        </div>
      </div>
      <div style={{position: 'absolute', left: 300, top: 560, width: 460, height: 260, borderRadius: 26, background: g === 'paper' ? K.ink : '#2A2D33', opacity: p01(f, 0, 16), transform: `translateX(${jitter}px)`}}>
        <div style={{position: 'absolute', left: 60, top: 26, width: 340, height: 12, borderRadius: 6, background: '#000', opacity: 0.6}} />
        <div style={{position: 'absolute', right: 40, bottom: 40, width: 18, height: 18, borderRadius: 9, background: p > 0 && p < 1 ? K.yellow : '#4A4D55'}} />
        <div style={{position: 'absolute', left: 40, bottom: 34, fontFamily: F.mono, fontSize: 18, color: '#C9C5BC', letterSpacing: '0.1em'}}>SMS · GSM</div>
      </div>
      {title && (
        <div style={{position: 'absolute', left: 900, top: 0, bottom: 0, width: 860, display: 'flex', alignItems: 'center', fontFamily: F.head, fontWeight: 800, fontSize: 76, lineHeight: 1.05, letterSpacing: '-0.022em', color: G.fg}}>
          <MaskLine at={6}><RichText text={title} hlAt={30} hlInk={K.ink} /></MaskLine>
        </div>
      )}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Triptych: 2–3 columns */
export const Triptych: React.FC<Base & {title?: string; cols: {icon: IconName; head: string; sub?: string; at: number; accent?: boolean}[]}> = ({g, title, cols, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const w = 1580 / cols.length;
  return (
    <AbsoluteFill>
      {title && (
        <div style={{position: 'absolute', left: 170, top: 150, fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: G.fg}}>
          <MaskLine at={0}><RichText text={title} hlAt={20} hlInk={K.ink} /></MaskLine>
        </div>
      )}
      {cols.map((c, i) => {
        const p = p01(f, c.at, 22);
        const acc = c.accent ? (g === 'paper' ? K.blue : K.yellow) : G.fg;
        return (
          <div key={i} style={{position: 'absolute', left: 170 + i * w, top: title ? 370 : 300, width: w - 70, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
            {i > 0 && <div style={{position: 'absolute', left: -35, top: 0, width: 2, height: 450, background: G.line}} />}
            <LineIcon name={c.icon} size={150} color={acc} at={c.at + 2} stroke={1.1} />
            <div style={{marginTop: 34, fontFamily: F.head, fontWeight: 800, fontSize: 48, lineHeight: 1.05, letterSpacing: '-0.02em', color: G.fg}}>{c.head}</div>
            {c.sub && <div style={{marginTop: 14, fontFamily: F.body, fontWeight: 500, fontSize: 28, lineHeight: 1.35, color: G.sub}}>{c.sub}</div>}
          </div>
        );
      })}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Chain: many steps, camera pans along */
export const Chain: React.FC<Base & {steps: {icon: IconName; label: string; at: number; kind?: 'digital' | 'physical'}[]; title?: string}> = ({g, steps, title}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const gap = 440, y = 580;
  const active = steps.reduce((a, s, i) => (f >= s.at ? i : a), 0);
  const pan = steps.reduce((acc, s, i) => (i === 0 ? 0 : acc + gap * p01(f, s.at - 4, 26, EIO)), 0);
  const offset = 960 - 220 - pan;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: offset, top: 0, width: steps.length * gap, height: 1080}}>
        <svg width={steps.length * gap} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {steps.slice(1).map((s, i) => {
            const p = p01(f, s.at - 8, 20, EIO);
            const xa = i * gap + 220 + 110, xb = (i + 1) * gap + 220 - 110;
            return <line key={i} x1={xa} x2={xa + (xb - xa) * p} y1={y} y2={y} stroke={G.fg} strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" opacity={0.6} />;
          })}
        </svg>
        {steps.map((s, i) => {
          const p = p01(f, s.at, 20);
          const on = i === active;
          const col = s.kind === 'digital' ? (g === 'paper' ? K.blue : K.yellow) : G.fg;
          return (
            <div key={i} style={{position: 'absolute', left: i * gap + 220 - 160, top: y - 100, width: 320, textAlign: 'center', opacity: p * (on ? 1 : 0.35), transform: `scale(${on ? 1 : 0.86})`}}>
              <div style={{width: 200, height: 200, margin: '0 auto', borderRadius: 100, border: `3px solid ${col}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <LineIcon name={s.icon} size={96} color={col} at={s.at} stroke={1.3} />
              </div>
              <div style={{marginTop: 26, fontFamily: F.head, fontWeight: 700, fontSize: 36, color: G.fg, lineHeight: 1.1}}>{s.label}</div>
              {s.kind && <div style={{marginTop: 8, fontFamily: F.body, fontWeight: 700, fontSize: 17, letterSpacing: '0.18em', color: col}}>{s.kind.toUpperCase()}</div>}
            </div>
          );
        })}
      </div>
      {title && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: F.head, fontWeight: 800, fontSize: 60, letterSpacing: '-0.02em', color: G.fg}}>
          <MaskLine at={0}><RichText text={title} hlAt={20} hlInk={K.ink} /></MaskLine>
        </div>
      )}
    </AbsoluteFill>
  );
};
