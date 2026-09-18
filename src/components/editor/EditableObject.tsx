"use client";

import { useCallback, useRef } from "react";
import { CanvasObjectSprite } from "@/components/cake/CanvasObjectSprite";
import { useEditorStore } from "@/store/editorStore";
import { CANVAS_SIZE } from "@/types/cake";
import type { CanvasObject } from "@/types/cake";

const BASE_SIZE_PERCENT: Record<string, number> = {
  decoration: 13,
  image: 22,
  topper: 46,
  candle: 9,
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function EditableObject({
  object,
  stageRef,
  isSelected,
}: {
  object: CanvasObject;
  stageRef: React.RefObject<HTMLDivElement | null>;
  isSelected: boolean;
}) {
  const selectObject = useEditorStore((s) => s.selectObject);
  const updateObjectTransform = useEditorStore((s) => s.updateObjectTransform);
  const commit = useEditorStore((s) => s.commit);
  const dragState = useRef<{ startX: number; startY: number; objX: number; objY: number } | null>(null);
  const handleState = useRef<{
    centerX: number;
    centerY: number;
    startDist: number;
    startAngle: number;
    startScale: number;
    startRotation: number;
  } | null>(null);

  const basePercent = BASE_SIZE_PERCENT[object.type] ?? 14;

  const onDragStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      selectObject(object.id);
      dragState.current = { startX: e.clientX, startY: e.clientY, objX: object.x, objY: object.y };
      const onMove = (ev: PointerEvent) => {
        if (!dragState.current || !stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        const scale = CANVAS_SIZE / rect.width;
        const dx = (ev.clientX - dragState.current.startX) * scale;
        const dy = (ev.clientY - dragState.current.startY) * scale;
        updateObjectTransform(object.id, {
          x: clamp(dragState.current.objX + dx, 0, CANVAS_SIZE),
          y: clamp(dragState.current.objY + dy, 0, CANVAS_SIZE),
        });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        dragState.current = null;
        commit();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [object.id, object.x, object.y, selectObject, stageRef, updateObjectTransform, commit]
  );

  const onHandleStart = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      if (!stageRef.current) return;
      const stageRect = stageRef.current.getBoundingClientRect();
      const centerX = stageRect.left + (object.x / CANVAS_SIZE) * stageRect.width;
      const centerY = stageRect.top + (object.y / CANVAS_SIZE) * stageRect.height;
      const startDist = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const startAngle = (Math.atan2(e.clientY - centerY, e.clientX - centerX) * 180) / Math.PI;
      handleState.current = {
        centerX,
        centerY,
        startDist,
        startAngle,
        startScale: object.scale,
        startRotation: object.rotation,
      };
      const onMove = (ev: PointerEvent) => {
        if (!handleState.current) return;
        const { centerX, centerY, startDist, startAngle, startScale, startRotation } = handleState.current;
        const dist = Math.hypot(ev.clientX - centerX, ev.clientY - centerY);
        const angle = (Math.atan2(ev.clientY - centerY, ev.clientX - centerX) * 180) / Math.PI;
        const scale = clamp(startScale * (dist / Math.max(startDist, 1)), 0.3, 3.5);
        const rotation = startRotation + (angle - startAngle);
        updateObjectTransform(object.id, { scale, rotation });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        handleState.current = null;
        commit();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [object.id, object.rotation, object.scale, object.x, object.y, stageRef, updateObjectTransform, commit]
  );

  return (
    <div
      className="absolute touch-none"
      style={{
        left: `${(object.x / CANVAS_SIZE) * 100}%`,
        top: `${(object.y / CANVAS_SIZE) * 100}%`,
        width: `${basePercent * object.scale}%`,
        transform: `translate(-50%, -50%) rotate(${object.rotation}deg)`,
        zIndex: 100 + object.zIndex,
        containerType: "inline-size",
      }}
      onPointerDown={onDragStart}
    >
      <div className={isSelected ? "outline outline-2 outline-dashed outline-berry outline-offset-4 rounded-lg" : ""}>
        <CanvasObjectSprite object={object} lit />
      </div>
      {isSelected && (
        <div
          onPointerDown={onHandleStart}
          className="absolute -bottom-3 -right-3 h-7 w-7 cursor-grab touch-none rounded-full border-2 border-cream bg-berry shadow-md active:cursor-grabbing"
          aria-label="scale and rotate"
        />
      )}
    </div>
  );
}
