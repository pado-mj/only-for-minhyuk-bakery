"use client";

import { CAKE_DESIGNS } from "@/lib/assets";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";

export function CakePicker() {
  const { locale } = useI18n();
  const selected = useEditorStore((s) => s.present.cakeDesign ?? "classic");
  const setCakeDesign = useEditorStore((s) => s.setCakeDesign);

  return (
    <div>
      <p className="mb-3 text-xs font-semibold text-ink-soft">
        {locale === "ko" ? "케이크 디자인을 골라 주세요." : locale === "ja" ? "ケーキのデザインを選んでください。" : "Choose a cake design."}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {CAKE_DESIGNS.map((cake) => {
          const label = locale === "ko" ? cake.labelKo : locale === "ja" ? cake.labelJa : cake.labelEn;
          const active = selected === cake.id;
          return (
            <button
              type="button"
              key={cake.id}
              onClick={() => setCakeDesign(cake.id)}
              className={`overflow-hidden rounded-xl border bg-cream p-2 text-left transition ${active ? "border-navy ring-2 ring-navy/20" : "border-ink/10"}`}
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cake.imageSrc} alt={label} className="h-full w-full object-contain" onError={(e) => { e.currentTarget.src = "/assets/cake/cake-base.png"; }} />
              </div>
              <span className="mt-2 block text-center text-[11px] font-bold text-ink">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
