import Link from "next/link";

import {
  CalendarDays,
  ChevronRight,
  Clock3,
  Scissors,
  Settings,
} from "lucide-react";

import {
  PendingAppointmentCard,
} from "@/components/admin/pending-card";

import {
  getPendingAppointments,
} from "@/features/appointments/queries";

export default async function GestionDashboardPage() {
  const pendingAppointments =
    await getPendingAppointments();

  const pendingCount =
    pendingAppointments.length;

  return (
    <div className="min-w-0">
      <section>
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
          Tableau de bord
        </p>

        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl">
          Bonjour Rabie
        </h1>

        <p className="mt-2 max-w-lg text-sm leading-6 text-white/40">
          Gérez les rendez-vous et
          l&apos;organisation du salon.
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex min-w-0 items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
              Rendez-vous
            </p>

            <div className="mt-1 flex items-center gap-2">
              <h2 className="truncate text-lg font-semibold tracking-[-0.03em]">
                Demandes en attente
              </h2>

              {pendingCount > 0 && (
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-black">
                  {pendingCount > 99
                    ? "99+"
                    : pendingCount}
                </span>
              )}
            </div>
          </div>

          <Link
            href="/gestion/rendez-vous"
            className="shrink-0 text-xs font-medium text-brand"
          >
            Tout voir
          </Link>
        </div>

        {pendingCount === 0 ? (
          <EmptyPendingState />
        ) : (
          <div className="grid gap-3 xl:grid-cols-2">
            {pendingAppointments
              .slice(0, 4)
              .map(
                (appointment) => (
                  <PendingAppointmentCard
                    key={appointment.id}
                    appointment={
                      appointment
                    }
                  />
                ),
              )}
          </div>
        )}

        {pendingCount > 4 && (
          <Link
            href="/gestion/rendez-vous"
            className="
              mt-3
              flex
              min-h-11
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              text-sm
              font-medium
              text-white/50
              transition
              hover:border-white/20
              hover:text-white
            "
          >
            Voir les{" "}
            {pendingCount} demandes
          </Link>
        )}
      </section>

      <section className="mt-10">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/30">
          Gestion
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardLink
            href="/gestion/rendez-vous"
            title="Rendez-vous"
            description="Gérer les demandes"
            icon={Scissors}
          />

          <DashboardLink
            href="/gestion/calendrier"
            title="Calendrier"
            description="Voir les rendez-vous"
            icon={CalendarDays}
          />

          <DashboardLink
            href="/gestion/planning"
            title="Planning"
            description="Horaires et absences"
            icon={Clock3}
          />

          <DashboardLink
            href="/gestion/parametres"
            title="Paramètres"
            description="Configurer le salon"
            icon={Settings}
          />
        </div>
      </section>
    </div>
  );
}

function EmptyPendingState() {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-5 sm:p-6">
      <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
        <Clock3 className="size-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-white">
        Aucune demande en attente
      </h3>

      <p className="mt-1.5 max-w-md text-sm leading-6 text-white/35">
        Les nouvelles demandes de
        rendez-vous apparaîtront ici.
      </p>
    </div>
  );
}

function DashboardLink({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        min-w-0
        touch-manipulation
        items-center
        gap-4
        rounded-2xl
        border
        border-white/10
        bg-surface
        p-4
        transition
        hover:border-white/20
        hover:bg-surface-hover
        active:scale-[0.99]
      "
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-brand">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-white/35">
          {description}
        </p>
      </div>

      <ChevronRight className="size-4 shrink-0 text-white/20 transition group-hover:translate-x-0.5 group-hover:text-brand" />
    </Link>
  );
}