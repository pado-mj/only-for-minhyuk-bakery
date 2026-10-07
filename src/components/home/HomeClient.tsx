"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BirthdayTable, type SortMode } from "@/components/home/BirthdayTable";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

function BakeryAwning({ brand }: { brand: string }) {
  return (
    <div className="bakery-awning relative z-20" aria-label={brand}>
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
      <div className="bakery-awning__title-art">
        <Image src="/assets/saeng-il-sang.png" alt="" fill sizes="360px" className="object-contain" priority />
      </div>
    </div>
  );
}

export function HomeClient({ initialCakes, initialHasMore, stats }: { initialCakes: CakeRecord[]; initialHasMore: boolean; stats: { total: number; today: number; countries: number } }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<SortMode>("new");
  const [cakesByMode, setCakesByMode] = useState<Record<SortMode, CakeRecord[]>>({
    new: initialCakes,
    mostViewed: [],
  });
  const [hasMoreByMode, setHasMoreByMode] = useState<Record<SortMode, boolean>>({
    new: initialHasMore,
    mostViewed: true,
  });
  const [loadingMode, setLoadingMode] = useState<SortMode | null>(null);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const cakes = cakesByMode[mode];
  const [featureOpen, setFeatureOpen] = useState(false);
  const [featureText, setFeatureText] = useState("");
  const [featureType, setFeatureType] = useState<"feature" | "bug" | "message">("feature");
  const [featureState, setFeatureState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [notices, setNotices] = useState<Array<{ id: number; title: string; body: string }>>([]);
  const countryUnit = stats.countries === 1 ? t.home.country : t.home.countries;

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => res.ok ? res.json() : { notices: [] })
      .then((data) => setNotices(Array.isArray(data.notices) ? data.notices : []))
      .catch(() => setNotices([]));
  }, []);

  const submitFeatureRequest = async () => {
    const request = featureText.trim();
    if (!request || featureState === "saving") return;
    setFeatureState("saving");
    try {
      const res = await fetch("/api/feature-requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ request, type: featureType }) });
      if (!res.ok) throw new Error("request failed");
      setFeatureState("success"); setFeatureText("");
    } catch { setFeatureState("error"); }
  };

  const loadBatch = useCallback(async (targetMode: SortMode, reset = false) => {
    if (loadingMode) return;
    const current = cakesByMode[targetMode];
    if (!reset && !hasMoreByMode[targetMode]) return;

    setLoadingMode(targetMode);
    try {
      const offset = reset ? 0 : current.length;
      const res = await fetch(`/api/cakes?sort=${targetMode}&offset=${offset}&limit=30`);
      if (!res.ok) throw new Error("cake batch request failed");
      const data = await res.json() as { cakes?: CakeRecord[]; hasMore?: boolean };
      const next = Array.isArray(data.cakes) ? data.cakes : [];
      setCakesByMode((prev) => ({
        ...prev,
        [targetMode]: reset ? next : [...prev[targetMode], ...next],
      }));
      setHasMoreByMode((prev) => ({ ...prev, [targetMode]: Boolean(data.hasMore) }));
    } catch {
      setHasMoreByMode((prev) => ({ ...prev, [targetMode]: false }));
    } finally {
      setLoadingMode(null);
    }
  }, [cakesByMode, hasMoreByMode, loadingMode]);

  const changeMode = useCallback((nextMode: SortMode) => {
    setMode(nextMode);
    setFocusId(undefined);
    if (cakesByMode[nextMode].length === 0) void loadBatch(nextMode, true);
  }, [cakesByMode, loadBatch]);

  const handleRandom = useCallback(async () => {
    if (stats.total < 1 || loadingMode) return;
    const offset = Math.floor(Math.random() * stats.total);
    setLoadingMode("new");
    try {
      const res = await fetch(`/api/cakes?sort=new&offset=${offset}&limit=1`);
      if (!res.ok) throw new Error("random cake request failed");
      const data = await res.json() as { cakes?: CakeRecord[] };
      const pick = Array.isArray(data.cakes) ? data.cakes[0] : undefined;
      if (!pick) return;
      setCakesByMode((prev) => ({
        ...prev,
        new: [pick, ...prev.new.filter((cake) => cake.publicId !== pick.publicId)],
      }));
      setMode("new");
      setFocusId(pick.publicId);
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    } finally {
      setLoadingMode(null);
    }
  }, [loadingMode, stats.total]);

  return (
    <div>
      <header className="paper-texture px-5 pb-6 pt-14 text-center">
        <div className="fixed left-1/2 top-0 z-40 flex w-full max-w-[480px] -translate-x-1/2 justify-end border-b border-ink/10 bg-cream/90 px-5 py-2.5 backdrop-blur">
          <LocaleSwitcher />
        </div>
        <div className="bakery-marquee">
        <BakeryAwning brand={t.common.brand} />
        <div className="relative z-10 mx-auto -mt-[36px] w-full max-w-[400px] rounded-b-[3px] border-x-[3px] border-b-[3px] border-[#7d6449] bg-[#fffaf0] px-5 pb-5 pt-16">
          <p className="mx-auto max-w-[280px] text-sm text-ink-soft">{t.common.tagline}</p>
          <p className="mx-auto mt-2 max-w-[300px] text-[11px] font-semibold text-navy/75">{t.home.scrollHint}</p>
          <div className="mt-5 flex items-center justify-center gap-4 text-xs font-semibold text-navy">
            <span>{stats.total} {t.home.cakesUnit}</span>
            <span className="text-ink-soft">+{stats.today} {t.home.today}</span>
            <span className="text-ink-soft">{stats.countries} {countryUnit}</span>
          </div>
        </div>
        </div>
        <div className="mt-9 flex flex-col items-center">
          <Link href="/create" className="tape-cta inline-flex w-full max-w-[280px] items-center justify-center px-6 py-4 text-base font-bold text-navy transition-transform active:translate-y-[2px]">
            {t.home.makeCake}
          </Link>
          <button type="button" onClick={() => { setFeatureState("idle"); setFeatureOpen(true); }} className="mt-3 inline-block text-[14px] font-semibold text-ink-soft underline decoration-ink-soft/40 underline-offset-4">
            {t.home.requestFeature}
          </button>
        </div>
        {featureOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-6" onClick={() => setFeatureOpen(false)}><div className="paper-card w-full max-w-[360px] p-5 text-left" onClick={(e) => e.stopPropagation()}><p className="text-sm font-bold text-ink">{t.home.featureRequestTitle}</p><p className="mt-2 text-xs leading-5 text-ink-soft">{t.home.featureRequestBody}</p><p className="mt-4 text-xs font-bold text-ink">{t.home.featureTypeLabel}</p><div className="mt-2 flex gap-2">{(["feature", "bug", "message"] as const).map((type) => <button key={type} type="button" onClick={() => setFeatureType(type)} className={`handmade-tab px-3 py-2 text-xs font-bold ${featureType === type ? "bg-navy text-cream" : "bg-[#fffaf0] text-ink-soft"}`}>{type === "feature" ? t.home.featureTypeFeature : type === "bug" ? t.home.featureTypeBug : t.home.featureTypeMessage}</button>)}</div><input value={featureText} onChange={(e) => setFeatureText(e.target.value.slice(0, 120))} placeholder={t.home.featureRequestPlaceholder} className="mt-4 w-full rounded-md border border-ink/20 bg-[#fffaf0] px-3 py-3 text-sm outline-none" /><button type="button" onClick={submitFeatureRequest} disabled={!featureText.trim() || featureState === "saving"} className="tape-cta mt-4 flex w-full items-center justify-center py-3 text-sm font-bold text-navy disabled:opacity-50">{t.home.featureRequestSubmit}</button>{featureState === "success" && <p className="mt-3 text-center text-xs text-navy">{t.home.featureRequestSuccess}</p>}{featureState === "error" && <p className="mt-3 text-center text-xs text-red-700">{t.home.featureRequestError}</p>}</div></div>}
      </header>

      <div className="sticky top-0 z-10 flex items-center justify-center gap-2 border-y border-ink/10 bg-cream/90 px-4 py-2.5 backdrop-blur">
        {(["new", "mostViewed"] as SortMode[]).map((m) => (
          <button key={m} onClick={() => changeMode(m)}
            className={`handmade-tab px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${mode === m ? "bg-navy text-cream" : "bg-[#fffaf0] text-ink-soft"}`}>
            {m === "new" ? t.home.new : t.home.mostViewed}
          </button>
        ))}
        <button onClick={handleRandom} className="handmade-tab bg-[#fffaf0] px-3 py-1.5 text-[11px] font-bold tracking-wide text-ink-soft transition-colors active:bg-navy active:text-cream">
          {t.home.random}
        </button>
      </div>
      <BirthdayTable
        cakes={cakes}
        hasMore={hasMoreByMode[mode]}
        loading={loadingMode === mode}
        onLoadMore={() => void loadBatch(mode)}
      />
      {notices.length > 0 && (
        <>
          <div className="h-16" aria-hidden="true" />
          <section className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-[#8b7357]/35 bg-[#fffaf0]/95 px-5 py-3 text-left shadow-[0_-4px_16px_rgba(58,46,34,0.08)] backdrop-blur" aria-label="Notice">
            <div className="mx-auto flex max-w-[400px] items-center gap-3">
              <p className="shrink-0 text-[10px] font-bold tracking-[0.16em] text-navy">NOTICE</p>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-ink">{notices[0].title}</p>
                {notices[0].body !== notices[0].title && <p className="truncate text-[11px] text-ink-soft">{notices[0].body}</p>}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
