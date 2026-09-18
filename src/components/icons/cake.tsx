const CAKE_IMAGE = "/assets/cake/cake-base.png";
const CAKE_ASPECT = "900 / 709";

/**
 * Keep the cream and pencil linework from the original illustration intact,
 * and tint only the exposed sponge (top + side) areas.
 *
 * The base artwork is 900x709. The paths below deliberately sit inside the
 * cream boundaries so the color layer never washes over the white frosting.
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
        <g
          fill={color}
          opacity="0.72"
          style={{ mixBlendMode: "multiply" }}
        >
          {/* exposed top sponge — inset from the upper cream piping */}
          <path d="M247 260 C285 221 354 204 447 204 C540 204 615 222 651 262 C625 286 566 300 449 302 C334 301 273 287 247 260 Z" />

          {/* upper side sponge between the top and middle cream bands */}
          <path d="M205 300 C264 326 334 337 449 338 C566 337 641 324 692 299 L683 383 C630 405 556 417 449 418 C340 417 267 406 216 384 Z" />

          {/* lower side sponge beneath the middle cream band */}
          <path d="M191 472 C250 493 333 505 449 506 C567 505 650 493 708 470 L695 557 C634 584 552 598 449 599 C345 598 263 584 204 558 Z" />
        </g>
      </svg>

      {/* Repaint the original linework/texture over the tint very lightly.
          This keeps the colored-pencil texture while the cream remains untouched. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={CAKE_IMAGE}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        draggable={false}
        style={{ opacity: 0.28, mixBlendMode: "multiply" }}
      />
    </div>
  );
}
