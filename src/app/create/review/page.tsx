"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CakeCanvas } from "@/components/cake/CakeCanvas";
import { LetterCard } from "@/components/cake/LetterCard";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";
import { useSubmissionStore } from "@/store/submissionStore";
import { useLastCreatedStore } from "@/store/lastCreatedStore";

export default function ReviewPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const present = useEditorStore((s) => s.present);
  const markSubmitted = useEditorStore((s) => s.markSubmitted);
  const { nickname, country, letter } = useSubmissionStore();
  const setLastCreated = useLastCreatedStore((s) => s.setRecord);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cakes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname.trim(),
          country,
          letter: letter.trim(),
          cakeData: present,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { publicId, publicNumber } = (await res.json()) as {
        publicId: string;
        publicNumber: number;
      };
      setLastCreated({
        id: publicId,
        publicId,
        publicNumber,
        nickname: nickname.trim(),
        country,
        letter: letter.trim(),
        cakeData: present,
        viewCount: 0,
        createdAt: new Date().toISOString(),
        status: "published",
      });
      markSubmitted();
      router.push(`/create/complete?id=${publicId}`);
    } catch {
      setError(t.review.submitError);
      setSubmitting(false);
    }
  };

  return (
    <div className="px-4">
      <h1 className="mb-4 text-center text-sm font-bold text-ink">{t.review.title}</h1>

      <div className="mx-auto w-48">
        <CakeCanvas cakeData={present} candlesLit={false} />
      </div>

      <div className="mt-4">
        <LetterCard nickname={nickname} country={country} letter={letter} locale={locale} />
      </div>

      <p className="mt-4 rounded-xl bg-berry/10 px-3 py-3 text-center text-xs font-semibold leading-relaxed text-berry">
        {t.review.warning}
      </p>

      {error && (
        <p className="mt-3 text-center text-xs font-semibold text-berry">{error}</p>
      )}

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => router.push("/create/decorate")}
          disabled={submitting}
          className="flex-1 rounded-full bg-paper-dark py-3.5 text-sm font-bold text-ink-soft disabled:opacity-50"
        >
          {t.common.edit}
        </button>
        <button
          onClick={handleComplete}
          disabled={submitting}
          className="flex-1 rounded-full bg-berry py-3.5 text-sm font-bold text-cream shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
        >
          {submitting ? t.review.submitting : t.review.complete}
        </button>
      </div>
    </div>
  );
}
