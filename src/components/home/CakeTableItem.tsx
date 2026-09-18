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
      className="paper-card flex items-center gap-4 p-3 transition-transform active:scale-[0.98]"
    >
      <div className="w-24 shrink-0">
        <CakeCanvas cakeData={cake.cakeData} candlesLit={false} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <span className="truncate">{cake.nickname}</span>
          {cake.country && (
            <span className="shrink-0 text-xs text-ink-soft">
              {countryFlagEmoji(cake.country)} <CountryLabel code={cake.country} locale={locale} />
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-soft">
          {cake.letter}
        </p>
      </div>
    </Link>
  );
}
