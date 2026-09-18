import type { SVGProps } from "react";

// Vintage hand-inked illustrations. Each icon is drawn on a 0-100 viewBox
// with a single consistent dark-ink outline color, echoing old botanical /
// bakery-label linework rather than a flat modern-sticker look.
const INK = "#3A2E22";

function Sticker({
  children,
  ...props
}: SVGProps<SVGSVGElement> & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
      {children}
    </svg>
  );
}


export function Strawberry(props: SVGProps<SVGSVGElement>) {
  return (
    <Sticker {...props}>
      <path
        d="M50 30c14 0 26 12 22 30-3 14-14 26-22 26s-19-12-22-26c-4-18 8-30 22-30Z"
        fill="#C1503F"
        stroke={INK}
        strokeWidth={6}
      />
      {[...Array(7)].map((_, i) => {
        const angle = (i / 7) * Math.PI * 1.6 - 1.6;
        const cx = 50 + Math.cos(angle) * 14;
        const cy = 52 + Math.sin(angle) * 16;
        return <circle key={i} cx={cx} cy={cy} r={1.6} fill="#FBE1C8" />;
      })}
      <path
        d="M50 30 42 16m8 14 0-16m2 16 8-14"
        stroke="#5C8A4B"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M38 20c4-6 20-6 24 0-8 4-16 4-24 0Z"
        fill="#6FA858"
        stroke={INK}
        strokeWidth={4}
      />
    </Sticker>
  );
}

export function Cherry(props: SVGProps<SVGSVGElement>) {
  return (
    <Sticker {...props}>
      <path
        d="M46 40c-10 6-8 24 4 26s20-12 12-22"
        stroke="#5C8A4B"
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <circle
        cx="38"
        cy="70"
        r="14"
        fill="#B4283F"
        stroke={INK}
        strokeWidth={5}
      />
      <circle
        cx="64"
        cy="66"
        r="14"
        fill="#C93150"
        stroke={INK}
        strokeWidth={5}
      />
      <circle cx="34" cy="65" r="2.4" fill="#F2B9C4" />
      <circle cx="60" cy="61" r="2.4" fill="#F2B9C4" />
    </Sticker>
  );
}

export function Blueberry(props: SVGProps<SVGSVGElement>) {
  return (
    <Sticker {...props}>
      <circle
        cx="34"
        cy="55"
        r="15"
        fill="#4C5B8F"
        stroke={INK}
        strokeWidth={5}
      />
      <circle
        cx="62"
        cy="48"
        r="13"
        fill="#5B6BA3"
        stroke={INK}
        strokeWidth={5}
      />
      <circle
        cx="55"
        cy="72"
        r="12"
        fill="#41508A"
        stroke={INK}
        strokeWidth={5}
      />
      {[
        [34, 55],
        [62, 48],
        [55, 72],
      ].map(([cx, cy], i) => (
        <path
          key={i}
          d={`M${cx - 3} ${cy - 3} l6 6 M${cx + 3} ${cy - 3} l-6 6`}
          stroke="#D9CBEE"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      ))}
    </Sticker>
  );
}

// A ring of overlapping petals reads as a rose bloom; three concentric
// circles just read as a target/lollipop, which was the complaint.
const PETAL = "M0-3c9-11 9-24 0-27c-9 3-9 16 0 27Z";
const PETAL_ANGLES = [0, 72, 144, 216, 288];

function RoseBloom({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const scale = r / 27;
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {PETAL_ANGLES.map((angle, i) => (
        <path
          key={i}
          d={PETAL}
          transform={`rotate(${angle}) scale(${scale})`}
          fill={i % 2 === 0 ? "#C1435F" : "#B23A55"}
          stroke={INK}
          strokeWidth={2.5 / scale}
        />
      ))}
      <circle r={r * 0.32} fill="#E17E92" stroke={INK} strokeWidth={2} />
      <path
        d={`M${-r * 0.12} ${-r * 0.1}c-3-3-1-7 3-7`}
        stroke={INK}
        strokeWidth={1.4}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

export function RoseSingle(props: SVGProps<SVGSVGElement>) {
  return (
    <Sticker {...props}>
      <path d="M50 68v22" stroke="#5C8A4B" strokeWidth={4} strokeLinecap="round" />
      <path d="M50 80c6-2 10-8 10-8s-8 0-10 8Zm0-2c-6-2-10-8-10-8s8 0 10 8Z" fill="#6FA858" stroke={INK} strokeWidth={1.5} />
      <RoseBloom cx={50} cy={44} r={22} />
    </Sticker>
  );
}

export function RoseStem(props: SVGProps<SVGSVGElement>) {
  return (
    <Sticker {...props}>
      <path d="M50 40v52" stroke="#5C8A4B" strokeWidth={4} strokeLinecap="round" />
      <path
        d="M50 62c8-3 13-10 13-10s-9-1-13 10Zm0 12c-8-3-13-10-13-10s9-1 13 10Z"
        fill="#6FA858"
        stroke={INK}
        strokeWidth={1.5}
      />
      <RoseBloom cx={50} cy={24} r={18} />
    </Sticker>
  );
}

export function Cucumber(props: SVGProps<SVGSVGElement>) {
  // A long, clearly-tapered capsule reads as "cucumber" much more reliably
  // than a short rotated blob — ridges + warts + a stem sell the rest.
  return (
    <Sticker {...props}>
      <g transform="rotate(-14 50 50)">
        <rect x="37" y="10" width="26" height="80" rx="13" fill="#6B9A4C" stroke={INK} strokeWidth={3.5} />
        <path
          d="M42 22c-2 18-2 38 0 56M50 18c-1.5 21-1.5 43 0 64M58 22c2 18 2 38 0 56"
          stroke="#517A38"
          strokeWidth={1.6}
          fill="none"
          strokeLinecap="round"
          opacity={0.65}
        />
        {[[43, 26], [57, 34], [44, 44], [56, 54], [43, 64], [57, 72]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={1.5} fill="#D8E7C4" />
        ))}
        <path d="M45 10c0-5 3-8 5-8s5 3 5 8" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <path d="M50 4c4-4 10-3 11 1-4 3-9 2-11-1Z" fill="#7FA24C" stroke={INK} strokeWidth={2} />
      </g>
    </Sticker>
  );
}

export function MintChoco(props: SVGProps<SVGSVGElement>) {
  return (
    <Sticker {...props}>
      <circle
        cx="50"
        cy="52"
        r="26"
        fill="#8FBFA0"
        stroke={INK}
        strokeWidth={6}
      />
      {[
        [40, 42],
        [58, 46],
        [46, 58],
        [62, 62],
        [36, 62],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3.2} fill="#3A2E22" />
      ))}
      <ellipse cx="38" cy="38" rx="5" ry="3" fill="#C9EEE1" opacity={0.7} />
    </Sticker>
  );
}
