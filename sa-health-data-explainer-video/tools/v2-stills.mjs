// node tools/v2-stills.mjs 3 12 18 ...   (seconds on master timeline) → out/v2/<sec>.jpg + sheet
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const secs = process.argv.slice(2).map(Number);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: process.env.COMP || 'Film'});
fs.mkdirSync('out/v2', {recursive: true});
for (const s of secs) {
  await renderStill({composition: comp, serveUrl, output: `out/v2/${String(s).padStart(5, '0')}.jpg`, frame: Math.round(s * 30), imageFormat: 'jpeg', jpegQuality: 80, scale: 0.5});
  process.stdout.write(s + ' ');
}
