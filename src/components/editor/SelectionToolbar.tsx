"use client";

import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";

export function SelectionToolbar() {
  const { t } = useI18n();
  const selectedId = useEditorStore((s) => s.selectedId);
  const duplicateObject = useEditorStore((s) => s.duplicateObject);
  const removeObject = useEditorStore((s) => s.removeObject);
  const reorderLayer = useEditorStore((s) => s.reorderLayer);

  if (!selectedId) return <div className="h-10" />;

  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <button
        onClick={() => reorderLayer(selectedId, "backward")}
        className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft active:bg-paper-dark"
      >
        {t.editor.sendBackward}
      </button>
      <button
        onClick={() => reorderLayer(selectedId, "forward")}
        className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft active:bg-paper-dark"
      >
        {t.editor.bringForward}
      </button>
      <button
        onClick={() => duplicateObject(selectedId)}
        className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft active:bg-paper-dark"
      >
        {t.editor.duplicate}
      </button>
      <button
        onClick={() => removeObject(selectedId)}
        className="rounded-full bg-berry/15 px-3 py-1.5 text-xs font-semibold text-berry active:bg-berry/25"
      >
        {t.editor.delete}
      </button>
    </div>
  );
}
