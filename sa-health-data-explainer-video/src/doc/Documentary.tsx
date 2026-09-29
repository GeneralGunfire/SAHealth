import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {resolveBeats} from './engine';
import {TEMPLATES} from './templates';
import {F, GROUND, K} from './theme';
import {EO, Grain, p01} from './kit';

const OVERLAP = 10;

/** Entry: background + content cross-dissolve in, slow camera push across the beat. */
const Shell: React.FC<{dur: number; bg: string; children: React.ReactNode}> = ({dur, bg, children}) => {
  const f = useCurrentFrame();
  const inP = p01(f, 0, OVERLAP + 4, EO);
  const s = interpolate(f, [0, dur + OVERLAP], [1.0, 1.028]);
  return (
    <AbsoluteFill style={{background: bg, opacity: inP}}>
      <AbsoluteFill style={{transform: `scale(${s}) translateY(${(1 - inP) * 12}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Small running chapter label, top-left. */
const RunningHead: React.FC<{n: number; title: string; color: string; accent: string}> = ({n, title, color, accent}) => (
  <div style={{position: 'absolute', left: 120, top: 70, display: 'flex', alignItems: 'center', gap: 16, fontFamily: F.body, fontSize: 19, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color, opacity: 0.8}}>
    <span style={{fontFamily: F.mono, fontWeight: 500, color: accent}}>{String(n).padStart(2, '0')}</span>
    <span style={{width: 26, height: 2, background: color, opacity: 0.6}} />
    {title}
  </div>
);

export const Documentary: React.FC = () => {
  const beats = resolveBeats();
  return (
    <AbsoluteFill style={{background: K.paper}}>
      {beats.map((b, i) => {
        const T = TEMPLATES[b.t] as React.FC<Record<string, unknown>>;
        const G = GROUND[b.g];
        return (
          <Sequence key={i} from={b.from} durationInFrames={b.dur + OVERLAP} name={`${i} ${b.t}`}>
            <Shell dur={b.dur} bg={G.bg}>
              <T {...b.props} g={b.g} len={b.dur} />
              {b.chapter && b.t !== 'Chapter' && <RunningHead n={b.chapter.n} title={b.chapter.title} color={G.sub} accent={b.g === 'paper' ? K.blue : K.yellow} />}
            </Shell>
          </Sequence>
        );
      })}
      <Grain />
      <Audio src={staticFile('audio/doc_mix.m4a')} />
    </AbsoluteFill>
  );
};
