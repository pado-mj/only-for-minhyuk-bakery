"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BirthdayTable, type SortMode } from "@/components/home/BirthdayTable";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

function BakeryAwning({ brand }: { brand: string }) {
  return (
    <div className="bakery-awning" aria-label={brand}>
      <svg viewBox="0 0 1000 330" role="img" aria-hidden="true">
        <defs>
          <filter id="pencil-wobble" x="-4%" y="-6%" width="108%" height="112%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
          <pattern id="awning-stripes" width="130" height="260" patternUnits="userSpaceOnUse" patternTransform="skewX(-10)">
            <rect width="65" height="260" fill="#79a9d8" />
            <rect x="65" width="65" height="260" fill="#fff7e8" />
          </pattern>
        </defs>
        <g filter="url(#pencil-wobble)">
          <rect x="82" y="18" width="836" height="125" rx="8" fill="#fff8ea" stroke="#7d6449" strokeWidth="7" />
          <path d="M55 143 H945 L990 255 Q985 294 950 294 Q918 294 900 270 Q882 294 850 294 Q818 294 800 270 Q782 294 750 294 Q718 294 700 270 Q682 294 650 294 Q618 294 600 270 Q582 294 550 294 Q518 294 500 270 Q482 294 450 294 Q418 294 400 270 Q382 294 350 294 Q318 294 300 270 Q282 294 250 294 Q218 294 200 270 Q182 294 150 294 Q118 294 100 270 Q82 294 50 294 Q15 294 10 255 Z" fill="url(#awning-stripes)" stroke="#7d6449" strokeWidth="7" strokeLinejoin="round" />
          <path d="M55 143 H945" fill="none" stroke="#7d6449" strokeWidth="6" />
        </g>
      </svg>
      <div className="bakery-awning__title">{brand}</div>
    </div>
  );
}

export function HomeClient({ cakes, stats }: { cakes: CakeRecord[]; stats: { total: number; today: number; countries: number } }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<SortMode>("new");
  const [focusId, setFocusId] = useState<string | undefined>(undefined);

  const handleRandom = useCallback(() => {
    if (cakes.length === 0) return;
    const pick = cakes[Math.floor(Math.random() * cakes.length)];
    setMode("new");
    setFocusId(pick?.publicId);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
  }, [cakes]);

  return (
    <div>
      <header className="paper-texture px-5 pb-6 pt-5 text-center">
        <div className="mb-1 flex justify-end"><LocaleSwitcher /></div>
        <BakeryAwning brand={t.common.brand} />
        <p className="mx-auto mt-1 max-w-[280px] text-sm text-ink-soft">{t.common.tagline}</p>
        <p className="mx-auto mt-2 max-w-[300px] text-[11px] font-semibold text-navy/75">{t.home.scrollHint}</p>
        <div className="mt-5 flex items-center justify-center gap-4 text-xs font-semibold text-navy">
          <span>{stats.total} {t.home.cakesUnit}</span>
          <span className="text-ink-soft">+{stats.today} {t.home.today}</span>
          <span className="text-ink-soft">{stats.countries} {t.home.countries}</span>
        </div>
        <Link href="/create" className="mt-5 inline-block w-full max-w-[260px] rounded-full bg-navy px-6 py-3 text-sm font-bold text-cream shadow-lg transition-transform active:scale-[0.97]">
          {t.home.makeCake}
        </Link>
      </header>

      <div className="sticky top-0 z-10 flex items-center justify-center gap-2 border-y border-ink/10 bg-cream/90 px-4 py-2.5 backdrop-blur">
        {(["new", "mostViewed"] as SortMode[]).map((m) => (
          <button key={m} onClick={() => { setMode(m); setFocusId(undefined); }}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${mode === m ? "bg-navy text-cream" : "bg-paper text-ink-soft"}`}>
            {m === "new" ? t.home.new : t.home.mostViewed}
          </button>
        ))}
        <button onClick={handleRandom} className="rounded-full bg-paper px-3 py-1.5 text-[11px] font-bold tracking-wide text-ink-soft transition-colors active:bg-navy active:text-cream">
          {t.home.random}
        </button>
      </div>
      <BirthdayTable key={`${mode}-${focusId ?? ""}`} cakes={cakes} mode={mode} focusId={focusId} />
    </div>
  );
}
