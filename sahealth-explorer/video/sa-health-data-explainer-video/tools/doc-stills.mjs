// node tools/doc-stills.mjs [beatIndex ...] [--at=0.7]  → out/doc/<i>.jpg (frame at fraction of each beat)
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: 'Documentary'});
const beats = JSON.parse(fs.readFileSync('out/doc_beats.json', 'utf8'));
const frac = Number(process.argv.find((a) => a.startsWith('--at='))?.slice(5) ?? 0.75);
const only = process.argv.slice(2).filter((a) => !a.startsWith('--')).map(Number);
fs.mkdirSync('out/doc', {recursive: true});
for (let i = 0; i < beats.length; i++) {
  if (only.length && !only.includes(i)) continue;
  const b = beats[i];
  const frame = Math.min(comp.durationInFrames - 1, b.from + Math.floor(b.dur * frac));
  await renderStill({composition: comp, serveUrl, output: `out/doc/${String(i).padStart(3, '0')}.jpg`, frame, imageFormat: 'jpeg', jpegQuality: 70, scale: 0.4});
}
console.log('done', beats.length);
