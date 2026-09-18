"use client";

import { usePathname, useRouter } from "next/navigation";

const STEPS = ["decorate", "candles", "letter", "review", "complete"] as const;

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentStep = STEPS.find((s) => pathname.includes(s)) ?? "decorate";
  const currentIndex = STEPS.indexOf(currentStep);
  const showChrome = currentStep !== "complete";

  return (
    <div className="min-h-dvh pb-6">
      {showChrome && (
        <div className="sticky top-0 z-20 bg-cream/95 px-4 pb-2 pt-4 backdrop-blur">
          <div className="mb-2 flex items-center">
            <button
              onClick={() => router.back()}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft"
              aria-label="back"
            >
              ←
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
    </div>
  );
}
