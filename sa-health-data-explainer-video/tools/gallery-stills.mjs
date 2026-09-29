import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comp = await selectComposition({serveUrl, id: 'Gallery'});
fs.mkdirSync('out/gallery', {recursive: true});
const only = process.argv.slice(2).map(Number);
for (let i = 0; i < comp.durationInFrames / 150; i++) {
  if (only.length && !only.includes(i)) continue;
  await renderStill({composition: comp, serveUrl, output: `out/gallery/${String(i).padStart(2, '0')}.jpg`, frame: i * 150 + 140, imageFormat: 'jpeg', jpegQuality: 75, scale: 0.5});
  console.log(i);
}
