// Render review stills: node tools/stills.mjs [sceneId ...]  (fractions of each scene)
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const t = JSON.parse(fs.readFileSync('public/data/timings.json', 'utf8'));
const FPS = 30, LEAD = 45, TAIL = Math.round(t.gapAfterSceneSec * FPS);
let from = 0, prev = '';
const plans = t.scenes.map((s) => {
  const chapter = s.section !== prev && s.section !== 'Intro'; prev = s.section;
  const lead = chapter ? LEAD : 0;
  const frames = lead + Math.ceil(s.duration * FPS) + TAIL;
  const p = {id: s.id, from, frames, lead}; from += frames; return p;
});
const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const fr = (process.argv.find((a) => a.startsWith('--at='))?.slice(5) ?? '0.3,0.65,0.95').split(',').map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: 'Explainer'});
fs.mkdirSync('out/stills', {recursive: true});
for (const p of plans) {
  if (only.length && !only.includes(p.id)) continue;
  for (const q of fr) {
    const frame = p.from + p.lead + Math.floor((p.frames - p.lead - TAIL) * q);
    const out = `out/stills/${p.id}_${Math.round(q * 100)}.jpg`;
    await renderStill({composition: comp, serveUrl, output: out, frame, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.5});
    console.log(out, frame);
  }
}
