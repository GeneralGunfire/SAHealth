import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, E, FONT, prog, springAt} from './core';

/**
 * Per-character spring reveal. Text with *stars* gets a highlighter swipe.
 * mode 'rise' = chars rise from below a mask; 'blur' = soft focus-pull.
 */
export const CharReveal: React.FC<{
  text: string; at: number; size?: number; weight?: number; color?: string; font?: string; stagger?: number;
  hlColor?: string; hlInk?: string; hlAt?: number; mode?: 'rise' | 'blur'; tracking?: number; lineHeight?: number;
  align?: 'left' | 'center' | 'right'; maxWidth?: number; exitAt?: number; italic?: boolean;
}> = ({text, at, size = 96, weight = 800, color = C.white, font = FONT.head, stagger = 1.1, hlColor = C.yellow, hlInk = C.ink,
  hlAt, mode = 'rise', tracking = -0.025, lineHeight = 1.02, align = 'left', maxWidth = 1600, exitAt, italic}) => {
  const f = useCurrentFrame();
  const out = exitAt === undefined ? 0 : prog(f, exitAt, 16, E.inOut);
  const segs = text.split('*');
  let ci = 0;
  const hl = prog(f, hlAt ?? at + text.length * stagger + 6, 18, E.out);
  return (
    <div style={{fontFamily: font, fontWeight: weight, fontSize: size, color, letterSpacing: `${tracking}em`, lineHeight, textAlign: align, maxWidth, fontStyle: italic ? 'italic' : undefined,
      opacity: 1 - out, transform: `translateY(${-out * 30}px)`, filter: out ? `blur(${out * 8}px)` : undefined}}>
      {segs.map((seg, si) => {
        const isHl = si % 2 === 1;
        const words = seg.split(/(\s+)/);
        const inner = words.map((w, wi) => {
          if (/^\s+$/.test(w)) { ci += w.length; return <span key={wi}>{w}</span>; }
          return (
            <span key={wi} style={{display: 'inline-block', whiteSpace: 'nowrap'}}>
              {[...w].map((ch, k) => {
                const s = springAt(f, at + (ci + k) * stagger, {damping: 14, stiffness: 140});
                const p = Math.min(1, s);
                const node = (
                  <span key={k} style={{display: 'inline-block', transform: mode === 'rise' ? `translateY(${(1 - s) * 0.9}em) rotate(${(1 - p) * 8}deg)` : `scale(${0.9 + 0.1 * p})`,
                    opacity: mode === 'rise' ? Math.min(1, p * 1.6) : p, filter: mode === 'blur' ? `blur(${(1 - p) * 14}px)` : undefined, transformOrigin: '0 100%'}}>
                    {ch}
                  </span>
                );
                if (k === w.length - 1) ci += w.length;
                return node;
              })}
            </span>
          );
        });
        if (!isHl) return <span key={si} style={{overflow: mode === 'rise' ? 'hidden' : undefined}}>{inner}</span>;
        return (
          <span key={si} style={{backgroundImage: `linear-gradient(${hlColor}, ${hlColor})`, backgroundRepeat: 'no-repeat', backgroundSize: `${hl * 100}% 86%`, backgroundPosition: '0 70%',
            WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone', padding: '0 0.08em', margin: '0 -0.08em', color: hl > 0.45 ? hlInk : undefined}}>
            {inner}
          </span>
        );
      })}
    </div>
  );
};

/** Slot-machine digits that roll into place, one column at a time. */
export const RollingNumber: React.FC<{value: string; at: number; size?: number; color?: string; weight?: number; accent?: string; suffix?: string; stagger?: number}> = ({
  value, at, size = 220, color = C.white, weight = 900, accent = C.blue2, suffix = '', stagger = 3,
}) => {
  const f = useCurrentFrame();
  const chars = [...value];
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', fontFamily: FONT.head, fontWeight: weight, fontSize: size, color, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
      {chars.map((ch, i) => {
        const isDigit = /\d/.test(ch);
        const t = at + i * stagger;
        if (ch === ' ') return <span key={i} style={{display: 'inline-block', width: '0.26em'}} />;
        if (!isDigit) {
          const p = springAt(f, t + 6, {damping: 18});
          return <span key={i} style={{display: 'inline-block', opacity: Math.min(1, p), transform: `translateY(${(1 - p) * 0.3}em)`}}>{ch}</span>;
        }
        const target = Number(ch);
        const spins = 2 + (i % 3);
        const p = interpolate(f, [t, t + 34 + i * 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: E.out});
        const pos = (spins * 10 + target) * p; // digits scrolled
        return (
          <span key={i} style={{display: 'inline-block', height: '1em', overflow: 'hidden', position: 'relative', width: '0.62em', opacity: f >= t ? 1 : 0}}>
            <span style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-pos}em)`, filter: `blur(${Math.min(6, (1 - p) * 10)}px)`}}>
              {Array.from({length: spins * 10 + 10}).map((_, k) => <div key={k} style={{height: '1em'}}>{k % 10}</div>)}
            </span>
          </span>
        );
      })}
      {suffix && <span style={{color: accent, opacity: springAt(f, at + chars.length * stagger + 10, {damping: 18}), marginLeft: '0.04em'}}>{suffix}</span>}
    </div>
  );
};

/** Word that rolls vertically into the next word at each cue (box sized to the longest word). */
export const WordSwap: React.FC<{words: string[]; ats: number[]; size?: number; color?: string; weight?: number}> = ({words, ats, size = 96, color = C.white, weight = 800}) => {
  const f = useCurrentFrame();
  let idx = 0;
  ats.forEach((a, i) => { if (f >= a) idx = i; });
  const p = prog(f, ats[idx], 18, E.out);
  const longest = words.reduce((a, w) => (w.length > a.length ? w : a), '');
  const base: React.CSSProperties = {position: 'absolute', left: 0, right: 0, top: 0, whiteSpace: 'nowrap', textAlign: 'center'};
  return (
    <span style={{display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'bottom', fontFamily: FONT.head, fontWeight: weight, fontSize: size, color, whiteSpace: 'nowrap', lineHeight: 1.15}}>
      <span style={{visibility: 'hidden'}}>{longest}</span>
      {idx > 0 && <span style={{...base, transform: `translateY(${-p * 110}%)`, opacity: 1 - p}}>{words[idx - 1]}</span>}
      <span style={{...base, transform: `translateY(${idx > 0 ? (1 - p) * 110 : 0}%)`}}>{words[idx]}</span>
    </span>
  );
};

/** Small uppercase label with a leading rule. */
export const Eyebrow: React.FC<{text: string; at: number; color?: string; size?: number}> = ({text, at, color = C.blue2, size = 22}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 24);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.body, fontWeight: 700, fontSize: size, letterSpacing: '0.24em', textTransform: 'uppercase', color}}>
      <span style={{width: 56 * p, height: 2, background: color}} />
      <span style={{opacity: p, transform: `translateX(${(1 - p) * -12}px)`}}>{text}</span>
    </div>
  );
};

/** Floating UI chip (Google-style): icon dot + label, springs in, optional exit. */
export const Tag: React.FC<{text: string; at: number; color?: string; bg?: string; ink?: string; exitAt?: number; size?: number; dot?: boolean}> = ({
  text, at, color = C.blue, bg = 'rgba(255,255,255,0.96)', ink = C.ink, exitAt, size = 26, dot = true,
}) => {
  const f = useCurrentFrame();
  const s = springAt(f, at, {damping: 13, stiffness: 150});
  const o = exitAt === undefined ? 1 : 1 - prog(f, exitAt, 12);
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, padding: `${size * 0.5}px ${size * 0.85}px`, borderRadius: 999, background: bg,
      boxShadow: '0 1px 2px rgba(0,0,0,0.12), 0 12px 32px rgba(0,0,0,0.18)', fontFamily: FONT.body, fontWeight: 600, fontSize: size, color: ink, whiteSpace: 'nowrap',
      transform: `scale(${Math.max(0, s)})`, opacity: Math.min(1, s * 2) * o, transformOrigin: 'center'}}>
      {dot && <span style={{width: size * 0.5, height: size * 0.5, borderRadius: '50%', background: color, boxShadow: `0 0 0 ${size * 0.22}px ${color}33`}} />}
      {text}
    </div>
  );
};

/**
 * Documentary caption: one clean line (or two), fades up with a soft focus pull.
 * Sentence case, medium weight, generous tracking. No per-character gimmicks.
 */
export const Caption: React.FC<{text: string; at: number; out?: number; size?: number; color?: string; weight?: number; align?: 'left' | 'center'; width?: number; sub?: string}> = ({
  text, at, out, size = 58, color = C.white, weight = 500, align = 'left', width = 1300, sub,
}) => {
  const f = useCurrentFrame();
  const i = prog(f, at, 28, E.out);
  const o = out === undefined ? 0 : prog(f, out, 22, E.inOut);
  if (f < at || o >= 1) return null;
  return (
    <div style={{width, textAlign: align, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 18 - o * 10}px)`, filter: `blur(${(1 - i) * 10 + o * 8}px)`}}>
      <div style={{fontFamily: FONT.head, fontWeight: weight, fontSize: size, lineHeight: 1.18, letterSpacing: '-0.01em', color}}>{text}</div>
      {sub && <div style={{marginTop: 18, fontFamily: FONT.body, fontWeight: 400, fontSize: size * 0.46, lineHeight: 1.4, color: 'rgba(214,226,255,0.72)', letterSpacing: '0.005em'}}>{sub}</div>}
    </div>
  );
};

/** Understated source line, bottom-right. */
export const SourceNote: React.FC<{text: string; at: number; out?: number}> = ({text, at, out}) => {
  const f = useCurrentFrame();
  const o = prog(f, at + 20, 30) * (out === undefined ? 1 : 1 - prog(f, out, 20));
  return <div style={{position: 'absolute', right: 110, bottom: 70, fontFamily: FONT.body, fontSize: 18, color: 'rgba(190,205,240,0.55)', opacity: o, letterSpacing: '0.01em'}}>{text}</div>;
};
