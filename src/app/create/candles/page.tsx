"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CanvasStage } from "@/components/editor/CanvasStage";
import { ClassicCandle, DogCandle, HeartCandle, NumberCandle } from "@/components/icons/candles";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";
import { CANDLE_LIMITS } from "@/types/cake";

export default function CandlesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const objects = useEditorStore((s) => s.present.objects);
  const addCandle = useEditorStore((s) => s.addCandle);
  const removeObject = useEditorStore((s) => s.removeObject);
  const [digit, setDigit] = useState(0);

  const candles = useMemo(() => objects.filter((o) => o.type === "candle"), [objects]);
  const countOf = (predicate: (assetId: string) => boolean) =>
    candles.filter((c) => predicate(c.assetId)).length;

  const classicCount = countOf((id) => id === "classic");
  const heartCount = countOf((id) => id === "heart");
  const dogCount = countOf((id) => id === "dog");
  const numberCount = countOf((id) => id.startsWith("number-"));

  const removeLast = (predicate: (assetId: string) => boolean) => {
    const matches = candles.filter((c) => predicate(c.assetId));
    const last = matches[matches.length - 1];
    if (last) removeObject(last.id);
  };

  return (
    <div className="px-4">
      <h1 className="mb-1 text-center text-sm font-bold text-ink">{t.candles.title}</h1>
      <p className="mb-3 text-center text-xs text-ink-soft">{t.candles.subtitle}</p>

      <CanvasStage showCandlesOnly />

      <div className="mt-5 space-y-4">
        <CandleRow
          label={t.candles.classic}
          preview={<ClassicCandle lit={false} className="h-14 w-6" />}
          count={classicCount}
          min={CANDLE_LIMITS.classic.min}
          max={CANDLE_LIMITS.classic.max}
          onAdd={() => addCandle("classic")}
          onRemove={() => removeLast((id) => id === "classic")}
          addLabel={t.candles.addCandle}
          removeLabel={t.candles.removeCandle}
        />
        <CandleRow
          label={t.candles.heart}
          preview={<HeartCandle lit={false} className="h-14 w-7" />}
          count={heartCount}
          min={CANDLE_LIMITS.heart.min}
          max={CANDLE_LIMITS.heart.max}
          onAdd={() => addCandle("heart")}
          onRemove={() => removeLast((id) => id === "heart")}
          addLabel={t.candles.addCandle}
          removeLabel={t.candles.removeCandle}
        />
        <CandleRow
          label={t.candles.dog}
          preview={<DogCandle lit={false} className="h-14 w-7" />}
          count={dogCount}
          min={CANDLE_LIMITS.dog.min}
          max={CANDLE_LIMITS.dog.max}
          onAdd={() => addCandle("dog")}
          onRemove={() => removeLast((id) => id === "dog")}
          addLabel={t.candles.addCandle}
          removeLabel={t.candles.removeCandle}
        />

        <div className="paper-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{t.candles.number}</span>
            <span className="text-xs text-ink-soft">
              {numberCount}/{CANDLE_LIMITS.number.max}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 overflow-x-auto">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <button
                key={d}
                onClick={() => setDigit(d)}
                className={`shrink-0 rounded-lg border-2 p-1 ${digit === d ? "border-berry" : "border-transparent"}`}
              >
                <NumberCandle digit={d} lit={false} className="h-12 w-7" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-center gap-2">
            <button
              disabled={numberCount === 0}
              onClick={() => removeLast((id) => id.startsWith("number-"))}
              className="rounded-full bg-paper-dark px-4 py-1.5 text-xs font-bold text-ink-soft disabled:opacity-30"
            >
              {t.candles.removeCandle}
            </button>
            <button
              disabled={numberCount >= CANDLE_LIMITS.number.max}
              onClick={() => addCandle(`number-${digit}`)}
              className="rounded-full bg-berry px-4 py-1.5 text-xs font-bold text-cream disabled:opacity-30"
            >
              {t.candles.addCandle} &quot;{digit}&quot;
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push("/create/letter")}
        className="mt-6 w-full rounded-full bg-berry py-3.5 text-sm font-bold text-cream shadow-lg transition-transform active:scale-[0.98]"
      >
        {t.candles.goToLetter}
      </button>
    </div>
  );
}

function CandleRow({
  label,
  preview,
  count,
  min,
  max,
  onAdd,
  onRemove,
  addLabel,
  removeLabel,
}: {
  label: string;
  preview: React.ReactNode;
  count: number;
  min: number;
  max: number;
  onAdd: () => void;
  onRemove: () => void;
  addLabel: string;
  removeLabel: string;
}) {
  return (
    <div className="paper-card flex items-center gap-3 p-4">
      <div className="flex h-16 w-10 shrink-0 items-center justify-center">{preview}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">{label}</span>
          <span className="text-xs text-ink-soft">
            {count}/{max}
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            disabled={count <= min}
            onClick={onRemove}
            className="rounded-full bg-paper-dark px-3 py-1 text-xs font-bold text-ink-soft disabled:opacity-30"
          >
            {removeLabel}
          </button>
          <button
            disabled={count >= max}
            onClick={onAdd}
            className="rounded-full bg-berry px-3 py-1 text-xs font-bold text-cream disabled:opacity-30"
          >
            {addLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
