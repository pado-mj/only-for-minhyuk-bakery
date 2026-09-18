"use client";

import { useI18n } from "@/lib/i18n/context";
import { locales } from "@/lib/i18n/dictionaries";

const LABELS: Record<string, string> = { ko: "KO", en: "EN", ja: "JA" };

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex items-center gap-1 rounded-full border border-ink/15 bg-paper p-0.5 text-[11px] font-semibold">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`rounded-full px-2 py-1 transition-colors ${
            locale === l ? "bg-ink text-cream" : "text-ink-soft"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
