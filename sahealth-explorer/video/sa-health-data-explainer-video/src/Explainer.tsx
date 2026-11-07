import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {planScenes, SceneProvider} from './lib/timing';
import {Background, ChapterCard, ChapterTag, SceneFade} from './components/primitives';
import {inout} from './lib/anim';
import {SCENES} from './scenes';

const SECTIONS = ['The landscape', 'The clinic', 'The laboratory', 'Medicines', 'The hospital', 'Emergencies', 'The private side', 'How a doctor finds out', 'Where it breaks'];
const DARK_SECTION = 'Where it breaks';

export const Explainer: React.FC = () => {
  const plans = planScenes();
  const f = useCurrentFrame();
  const darkStart = plans.find((p) => p.section === DARK_SECTION)!.from;
  const dark = inout(f, darkStart, 20);
  return (
    <AbsoluteFill>
      <Background dark={dark} />
      {plans.map((plan) => {
        const Scene = SCENES[plan.id];
        if (!Scene) throw new Error(`No scene component for ${plan.id}`);
        const num = SECTIONS.indexOf(plan.section) + 1;
        const isDark = plan.section === DARK_SECTION;
        return (
          <Sequence key={plan.id} from={plan.from} durationInFrames={plan.frames} name={plan.id}>
            <SceneProvider plan={plan}>
              {plan.chapter && (
                <Sequence durationInFrames={plan.lead + 6}>
                  <ChapterCard num={num} title={plan.chapter} frames={plan.lead + 6} dark={isDark} />
                </Sequence>
              )}
              <Sequence from={plan.chapter ? plan.lead - 4 : 0} layout="none">
                {num > 0 && <ChapterTag num={num} title={plan.section} dark={isDark} at={plan.chapter ? 0 : -100} />}
              </Sequence>
              <SceneFade frames={plan.frames}>
                <Scene frames={plan.frames} />
              </SceneFade>
              <Sequence from={plan.lead}>
                <Audio src={staticFile(`audio/${plan.id}.mp3`)} />
              </Sequence>
            </SceneProvider>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
