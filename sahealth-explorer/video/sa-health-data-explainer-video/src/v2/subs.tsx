import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import words from '../../public/data/doc_words.json';
import {FONT, FPS} from './core';

/** Groups transcript words into short subtitle lines (max ~42 chars, split on pauses/punctuation). */
type W = {w: string; s: number};
const WORDS = words as W[];
type Cue = {from: number; to: number; text: string};
/** Joins tokens, gluing fragments the transcriber split off ("9" ".17", "TIR" ".NET", "2" ",000"). */
const joinWords = (ws: string[]) => ws.reduce((acc, w, i) => (i && /^[.,][A-Za-z0-9]/.test(w) ? acc + w : acc + (i ? ' ' : '') + w), '');
export const CUES: Cue[] = (() => {
  const out: Cue[] = [];
  let cur: W[] = [];
  const flush = (next?: W) => {
    if (!cur.length) return;
    const last = cur[cur.length - 1];
    const end = Math.min(next ? next.s - 0.05 : last.s + 1.2, last.s + Math.max(0.6, last.w.length * 0.07) + 0.6);
    out.push({from: cur[0].s, to: end, text: joinWords(cur.map((x) => x.w))});
    cur = [];
  };
  for (let i = 0; i < WORDS.length; i++) {
    const w = WORDS[i];
    const prev = cur[cur.length - 1];
    const len = cur.map((x) => x.w).join(' ').length;
    if (prev && (w.s - prev.s > 1.1 || len + w.w.length > 42 || /[.?!]$/.test(prev.w))) flush(w);
    cur.push(w);
  }
  flush();
  return out;
})();

export const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = CUES.find((x) => t >= x.from && t < x.to);
  if (!c) return null;
  const age = t - c.from;
  const o = Math.min(1, age / 0.12, (c.to - t) / 0.12);
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 58, pointerEvents: 'none'}}>
      <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 36, color: '#FFFFFF', opacity: o, padding: '8px 20px', borderRadius: 10,
        background: 'rgba(0,0,0,0.55)', textShadow: '0 1px 2px rgba(0,0,0,0.6)', letterSpacing: '0.005em', maxWidth: 1300, textAlign: 'center'}}>
        {c.text}
      </div>
    </AbsoluteFill>
  );
};
