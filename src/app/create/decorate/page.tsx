"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CanvasStage } from "@/components/editor/CanvasStage";
import { SelectionToolbar } from "@/components/editor/SelectionToolbar";
import { ColorPicker } from "@/components/editor/ColorPicker";
import { CakePicker } from "@/components/editor/CakePicker";
import { DecorationPicker } from "@/components/editor/DecorationPicker";
import { ImageUploader } from "@/components/editor/ImageUploader";
import { TopperPicker } from "@/components/editor/TopperPicker";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { BACKGROUND_COLOR_PRESETS } from "@/lib/assets";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";
import { useSubmissionStore } from "@/store/submissionStore";

type Tab = "background" | "cake" | "decorations" | "myImage" | "topper";

export default function DecoratePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("background");
  const [confirmReset, setConfirmReset] = useState(false);

  const present = useEditorStore((s) => s.present);
  const setBackgroundColor = useEditorStore((s) => s.setBackgroundColor);
  const setBackgroundTexture = useEditorStore((s) => s.setBackgroundTexture);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const resetCake = useEditorStore((s) => s.resetCake);
  const submitted = useEditorStore((s) => s.submitted);
  const canUndo = useEditorStore((s) => s.past.length > 0);
  const canRedo = useEditorStore((s) => s.future.length > 0);

  const resetSubmission = useSubmissionStore((s) => s.reset);

  useEffect(() => {
    if (submitted) {
      resetCake();
      resetSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs: { id: Tab; label: string }[] = [
    { id: "background", label: t.editor.background },
    { id: "cake", label: t.editor.cake },
    { id: "decorations", label: t.editor.decorations },
    { id: "myImage", label: t.editor.myImage },
    { id: "topper", label: t.editor.topper },
  ];

  return (
    <div className="px-4">
      <h1 className="mb-1 text-center text-sm font-bold text-ink">{t.editor.title}</h1>
      <p className="mb-3 text-center text-xs text-ink-soft">{t.editor.intro}</p>

      <CanvasStage />
      <SelectionToolbar />

      <div className="mt-2 flex items-center justify-center gap-3 text-xs text-ink-soft">
        <button onClick={undo} disabled={!canUndo} className="disabled:opacity-30">
          ↺ {t.common.undo}
        </button>
        <button onClick={redo} disabled={!canRedo} className="disabled:opacity-30">
          ↻ {t.common.redo}
        </button>
        <button onClick={() => setConfirmReset(true)} className="text-berry">
          {t.common.reset}
        </button>
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
              tab === tb.id ? "bg-berry text-cream" : "bg-paper text-ink-soft"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="paper-card mt-3 min-h-[220px] p-4">
        {tab !== "myImage" && (
          <p className="mb-4 border-b border-ink/10 pb-3 text-xs leading-relaxed text-ink-soft">
            {tab === "background" ? t.editor.backgroundHint : tab === "cake" ? t.editor.cakeHint : tab === "decorations" ? t.editor.decorationsHint : t.editor.topperHint}
          </p>
        )}
        {tab === "background" && (
          <>
          <div className="mb-4">
            <p className="mb-2 text-xs font-semibold text-ink-soft">{t.editor.backgroundTexture}</p>
            <div className="grid grid-cols-4 gap-2">
              {(["paper","check","cream","kraft"] as const).map((texture) => (
                <button key={texture} onClick={() => setBackgroundTexture(texture)} className={`rounded-lg border px-2 py-2 text-[11px] font-semibold ${(present.background.texture ?? "paper") === texture ? "border-berry text-berry" : "border-ink/15 text-ink-soft"}`}>
                  {t.editor[texture === "paper" ? "texturePaper" : texture === "check" ? "textureCheck" : texture === "cream" ? "textureCream" : "textureKraft"]}
                </button>
              ))}
            </div>
          </div>
          <ColorPicker
            presets={BACKGROUND_COLOR_PRESETS}
            value={present.background.color}
            onChange={(hex) => setBackgroundColor(hex, "custom")}
          />
          </>
        )}
        {tab === "cake" && <CakePicker />}
        {tab === "decorations" && <DecorationPicker />}
        {tab === "myImage" && <ImageUploader />}
        {tab === "topper" && <TopperPicker />}
      </div>

      <button
        onClick={() => router.push("/create/candles")}
        className="tape-cta mt-5 w-full py-3.5 text-sm font-bold text-navy transition-transform active:translate-y-[2px]"
      >
        {t.editor.goToCandles}
      </button>

      <ConfirmDialog
        open={confirmReset}
        title={t.editor.resetConfirmTitle}
        body={t.editor.resetConfirmBody}
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetCake();
          setConfirmReset(false);
        }}
      />
    </div>
  );
}
