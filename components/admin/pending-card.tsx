import {
    CalendarDays,
    Clock3,
    Phone,
    Scissors,
    UserRound,
} from "lucide-react";

import type {
    PendingAppointment,
} from "@/features/appointments/queries";

import {
    AppointmentActions,
} from "@/components/admin/appointment/appointment-actions";
import {
    formatAppointmentDate,
    formatAppointmentTime,
} from "@/features/appointments/utils/format-appointment";

type PendingAppointmentCardProps = {
  appointment: PendingAppointment;
};

export function PendingAppointmentCard({
  appointment,
}: PendingAppointmentCardProps) {
  const time =
    formatAppointmentTime(
      appointment.startAt,
    );

  const date =
    formatAppointmentDate(
      appointment.startAt,
    );

  return (
    <article
      className="
        min-w-0
        rounded-2xl
        border
        border-white/10
        bg-surface
        p-4
        sm:p-5
      "
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-brand/20
                bg-brand/10
                px-2.5
                py-1
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-brand
              "
            >
              En attente
            </span>
          </div>

          <h3 className="mt-3 truncate text-base font-semibold tracking-[-0.02em] text-white">
            {appointment.customer.name}
          </h3>

          <a
            href={`tel:${appointment.customer.phone}`}
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-brand"
          >
            <Phone className="size-3.5" />

            {appointment.customer.phone}
          </a>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xl font-semibold tracking-[-0.04em] text-white">
            {time}
          </p>

          <p className="mt-1 text-[11px] capitalize text-white/35">
            {date}
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-white/[0.06]" />

      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <Info
          icon={Scissors}
          label="Service"
          value={appointment.service.name}
        />

        <Info
          icon={UserRound}
          label="Coiffeur"
          value={appointment.staff.name}
        />

        <Info
          icon={Clock3}
          label="Durée"
          value={`${appointment.service.durationMinutes} min`}
        />

        <Info
          icon={CalendarDays}
          label="Prix"
          value={`${appointment.price} DT`}
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <AppointmentActions
  appointmentId={appointment.id}
/>
      </div>
    </article>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-white/30">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.1em] text-white/25">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs font-medium text-white/70">
          {value}
        </p>
      </div>
    </div>
  );
}