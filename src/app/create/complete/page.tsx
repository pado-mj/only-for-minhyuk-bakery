"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CakeCanvas } from "@/components/cake/CakeCanvas";
import { LetterCard } from "@/components/cake/LetterCard";
import { useI18n } from "@/lib/i18n/context";
import { useLastCreatedStore } from "@/store/lastCreatedStore";
import type { CakeRecord } from "@/types/cake";

function CompleteContent() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const publicId = searchParams.get("id") ?? "";
  const lastCreated = useLastCreatedStore((s) => s.record);
  const [fetched, setFetched] = useState<CakeRecord | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [exportImage, setExportImage] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const record = lastCreated?.publicId === publicId ? lastCreated : fetched;

  useEffect(() => {
    // The completion page normally uses the in-memory record from the just-finished submission.
    // Direct refresh is handled by the public cake detail route instead of exposing Supabase credentials.
    if (lastCreated?.publicId === publicId || !publicId) return;
    setFetched(null);
  }, [publicId, lastCreated]);

  useEffect(() => {
    if (!record || !exportRef.current) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const dataUrl = await renderExportImage();
        if (!cancelled && dataUrl) setExportImage(dataUrl);
      } catch (err) {
        console.error("preview image failed:", err);
      }
    }, 350);
    return () => { cancelled = true; window.clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record?.publicId]);

  if (!record) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-ink-soft">{t.common.loading}</p>
        <Link href="/" className="mt-4 text-xs font-bold text-berry">
          {t.cakeDetail.backToTable}
        </Link>
      </div>
    );
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/cake/${record.publicId}` : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable; silently ignore
    }
  };

  const renderExportImage = async () => {
    if (!exportRef.current) return null;
    const { toPng } = await import("html-to-image");
    return toPng(exportRef.current, { width: 1080, height: 1080, pixelRatio: 1, skipFonts: true, cacheBust: true });
  };

  const handleSaveImage = async () => {
    if (!exportRef.current || saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      const capture = exportImage ? Promise.resolve(exportImage) : renderExportImage();
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10000)
      );
      const dataUrl = await Promise.race([capture, timeout]);
      if (!dataUrl) throw new Error("export failed");
      setExportImage(dataUrl);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `only-for-minhyuk-bakery-cake-${record.publicNumber}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("save image failed:", err);
      setSaveError(true);
      setTimeout(() => setSaveError(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center px-6 pb-10 pt-14 text-center">
      <h1 className="text-lg font-extrabold text-ink">{t.complete.title}</h1>

      <div className="mx-auto mt-6 w-56">
        {exportImage ? (
          // A real flattened image: long-press/right-click copies the whole finished card, not individual assets.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={exportImage} alt="" className="aspect-square w-full rounded-2xl object-cover" />
        ) : (
          <CakeCanvas cakeData={record.cakeData} candlesLit={false} />
        )}
      </div>

      {/* Off-screen, full-resolution, un-rounded version for PNG export —
          includes the branding footer the on-screen preview doesn't need. */}
      <div style={{ position: "fixed", top: 0, left: -10000, width: 1080, height: 1080 }} aria-hidden>
        <div ref={exportRef} style={{ width: 1080, height: 1080, background: "#fbf3e3", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 900, height: 900 }}>
            <CakeCanvas cakeData={record.cakeData} candlesLit={false} rounded={false} />
          </div>
          <div style={{ width: 900, height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif' }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: "#3a2e22", letterSpacing: "0.02em" }}>ONLY FOR MINHYUK BAKERY</div>
            <div style={{ marginTop: 10, fontSize: 26, color: "#7a6a52" }}>made by {record.nickname} · #{record.publicNumber}</div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-ink">{record.nickname}</p>

      <div className="mt-6 flex w-full max-w-xs gap-2">
        <button
          onClick={handleSaveImage}
          disabled={saving}
          className="flex-1 rounded-full bg-paper-dark py-3 text-xs font-bold text-ink-soft disabled:opacity-60"
        >
          {saving ? t.complete.saving : t.complete.saveImage}
        </button>
        <button
          onClick={handleCopyLink}
          className="flex-1 rounded-full bg-berry py-3 text-xs font-bold text-cream"
        >
          {t.complete.copyLink}
        </button>
      </div>
      <div className="mt-2 h-4 text-[11px] font-semibold text-berry">
        {copied ? t.complete.linkCopied : saveError ? t.complete.saveError : ""}
      </div>

      <div className="mt-8 w-full max-w-xs">
        {letterOpen ? (
          <LetterCard
            nickname={record.nickname}
            country={record.country}
            letter={record.letter}
            locale={locale}
          />
        ) : (
          <button
            onClick={() => setLetterOpen(true)}
            className="w-full rounded-full bg-berry py-3 text-xs font-bold text-cream shadow-lg"
          >
            {t.cakeDetail.openLetter}
          </button>
        )}
      </div>

      <div className="mt-4 flex w-full max-w-xs flex-col gap-2.5">
        <Link href="/" className="rounded-full border border-ink/15 py-3 text-xs font-bold text-ink">
          {t.complete.backToTable}
        </Link>
        <Link
          href="/create/decorate"
          className="rounded-full bg-ink py-3 text-xs font-bold text-cream"
        >
          {t.complete.makeAnother}
        </Link>
      </div>
    </div>
  );
}

export default function CompletePage() {
  return (
    <Suspense fallback={null}>
      <CompleteContent />
    </Suspense>
  );
}
