import {
  CalendarClock,
  CalendarX2,
  Clock3,
} from "lucide-react";

import type {
  CalendarDayData,
} from "@/features/calendar/queries";

type CalendarScheduleBannerProps = {
  data: CalendarDayData;
};

export function CalendarScheduleBanner({
  data,
}: CalendarScheduleBannerProps) {
  if (!data.staff) {
    return (
      <Banner
        icon={CalendarX2}
        title="Aucun coiffeur actif"
        description="Aucun planning n'est disponible."
      />
    );
  }

  if (
    data.override?.isClosed
  ) {
    return (
      <Banner
        icon={CalendarX2}
        title="Fermé exceptionnellement"
        description={
          data.override.reason ||
          "Le salon est fermé pour cette date."
        }
        highlighted
      />
    );
  }

  if (
    !data.workingDay ||
    !data.workingDay.enabled
  ) {
    return (
      <Banner
        icon={CalendarX2}
        title="Jour fermé"
        description="Aucun horaire de travail prévu pour cette journée."
      />
    );
  }

  const special =
    Boolean(data.override);

  return (
    <div
      className={`
        rounded-2xl
        border
        p-4
        ${
          special
            ? "border-brand/20 bg-brand/[0.05]"
            : "border-white/10 bg-surface"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${
              special
                ? "bg-brand/10 text-brand"
                : "bg-white/[0.04] text-white/35"
            }
          `}
        >
          {special ? (
            <CalendarClock className="size-4" />
          ) : (
            <Clock3 className="size-4" />
          )}
        </div>

        <div className="min-w-0">
          <p
            className={`
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              ${
                special
                  ? "text-brand"
                  : "text-white/25"
              }
            `}
          >
            {special
              ? "Planning exceptionnel"
              : "Horaires du jour"}
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {
              data.workingDay
                .startTime
            }
            {" → "}
            {
              data.workingDay
                .endTime
            }
          </p>

          {special &&
            data.override
              ?.reason && (
              <p className="mt-1.5 text-xs leading-5 text-white/40">
                {
                  data.override
                    .reason
                }
              </p>
            )}
        </div>
      </div>
    </div>
  );
}

function Banner({
  icon: Icon,
  title,
  description,
  highlighted = false,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-4
        ${
          highlighted
            ? "border-brand/20 bg-brand/[0.05]"
            : "border-white/10 bg-surface"
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${
              highlighted
                ? "bg-brand/10 text-brand"
                : "bg-white/[0.04] text-white/30"
            }
          `}
        >
          <Icon className="size-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-white/35">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}