"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CakeCanvas } from "@/components/cake/CakeCanvas";
import { useI18n } from "@/lib/i18n/context";
import { useLastCreatedStore } from "@/store/lastCreatedStore";
import type { CakeRecord } from "@/types/cake";

function CompleteContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const publicId = searchParams.get("id") ?? "";
  const lastCreated = useLastCreatedStore((s) => s.record);
  const [fetched, setFetched] = useState<CakeRecord | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const record = lastCreated?.publicId === publicId ? lastCreated : fetched;

  useEffect(() => {
    // The completion page normally uses the in-memory record from the just-finished submission.
    // Direct refresh is handled by the public cake detail route instead of exposing Supabase credentials.
    if (lastCreated?.publicId === publicId || !publicId) return;
    setFetched(null);
  }, [publicId, lastCreated]);

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

  const handleSaveImage = async () => {
    if (!exportRef.current || saving) return;
    setSaving(true);
    setSaveError(false);
    try {
      const { toPng } = await import("html-to-image");
      // skipFonts: without it, html-to-image walks every stylesheet on the
      // page trying to fetch+embed every @font-face it finds — Pretendard
      // Variable is large enough that this can hang for a very long time.
      // The export doesn't need custom font fidelity, so skip it.
      const capture = toPng(exportRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        skipFonts: true,
      });
      const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 10000)
      );
      const dataUrl = await Promise.race([capture, timeout]);
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
        <CakeCanvas cakeData={record.cakeData} candlesLit={false} />
      </div>

      {/* Off-screen, full-resolution, un-rounded version for PNG export —
          includes the branding footer the on-screen preview doesn't need. */}
      <div style={{ position: "fixed", top: 0, left: -10000, width: 1080, height: 1080 }} aria-hidden>
        <div ref={exportRef} style={{ width: 1080, height: 1080 }}>
          <CakeCanvas
            cakeData={record.cakeData}
            candlesLit={false}
            rounded={false}
            branding={{ nickname: record.nickname, publicNumber: record.publicNumber }}
          />
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

      <div className="mt-8 flex w-full max-w-xs flex-col gap-2.5">
        <Link
          href={`/cake/${record.publicId}`}
          className="rounded-full border border-ink/15 py-3 text-xs font-bold text-ink"
        >
          {t.complete.viewMine}
        </Link>
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
