import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {C, E, FONT, lerp, prog, useCues} from '../core';
import {Caption} from '../type';
import {DOT_H, DOT_PROV, DOT_W, DOTS} from '../../data/sadots';

/*
 * 0:00 – 2:26 · one continuous "dot universe":
 * a thin ECG line → breaks into a quiet field of dots → one dot becomes Nomsa →
 * her data drifts away → the field reorganises into the map of South Africa
 * (ending exactly where the landscape scene's map begins).
 */

// Map geometry must match S03_Landscape's first frame: centre (960,560), scale 1.02, no tilt.
const MAP_SCALE = 1.02;
const mapPos = (i: number) => {
  const [x, y] = DOTS[i];
  return [960 - (DOT_W * MAP_SCALE) / 2 + x * MAP_SCALE, 560 - (DOT_H * MAP_SCALE) / 2 + y * MAP_SCALE] as const;
};
// Evenly jittered field covering the frame (slightly overscanned).
const COLS = 62, ROWS = 40;
const fieldPos = (i: number) => {
  const cell = Math.floor(random('cell' + i) * COLS * ROWS);
  const cx = cell % COLS, cy = Math.floor(cell / COLS);
  return [-120 + (cx + 0.5 + (random('jx' + i) - 0.5) * 0.8) * (2160 / COLS), -80 + (cy + 0.5 + (random('jy' + i) - 0.5) * 0.8) * (1240 / ROWS)] as const;
};
const ecg = (x: number, phase: number) => {
  const period = 520;
  const ph = (((x + phase) % period) + period) % period / period;
  if (ph > 0.40 && ph < 0.45) return -14 * Math.sin(((ph - 0.40) / 0.05) * Math.PI);
  if (ph > 0.48 && ph < 0.50) return 22 * ((ph - 0.48) / 0.02);
  if (ph >= 0.50 && ph < 0.53) return 22 - 170 * ((ph - 0.50) / 0.03);
  if (ph >= 0.53 && ph < 0.56) return -148 + 186 * ((ph - 0.53) / 0.03);
  if (ph >= 0.56 && ph < 0.58) return 38 - 38 * ((ph - 0.56) / 0.02);
  if (ph > 0.64 && ph < 0.75) return -22 * Math.sin(((ph - 0.64) / 0.11) * Math.PI);
  return 0;
};

// Nomsa: one dot (inside KwaZulu-Natal once the map forms — purely illustrative).
const NOMSA = DOTS.findIndex(([x, y, p]) => DOT_PROV[p] === 'KwaZulu-Natal' && x > 800 && y > 420);

export const S01_Open: React.FC = () => {
  const c = useCues();
  const f = useCurrentFrame();
  const seconds = c('doctors surrounding', 14);
  const story = c('they need to know your story', 22);
  const body = c('physical matter of your body', 35);
  const dive = c("welcome to today's deep dive", 46);
  const trail = c('trail of a single', 62);
  const nomsa = c('call her', 66);
  const born = c('pulse is taken', 86);
  const where = c('where does it go', 94);
  const rule = c('ground rule', 106);
  const observe = c('purely as observers', 111);
  const terrain = c('map the terrain', 125);
  const save = c('save all the major revelations', 133);

  // phases
  const lineDraw = prog(f, 8, 90, E.inOut);
  const dissolve = prog(f, body + 20, 110, E.inOut); // line → field
  const morph = prog(f, terrain, 260, E.inOut); // field → map
  const nomsaOn = prog(f, trail, 40, E.out) * (1 - prog(f, save + 40, 60));
  const [nx, ny] = (() => {
    const fp = fieldPos(NOMSA), mp = mapPos(NOMSA);
    return [lerp(fp[0], mp[0], morph), lerp(fp[1], mp[1], morph)];
  })();
  // camera: gentle push toward Nomsa while she is introduced, then back out for the map
  const zoomIn = prog(f, trail - 10, 120, E.cam) * (1 - prog(f, where + 40, 150, E.cam));
  const zs = 1 + 1.4 * zoomIn;
  const camX = lerp(960, nx, zoomIn), camY = lerp(540, ny, zoomIn);
  const tf = `translate(960px, 540px) scale(${zs}) translate(${-camX}px, ${-camY}px)`;

  const phase = f * 8;
  let path = '';
  for (let x = 0; x <= 1920 * lineDraw; x += 4) path += `${x ? 'L' : 'M'}${x} ${540 + ecg(x, phase)}`;
  const lineOp = 1 - prog(f, body + 10, 40);

  // satellites: data created around Nomsa, then drifting off
  const sats = [0, 1, 2, 3].map((k) => ({at: born + k * 30, a: -2.2 + k * 1.45}));
  const drift = prog(f, where, 120, E.inOut);

  return (
    <AbsoluteFill style={{background: `radial-gradient(1600px 1000px at 50% 40%, ${C.navy} 0%, ${C.night} 72%)`}}>
      <AbsoluteFill style={{transform: tf, transformOrigin: '0 0'}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {/* the heartbeat */}
          {lineOp > 0 && (
            <g opacity={lineOp}>
              <path d={path} fill="none" stroke="#7FE6B8" strokeWidth={2.4} strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 10px rgba(127,230,184,0.55))'}} />
              {lineDraw < 1 && <circle cx={1920 * lineDraw} cy={540 + ecg(1920 * lineDraw, phase)} r={5} fill="#C9FFE6" style={{filter: 'drop-shadow(0 0 12px #7FE6B8)'}} />}
            </g>
          )}
          {/* the dot universe */}
          {dissolve > 0 && DOTS.map((_, i) => {
            const [fx, fy] = fieldPos(i);
            const [mx, my] = mapPos(i);
            const lx = Math.max(0, Math.min(1920, fx)), ly = 540 + ecg(lx, phase);
            const d = prog(f, body + 20 + random('d' + i) * 50, 90, E.inOut);
            const wob = 1 - morph;
            const x0 = lerp(lx, fx, d) + noise2D('x', i * 0.05, f * 0.004) * 10 * wob;
            const y0 = lerp(ly, fy, d) + noise2D('y', i * 0.05, f * 0.004) * 10 * wob;
            const x = lerp(x0, mx, morph), y = lerp(y0, my, morph);
            const tw = 0.55 + 0.45 * Math.sin(f / 23 + i * 1.7);
            const isN = i === NOMSA;
            const base = lerp(0.5 * tw + 0.1, 0.8, morph);
            const r = lerp(2.4, 3.3, morph);
            return <circle key={i} cx={x} cy={y} r={isN ? r + 2 * nomsaOn : r} fill={isN && nomsaOn > 0.1 ? C.blue2 : C.ice} opacity={d * (isN ? Math.max(base, nomsaOn) : base * (1 - 0.45 * nomsaOn * (1 - morph)))} />;
          })}
          {/* Nomsa's ring + data satellites */}
          {nomsaOn > 0 && (
            <g>
              <circle cx={nx} cy={ny} r={18 + 4 * Math.sin(f / 12)} fill="none" stroke={C.blue2} strokeWidth={1.2} opacity={0.8 * nomsaOn} />
              <circle cx={nx} cy={ny} r={40 + ((f % 90) / 90) * 60} fill="none" stroke={C.blue2} strokeWidth={1} opacity={(1 - (f % 90) / 90) * 0.4 * nomsaOn} />
              {sats.map((s, k) => {
                const a = prog(f, s.at, 30, E.out);
                if (a <= 0) return null;
                const r0 = 70, ang = s.a + f * 0.004;
                const sx0 = nx + Math.cos(ang) * r0, sy0 = ny + Math.sin(ang) * r0;
                const far = 900 + k * 120;
                const sx = lerp(sx0, nx + Math.cos(s.a) * far, drift), sy = lerp(sy0, ny + Math.sin(s.a) * far * 0.6, drift);
                return (
                  <g key={k} opacity={a * (1 - prog(f, where + 110, 40))}>
                    <line x1={nx} y1={ny} x2={sx} y2={sy} stroke={C.blue2} strokeWidth={0.8} opacity={0.35 * (1 - drift)} />
                    <circle cx={sx} cy={sy} r={5} fill={C.white} style={{filter: `drop-shadow(0 0 8px ${C.blue2})`}} />
                  </g>
                );
              })}
            </g>
          )}
        </svg>
        {nomsaOn > 0 && (
          <div style={{position: 'absolute', left: nx + 34, top: ny - 26, opacity: prog(f, nomsa, 30) * nomsaOn * (1 - prog(f, where, 30)), transform: `scale(${1 / zs})`, transformOrigin: '0 50%'}}>
            <div style={{fontFamily: FONT.head, fontWeight: 500, fontSize: 44, color: C.white}}>Nomsa</div>
            <div style={{fontFamily: FONT.body, fontWeight: 400, fontSize: 22, color: 'rgba(214,226,255,0.7)', marginTop: 4}}>A hypothetical patient</div>
          </div>
        )}
      </AbsoluteFill>

      {/* captions — one idea at a time, lower left */}
      <div style={{position: 'absolute', left: 150, bottom: 150}}>
        <Caption text="In an emergency, doctors have seconds to decide." at={seconds} out={story - 12} />
        <Caption text="To decide safely, they need your history." sub="Allergies. Medication. Underlying conditions." at={story} out={body - 8} />
        <Caption text="Your body is on the table. Your history is invisible." at={body + 6} out={dive - 16} />
      </div>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <Caption text="How patient data moves through South African healthcare" at={dive} out={trail - 10} size={84} weight={500} align="center" width={1400} />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 150, bottom: 150}}>
        <Caption text="Every visit creates data." at={born + 70} out={where - 6} />
        <Caption text="Where does it go — and does it travel with her?" at={where} out={rule - 6} />
        <Caption text="First, we observe how the system works." at={observe} out={save - 8} />
      </div>
      <div style={{position: 'absolute', left: 150, top: 150}}>
        <Caption text="The critique comes at the end." at={save} out={save + 300} />
      </div>
    </AbsoluteFill>
  );
};
