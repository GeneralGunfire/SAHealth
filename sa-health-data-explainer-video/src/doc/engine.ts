import words from '../../public/data/doc_words.json';
import meta from '../../public/data/doc_meta.json';
import {BEATS, BeatSpec} from './beats';
import type {Ground} from './theme';
import type {TemplateName} from './templates';

export const FPS = 30;
type W = {w: string; s: number};
const WORDS = words as W[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const TOKS = WORDS.map((w) => norm(w.w));

export const DURATION_SEC: number = (meta as {duration: number}).duration;

/** Time (s) of the occurrence of `phrase` closest to `near` (s), searching at/after `after`. */
export const findPhrase = (phrase: string, near: number, after = -1, window = 90): number => {
  const target = norm(phrase);
  let best = -1, bestD = Infinity;
  for (let i = 0; i < TOKS.length; i++) {
    const t = WORDS[i].s;
    if (t < after || Math.abs(t - near) > window) continue;
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
  if (best < 0) {
    const msg = `phrase "${phrase}" not found near ${near.toFixed(1)}s`;
    if ((globalThis as {COLLECT?: string[]}).COLLECT) { (globalThis as {COLLECT?: string[]}).COLLECT!.push(msg); return near; }
    throw new Error(msg);
  }
  return best;
};

export type Resolved = {t: TemplateName; g: Ground; from: number; dur: number; props: Record<string, unknown>; chapter?: {n: number; title: string}};

/** Converts nested `at` fields: phrase → local frame (searching from beat start), number → seconds offset. */
const localize = (v: unknown, start: number, end: number): unknown => {
  if (Array.isArray(v)) return v.map((x) => localize(x, start, end));
  if (v && typeof v === 'object') {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v)) {
      if ((k === 'at' || k.endsWith('At')) && typeof x === 'string') {
        o[k] = Math.max(0, Math.round((findPhrase(x, start + 5, start - 0.5, Math.max(30, end - start + 10)) - start) * FPS));
      } else if ((k === 'at' || k.endsWith('At')) && typeof x === 'number') {
        o[k] = Math.round(x * FPS);
      } else o[k] = localize(x, start, end);
    }
    return o;
  }
  return v;
};

let cache: Resolved[] | null = null;
export const resolveBeats = (): Resolved[] => {
  if (cache) return cache;
  const starts = BEATS.map((b) => (typeof b.at === 'number' ? b.at : findPhrase(b.at, b.near ?? 0, (b.near ?? 0) - 60, 60)));
  for (let i = 1; i < starts.length; i++) {
    if (starts[i] <= starts[i - 1]) throw new Error(`beat ${i} (${JSON.stringify(BEATS[i].at)}) starts at ${starts[i]} before previous ${starts[i - 1]}`);
  }
  let chapter: {n: number; title: string} | undefined;
  cache = BEATS.map((b: BeatSpec, i) => {
    const start = starts[i] - (b.lead ?? 0.15);
    const end = i + 1 < BEATS.length ? starts[i + 1] - (BEATS[i + 1].lead ?? 0.15) : DURATION_SEC;
    const {t, g, at, near, lead, ...rest} = b;
    if (t === 'Chapter') chapter = {n: rest.n as number, title: (rest.short as string) ?? (rest.title as string)};
    return {t, g: g ?? 'paper', from: Math.round(start * FPS), dur: Math.round((end - start) * FPS), props: localize(rest, starts[i], end) as Record<string, unknown>, chapter};
  });
  return cache;
};
