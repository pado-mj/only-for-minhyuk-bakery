"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CakeCanvas } from "@/components/cake/CakeCanvas";
import { LetterCard } from "@/components/cake/LetterCard";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { isBirthdayLive } from "@/lib/birthday";
import { countryFlagEmoji } from "@/lib/countries";
import { formatDate } from "@/lib/date";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

type Phase = "closed" | "extinguishing" | "revealed";

export function CakeDetailClient({ record }: { record: CakeRecord | null }) {
  const { t, locale } = useI18n();
  const [live, setLive] = useState(false);
  const [phase, setPhase] = useState<Phase>("closed");

  useEffect(() => {
    // Server has no clock/timezone context we should trust for the client's
    // view; compute "is it Nov 3 KST yet" only after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLive(isBirthdayLive());
  }, []);

  useEffect(() => {
    if (!record) return;
    if (!live) return;
    try {
      const extinguished = window.localStorage.getItem(`ofmb_extinguished_${record.publicId}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (extinguished) setPhase("revealed");
    } catch {
      // localStorage unavailable; treat as not-yet-extinguished
    }
  }, [record, live]);

  if (!record) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-ink-soft">404</p>
        <Link href="/" className="mt-4 text-xs font-bold text-berry">
          {t.cakeDetail.backToTable}
        </Link>
      </div>
    );
  }

  const candlesLit = live && phase !== "revealed" && phase !== "extinguishing";

  const handleTap = () => {
    if (!live || phase !== "closed") return;
    setPhase("extinguishing");
    window.setTimeout(() => {
      setPhase("revealed");
      try {
        window.localStorage.setItem(`ofmb_extinguished_${record.publicId}`, "1");
      } catch {
        // ignore storage errors
      }
    }, 900);
  };

  const handleOpenLetter = () => setPhase("revealed");

  return (
    <div className="px-4 pb-16 pt-6">
      <Link href="/" className="text-xs font-semibold text-ink-soft">
        ← {t.cakeDetail.backToTable}
      </Link>

      <div className="mx-auto mt-4 w-full max-w-[320px]">
        <motion.div
          animate={phase === "extinguishing" ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 0.9 }}
          onClick={handleTap}
          className={live && phase === "closed" ? "cursor-pointer" : ""}
        >
          <CakeCanvas cakeData={record.cakeData} candlesLit={candlesLit} />
        </motion.div>
      </div>

      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-ink">
          <span>{record.nickname}</span>
          {record.country && (
            <span className="text-xs font-normal text-ink-soft">
              {countryFlagEmoji(record.country)} <CountryLabel code={record.country} locale={locale} />
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-ink-soft">
          #{record.publicNumber} · {t.cakeDetail.created}{" "}
          {formatDate(record.createdAt, locale)}
        </p>
      </div>

      <div className="mt-6">
        <AnimatePresence>
          {phase === "revealed" ? (
            <motion.div key="letter" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <LetterCard
                nickname={record.nickname}
                country={record.country}
                letter={record.letter}
                locale={locale}
              />
            </motion.div>
          ) : (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              {live ? (
                <>
                  <p className="text-xs text-ink-soft">{t.cakeDetail.tapToBlow}</p>
                  <button
                    onClick={handleTap}
                    disabled={phase === "extinguishing"}
                    className="rounded-full bg-berry px-6 py-3 text-sm font-bold text-cream shadow-lg"
                  >
                    {t.cakeDetail.makeAWish}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleOpenLetter}
                  className="rounded-full bg-berry px-6 py-3 text-sm font-bold text-cream shadow-lg"
                >
                  {t.cakeDetail.openLetter}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
