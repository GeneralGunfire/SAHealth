import React from 'react';
import {Composition} from 'remotion';
import {Film, SAMPLE_END, DURATION as FILM_DUR} from './v2/Film';
import {AdFilm, TEST_END} from './v2/AdFilm';
import {AdFull, FULL_DURATION} from './v2/AdFull';

const FPS = 30, W = 1920, H = 1080;

export const Root: React.FC = () => (
  <>
    <Composition id="Full" component={AdFull} durationInFrames={Math.ceil(FULL_DURATION * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="AdTestSubs" component={AdFilm} defaultProps={{subs: true}} durationInFrames={TEST_END * FPS} fps={FPS} width={W} height={H} />
    <Composition id="AdTest" component={AdFilm} durationInFrames={TEST_END * FPS} fps={FPS} width={W} height={H} />
    <Composition id="Film" component={Film} durationInFrames={Math.ceil(FILM_DUR * FPS)} fps={FPS} width={W} height={H} />
    <Composition id="FilmSample" component={Film} durationInFrames={SAMPLE_END * FPS} fps={FPS} width={W} height={H} />
  </>
);
