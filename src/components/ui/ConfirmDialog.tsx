"use client";

import { useI18n } from "@/lib/i18n/context";

export function ConfirmDialog({
  open,
  title,
  body,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6">
      <div className="paper-card w-full max-w-[320px] p-5">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">{body}</p>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full bg-paper-dark py-2 text-xs font-bold text-ink-soft"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-full bg-berry py-2 text-xs font-bold text-cream"
          >
            {t.common.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
