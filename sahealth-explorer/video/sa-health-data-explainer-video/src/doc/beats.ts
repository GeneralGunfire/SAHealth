import meta from '../../public/data/doc_meta.json';
import type {Ground} from './theme';
import type {TemplateName} from './templates';
import {PART1} from './beats_part1';
import {PART2_LOCAL} from './beats_part2';
import {PART3_LOCAL} from './beats_part3';

/** One visual beat. `at` = spoken phrase (resolved near `near` seconds) or absolute seconds. */
export type BeatSpec = {t: TemplateName; at: string | number; near?: number; g?: Ground; lead?: number; [k: string]: unknown};

type Seg = {part: string; from: number; to: number; offset: number};
const SEGS = ((meta as {segments?: Seg[]}).segments ?? []);

/** Map part-local seconds onto the master timeline via the splice table. */
const toMaster = (part: string, t: number) => {
  const s = SEGS.find((x) => x.part === part && t >= x.from - 1 && t <= x.to + 1) ?? SEGS.find((x) => x.part === part);
  return s ? s.offset + (t - s.from) : t;
};
const shift = (part: string, beats: BeatSpec[]): BeatSpec[] =>
  beats.map((b) => ({...b, near: toMaster(part, b.near ?? 0), at: typeof b.at === 'number' ? toMaster(part, b.at) : b.at}));

export const BEATS: BeatSpec[] = SEGS.length ? [...shift('part1', PART1), ...shift('part2', PART2_LOCAL), ...shift('part3', PART3_LOCAL)] : [...PART1];
