import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMono} from '@remotion/google-fonts/IBMPlexMono';
import {loadFont as loadHand} from '@remotion/google-fonts/Kalam';

export const FONT = {
  body: loadInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily,
  display: loadTight('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']}).fontFamily,
  mono: loadMono('normal', {weights: ['400', '500', '600'], subsets: ['latin']}).fontFamily,
  hand: loadHand('normal', {weights: ['400', '700'], subsets: ['latin']}).fontFamily,
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// Editorial palette: warm paper ground, near-black ink, one colour per "world".
export const C = {
  paper: '#EFEBE3',
  paperDeep: '#E6E0D4',
  card: '#FBF9F5',
  ink: '#16181D',
  ink2: '#3A3D44',
  muted: '#7A756C',
  rule: '#CFC8BA',
  public: '#1E6E75', // public sector
  publicSoft: '#CFE3E1',
  private: '#C4583E', // private sector
  privateSoft: '#F1D6CC',
  manila: '#D8C39A', // paper records
  manilaDark: '#A88F5E',
  agg: '#4F5FA8', // aggregate / statistics
  aggSoft: '#D9DCEF',
  marker: '#F4C84A', // highlighter
  red: '#D23A3A',
  // "Where it breaks" dark section
  night: '#121317',
  nightCard: '#1D1F25',
  nightRule: '#33363F',
  nightInk: '#ECE8DF',
  nightMuted: '#8D8A84',
};
