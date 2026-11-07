/**
 * v2 core: palette, springs, camera/parallax world, cue lookup, film grain.
 * Design language: Google product-film polish (depth, springs, continuous camera)
 * with Vox editorial type and colour (ink, paper, blues, highlighter yellow).
 */
import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadGSans} from '@remotion/google-fonts/GoogleSans';
import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadSerif} from '@remotion/google-fonts/Fraunces';
import words from '../../public/data/doc_words.json';

export const FONT = {
  body: loadGSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily,
  head: loadGSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily,
  mono: loadMono('normal', {weights: ['400', '500', '700'], subsets: ['latin']}).fontFamily,
  serif: loadSerif('normal', {weights: ['300', '400', '600'], subsets: ['latin']}).fontFamily,
};

export const C = {
  night: '#070B16', // deepest background
  navy: '#0B1530',
  navy2: '#14224A',
  navy3: '#1E3166',
  blue: '#3B7BFF',
  blue2: '#6FA3FF',
  ice: '#BFD4FF',
  white: '#FFFFFF',
  paper: '#F4F5F8',
  paper2: '#E6E9F0',
  ink: '#0C0F17',
  grey: '#8A93A8',
  grey2: '#5A6380',
  yellow: '#FFD84A',
  red: '#FF5A4E',
  green: '#39D98A',
};

export const FPS = 30;

/* ------------------------------------------------------------------ easing */
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  cam: Easing.bezier(0.55, 0, 0.15, 1), // long, cinematic camera move
  in: Easing.bezier(0.5, 0, 0.75, 0),
};
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const prog = (f: number, at: number, dur = 20, ease = E.out) =>
  interpolate(f, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Physical spring 0→1 starting at `at` (frames). */
export const useSpring = (at: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping: cfg.damping ?? 16, stiffness: cfg.stiffness ?? 120, mass: cfg.mass ?? 1}});
};
export const springAt = (f: number, at: number, cfg: {damping?: number; stiffness?: number; mass?: number} = {}) =>
  spring({frame: f - at, fps: FPS, config: {damping: cfg.damping ?? 16, stiffness: cfg.stiffness ?? 120, mass: cfg.mass ?? 1}});

/* ------------------------------------------------------------------ cues */
type W = {w: string; s: number};
const WORDS = words as W[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const TOKS = WORDS.map((w) => norm(w.w));

/** Master-timeline seconds of the spoken `phrase` nearest `near` seconds. */
export const phraseAt = (phrase: string, near: number, window = 60): number => {
  const target = norm(phrase);
  let best = -1, bestD = Infinity;
  for (let i = 0; i < TOKS.length; i++) {
    const t = WORDS[i].s;
    if (Math.abs(t - near) > window) continue;
    let acc = '';
    for (let j = i; j < TOKS.length && acc.length < target.length; j++) {
      acc += TOKS[j];
      if (acc === target || (acc.startsWith(target) && acc.length - TOKS[j].length < target.length)) {
        const d = Math.abs(t - near);
        if (d < bestD) { best = t; bestD = d; }
        break;
      }
      if (!target.startsWith(acc)) break;
    }
  }
  if (best < 0) throw new Error(`v2 cue "${phrase}" not found near ${near.toFixed(1)}s`);
  return best;
};

/** Scene context: scene start on the master timeline (seconds). */
const SceneCtx = createContext<{start: number; end: number}>({start: 0, end: 0});
export const SceneTime: React.FC<{start: number; end: number; children: React.ReactNode}> = ({start, end, children}) => (
  <SceneCtx.Provider value={{start, end}}>{children}</SceneCtx.Provider>
);
/** Returns cue(phrase, nearSec?) → scene-local frame. nearSec is master-timeline seconds. */
export const useCues = () => {
  const {start, end} = useContext(SceneCtx);
  const cue = (phrase: string, near?: number, offset = 0) => Math.round((phraseAt(phrase, near ?? start + 20, near === undefined ? Math.max(60, end - start + 5) : 40) - start) * FPS) + offset;
  const sec = (s: number) => Math.round((s - start) * FPS); // absolute master seconds → local frame
  return Object.assign(cue, {sec, len: Math.round((end - start) * FPS)});
};

/* ------------------------------------------------------------------ camera + parallax */
export type Cam = {x: number; y: number; z: number; r?: number};
export type CamKey = Cam & {at: number; dur?: number};

/** Camera path: holds at each key, moves over `dur` frames into the next key. */
export const camAt = (f: number, keys: CamKey[]): Required<Cam> => {
  let cur: Required<Cam> = {x: keys[0].x, y: keys[0].y, z: keys[0].z, r: keys[0].r ?? 0};
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    const t = prog(f, k.at, k.dur ?? 45, E.cam);
    if (t <= 0) break;
    cur = {x: lerp(cur.x, k.x, t), y: lerp(cur.y, k.y, t), z: lerp(cur.z, k.z, t), r: lerp(cur.r, k.r ?? 0, t)};
  }
  return cur;
};

const CamCtx = createContext<Required<Cam>>({x: 0, y: 0, z: 1, r: 0});
/** A world whose origin is the frame centre; `keys` drive the camera. Children use <Layer depth>. */
export const World: React.FC<{keys: CamKey[]; children: React.ReactNode; drift?: boolean}> = ({keys, children, drift = true}) => {
  const f = useCurrentFrame();
  const c = camAt(f, keys);
  // gentle hand-held drift so the camera is never dead-still
  const dx = drift ? Math.sin(f / 97) * 6 + Math.sin(f / 41) * 2 : 0;
  const dy = drift ? Math.cos(f / 83) * 5 : 0;
  return <CamCtx.Provider value={{...c, x: c.x + dx, y: c.y + dy}}>{children}</CamCtx.Provider>;
};
/** depth 1 = moves with the world; <1 = far background (slower, smaller); >1 = foreground. */
export const Layer: React.FC<{depth?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({depth = 1, children, style}) => {
  const c = useContext(CamCtx);
  const z = 1 + (c.z - 1) * depth;
  return (
    <AbsoluteFill style={{transform: `translate(960px, 540px) rotate(${c.r * depth}deg) scale(${z}) translate(${-c.x * depth}px, ${-c.y * depth}px)`, transformOrigin: '0 0', ...style}}>
      {children}
    </AbsoluteFill>
  );
};
/** Place children at world coords (centred). */
export const At: React.FC<{x: number; y: number; children: React.ReactNode; w?: number; h?: number; style?: React.CSSProperties}> = ({x, y, children, w = 0, h = 0, style}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w || undefined, height: h || undefined, ...style}}>{children}</div>
);

/* ------------------------------------------------------------------ backgrounds */
export const NightSky: React.FC<{tint?: string; light?: boolean}> = ({tint = C.navy, light}) => {
  const f = useCurrentFrame();
  const a = Math.sin(f / 180) * 8;
  if (light) {
    return <AbsoluteFill style={{background: `radial-gradient(1400px 900px at ${45 + a / 4}% 40%, #FFFFFF 0%, ${C.paper} 55%, ${C.paper2} 100%)`}} />;
  }
  return (
    <AbsoluteFill style={{background: `radial-gradient(1500px 1000px at ${50 + a / 3}% 35%, ${tint} 0%, ${C.night} 70%)`}}>
      <AbsoluteFill style={{background: `radial-gradient(900px 600px at ${80 - a}% 90%, rgba(59,123,255,0.18), transparent 70%)`}} />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.055}) => {
  const f = useCurrentFrame();
  const ox = (f * 137) % 512, oy = (f * 71) % 512;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity, mixBlendMode: 'overlay', backgroundImage: `url(${staticFile('grain.png')})`, backgroundPosition: `${ox}px ${oy}px`}}>
      <Img src={staticFile('grain.png')} style={{display: 'none'}} />
    </AbsoluteFill>
  );
};
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.45}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`}} />
);
