import {
  NotificationBell,
} from "@/components/admin/notifications/notification-bell";

import {
  getPendingAppointments,
} from "@/features/appointments/queries";

export async function GestionHeader() {
  const pendingAppointments =
    await getPendingAppointments();

  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-white/10
        bg-background/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          h-16
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-[-0.03em] text-white">
            THE LORD
          </p>

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand">
            Gestion
          </p>
        </div>

        <NotificationBell
          appointments={
            pendingAppointments
          }
        />
      </div>
    </header>
  );
}