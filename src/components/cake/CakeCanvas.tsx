import { CakeBase } from "@/components/icons/cake";
import { CanvasObjectSprite } from "@/components/cake/CanvasObjectSprite";
import { backgroundGradient } from "@/lib/color";
import { CANVAS_SIZE } from "@/types/cake";
import type { CakeData } from "@/types/cake";

const BASE_SIZE_PERCENT: Record<string, number> = {
  decoration: 13,
  image: 22,
  topper: 46,
  candle: 9,
};

export function CakeCanvas({
  cakeData,
  candlesLit = true,
  className = "",
  rounded = true,
  branding,
}: {
  cakeData: CakeData;
  candlesLit?: boolean;
  className?: string;
  rounded?: boolean;
  branding?: { nickname: string; publicNumber: number };
}) {
  // Legacy v0.4 rows may not contain the newer background/cakeColor/objects shape.
  // Normalize at render time so existing published cakes remain readable.
  const backgroundColor = cakeData?.background?.color ?? "#F6DCC6";
  const cakeColor = cakeData?.cakeColor ?? "#F3D9B1";
  const objects = Array.isArray(cakeData?.objects) ? cakeData.objects : [];
  const sorted = [...objects].sort((a, b) => a.layer - b.layer || a.zIndex - b.zIndex);
  return (
    <div
      className={`paper-texture relative aspect-square w-full overflow-hidden ${rounded ? "rounded-2xl" : ""} ${className}`}
      style={{ background: backgroundGradient(backgroundColor), containerType: "inline-size" }}
    >
      <div className="absolute left-1/2 top-[58%] w-[72%] -translate-x-1/2 -translate-y-1/2">
        <CakeBase color={cakeColor} className="w-full" />
      </div>
      {sorted.map((object) => {
        const basePercent = BASE_SIZE_PERCENT[object.type] ?? 14;
        const sizePercent = basePercent * object.scale;
        return (
          <div
            key={object.id}
            className="absolute"
            style={{
              left: `${(object.x / CANVAS_SIZE) * 100}%`,
              top: `${(object.y / CANVAS_SIZE) * 100}%`,
              width: `${sizePercent}%`,
              transform: `translate(-50%, -50%) rotate(${object.rotation}deg)`,
              containerType: "inline-size",
            }}
          >
            <CanvasObjectSprite object={object} lit={candlesLit} />
          </div>
        );
      })}
      {branding && (
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-[0.3cqw] pb-[2.5cqw] text-center"
          style={{
            textShadow: "0 1px 2px rgba(255,255,255,0.6)",
            // The PNG export skips embedding the Pretendard webfont (see
            // complete/page.tsx — embedding it was hanging the export), so
            // this falls through to the browser's default font unless we
            // pin it to system CJK sans fonts here. Without this it rendered
            // in the browser's raw serif default (looked like 명조체).
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
          }}
        >
          <span className="font-bold tracking-wide text-ink" style={{ fontSize: "3.4cqw" }}>
            ONLY FOR MINHYUK BAKERY
          </span>
          <span className="text-ink-soft" style={{ fontSize: "2.6cqw" }}>
            made by {branding.nickname} · #{branding.publicNumber}
          </span>
        </div>
      )}
    </div>
  );
}
