import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {useCue} from '../lib/timing';
import {ein, eout, inout, lerp, mix, win} from '../lib/anim';
import {Badge, Card, Chip, Counter, DashWire, Drift, Fly, Kinetic, Label, Source, Text, Wire, Camera} from '../components/primitives';
import {Field, Folder, Person, Register, SAMap, Window} from '../components/props';
import {Icon} from '../components/Icon';

export type SceneFC = React.FC<{frames: number}>;

/* ============================================================ 01 · Open */
export const S01: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const out = c('follow');
  const cx = 960, cy = 540;
  const frags = [
    {cue: 'paper', icon: 'folder' as const, title: 'Paper folders', color: C.manilaDark, x: 150, y: 190},
    {cue: 'provincial', icon: 'hospital' as const, title: 'Provincial hospital systems', color: C.public, x: 150, y: 700},
    {cue: 'laboratory', icon: 'flask' as const, title: 'Laboratory databases', color: C.agg, x: 1410, y: 150},
    {cue: 'medical aid', icon: 'card' as const, title: 'Medical aid claims', color: C.private, x: 1450, y: 480},
    {cue: 'private', icon: 'tablet' as const, title: 'Private hospital records', color: C.private, x: 1380, y: 800},
  ];
  return (
    <Drift frames={frames} amount={0.05}>
      <AbsoluteFill style={{opacity: eout(f, out, 20) * 0.9 + 0.1}}>
        <SAMap x={cx - 450} y={cy - 387} scale={0.9} at={c('South')} base={C.paperDeep} exit={out} />
      </AbsoluteFill>
      {/* the single record, before it scatters */}
      <AbsoluteFill style={{opacity: win(f, c("patient's")) * eout(f, c('scattered'), 10)}}>
        <Person x={cx} y={cy - 10} size={120} color={C.ink} at={c("patient's")} />
        <div style={{position: 'absolute', left: cx + 40, top: cy - 90, opacity: ein(f, c('one place'), 12)}}>
          <Icon name="folder" size={64} color={C.manilaDark} stroke={2} />
        </div>
      </AbsoluteFill>
      {frags.map((g, i) => (
        <Fly key={i} at={c(g.cue) - 6} from={[cx - g.x - 180, cy - g.y - 40]} scaleFrom={0.3}>
          <Card x={g.x} y={g.y} w={380} at={c(g.cue) - 6} exit={out + i * 2} icon={g.icon} color={g.color} title={g.title} titleSize={26} />
        </Fly>
      ))}
      <Badge icon="doctor" x={cx} y={cy} size={130} color={C.ink} at={c('doctor')} exit={out} label="A doctor" />
      {frags.map((g, i) => (
        <DashWire key={i} id={`o${i}`} d={`M${cx} ${cy} L${g.x + 190} ${g.y + 50}`} at={c('pieces') + i * 4} color={C.muted} exit={out} arrow={false} />
      ))}
      <Label text="An explainer" at={out + 8} x={960} y={330} align="center" color={C.muted} size={22} />
      <Kinetic text="How patient data moves through South African healthcare" at={out + 14} x={960} y={390} width={1500} size={96} align="center" hl={['patient', 'data']} hlAt={c('data from')} />
      <div style={{position: 'absolute', left: 960 - 8, top: 720, width: 16, height: 16, borderRadius: 8, background: C.public, opacity: win(f, c('created')), transform: `scale(${1 + 3 * ein(f, c('created'), 30) * 0})`}} />
      <div style={{position: 'absolute', left: 960 - 40, top: 688, width: 80, height: 80, borderRadius: 40, border: `3px solid ${C.public}`, opacity: (1 - ein(f, c('created'), 36)) * win(f, c('created')), transform: `scale(${0.2 + ein(f, c('created'), 36)})`}} />
    </Drift>
  );
};

/* ============================================================ 02 · Two sectors */
export const S02: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const N = 62, PRIV = 9;
  const tPriv = ein(f, c('nine'), 20);
  const tPub = ein(f, c('Everyone'), 24);
  const split = inout(f, c('two sectors'), 36);
  const wall = ein(f, c('separate'), 24);
  const figs = Array.from({length: N}).map((_, i) => {
    const isPriv = i >= N - PRIV;
    // phase 1: grid 16 wide
    const gx = 330 + (i % 16) * 84, gy = 430 + Math.floor(i / 16) * 104;
    // phase 2: public cluster left (9 wide), private cluster right (3 wide)
    const j = isPriv ? i - (N - PRIV) : i;
    const px = isPriv ? 1330 + (j % 3) * 84 : 170 + (j % 9) * 84;
    const py = isPriv ? 470 + Math.floor(j / 3) * 104 : 400 + Math.floor(j / 9) * 84;
    const s = isPriv ? 1 : lerp(1, 0.8, split);
    const col = isPriv ? mix(C.ink2, C.private, tPriv) : mix(C.ink2, C.public, tPub);
    const appear = ein(f, c('sixty-two') + i * 0.7, 10);
    return {x: lerp(gx, px, split), y: lerp(gy, py, split), s, col, appear};
  });
  return (
    <Drift frames={frames} amount={0.025}>
      <Counter value={62} at={c('sixty-two')} x={330} y={190} size={150} suffix=" million" dur={30} exit={c('two sectors') - 6} />
      <Label text="People in South Africa  ·  each figure ≈ 1 million" at={c('people')} x={336} y={352} exit={c('two sectors') - 6} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {figs.map((g, i) => (
          <g key={i} transform={`translate(${g.x} ${g.y}) scale(${g.s * 0.62 * g.appear})`} opacity={g.appear}>
            <circle cx={0} cy={-34} r={15} fill={g.col} />
            <path d="M-28 42 C-28 12 -16 -2 0 -2 C16 -2 28 12 28 42 Z" fill={g.col} />
          </g>
        ))}
        {wall > 0.01 && <line x1={1180} x2={1180} y1={260} y2={260 + 640 * wall} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />}
      </svg>
      <div style={{opacity: 1 - split}}>
        <Chip text="≈ 9.2 million medical scheme members" at={c('covered')} x={1250} y={780} color={C.private} fill={C.privateSoft} size={24} />
        <Chip text="≈ 5 in 6 rely mainly on the public sector" at={c('five')} x={330} y={780} color={C.public} fill={C.publicSoft} size={24} />
      </div>
      <Kinetic text="PUBLIC" at={c('two sectors') + 10} x={170} y={210} size={72} color={C.public} tracking={0.04} />
      <Text at={c('two sectors') + 18} x={172} y={300} size={26} width={760}>Clinics, public hospitals, NHLS labs · funded by the state</Text>
      <Kinetic text="PRIVATE" at={c('two sectors') + 14} x={1290} y={210} size={72} color={C.private} tracking={0.04} />
      <Text at={c('two sectors') + 22} x={1292} y={300} size={26} width={520}>GPs, specialists, hospital groups, private labs · paid largely via medical schemes</Text>
      <Label text="separate infrastructure" at={c('separate')} x={1180} y={920} align="center" width={500} color={C.ink} />
      <Source text="Stats SA Census 2022 · Council for Medical Schemes Annual Report 2024/25 (9.17 million beneficiaries)" at={c('sixty-two')} />
    </Drift>
  );
};

/* ============================================================ 03 · HPRS registration */
export const S03: SceneFC = ({frames}) => {
  const c = useCue();
  return (
    <Drift frames={frames} amount={0.03}>
      <Badge icon="clinic" x={300} y={300} size={150} color={C.public} at={c('public clinic')} label="Public clinic" />
      <Person x={300} y={690} size={180} color={C.public} at={c('Nomsa')} label="Nomsa  ·  hypothetical patient" />
      <Wire d="M420 650 C560 650 580 520 700 520" at={c('reception')} color={C.public} />
      <Window x={720} y={220} w={800} h={600} at={c('registered')} title="HPRS  ·  Health Patient Registration System" accent={C.public}>
        <Field label="ID number" value="•••••• •••• •••" at={c('ID number')} x={48} y={40} w={480} accent={C.public} />
        <Field label="First name" value="NOMSA" at={c('looks')} x={48} y={150} w={480} accent={C.public} />
        <Field label="Patient registration number" value="•••• •••• ••••" at={c('patient registration', 2)} x={48} y={260} w={480} accent={C.public} />
        <div style={{position: 'absolute', left: 48, top: 390}}>
          <Chip text="Registered" icon="check" at={c('number', 2) + 4} x={0} y={0} color={C.public} fill={C.publicSoft} />
        </div>
        <div style={{position: 'absolute', right: 40, top: 40, width: 190, height: 230, borderRadius: 10, background: C.publicSoft, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Icon name="card" size={110} color={C.public} stroke={1.4} />
        </div>
      </Window>
      <Wire d="M1520 520 L1640 520" at={c('national')} color={C.public} packets={3} packetColor={C.public} />
      <Badge icon="db" x={1740} y={520} size={150} color={C.public} at={c('national')} label="National online registry" />
      <Chip text="Approved as the NHI registration system" at={c('National Health')} x={720} y={850} color={C.public} size={20} />
      <Source text="NDoH, The Emerging South African Digital Health System (2025) · Health Systems Trust HPRS brief" at={c('registered')} />
    </Drift>
  );
};

/* ============================================================ 04 · The paper folder */
export const S04: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const emr = c('national electronic');
  return (
    <Drift frames={frames} amount={0.03}>
      <AbsoluteFill style={{opacity: eout(f, emr - 8, 16)}}>
        <Card x={110} y={250} w={440} at={2} color={C.public} icon="db" kicker="HPRS records" title="Who she is" sub="Name · ID number · contact details · registration number" />
        <Card x={110} y={560} w={440} at={c('not what')} color={C.manilaDark} icon="folder" kicker="Not in HPRS" title="What's wrong with her" sub="The clinical story lives somewhere else" />
        <Folder x={680} y={150} w={430} at={c('clinical story')} lines={[
          {text: 'c/o headaches × 2 wks', at: c('symptoms')},
          {text: 'BP 152/96', at: c('blood pressure')},
          {text: 'Dx: hypertension', at: c('diagnosis')},
          {text: 'Rx: amlodipine 5 mg daily', at: c('treatment')},
        ]} />
        <Label text="Written by hand" at={c('by hand')} x={690} y={720} color={C.manilaDark} size={22} />
        <Chip text="Filed at this clinic" icon="shelf" at={c('filed')} x={690} y={770} color={C.manilaDark} size={22} />
        <Kinetic text="In most public clinics, the paper folder is still the clinical record." at={c('In most')} x={1230} y={330} width={600} size={60} hl={['paper', 'folder']} hlAt={c('still')} />
        <Label text="Illustrative notes" at={c('symptoms')} x={1232} y={880} size={16} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: win(f, emr)}}>
        <Chip text="28 March 2025" icon="clock" at={emr} x={300} y={250} color={C.public} size={24} mono />
        <Kinetic text="A national electronic medical record goes live — as a beta." at={emr + 4} x={300} y={320} width={1300} size={64} hl={['beta.']} hlAt={c('beta')} />
        {Array.from({length: 37}).map((_, i) => {
          const gp = i === 36;
          const at = c('thirty-six') + i * 0.8;
          const x = 300 + (i % 19) * 62, y = 560 + Math.floor(i / 19) * 70;
          return <div key={i} style={{position: 'absolute', left: gp ? x + 30 : x, top: y, width: 40, height: 40, borderRadius: 20, background: gp ? C.private : C.public, opacity: ein(f, gp ? c('GP') : at, 8), transform: `scale(${ein(f, gp ? c('GP') : at, 12)})`}} />;
        })}
        <Text at={c('thirty-six')} x={300} y={720} size={30} width={1200}><b style={{color: C.public}}>36 clinics</b> in five provinces <span style={{color: C.private, fontWeight: 700}}>+ 1 GP practice</span></Text>
        <Source text="Parliamentary reply NW4495, National Department of Health, 1 August 2025" at={emr} />
      </AbsoluteFill>
    </Drift>
  );
};

/* ============================================================ 05 · Tick registers → DHIS2 */
export const S05: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const dh = c('D H I S 2');
  const tag = c('no names');
  const tagMove = ein(f, dh + 40, 50);
  return (
    <Camera s={[[0, 1.3], [dh - 12, 1.34], [dh + 22, 1], [frames, 1.03]]} x={[[0, 800], [dh - 12, 800], [dh + 22, 0]]} y={[[0, 110], [dh - 12, 110], [dh + 22, 0]]}>
      <Label text="Tick register  ·  one per service point" at={c('tick')} x={140} y={200} color={C.ink2} />
      <Register x={140} y={250} rows={8} cols={9} cell={46} at={c('tick')} dur={70} collapse={c('totalled')} />
      <Chip text="End of month" icon="clock" at={c('end of the month')} x={140} y={660} color={C.ink} size={20} />
      <Card x={140} y={720} w={414} at={c('form')} color={C.agg} icon="doc" kicker="Monthly data input form" title="Σ  totals per data element" titleSize={24} />
      <Wire d="M560 790 C700 790 720 560 840 560" at={dh} color={C.agg} packets={3} packetColor={C.agg} />
      <Window x={850} y={250} w={640} h={520} at={dh} title="DHIS2  ·  District Health Information System" accent={C.agg}>
        <svg width={640} height={474}>
          {[0.55, 0.72, 0.4, 0.86, 0.63, 0.78, 0.5].map((v, i) => {
            const g = ein(f, dh + 10 + i * 3, 20);
            return <rect key={i} x={50 + i * 80} y={400 - 320 * v * g} width={50} height={320 * v * g} fill={i === 3 ? C.agg : C.aggSoft} rx={3} />;
          })}
          <line x1={30} x2={610} y1={400} y2={400} stroke={C.rule} strokeWidth={2} />
          <text x={50} y={440} fontFamily={FONT.body} fontSize={16} fill={C.muted} fontWeight={600} letterSpacing="0.1em">AGGREGATE COUNTS · NO PATIENT NAMES</text>
        </svg>
      </Window>
      <div style={{position: 'absolute', left: 1530, top: 280}}>
        {['National', 'Province', 'District', 'Facility'].map((t, i) => (
          <div key={t} style={{position: 'absolute', top: i * 70, opacity: ein(f, dh + 20 + (3 - i) * 5, 12), transform: `translateX(${(1 - ein(f, dh + 20 + (3 - i) * 5, 14)) * 20}px)`, fontFamily: FONT.body, fontSize: 22, fontWeight: 600, color: C.agg, display: 'flex', gap: 10, alignItems: 'center', whiteSpace: 'nowrap'}}>
            <div style={{width: 14, height: 14, borderRadius: 3, background: C.agg}} />{t}
          </div>
        ))}
      </div>
      <Chip text="How many visits" at={c('how many visits')} x={870} y={800} color={C.agg} size={22} />
      <Chip text="How many tests" at={c('how many tests')} x={1100} y={800} color={C.agg} size={22} />
      {/* Nomsa's name reaches DHIS2 as "+1" */}
      <div style={{position: 'absolute', left: lerp(620, 1150, tagMove), top: lerp(520, 330, tagMove), opacity: win(f, dh + 36), fontFamily: FONT.display, fontWeight: 700, fontSize: 30}}>
        <div style={{position: 'absolute', padding: '8px 18px', borderRadius: 999, background: C.card, border: `2px solid ${C.public}`, color: C.public, opacity: 1 - ein(f, tag, 16), whiteSpace: 'nowrap'}}>Nomsa</div>
        <div style={{position: 'absolute', padding: '8px 18px', borderRadius: 999, background: C.agg, color: '#fff', opacity: ein(f, tag, 16)}}>+1</div>
      </div>
      <Chip text="What's happening" icon="check" at={c("what's happening")} x={1540} y={640} color={C.agg} fill={C.aggSoft} size={20} />
      <Chip text="What happened to Nomsa" icon="cross" at={c('not what happened')} x={1540} y={700} color={C.red} size={20} />
      <Source text="Thabethe et al., SAJIM 2024 · NDoH National Indicator Data Set" at={dh} />
    </Camera>
  );
};

/* ============================================================ 06 · TIER.Net */
export const S06: SceneFC = ({frames}) => {
  const c = useCue();
  const tiers = c('Depending');
  return (
    <Drift frames={frames} amount={0.03}>
      <Chip text="HIV positive  ·  starts antiretroviral therapy" at={c('HIV')} x={130} y={170} color={C.public} fill={C.publicSoft} size={22} />
      <Folder x={130} y={250} w={320} at={c('HIV')} lines={[{text: 'HIV +  counselled', at: c('positive')}, {text: 'ART initiated', at: c('treatment')}]} />
      <Person x={880} y={430} size={130} color={C.ink2} at={c('data capturer')} label="Data capturer" />
      <div style={{position: 'absolute', left: 940, top: 380}}><Icon name="keyboard" size={64} color={C.ink2} draw={ein(useCurrentFrame(), c('data capturer'), 20)} /></div>
      <DashWire id="t1" d="M470 420 C600 380 690 400 790 420" at={c('reads')} label="reads the folder" labelOffset={[0, -30]} />
      <DashWire id="t2" d="M980 420 C1080 400 1170 390 1290 410" at={c('types')} label="types it in" labelOffset={[0, -30]} />
      <Card x={1300} y={310} w={470} at={c('TIER')} color={C.public} icon="db" kicker="National ART register" title="TIER.Net" sub="Three Interlinked Electronic Register" />
      {[
        {k: 'Tier 1', t: 'Paper register', s: 'fewer than 500 patients', cue: c('on paper'), icon: 'doc' as const},
        {k: 'Tier 2', t: 'Standalone computer', s: '500 – 2,000 patients', cue: c('standalone'), icon: 'laptop' as const},
        {k: 'Tier 3', t: 'Networked EMR', s: 'more than 2,000 patients', cue: c('networked'), icon: 'globe' as const},
      ].map((t, i) => (
        <Card key={i} x={130 + i * 560} y={720} w={520} at={t.cue} color={i === 0 ? C.manilaDark : C.public} icon={t.icon} kicker={t.k} title={t.t} sub={t.s} titleSize={28} />
      ))}
      <Label text="Clinic size decides the tier" at={tiers} x={130} y={670} />
      <Source text="Osler et al., three-tier ART monitoring framework (PMC4005043)" at={tiers} />
    </Drift>
  );
};
