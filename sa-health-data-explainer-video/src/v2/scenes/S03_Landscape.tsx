import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {C, E, FONT, lerp, prog, springAt, useCues} from '../core';
import {Caption, RollingNumber, SourceNote} from '../type';
import {DotMap} from '../graphics';

const BG = `radial-gradient(1600px 1000px at 50% 40%, ${C.navy} 0%, ${C.night} 72%)`;

/** Chapter title as a quiet two-line caption (used across the film). */
export const ChapterTitle: React.FC<{n: string; title: string; at: number; out: number}> = ({n, title, at, out}) => (
  <div style={{position: 'absolute', left: 150, top: 150}}>
    <Caption text={title} sub={n} at={at} out={out} size={76} weight={500} />
  </div>
);

/** 2:26 – 3:50 · the population map, medical schemes, 71 schemes, 5 in 6 */
export const S03_Landscape: React.FC = () => {
  const c = useCues();
  const f = useCurrentFrame();
  const open = c('it is a vast ecosystem', 146);
  const n62 = c('roughly 62 million', 161);
  const split = c('defining split', 175);
  const n917 = c('9.17 million beneficiaries', 187);
  const n71 = c('across 71', 196);
  const math = c('let me do the math', 209);
  const sixth = c('five out of every six', 217);
  const len = c.len;

  const tilt = lerp(0, 50, prog(f, n62 - 40, 110, E.inOut));
  const mapX = lerp(960, 640, prog(f, n62 - 40, 110, E.inOut)) - 120 * prog(f, n71 - 10, 60, E.inOut) * (1 - prog(f, math, 60, E.inOut));
  const priv = prog(f, n917, 60, E.inOut);
  const pubOn = prog(f, sixth, 50, E.inOut);
  const out = prog(f, len - 20, 20);
  return (
    <AbsoluteFill style={{background: BG, opacity: 1 - out}}>
      <DotMap x={mapX} y={560} scale={1.02} tilt={tilt} spin={-5 * prog(f, n62, 240, E.inOut)} revealAt={-200}
        style={(i, prov) => {
          const isPriv = random('p' + i) < 9.17 / 62;
          const h = (random('h' + i) * 16 + (prov === 'Gauteng' ? 36 : prov === 'KwaZulu-Natal' ? 14 : 3)) * prog(f, n62 + 10, 70, E.out) * (1 - priv * 0.75);
          const blue = isPriv && priv > 0.5;
          return {color: blue ? C.blue2 : pubOn > 0.5 && !isPriv ? '#EEF2FB' : C.ice, r: blue ? 4.2 : 3.3, h, o: isPriv ? 0.95 : lerp(0.8, pubOn > 0.5 ? 0.95 : 0.3, priv)};
        }}
      />
      <ChapterTitle n="Part one" title="The landscape" at={open + 10} out={n62 - 30} />

      <div style={{position: 'absolute', left: 1170, top: 330}}>
        {f < n917 && f >= n62 - 5 && (
          <>
            <RollingNumber value="62 000 000" at={n62} size={116} weight={500} />
            <div style={{marginTop: 18}}><Caption text="people in South Africa" at={n62 + 30} out={n917 - 12} size={40} weight={400} color="rgba(214,226,255,0.85)" /></div>
            <div style={{marginTop: 40}}><Caption text="The defining split: medical schemes." sub="South Africa’s name for private health insurance" at={split} out={n917 - 12} size={44} /></div>
          </>
        )}
        {f >= n917 - 4 && f < n71 && (
          <>
            <RollingNumber value="9 170 000" at={n917} size={116} weight={500} color={C.blue2} />
            <div style={{marginTop: 18}}><Caption text="covered by a medical scheme" at={n917 + 30} out={n71 - 10} size={40} weight={400} color="rgba(214,226,255,0.85)" /></div>
          </>
        )}
      </div>
      <SourceNote text="Stats SA, Census 2022 · Council for Medical Schemes, Annual Report 2024/25" at={n62} out={math + 40} />

      {/* 71 schemes: a quiet grid of tiles */}
      {f >= n71 - 4 && f < math + 40 && (
        <div style={{position: 'absolute', left: 1180, top: 300, opacity: 1 - prog(f, math, 30)}}>
          <RollingNumber value="71" at={n71} size={116} weight={500} />
          <div style={{marginTop: 14}}><Caption text="separate medical schemes" at={n71 + 30} size={40} weight={400} color="rgba(214,226,255,0.85)" /></div>
          <div style={{position: 'relative', marginTop: 40, width: 600, height: 300}}>
            {Array.from({length: 71}).map((_, i) => {
              const s = springAt(f, n71 + 20 + i * 0.7, {damping: 20, stiffness: 120});
              return <div key={i} style={{position: 'absolute', left: (i % 12) * 48, top: Math.floor(i / 12) * 48, width: 36, height: 36, borderRadius: 8, background: 'rgba(111,163,255,0.22)', border: '1px solid rgba(160,190,255,0.35)', transform: `scale(${Math.max(0, s)})`}} />;
            })}
          </div>
        </div>
      )}

      {/* 5 in 6 */}
      {f >= sixth - 10 && (
        <div style={{position: 'absolute', left: 1180, top: 290}}>
          <svg width={380} height={380} viewBox="-190 -190 380 380" style={{transform: 'rotate(-90deg)'}}>
            <circle r={160} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14} />
            <circle r={160} fill="none" stroke="#EEF2FB" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${(5 / 6 - 0.01) * prog(f, sixth, 70, E.inOut)} 1`} />
            <circle r={160} fill="none" stroke={C.blue2} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${(1 / 6 - 0.01) * prog(f, sixth + 30, 40, E.inOut)} 1`} strokeDashoffset={-(5 / 6)} />
          </svg>
          <div style={{position: 'absolute', left: 0, top: 0, width: 380, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.head, fontWeight: 500, fontSize: 96, color: C.white, opacity: prog(f, sixth + 10, 30)}}>5 in 6</div>
          <div style={{marginTop: 40}}><Caption text="rely mainly on the public health system" at={sixth + 30} size={42} weight={400} width={640} /></div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** 3:50 – 4:49 · two parallel streams of data, no bridge between them */
export const S04_Streams: React.FC = () => {
  const c = useCues();
  const f = useCurrentFrame();
  const two = c('two massive parallel highways', 230);
  const pub = c('public highway is built', 250);
  const priv = c('private highway', 257);
  const noBridge = c('there is no bridge', 276);
  const stays = c('data created on the public highway', 284);
  const out = prog(f, c.len - 20, 20);
  const lanes = [
    {y: 420, color: '#EEF2FB', label: 'Public', at: pub, n: 260, speed: 1.0},
    {y: 700, color: C.blue2, label: 'Private', at: priv, n: 110, speed: 1.25},
  ];
  const gap = prog(f, noBridge, 50, E.inOut);
  return (
    <AbsoluteFill style={{background: BG, opacity: 1 - out}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {lanes.map((l, li) => {
          const appear = prog(f, li === 0 ? 0 : 20, 60, E.inOut);
          return (
            <g key={li}>
              {Array.from({length: l.n}).map((_, i) => {
                const sp = (0.8 + random(`s${li}${i}`) * 0.6) * l.speed;
                const x = ((random(`x${li}${i}`) * 2200 + f * 3.2 * sp) % 2200) - 140;
                const y = l.y + (random(`y${li}${i}`) - 0.5) * 120 + noise2D(`n${li}`, i * 0.1, f * 0.006) * 8;
                const edge = Math.min(1, (x + 140) / 300, (2060 - x) / 300);
                return <circle key={i} cx={x} cy={y} r={2 + random(`r${li}${i}`) * 2.4} fill={l.color} opacity={Math.max(0, edge) * appear * (0.35 + random(`o${li}${i}`) * 0.65)} />;
              })}
            </g>
          );
        })}
        {/* the space where a bridge would be */}
        <g opacity={gap}>
          <line x1={960} x2={960} y1={500} y2={620} stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeDasharray="4 8" />
          <circle cx={960} cy={560} r={20} fill="none" stroke={C.red} strokeWidth={2} />
          <path d="M952 552 L968 568 M968 552 L952 568" stroke={C.red} strokeWidth={2.4} strokeLinecap="round" />
        </g>
      </svg>
      {lanes.map((l, i) => (
        <div key={i} style={{position: 'absolute', left: 150, top: l.y - 118}}>
          <Caption text={l.label} at={l.at} size={36} weight={500} color={i ? C.blue2 : '#EEF2FB'} width={400} />
        </div>
      ))}
      <div style={{position: 'absolute', left: 150, bottom: 110}}>
        <Caption text="Two systems, running side by side." at={two} out={noBridge - 10} />
        <Caption text="By default, there is no bridge between them." at={noBridge} out={stays - 8} />
        <Caption text="Data created on one side stays on that side." at={stays} />
      </div>
    </AbsoluteFill>
  );
};
