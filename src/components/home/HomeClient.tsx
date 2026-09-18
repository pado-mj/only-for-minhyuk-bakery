"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { BirthdayTable, type SortMode } from "@/components/home/BirthdayTable";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

export function HomeClient({
  cakes,
  stats,
}: {
  cakes: CakeRecord[];
  stats: { total: number; today: number; countries: number };
}) {
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
      <header className="paper-texture px-5 pb-6 pt-8 text-center">
        <div className="mb-3 flex justify-end">
          <LocaleSwitcher />
        </div>
        <h1 className="text-lg font-extrabold tracking-tight text-ink">
          {t.common.brand}
        </h1>
        <p className="mx-auto mt-2 max-w-[280px] text-sm text-ink-soft">
          {t.common.tagline}
        </p>
        <p className="mx-auto mt-2 max-w-[300px] text-[11px] font-semibold text-berry/80">{t.home.scrollHint}</p>

        <div className="mt-5 flex items-center justify-center gap-4 text-xs font-semibold text-berry">
          <span>{stats.total} {t.home.cakesUnit}</span>
          <span className="text-ink-soft">+{stats.today} {t.home.today}</span>
          <span className="text-ink-soft">{stats.countries} {t.home.countries}</span>
        </div>

        <Link
          href="/create"
          className="mt-5 inline-block w-full max-w-[260px] rounded-full bg-berry px-6 py-3 text-sm font-bold text-cream shadow-lg transition-transform active:scale-[0.97]"
        >
          {t.home.makeCake}
        </Link>
      </header>

      <div className="sticky top-0 z-10 flex items-center justify-center gap-2 border-y border-ink/10 bg-cream/90 px-4 py-2.5 backdrop-blur">
        {(["new", "mostViewed"] as SortMode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setFocusId(undefined);
            }}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${
              mode === m ? "bg-ink text-cream" : "bg-paper text-ink-soft"
            }`}
          >
            {m === "new" ? t.home.new : t.home.mostViewed}
          </button>
        ))}
        <button
          onClick={handleRandom}
          className="rounded-full bg-paper px-3 py-1.5 text-[11px] font-bold tracking-wide text-ink-soft transition-colors active:bg-ink active:text-cream"
        >
          {t.home.random}
        </button>
      </div>

      <BirthdayTable key={`${mode}-${focusId ?? ""}`} cakes={cakes} mode={mode} focusId={focusId} />
    </div>
  );
}
