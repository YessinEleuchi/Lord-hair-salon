"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function AppointmentRealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("gestion-appointments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
        },
        (payload) => {
          console.log(
            "[Realtime] Appointment changed:",
            payload.eventType,
          );

          router.refresh();
        },
      )
      .subscribe((status) => {
        console.log(
          "[Realtime] status:",
          status,
        );
      });

    return () => {
      void supabase.removeChannel(
        channel,
      );
    };
  }, [router]);

  return null;
}