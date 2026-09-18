const CANDLES_DIR = "/assets/candles";

// Wick-tip position as a fraction of each image's own box, measured from
// the trimmed asset (topmost non-transparent pixel) — used to anchor the
// flame overlay, since art doesn't include a lit flame.
const CLASSIC_SOURCES = [
  { src: `${CANDLES_DIR}/classic-0.png`, wickX: 0.491, wickY: 0.036 },
  { src: `${CANDLES_DIR}/classic-1.png`, wickX: 0.542, wickY: 0.038 },
  { src: `${CANDLES_DIR}/classic-2.png`, wickX: 0.529, wickY: 0.036 },
  { src: `${CANDLES_DIR}/classic-3.png`, wickX: 0.541, wickY: 0.038 },
  { src: `${CANDLES_DIR}/classic-4.png`, wickX: 0.463, wickY: 0.036 },
  { src: `${CANDLES_DIR}/classic-5.png`, wickX: 0.505, wickY: 0.036 },
  { src: `${CANDLES_DIR}/classic-6.png`, wickX: 0.516, wickY: 0.036 },
];

const NUMBER_SOURCES: Record<number, { src: string; wickX: number; wickY: number }> = {
  0: { src: `${CANDLES_DIR}/number-0.png`, wickX: 0.769, wickY: 0.362 },
  1: { src: `${CANDLES_DIR}/number-1.png`, wickX: 0.533, wickY: 0.281 },
  2: { src: `${CANDLES_DIR}/number-2.png`, wickX: 0.506, wickY: 0.051 },
  3: { src: `${CANDLES_DIR}/number-3.png`, wickX: 0.65, wickY: 0.057 },
  4: { src: `${CANDLES_DIR}/number-4.png`, wickX: 0.624, wickY: 0.057 },
  5: { src: `${CANDLES_DIR}/number-5.png`, wickX: 0.576, wickY: 0.056 },
  6: { src: `${CANDLES_DIR}/number-6.png`, wickX: 0.557, wickY: 0.053 },
  7: { src: `${CANDLES_DIR}/number-7.png`, wickX: 0.522, wickY: 0.052 },
  8: { src: `${CANDLES_DIR}/number-8.png`, wickX: 0.643, wickY: 0.052 },
  9: { src: `${CANDLES_DIR}/number-9.png`, wickX: 0.574, wickY: 0.058 },
};

const HEART_SOURCE = { src: `${CANDLES_DIR}/heart-candle.png`, wickX: 0.7, wickY: 0.235 };
const DOG_SOURCE = { src: `${CANDLES_DIR}/dog-candle.png`, wickX: 0.646, wickY: 0.354 };

function Flame({ wickX, wickY }: { wickX: number; wickY: number }) {
  return (
    <div
      className="candle-flame absolute"
      style={{
        left: `${wickX * 100}%`,
        top: `${wickY * 100}%`,
        width: "62cqw",
        transform: "translate(-50%, -82%)",
      }}
    >
      <svg viewBox="0 0 20 26" className="h-full w-full overflow-visible">
        <path
          d="M10 0c5 6 6 10 3 15-1 2-4 3-3-1-3 3-6 1-6-3 0-5 3-8 6-11Z"
          fill="#F5A623"
        />
        <path d="M10 6c2 3 2 5 0 7-2-1-3-3-2-5 0-1 1-2 2-2Z" fill="#FFE9A8" />
      </svg>
    </div>
  );
}

function ImageCandle({
  src,
  wickX,
  wickY,
  lit,
  className,
}: {
  src: string;
  wickX: number;
  wickY: number;
  lit: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className ?? ""}`} style={{ containerType: "inline-size" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="h-full w-full object-contain" draggable={false} />
      {lit && <Flame wickX={wickX} wickY={wickY} />}
    </div>
  );
}

export function ClassicCandle({
  lit = true,
  variant = 0,
  className,
}: {
  lit?: boolean;
  variant?: number;
  className?: string;
}) {
  const source = CLASSIC_SOURCES[Math.abs(variant) % CLASSIC_SOURCES.length];
  return <ImageCandle {...source} lit={lit} className={className} />;
}

export function HeartCandle({ lit = true, className }: { lit?: boolean; className?: string }) {
  return <ImageCandle {...HEART_SOURCE} lit={lit} className={className} />;
}

export function DogCandle({ lit = true, className }: { lit?: boolean; className?: string }) {
  return <ImageCandle {...DOG_SOURCE} lit={lit} className={className} />;
}

export function NumberCandle({
  digit,
  lit = true,
  className,
}: {
  digit: number;
  lit?: boolean;
  className?: string;
}) {
  const source = NUMBER_SOURCES[digit] ?? NUMBER_SOURCES[0];
  return <ImageCandle {...source} lit={lit} className={className} />;
}
