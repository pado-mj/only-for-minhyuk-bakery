"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CakeTableItem } from "@/components/home/CakeTableItem";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

const PAGE_SIZE = 30;

export type SortMode = "new" | "mostViewed";

export function BirthdayTable({
  cakes,
  mode,
  focusId,
}: {
  cakes: CakeRecord[];
  mode: SortMode;
  focusId?: string;
}) {
  const { t } = useI18n();
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const ordered = useMemo(() => {
    const copy = [...cakes];
    if (mode === "mostViewed") copy.sort((a, b) => b.viewCount - a.viewCount);
    else
      copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (focusId) {
      const idx = copy.findIndex((c) => c.publicId === focusId);
      if (idx > -1) {
        const [item] = copy.splice(idx, 1);
        copy.unshift(item);
      }
    }
    return copy;
  }, [cakes, mode, focusId]);

  const visible = ordered.slice(0, visibleCount);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(ordered.length, c + PAGE_SIZE));
        }
      },
      { rootMargin: "900px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ordered.length]);

  if (ordered.length === 0) {
    return (
      <div className="px-6 pb-28 pt-10 text-center">
        <p className="text-sm text-ink-soft">{t.home.empty}</p>
      </div>
    );
  }

  return (
    <div className="px-3 pb-28 pt-4">
      <div className="grid grid-cols-2 gap-3">
        {visible.map((cake) => (
          <div key={cake.publicId}>
            <CakeTableItem cake={cake} />
          </div>
        ))}
      </div>
      {visibleCount < ordered.length && (
        <div ref={sentinelRef} className="flex h-16 items-center justify-center text-xs text-ink-soft">
          {t.home.loadingCakes}
        </div>
      )}
    </div>
  );
}
