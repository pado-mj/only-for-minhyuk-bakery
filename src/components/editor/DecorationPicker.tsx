"use client";

import { useState } from "react";
import { DECORATION_ASSETS } from "@/lib/assets";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";

export function DecorationPicker() {
  const { t, locale } = useI18n();
  const addObject = useEditorStore((s) => s.addObject);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [requestState, setRequestState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const assetLabel = (a: (typeof DECORATION_ASSETS)[number]) =>
    locale === "ko" ? a.labelKo : locale === "ja" ? a.labelJa : a.labelEn;

  const submitRequest = async () => {
    const request = requestText.trim();
    if (!request || requestState === "sending") return;
    setRequestState("sending");
    try {
      const res = await fetch("/api/decoration-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request, locale }),
      });
      if (!res.ok) throw new Error("request failed");
      setRequestState("done");
      setRequestText("");
    } catch {
      setRequestState("error");
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {DECORATION_ASSETS.map((asset) => (
          <button
            key={asset.id}
            onClick={() =>
              addObject({
                type: "decoration",
                assetId: asset.id,
                category: asset.category,
                x: 540,
                y: 500,
                scale: 1,
                rotation: 0,
                layer: 3,
              })
            }
            className="paper-card relative flex flex-col items-center gap-1 p-2 transition-transform active:scale-95"
          >
            {asset.isNew && (
              <span className="absolute right-1 top-1 -rotate-6 rounded-sm bg-berry px-1.5 py-0.5 text-[8px] font-black leading-none tracking-[0.08em] text-white shadow-sm">
                NEW
              </span>
            )}
            {asset.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset.imageSrc} alt="" className="h-10 w-10 object-contain" draggable={false} />
            ) : asset.Icon ? (
              <asset.Icon className="h-10 w-10" />
            ) : null}
            <span className="text-[11px] text-ink-soft">{assetLabel(asset)}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => { setRequestOpen(true); setRequestState("idle"); }}
          className="paper-card flex min-h-[68px] flex-col items-center justify-center gap-1 border border-dashed border-navy/25 p-2 text-navy transition-transform active:scale-95"
        >
          <span className="text-lg">＋</span>
          <span className="text-[11px] font-bold">{t.editor.requestDecoration}</span>
        </button>
      </div>

      {requestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-6" onClick={() => setRequestOpen(false)}>
          <div className="paper-card w-full max-w-[360px] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-bold text-ink">{t.editor.requestTitle}</h2>
              <button type="button" onClick={() => setRequestOpen(false)} className="text-lg leading-none text-ink-soft">×</button>
            </div>
            <input
              autoFocus
              maxLength={80}
              value={requestText}
              onChange={(e) => { setRequestText(e.target.value); setRequestState("idle"); }}
              onKeyDown={(e) => { if (e.key === "Enter") void submitRequest(); }}
              placeholder={t.editor.requestPlaceholder}
              className="mt-4 w-full rounded-lg border border-ink/15 bg-cream px-3 py-2.5 text-sm text-ink outline-none"
            />
            {requestState === "done" && <p className="mt-2 text-xs text-navy">{t.editor.requestSuccess}</p>}
            {requestState === "error" && <p className="mt-2 text-xs text-berry">{t.editor.requestError}</p>}
            <button
              type="button"
              disabled={!requestText.trim() || requestState === "sending"}
              onClick={() => void submitRequest()}
              className="tape-cta mt-4 w-full py-3 text-sm font-bold text-navy disabled:opacity-40"
            >
              {t.editor.requestSubmit}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
