import React, {createContext, useContext} from 'react';
import timings from '../../public/data/timings.json';
import {FPS} from '../theme';

export type Word = {w: string; t: number};
export type SceneTiming = {id: string; section: string; duration: number; words: Word[]};

export const TIMINGS = timings as {gapAfterSceneSec: number; scenes: SceneTiming[]};

/** Frames of silence before narration, used for chapter cards at section changes. */
export const CHAPTER_LEAD = Math.round(1.5 * FPS);
export const TAIL = Math.round(TIMINGS.gapAfterSceneSec * FPS);

export type ScenePlan = SceneTiming & {from: number; lead: number; frames: number; chapter: string | null};

export const planScenes = (): ScenePlan[] => {
  let from = 0;
  let prevSection = '';
  return TIMINGS.scenes.map((s) => {
    const chapter = s.section !== prevSection && s.section !== 'Intro' ? s.section : null;
    prevSection = s.section;
    const lead = chapter ? CHAPTER_LEAD : 0;
    const frames = lead + Math.ceil(s.duration * FPS) + TAIL;
    const plan = {...s, from, lead, frames, chapter};
    from += frames;
    return plan;
  });
};

export const totalFrames = () => planScenes().reduce((a, s) => a + s.frames, 0);

const Ctx = createContext<ScenePlan | null>(null);
export const SceneProvider: React.FC<{plan: ScenePlan; children: React.ReactNode}> = ({plan, children}) => (
  <Ctx.Provider value={plan}>{children}</Ctx.Provider>
);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Returns a function mapping a spoken phrase to the scene-local frame at which it starts.
 * Phrases match across token boundaries ("H P R S" == "HPRS", "August 2025").
 * Throws on a miss so that a typo in a cue can never silently mistime a visual.
 */
export const useCue = () => {
  const plan = useContext(Ctx);
  if (!plan) throw new Error('useCue outside SceneProvider');
  const toks = plan.words.map((w) => norm(w.w));
  const cue = (phrase: string, nth = 1, offsetFrames = 0): number => {
    const target = norm(phrase);
    let seen = 0;
    for (let i = 0; i < toks.length; i++) {
      let acc = '';
      for (let j = i; j < toks.length && acc.length < target.length; j++) {
        acc += toks[j];
        // exact, or the final word continues past the phrase ("what" ~ "what's")
        if (acc === target || (acc.length > target.length && acc.startsWith(target) && acc.length - toks[j].length < target.length)) {
          seen++;
          if (seen === nth) return plan.lead + Math.round(plan.words[i].t * FPS) + offsetFrames;
          break;
        }
        if (!target.startsWith(acc)) break;
      }
    }
    throw new Error(`Cue "${phrase}" (#${nth}) not found in ${plan.id}`);
  };
  /** frame at which narration ends */
  const end = plan.lead + Math.ceil(plan.duration * FPS);
  return Object.assign(cue, {end, frames: plan.frames, lead: plan.lead});
};
