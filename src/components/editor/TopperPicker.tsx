"use client";

import { useState } from "react";
import { PRESET_TOPPERS } from "@/lib/assets";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";

export function TopperPicker() {
  const { t } = useI18n();
  const addObject = useEditorStore((s) => s.addObject);
  const [customText, setCustomText] = useState("");
  const [style, setStyle] = useState<"light" | "dark">("light");

  const addTopper = (text: string, textStyle: "light" | "dark") => {
    if (!text.trim()) return;
    addObject({
      type: "topper",
      assetId: "preset",
      x: 540,
      y: 300,
      scale: 1,
      rotation: 0,
      layer: 4,
      text: text.trim(),
      textStyle,
    });
  };

  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink-soft">{t.editor.presetTopper}</p>
      <div className="flex flex-wrap gap-2">
        {PRESET_TOPPERS.map((text) => (
          <button
            key={text}
            onClick={() => addTopper(text, "light")}
            className="rounded-full border border-ink/15 bg-cream px-3 py-1.5 text-xs font-bold text-ink transition-transform active:scale-95"
          >
            {text}
          </button>
        ))}
      </div>

      <p className="mb-2 mt-5 text-xs font-semibold text-ink-soft">{t.editor.customTopper}</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={customText}
          maxLength={10}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder={t.editor.customTopperPlaceholder}
          className="min-w-0 flex-1 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink"
        />
        <span className="shrink-0 text-xs text-ink-soft">{customText.length}/10</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <button
          onClick={() => setStyle("light")}
          className={`rounded-full px-3 py-1 text-xs font-bold ${style === "light" ? "bg-ink text-cream" : "bg-paper text-ink-soft"}`}
        >
          {t.editor.light}
        </button>
        <button
          onClick={() => setStyle("dark")}
          className={`rounded-full px-3 py-1 text-xs font-bold ${style === "dark" ? "bg-navy text-cream" : "bg-paper text-ink-soft"}`}
        >
          {t.editor.dark}
        </button>
        <button
          disabled={!customText.trim()}
          onClick={() => {
            addTopper(customText, style);
            setCustomText("");
          }}
          className="ml-auto rounded-full bg-berry px-4 py-1.5 text-xs font-bold text-cream disabled:opacity-40"
        >
          {t.common.add}
        </button>
      </div>
    </div>
  );
}
