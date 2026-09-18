import { getCakeDesign } from "@/lib/assets";

/** Cake artwork is rendered exactly as authored. No runtime tinting. */
export function CakeBase({
  designId = "classic",
  className = "",
}: {
  designId?: string;
  className?: string;
}) {
  const design = getCakeDesign(designId);
  return (
    <div className={`relative aspect-square ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={design.imageSrc}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
        onError={(event) => {
          if (!event.currentTarget.src.endsWith("/assets/cake/cake-base.png")) {
            event.currentTarget.src = "/assets/cake/cake-base.png";
          }
        }}
      />
    </div>
  );
}
