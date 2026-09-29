import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../theme';
import {useCue} from '../lib/timing';
import {ein, eout, fmt, win} from '../lib/anim';
import {Badge, Card, Chip, Counter, DashWire, Drift, Kinetic, Label, Source, Text, Wire} from '../components/primitives';
import {Person, Sheet, Window} from '../components/props';
import {Icon, IconName} from '../components/Icon';
import type {SceneFC} from './A_intro_clinic';

/* ============================================================ 12 · Private GP */
export const S12: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const box = c('only');
  const tabs = [{t: 'Billing', cue: 'billing'}, {t: 'Scheduling', cue: 'billing'}, {t: 'Clinical notes', cue: 'store her notes'}];
  return (
    <Drift frames={frames} amount={0.025}>
      <Person x={260} y={520} size={170} color={C.private} at={0} label="Nomsa" />
      <Chip text="medical aid member" icon="card" at={c('medical aid')} x={150} y={700} color={C.private} fill={C.privateSoft} size={20} />
      <Wire d="M370 500 L560 500" at={c('private GP')} color={C.private} />
      <Badge icon="doctor" x={660} y={500} size={150} color={C.private} at={c('private GP')} label="Private GP practice" />
      <Window x={900} y={210} w={880} h={560} at={c('practice-management')} title="Practice management software" accent={C.private}>
        <div style={{display: 'flex', gap: 10, padding: '22px 26px'}}>
          {tabs.map((t, i) => {
            const on = ein(f, c(t.cue) + i * 4, 12);
            const hot = i === 0 ? ein(f, c('billing'), 12) * (1 - ein(f, c('store her notes'), 12)) : i === 2 ? ein(f, c('store her notes'), 12) : 0;
            return <div key={i} style={{padding: '10px 18px', borderRadius: 8, fontFamily: FONT.body, fontWeight: 600, fontSize: 20, opacity: on, background: hot > 0.5 ? C.private : C.privateSoft, color: hot > 0.5 ? '#fff' : C.private}}>{t.t}</div>;
          })}
        </div>
        <div style={{position: 'absolute', left: 26, top: 100, width: 828, height: 380, opacity: ein(f, c('billing'), 14) * (1 - ein(f, c('store her notes'), 10))}}>
          {['Consultation', 'Claim submitted', 'Claim paid', 'Patient portion'].map((r, i) => (
            <div key={i} style={{display: 'flex', justifyContent: 'space-between', padding: '18px 8px', borderBottom: `1.5px solid ${C.rule}`, fontFamily: FONT.body, fontSize: 22, color: C.ink2}}>
              <span>{r}</span><span style={{fontFamily: FONT.mono, color: C.ink}}>R ••••</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 26, top: 100, width: 828, opacity: ein(f, c('store her notes'), 12)}}>
          {['BP 138/88 — improving', 'Continue amlodipine', 'Bloods: lipids, U&E'].map((l, i) => {
            const q = ein(f, c('store her notes') + 6 + i * 10, 18, (t) => t);
            return <div key={i} style={{fontFamily: FONT.hand, fontSize: 32, color: '#233a8a', lineHeight: 1.7, clipPath: `inset(-10px ${100 - q * 100}% -10px 0)`}}>{l}</div>;
          })}
        </div>
      </Window>
      <Chip text="e.g. GoodX · Healthbridge" at={c('GoodX')} x={900} y={800} color={C.private} size={22} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <rect x={530} y={170} width={1290} height={700} rx={24} fill="none" stroke={C.private} strokeWidth={3} strokeDasharray="10 10" pathLength={1} opacity={ein(f, box, 8)} strokeDashoffset={0} />
      </svg>
      <div style={{position: 'absolute', left: 1320, top: 890, fontFamily: FONT.body, fontWeight: 700, fontSize: 20, letterSpacing: '0.12em', color: C.private, opacity: win(f, box)}}>STAYS ON THIS PRACTICE'S SYSTEM</div>
      <Source text="GoodX, Healthbridge product documentation" at={c('GoodX')} />
    </Drift>
  );
};

/* ============================================================ 13 · Claims */
export const S13: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const many = c('most complete');
  const lines: [string, string, string?][] = [
    ['Message', 'PHISC MEDCLM'],
    ['Provider', 'practice no. •••••••'],
    ['Member', 'scheme no. •••••••'],
    ['Tariff code', '0190', 'tariff'],
    ['ICD-10', 'I10', 'ICD-10'],
    ['Amount', 'R •••.••'],
  ];
  const rows = Array.from({length: 9});
  return (
    <Drift frames={frames} amount={0.02}>
      <Badge icon="doctor" x={200} y={330} size={140} color={C.private} at={0} label="GP practice" />
      <Wire d="M280 330 L500 330" at={c('switching')} color={C.private} packets={2} packetShape="doc" packetColor={C.private} />
      <Card x={520} y={235} w={470} at={c('switching')} color={C.private} icon="swap" kicker="Switching house" title="e.g. Healthbridge · MediKredit" titleSize={28} />
      <Wire d="M990 330 L1270 330" at={c('to her scheme')} color={C.private} packets={2} packetShape="doc" packetColor={C.private} />
      <Chip text="often real time" icon="bolt" at={c('real time')} x={1040} y={380} color={C.private} size={18} />
      <Card x={1290} y={235} w={500} at={c('to her scheme')} color={C.private} icon="building" kicker="Medical scheme / administrator" title="Her scheme" titleSize={30} />
      <div style={{position: 'absolute', left: 520, top: 510, width: 560, padding: '22px 26px', background: '#1B1D22', borderRadius: 12, opacity: win(f, c('PHISC')), transform: `translateY(${(1 - ein(f, c('PHISC'), 18)) * 20}px)`}}>
        <div style={{fontFamily: FONT.body, fontSize: 14, fontWeight: 700, letterSpacing: '0.16em', color: '#9A968E', marginBottom: 10}}>ELECTRONIC CLAIM · SIMPLIFIED, ILLUSTRATIVE</div>
        {lines.map(([k, v, hl], i) => {
          const p = ein(f, c('PHISC') + 6 + i * 4, 10);
          const h = hl ? ein(f, c(hl), 12) : 0;
          return (
            <div key={i} style={{display: 'flex', fontFamily: FONT.mono, fontSize: 22, lineHeight: '42px', opacity: p}}>
              <span style={{width: 190, color: '#8E8A82'}}>{k}</span>
              <span style={{background: h ? `rgba(244,200,74,${h})` : 'transparent', color: h > 0.5 ? C.ink : '#ECE8DF', padding: '0 8px', borderRadius: 4}}>{v}</span>
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: 1290, top: 510, width: 500, opacity: win(f, c('scheme now knows'))}}>
        <div style={{display: 'flex', fontFamily: FONT.body, fontWeight: 700, fontSize: 14, letterSpacing: '0.12em', color: C.muted, paddingBottom: 8, borderBottom: `2px solid ${C.ink}`}}>
          <span style={{width: 150}}>DATE</span><span style={{width: 180, opacity: ein(f, c('treated for'), 10)}}>DIAGNOSIS CODE</span><span style={{opacity: ein(f, c('what was paid'), 10)}}>PAID</span>
        </div>
        {rows.map((_, i) => {
          const at = i === 0 ? c('scheme now knows') : many + (i - 1) * 4;
          return (
            <div key={i} style={{display: 'flex', fontFamily: FONT.mono, fontSize: 19, lineHeight: '38px', borderBottom: `1px solid ${C.rule}`, color: C.ink2, opacity: ein(f, at, 10)}}>
              <span style={{width: 150}}>{`20••-${String(((i * 5) % 12) + 1).padStart(2, '0')}`}</span>
              <span style={{width: 180, opacity: ein(f, c('treated for'), 10)}}>{['I10', 'I10', 'E78.5', 'J06.9', 'I10', 'Z00.0', 'I10', 'M54.5', 'I10'][i]}</span>
              <span style={{opacity: ein(f, c('what was paid'), 10)}}>R •••</span>
            </div>
          );
        })}
      </div>
      <Chip text="billing data" icon="check" at={c('billing data')} x={130} y={640} color={C.private} fill={C.privateSoft} size={22} />
      <Chip text="not a clinical record" icon="cross" at={c('not a clinical')} x={130} y={700} color={C.ink2} size={22} />
      <Text at={c('not a clinical') + 10} x={134} y={770} size={21} width={340} color={C.muted}>No notes, vital signs or results — codes, dates and amounts</Text>
      <Source text="PHISC MEDCLM (EDIFACT) standard · MediKredit HealthNet ST · Council for Medical Schemes" at={c('PHISC')} />
    </Drift>
  );
};

/* ============================================================ 14 · Private labs and pharmacy */
export const S14: SceneFC = ({frames}) => {
  const c = useCue();
  return (
    <Drift frames={frames} amount={0.02}>
      <Badge icon="doctor" x={220} y={340} size={140} color={C.private} at={0} label="GP" />
      <Wire d="M300 300 C420 220 520 220 620 250" at={c('blood')} color={C.red} packets={2} packetColor={C.red} label="sample" labelOffset={[0, -20]} />
      <Card x={640} y={180} w={560} at={c('private laboratory')} color={C.agg} icon="flask" kicker="Private laboratory" title="Ampath · Lancet · PathCare" titleSize={30} />
      <Wire d="M640 360 C520 460 420 460 310 400" at={c('goes back')} color={C.agg} packets={2} packetColor={C.agg} />
      <Chip text="lab's own portal or app" icon="tablet" at={c('portal')} x={420} y={470} color={C.agg} fill={C.aggSoft} size={20} />
      <Label text="back to the requesting doctor" at={c('doctor who asked')} x={1220} y={250} color={C.agg} width={520} />
      {/* pharmacy row */}
      <Sheet x={130} y={600} w={220} at={c('prescription')} title="Rx" rot={-4} lines={[{text: 'amlodipine 5 mg', at: c('prescription') + 8, size: 20}]} />
      <Wire d="M370 760 L520 760" at={c('retail pharmacy')} color={C.private} />
      <Badge icon="pill" x={610} y={760} size={130} color={C.private} at={c('retail pharmacy')} label="Retail pharmacy" />
      <Card x={760} y={680} w={400} at={c('dispensing software')} color={C.private} icon="laptop" kicker="Dispensing software" title="e.g. ProPharm" titleSize={28} />
      <Wire d="M1160 760 L1320 760" at={c('its own claim')} color={C.private} packets={2} packetShape="doc" packetColor={C.private} />
      <Badge icon="swap" x={1400} y={760} size={110} color={C.private} at={c('switch')} label="Switch" />
      <Wire d="M1460 760 L1600 760" at={c('switch') + 8} color={C.private} packets={2} packetShape="doc" packetColor={C.private} />
      <Badge icon="building" x={1690} y={760} size={130} color={C.private} at={c('switch') + 8} label="Scheme" />
      <Source text="PathCare, Ampath, Lancet doctor-results services · Computassist ProPharm" at={c('private laboratory')} />
    </Drift>
  );
};

/* ============================================================ 15 · Private hospitals */
export const S15: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const net = c("Netcare's");
  const serve = c('serves Netcare');
  const spec = c('specialists');
  return (
    <Drift frames={frames} amount={0.02}>
      <div style={{position: 'absolute', left: 110, top: 170, width: 860, height: 700, borderRadius: 24, border: `3px ${ein(f, serve, 6) > 0.5 ? 'solid' : 'dashed'} ${C.private}`, opacity: win(f, c("that group's") ), background: `rgba(196,88,62,${0.06 * ein(f, serve, 20)})`}} />
      <Kinetic text="Netcare · CareOn" at={net} x={160} y={210} size={56} color={C.ink} />
      <Label text="Group-wide electronic medical record" at={net + 6} x={164} y={286} color={C.private} />
      <div style={{position: 'absolute', left: 160, top: 350, width: 400}}>
        {Array.from({length: 45}).map((_, i) => {
          const at = c('forty-five') + i * 0.9;
          return <div key={i} style={{position: 'absolute', left: (i % 9) * 44, top: Math.floor(i / 9) * 56, opacity: ein(f, at, 8)}}><Icon name="hospital" size={34} color={C.private} stroke={2} /></div>;
        })}
      </div>
      <Label text="45 hospitals" at={c('forty-five')} x={164} y={640} color={C.ink} size={22} />
      <Counter value={13210} at={c('iPads')} x={600} y={360} size={64} suffix="+" dur={30} />
      <Label text="iPads" at={c('iPads')} x={604} y={432} />
      <Counter value={30968} at={c('thirty-one')} x={600} y={500} size={64} dur={30} />
      <Label text="active users" at={c('thirty-one')} x={604} y={572} />
      <Label text="serves Netcare only" at={serve} x={160} y={800} color={C.private} size={22} />
      {[{t: 'Mediclinic', x: 1040}, {t: 'Life Healthcare', x: 1430}].map((g, i) => (
        <div key={i} style={{position: 'absolute', left: g.x, top: 170, width: 360, height: 300, borderRadius: 24, border: `3px solid ${C.ink2}`, opacity: win(f, c('Mediclinic') + i * 8), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14}}>
          <Icon name="hospital" size={70} color={C.ink2} />
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 36, color: C.ink}}>{g.t}</div>
          <div style={{fontFamily: FONT.body, fontWeight: 600, fontSize: 20, letterSpacing: '0.1em', color: C.muted}}>OWN SYSTEMS</div>
        </div>
      ))}
      {Array.from({length: 5}).map((_, i) => (
        <React.Fragment key={i}>
          <Badge icon="doctor" x={1090 + i * 150} y={620} size={96} color={C.ink2} at={spec + i * 4} />
          <div style={{position: 'absolute', left: 1068 + i * 150, top: 690, opacity: ein(f, c('own software') + i * 3, 10)}}><Icon name="laptop" size={44} color={C.private} stroke={2} /></div>
        </React.Fragment>
      ))}
      <Label text="Independent specialists · each with own practice software" at={spec} x={1040} y={770} width={760} color={C.ink2} />
      <Source text="Netcare Integrated Report 2024 — Digital transformation and data" at={net} />
    </Drift>
  );
};

/* ============================================================ 16 · How a doctor actually finds out */
type Step = {n: number; icon: IconName; t: string; cond?: string; cue: string};
export const S16: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const steps: Step[] = [
    {n: 1, icon: 'speech', t: 'Ask the patient', cue: 'ask her'},
    {n: 2, icon: 'doc', t: 'Read what she carries', cond: 'patient-held paper', cue: 'carrying'},
    {n: 3, icon: 'flask', t: 'Search a lab portal', cond: 'if they have access', cue: 'lab portal'},
    {n: 4, icon: 'hospital', t: "Open the group's or province's system", cond: 'only if treated there', cue: 'same hospital group'},
    {n: 5, icon: 'card', t: 'Discovery HealthID', cond: 'members only · consent per doctor', cue: 'Discovery'},
    {n: 6, icon: 'phone', t: 'Phone · email · fax', cond: '+ signed request for copies', cue: 'phone call'},
  ];
  const starts = steps.map((s) => c(s.cue));
  const vis = (i: number) => win(f, starts[i], i < 5 ? starts[i + 1] - 4 : undefined);
  return (
    <Drift frames={frames} amount={0.015}>
      <Badge icon="doctor" x={200} y={210} size={110} color={C.ink} at={c('new doctor')} />
      <Kinetic text="How does a new doctor learn her history?" at={c('How do')} x={290} y={178} size={42} width={900} />
      <div style={{position: 'absolute', left: 120, top: 320, width: 820}}>
        {steps.map((s, i) => {
          const p = ein(f, starts[i], 16);
          const active = vis(i);
          return (
            <div key={i} style={{display: 'flex', gap: 20, alignItems: 'center', height: 104, opacity: p * (0.45 + 0.55 * active), transform: `translateX(${(1 - p) * 30}px)`}}>
              <div style={{width: 58, height: 58, borderRadius: 29, background: active > 0.5 ? C.ink : 'transparent', border: `2.5px solid ${C.ink}`, color: active > 0.5 ? C.paper : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.mono, fontWeight: 600, fontSize: 24}}>{s.n}</div>
              <Icon name={s.icon} size={40} color={C.ink2} stroke={1.8} />
              <div>
                <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 32, color: C.ink}}>{s.t}</div>
                {s.cond && <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 20, color: C.muted}}>{s.cond}</div>}
              </div>
            </div>
          );
        })}
      </div>
      {/* right-hand visual per step */}
      <AbsoluteFill style={{opacity: vis(0)}}>
        <Person x={1400} y={520} size={220} color={C.public} at={starts[0]} />
        <div style={{position: 'absolute', left: 1500, top: 300, padding: '18px 26px', background: C.card, border: `2px solid ${C.ink}`, borderRadius: 18, fontFamily: FONT.body, fontSize: 26, fontWeight: 500, color: C.ink, opacity: ein(f, starts[0] + 10, 12)}}>“I was at the clinic, then the hospital…”</div>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: vis(1)}}>
        {[{t: 'Referral letter', cue: 'referral letter'}, {t: 'Clinic card', cue: 'clinic card'}, {t: 'Maternity case record', cue: 'maternity'}, {t: 'Road to Health booklet', cue: 'Road to Health'}].map((d, i) => (
          <Sheet key={i} x={1060 + i * 190} y={260 + (i % 2) * 70} w={250} at={c(d.cue)} title={d.t} rot={-6 + i * 4} accent={i === 3 ? C.public : C.manilaDark} />
        ))}
        <Chip text="held by the patient, by design" icon="person" at={c('by design')} x={1120} y={760} color={C.manilaDark} size={22} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: vis(2)}}>
        <Window x={1080} y={260} w={700} h={420} at={starts[2]} title="Lab results portal" accent={C.agg}>
          <div style={{position: 'absolute', left: 30, top: 30, display: 'flex', gap: 10, alignItems: 'center', fontFamily: FONT.mono, fontSize: 22, color: C.ink2}}><Icon name="search" size={30} color={C.agg} /> search: patient…</div>
          {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 30, top: 100 + i * 70, width: 640, height: 50, borderRadius: 8, background: '#F3F1EC', opacity: ein(f, starts[2] + 14 + i * 6, 10)}} />)}
        </Window>
        <Chip text="NHLS WebView · private lab portals — each separate" at={starts[2] + 10} x={1080} y={710} color={C.agg} size={20} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: vis(3)}}>
        <Card x={1080} y={280} w={330} at={starts[3]} color={C.private} icon="tablet" kicker="Same group" title="e.g. CareOn inside Netcare" titleSize={26} />
        <Card x={1450} y={280} w={330} at={c('same province')} color={C.public} icon="hospital" kicker="Same province" title="e.g. Clinicom / SPV in the W. Cape" titleSize={26} />
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: vis(4)}}>
        <Window x={1180} y={220} w={480} h={560} at={starts[4]} title="HealthID" accent={C.private}>
          {['Consultations (from claims)', 'Medicines (from claims)', 'Pathology results'].map((t, i) => <div key={i} style={{margin: '26px 26px 0', padding: '16px 18px', borderRadius: 10, background: C.privateSoft, fontFamily: FONT.body, fontSize: 21, fontWeight: 600, color: C.private, opacity: ein(f, c('claims') + i * 6, 10)}}>{t}</div>)}
          <div style={{position: 'absolute', left: 26, bottom: 26}}><Chip text="patient consent for this doctor" icon="check" at={c('consents')} x={0} y={0} color={C.private} fill={C.card} size={18} /></div>
        </Window>
      </AbsoluteFill>
      <AbsoluteFill style={{opacity: vis(5)}}>
        {(['phone', 'mail', 'printer'] as IconName[]).map((ic, i) => <Badge key={i} icon={ic} x={1180 + i * 200} y={380} size={130} color={C.ink} at={[c('phone call'), c('email'), c('fax')][i]} label={['Phone call', 'Email', 'Fax'][i]} />)}
        <Sheet x={1280} y={560} w={330} at={c('signed request')} title="Request for copies" rot={2} lines={[{text: 'Patient consent: ✓', at: c('signed request') + 10, size: 22}, {text: 'Signed: N.', at: c('copies') , size: 22}]} />
      </AbsoluteFill>
      <Source text="Discovery HealthID (consent per doctor) · HPCSA Booklet 9 on releasing records · synthesis in research/RESEARCH.md §10" at={starts[1]} />
    </Drift>
  );
};

/* ============================================================ 17 · Rules and standards */
export const S17: SceneFC = ({frames}) => {
  const c = useCue();
  const f = useCurrentFrame();
  const line = c('Standards');
  const nodes = [
    {x: 420, year: '2014', t: 'Interoperability framework (HNSF)', s: 'points to HL7 and other international standards', cue: '2014'},
    {x: 900, year: '2015 →', t: 'HPRS', s: 'meant to become the national master patient index', cue: 'H P R S'},
    {x: 1420, year: '15 May 2024', t: 'National Health Insurance Act signed', s: 'envisions one national health information system', cue: 'May 2024'},
  ];
  return (
    <Drift frames={frames} amount={0.02}>
      <Card x={130} y={170} w={880} at={c('Protection')} color={C.ink} icon="law" kicker="Protection of Personal Information Act · section 32" title="Health professionals may process health information to treat a patient" titleSize={30} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={200} x2={200 + 1560 * ein(f, line, 40)} y1={560} y2={560} stroke={C.ink} strokeWidth={3} />
      </svg>
      {nodes.map((n, i) => {
        const p = ein(f, c(n.cue), 16);
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: n.x - 13, top: 547, width: 26, height: 26, borderRadius: 13, background: C.ink, transform: `scale(${p})`}} />
            <div style={{position: 'absolute', left: n.x - 12, top: 490, fontFamily: FONT.mono, fontWeight: 600, fontSize: 24, color: C.ink, opacity: p}}>{n.year}</div>
            <div style={{position: 'absolute', left: n.x - 12, top: 610, width: 400, opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
              <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 32, color: C.ink, lineHeight: 1.1}}>{n.t}</div>
              <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 22, color: C.ink2, marginTop: 10, lineHeight: 1.3}}>{n.s}</div>
            </div>
          </React.Fragment>
        );
      })}
      <Chip text="HL7" at={c('HL7')} x={420} y={800} color={C.agg} fill={C.aggSoft} size={22} mono />
      <div style={{position: 'absolute', left: 1400, top: 820, padding: '8px 18px', border: `3px solid ${C.red}`, color: C.red, borderRadius: 6, fontFamily: FONT.body, fontWeight: 800, fontSize: 26, letterSpacing: '0.08em', opacity: ein(f, c('not yet'), 6), transform: `rotate(-4deg) scale(${1.5 - 0.5 * ein(f, c('not yet'), 10)})`}}>NOT YET IN EFFECT</div>
      <Source text="POPIA s32 · NDoH National Health Normative Standards Framework (2014) · NHI Act 20 of 2023 (Bowmans)" at={c('Protection')} />
    </Drift>
  );
};
