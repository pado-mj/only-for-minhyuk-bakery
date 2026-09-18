"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const sentinelRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

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

  const updateTransforms = useCallback(() => {
    const viewportH = window.innerHeight;
    const focusY = viewportH * 0.6;
    const farY = viewportH * 1.05;
    let i = 0;
    itemRefs.current.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      let progress: number;
      if (center >= focusY) {
        progress = 1 - Math.min(1, Math.max(0, (center - focusY) / (farY - focusY)));
      } else {
        progress = 1;
      }
      let opacity = 0.22 + 0.78 * progress;
      const scale = 0.58 + 0.42 * progress;
      if (center < viewportH * 0.12) {
        const exitProgress = Math.max(0, center / (viewportH * 0.12));
        opacity *= exitProgress;
      }
      const baseOffset = (i % 2 === 0 ? 1 : -1) * 22;
      el.style.transform = `translateX(${baseOffset * (1 - progress)}px) scale(${scale})`;
      el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
      i++;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateTransforms);
    };
    updateTransforms();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateTransforms, visible.length]);

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
    <div className="px-4 pb-28 pt-4" style={{ perspective: 900 }}>
      <p className="mb-5 text-center text-xs text-ink-soft">{t.home.scrollHint}</p>
      <div className="flex flex-col gap-9">
        {visible.map((cake) => (
          <div
            key={cake.publicId}
            ref={(el) => {
              if (el) itemRefs.current.set(cake.publicId, el);
              else itemRefs.current.delete(cake.publicId);
            }}
            style={{ transformOrigin: "center bottom", willChange: "transform, opacity" }}
          >
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
