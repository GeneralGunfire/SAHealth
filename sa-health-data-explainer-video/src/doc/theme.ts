import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMono} from '@remotion/google-fonts/IBMPlexMono';
import {loadFont as loadSerif} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadHand} from '@remotion/google-fonts/Kalam';

export const F = {
  body: loadInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily,
  head: loadTight('normal', {weights: ['600', '700', '800', '900'], subsets: ['latin']}).fontFamily,
  mono: loadMono('normal', {weights: ['400', '500', '600'], subsets: ['latin']}).fontFamily,
  serif: loadSerif('normal', {weights: ['400', '600'], subsets: ['latin']}).fontFamily,
  hand: loadHand('normal', {weights: ['400'], subsets: ['latin']}).fontFamily,
};

/** Vox-leaning palette: paper, ink, navy, electric blue, highlighter yellow. Red only for "where it breaks". */
export const K = {
  paper: '#F3F0E8',
  paper2: '#E7E2D6',
  ink: '#0F1012',
  ink2: '#3B3D42',
  mute: '#8A867D',
  line: '#CFC9BC',
  navy: '#0B1B36',
  navy2: '#13284D',
  blue: '#2F5BFF',
  blueSoft: '#A9BCFF',
  yellow: '#FFE14D',
  red: '#E5412F',
  white: '#FFFFFF',
};

export type Ground = 'paper' | 'ink' | 'navy' | 'blue';
export const GROUND: Record<Ground, {bg: string; fg: string; sub: string; line: string; accent: string}> = {
  paper: {bg: K.paper, fg: K.ink, sub: K.ink2, line: K.line, accent: K.blue},
  ink: {bg: K.ink, fg: '#F2EFE8', sub: '#9C988F', line: '#2E3035', accent: K.yellow},
  navy: {bg: K.navy, fg: '#EEF2FF', sub: '#8FA0C4', line: '#233B66', accent: K.yellow},
  blue: {bg: K.blue, fg: '#FFFFFF', sub: '#D6DEFF', line: '#5B7DFF', accent: K.yellow},
};
