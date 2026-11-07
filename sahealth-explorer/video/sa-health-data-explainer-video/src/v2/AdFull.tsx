import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FPS, phraseAt} from './core';
import {Shell, SHOTS, XF} from './AdFilm';
import {AD_TEMPLATES} from './adTemplates';
import {resolveBeats, DURATION_SEC} from '../doc/engine';
import {Subtitles} from './subs';

/** Full documentary: hand-built opening shots, then every resolved beat in ad style. */
const OPEN_END = 146; // "and it is a vast ecosystem" — Part one begins
export const FULL_DURATION = DURATION_SEC;

export const AdFull: React.FC = () => {
  const beats = resolveBeats().filter((b) => b.from >= OPEN_END * FPS - 30);
  const firstBeat = beats[0].from;
  const shotTimes = SHOTS.map((s) => Math.round((typeof s.at === 'number' ? s.at : phraseAt(s.at[0], s.at[1])) * FPS));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => {
        const from = shotTimes[i];
        const to = i + 1 < SHOTS.length ? shotTimes[i + 1] : firstBeat;
        return (
          <Sequence key={'s' + i} from={from} durationInFrames={Math.max(1, to - from) + XF} name={`open ${i}`}>
            <Shell dur={to - from}>{s.render()}</Shell>
          </Sequence>
        );
      })}
      {beats.map((b, i) => {
        const T = AD_TEMPLATES[b.t] ?? AD_TEMPLATES.Headline;
        return (
          <Sequence key={'b' + i} from={b.from} durationInFrames={b.dur + XF} name={`${i} ${b.t}`}>
            <Shell dur={b.dur}><T {...(b.props as Record<string, unknown>)} len={b.dur} /></Shell>
          </Sequence>
        );
      })}
      <Subtitles />
      <Audio src={staticFile('audio/doc_mix.m4a')} />
    </AbsoluteFill>
  );
};
