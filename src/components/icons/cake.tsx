const CAKE_IMAGE = "/assets/cake/cake-base.png";
const CAKE_ASPECT = "900 / 709";

// Recolors the illustrated cake by masking a solid color layer to the
// image's own alpha shape and blending it with mix-blend-mode so the
// original shading/linework shows through instead of flattening it.
export function CakeBase({
  color = "#F3D9B1",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: CAKE_ASPECT }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={CAKE_IMAGE} alt="" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: color,
          mixBlendMode: "color",
          WebkitMaskImage: `url(${CAKE_IMAGE})`,
          maskImage: `url(${CAKE_IMAGE})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  );
}
