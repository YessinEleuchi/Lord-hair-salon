"use client";

import type {
  AvailabilityResult,
} from "@/features/availability/engine/availability.types";

type TimeStepProps = {
  availability: AvailabilityResult | null;
  selectedTime: string | null;
  onSelect: (time: string) => void;
  onBack: () => void;
};

export function TimeStep({
  availability,
  selectedTime,
  onSelect,
  onBack,
}: TimeStepProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-xs font-medium text-white/35 transition-colors hover:text-brand"
      >
        ← Modifier la date
      </button>

      <div className="mb-7">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
          Étape 04
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          Choisissez une heure
        </h2>

        {availability && (
          <p className="mt-2 text-sm text-white/40">
            Créneaux disponibles pour le{" "}
            <span className="text-white/70">
              {new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(
                new Date(
                  `${availability.date}T12:00:00`,
                ),
              )}
            </span>
          </p>
        )}
      </div>

      {!availability?.available ? (
        <div className="rounded-xl border border-white/10 bg-surface p-6">
          <p className="font-medium text-white">
            Aucun créneau disponible
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Essayez une autre date pour trouver
            un créneau disponible.
          </p>

          <button
            type="button"
            onClick={onBack}
            className="mt-5 text-sm font-medium text-brand transition-opacity hover:opacity-80"
          >
            Choisir une autre date
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {availability.sessions.map((session) => {
            if (session.slots.length === 0) {
              return null;
            }

            return (
              <section key={session.type}>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
                    {session.type === "MORNING"
                      ? "Matin"
                      : "Après-midi"}
                  </h3>

                  <span className="font-mono text-xs text-white/30">
                    {session.start} — {session.end}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 min-[360px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {session.slots.map((slot) => {
                    const isSelected =
                      selectedTime === slot.start;

                    return (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() =>
                          onSelect(slot.start)
                        }
                        className={[
  "min-h-12 rounded-xl border px-2 py-3",
  "font-mono text-sm font-semibold",
  "touch-manipulation transition-all duration-200",

  isSelected
    ? "border-brand bg-brand text-black"
    : "border-white/10 bg-surface text-white active:bg-surface-hover sm:hover:border-brand sm:hover:text-brand",
].join(" ")}
                      >
                        {slot.start}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}