"use server";

import {
  and,
  eq,
} from "drizzle-orm";

import {
  revalidatePath,
} from "next/cache";

import { db } from "@/db";

import {
  scheduleOverrides,
  staff,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/features/admin/auth/require-admin";

import type {
  PlanningActionResult,
} from "./update-working-hour";

const DATE_REGEX =
  /^\d{4}-\d{2}-\d{2}$/;

const TIME_REGEX =
  /^([01]\d|2[0-3]):[0-5]\d$/;

type SaveScheduleOverrideInput = {
  staffId: string;

  date: string;

  isClosed: boolean;

  startTime?: string;

  endTime?: string;

  reason?: string;
};

export async function saveScheduleOverride(
  input: SaveScheduleOverrideInput,
): Promise<PlanningActionResult> {
  const admin =
    await requireAdmin();

  if (!admin) {
    return {
      success: false,
      message:
        "Vous devez être connecté.",
    };
  }

  // ─────────────────────────────
  // DATE
  // ─────────────────────────────

  if (
    !DATE_REGEX.test(
      input.date,
    )
  ) {
    return {
      success: false,
      message:
        "Date invalide.",
    };
  }

  // Empêche les dates impossibles
  // comme 2026-02-31.

  const [
    year,
    month,
    day,
  ] = input.date
    .split("-")
    .map(Number);

  const parsedDate =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
      ),
    );

  if (
    parsedDate.getUTCFullYear() !==
      year ||
    parsedDate.getUTCMonth() !==
      month - 1 ||
    parsedDate.getUTCDate() !==
      day
  ) {
    return {
      success: false,
      message:
        "Date invalide.",
    };
  }

  // ─────────────────────────────
  // STAFF
  // ─────────────────────────────

  const [existingStaff] =
    await db
      .select({
        id: staff.id,
      })
      .from(staff)
      .where(
        and(
          eq(
            staff.id,
            input.staffId,
          ),

          eq(
            staff.active,
            true,
          ),
        ),
      )
      .limit(1);

  if (!existingStaff) {
    return {
      success: false,
      message:
        "Coiffeur introuvable.",
    };
  }

  // ─────────────────────────────
  // HOURS
  // ─────────────────────────────

  let startTime:
    | string
    | null = null;

  let endTime:
    | string
    | null = null;

  if (!input.isClosed) {
    if (
      !input.startTime ||
      !input.endTime
    ) {
      return {
        success: false,
        message:
          "Les horaires sont obligatoires.",
      };
    }

    if (
      !TIME_REGEX.test(
        input.startTime,
      ) ||
      !TIME_REGEX.test(
        input.endTime,
      )
    ) {
      return {
        success: false,
        message:
          "Horaires invalides.",
      };
    }

    if (
      input.startTime >=
      input.endTime
    ) {
      return {
        success: false,
        message:
          "L'heure de fin doit être après l'heure de début.",
      };
    }

    startTime =
      input.startTime;

    endTime =
      input.endTime;
  }

  try {
    await db
      .insert(
        scheduleOverrides,
      )
      .values({
        staffId:
          input.staffId,

        date:
          input.date,

        isClosed:
          input.isClosed,

        startTime,

        endTime,

        reason:
          input.reason
            ?.trim() ||
          null,

        updatedAt:
          new Date(),
      })
      .onConflictDoUpdate({
        target: [
          scheduleOverrides.staffId,
          scheduleOverrides.date,
        ],

        set: {
          isClosed:
            input.isClosed,

          startTime,

          endTime,

          reason:
            input.reason
              ?.trim() ||
            null,

          updatedAt:
            new Date(),
        },
      });

    revalidatePlanning();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Save schedule override:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible d'enregistrer cette exception.",
    };
  }
}

export async function deleteScheduleOverride(
  overrideId: string,
): Promise<PlanningActionResult> {
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
    const [deleted] =
      await db
        .delete(
          scheduleOverrides,
        )
        .where(
          eq(
            scheduleOverrides.id,
            overrideId,
          ),
        )
        .returning({
          id:
            scheduleOverrides.id,
        });

    if (!deleted) {
      return {
        success: false,
        message:
          "Cette exception n'existe plus.",
      };
    }

    revalidatePlanning();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Delete schedule override:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible de supprimer cette exception.",
    };
  }
}

function revalidatePlanning() {
  revalidatePath(
    "/gestion/planning",
  );

  revalidatePath(
    "/booking",
  );
}