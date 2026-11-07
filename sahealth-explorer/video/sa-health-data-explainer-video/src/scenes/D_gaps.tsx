import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {useCue} from '../lib/timing';
import {ein, eout, fmt, lerp, win} from '../lib/anim';
import {Badge, Chip, DashWire, Drift, Kinetic, Label, Source, Text} from '../components/primitives';
import {SAMap} from '../components/props';
import {Icon, IconName} from '../components/Icon';
import type {SceneFC} from './A_intro_clinic';

const INK = C.nightInk;
const MUT = C.nightMuted;

/** Left-column problem header: big red number + title. */
const Head: React.FC<{n: number; title: string; at: number; sub?: string; subAt?: number}> = ({n, title, at, sub, subAt}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 18);
  return (
    <>
      <div style={{position: 'absolute', left: 110, top: 200, fontFamily: FONT.mono, fontWeight: 500, fontSize: 150, color: C.red, opacity: p, transform: `translateY(${(1 - p) * 30}px)`, lineHeight: 1}}>{String(n).padStart(2, '0')}</div>
      <Kinetic text={title} at={at + 4} x={112} y={390} width={720} size={76} color={INK} />
      {sub && <Text at={subAt ?? at + 20} x={114} y={600} width={680} size={30} color={MUT}>{sub}</Text>}
    </>
  );
};

/** Small node for the dark diagrams. */
const Node: React.FC<{icon: IconName; x: number; y: number; at: number; label?: string; color?: string; dim?: number; size?: number}> = ({icon, x, y, at, label, color = INK, dim = 0, size = 96}) => {
  const f = useCurrentFrame();
  const p = ein(f, at, 16);
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, opacity: p * (1 - dim * 0.75), transform: `scale(${0.8 + 0.2 * p})`}}>
      <div style={{width: size, height: size, borderRadius: size / 2, background: C.nightCard, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Icon name={icon} size={size * 0.5} color={color} stroke={1.7} />
      </div>
      {label && <div style={{position: 'absolute', top: size + 10, left: -100, width: size + 200, textAlign: 'center', fontFamily: FONT.body, fontWeight: 600, fontSize: 19, color: MUT}}>{label}</div>}
    </div>
  );
};

/* ============================================================ 18 · Transition */
export const S18: SceneFC = () => {
  const c = useCue();
  const f = useCurrentFrame();
  const crack = ein(f, c('breaks'), 12);
  return (
    <AbsoluteFill>
      <Kinetic text="That's how the system works." at={c("That's")} x={960} y={380} width={1600} size={44} color={MUT} align="center" weight={600} />
      <Kinetic text="Here's where it breaks." at={c("Here's")} x={960} y={450} width={1600} size={120} color={INK} align="center" />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d="M360 640 L620 610 L700 660 L900 600 L1010 650 L1200 590 L1330 640 L1560 605" fill="none" stroke={C.red} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
      </svg>
    </AbsoluteFill>
  );
};

/* ============================================================ 19 · No shared record */
export const S19: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const ring = ein(f, c('pull'), 50);
  const pieces: {icon: IconName; x: number; y: number; col: string; l: string}[] = [
    {icon: 'folder', x: 1000, y: 230, col: C.manila, l: 'Clinic folder'},
    {icon: 'hospital', x: 1640, y: 260, col: C.public, l: 'Provincial HIS'},
    {icon: 'flask', x: 1760, y: 620, col: C.aggSoft, l: 'Lab database'},
    {icon: 'card', x: 1500, y: 880, col: C.private, l: 'Scheme claims'},
    {icon: 'tablet', x: 1000, y: 860, col: C.private, l: 'Private EMR'},
  ];
  return (
    <Drift frames={frames} amount={0.02}>
      <Head n={1} title="No shared record" at={c('no shared')} sub="No national system lets a doctor pull a patient's history across provinces, or between public and private care." subAt={c('No national')} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <circle cx={1360} cy={560} r={60 + 190 * ring} fill="none" stroke={C.red} strokeWidth={3} opacity={win(f, c('pull')) * (1 - 0.6 * ring)} strokeDasharray="6 10" />
      </svg>
      <Node icon="doctor" x={1360} y={560} at={c('doctor')} color={INK} size={130} label="Doctor" />
      {pieces.map((p, i) => <Node key={i} icon={p.icon} x={p.x} y={p.y} at={c('information exists') + i * 4} color={p.col} label={p.l} />)}
      <Kinetic text="It just isn't where the doctor is." at={c('It just')} x={112} y={820} width={760} size={40} color={INK} hl={["isn't"]} hlColor={C.red} weight={700} />
    </Drift>
  );
};

/* ============================================================ 20 · Identity */
export const S20: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const dup = c('Duplicate');
  const bars = [
    {v: 68, l: 'HPRS patient records', val: '68 million +', cue: 'sixty-eight', col: C.red},
    {v: 62, l: 'Population (Census 2022)', val: '≈ 62 million', cue: 'population', col: MUT},
    {v: 32.5, l: 'Verified with Home Affairs', val: '≈ 32.5 million', cue: 'thirty-two', col: C.public},
  ];
  const variants = ['NOMSA  ·  ID ••••••••', 'NOMSA K.  ·  no ID recorded', 'N. K.  ·  different date of birth'];
  return (
    <Drift frames={frames} amount={0.02}>
      <Head n={2} title="Identity" at={c('identity')} />
      <AbsoluteFill style={{opacity: eout(f, dup - 6, 14)}}>
        {bars.map((b, i) => {
          const p = ein(f, c(b.cue), 30);
          return (
            <div key={i} style={{position: 'absolute', left: 900, top: 270 + i * 170, opacity: ein(f, c(b.cue), 10)}}>
              <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 24, color: MUT, marginBottom: 12}}>{b.l}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
                <div style={{height: 54, width: (b.v / 70) * 760 * p, background: b.col, borderRadius: 4}} />
                <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 40, color: INK}}>{b.val}</div>
              </div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 900 + (62 / 70) * 760, top: 250, width: 2, height: 540 * ein(f, c('more than the country'), 20), background: INK, opacity: 0.7}} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: win(f, dup)}}>
        <div style={{position: 'absolute', left: 900, top: 470}}>
          <svg width={120} height={120} viewBox="0 0 100 100"><circle cx="50" cy="28" r="17" fill={C.public} /><path d="M18 98 C18 66 32 52 50 52 C68 52 82 66 82 98 Z" fill={C.public} /></svg>
          <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 20, color: MUT, textAlign: 'center', width: 120}}>one person</div>
        </div>
        {variants.map((v, i) => {
          const at = c('several') + i * 6;
          const p = ein(f, at, 20);
          const y = 300 + i * 190;
          return (
            <React.Fragment key={i}>
              <DashWire id={`d${i}`} d={`M1030 530 C1150 530 1150 ${y + 50} 1260 ${y + 50}`} at={at} color={C.red} dur={16} />
              <div style={{position: 'absolute', left: 1270, top: y, width: 520, padding: '20px 24px', borderRadius: 12, background: C.nightCard, border: `1.5px solid ${C.nightRule}`, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                <div style={{fontFamily: FONT.body, fontSize: 14, fontWeight: 700, letterSpacing: '0.14em', color: C.red}}>PATIENT RECORD {i + 1}</div>
                <div style={{fontFamily: FONT.mono, fontSize: 22, color: INK, marginTop: 6}}>{v}</div>
                <div style={{height: 6, width: `${[70, 35, 20][i] * ein(f, c('split'), 20)}%`, background: C.public, marginTop: 12, borderRadius: 3}} />
              </div>
            </React.Fragment>
          );
        })}
        <Label text="illustrative · history split across records" at={c('split')} x={1270} y={880} color={MUT} size={16} />
      </AbsoluteFill>
      <Source dark text="NDoH, The Emerging South African Digital Health System (2025), ch. 10 · Stats SA Census 2022" at={c('sixty-eight')} />
    </Drift>
  );
};

/* ============================================================ 21 · Copying by hand */
export const S21: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const err = c('chance for error');
  const hops: {icon: IconName; l: string; v: string; cue: string}[] = [
    {icon: 'printer', l: 'SMS printer slip', v: '1 250', cue: 'printer'},
    {icon: 'folder', l: 'Paper folder', v: '1 250', cue: 'folder'},
    {icon: 'db', l: 'TIER.Net', v: '1 520', cue: 'TIER'},
  ];
  return (
    <Drift frames={frames} amount={0.02}>
      <Head n={3} title="Copying by hand" at={c('copying')} />
      {hops.map((h, i) => {
        const x = 980 + i * 300;
        const at = c(h.cue);
        const bad = i === 2 ? ein(f, err, 10) : 0;
        return (
          <React.Fragment key={i}>
            <Node icon={h.icon} x={x} y={430} at={at} color={i === 1 ? C.manila : INK} size={120} label={h.l} />
            <div style={{position: 'absolute', left: x - 90, top: 600, width: 180, textAlign: 'center', padding: '12px 0', borderRadius: 10, border: `2px solid ${bad > 0.5 ? C.red : C.nightRule}`, fontFamily: FONT.mono, fontSize: 34, color: bad > 0.5 ? C.red : INK, opacity: ein(f, at + 10, 12)}}>{h.v}</div>
            {i < 2 && <DashWire id={`c${i}`} d={`M${x + 70} 430 L${x + 230} 430`} at={c(hops[i + 1].cue) - 4} color={C.manila} dur={12} label="retyped" labelOffset={[0, -24]} />}
          </React.Fragment>
        );
      })}
      <Label text="illustrative transcription error" at={err + 6} x={1500} y={690} color={C.red} size={16} width={300} />
      <Kinetic text="Studies of TIER.Net have found patient outcomes misreported." at={c('Studies')} x={112} y={640} width={760} size={36} color={INK} weight={600} />
      <Source dark text="Misreporting of patient outcomes in the South African national HIV treatment database (PMC7154050) · TIER.Net data-quality assessment (medRxiv 2025)" at={c('Studies')} />
    </Drift>
  );
};

/* ============================================================ 22 · Paper */
export const S22: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const gone = c('lost');
  return (
    <Drift frames={frames} amount={0.02}>
      <Head n={4} title="Paper" at={c('paper')} />
      <Node icon="clinic" x={1000} y={330} at={c('one clinic')} color={C.public} size={120} label="Clinic A" />
      <Node icon="clinic" x={1620} y={330} at={c('another')} color={C.public} size={120} label="Clinic B" />
      <DashWire id="p1" d="M1080 330 L1540 330" at={c("can't be read")} color={C.manila} arrow={false} />
      <div style={{position: 'absolute', left: 1280, top: 300, opacity: ein(f, c("can't be read") + 14, 8)}}><Icon name="cross" size={60} color={C.red} stroke={3} /></div>
      {/* shelf with an empty slot */}
      <div style={{position: 'absolute', left: 1000, top: 620, display: 'flex', gap: 12, alignItems: 'flex-end', borderBottom: `4px solid ${MUT}`, paddingBottom: 2}}>
        {Array.from({length: 11}).map((_, i) => {
          const empty = i === 6;
          const ht = 170 + ((i * 37) % 40);
          return <div key={i} style={{width: 46, height: ht, borderRadius: 3, background: empty ? 'transparent' : C.manila, border: empty ? `3px dashed ${C.red}` : 'none', opacity: empty ? ein(f, gone, 10) : ein(f, c('folder') + i, 8) * (0.7 + 0.3 * (i % 2))}} />;
        })}
      </div>
      <Chip text="lost" at={gone} x={1000} y={860} color={C.red} size={22} />
      <Chip text="misfiled" at={c('misfiled')} x={1110} y={860} color={C.red} size={22} />
      <Chip text="not there when the patient is" at={c('not there')} x={1270} y={860} color={C.red} size={22} />
    </Drift>
  );
};

/* ============================================================ 23 · Provincial patchwork */
export const S23: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const a = c('Different');
  const cols: Record<string, string> = {'Western Cape': C.public, 'Eastern Cape': '#5E8C3A', 'Free State': '#8661AE', 'KwaZulu-Natal': '#CF8A2A', Gauteng: '#3B77AE'};
  const styles: Record<string, {fill?: string; at?: number; hatch?: boolean}> = {};
  Object.entries(cols).forEach(([k, v], i) => (styles[k] = {fill: v, at: a + i * 4}));
  ['Mpumalanga', 'North West', 'Limpopo', 'Northern Cape'].forEach((k, i) => (styles[k] = {hatch: true, at: c('four provinces') + i * 3}));
  return (
    <Drift frames={frames} amount={0.02}>
      <Head n={5} title="A provincial patchwork" at={c('provincial')} />
      <SAMap x={900} y={170} scale={0.9} at={0} base={C.nightCard} stroke={MUT} styles={styles} dark />
      <Chip text="no hospital patient system" at={c('no hospital')} x={112} y={640} color={C.red} size={24} />
      <Label text="4 of 9 provinces" at={c('four provinces')} x={116} y={720} color={INK} size={22} />
      <Source dark text="Parliamentary reply NW4495, 1 August 2025" at={a} />
    </Drift>
  );
};

/* ============================================================ 24 · Wrong kind of data */
export const S24: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const Pipe: React.FC<{y: number; at: number; name: string; good: string[]; bad: string[]; badAt: number; col: string}> = ({y, at, name, good, bad, badAt, col}) => {
    const p = ein(f, at, 24);
    return (
      <>
        <div style={{position: 'absolute', left: 900, top: y, width: 880 * p, height: 90, borderRadius: 45, border: `2px solid ${col}`, background: 'rgba(255,255,255,0.03)'}} />
        <div style={{position: 'absolute', left: 900, top: y - 44, fontFamily: FONT.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: col, opacity: p}}>{name}</div>
        {good.map((g, i) => {
          const t = ((f - at - i * 22) % 90) / 90;
          const show = f > at + 10 + i * 22;
          return <div key={i} style={{position: 'absolute', left: lerp(930, 1700, Math.max(0, t)), top: y + 22, padding: '6px 14px', borderRadius: 8, background: col, color: C.night, fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, opacity: show ? Math.min(1, t * 8, (1 - t) * 8) : 0}}>{g}</div>;
        })}
        {bad.map((b, i) => {
          const q = ein(f, badAt + i * 6, 16);
          return (
            <div key={i} style={{position: 'absolute', left: 900 + i * 210, top: y + 110, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 8, border: `2px solid ${C.red}`, color: C.red, fontFamily: FONT.body, fontWeight: 700, fontSize: 21, opacity: q, transform: `translateY(${(1 - q) * -20}px)`}}>
              <Icon name="cross" size={20} color={C.red} stroke={3} />{b}
            </div>
          );
        })}
      </>
    );
  };
  return (
    <Drift frames={frames} amount={0.02}>
      <Head n={6} title="The wrong kind of data" at={c('wrong kind')} />
      <Pipe y={260} at={c('D H I S 2')} name="DHIS2" good={['Σ 1 284', 'Σ 312', 'Σ 97']} bad={['patients']} badAt={c('not patients')} col={C.aggSoft} />
      <Pipe y={600} at={c('Claims')} name="CLAIMS" good={['I10', '0190', 'R •••']} bad={['results', 'notes']} badAt={c('not results')} col={C.privateSoft} />
      <Label text="illustrative values" at={c('Claims')} x={900} y={840} color={MUT} size={15} />
    </Drift>
  );
};

/* ============================================================ 25 · The wall */
export const S25: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const wall = ein(f, c('wall'), 20);
  const moves = c('moves between');
  const blind = ein(f, c('no single'), 20);
  const t = Math.max(0, f - moves);
  const px = 960 + Math.sin(t / 22) * 420 * ein(f, moves, 20);
  const left: {icon: IconName; l: string; y: number; cue: string}[] = [
    {icon: 'folder', l: 'Clinic folders', y: 260, cue: 'Public systems'},
    {icon: 'hospital', l: 'Provincial HIS', y: 460, cue: 'Public systems'},
    {icon: 'flask', l: 'NHLS', y: 660, cue: 'labs'},
    {icon: 'db', l: 'TIER.Net · DHIS2', y: 860, cue: 'Public systems'},
  ];
  const right: {icon: IconName; l: string; y: number; cue: string}[] = [
    {icon: 'tablet', l: 'Hospital-group EMRs', y: 260, cue: 'private hospital'},
    {icon: 'laptop', l: 'Practice software', y: 460, cue: 'private hospital'},
    {icon: 'flask', l: 'Private labs', y: 660, cue: 'labs'},
    {icon: 'card', l: 'Scheme claims', y: 860, cue: 'medical schemes'},
  ];
  return (
    <Drift frames={frames} amount={0.02}>
      <Kinetic text="The wall between sectors" at={c('finally')} x={960} y={110} width={1400} size={60} color={INK} align="center" />
      <div style={{position: 'absolute', left: 950, top: 220, width: 20, height: 780 * wall, background: C.nightRule, borderRadius: 4}} />
      <Label text="Public" at={c('Public systems')} x={420} y={190} color={C.public} size={24} align="center" width={300} />
      <Label text="Private" at={c('private hospital')} x={1500} y={190} color={C.private} size={24} align="center" width={300} />
      {left.map((n, i) => <Node key={i} icon={n.icon} x={420 + (i % 2) * 140} y={n.y} at={c(n.cue) + i * 3} color={C.public} label={n.l} size={90} dim={blind} />)}
      {right.map((n, i) => <Node key={i} icon={n.icon} x={1500 - (i % 2) * 140} y={n.y} at={c(n.cue) + i * 3} color={C.private} label={n.l} size={90} />)}
      <div style={{position: 'absolute', left: px - 40, top: 520, opacity: win(f, moves)}}>
        <svg width={80} height={80} viewBox="0 0 100 100"><circle cx="50" cy="28" r="17" fill={INK} /><path d="M18 98 C18 66 32 52 50 52 C68 52 82 66 82 98 Z" fill={INK} /></svg>
      </div>
      <Node icon="doctor" x={1740} y={560} at={c('no single')} color={C.red} size={110} label="One doctor's view" />
    </Drift>
  );
};

/* ============================================================ 26 · Close */
export const S26: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const walk = ein(f, 0, Math.round(c('travel') + 10), (t) => t);
  const px = lerp(160, 1760, walk);
  const stops = [360, 700, 1040, 1380];
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={120} x2={1800} y1={640} y2={640} stroke={C.nightRule} strokeWidth={3} />
        {stops.map((x, i) => {
          const reached = px >= x;
          const at = reached ? Math.round(((x - 160) / 1600) * (c('travel') + 10)) : 99999;
          return <circle key={i} cx={x} cy={640} r={14 * ein(f, at, 10)} fill={[C.public, C.agg, C.private, C.manila][i]} />;
        })}
      </svg>
      <div style={{position: 'absolute', left: px - 45, top: 530}}>
        <svg width={90} height={90} viewBox="0 0 100 100"><circle cx="50" cy="28" r="17" fill={INK} /><path d="M18 98 C18 66 32 52 50 52 C68 52 82 66 82 98 Z" fill={INK} /></svg>
      </div>
      <Kinetic text="The data exists." at={c('data exists')} x={960} y={260} width={1500} size={64} color={INK} align="center" />
      <Kinetic text="It's created every day, at every visit." at={c("It's created")} x={960} y={345} width={1500} size={44} color={MUT} align="center" weight={600} />
      <Kinetic text="It just doesn't travel with the patient." at={c('It just')} x={960} y={760} width={1600} size={72} color={INK} align="center" hl={['travel']} hlColor={C.red} />
      <Text at={c.end + 6} x={960} y={960} width={1400} size={18} color={MUT} align="center">All facts and sources: research/RESEARCH.md · Figures current to September 2026</Text>
    </AbsoluteFill>
  );
};
