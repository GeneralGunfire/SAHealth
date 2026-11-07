/**
 * Ad-style renderers for every beat type in the documentary.
 * Rules: near-black grounds, no glow, Google Sans, one idea per screen,
 * thin white line-work, a single blue accent, captions small and centred.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {E, FONT, prog, springAt} from './core';
import {BlurWords} from './ad';
import {DOT_H, DOT_PROV, DOT_W, DOTS} from '../data/sadots';

const BLUE = '#4285F4';
const INK = '#F2F5FF';
const MUTE = 'rgba(210,222,245,0.62)';
const BG = '#05070C';
const strip = (s: string) => s.replace(/\*/g, '');

/* ------------------------------------------------------------ primitives */
const Fade: React.FC<{at?: number; children: React.ReactNode; y?: number; style?: React.CSSProperties}> = ({at = 0, children, y = 14, style}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, 22, E.out);
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * y}px)`, filter: `blur(${(1 - p) * 8}px)`, ...style}}>{children}</div>;
};
const Center: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = '#000'}) => (
  <AbsoluteFill style={{background: bg, justifyContent: 'center', alignItems: 'center'}}>{children}</AbsoluteFill>
);
const Cap: React.FC<{text: string; at?: number}> = ({text, at = 10}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 800, display: 'flex', justifyContent: 'center'}}><BlurWords text={strip(text)} at={at} size={38} /></div>
);
/** Splits text into sentences for sequential cards. */
const sentences = (t: string) => (strip(t).match(/[^.?!…]+[.?!…]*["”’]?/g) ?? [t]).map((x) => x.trim()).filter(Boolean);

/** Sequential text cards within one beat (each sentence gets its own moment). */
const TextSeq: React.FC<{text: string; len: number; size?: number}> = ({text, len, size = 50}) => {
  const f = useCurrentFrame();
  const parts = sentences(text);
  const per = len / parts.length;
  const idx = Math.min(parts.length - 1, Math.floor(f / per));
  return (
    <Center>
      <div key={idx} style={{maxWidth: 1500, textAlign: 'center'}}>
        <WrapWords text={parts[idx]} at={Math.round(idx * per) + 2} size={size} />
      </div>
    </Center>
  );
};
/** BlurWords that may wrap (long sentences). */
const WrapWords: React.FC<{text: string; at: number; size: number; color?: string; weight?: number}> = ({text, at, size, color = INK, weight = 400}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: FONT.body, fontWeight: weight, fontSize: size, color, lineHeight: 1.3, letterSpacing: '-0.005em'}}>
      {text.split(' ').map((w, i) => {
        const p = prog(f, at + i * 4, 18, E.out);
        return <span key={i} style={{display: 'inline-block', marginRight: '0.26em', opacity: p, filter: `blur(${(1 - p) * 10}px)`}}>{w}</span>;
      })}
    </div>
  );
};

/* ------------------------------------------------------------ line icons (thin, white) */
const ICON: Record<string, string[]> = {
  person: ['M12 3.5a3.5 3.5 0 1 0 .01 0', 'M5 21c0-4 3.1-7 7-7s7 3 7 7'],
  doctor: ['M12 3.5a3.5 3.5 0 1 0 .01 0', 'M5 21c0-4 3.1-7 7-7s7 3 7 7', 'M15 17.5h3.5M16.75 15.75v3.5'],
  clinic: ['M3 21V9.5l9-5.5 9 5.5V21', 'M1.5 21h21', 'M12 10v6M9 13h6'],
  hospital: ['M4 21V4h16v17', 'M2 21h20', 'M12 6.5v5M9.5 9h5', 'M10.5 21v-3.5h3V21'],
  folder: ['M2.5 5.5h6.5l2 2.2h10.5v12H2.5z'],
  doc: ['M6 2.5h9l4 4v15H6z', 'M15 2.5v4h4', 'M9 11h7M9 14h7M9 17h4.5'],
  flask: ['M9 3h6', 'M10 3v6.5l-5.3 8.8A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.7-2.7L14 9.5V3'],
  printer: ['M7 9V3h10v6', 'M4 9h16v8H4z', 'M7 14h10v7H7z'],
  pill: ['M4.9 13.1l8.2-8.2a4 4 0 0 1 5.7 5.7l-8.2 8.2a4 4 0 0 1-5.7-5.7z', 'M9 9l6 6'],
  box: ['M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5z', 'M3 7.5l9 4.5 9-4.5', 'M12 12v9'],
  ambulance: ['M1.5 17V6.5h12V17', 'M13.5 10h4.5l4 4.2V17h-8.5', 'M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M15 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  drop: ['M12 3s6.5 7.2 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.2 12 3 12 3z'],
  image: ['M3 4h18v16H3z', 'M3 16l5-5 4 4 3-3 6 6'],
  phone: ['M5 3h3.5l2 5-2.5 1.5a11 11 0 0 0 6.5 6.5L16 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z'],
  laptop: ['M5 5h14v10H5z', 'M2 19h20l-2-4H4z'],
  card: ['M2.5 5.5h19v13h-19z', 'M13 10h6M13 13.5h4'],
  db: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z', 'M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6'],
  tablet: ['M5.5 2.5h13v19h-13z'],
  swap: ['M3 8h15l-3.5-3.5', 'M21 16H6l3.5 3.5'],
  building: ['M4 21V3h10v18', 'M14 8h6v13', 'M2 21h20'],
  chart: ['M4 20V11M10 20V5M16 20v-6M2 20h20'],
  search: ['M10.5 4a6.5 6.5 0 1 0 .01 0', 'M15.5 15.5L21 21'],
  keyboard: ['M2.5 7h19v10h-19z', 'M7 14h10'],
  book: ['M4 4.5h7a2 2 0 0 1 2 2V21a2 2 0 0 0-2-2H4z', 'M20 4.5h-7a2 2 0 0 0-2 2', 'M20 4.5V19h-7a2 2 0 0 0-2 2'],
  globe: ['M12 3a9 9 0 1 0 .01 0', 'M3 12h18'],
  lock: ['M5 11h14v10H5z', 'M8 11V7a4 4 0 0 1 8 0v4'],
  alert: ['M12 3l10 18H2z', 'M12 10v5'],
  heart: ['M12 20s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 5.8-8 11-8 11z'],
  pen: ['M4 20l4-1 11-11-3-3L5 16z'],
  x: ['M6 6l12 12M18 6L6 18'],
  check: ['M4.5 12.5l5 5 10-11'],
};
const Icon: React.FC<{name: string; size?: number; at?: number; color?: string}> = ({name, size = 96, at = 0, color = INK}) => {
  const f = useCurrentFrame();
  const paths = ICON[name] ?? ICON.doc;
  const p = prog(f, at, 34, E.inOut);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible'}}>
      {paths.map((d, i) => <path key={i} d={d} fill="none" stroke={color} strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, p * paths.length - i))} />)}
    </svg>
  );
};

/* ------------------------------------------------------------ renderers */
type P = Record<string, any> & {len: number};

const Headline: React.FC<P> = ({lines, len, subtitle}) => {
  const text = (lines as string[]).join(' ').replace(/\s+/g, ' ');
  if (subtitle && sentences(text).length === 1) {
    return (
      <Center>
        <div style={{textAlign: 'center'}}>
          <WrapWords text={strip(text)} at={2} size={text.length < 16 ? 96 : 54} weight={text.length < 16 ? 500 : 400} />
          <Fade at={24}><div style={{marginTop: 22, fontFamily: FONT.body, fontSize: 26, color: MUTE}}>{strip(subtitle)}</div></Fade>
        </div>
      </Center>
    );
  }
  return <TextSeq text={text} len={len} size={text.length < 18 ? 80 : 50} />;
};

const Chapter: React.FC<P> = ({n, title, sub}) => {
  const f = useCurrentFrame();
  const l = prog(f, 10, 40, E.inOut);
  return (
    <Center>
      <div style={{textAlign: 'center'}}>
        <Fade at={0}><div style={{fontFamily: FONT.body, fontSize: 24, color: MUTE, letterSpacing: '0.02em'}}>Part {n}</div></Fade>
        <div style={{height: 22}} />
        <WrapWords text={title} at={8} size={76} weight={500} />
        <div style={{margin: '26px auto 0', width: 90 * l, height: 2, background: BLUE, borderRadius: 2}} />
        {sub && <Fade at={30}><div style={{marginTop: 22, fontFamily: FONT.body, fontSize: 26, color: MUTE}}>{sub}</div></Fade>}
      </div>
    </Center>
  );
};

const Stat: React.FC<P> = ({value, dec = 0, prefix = '', suffix = '', label, sub}) => {
  const countAt = 4;
  const f = useCurrentFrame();
  const p = prog(f, countAt, 50, E.out);
  const v = (value * p).toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (
    <Center bg={BG}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 190, color: INK, letterSpacing: '-0.03em', lineHeight: 1, opacity: prog(f, countAt, 10), fontVariantNumeric: 'tabular-nums'}}>
          {prefix}{v}<span style={{color: BLUE}}>{suffix}</span>
        </div>
        <Fade at={countAt + 20}><div style={{marginTop: 30, fontFamily: FONT.body, fontSize: 40, color: INK}}>{strip(label)}</div></Fade>
        {sub && <Fade at={countAt + 34}><div style={{marginTop: 12, fontFamily: FONT.body, fontSize: 26, color: MUTE}}>{strip(sub)}</div></Fade>}
      </div>
    </Center>
  );
};

const Bars: React.FC<P> = ({title, bars, max, refLine}) => {
  const f = useCurrentFrame();
  const W = 1000;
  return (
    <Center bg={BG}>
      <div style={{width: 1300}}>
        {bars.map((b: any, i: number) => {
          const p = prog(f, b.at, 40, E.out);
          return (
            <div key={i} style={{marginBottom: 46, opacity: prog(f, b.at, 12)}}>
              <div style={{fontFamily: FONT.body, fontSize: 26, color: MUTE, marginBottom: 12}}>{b.label}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
                <div style={{height: 14, borderRadius: 7, width: (b.value / max) * W * p, background: b.accent ? BLUE : 'rgba(242,245,255,0.85)'}} />
                <div style={{fontFamily: FONT.body, fontWeight: 500, fontSize: 44, color: INK, opacity: prog(f, b.at + 16, 14)}}>{b.display}</div>
              </div>
            </div>
          );
        })}
        {refLine && <Fade at={refLine.at}><div style={{fontFamily: FONT.body, fontSize: 24, color: '#EA4335'}}>More records than people.</div></Fade>}
      </div>
      {title && <Cap text={title} at={6} />}
    </Center>
  );
};

/** Dot-matrix map — the piece the viewer liked. Flat, no tilt, no glow. */
const MapBeat: React.FC<P> = ({prov, title, lines, note}) => {
  const f = useCurrentFrame();
  const sc = 0.92;
  const col = (st?: {state: string; at: number}) => {
    if (!st) return {c: 'rgba(210,222,245,0.28)', r: 3.2};
    const on = prog(f, st.at, 18) > 0.5;
    if (!on) return {c: 'rgba(210,222,245,0.28)', r: 3.2};
    if (st.state === 'hatch') return {c: '#EA4335', r: 3.4};
    if (st.state === 'blue' || st.state === 'accent') return {c: BLUE, r: 4};
    return {c: INK, r: 3.6};
  };
  const cap = strip((lines ?? [title ?? '']).join(' '));
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', left: 960 - (DOT_W * sc) / 2, top: 420 - (DOT_H * sc) / 2}}>
        <svg viewBox={`0 0 ${DOT_W} ${DOT_H}`} width={DOT_W * sc} height={DOT_H * sc}>
          {DOTS.map(([x, y, pi], i) => {
            const a = Math.min(1, Math.max(0, (f - Math.hypot(x - 600, y - 300) / 25) / 12));
            const {c, r} = col(prov?.[DOT_PROV[pi]]);
            return <circle key={i} cx={x} cy={y} r={r * a} fill={c} />;
          })}
        </svg>
      </div>
      {cap && <Cap text={cap} at={8} />}
      {note && <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center'}}><Fade at={30}><span style={{fontFamily: FONT.body, fontSize: 26, color: MUTE}}>{strip(note)}</span></Fade></div>}
    </AbsoluteFill>
  );
};

const Flow: React.FC<P> = ({nodes, title}) => {
  const f = useCurrentFrame();
  const n = nodes.length, gap = n === 2 ? 620 : 470, x0 = 960 - (gap * (n - 1)) / 2, y = 450;
  return (
    <AbsoluteFill style={{background: BG}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {nodes.slice(1).map((nd: any, i: number) => {
          const p = prog(f, nd.at - 6, 26, E.inOut);
          const a = x0 + i * gap + 90, b = x0 + (i + 1) * gap - 90;
          const t = ((f - nd.at) % 50) / 50;
          return (
            <g key={i}>
              <line x1={a} x2={a + (b - a) * p} y1={y} y2={y} stroke="rgba(242,245,255,0.5)" strokeWidth={1.5} />
              {p >= 1 && <circle cx={a + (b - a) * t} cy={y} r={4} fill={BLUE} />}
            </g>
          );
        })}
      </svg>
      {nodes.map((nd: any, i: number) => {
        const s = springAt(f, nd.at, {damping: 18});
        return (
          <div key={i} style={{position: 'absolute', left: x0 + i * gap - 200, top: y - 70, width: 400, textAlign: 'center', opacity: Math.min(1, s * 1.5)}}>
            <div style={{width: 140, height: 140, margin: '0 auto', borderRadius: 70, border: `1.5px solid ${nd.accent ? BLUE : 'rgba(242,245,255,0.55)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${0.9 + 0.1 * Math.min(1, s)})`}}>
              <Icon name={nd.icon} size={70} at={nd.at + 4} color={nd.accent ? BLUE : INK} />
            </div>
            <div style={{marginTop: 22, fontFamily: FONT.body, fontSize: 30, fontWeight: 500, color: INK}}>{nd.label}</div>
            {nd.sub && <div style={{marginTop: 6, fontFamily: FONT.body, fontSize: 22, color: MUTE}}>{nd.sub}</div>}
          </div>
        );
      })}
      {title && <Cap text={title} at={4} />}
    </AbsoluteFill>
  );
};

/** List → one item at a time, as full black text cards. */
const List: React.FC<P> = ({items, title}) => {
  const f = useCurrentFrame();
  const idx = items.reduce((a: number, it: any, i: number) => (f >= it.at ? i : a), -1);
  if (idx < 0) return title ? <Center><WrapWords text={strip(title)} at={2} size={54} /></Center> : <Center>{null}</Center>;
  return (
    <Center>
      <div key={idx} style={{textAlign: 'center'}}>
        {title && <div style={{fontFamily: FONT.body, fontSize: 24, color: MUTE, marginBottom: 20}}>{strip(title)}</div>}
        <WrapWords text={items[idx].text} at={items[idx].at + 1} size={56} />
        {items[idx].sub && <Fade at={items[idx].at + 14}><div style={{marginTop: 16, fontFamily: FONT.body, fontSize: 26, color: MUTE}}>{items[idx].sub}</div></Fade>}
      </div>
    </Center>
  );
};

const Quote: React.FC<P> = ({text, attr}) => (
  <Center>
    <div style={{maxWidth: 1300, textAlign: 'center'}}>
      <WrapWords text={`“${strip(text)}”`} at={2} size={50} />
      <Fade at={40}><div style={{marginTop: 30, fontFamily: FONT.body, fontSize: 24, color: MUTE}}>{attr}</div></Fade>
    </div>
  </Center>
);

const Hero: React.FC<P> = ({icon, title, sub}) => (
  <Center bg={BG}>
    <div style={{textAlign: 'center'}}>
      <Icon name={icon} size={150} at={0} />
      <div style={{height: 40}} />
      <WrapWords text={strip(title)} at={10} size={50} />
      {sub && <Fade at={30}><div style={{marginTop: 18, fontFamily: FONT.body, fontSize: 26, color: MUTE, maxWidth: 1100}}>{strip(sub)}</div></Fade>}
    </div>
  </Center>
);

const Triptych: React.FC<P> = ({title, cols}) => {
  const f = useCurrentFrame();
  const w = 440;
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', left: 960 - (cols.length * w) / 2, top: 290, display: 'flex'}}>
        {cols.map((c: any, i: number) => (
          <div key={i} style={{width: w, textAlign: 'center', opacity: prog(f, c.at, 18)}}>
            <Icon name={c.icon} size={100} at={c.at} color={c.accent ? BLUE : INK} />
            <div style={{marginTop: 26, fontFamily: FONT.body, fontSize: 32, fontWeight: 500, color: INK}}>{c.head}</div>
            {c.sub && <div style={{marginTop: 8, fontFamily: FONT.body, fontSize: 22, color: MUTE}}>{c.sub}</div>}
          </div>
        ))}
      </div>
      {title && <Cap text={title} at={4} />}
    </AbsoluteFill>
  );
};

const Timeline: React.FC<P> = ({items, title}) => {
  const f = useCurrentFrame();
  const x0 = 360, x1 = 1560, y = 460, n = items.length;
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', left: x0, top: y, width: (x1 - x0) * prog(f, 0, 50, E.inOut), height: 1.5, background: 'rgba(242,245,255,0.5)'}} />
      {items.map((it: any, i: number) => {
        const x = x0 + ((x1 - x0) * (i + 0.5)) / n;
        return (
          <div key={i} style={{position: 'absolute', left: x - 170, top: y - 70, width: 340, textAlign: 'center', opacity: prog(f, it.at, 18)}}>
            <div style={{fontFamily: FONT.body, fontSize: 26, color: it.accent ? BLUE : MUTE}}>{it.year}</div>
            <div style={{width: 12, height: 12, borderRadius: 6, background: it.accent ? BLUE : INK, margin: '26px auto 30px'}} />
            <div style={{fontFamily: FONT.body, fontSize: 26, color: INK, lineHeight: 1.3}}>{it.text}</div>
          </div>
        );
      })}
      {title && <Cap text={title} at={4} />}
    </AbsoluteFill>
  );
};

const Split: React.FC<P> = ({left, right, rightAt}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <div style={{position: 'absolute', left: 959, top: 340, width: 1.5, height: 400 * prog(f, 0, 40, E.inOut), background: 'rgba(242,245,255,0.4)'}} />
      {[left, right].map((s: any, i: number) => (
        <div key={i} style={{position: 'absolute', left: i ? 1060 : 360, top: 440, width: 500, textAlign: 'center'}}>
          <WrapWords text={s.title} at={i ? rightAt : 4} size={64} weight={500} color={i ? BLUE : INK} />
          {s.sub && <Fade at={(i ? rightAt : 4) + 18}><div style={{marginTop: 14, fontFamily: FONT.body, fontSize: 26, color: MUTE}}>{s.sub}</div></Fade>}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Dots: React.FC<P> = ({total, groups, splitAt}) => {
  const f = useCurrentFrame();
  const g0 = groups[0];
  const on = prog(f, g0.at, 20) > 0.5;
  const pub = groups[1] && prog(f, groups[1].at, 20) > 0.5;
  return (
    <AbsoluteFill style={{background: BG}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: total}).map((_, i) => {
          const isG = i >= total - g0.n;
          const x = 960 - 7.5 * 64 + (i % 16) * 64, y = 330 + Math.floor(i / 16) * 64;
          const a = springAt(f, 2 + i * 0.5, {damping: 18});
          return <circle key={i} cx={x} cy={y} r={14 * Math.min(1, Math.max(0, a))} fill={isG && on ? BLUE : pub && !isG ? INK : 'rgba(210,222,245,0.35)'} />;
        })}
      </svg>
      <Cap text={groups.map((g: any) => g.label).filter((_: any, i: number) => i === 0 || pub).join('  ·  ')} at={g0.at} />
      {splitAt === undefined ? null : null}
    </AbsoluteFill>
  );
};

const Folder: React.FC<P> = ({caption, len}) => <TextSeq text={caption ?? ''} len={len} size={54} />;
const Duplicate: React.FC<P> = ({records, title}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', left: 520, top: 380}}><Icon name="person" size={150} /></div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {records.map((r: any, i: number) => {
          const p = prog(f, r.at, 26, E.inOut), ty = 330 + i * 110;
          return <path key={i} d={`M700 455 C 820 455, 820 ${ty}, ${900 + 40 * p} ${ty}`} fill="none" stroke="#EA4335" strokeWidth={1.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
        })}
      </svg>
      {records.map((r: any, i: number) => (
        <div key={i} style={{position: 'absolute', left: 960, top: 330 + i * 110 - 30, opacity: prog(f, r.at + 16, 16), fontFamily: FONT.mono, fontSize: 30, color: INK}}>{r.text}</div>
      ))}
      {title && <Cap text={title} at={4} />}
    </AbsoluteFill>
  );
};
const Wall: React.FC<P> = ({left, right}) => <Split left={{title: 'Public', sub: left.join(' · ')}} right={{title: 'Private', sub: right.join(' · ')}} rightAt={20} len={0} />;
const Chain: React.FC<P> = ({steps}) => {
  const f = useCurrentFrame();
  const idx = steps.reduce((a: number, s: any, i: number) => (f >= s.at ? i : a), 0);
  const n = steps.length, gap = Math.min(300, 1500 / n), x0 = 960 - (gap * (n - 1)) / 2;
  return (
    <AbsoluteFill style={{background: BG}}>
      <div style={{position: 'absolute', left: x0, top: 450, width: gap * idx, height: 1.5, background: 'rgba(242,245,255,0.45)'}} />
      {steps.map((s: any, i: number) => (
        <div key={i} style={{position: 'absolute', left: x0 + i * gap - 130, top: 390, width: 260, textAlign: 'center', opacity: prog(f, s.at, 16) * (i === idx ? 1 : 0.45)}}>
          <div style={{width: 120, height: 120, margin: '0 auto', borderRadius: 60, background: '#000', border: `1.5px solid ${s.kind === 'digital' ? BLUE : 'rgba(242,245,255,0.55)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Icon name={s.icon} size={58} at={s.at} color={s.kind === 'digital' ? BLUE : INK} />
          </div>
          <div style={{marginTop: 20, fontFamily: FONT.body, fontSize: 26, color: INK}}>{s.label}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
const Streams: React.FC<P> = () => <Split left={{title: 'Public'}} right={{title: 'Private'}} rightAt={20} len={0} />;
const Plain: React.FC<P> = ({title, caption, len}) => <TextSeq text={title ?? caption ?? ''} len={len} />;

export const AD_TEMPLATES: Record<string, React.FC<P>> = {
  Headline, Chapter, Stat, Bars, MapBeat, Flow, List, Quote, Hero, Triptych, Timeline, Split, Dots, Folder, Duplicate, Wall, Chain,
  Highways: Streams, Receipt: (p) => <TextSeq text={p.title ?? ''} len={p.len} />, Tally: (p) => <TextSeq text={p.caption ?? ''} len={p.len} />, Ecg: Plain,
};
