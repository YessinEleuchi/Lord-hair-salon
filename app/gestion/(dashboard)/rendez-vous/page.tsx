import {
  CalendarX2,
} from "lucide-react";

import {
  AppointmentCard,
} from "@/components/admin/appointment/appointment-card";

import {
  AppointmentTabs,
} from "@/components/admin/appointment/appointment-tab";

import {
  getAllAppointments,
  getAppointmentsByStatus,
} from "@/features/appointments/queries";

type PageProps = {
  searchParams: Promise<{
    statut?: string;
  }>;
};

export default async function RendezVousPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const filter =
    params.statut ?? "all";

  let appointments;

  switch (filter) {
    case "pending":
      appointments =
        await getAppointmentsByStatus(
          "PENDING",
        );
      break;

    case "confirmed":
      appointments =
        await getAppointmentsByStatus(
          "CONFIRMED",
        );
      break;

    case "cancelled":
      appointments =
        await getAppointmentsByStatus(
          "CANCELLED",
        );
      break;

    default:
      appointments =
        await getAllAppointments();
  }

  return (
    <div className="min-w-0">
      <section>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
          Gestion
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl">
          Rendez-vous
        </h1>

        <p className="mt-2 text-sm leading-6 text-white/40">
          Consultez et gérez les
          demandes du salon.
        </p>
      </section>

      <section className="mt-6">
        <AppointmentTabs />
      </section>

      <section className="mt-6">
        {appointments.length === 0 ? (
          <EmptyAppointments />
        ) : (
          <>
            <p className="mb-3 text-xs text-white/30">
              {appointments.length}{" "}
              {appointments.length === 1
                ? "rendez-vous"
                : "rendez-vous"}
            </p>

            <div className="grid min-w-0 gap-3 xl:grid-cols-2">
              {appointments.map(
                (appointment) => (
                  <AppointmentCard
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
          </>
        )}
      </section>
    </div>
  );
}

function EmptyAppointments() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface px-5 py-10 text-center">
      <div className="mx-auto flex size-11 items-center justify-center rounded-xl bg-white/[0.04] text-white/25">
        <CalendarX2 className="size-5" />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-white">
        Aucun rendez-vous
      </h2>

      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-white/35">
        Aucun rendez-vous ne
        correspond à ce filtre.
      </p>
    </div>
  );
}