"use client";

import {
  Bell,
  CalendarDays,
  Clock3,
  Phone,
  Scissors,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AppointmentActions,
} from "@/components/admin/appointment/appointment-actions";

import type {
  PendingAppointment,
} from "@/features/appointments/queries";

import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "@/features/appointments/utils/format-appointment";

type Props = {
  appointments: PendingAppointment[];
};

export function NotificationBell({
  appointments,
}: Props) {
  const [open, setOpen] =
    useState(false);

  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const count =
    appointments.length;

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) =>
              !current,
          )
        }
        aria-label={`${count} réservation${
          count > 1 ? "s" : ""
        } en attente`}
        aria-expanded={open}
        className="
          relative
          flex
          size-10
          items-center
          justify-center
          rounded-xl
          border
          border-white/10
          bg-surface
          text-white/50
          transition
          hover:border-white/20
          hover:text-white
        "
      >
        <Bell className="size-[18px]" />

        {count > 0 && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-brand
              px-1
              text-[9px]
              font-bold
              leading-5
              text-black
              ring-2
              ring-background
            "
          >
            {count > 9
              ? "9+"
              : count}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Mobile overlay */}
          <button
            type="button"
            aria-label="Fermer les notifications"
            onClick={() =>
              setOpen(false)
            }
            className="
              fixed
              inset-0
              z-40
              bg-black/60
              backdrop-blur-[2px]
              sm:hidden
            "
          />

          <div
            className="
              fixed
              inset-x-3
              top-20
              z-50
              max-h-[calc(100dvh-6rem)]
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-background
              shadow-2xl
              sm:absolute
              sm:inset-x-auto
              sm:right-0
              sm:top-12
              sm:w-[390px]
              sm:max-w-[calc(100vw-2rem)]
            "
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3.5">
              <div>
                <p className="text-sm font-semibold text-white">
                  Réservations
                </p>

                <p className="mt-0.5 text-[11px] text-white/30">
                  {count === 0
                    ? "Aucune demande en attente"
                    : `${count} demande${
                        count > 1
                          ? "s"
                          : ""
                      } à traiter`}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-lg
                  text-white/30
                  transition
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                <X className="size-4" />
              </button>
            </div>

            {count === 0 ? (
              <div className="px-5 py-10 text-center">
                <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-white/20">
                  <Bell className="size-5" />
                </div>

                <p className="mt-4 text-sm font-medium text-white/60">
                  Tout est traité
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Les nouvelles
                  réservations
                  apparaîtront ici.
                </p>
              </div>
            ) : (
              <div className="max-h-[calc(100dvh-12rem)] overflow-y-auto">
                {appointments.map(
                  (
                    appointment,
                  ) => (
                    <div
                      key={
                        appointment.id
                      }
                      className="
                        border-b
                        border-white/[0.06]
                        p-4
                        last:border-b-0
                      "
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="size-2 shrink-0 rounded-full bg-brand" />

                            <p className="truncate text-sm font-semibold text-white">
                              {
                                appointment
                                  .customer
                                  .name
                              }
                            </p>
                          </div>

                          <a
                            href={`tel:${appointment.customer.phone}`}
                            className="
                              mt-1.5
                              inline-flex
                              items-center
                              gap-1.5
                              text-[11px]
                              text-white/30
                              transition
                              hover:text-brand
                            "
                          >
                            <Phone className="size-3" />

                            {
                              appointment
                                .customer
                                .phone
                            }
                          </a>
                        </div>

                        <span
                          className="
                            shrink-0
                            rounded-full
                            border
                            border-brand/20
                            bg-brand/10
                            px-2
                            py-1
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.08em]
                            text-brand
                          "
                        >
                          En attente
                        </span>
                      </div>

                      <div className="mt-3 grid gap-1.5 rounded-xl bg-white/[0.025] p-3">
                        <InfoRow
                          icon={
                            Scissors
                          }
                        >
                          {
                            appointment
                              .service
                              .name
                          }
                        </InfoRow>

                        <InfoRow
                          icon={
                            CalendarDays
                          }
                        >
                          {formatAppointmentDate(
                            appointment.startAt,
                          )}
                        </InfoRow>

                        <InfoRow
                          icon={
                            Clock3
                          }
                        >
                          {formatAppointmentTime(
                            appointment.startAt,
                          )}
                          {" → "}
                          {formatAppointmentTime(
                            appointment.endAt,
                          )}
                        </InfoRow>
                      </div>
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
  date={formatAppointmentDate(
    appointment.startAt,
  )}
  time={formatAppointmentTime(
    appointment.startAt,
  )}
/>

                      
                    </div>
                  ),
                )}
              </div>
            )}

            <div className="border-t border-white/[0.07] p-3">
              <Link
                href="/gestion/rendez-vous?status=pending"
                onClick={() =>
                  setOpen(false)
                }
                className="
                  flex
                  min-h-10
                  items-center
                  justify-center
                  rounded-xl
                  bg-white/[0.04]
                  px-4
                  text-xs
                  font-medium
                  text-white/55
                  transition
                  hover:bg-white/[0.07]
                  hover:text-white
                "
              >
                Voir les rendez-vous
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-brand/70" />

      <span className="truncate text-[11px] text-white/45">
        {children}
      </span>
    </div>
  );
}