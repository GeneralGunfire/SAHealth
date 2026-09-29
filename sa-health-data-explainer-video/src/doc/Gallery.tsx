import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {TEMPLATES} from './templates';
import {GROUND} from './theme';
import {Grain} from './kit';

const S = 150; // 5 s per sample
const samples: {t: keyof typeof TEMPLATES; g: 'paper' | 'ink' | 'navy' | 'blue'; p: Record<string, unknown>}[] = [
  {t: 'Chapter', g: 'ink', p: {n: 2, title: 'The public clinic', sub: 'Where most of the data is born'}},
  {t: 'Headline', g: 'paper', p: {kicker: 'The question', lines: ['Where does the data go', '— and does it *travel with the patient?*']}},
  {t: 'Stat', g: 'navy', p: {value: 68, suffix: 'M+', label: 'patient records in HPRS', sub: 'More than the population of South Africa', source: 'NDoH 2025'}},
  {t: 'Bars', g: 'paper', p: {title: 'Records vs. people', max: 70, bars: [{label: 'HPRS patient records', value: 68, display: '68M+', at: 10, accent: true}, {label: 'Population (Census 2022)', value: 62, display: '62M', at: 30}, {label: 'Verified with Home Affairs', value: 32.5, display: '32.5M', at: 50}]}},
  {t: 'MapBeat', g: 'paper', p: {title: 'Four provinces: *no hospital system*', prov: {Mpumalanga: {state: 'hatch', at: 10}, 'North West': {state: 'hatch', at: 14}, Limpopo: {state: 'hatch', at: 18}, 'Northern Cape': {state: 'hatch', at: 22}, 'Western Cape': {state: 'on', at: 30, label: 'WC'}}}},
  {t: 'Flow', g: 'paper', p: {title: 'From clinic to *laboratory*', nodes: [{icon: 'clinic', label: 'Clinic', at: 0}, {icon: 'flask', label: 'NHLS', sub: '~265 labs', at: 20, accent: true}, {icon: 'printer', label: 'SMS printer', at: 50}]}},
  {t: 'List', g: 'ink', p: {title: 'How a doctor finds out', items: [{text: 'Ask the patient', at: 5}, {text: 'Read what she carries', at: 30}, {text: 'Check a lab portal', at: 60}, {text: 'Phone, email, fax', at: 90}]}},
  {t: 'Quote', g: 'navy', p: {text: 'Not currently implementing Patient Information or *EMR Systems* at hospitals.', attr: 'Parliamentary reply, 1 August 2025'}},
  {t: 'Hero', g: 'paper', p: {icon: 'folder', title: 'The paper folder is *still the record*', sub: 'In most public clinics, the clinical story is handwritten.'}},
  {t: 'Dots', g: 'paper', p: {total: 62, title: '62 million people', per: 'One dot ≈ one million people', groups: [{n: 9, label: 'Medical schemes · 9.17M', at: 30, color: 'accent'}, {n: 53, label: 'Public sector', at: 60, color: 'fg'}], splitAt: 100}},
  {t: 'Timeline', g: 'paper', p: {title: 'On paper, the plan exists', items: [{year: '2014', text: 'Interoperability standards framework', at: 10}, {year: '2015', text: 'HPRS begins', at: 30}, {year: '2024', text: 'NHI Act signed', at: 50, accent: true}]}},
  {t: 'Split', g: 'paper', p: {left: {title: 'Public', sub: 'Clinics, provincial hospitals, NHLS'}, right: {title: 'Private', sub: 'GPs, hospital groups, private labs'}, rightAt: 20, wallAt: 80}},
  {t: 'Folder', g: 'paper', p: {lines: [{text: 'c/o headaches × 2 wks', at: 20}, {text: 'BP 152/96', at: 45}, {text: 'Dx: hypertension', at: 65}], caption: 'Written by hand. *Filed here.*', captionAt: 30}},
  {t: 'Duplicate', g: 'ink', p: {title: 'One person, three patients', records: [{text: 'NOMSA  ·  ID ••••••', at: 10}, {text: 'NOMSA K.  ·  no ID', at: 30}, {text: 'N. K.  ·  other DOB', at: 50}]}},
  {t: 'Wall', g: 'ink', p: {left: ['Clinic folders', 'Provincial HIS', 'NHLS'], right: ['Hospital EMRs', 'GP software', 'Scheme claims'], wallAt: 10, walkAt: 40}},
];

export const GALLERY_FRAMES = samples.length * S;
export const Gallery: React.FC = () => (
  <AbsoluteFill>
    {samples.map((s, i) => {
      const T = TEMPLATES[s.t] as React.FC<Record<string, unknown>>;
      return (
        <Sequence key={i} from={i * S} durationInFrames={S}>
          <AbsoluteFill style={{background: GROUND[s.g].bg}}><T {...s.p} g={s.g} len={S} /></AbsoluteFill>
        </Sequence>
      );
    })}
    <Grain />
  </AbsoluteFill>
);
