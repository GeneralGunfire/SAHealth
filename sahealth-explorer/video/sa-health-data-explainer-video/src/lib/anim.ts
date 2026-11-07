import {Easing, interpolate} from 'remotion';

const OUT = Easing.bezier(0.16, 1, 0.3, 1); // expo-ish out: fast start, soft landing
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** 0 → 1 eased, starting at `at`, over `dur` frames. */
export const ein = (frame: number, at: number, dur = 18, ease = OUT) =>
  interpolate(frame, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** 1 → 0 eased, starting at `at`. */
export const eout = (frame: number, at: number, dur = 14) =>
  1 - interpolate(frame, [at, at + dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: INOUT});

export const inout = (frame: number, at: number, dur = 24) => ein(frame, at, dur, INOUT);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Visible window: fades in at `a`, out at `b` (b optional). */
export const win = (frame: number, a: number, b?: number, dIn = 14, dOut = 12) =>
  Math.min(ein(frame, a, dIn), b === undefined ? 1 : eout(frame, b, dOut));

/** Keyframed value: keys [[frame, value], ...] with in-out easing between. */
export const keys = (frame: number, k: [number, number][]) => {
  if (frame <= k[0][0]) return k[0][1];
  for (let i = 0; i < k.length - 1; i++) {
    const [f0, v0] = k[i];
    const [f1, v1] = k[i + 1];
    if (frame <= f1) return lerp(v0, v1, INOUT(Math.min(1, (frame - f0) / Math.max(1, f1 - f0))));
  }
  return k[k.length - 1][1];
};

export const fmt = (n: number) => Math.round(n).toLocaleString('en-ZA').replace(/ /g, ' ');

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
/** Blend two #rrggbb colours. */
export const mix = (a: string, b: string, t: number) => {
  const A = hex(a), B = hex(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
};
