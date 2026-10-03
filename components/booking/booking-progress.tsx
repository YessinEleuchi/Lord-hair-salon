import { Check } from "lucide-react";

import type { BookingStep } from "@/features/booking/types";

const steps: {
  id: BookingStep;
  label: string;
}[] = [
  { id: "service", label: "Service" },
  { id: "staff", label: "Coiffeur" },
  { id: "date", label: "Date" },
  { id: "time", label: "Heure" },
  { id: "customer", label: "Informations" },
];

type BookingProgressProps = {
  currentStep: BookingStep;
};

export function BookingProgress({
  currentStep,
}: BookingProgressProps) {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep,
  );

  // Confirmation = toutes les étapes terminées.
  const isConfirmation =
    currentStep === "confirmation";

  const visibleIndex =
    currentIndex >= 0
      ? currentIndex
      : steps.length - 1;

  const progress =
    isConfirmation
      ? 100
      : ((visibleIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full">
      {/* MOBILE */}
      <div className="sm:hidden">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-brand">
              {isConfirmation
                ? "Terminé"
                : `Étape ${String(
                    visibleIndex + 1,
                  ).padStart(2, "0")} / ${String(
                    steps.length,
                  ).padStart(2, "0")}`}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-white">
              {isConfirmation
                ? "Confirmation"
                : steps[visibleIndex]?.label}
            </p>
          </div>

          <span className="shrink-0 font-mono text-xs text-white/35">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* TABLET / DESKTOP */}
      <div className="hidden sm:flex sm:items-center">
        {steps.map((step, index) => {
          const isActive =
            step.id === currentStep;

          const isCompleted =
            isConfirmation ||
            index < currentIndex;

          return (
            <div
              key={step.id}
              className="flex min-w-0 flex-1 items-center last:flex-none"
            >
              <div className="flex shrink-0 items-center gap-2 lg:gap-3">
                <span
                  className={[
                    "flex size-8 items-center justify-center rounded-full border",
                    "font-mono text-[11px] transition-colors",

                    isActive
                      ? "border-brand bg-brand text-black"
                      : isCompleted
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-white/15 text-white/30",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <Check className="size-3.5" />
                  ) : (
                    String(index + 1).padStart(
                      2,
                      "0",
                    )
                  )}
                </span>

                <span
                  className={[
                    "hidden text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors md:block lg:text-xs lg:tracking-[0.12em]",

                    isActive
                      ? "text-white"
                      : isCompleted
                        ? "text-brand"
                        : "text-white/30",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={[
                    "mx-3 h-px min-w-3 flex-1 lg:mx-5",

                    isCompleted
                      ? "bg-brand"
                      : "bg-white/10",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}