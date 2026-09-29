import React from 'react';

// 24-unit line icons. Every path uses pathLength=1 so any icon can "draw on".
const P: Record<string, string[]> = {
  person: ['M12 3.5a3.5 3.5 0 1 0 0.01 0', 'M5 21c0-4 3.1-7 7-7s7 3 7 7'],
  doctor: ['M12 3.5a3.5 3.5 0 1 0 0.01 0', 'M5 21c0-4 3.1-7 7-7s7 3 7 7', 'M15 17.5h3.5M16.75 15.75v3.5'],
  clinic: ['M3 21V9.5l9-5.5 9 5.5V21', 'M1.5 21h21', 'M12 10v6M9 13h6'],
  hospital: ['M4 21V4h16v17', 'M2 21h20', 'M12 6.5v5M9.5 9h5', 'M7 15h2M15 15h2', 'M10.5 21v-3.5h3V21'],
  folder: ['M2.5 5.5h6.5l2 2.2h10.5v12H2.5z', 'M2.5 9.5h19'],
  doc: ['M6 2.5h9l4 4v15H6z', 'M15 2.5v4h4', 'M9 11h7M9 14h7M9 17h4.5'],
  flask: ['M9 3h6', 'M10 3v6.5l-5.3 8.8A2 2 0 0 0 6.4 21h11.2a2 2 0 0 0 1.7-2.7L14 9.5V3', 'M7.2 15h9.6'],
  printer: ['M7 9V3h10v6', 'M4 9h16v8H4z', 'M7 14h10v7H7z', 'M9.5 17h5'],
  pill: ['M4.9 13.1l8.2-8.2a4 4 0 0 1 5.7 5.7l-8.2 8.2a4 4 0 0 1-5.7-5.7z', 'M9 9l6 6'],
  box: ['M3 7.5l9-4.5 9 4.5v9l-9 4.5-9-4.5z', 'M3 7.5l9 4.5 9-4.5', 'M12 12v9'],
  ambulance: ['M1.5 17V6.5h12V17', 'M13.5 10h4.5l4 4.2V17h-8.5', 'M5 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M15 17a2 2 0 1 0 4 0a2 2 0 1 0-4 0', 'M7.5 8.5v5M5 11h5'],
  drop: ['M12 3s6.5 7.2 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10.2 12 3 12 3z', 'M9 15a3 3 0 0 0 3 3'],
  image: ['M3 4h18v16H3z', 'M3 16l5-5 4 4 3-3 6 6', 'M15.5 8.5a1.5 1.5 0 1 0 0.01 0'],
  phone: ['M5 3h3.5l2 5-2.5 1.5a11 11 0 0 0 6.5 6.5L16 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z'],
  mail: ['M3 5h18v14H3z', 'M3 6l9 7 9-7'],
  laptop: ['M5 5h14v10H5z', 'M2 19h20l-2-4H4z'],
  card: ['M2.5 5.5h19v13h-19z', 'M7 9.2a1.8 1.8 0 1 0 0.01 0', 'M4.5 15c.4-1.6 1.3-2.4 2.5-2.4s2.1.8 2.5 2.4', 'M13 10h6M13 13.5h4'],
  db: ['M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z', 'M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6', 'M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3'],
  tablet: ['M5.5 2.5h13v19h-13z', 'M11 18.5h2'],
  swap: ['M3 8h15l-3.5-3.5', 'M21 16H6l3.5 3.5'],
  globe: ['M12 3a9 9 0 1 0 0.01 0', 'M3 12h18', 'M12 3c2.8 2.6 4 5.6 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.6-4-9s1.2-6.4 4-9z'],
  building: ['M4 21V3h10v18', 'M14 8h6v13', 'M2 21h20', 'M7 7h1.5M9.5 7H11M7 11h1.5M9.5 11H11M7 15h1.5M9.5 15H11M16.5 12h1M16.5 16h1'],
  speech: ['M3.5 4.5h17v11.5H9.5L4.5 20v-4H3.5z'],
  law: ['M12 3v17', 'M6 21h12', 'M4 7h16', 'M6 7l-3 6.5a3 3 0 0 0 6 0z', 'M18 7l-3 6.5a3 3 0 0 0 6 0z'],
  chart: ['M4 20V11M10 20V5M16 20v-6M2 20h20'],
  check: ['M4.5 12.5l5 5 10-11'],
  cross: ['M6 6l12 12M18 6L6 18'],
  book: ['M4 4.5h7a2 2 0 0 1 2 2V21a2 2 0 0 0-2-2H4z', 'M20 4.5h-7a2 2 0 0 0-2 2', 'M20 4.5V19h-7a2 2 0 0 0-2 2'],
  barcode: ['M4 5v14M7 5v14M9 5v14M12 5v14M15 5v14M17 5v14M20 5v14'],
  keyboard: ['M2.5 7h19v10h-19z', 'M5.5 10h1M8.5 10h1M11.5 10h1M14.5 10h1M17.5 10h1M7 14h10'],
  clock: ['M12 3a9 9 0 1 0 0.01 0', 'M12 7.5V12l3 2'],
  search: ['M10.5 4a6.5 6.5 0 1 0 0.01 0', 'M15.5 15.5L21 21'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7z'],
  shelf: ['M3 21h18M3 3h18', 'M3 12h18', 'M5 12V5M8 12V6M11 12V5M14 12V7', 'M5 21v-7M8 21v-6M11 21v-7'],
};
export type IconName = keyof typeof P;

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
  draw?: number; // 0..1 draw-on progress
  style?: React.CSSProperties;
}> = ({name, size = 48, color = 'currentColor', stroke = 1.6, draw = 1, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{overflow: 'visible', ...style}}>
    {P[name].map((d, i) => (
      <path
        key={i}
        d={d}
        pathLength={1}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, draw * (P[name].length) - i))}
      />
    ))}
  </svg>
);
