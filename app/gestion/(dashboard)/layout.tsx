import type {
  ReactNode,
} from "react";

import {
  redirect,
} from "next/navigation";

import {
  GestionBottomNav,
} from "@/components/admin/bottom-nav";

import {
  CustomerNotificationModal,
} from "@/components/admin/customer-notification/customer-notification-modal";

import {
  CustomerNotificationProvider,
} from "@/components/admin/customer-notification/customer-notification-provider";

import {
  GestionHeader,
} from "@/components/admin/header";

import {
  PushNotificationManager,
} from "@/components/admin/notifications/push-notification-manager";

import {
  AppointmentRealtimeListener,
} from "@/components/admin/realtime/appointment-realtime-listener";

import {
  GestionSidebar,
} from "@/components/admin/sidebar";

import {
  createClient,
} from "@/lib/supabase/server";

export default async function GestionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/gestion/login");
  }

  return (
    <CustomerNotificationProvider>
      <div className="min-h-dvh bg-background text-white">
        <AppointmentRealtimeListener />

        <PushNotificationManager />

        <GestionSidebar />

        <div className="min-w-0 lg:pl-64">
          <GestionHeader />

          <main
            className="
              min-w-0
              px-4
              pb-24
              pt-6
              sm:px-6
              sm:pt-8
              lg:px-8
              lg:pb-10
            "
          >
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>

        <GestionBottomNav />

        <CustomerNotificationModal />
      </div>
    </CustomerNotificationProvider>
  );
}