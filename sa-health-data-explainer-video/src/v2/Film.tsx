import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import meta from '../../public/data/doc_meta.json';
import {FPS, Grain, phraseAt, SceneTime} from './core';
import {S01_Open} from './scenes/S01_Open';
import {S03_Landscape, S04_Streams} from './scenes/S03_Landscape';

/** Scene table: each scene starts at a spoken phrase (master-timeline seconds, `near`). */
type SceneDef = {C: React.FC; start: number | [string, number]};
const SCENES: SceneDef[] = [
  {C: S01_Open, start: 0},
  {C: S03_Landscape, start: ['and it is a vast ecosystem', 146]},
  {C: S04_Streams, start: ['the best way I can visualize', 227]},
  // sample ends here; next scene boundary:
  {C: () => null, start: ['start our journey', 290]},
];

const OVERLAP = 16; // frames of cross-dissolve between scenes
export const DURATION: number = (meta as {duration: number}).duration;

export const resolveScenes = () => {
  const t = SCENES.map((s) => (typeof s.start === 'number' ? s.start : phraseAt(s.start[0], s.start[1])));
  return SCENES.map((s, i) => ({C: s.C, start: t[i], end: i + 1 < t.length ? t[i + 1] : DURATION}));
};

export const Film: React.FC = () => {
  const scenes = resolveScenes();
  return (
    <AbsoluteFill style={{background: '#070B16'}}>
      {scenes.map(({C: Scene, start, end}, i) => (
        <Sequence key={i} from={Math.round(start * FPS)} durationInFrames={Math.round((end - start) * FPS) + OVERLAP} name={`scene ${i}`}>
          <SceneTime start={start} end={end}>
            <Scene />
          </SceneTime>
        </Sequence>
      ))}
      <Grain />
      <Audio src={staticFile('audio/doc_mix.m4a')} />
    </AbsoluteFill>
  );
};
export const SAMPLE_END = 290;
