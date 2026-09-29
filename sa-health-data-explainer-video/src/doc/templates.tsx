import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {F, Ground, K} from './theme';
import {EIO, EO, fmtN, IconName, Kicker, LineIcon, Mark, MaskLine, p01, RichText, SourceLine, useGround} from './kit';
import {MAP_H, MAP_W, PROVINCES} from '../data/provinces';

export type Base = {g: Ground; len: number; source?: string};

/* ============================================================ Headline */
export type HeadlineP = Base & {kicker?: string; lines: string[]; size?: number; align?: 'left' | 'center'; serif?: boolean; hlAt?: number; subtitle?: string};
export const Headline: React.FC<HeadlineP> = ({g, lines, kicker, size = 104, align = 'left', serif, hlAt, subtitle, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const center = align === 'center';
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: center ? 'center' : 'flex-start', padding: center ? '0 160px' : '0 170px'}}>
      {kicker && <Kicker text={kicker} at={0} color={G.accent === K.yellow && g !== 'paper' ? K.yellow : K.blue} style={{marginBottom: 34, justifyContent: center ? 'center' : undefined}} />}
      <div style={{fontFamily: serif ? F.serif : F.head, fontWeight: serif ? 400 : 800, fontSize: size, lineHeight: 1.04, letterSpacing: serif ? '-0.01em' : '-0.022em', color: G.fg, textAlign: align, maxWidth: 1580}}>
        {lines.map((l, i) => (
          <MaskLine key={i} at={4 + i * 6}>
            <RichText text={l} hlAt={hlAt ?? 16 + lines.length * 6} hlColor={g === 'blue' ? K.navy : K.yellow} hlInk={g === 'paper' ? K.ink : g === 'blue' ? '#fff' : K.ink} />
          </MaskLine>
        ))}
      </div>
      {subtitle && (
        <div style={{marginTop: 36, fontFamily: F.body, fontWeight: 500, fontSize: 34, lineHeight: 1.35, color: G.sub, maxWidth: 1200, textAlign: align, opacity: p01(f, 18 + lines.length * 6, 24), transform: `translateY(${(1 - p01(f, 18 + lines.length * 6, 24)) * 14}px)`}}>{subtitle}</div>
      )}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Chapter */
export const Chapter: React.FC<Base & {n: number; title: string; sub?: string}> = ({g, n, title, sub, len}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const bar = p01(f, 6, 36, EIO);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 170px'}}>
      <div style={{fontFamily: F.mono, fontSize: 30, fontWeight: 500, color: g === 'paper' ? K.blue : K.yellow, opacity: p01(f, 0, 16), letterSpacing: '0.1em'}}>
        PART {String(n).padStart(2, '0')}
      </div>
      <div style={{height: 3, background: G.fg, width: 1580 * bar, margin: '28px 0 36px', opacity: 0.9}} />
      <div style={{fontFamily: F.head, fontWeight: 900, fontSize: 150, letterSpacing: '-0.032em', lineHeight: 0.98, color: G.fg}}>
        <MaskLine at={12} dur={28}>{title}</MaskLine>
      </div>
      {sub && <div style={{marginTop: 30, fontFamily: F.body, fontSize: 36, fontWeight: 500, color: G.sub, opacity: p01(f, 30, 24)}}>{sub}</div>}
    </AbsoluteFill>
  );
};

/* ============================================================ Stat */
export const Stat: React.FC<Base & {value: number; dec?: number; prefix?: string; suffix?: string; label: string; sub?: string; countAt?: number}> = ({g, value, dec = 0, prefix = '', suffix = '', label, sub, source, countAt = 4}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const p = p01(f, countAt, 46, EO);
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 170px'}}>
      <div style={{fontFamily: F.head, fontWeight: 900, fontSize: 300, letterSpacing: '-0.055em', lineHeight: 0.9, color: G.fg, opacity: p01(f, countAt, 8)}}>
        {prefix}{fmtN(value * p, dec)}<span style={{color: g === 'paper' ? K.blue : K.yellow}}>{suffix}</span>
      </div>
      <div style={{marginTop: 34, fontFamily: F.head, fontWeight: 700, fontSize: 56, letterSpacing: '-0.02em', color: G.fg, maxWidth: 1400}}>
        <MaskLine at={countAt + 14}>{label}</MaskLine>
      </div>
      {sub && <div style={{marginTop: 18, fontFamily: F.body, fontSize: 32, fontWeight: 500, color: G.sub, maxWidth: 1300, opacity: p01(f, countAt + 26, 20)}}>{sub}</div>}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Bars */
export type Bar = {label: string; value: number; display: string; at: number; accent?: boolean; mark?: string};
export const Bars: React.FC<Base & {title?: string; bars: Bar[]; max: number; refLine?: {value: number; label: string; at: number}}> = ({g, title, bars, max, refLine, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const W = 1100;
  return (
    <AbsoluteFill style={{padding: '0 170px', justifyContent: 'center'}}>
      {title && <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: G.fg, marginBottom: 70}}><MaskLine at={0}><RichText text={title} hlAt={22} hlInk={K.ink} /></MaskLine></div>}
      <div style={{position: 'relative'}}>
        {bars.map((b, i) => {
          const p = p01(f, b.at, 40, EO);
          return (
            <div key={i} style={{marginBottom: 54, opacity: p01(f, b.at, 10)}}>
              <div style={{fontFamily: F.body, fontWeight: 600, fontSize: 28, color: G.sub, marginBottom: 14, letterSpacing: '0.01em'}}>{b.label}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
                <div style={{height: 70, width: (b.value / max) * W * p, background: b.accent ? (g === 'paper' ? K.blue : K.yellow) : G.fg, opacity: b.accent ? 1 : 0.85}} />
                <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 58, letterSpacing: '-0.02em', color: G.fg, opacity: p01(f, b.at + 18, 14)}}>{b.display}</div>
              </div>
            </div>
          );
        })}
        {refLine && (
          <div style={{position: 'absolute', left: (refLine.value / max) * W, top: -30, bottom: 20, width: 3, background: K.red, opacity: p01(f, refLine.at, 12), transformOrigin: 'top', transform: `scaleY(${p01(f, refLine.at, 24)})`}}>
            <div style={{position: 'absolute', top: -40, left: 12, whiteSpace: 'nowrap', fontFamily: F.body, fontWeight: 700, fontSize: 22, letterSpacing: '0.12em', color: K.red}}>{refLine.label}</div>
          </div>
        )}
      </div>
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Map */
export type ProvState = {state: 'on' | 'accent' | 'hatch' | 'dim' | 'blue'; at: number; label?: string};
export const MapBeat: React.FC<Base & {prov: Record<string, ProvState>; title?: string; lines?: string[]; note?: string; noteAt?: number; zoom?: {name: string; at: number; s: number}; outlineAt?: number}> = ({g, prov, title, lines, note, noteAt = 30, source, zoom, outlineAt = 0}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const scale = 0.98;
  const draw = p01(f, outlineAt, 50, EIO);
  let zx = 0, zy = 0, zs = 1;
  if (zoom) {
    const p = PROVINCES.find((q) => q.name === zoom.name)!;
    const t = p01(f, zoom.at, 50, EIO);
    zs = 1 + (zoom.s - 1) * t;
    zx = (MAP_W / 2 - p.cx) * scale * t * zs;
    zy = (MAP_H / 2 - p.cy) * scale * t * zs;
  }
  const text = lines || title;
  const fill = (s: ProvState['state']) => ({on: G.fg, accent: g === 'paper' ? K.blue : K.yellow, blue: K.blue, hatch: 'url(#hatchD)', dim: 'transparent'}[s]);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: text ? 110 : (1920 - MAP_W * scale) / 2, top: (1080 - MAP_H * scale) / 2, width: MAP_W * scale, height: MAP_H * scale, transform: `translate(${zx}px, ${zy}px) scale(${zs})`, transformOrigin: '50% 50%'}}>
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W * scale} height={MAP_H * scale} style={{overflow: 'visible'}}>
          <defs>
            <pattern id="hatchD" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="10" stroke={K.red} strokeWidth="3.5" />
            </pattern>
          </defs>
          {PROVINCES.map((p) => {
            const st = prov[p.name];
            const fp = st ? p01(f, st.at, 20) : 0;
            return (
              <g key={p.name}>
                {st && <path d={p.d} fill={fill(st.state)} opacity={fp * (st.state === 'on' ? 0.92 : 1)} />}
                <path d={p.d} fill="none" stroke={G.fg} strokeOpacity={0.55} strokeWidth={1.4 / zs} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
              </g>
            );
          })}
        </svg>
        {PROVINCES.filter((p) => prov[p.name]?.label).map((p) => {
          const st = prov[p.name];
          const q = p01(f, st.at + 8, 14);
          const onFill = st.state === 'on' || st.state === 'blue' || (st.state === 'accent' && g !== 'paper');
          return (
            <div key={p.name} style={{position: 'absolute', left: p.cx * scale - 150, top: p.cy * scale - 16, width: 300, textAlign: 'center', fontFamily: F.body, fontWeight: 700, fontSize: 22 / zs, letterSpacing: '0.08em', color: onFill ? (st.state === 'accent' ? K.ink : G.bg) : G.fg, opacity: q}}>
              {st.label}
            </div>
          );
        })}
      </div>
      {text && (
        <div style={{position: 'absolute', left: 1140, top: 0, bottom: 0, width: 660, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          {title && <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 64, lineHeight: 1.04, letterSpacing: '-0.02em', color: G.fg}}><MaskLine at={6}><RichText text={title} hlAt={24} hlInk={K.ink} /></MaskLine></div>}
          {lines?.map((l, i) => (
            <div key={i} style={{fontFamily: F.head, fontWeight: 800, fontSize: 60, lineHeight: 1.06, letterSpacing: '-0.02em', color: G.fg}}><MaskLine at={6 + i * 6}><RichText text={l} hlAt={26 + lines.length * 6} hlInk={K.ink} /></MaskLine></div>
          ))}
          {note && <div style={{marginTop: 34, fontFamily: F.body, fontSize: 30, fontWeight: 500, lineHeight: 1.35, color: G.sub, opacity: p01(f, noteAt, 20)}}>{note}</div>}
        </div>
      )}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Flow (2-4 nodes) */
export type Node = {icon: IconName; label: string; at: number; sub?: string; accent?: boolean};
export const Flow: React.FC<Base & {nodes: Node[]; title?: string; dashed?: boolean; titleAt?: number}> = ({g, nodes, title, dashed, source, titleAt = 0}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const n = nodes.length;
  const gap = n === 2 ? 760 : n === 3 ? 560 : 420;
  const x0 = 960 - (gap * (n - 1)) / 2;
  const y = title ? 600 : 520;
  const R = 110;
  return (
    <AbsoluteFill>
      {title && <div style={{position: 'absolute', top: 170, left: 0, right: 0, textAlign: 'center', fontFamily: F.head, fontWeight: 800, fontSize: 70, letterSpacing: '-0.02em', color: G.fg}}><MaskLine at={titleAt}><RichText text={title} hlAt={titleAt + 20} hlInk={K.ink} /></MaskLine></div>}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {nodes.slice(1).map((nd, i) => {
          const xa = x0 + i * gap + R + 18, xb = x0 + (i + 1) * gap - R - 18;
          const p = p01(f, nd.at - 6, 26, EIO);
          const travel = ((f - nd.at) % 60) / 60;
          return (
            <g key={i}>
              <line x1={xa} x2={xa + (xb - xa) * p} y1={y} y2={y} stroke={G.fg} strokeWidth={3} strokeDasharray={dashed ? '3 12' : undefined} strokeLinecap="round" />
              {p >= 1 && <path d={`M${xb - 16} ${y - 10} L${xb} ${y} L${xb - 16} ${y + 10}`} fill="none" stroke={G.fg} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}
              {p >= 1 && !dashed && <circle cx={xa + (xb - xa) * travel} cy={y} r={7} fill={g === 'paper' ? K.blue : K.yellow} opacity={Math.min(1, travel * 6, (1 - travel) * 6)} />}
            </g>
          );
        })}
      </svg>
      {nodes.map((nd, i) => {
        const x = x0 + i * gap;
        const p = p01(f, nd.at, 22);
        const ring = nd.accent ? (g === 'paper' ? K.blue : K.yellow) : G.fg;
        return (
          <div key={i} style={{position: 'absolute', left: x - 240, top: y - R, width: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
            <div style={{width: R * 2, height: R * 2, borderRadius: R, border: `3px solid ${ring}`, background: nd.accent ? ring : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <LineIcon name={nd.icon} size={104} color={nd.accent ? (g === 'paper' ? '#fff' : K.ink) : G.fg} at={nd.at + 4} stroke={1.25} />
            </div>
            <div style={{marginTop: 30, fontFamily: F.head, fontWeight: 700, fontSize: 38, letterSpacing: '-0.015em', color: G.fg, textAlign: 'center', lineHeight: 1.1}}>{nd.label}</div>
            {nd.sub && <div style={{marginTop: 10, fontFamily: F.body, fontWeight: 500, fontSize: 25, color: G.sub, textAlign: 'center', lineHeight: 1.3}}>{nd.sub}</div>}
          </div>
        );
      })}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ List */
export const List: React.FC<Base & {title?: string; items: {text: string; at: number; sub?: string}[]; numbered?: boolean}> = ({g, title, items, numbered = true, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const active = items.reduce((a, it, i) => (f >= it.at ? i : a), -1);
  const big = items.length <= 4;
  return (
    <AbsoluteFill style={{padding: '0 170px', justifyContent: 'center'}}>
      {title && <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 60, letterSpacing: '-0.02em', color: G.fg, marginBottom: 56}}><MaskLine at={0}><RichText text={title} hlAt={22} hlInk={K.ink} /></MaskLine></div>}
      {items.map((it, i) => {
        const p = p01(f, it.at, 20);
        const dim = i < active ? 0.38 : 1;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 40, marginBottom: big ? 40 : 26, opacity: p * dim, transform: `translateX(${(1 - p) * 30}px)`}}>
            {numbered && <div style={{width: 70, fontFamily: F.mono, fontWeight: 500, fontSize: big ? 36 : 30, color: i === active ? (g === 'paper' ? K.blue : K.yellow) : G.sub}}>{String(i + 1).padStart(2, '0')}</div>}
            <div>
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: big ? 60 : 48, letterSpacing: '-0.018em', lineHeight: 1.08, color: G.fg}}>{it.text}</div>
              {it.sub && <div style={{marginTop: 8, fontFamily: F.body, fontWeight: 500, fontSize: 28, color: G.sub}}>{it.sub}</div>}
            </div>
          </div>
        );
      })}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Quote */
export const Quote: React.FC<Base & {text: string; attr: string; hlAt?: number}> = ({g, text, attr, hlAt = 40, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{justifyContent: 'center', padding: '0 220px'}}>
      <div style={{fontFamily: F.serif, fontSize: 180, lineHeight: 0.6, color: g === 'paper' ? K.blue : K.yellow, opacity: p01(f, 0, 16), height: 90}}>“</div>
      <div style={{fontFamily: F.serif, fontWeight: 400, fontSize: 78, lineHeight: 1.18, color: G.fg, letterSpacing: '-0.01em'}}>
        <MaskLine at={6} dur={30}><RichText text={text} hlAt={hlAt} hlInk={K.ink} /></MaskLine>
      </div>
      <div style={{marginTop: 50, fontFamily: F.body, fontWeight: 600, fontSize: 26, letterSpacing: '0.14em', textTransform: 'uppercase', color: G.sub, opacity: p01(f, 26, 20)}}>— {attr}</div>
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Hero icon */
export const Hero: React.FC<Base & {icon: IconName; title: string; sub?: string; accent?: boolean}> = ({g, icon, title, sub, accent, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const col = accent ? (g === 'paper' ? K.blue : K.yellow) : G.fg;
  const s = interpolate(f, [0, 300], [1, 1.06], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 170px', gap: 110}}>
      <div style={{transform: `scale(${s})`, flexShrink: 0}}><LineIcon name={icon} size={420} color={col} at={0} stroke={0.7} dur={40} /></div>
      <div style={{maxWidth: 900}}>
        <div style={{fontFamily: F.head, fontWeight: 800, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.024em', color: G.fg}}><MaskLine at={10}><RichText text={title} hlAt={30} hlInk={K.ink} /></MaskLine></div>
        {sub && <div style={{marginTop: 30, fontFamily: F.body, fontWeight: 500, fontSize: 34, lineHeight: 1.35, color: G.sub, opacity: p01(f, 24, 20)}}>{sub}</div>}
      </div>
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Dots (population) */
export const Dots: React.FC<Base & {total: number; per?: string; title?: string; groups: {n: number; label: string; at: number; color: 'accent' | 'fg' | 'red'}[]; splitAt?: number}> = ({g, total, per, title, groups, source, splitAt}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const cols = 16, cell = 70;
  const split = splitAt === undefined ? 0 : p01(f, splitAt, 40, EIO);
  // colour assignment from the END of the grid for group[0]
  const colorOf = (i: number) => {
    let from = total;
    for (const gr of groups) {
      if (i >= from - gr.n && i < from) return {gr, on: p01(f, gr.at, 20)};
      from -= gr.n;
    }
    return null;
  };
  const acc = g === 'paper' ? K.blue : K.yellow;
  return (
    <AbsoluteFill>
      {title && <div style={{position: 'absolute', left: 170, top: 150, fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: G.fg}}><MaskLine at={0}><RichText text={title} hlAt={22} hlInk={K.ink} /></MaskLine></div>}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: total}).map((_, i) => {
          const c = colorOf(i);
          const gx = 170 + 35 + (i % cols) * cell, gy = 380 + Math.floor(i / cols) * cell;
          const isG0 = c && c.gr === groups[0];
          const k = isG0 ? i - (total - groups[0].n) : 0;
          const tx = isG0 ? 1480 + (k % 3) * cell : gx - 40 * split;
          const ty = isG0 ? 420 + Math.floor(k / 3) * cell : gy;
          const x = gx + (tx - gx) * (isG0 ? split : 1);
          const yy = gy + (ty - gy) * (isG0 ? split : 1);
          const appear = p01(f, 4 + i * 0.6, 12);
          const colr = c ? (c.gr.color === 'accent' ? acc : c.gr.color === 'red' ? K.red : G.fg) : G.fg;
          return <circle key={i} cx={x} cy={yy} r={24 * appear} fill={c && c.on > 0.5 ? colr : G.fg} opacity={c && c.on > 0.5 ? 1 : 0.22} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: 170, top: 700, display: 'flex', gap: 70}}>
        {groups.map((gr, i) => (
          <div key={i} style={{opacity: p01(f, gr.at + 8, 16)}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{width: 24, height: 24, borderRadius: 12, background: gr.color === 'accent' ? acc : gr.color === 'red' ? K.red : G.fg}} />
              <div style={{fontFamily: F.head, fontWeight: 700, fontSize: 40, color: G.fg, letterSpacing: '-0.02em'}}>{gr.label}</div>
            </div>
          </div>
        ))}
      </div>
      {per && <div style={{position: 'absolute', left: 170, top: 800, fontFamily: F.body, fontWeight: 600, fontSize: 22, letterSpacing: '0.14em', textTransform: 'uppercase', color: G.sub, opacity: p01(f, 20, 16)}}>{per}</div>}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Timeline */
export const Timeline: React.FC<Base & {items: {year: string; text: string; at: number; accent?: boolean}[]; title?: string}> = ({g, items, title, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const x0 = 200, x1 = 1720, y = 560;
  const n = items.length;
  const line = p01(f, 0, 50, EIO);
  return (
    <AbsoluteFill>
      {title && <div style={{position: 'absolute', left: 200, top: 190, fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: G.fg}}><MaskLine at={0}><RichText text={title} hlAt={22} hlInk={K.ink} /></MaskLine></div>}
      <div style={{position: 'absolute', left: x0, top: y, width: (x1 - x0) * line, height: 3, background: G.fg}} />
      {items.map((it, i) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n - 140;
        const p = p01(f, it.at, 20);
        const acc = it.accent ? (g === 'paper' ? K.blue : K.yellow) : G.fg;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y - 90, width: 320, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
            <div style={{fontFamily: F.mono, fontWeight: 600, fontSize: 32, color: acc}}>{it.year}</div>
            <div style={{width: 22, height: 22, borderRadius: 11, background: acc, margin: '30px 0 0', transform: `translateY(8px) scale(${p})`}} />
            <div style={{marginTop: 40, fontFamily: F.head, fontWeight: 700, fontSize: 34, lineHeight: 1.15, color: G.fg, letterSpacing: '-0.015em'}}>{it.text}</div>
          </div>
        );
      })}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Split */
export const Split: React.FC<Base & {left: {title: string; sub?: string}; right: {title: string; sub?: string}; rightAt: number; wallAt?: number}> = ({g, left, right, rightAt, wallAt, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const r = p01(f, rightAt, 36, EIO);
  const w = wallAt === undefined ? 0 : p01(f, wallAt, 20);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 1920 - 960 * r, top: 0, width: 960, height: 1080, background: K.blue}} />
      <div style={{position: 'absolute', left: 959 - 6 * w, top: 0, width: 12 * w + 2, height: 1080, background: G.fg, opacity: w}} />
      {[left, right].map((s, i) => (
        <div key={i} style={{position: 'absolute', left: i ? 1060 : 130, top: 0, bottom: 0, width: 760, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
          <div style={{fontFamily: F.head, fontWeight: 900, fontSize: 120, letterSpacing: '-0.032em', color: i ? '#fff' : G.fg}}><MaskLine at={i ? rightAt + 10 : 4}>{s.title}</MaskLine></div>
          {s.sub && <div style={{marginTop: 22, fontFamily: F.body, fontWeight: 500, fontSize: 32, lineHeight: 1.35, color: i ? '#D6DEFF' : G.sub, opacity: p01(f, i ? rightAt + 22 : 16, 20)}}>{s.sub}</div>}
        </div>
      ))}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Paper folder close-up */
export const Folder: React.FC<Base & {lines: {text: string; at: number}[]; caption?: string; captionAt?: number; stamp?: {text: string; at: number}}> = ({g, lines, caption, captionAt = 20, stamp, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const p = p01(f, 0, 30);
  const rot = interpolate(f, [0, 400], [-4, -2.5], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 240, top: 150, width: 620, height: 780, transform: `translateY(${(1 - p) * 60}px) rotate(${rot}deg)`, opacity: p}}>
        <div style={{position: 'absolute', inset: '40px 0 0 0', background: '#D7C295', borderRadius: 10, boxShadow: '0 30px 60px rgba(0,0,0,0.25)'}} />
        <div style={{position: 'absolute', left: 30, top: 0, width: 230, height: 60, background: '#D7C295', borderRadius: '10px 10px 0 0'}} />
        <div style={{position: 'absolute', left: 34, top: 70, right: 34, bottom: 34, background: '#FFFDF7', padding: '40px 44px', boxSizing: 'border-box', backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0 57px, rgba(47,91,255,0.2) 57px 59px)', backgroundPosition: '0 88px'}}>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 17, letterSpacing: '0.2em', color: '#9A8457', marginBottom: 26}}>PATIENT FOLDER · CLINIC COPY</div>
          {lines.map((l, i) => {
            const q = p01(f, l.at, Math.max(14, l.text.length * 1.5), (t) => t);
            return <div key={i} style={{fontFamily: F.hand, fontSize: 40, color: '#1E2F7A', lineHeight: '58px', whiteSpace: 'nowrap', clipPath: `inset(-10px ${100 - q * 100}% -10px 0)`}}>{l.text}</div>;
          })}
        </div>
        {stamp && <div style={{position: 'absolute', right: 40, bottom: 80, border: `4px solid ${K.red}`, color: K.red, padding: '8px 18px', fontFamily: F.body, fontWeight: 900, fontSize: 34, letterSpacing: '0.12em', transform: `rotate(-10deg) scale(${1.5 - 0.5 * p01(f, stamp.at, 10)})`, opacity: p01(f, stamp.at, 6)}}>{stamp.text}</div>}
      </div>
      {caption && (
        <div style={{position: 'absolute', left: 1020, top: 0, bottom: 0, width: 760, display: 'flex', alignItems: 'center', fontFamily: F.head, fontWeight: 800, fontSize: 76, lineHeight: 1.05, letterSpacing: '-0.024em', color: G.fg}}>
          <MaskLine at={captionAt}><RichText text={caption} hlAt={captionAt + 20} hlInk={K.ink} /></MaskLine>
        </div>
      )}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Duplicate identities */
export const Duplicate: React.FC<Base & {records: {text: string; at: number}[]; title?: string}> = ({g, records, title, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {title && <div style={{position: 'absolute', left: 170, top: 170, fontFamily: F.head, fontWeight: 800, fontSize: 64, letterSpacing: '-0.02em', color: G.fg}}><MaskLine at={0}><RichText text={title} hlAt={22} hlInk={K.ink} /></MaskLine></div>}
      <div style={{position: 'absolute', left: 300, top: 470, opacity: p01(f, 0, 16)}}><LineIcon name="person" size={220} color={G.fg} stroke={1} /></div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {records.map((r, i) => {
          const y = 390 + i * 170;
          const p = p01(f, r.at, 26, EIO);
          return <path key={i} d={`M560 580 C760 580 760 ${y} ${760 + 200 * p} ${y}`} fill="none" stroke={K.red} strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
        })}
      </svg>
      {records.map((r, i) => {
        const p = p01(f, r.at + 14, 18);
        return (
          <div key={i} style={{position: 'absolute', left: 980, top: 390 + i * 170 - 50, width: 760, height: 100, border: `2px solid ${G.fg}`, display: 'flex', alignItems: 'center', padding: '0 34px', boxSizing: 'border-box', gap: 30, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
            <span style={{fontFamily: F.mono, fontSize: 22, color: K.red, fontWeight: 600}}>REC {i + 1}</span>
            <span style={{fontFamily: F.mono, fontSize: 30, color: G.fg}}>{r.text}</span>
          </div>
        );
      })}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

/* ============================================================ Wall between sectors */
export const Wall: React.FC<Base & {left: string[]; right: string[]; wallAt?: number; walkAt?: number}> = ({g, left, right, wallAt = 0, walkAt, source}) => {
  const G = useGround(g);
  const f = useCurrentFrame();
  const w = p01(f, wallAt, 30, EIO);
  const walk = walkAt === undefined ? 0 : p01(f, walkAt, 10);
  const px = 960 + Math.sin(Math.max(0, f - (walkAt ?? 0)) / 26) * 520 * walk;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', left: 950, top: 540 - 420 * w, width: 20, height: 840 * w, background: G.fg}} />
      {[left, right].map((col, s) => (
        <div key={s} style={{position: 'absolute', left: s ? 1080 : 180, top: 0, bottom: 0, width: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: s ? 'flex-start' : 'flex-end', textAlign: s ? 'left' : 'right'}}>
          <div style={{fontFamily: F.body, fontWeight: 700, fontSize: 24, letterSpacing: '0.2em', color: s ? K.blueSoft : G.sub, marginBottom: 30, opacity: p01(f, 6, 16)}}>{s ? 'PRIVATE' : 'PUBLIC'}</div>
          {col.map((t, i) => <div key={i} style={{fontFamily: F.head, fontWeight: 700, fontSize: 52, letterSpacing: '-0.018em', lineHeight: 1.3, color: G.fg, opacity: p01(f, 10 + i * 6 + s * 12, 16)}}>{t}</div>)}
        </div>
      ))}
      {walkAt !== undefined && <div style={{position: 'absolute', left: px - 50, top: 860, opacity: walk}}><LineIcon name="person" size={100} color={g === 'paper' ? K.blue : K.yellow} stroke={1.6} /></div>}
      <SourceLine text={source} color={G.sub} />
    </AbsoluteFill>
  );
};

import {Ecg, Highways, Tally, Receipt, Triptych, Chain} from './templates2';
export const TEMPLATES = {Ecg, Highways, Tally, Receipt, Triptych, Chain, Headline, Chapter, Stat, Bars, MapBeat, Flow, List, Quote, Hero, Dots, Timeline, Split, Folder, Duplicate, Wall};
export type TemplateName = keyof typeof TEMPLATES;
