import {
  CalendarX2,
  Coffee,
} from "lucide-react";

import {
  CalendarAppointmentCard,
} from "@/components/admin/calendar/calendar-appointment-card";

import type {
  CalendarDayData,
} from "@/features/calendar/queries";

type Props = {
  data: CalendarDayData;
};

function timeToMinutes(
  value: string,
) {
  const [hours, minutes] =
    value.split(":").map(Number);

  return (
    hours * 60 +
    minutes
  );
}

function dateToTime(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "fr-TN",
    {
      timeZone:
        "Africa/Tunis",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(date);
}

type TimelineItem =
  | {
      type: "appointment";
      start: number;
      appointment:
        CalendarDayData["appointments"][number];
    }
  | {
      type: "break";
      start: number;
      id: string;
      startTime: string;
      endTime: string;
      label: string | null;
    };

export function CalendarDayView({
  data,
}: Props) {
  if (!data.staff) {
    return (
      <EmptyDay
        title="Aucun coiffeur actif"
        description="Aucun agenda ne peut être affiché."
      />
    );
  }

  if (
    !data.workingDay ||
    !data.workingDay.enabled
  ) {
    return (
      <EmptyDay
        title="Salon fermé"
        description="Aucun horaire de travail n'est prévu pour cette journée."
      />
    );
  }

  const activeAppointments =
    data.appointments.filter(
      (appointment) =>
        appointment.status !==
        "CANCELLED",
    );

  const cancelledAppointments =
    data.appointments.filter(
      (appointment) =>
        appointment.status ===
        "CANCELLED",
    );

  const items: TimelineItem[] = [
    ...activeAppointments.map(
      (appointment) => {
        const time =
          dateToTime(
            appointment.startAt,
          );

        return {
          type: "appointment" as const,
          start:
            timeToMinutes(time),
          appointment,
        };
      },
    ),

    ...data.breaks.map(
      (item) => ({
        type: "break" as const,
        start:
          timeToMinutes(
            item.startTime,
          ),
        id: item.id,
        startTime:
          item.startTime,
        endTime:
          item.endTime,
        label: item.label,
      }),
    ),
  ].sort(
    (a, b) =>
      a.start - b.start,
  );

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              Agenda du jour
            </p>

            <p className="mt-1 text-xs text-white/30">
              {
                activeAppointments.length
              }{" "}
              {activeAppointments.length <=
              1
                ? "rendez-vous actif"
                : "rendez-vous actifs"}
            </p>
          </div>

          <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-medium text-white/40">
            {
              data.workingDay
                .startTime
            }
            {" – "}
            {
              data.workingDay
                .endTime
            }
          </span>
        </div>

        {items.length === 0 ? (
          <EmptyDay
            title="Journée libre"
            description="Aucun rendez-vous ni pause n'est prévu pour cette journée."
          />
        ) : (
          <div className="relative">
            <div className="absolute bottom-0 left-[25px] top-0 hidden w-px bg-white/[0.06] sm:block" />

            <div className="space-y-3">
              {items.map(
                (item) => {
                  if (
                    item.type ===
                    "break"
                  ) {
                    return (
                      <BreakItem
                        key={`break-${item.id}`}
                        startTime={
                          item.startTime
                        }
                        endTime={
                          item.endTime
                        }
                        label={
                          item.label
                        }
                      />
                    );
                  }

                  return (
                    <div
                      key={
                        item
                          .appointment
                          .id
                      }
                      className="relative sm:pl-14"
                    >
                      <TimelineDot />

                      <CalendarAppointmentCard
                        appointment={
                          item.appointment
                        }
                      />
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </section>

      {cancelledAppointments.length >
        0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white/60">
                Annulés
              </p>

              <p className="mt-1 text-xs text-white/25">
                Historique de cette
                journée
              </p>
            </div>

            <span className="rounded-full bg-red-500/[0.06] px-2.5 py-1 text-[10px] font-semibold text-red-300/60">
              {
                cancelledAppointments.length
              }
            </span>
          </div>

          <div className="space-y-3">
            {cancelledAppointments.map(
              (appointment) => (
                <CalendarAppointmentCard
                  key={
                    appointment.id
                  }
                  appointment={
                    appointment
                  }
                />
              ),
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function BreakItem({
  startTime,
  endTime,
  label,
}: {
  startTime: string;
  endTime: string;
  label: string | null;
}) {
  return (
    <div className="relative sm:pl-14">
      <TimelineDot />

      <div className="rounded-2xl border border-brand/15 bg-brand/[0.035] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <Coffee className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
              {label || "Pause"}
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              {startTime}
              {" → "}
              {endTime}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineDot() {
  return (
    <span
      className="
        absolute
        left-[21px]
        top-6
        z-10
        hidden
        size-[9px]
        rounded-full
        border-2
        border-background
        bg-brand
        sm:block
      "
    />
  );
}

function EmptyDay({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface px-5 py-10 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-white/25">
        <CalendarX2 className="size-5" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-white/35">
        {description}
      </p>
    </div>
  );
}