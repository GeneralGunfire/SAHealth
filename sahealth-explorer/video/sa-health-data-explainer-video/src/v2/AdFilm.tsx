import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {E, FONT, FPS, phraseAt, prog, springAt} from './core';
import {BlackCard, Chip, Glass, GRAD, GRAD_TOP, Hero, HeroCaption, LightLine, Stage, UiLine} from './ad';
import {Subtitles} from './subs';

/* ------------------------------------------------------------ shots (hero objects) */
const RecordPanel: React.FC<{fade?: boolean}> = ({fade}) => {
  const f = useCurrentFrame();
  const o = fade ? 1 - prog(f, 20, 50) : 1;
  return (
    <Hero>
      <div style={{position: 'relative'}}>
        <Glass w={560} h={360} style={{opacity: fade ? 0.25 + 0.75 * o : 1, borderStyle: fade && o < 0.5 ? 'dashed' : 'solid'}}>
          <div style={{padding: 34, opacity: o}}>
            <div style={{fontFamily: FONT.body, fontSize: 22, color: 'rgba(210,225,255,0.8)', marginBottom: 14}}>Patient history</div>
            <UiLine w={330} grad />
            <UiLine w={420} at={6} />
            <UiLine w={280} at={10} />
            <UiLine w={380} at={14} />
            <UiLine w={220} at={18} />
          </div>
        </Glass>
        {!fade && (
          <>
            <div style={{position: 'absolute', left: -210, top: 40}}><Chip text="Allergies" at={10} tone="amber" /></div>
            <div style={{position: 'absolute', right: -240, top: 70}}><Chip text="Medication" at={40} /></div>
            <div style={{position: 'absolute', left: -170, top: 250}}><Chip text="Heart condition" at={70} tone="red" /></div>
          </>
        )}
      </div>
    </Hero>
  );
};

const Trail: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 0, 90, E.inOut);
  const d = 'M 460 640 C 700 300, 900 780, 1160 480 S 1500 380, 1560 420';
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs><linearGradient id="tr" x1="460" x2="1560" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#4285F4" /><stop offset="0.5" stopColor="#34A853" /><stop offset="1" stopColor="#FBBC05" /></linearGradient></defs>
        <path d={d} fill="none" stroke="url(#tr)" strokeWidth={3} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} strokeLinecap="round" style={{filter: 'drop-shadow(0 0 10px rgba(66,133,244,0.7))'}} />
        {[0.2, 0.45, 0.7].map((t, i) => p > t && <circle key={i} cx={[640, 1010, 1330][i]} cy={[470, 610, 430][i]} r={7} fill="#E6EEFF" style={{filter: 'drop-shadow(0 0 10px #6FA3FF)'}} />)}
      </svg>
      <div style={{position: 'absolute', left: 460 - 14, top: 640 - 14, width: 28, height: 28, borderRadius: 14, background: '#6FA3FF', boxShadow: '0 0 30px 8px rgba(66,133,244,0.7)'}} />
    </AbsoluteFill>
  );
};

const IdCard: React.FC = () => (
  <Hero>
    <Glass w={620} h={340} strong>
      <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 8, background: GRAD}} />
      <div style={{display: 'flex', gap: 34, padding: '52px 44px'}}>
        <div style={{width: 150, height: 150, borderRadius: 75, background: 'linear-gradient(160deg, rgba(111,163,255,0.5), rgba(30,60,170,0.6))', border: '2px solid rgba(160,195,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width={80} height={80} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="#DCE7FF" strokeWidth="1.4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="none" stroke="#DCE7FF" strokeWidth="1.4" /></svg>
        </div>
        <div>
          <div style={{fontFamily: FONT.body, fontSize: 58, fontWeight: 500, color: '#fff'}}>Nomsa</div>
          <div style={{fontFamily: FONT.body, fontSize: 24, color: 'rgba(210,225,255,0.75)', marginTop: 6}}>Hypothetical patient</div>
          <UiLine w={260} grad at={10} />
          <UiLine w={200} at={16} />
        </div>
      </div>
    </Glass>
  </Hero>
);

const Tiles: React.FC = () => {
  const f = useCurrentFrame();
  const items = ['Pulse', 'Blood test', 'Diagnosis', 'Prescription'];
  return (
    <AbsoluteFill style={{perspective: 1600}}>
      <div style={{position: 'absolute', left: 960, top: 440, transform: 'translate(-50%, -50%) rotateX(18deg)', display: 'flex', gap: 34}}>
        {items.map((t, i) => {
          const s = springAt(f, i * 26, {damping: 15, stiffness: 120});
          return (
            <div key={i} style={{transform: `translateY(${(1 - s) * 80 + Math.sin(f / 30 + i) * 6}px)`, opacity: Math.min(1, s * 1.5)}}>
              <Glass w={260} h={300}>
                <div style={{padding: 26}}>
                  <div style={{width: 46, height: 46, borderRadius: 12, background: GRAD_TOP, marginBottom: 26}} />
                  <div style={{fontFamily: FONT.body, fontSize: 30, fontWeight: 500, color: '#fff'}}>{t}</div>
                  <UiLine w={170} at={i * 26 + 16} />
                  <UiLine w={120} at={i * 26 + 20} />
                </div>
              </Glass>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ the shot list */
type Shot = {at: [string, number] | number; render: () => React.ReactNode};
export const SHOTS: Shot[] = [
  {at: 0, render: () => <BlackCard text="An emergency room." />},
  {at: ['barely conscious', 4], render: () => <BlackCard text="You're barely conscious." />},
  {at: ['severe accident', 6], render: () => <BlackCard text="A severe accident." />},
  {at: ['doctors surrounding', 14], render: () => <BlackCard text="Seconds to decide." />},
  {at: ['they need to know your story', 22], render: () => <BlackCard text="They need your story." />},
  {at: ['allergic to penicillin', 26], render: () => <Stage><RecordPanel /><HeroCaption text="Your medical history." /></Stage>},
  {at: ['physical matter', 35], render: () => <BlackCard text="Your body is on the table." />},
  {at: ['entirely invisible', 41], render: () => <Stage><RecordPanel fade /><HeroCaption text="Your history is invisible." /></Stage>},
  {at: ["welcome to today's deep dive", 46], render: () => <Stage><AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}><div style={{transform: 'translateY(-40px)'}}><Title /></div></AbsoluteFill></Stage>},
  {at: ['tracking a ghost', 56], render: () => <BlackCard text="A ghost in the machine." />},
  {at: ['trail of a single', 62], render: () => <Stage><Trail /><HeroCaption text="One patient's data trail." at={20} /></Stage>},
  {at: ['call her', 66], render: () => <Stage><IdCard /><HeroCaption text="Meet Nomsa." /></Stage>},
  {at: ['life blood', 71], render: () => <BlackCard text="Data is the lifeblood of healthcare." />},
  {at: ['every single time a pulse', 85], render: () => <BlackCard text="A pulse. A blood test. A diagnosis." />},
  {at: ['data is born', 91], render: () => <BlackCard text="Every visit creates data." />},
  {at: ['where does it go', 94], render: () => <BlackCard text="Where does it go?" />},
  {at: ['does it survive', 97], render: () => <BlackCard text="Does it survive?" />},
  {at: ['does it travel', 98], render: () => <BlackCard text="Does it travel with her?" />},
  {at: ['ground rule', 106], render: () => <BlackCard text="One ground rule." />},
  {at: ['purely as observers', 111], render: () => <BlackCard text="First, we observe." />},
  {at: ['intricate machine', 117], render: () => <BlackCard text="We map the system as it is." />},
  {at: ['save all the major revelations', 133], render: () => <BlackCard text="The critique comes last." />},
];

const Title: React.FC = () => {
  const f = useCurrentFrame();
  const p = prog(f, 20, 30, E.out);
  return (
    <div style={{textAlign: 'center', fontFamily: FONT.body, fontWeight: 400, fontSize: 56, color: '#F2F5FF', opacity: p, filter: `blur(${(1 - p) * 10}px)`, lineHeight: 1.25}}>
      How patient data moves<br />through South African healthcare.
    </div>
  );
};

export const XF = 10; // blur cross-dissolve frames
export const Shell: React.FC<{children: React.ReactNode; dur: number}> = ({children, dur}) => {
  const f = useCurrentFrame();
  const i = prog(f, 0, XF, E.out);
  const o = prog(f, dur, XF, E.inOut);
  return <AbsoluteFill style={{opacity: i * (1 - o), filter: i < 1 || o > 0 ? `blur(${(1 - i) * 12 + o * 12}px)` : undefined}}>{children}</AbsoluteFill>;
};

export const TEST_END = 140;
export const AdFilm: React.FC<{subs?: boolean}> = ({subs}) => {
  const times = SHOTS.map((s) => (typeof s.at === 'number' ? s.at : phraseAt(s.at[0], s.at[1])));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => {
        const from = Math.round(times[i] * FPS);
        const to = Math.round((i + 1 < SHOTS.length ? times[i + 1] : TEST_END) * FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from + XF} name={`shot ${i}`}>
            <Shell dur={to - from}>{s.render()}</Shell>
          </Sequence>
        );
      })}
      {subs && <Subtitles />}
      <Audio src={staticFile('audio/doc_mix.m4a')} />
    </AbsoluteFill>
  );
};
