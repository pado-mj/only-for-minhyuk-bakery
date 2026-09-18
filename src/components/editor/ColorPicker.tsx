"use client";

import { useI18n } from "@/lib/i18n/context";

export function ColorPicker({
  presets,
  value,
  onChange,
}: {
  presets: { id: string; label?: string; hex: string }[];
  value: string;
  onChange: (hex: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-ink-soft">{t.editor.presetColors}</p>
      <div className="flex flex-wrap gap-3">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.hex)}
            className={`h-10 w-10 rounded-full border-2 transition-transform active:scale-90 ${
              value.toLowerCase() === p.hex.toLowerCase() ? "border-berry" : "border-ink/15"
            }`}
            style={{ backgroundColor: p.hex }}
            aria-label={p.label ?? p.hex}
          />
        ))}
      </div>
      <p className="mb-2 mt-4 text-xs font-semibold text-ink-soft">{t.editor.customColor}</p>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-ink/15 bg-transparent p-1"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="w-28 rounded-lg border border-ink/15 bg-paper px-3 py-2 text-sm text-ink"
          placeholder="#F3D9B1"
        />
      </div>
    </div>
  );
}
