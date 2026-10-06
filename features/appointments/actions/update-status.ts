"use server";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  revalidatePath,
} from "next/cache";

import {
  db,
} from "@/db";

import {
  appointments,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/features/admin/auth/require-admin";

export type AppointmentActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

export async function confirmAppointment(
  appointmentId: string,
): Promise<AppointmentActionResult> {
  const admin =
    await requireAdmin();

  if (!admin) {
    return {
      success: false,
      message:
        "Vous devez être connecté.",
    };
  }

  try {
    const [appointment] =
      await db
        .update(appointments)
        .set({
          status: "CONFIRMED",
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(
              appointments.id,
              appointmentId,
            ),
            eq(
              appointments.status,
              "PENDING",
            ),
          ),
        )
        .returning({
          id: appointments.id,
        });

    if (!appointment) {
      return {
        success: false,
        message:
          "Ce rendez-vous n'est plus en attente.",
      };
    }

    revalidateAppointmentPages();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Confirm appointment error:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible de confirmer le rendez-vous.",
    };
  }
}

export async function cancelAppointment(
  appointmentId: string,
): Promise<AppointmentActionResult> {
  const admin =
    await requireAdmin();

  if (!admin) {
    return {
      success: false,
      message:
        "Vous devez être connecté.",
    };
  }

  try {
    const now = new Date();

    const [appointment] =
      await db
        .update(appointments)
        .set({
          status: "CANCELLED",
          cancelledAt: now,
          cancellationReason:
            "Refusé par le salon",
          updatedAt: now,
        })
        .where(
          and(
            eq(
              appointments.id,
              appointmentId,
            ),
            eq(
              appointments.status,
              "PENDING",
            ),
          ),
        )
        .returning({
          id: appointments.id,
        });

    if (!appointment) {
      return {
        success: false,
        message:
          "Ce rendez-vous n'est plus en attente.",
      };
    }

    revalidateAppointmentPages();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Cancel appointment error:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible de refuser le rendez-vous.",
    };
  }
}

function revalidateAppointmentPages() {
  revalidatePath("/gestion");
  revalidatePath(
    "/gestion/rendez-vous",
  );
  revalidatePath(
    "/gestion/calendrier",
  );
}