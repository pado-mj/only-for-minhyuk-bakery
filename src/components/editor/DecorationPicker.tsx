"use client";

import { DECORATION_ASSETS } from "@/lib/assets";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";

export function DecorationPicker() {
  const { locale } = useI18n();
  const addObject = useEditorStore((s) => s.addObject);

  const assetLabel = (a: (typeof DECORATION_ASSETS)[number]) =>
    locale === "ko" ? a.labelKo : locale === "ja" ? a.labelJa : a.labelEn;

  return (
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
          className="paper-card flex flex-col items-center gap-1 p-2 transition-transform active:scale-95"
        >
          {asset.imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset.imageSrc} alt="" className="h-10 w-10 object-contain" draggable={false} />
          ) : asset.Icon ? (
            <asset.Icon className="h-10 w-10" />
          ) : null}
          <span className="text-[11px] text-ink-soft">{assetLabel(asset)}</span>
        </button>
      ))}
    </div>
  );
}
