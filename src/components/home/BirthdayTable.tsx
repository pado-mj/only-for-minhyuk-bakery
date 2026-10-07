"use client";

import { useEffect, useRef } from "react";
import { CakeTableItem } from "@/components/home/CakeTableItem";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

export type SortMode = "new" | "mostViewed";

export function BirthdayTable({
  cakes,
  hasMore,
  loading,
  onLoadMore,
}: {
  cakes: CakeRecord[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}) {
  const { t } = useI18n();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  if (cakes.length === 0 && !loading) {
    return (
      <div className="px-6 pb-28 pt-10 text-center">
        <p className="text-sm text-ink-soft">{t.home.empty}</p>
      </div>
    );
  }

  return (
    <div className="px-3 pb-28 pt-4">
      <div className="grid grid-cols-2 gap-3">
        {cakes.map((cake) => (
          <div key={cake.publicId}>
            <CakeTableItem cake={cake} />
          </div>
        ))}
      </div>
      {(hasMore || loading) && (
        <div ref={sentinelRef} className="flex h-16 items-center justify-center text-xs text-ink-soft">
          {loading ? t.home.loadingCakes : ""}
        </div>
      )}
    </div>
  );
}
