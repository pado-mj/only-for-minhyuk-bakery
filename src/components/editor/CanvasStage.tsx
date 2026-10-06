"use client";

import { useRef } from "react";
import { CakeBase } from "@/components/icons/cake";
import { EditableObject } from "@/components/editor/EditableObject";
import { backgroundGradient } from "@/lib/color";
import type { CSSProperties } from "react";
import { useEditorStore } from "@/store/editorStore";

export function CanvasStage({ showCandlesOnly = false }: { showCandlesOnly?: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const present = useEditorStore((s) => s.present);
  const selectedId = useEditorStore((s) => s.selectedId);
  const selectObject = useEditorStore((s) => s.selectObject);

  const objects = showCandlesOnly
    ? present.objects
    : present.objects.filter((o) => o.type !== "candle");
  const sorted = [...objects].sort((a, b) => a.layer - b.layer || a.zIndex - b.zIndex);
  const texture = present.background.texture ?? "paper";
  const textureStyle: CSSProperties = texture === "check"
    ? { backgroundImage: `linear-gradient(rgba(52,71,86,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(52,71,86,.16) 1px, transparent 1px), ${backgroundGradient(present.background.color)}`, backgroundSize: "9% 9%, 9% 9%, 100% 100%" }
    : texture === "cream"
      ? { background: `repeating-radial-gradient(ellipse at 18% 12%, rgba(255,255,255,.72) 0 3%, rgba(244,220,167,.34) 6%, rgba(255,255,255,.5) 10%, transparent 15%), ${backgroundGradient(present.background.color)}` }
      : texture === "kraft"
        ? { backgroundColor: "#cda16d", backgroundImage: "radial-gradient(rgba(92,58,31,.12) .8px, transparent .9px), radial-gradient(rgba(255,245,220,.16) .7px, transparent .8px)", backgroundSize: "7px 7px, 11px 11px", backgroundPosition: "0 0, 3px 5px" }
        : { background: backgroundGradient(present.background.color) };

  return (
    <div
      ref={stageRef}
      onPointerDown={() => selectObject(null)}
      className="paper-texture relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-2xl border border-ink/10 shadow-inner"
      style={textureStyle}
    >
      <div className="pointer-events-none absolute left-1/2 top-[58%] w-[72%] -translate-x-1/2 -translate-y-1/2">
        <CakeBase designId={present.cakeDesign} className="w-full" />
      </div>
      {sorted.map((object) => (
        <EditableObject key={object.id} object={object} stageRef={stageRef} isSelected={selectedId === object.id} candlesLit={false} />
      ))}
    </div>
  );
}
