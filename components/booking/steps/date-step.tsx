"use client";

import { Calendar } from "@/components/ui/calendar";

type DateStepProps = {
  selectedDate: Date | undefined;
  loading?: boolean;
  onSelect: (date: Date) => void;
  onBack: () => void;
};

export function DateStep({
  selectedDate,
  loading = false,
  onSelect,
  onBack,
}: DateStepProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="mb-4 text-xs font-medium text-white/35 transition-colors hover:text-brand disabled:pointer-events-none disabled:opacity-50"
      >
        ← Modifier le coiffeur
      </button>

      <div className="mb-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
          Étape 03
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          Choisissez une date
        </h2>

        <p className="mt-2 text-sm text-white/40">
          Sélectionnez le jour de votre rendez-vous.
        </p>
      </div>

      <div className="w-full min-w-0">
  <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-surface p-2 sm:mx-0 sm:p-5">
          <Calendar
  mode="single"
  selected={selectedDate}
  onSelect={(date) => {
    if (date && !loading) {
      onSelect(date);
    }
  }}
  disabled={{
    before: today,
  }}
  className="w-full max-w-full bg-transparent"
/>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 text-sm text-white/60">
                <span className="size-4 animate-spin rounded-full border-2 border-white/15 border-t-brand" />

                Vérification...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}