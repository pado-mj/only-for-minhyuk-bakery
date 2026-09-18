"use client";

import { useRef } from "react";
import { CakeBase } from "@/components/icons/cake";
import { EditableObject } from "@/components/editor/EditableObject";
import { backgroundGradient } from "@/lib/color";
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

  return (
    <div
      ref={stageRef}
      onPointerDown={() => selectObject(null)}
      className="paper-texture relative mx-auto aspect-square w-full max-w-[380px] overflow-hidden rounded-2xl border border-ink/10 shadow-inner"
      style={{ background: backgroundGradient(present.background.color) }}
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
