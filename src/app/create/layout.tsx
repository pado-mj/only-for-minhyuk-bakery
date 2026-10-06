"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useI18n } from "@/lib/i18n/context";
import { useEditorStore } from "@/store/editorStore";
import { useSubmissionStore } from "@/store/submissionStore";

const STEPS = ["decorate", "candles", "letter", "review", "complete"] as const;

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const [confirmExit, setConfirmExit] = useState(false);
  const resetCake = useEditorStore((s) => s.resetCake);
  const resetSubmission = useSubmissionStore((s) => s.reset);
  const currentStep = STEPS.find((s) => pathname.includes(s)) ?? "decorate";
  const currentIndex = STEPS.indexOf(currentStep);
  const showChrome = currentStep !== "complete";

  const exitToTable = () => {
    resetCake();
    resetSubmission();
    setConfirmExit(false);
    router.push("/");
  };

  return (
    <div className="create-paper min-h-dvh pb-6">
      {showChrome && (
        <div className="sticky top-0 z-20 bg-cream/80 px-4 pb-2 pt-4 backdrop-blur-[2px]">
          <div className="mb-2 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft"
              aria-label="back"
            >
              ←
            </button>
            <button
              onClick={() => setConfirmExit(true)}
              className="text-xs font-bold text-ink-soft underline decoration-ink/20 underline-offset-4"
            >
              {t.editor.backToTable}
            </button>
          </div>
          <div className="flex gap-1.5">
            {STEPS.slice(0, 4).map((step, i) => (
              <div
                key={step}
                className={`h-1.5 flex-1 rounded-full ${i <= currentIndex ? "bg-berry" : "bg-paper-dark"}`}
              />
            ))}
          </div>
        </div>
      )}
      {children}
      <ConfirmDialog
        open={confirmExit}
        title={t.editor.backToTableConfirmTitle}
        body={t.editor.backToTableConfirmBody}
        onCancel={() => setConfirmExit(false)}
        onConfirm={exitToTable}
      />
    </div>
  );
}
