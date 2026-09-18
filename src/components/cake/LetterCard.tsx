import { CountryLabel } from "@/components/ui/CountryLabel";
import { countryFlagEmoji } from "@/lib/countries";

export function LetterCard({
  nickname,
  country,
  letter,
  locale,
}: {
  nickname: string;
  country?: string;
  letter: string;
  locale: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm">
      {/* paper-tile.png is a gap-free crop of the illustrated notepaper —
          the full paper.png is a photo of a rotated note on a white
          background, so object-cover on it could land a blank white
          corner behind the text depending on the card's aspect ratio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/letter/paper-tile.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div className="relative h-[320px] overflow-y-auto p-6 pt-12">
        <div className="flex items-center gap-1.5 text-sm font-bold text-ink">
          <span>{nickname}</span>
          {country && (
            <span className="text-xs font-normal text-ink-soft">
              {countryFlagEmoji(country)} <CountryLabel code={country} locale={locale} />
            </span>
          )}
        </div>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">{letter}</p>
      </div>
    </div>
  );
}
