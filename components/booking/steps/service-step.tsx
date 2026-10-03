import {
  Check,
  Clock3,
} from "lucide-react";

import type { ServiceItem } from "@/features/services/queries";

type ServiceStepProps = {
  services: ServiceItem[];
  selectedService: ServiceItem | null;
  onSelect: (service: ServiceItem) => void;
};

export function ServiceStep({
  services,
  selectedService,
  onSelect,
}: ServiceStepProps) {
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
          Étape 01
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          Choisissez votre service
        </h2>

        <p className="mt-2 text-sm text-white/40">
          Sélectionnez une prestation pour continuer.
        </p>
      </div>

      {/* SERVICES */}
      <div className="grid gap-2 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected =
            selectedService?.id === service.id;

          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service)}
              aria-pressed={isSelected}
              className={[
                "group relative w-full rounded-lg border",
                "px-4 py-3 text-left",
                "transition-all duration-200",

                isSelected
                  ? "border-brand bg-brand/[0.07]"
                  : "border-white/10 bg-surface hover:border-white/25 hover:bg-surface-hover",
              ].join(" ")}
            >
              <div className="flex items-center gap-4">
                {/* INFO */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={[
                        "truncate text-sm font-semibold transition-colors sm:text-base",

                        isSelected
                          ? "text-brand"
                          : "text-white group-hover:text-brand",
                      ].join(" ")}
                    >
                      {service.name}
                    </h3>

                    {isSelected && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-black">
                        <Check className="size-3" />
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-3">
                    {service.category?.name && (
                      <span className="truncate text-[10px] font-medium uppercase tracking-[0.12em] text-white/30">
                        {service.category.name}
                      </span>
                    )}

                    <span className="flex shrink-0 items-center gap-1 text-xs text-white/35">
                      <Clock3 className="size-3" />

                      {service.durationMinutes} min
                    </span>
                  </div>
                </div>

                {/* PRICE */}
                <span className="shrink-0 whitespace-nowrap font-mono text-sm font-semibold text-white sm:text-base">
                  {Number(service.price)} DT
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}