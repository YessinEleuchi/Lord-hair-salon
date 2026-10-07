import {
  Clock3,
  Phone,
  Scissors,
} from "lucide-react";

import {
  AppointmentActions,
} from "@/components/admin/appointment/appointment-actions";

import type {
  CalendarDayData,
} from "@/features/calendar/queries";

import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/features/appointments/utils/format-appointment";

type CalendarAppointment =
  CalendarDayData["appointments"][number];

type Props = {
  appointment: CalendarAppointment;
};

const statusConfig = {
  PENDING: {
    label: "En attente",
    className:
      "border-brand/20 bg-brand/10 text-brand",
  },

  CONFIRMED: {
    label: "Confirmé",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  },

  COMPLETED: {
    label: "Terminé",
    className:
      "border-white/10 bg-white/[0.05] text-white/45",
  },

  CANCELLED: {
    label: "Annulé",
    className:
      "border-red-500/20 bg-red-500/[0.06] text-red-300",
  },

  NO_SHOW: {
    label: "Absent",
    className:
      "border-orange-500/20 bg-orange-500/[0.06] text-orange-300",
  },
} as const;

export function CalendarAppointmentCard({
  appointment,
}: Props) {
  const status =
    statusConfig[
      appointment.status
    ];

  const cancelled =
    appointment.status ===
    "CANCELLED";

  const appointmentDate =
    formatAppointmentDate(
      appointment.startAt,
    );

  const appointmentTime =
    formatAppointmentTime(
      appointment.startAt,
    );

  return (
    <article
      className={`
        min-w-0
        rounded-2xl
        border
        p-4
        ${
          cancelled
            ? "border-red-500/10 bg-red-500/[0.025] opacity-70"
            : appointment.status ===
                "PENDING"
              ? "border-brand/15 bg-brand/[0.035]"
              : "border-white/10 bg-surface"
        }
      `}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-semibold tracking-[-0.035em] text-white">
              {appointmentTime}
            </p>

            <span
              className={`
                rounded-full
                border
                px-2
                py-0.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.1em]
                ${status.className}
              `}
            >
              {status.label}
            </span>
          </div>

          <h3 className="mt-2 truncate text-sm font-semibold text-white">
            {appointment.customer.name}
          </h3>

          <a
            href={`tel:${appointment.customer.phone}`}
            className="
              mt-1
              inline-flex
              max-w-full
              items-center
              gap-1.5
              text-xs
              text-white/35
              transition
              hover:text-brand
            "
          >
            <Phone className="size-3.5 shrink-0" />

            <span className="truncate">
              {appointment.customer.phone}
            </span>
          </a>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-white/30">
            jusqu&apos;à
          </p>

          <p className="mt-0.5 text-sm font-medium text-white/65">
            {formatAppointmentTime(
              appointment.endAt,
            )}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
          <Scissors className="size-4 shrink-0 text-brand" />

          <span className="truncate text-xs text-white/65">
            {appointment.service.name}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5">
          <Clock3 className="size-4 shrink-0 text-white/25" />

          <span className="text-xs text-white/50">
            {
              appointment.service
                .durationMinutes
            }{" "}
            min
          </span>
        </div>
      </div>

      {appointment.status ===
        "PENDING" && (
        <AppointmentActions
          appointmentId={
            appointment.id
          }
          customerName={
            appointment.customer.name
          }
          customerPhone={
            appointment.customer.phone
          }
          serviceName={
            appointment.service.name
          }
          date={
            appointmentDate
          }
          time={
            appointmentTime
          }
        />
      )}

      {cancelled &&
        appointment
          .cancellationReason && (
          <p className="mt-3 text-xs leading-5 text-red-200/50">
            {
              appointment
                .cancellationReason
            }
          </p>
        )}
    </article>
  );
}