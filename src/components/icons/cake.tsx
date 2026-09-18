const CAKE_IMAGE = "/assets/cake/cake-base.png";
const CAKE_ASPECT = "900 / 709";

/**
 * Cake artwork is rendered exactly as authored.
 * Do not apply runtime tinting or color overlays.
 */
export function CakeBase({
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: CAKE_ASPECT }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CAKE_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
}
