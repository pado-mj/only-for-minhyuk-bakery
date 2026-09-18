import Link from "next/link";
import { CakeCanvas } from "@/components/cake/CakeCanvas";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { countryFlagEmoji } from "@/lib/countries";
import { useI18n } from "@/lib/i18n/context";
import type { CakeRecord } from "@/types/cake";

export function CakeTableItem({ cake }: { cake: CakeRecord }) {
  const { locale } = useI18n();
  return (
    <Link
      href={`/cake/${cake.publicId}`}
      className="paper-card block p-[10px] transition-transform active:scale-[0.98]"
    >
      <div className="w-full">
        <CakeCanvas cakeData={cake.cakeData} candlesLit={false} />
      </div>
      <div className="px-1 pb-1 pt-2.5">
        <div className="flex min-w-0 items-center justify-between gap-2 text-xs font-semibold text-ink">
          <span className="min-w-0 truncate">{cake.nickname}</span>
          {cake.country && (
            <span className="shrink-0 whitespace-nowrap text-[10px] font-normal text-ink-soft">
              {countryFlagEmoji(cake.country)} <CountryLabel code={cake.country} locale={locale} />
            </span>
          )}
        </div>
        <p className="mt-1.5 line-clamp-2 min-h-[2.5rem] text-[11px] leading-5 text-ink-soft">
          {cake.letter}
        </p>
      </div>
    </Link>
  );
}
