import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {useCue} from '../lib/timing';
import {ein, eout, lerp, win} from '../lib/anim';
import {Badge, Card, Chip, Counter, DashWire, Drift, Kinetic, Label, Source, Text, Wire} from '../components/primitives';
import {Folder, Person, SAMap, Sheet, Window} from '../components/props';
import {Icon} from '../components/Icon';
import type {SceneFC} from './A_intro_clinic';

/* ============================================================ 07 · NHLS */
export const S07: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const back = c('nurse');
  return (
    <Drift frames={frames} amount={0.025}>
      <Badge icon="clinic" x={200} y={400} size={140} color={C.public} at={0} label="Clinic" />
      <Wire d="M280 400 L560 400" at={c('blood')} color={C.red} packets={2} packetColor={C.red} packetSize={10} label="blood sample" labelOffset={[0, -22]} />
      <Card x={580} y={290} w={500} at={c('National Health')} color={C.public} icon="flask" kicker="Public-sector pathology" title="NHLS" sub="National Health Laboratory Service · ~265 labs" />
      <AbsoluteFill style={{opacity: eout(f, back - 6, 14)}}>
        <Counter value={110} at={c('hundred')} x={580} y={540} size={120} suffix=" million+" dur={34} />
        <Label text="tests a year" at={c('tests')} x={586} y={672} />
        <Chip text="Logged in TrakCare Lab" icon="db" at={c('TrakCare')} x={580} y={730} color={C.public} size={22} />
      </AbsoluteFill>
      <Wire d="M1080 360 C1200 360 1220 250 1330 250" at={c('web viewer')} color={C.public} packets={2} packetColor={C.public} />
      <Window x={1340} y={150} w={460} h={250} at={c('web viewer')} title="TrakCare WebView" accent={C.public}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{position: 'absolute', left: 24, top: 24 + i * 56, width: 410, height: 40, borderRadius: 6, background: i === 0 ? C.publicSoft : '#F3F1EC', opacity: ein(f, c('web viewer') + 12 + i * 5, 10), display: 'flex', alignItems: 'center', padding: '0 12px', boxSizing: 'border-box', fontFamily: FONT.mono, fontSize: 17, color: C.ink2}}>
            {['Result available', 'Result', 'Result'][i]}
          </div>
        ))}
      </Window>
      <Wire d="M1080 440 C1220 440 1230 620 1360 620" at={c('SMS printer')} color={C.public} />
      <Badge icon="printer" x={1460} y={620} size={140} color={C.public} at={c('SMS printer')} label="SMS printer · some HIV and TB results" />
      {/* printed slip */}
      <div style={{position: 'absolute', left: 1600, top: 560, width: 150, height: 120 * ein(f, c('SMS printer') + 20, 40), background: '#FFFDF8', boxShadow: '0 6px 16px rgba(0,0,0,0.12)', overflow: 'hidden', opacity: win(f, c('SMS printer') + 18)}}>
        {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 6, width: 110 - i * 14, background: C.rule, margin: '14px 16px 0'}} />)}
      </div>
      <Folder x={580} y={560} w={250} at={back} rot={-3} lines={[{text: 'Result: …', at: c('writes'), size: 24}]} />
      <DashWire id="l1" d="M1400 720 C1200 900 1000 880 850 790" at={c('writes')} label="written into the folder" labelOffset={[20, 40]} />
      <Card x={130} y={740} w={380} at={c('copies')} color={C.public} icon="db" title="TIER.Net" titleSize={28} />
      <DashWire id="l2" d="M580 800 L520 800" at={c('copies')} dur={14} />
      <Label text="retyped" at={c('copies') + 8} x={512} y={850} color={C.manilaDark} />
      <Source text="NHLS Annual Report 2023/24 (110.6M tests in 2022/23) · PMC10280246 on SMS printers & WebView" at={c('hundred')} />
    </Drift>
  );
};

/* ============================================================ 08 · Medicines */
export const S08: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const sep = c('Separately');
  const dim = ein(f, sep, 20);
  const pts = [
    {cue: 'private pharmacy', icon: 'pill' as const, label: 'Private pharmacy', y: 230},
    {cue: 'a GP', icon: 'doctor' as const, label: 'GP practice', y: 480},
    {cue: 'community', icon: 'person' as const, label: 'Community pick-up point', y: 730},
  ];
  return (
    <Drift frames={frames} amount={0.025}>
      <AbsoluteFill style={{opacity: 1 - dim * 0.7, filter: `grayscale(${dim})`}}>
        <Card x={130} y={400} w={420} at={c('packed')} color={C.public} icon="box" kicker="CCMDD" title="Central dispensing" sub="Chronic Medicines Dispensing & Distribution" />
        {pts.map((p, i) => (
          <React.Fragment key={i}>
            <Wire d={`M550 480 C700 480 700 ${p.y} 850 ${p.y}`} at={c(p.cue)} color={C.public} packets={2} packetShape="doc" packetColor={C.public} />
            <Badge icon={p.icon} x={930} y={p.y} size={120} color={C.public} at={c(p.cue)} label={p.label} />
          </React.Fragment>
        ))}
        <Person x={1130} y={500} size={110} color={C.public} at={c('collected')} label="Nomsa" />
      </AbsoluteFill>
      <Card x={1330} y={180} w={470} at={c('Stock Visibility')} color={C.agg} icon="chart" kicker="Stock Visibility System" title="Is it on the shelf?" sub="Mobile + web tool used at public clinics since 2013" />
      <div style={{position: 'absolute', left: 1340, top: 520, width: 450}}>
        {Array.from({length: 12}).map((_, i) => {
          const at = c('Stock Visibility') + 12 + i * 2;
          const hot = ein(f, c('boxes'), 12);
          return (
            <div key={i} style={{position: 'absolute', left: (i % 4) * 112, top: Math.floor(i / 4) * 100, opacity: ein(f, at, 10), transform: `scale(${0.8 + 0.2 * ein(f, at, 14)})`}}>
              <Icon name="box" size={80} color={i === 5 || i === 10 ? C.rule : lerpColor(hot)} stroke={1.8} />
            </div>
          );
        })}
      </div>
      <Chip text="follows boxes" icon="check" at={c('boxes')} x={1340} y={840} color={C.agg} fill={C.aggSoft} size={22} />
      <Chip text="not patients" icon="cross" at={c('not patients')} x={1580} y={840} color={C.ink2} size={22} />
      <Source text="NDoH / SAnews on CCMDD · PMC9945761 on the Stock Visibility System" at={c('packed')} />
    </Drift>
  );
};
const lerpColor = (t: number) => (t > 0.5 ? C.agg : C.ink2);

/* ============================================================ 09 · Hospitals by province */
const PCOL = {wc: C.public, ec: '#5E8C3A', fs: '#8661AE', kzn: '#CF8A2A', gp: '#3B77AE'};
export const S09: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const prov = c('depends');
  const rows = [
    {cue: 'Western Cape', name: 'Western Cape', col: PCOL.wc, sys: 'Clinicom', n: '53 hospitals'},
    {cue: 'Eastern Cape', name: 'Eastern Cape', col: PCOL.ec, sys: 'HMS2', n: '44 hospitals'},
    {cue: 'Free State', name: 'Free State', col: PCOL.fs, sys: 'HMS2 + Meditech', n: '16 + 3 hospitals'},
    {cue: 'KwaZulu-Natal', name: 'KwaZulu-Natal', col: PCOL.kzn, sys: 'eHealth', n: '42 hospitals'},
    {cue: 'Gauteng', name: 'Gauteng', col: PCOL.gp, sys: 'SAP-based HIS', n: 'replaced legacy Medicom'},
  ];
  const none = ['Mpumalanga', 'North West', 'Limpopo', 'Northern Cape'];
  const styles: Record<string, {fill?: string; at?: number; hatch?: boolean}> = {};
  rows.forEach((r) => (styles[r.name] = {fill: r.col, at: c(r.cue)}));
  none.forEach((n) => (styles[n] = {hatch: true, at: c(n)}));
  const mapIn = prov + 6;
  return (
    <Drift frames={frames} amount={0.02}>
      <AbsoluteFill style={{opacity: eout(f, prov - 4, 16)}}>
        <Folder x={140} y={260} w={300} at={0} />
        <Person x={620} y={560} size={140} color={C.public} at={0} label="Nomsa" />
        <Sheet x={700} y={230} w={300} at={c('referral letter')} title="Referral letter" lines={[{text: 'Re: Nomsa', at: c('referral letter') + 8}, {text: 'HTN — ? complications', at: c('referral letter') + 20}, {text: 'Please assess', at: c('on paper')}]} />
        <Chip text="on paper" icon="doc" at={c('on paper')} x={720} y={690} color={C.manilaDark} size={22} />
        <Wire d="M1030 450 L1330 450" at={c('hospital')} color={C.ink2} packetShape="doc" packets={1} />
        <Badge icon="hospital" x={1450} y={450} size={160} color={C.ink} at={c('hospital')} label="Hospital" />
      </AbsoluteFill>
      <SAMap x={100} y={150} scale={0.95} at={mapIn} styles={styles} labels={{
        'Western Cape': {at: c('Western Cape'), text: 'WC', color: '#fff'},
        'Eastern Cape': {at: c('Eastern Cape'), text: 'EC', color: '#fff'},
        'Free State': {at: c('Free State'), text: 'FS', color: '#fff'},
        'KwaZulu-Natal': {at: c('KwaZulu-Natal'), text: 'KZN', color: '#fff'},
        Gauteng: {at: c('Gauteng'), text: 'GP', color: '#fff', dy: -2},
        Mpumalanga: {at: c('Mpumalanga'), text: 'MP'},
        'North West': {at: c('North West'), text: 'NW'},
        Limpopo: {at: c('Limpopo'), text: 'LP'},
        'Northern Cape': {at: c('Northern Cape'), text: 'NC'},
      }} />
      <Chip text="Parliamentary reply · 1 August 2025" icon="doc" at={c('August 2025')} x={1080} y={170} color={C.ink} size={20} />
      <div style={{position: 'absolute', left: 1080, top: 250, width: 780}}>
        {rows.map((r, i) => {
          const p = ein(f, c(r.cue), 16);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 16, height: 86, borderBottom: `1.5px solid ${C.rule}`, opacity: p, transform: `translateX(${(1 - p) * 24}px)`}}>
              <div style={{width: 18, height: 18, borderRadius: 4, background: r.col, alignSelf: 'center'}} />
              <div style={{width: 190, fontFamily: FONT.body, fontWeight: 600, fontSize: 21, color: C.ink2}}>{r.name}</div>
              <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 30, color: C.ink, whiteSpace: 'nowrap'}}>{r.sys}</div>
              <div style={{marginLeft: 'auto', fontFamily: FONT.body, fontWeight: 500, fontSize: 18, color: C.muted, whiteSpace: 'nowrap'}}>{r.n}</div>
            </div>
          );
        })}
        <div style={{display: 'flex', gap: 16, paddingTop: 22, opacity: ein(f, c('Mpumalanga'), 16)}}>
          <div style={{width: 18, height: 18, borderRadius: 4, marginTop: 6, background: 'repeating-linear-gradient(45deg, #A8A298 0 3px, #E9E4DA 3px 8px)'}} />
          <div>
            <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 22, color: C.ink2}}>Mpumalanga · North West · Limpopo · Northern Cape</div>
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 30, color: C.ink, marginTop: 6, opacity: ein(f, c('no patient'), 14)}}>No hospital patient-information or EMR system</div>
          </div>
        </div>
      </div>
      <Source text="PMG NW4495, reply of 1 Aug 2025 · Gauteng HIS replaced Medicom/PAAB (Medical Brief) · KZN/FS Meditech (MEDITECH)" at={c('August 2025')} />
    </Drift>
  );
};

/* ============================================================ 10 · Western Cape PHDC */
export const S10: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const spv = c('Clinicians');
  const hub = {x: 1200, y: 520};
  const srcs = [
    {cue: 'clinic visits', icon: 'clinic' as const, t: 'Clinic visits', a: -150},
    {cue: 'admissions', icon: 'hospital' as const, t: 'Admissions', a: -90},
    {cue: 'lab results', icon: 'flask' as const, t: 'Lab results', a: -30},
    {cue: 'pharmacy', icon: 'pill' as const, t: 'Pharmacy', a: 30},
    {cue: 'HIV registers', icon: 'db' as const, t: 'HIV registers', a: 150},
  ];
  const R = 330;
  const lanes = ['Clinic visits', 'Admissions', 'Lab results', 'Medicines', 'HIV / TB'];
  return (
    <Drift frames={frames} amount={0.02}>
      <SAMap x={60} y={260} scale={0.55} at={0} styles={{'Western Cape': {fill: C.public}}} dimAt={0} dimExcept={['Western Cape']} borderGlow={{name: 'Western Cape', at: c('provincial border'), color: C.red}} />
      <Counter value={8} at={c('eight million')} x={80} y={770} size={96} prefix="≈ " suffix=" million" dur={24} />
      <Label text="people linked" at={c('eight million')} x={86} y={880} />
      <Chip text="Western Cape only" icon="cross" at={c('provincial border')} x={80} y={200} color={C.red} size={22} />
      <AbsoluteFill style={{opacity: eout(f, spv - 4, 16)}}>
        {srcs.map((s, i) => {
          const rad = (s.a * Math.PI) / 180;
          const x = hub.x + Math.cos(rad) * R * 1.35, y = hub.y + Math.sin(rad) * R;
          return (
            <React.Fragment key={i}>
              <Wire d={`M${x} ${y} L${lerp(x, hub.x, 0.62)} ${lerp(y, hub.y, 0.62)}`} at={c(s.cue)} color={C.public} packets={2} packetColor={C.public} />
              <Badge icon={s.icon} x={x} y={y} size={100} color={C.public} at={c(s.cue)} label={s.t} />
            </React.Fragment>
          );
        })}
        <div style={{position: 'absolute', left: hub.x - 130, top: hub.y - 130, width: 260, height: 260, borderRadius: 130, background: C.public, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', opacity: ein(f, c('Provincial Health'), 14), transform: `scale(${0.8 + 0.2 * ein(f, c('Provincial Health'), 20)})`, boxShadow: '0 16px 40px rgba(30,110,117,0.35)'}}>
          <div style={{fontFamily: FONT.body, fontSize: 15, fontWeight: 700, letterSpacing: '0.14em'}}>PROVINCIAL</div>
          <div style={{fontFamily: FONT.display, fontSize: 32, fontWeight: 800, lineHeight: 1.05}}>Health Data Centre</div>
        </div>
        <Chip text="one patient number" icon="barcode" at={c('single patient number')} x={hub.x - 130} y={hub.y + 330} color={C.public} fill={C.publicSoft} size={22} />
      </AbsoluteFill>
      <Window x={760} y={190} w={1060} h={640} at={spv} title="Single Patient Viewer" accent={C.public}>
        <div style={{position: 'absolute', left: 30, top: 24, fontFamily: FONT.display, fontWeight: 700, fontSize: 28, color: C.ink}}>Nomsa · one timeline across facilities</div>
        {lanes.map((l, i) => (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: 30, top: 100 + i * 88, fontFamily: FONT.body, fontWeight: 600, fontSize: 19, color: C.ink2, opacity: ein(f, spv + 10 + i * 3, 10)}}>{l}</div>
            <div style={{position: 'absolute', left: 220, top: 112 + i * 88, width: 790, height: 2, background: C.rule}} />
            {Array.from({length: 4 + ((i * 3) % 4)}).map((_, k) => {
              const at = spv + 20 + i * 4 + k * 5;
              const x = 240 + ((k * 173 + i * 61) % 760);
              return <div key={k} style={{position: 'absolute', left: x, top: 102 + i * 88, width: 22, height: 22, borderRadius: 11, background: i === 2 ? C.agg : C.public, opacity: ein(f, at, 8), transform: `scale(${ein(f, at, 12)})`}} />;
            })}
          </React.Fragment>
        ))}
        <Label text="illustrative" at={spv + 30} x={30} y={560} size={14} />
      </Window>
      <Source text="Boulle et al., Data Centre Profile: the Provincial Health Data Centre of the Western Cape (IJPDS, 2019)" at={c('Provincial Health')} />
    </Drift>
  );
};

/* ============================================================ 11 · EMS, blood, imaging */
export const S11: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const blood = c('If she needs');
  const xray = c('X-rays');
  const drive = ein(f, 0, 40);
  const demist = [['De', 'Demographics'], ['M', 'Mechanism of injury'], ['I', 'Injuries / illness found'], ['S', 'Signs & symptoms'], ['T', 'Treatment given']];
  return (
    <Drift frames={frames} amount={0.02}>
      {/* beat 1: ambulance */}
      <AbsoluteFill style={{opacity: eout(f, blood - 6, 14), transform: 'translateY(150px)'}}>
        <div style={{position: 'absolute', left: lerp(-200, 260, drive), top: 330}}>
          <Icon name="ambulance" size={220} color={C.red} stroke={1.3} />
        </div>
        <Sheet x={560} y={200} w={320} at={c('patient report form')} title="Patient report form" accent={C.red} lines={[
          {text: 'Pt: Nomsa', at: c('patient report form') + 8},
          {text: 'BP ↑, GCS 15', at: c('patient report form') + 18},
          {text: 'Rx en route …', at: c('patient report form') + 30},
        ]} />
        <Chip text="in many services, still paper" icon="doc" at={c('still on paper')} x={570} y={660} color={C.manilaDark} size={22} />
        <Badge icon="hospital" x={1640} y={300} size={150} color={C.ink} at={c('emergency department')} label="Emergency department" />
        <div style={{position: 'absolute', left: 1010, top: 200, width: 500, padding: '24px 30px', background: C.card, borderRadius: 18, border: `2px solid ${C.ink}`, opacity: win(f, c('out loud')), transform: `scale(${0.9 + 0.1 * ein(f, c('out loud'), 16)})`, transformOrigin: 'right bottom'}}>
          <div style={{fontFamily: FONT.body, fontWeight: 700, fontSize: 16, letterSpacing: '0.14em', color: C.muted, marginBottom: 10}}>VERBAL HANDOVER · DeMIST</div>
          {demist.map(([k, v], i) => {
            const p = ein(f, c('structured') + i * 5, 12);
            return (
              <div key={k} style={{display: 'flex', gap: 16, alignItems: 'baseline', opacity: p, transform: `translateX(${(1 - p) * 16}px)`, margin: '6px 0'}}>
                <span style={{width: 50, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, color: C.red}}>{k}</span>
                <span style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 24, color: C.ink}}>{v}</span>
              </div>
            );
          })}
        </div>
        <Chip text="form stays with the hospital" icon="doc" at={c('leave the form')} x={1050} y={640} color={C.ink2} size={22} />
      </AbsoluteFill>
      {/* beat 2: blood */}
      <AbsoluteFill style={{opacity: win(f, blood, xray - 6)}}>
        <Badge icon="drop" x={300} y={500} size={170} color={C.red} at={blood} label="Blood for transfusion" />
        <SAMap x={620} y={180} scale={0.62} at={blood + 4} styles={Object.fromEntries(['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'].map((n) => [n, {fill: '#E7A9A0', at: c('South African National')}]).concat([['Western Cape', {fill: C.red, at: c('Western Cape Blood')}]]))} />
        <Card x={1300} y={230} w={480} at={c('South African National')} color={'#C9786D'} icon="drop" kicker="8 provinces" title="SANBS" sub="South African National Blood Service · eProgresa system" />
        <Card x={1300} y={520} w={480} at={c('Western Cape Blood')} color={C.red} icon="drop" kicker="Western Cape" title="WCBS" sub="Western Cape Blood Service" />
        <Label text="each with its own computer system" at={c('computer system')} x={1300} y={820} color={C.ink} />
      </AbsoluteFill>
      {/* beat 3: imaging */}
      <AbsoluteFill style={{opacity: win(f, xray), transform: 'translateY(110px)'}}>
        <Badge icon="image" x={330} y={480} size={170} color={C.ink} at={xray} label="X-rays & scans" />
        <Card x={560} y={380} w={560} at={c('PACS')} color={C.ink} icon="db" kicker="Digital image archive" title="PACS" sub="Picture archiving and communication system — run by each practice or hospital" />
        {[{t: 'Private radiology', s: 'standard', w: 1, col: C.private, cue: 'private radiology'}, {t: 'Public hospitals', s: 'far patchier', w: 0.42, col: C.public, cue: 'public hospitals'}].map((b, i) => {
          const p = ein(f, c(b.cue), 30);
          return (
            <div key={i} style={{position: 'absolute', left: 1220, top: 380 + i * 130, width: 560, opacity: ein(f, c(b.cue), 10)}}>
              <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 22, color: C.ink2, marginBottom: 10}}>{b.t} — <b style={{color: b.col}}>{b.s}</b></div>
              <div style={{height: 26, width: 560, background: C.paperDeep, borderRadius: 13}}>
                <div style={{height: 26, width: 560 * b.w * p, background: b.col, borderRadius: 13}} />
              </div>
            </div>
          );
        })}
        <Label text="qualitative comparison, as described in the literature" at={c('public hospitals') + 20} x={1220} y={660} size={15} width={600} />
      </AbsoluteFill>
      <Source text={f < blood ? 'EMSSA DeMIST handover · EMS Regulations 2022' : f < xray ? 'SANBS Integrated Report 2024 · WCBS' : 'Clinicians’ perspective of PACS at Charlotte Maxeke (PMC10244939)'} at={0} />
    </Drift>
  );
};
