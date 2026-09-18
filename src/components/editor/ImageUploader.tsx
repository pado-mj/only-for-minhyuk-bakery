"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";

const MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];

export function ImageUploader() {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const addObject = useEditorStore((s) => s.addObject);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!ACCEPTED.includes(file.type)) {
      setError(t.editor.uploadUnsupported);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(t.editor.uploadTooLarge);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      addObject({
        type: "image",
        assetId: "user-image",
        x: 540,
        y: 460,
        scale: 1,
        rotation: 0,
        layer: 2,
        imageDataUrl: dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-xl border-2 border-dashed border-ink/25 bg-paper px-4 py-6 text-center text-sm font-semibold text-ink-soft transition-colors active:bg-paper-dark"
      >
        {t.editor.uploadImage}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <p className="mt-2 text-center text-[11px] text-ink-soft">{t.editor.uploadHint}</p>
      {error && <p className="mt-2 text-center text-xs font-semibold text-berry">{error}</p>}
    </div>
  );
}
