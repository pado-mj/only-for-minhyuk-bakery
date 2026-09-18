import { getDecorationAsset } from "@/lib/assets";
import { ClassicCandle, DogCandle, HeartCandle, NumberCandle } from "@/components/icons/candles";
import type { CanvasObject } from "@/types/cake";

export function CanvasObjectSprite({
  object,
  lit = true,
}: {
  object: CanvasObject;
  lit?: boolean;
}) {
  if (object.type === "decoration") {
    const asset = getDecorationAsset(object.assetId);
    if (!asset) return null;
    if (asset.imageSrc) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={asset.imageSrc}
          alt=""
          className="h-full w-full object-contain sticker-shadow"
          draggable={false}
        />
      );
    }
    const { Icon } = asset;
    if (!Icon) return null;
    return <Icon className="h-full w-full sticker-shadow" />;
  }

  if (object.type === "image" && object.imageDataUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={object.imageDataUrl}
        alt=""
        className="h-full w-full object-contain sticker-shadow"
        draggable={false}
      />
    );
  }

  if (object.type === "topper") {
    const isDark = object.textStyle === "dark";
    return (
      <div className="relative w-full" style={{ containerType: "inline-size" }}>
        <svg
          viewBox="0 0 228 88"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full sticker-shadow"
          aria-hidden
        >
          <path
            d="M 218.5 44 Q 218.5 44 213.4 50.5 Q 208.4 56.9 206.3 61.3 Q 204.1 65.6 192.8 67.4 Q 181.4 69.3 170.7 71.8 Q 159.9 74.3 136.9 73.8 Q 114 73.3 91 73.8 Q 68.1 74.3 57.3 71.8 Q 46.6 69.3 35.3 67.4 Q 23.9 65.6 21.8 61.3 Q 19.6 56.9 14.6 50.5 Q 9.5 44 14.6 37.5 Q 19.6 31.1 21.8 26.8 Q 23.9 22.4 35.3 20.5 Q 46.6 18.7 57.3 16.2 Q 68.1 13.7 91 14.2 Q 114 14.7 136.9 14.2 Q 159.9 13.7 170.7 16.2 Q 181.4 18.7 192.8 20.5 Q 204.1 22.4 206.3 26.8 Q 208.4 31.1 213.4 37.5 Z"
            fill={isDark ? "#2F4157" : "#FBF3E3"}
            stroke={isDark ? "#6F7D8C" : "#B99F7B"}
            strokeWidth={2.5}
          />
        </svg>
        <div
          className={`relative text-center font-bold leading-tight ${isDark ? "text-cream" : "text-ink"}`}
          style={{ fontSize: "13cqw", padding: "0.7em 1em" }}
        >
          {object.text}
        </div>
      </div>
    );
  }

  if (object.type === "candle") {
    if (object.assetId === "heart") return <HeartCandle lit={lit} className="h-full w-full" />;
    if (object.assetId === "dog") return <DogCandle lit={lit} className="h-full w-full" />;
    if (object.assetId.startsWith("number-")) {
      const digit = Number(object.assetId.split("-")[1] ?? 0);
      return <NumberCandle digit={digit} lit={lit} className="h-full w-full" />;
    }
    return <ClassicCandle lit={lit} variant={object.zIndex} className="h-full w-full" />;
  }

  return null;
}
