import {
  CalendarDays,
  Clock3,
  Phone,
  Scissors,
  UserRound,
} from "lucide-react";

import {
  AppointmentActions,
} from "@/components/admin/appointment/appointment-actions";

import {
  WhatsAppCustomerButton,
} from "@/components/admin/appointment/whatsapp-customer-button";

import type {
  AppointmentItem,
} from "@/features/appointments/queries";

import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/features/appointments/utils/format-appointment";

type AppointmentCardProps = {
  appointment: AppointmentItem;
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
      "border-white/10 bg-white/[0.05] text-white/50",
  },

  CANCELLED: {
    label: "Annulé",
    className:
      "border-red-500/20 bg-red-500/[0.06] text-red-300",
  },

  NO_SHOW: {
    label: "Absent",
    className:
      "border-orange-500/20 bg-orange-500/[0.07] text-orange-300",
  },
} as const;

export function AppointmentCard({
  appointment,
}: AppointmentCardProps) {
  const status =
    statusConfig[
      appointment.status
    ];

  const appointmentDate =
    formatAppointmentDate(
      appointment.startAt,
    );

  const appointmentTime =
    formatAppointmentTime(
      appointment.startAt,
    );

  return (
    <article className="min-w-0 rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <span
            className={`
              inline-flex
              rounded-full
              border
              px-2.5
              py-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.1em]
              ${status.className}
            `}
          >
            {status.label}
          </span>

          <h2 className="mt-3 truncate text-base font-semibold tracking-[-0.025em] text-white">
            {appointment.customer.name}
          </h2>

          <a
            href={`tel:${appointment.customer.phone}`}
            className="
              mt-1.5
              inline-flex
              max-w-full
              items-center
              gap-1.5
              text-xs
              text-white/40
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
          <p className="text-xl font-semibold tracking-[-0.04em] text-white">
            {appointmentTime}
          </p>

          <p className="mt-1 text-[11px] capitalize text-white/35">
            {appointmentDate}
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-white/[0.06]" />

      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <Info
          icon={Scissors}
          label="Service"
          value={
            appointment.service.name
          }
        />

        <Info
          icon={UserRound}
          label="Coiffeur"
          value={
            appointment.staff.name
          }
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

      <AppointmentActions
  appointmentId={appointment.id}
  appointmentStatus={appointment.status}
  customerName={appointment.customer.name}
  customerPhone={appointment.customer.phone}
  serviceName={appointment.service.name}
  date={appointmentDate}
  time={appointmentTime}
/>
      )}

      {appointment.status ===
        "CANCELLED" &&
        appointment
          .cancellationReason && (
          <div className="mt-4 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.1em] text-white/25">
              Motif
            </p>

            <p className="mt-1 text-xs leading-5 text-red-200/70">
              {
                appointment
                  .cancellationReason
              }
            </p>
          </div>
        )}

      {(
        appointment.status ===
          "CONFIRMED" ||
        appointment.status ===
          "CANCELLED"
      ) && (
        <div className="mt-4 border-t border-white/[0.06] pt-4">
          <WhatsAppCustomerButton
            status={
              appointment.status
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
        </div>
      )}
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