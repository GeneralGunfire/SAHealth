// Resolves every beat against the master transcript, reports ALL missing phrases, and
// writes out/doc_beats.json for the stills tool.
import fs from 'node:fs';

(globalThis as {COLLECT?: string[]}).COLLECT = [];
const {resolveBeats} = await import('../src/doc/engine');

const b = resolveBeats();
fs.mkdirSync('out', {recursive: true});
fs.writeFileSync('out/doc_beats.json', JSON.stringify(b.map((x) => ({t: x.t, from: x.from, dur: x.dur}))));
const flagged = b.map((x, i) => [i, x.t, (x.from / 30).toFixed(1), (x.dur / 30).toFixed(1)] as const).filter((x) => Number(x[3]) < 2.5 || Number(x[3]) > 45);
console.log('beats', b.length, 'flag (<2.5s or >45s):', JSON.stringify(flagged));
const errs = (globalThis as {COLLECT?: string[]}).COLLECT!;
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'all phrases resolved');
