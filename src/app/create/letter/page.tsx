"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CakeCanvas } from "@/components/cake/CakeCanvas";
import { COUNTRY_CODES, countryFlagEmoji } from "@/lib/countries";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";
import { useSubmissionStore } from "@/store/submissionStore";

const LETTER_MAX = 500;
const NICKNAME_MAX = 20;

export default function LetterPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const present = useEditorStore((s) => s.present);
  const { nickname, country, letter, setNickname, setCountry, setLetter } = useSubmissionStore();
  const [touched, setTouched] = useState(false);

  const valid = nickname.trim().length > 0 && letter.trim().length > 0;

  return (
    <div className="px-4">
      <h1 className="mb-3 text-center text-sm font-bold text-ink">{t.letter.title}</h1>

      <div className="mx-auto w-40">
        <CakeCanvas cakeData={present} candlesLit={false} />
      </div>

      <div className="paper-card mt-4 space-y-4 p-4">
        <div>
          <label className="text-xs font-semibold text-ink-soft">{t.letter.nickname}</label>
          <input
            type="text"
            value={nickname}
            maxLength={NICKNAME_MAX}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={t.letter.nicknamePlaceholder}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink"
          />
          <p className="mt-0.5 text-right text-[11px] text-ink-soft">
            {nickname.length}/{NICKNAME_MAX}
          </p>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft">{t.letter.country}</label>
          <select
            value={country ?? ""}
            onChange={(e) => setCountry(e.target.value || undefined)}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink"
          >
            <option value="">{t.countries.unset}</option>
            {COUNTRY_CODES.map((code) => (
              <option key={code} value={code}>
                {countryFlagEmoji(code)} <CountryLabel code={code} locale={locale} />
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-ink-soft">{t.letter.letterLabel}</label>
          <textarea
            value={letter}
            maxLength={LETTER_MAX}
            onChange={(e) => setLetter(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={t.letter.letterPlaceholder}
            rows={6}
            className="mt-1 w-full resize-none rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink"
          />
          <p className="mt-0.5 text-right text-[11px] text-ink-soft">
            {letter.length}/{LETTER_MAX}
            {t.letter.charCount}
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-xl bg-butter/25 px-3 py-2.5 text-center text-[11px] leading-relaxed text-ink-soft">
        {t.letter.publicNotice}
      </p>

      <button
        disabled={!valid}
        onClick={() => router.push("/create/review")}
        className="mt-5 w-full rounded-full bg-berry py-3.5 text-sm font-bold text-cream shadow-lg transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {t.letter.goToReview}
      </button>
      {!valid && touched && (
        <p className="mt-2 text-center text-[11px] text-berry">
          {t.letter.nickname} · {t.letter.letterLabel}
        </p>
      )}
    </div>
  );
}
