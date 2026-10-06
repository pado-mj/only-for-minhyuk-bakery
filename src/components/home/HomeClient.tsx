"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BirthdayTable, type SortMode } from "@/components/home/BirthdayTable";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

function BakeryAwning({ brand }: { brand: string }) {
  return (
    <div className="bakery-awning" aria-label={brand}>
      <Image
        src="/assets/hbd-bakery.png"
        alt=""
        width={1024}
        height={1024}
        className="bakery-awning__art"
        priority
      />
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
        <Link href="/create" className="tape-cta mt-5 inline-flex w-full max-w-[280px] items-center justify-center px-6 py-4 text-sm font-bold text-navy transition-transform active:translate-y-[2px]">
          {t.home.makeCake}
        </Link>
      </header>

      <div className="sticky top-0 z-10 flex items-center justify-center gap-2 border-y border-ink/10 bg-cream/90 px-4 py-2.5 backdrop-blur">
        {(["new", "mostViewed"] as SortMode[]).map((m) => (
          <button key={m} onClick={() => { setMode(m); setFocusId(undefined); }}
            className={`handmade-tab px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${mode === m ? "bg-navy text-cream" : "bg-[#fffaf0] text-ink-soft"}`}>
            {m === "new" ? t.home.new : t.home.mostViewed}
          </button>
        ))}
        <button onClick={handleRandom} className="handmade-tab bg-[#fffaf0] px-3 py-1.5 text-[11px] font-bold tracking-wide text-ink-soft transition-colors active:bg-navy active:text-cream">
          {t.home.random}
        </button>
      </div>
      <BirthdayTable key={`${mode}-${focusId ?? ""}`} cakes={cakes} mode={mode} focusId={focusId} />
    </div>
  );
}
