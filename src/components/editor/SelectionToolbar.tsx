"use client";

import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";

export function SelectionToolbar() {
  const { t } = useI18n();
  const selectedId = useEditorStore((s) => s.selectedId);
  const duplicateObject = useEditorStore((s) => s.duplicateObject);
  const removeObject = useEditorStore((s) => s.removeObject);
  const flipObject = useEditorStore((s) => s.flipObject);
  const reorderLayer = useEditorStore((s) => s.reorderLayer);

  if (!selectedId) return <div className="h-10" />;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-1">
      <button
        onClick={() => reorderLayer(selectedId, "back")}
        aria-label="Send to back"
        className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft active:bg-paper-dark"
      >
        {t.editor.sendBackward === "뒤로" ? "맨 뒤로" : t.editor.sendBackward === "Back" ? "To back" : t.editor.sendBackward === "後ろへ" ? "最背面へ" : "To back"}
      </button>
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
        onClick={() => reorderLayer(selectedId, "front")}
        aria-label="Bring to front"
        className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft active:bg-paper-dark"
      >
        {t.editor.bringForward === "앞으로" ? "맨 앞으로" : t.editor.bringForward === "Forward" ? "To front" : t.editor.bringForward === "前へ" ? "最前面へ" : "To front"}
      </button>
      <button
        onClick={() => flipObject(selectedId)}
        className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold text-ink-soft active:bg-paper-dark"
      >
        {t.editor.flip}
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
