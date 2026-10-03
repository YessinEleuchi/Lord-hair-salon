import Image from "next/image";
import { Check } from "lucide-react";

import type { StaffItem } from "@/features/staff/queries";

type StaffStepProps = {
  staff: StaffItem[];
  selectedStaffId: string | null;

  onSelect: (staff: StaffItem) => void;
  onBack: () => void;
};

export function StaffStep({
  staff,
  selectedStaffId,
  onSelect,
  onBack,
}: StaffStepProps) {
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="
            mb-4
            text-xs
            font-medium
            text-white/35
            transition-colors
            hover:text-brand
          "
        >
          ← Modifier le service
        </button>

        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
          Étape 02
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          Choisissez votre coiffeur
        </h2>

        <p className="mt-2 text-sm text-white/40">
          Sélectionnez votre professionnel.
        </p>
      </div>

      {/* STAFF */}
      <div className="grid gap-3 sm:grid-cols-2">
        {staff.map((member) => {
          const isSelected =
            selectedStaffId === member.id;

          return (
            <button
              key={member.id}
              type="button"
              onClick={() => onSelect(member)}
              aria-pressed={isSelected}
              className={[
  "group flex min-h-20 w-full min-w-0 items-center gap-3",
  "rounded-xl border p-3 text-left",
  "touch-manipulation transition-all duration-200",

  isSelected
    ? "border-brand bg-brand/[0.06]"
    : "border-white/10 bg-surface active:bg-surface-hover sm:hover:border-white/25 sm:hover:bg-surface-hover",
].join(" ")}
            >
              {/* AVATAR */}
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:size-20">
                {member.avatarUrl ? (
                  <Image
                    src={member.avatarUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 639px) 64px, 80px"
                    className="
                      object-cover
                      transition-transform
                      duration-300
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-lg font-semibold text-white/20">
                      {member.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>

              {/* INFO */}
              <div className="min-w-0 flex-1">
                <h3
  className={[
    "truncate text-sm font-semibold transition-colors sm:text-base",

    isSelected
      ? "text-brand"
      : "text-white sm:group-hover:text-brand",
  ].join(" ")}
>
  {member.name}
</h3>

                {member.bio && (
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/40">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* SELECT */}
              <span
                className={[
                  "flex size-6 shrink-0 items-center justify-center",
                  "rounded-full border transition-all",

                  isSelected
                    ? "border-brand bg-brand text-black"
                    : "border-white/15 text-transparent",
                ].join(" ")}
              >
                <Check className="size-3.5" />
              </span>
            </button>
          );
        })}
      </div>

      {staff.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-surface p-8 text-center">
          <p className="text-sm text-white/40">
            Aucun coiffeur disponible pour ce service.
          </p>
        </div>
      )}
    </div>
  );
}