const CAKE_IMAGE = "/assets/cake/cake-base.png";
const CAKE_ASPECT = "900 / 709";

/**
 * Tint ONLY the two exposed vertical sponge bands.
 * Keep the top sponge, white cream, bottom cream and pencil linework untouched.
 */
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
      <img
        src={CAKE_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-contain"
        draggable={false}
      />

      <svg
        viewBox="0 0 900 709"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g fill={color} opacity="0.78" style={{ mixBlendMode: "multiply" }}>
          {/* upper vertical sponge band only */}
          <path d="M205 300 C264 326 334 337 449 338 C566 337 641 324 692 299 L683 383 C630 405 556 417 449 418 C340 417 267 406 216 384 Z" />

          {/* lower vertical sponge band only */}
          <path d="M191 472 C250 493 333 505 449 506 C567 505 650 493 708 470 L695 557 C634 584 552 598 449 599 C345 598 263 584 204 558 Z" />
        </g>
      </svg>

      {/* Preserve the original colored-pencil texture and outlines. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CAKE_IMAGE}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        draggable={false}
        style={{ opacity: 0.22, mixBlendMode: "multiply" }}
      />
    </div>
  );
}
