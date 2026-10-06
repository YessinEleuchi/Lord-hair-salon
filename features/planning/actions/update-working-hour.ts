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
  staff,
  staffBreaks,
  workingHours,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/features/admin/auth/require-admin";

export type PlanningActionResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

const TIME_REGEX =
  /^([01]\d|2[0-3]):[0-5]\d$/;

type UpdateWorkingDayInput = {
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

export async function updateWorkingDay(
  input: UpdateWorkingDayInput,
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

  if (
    !Number.isInteger(
      input.dayOfWeek,
    ) ||
    input.dayOfWeek < 0 ||
    input.dayOfWeek > 6
  ) {
    return {
      success: false,
      message:
        "Jour invalide.",
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
        "Les horaires sont invalides.",
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

  try {
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
    // Vérifier les pauses seulement
    // si la journée reste ouverte.
    // ─────────────────────────────

    if (input.enabled) {
      const breaks =
        await db
          .select({
            startTime:
              staffBreaks.startTime,

            endTime:
              staffBreaks.endTime,
          })
          .from(staffBreaks)
          .where(
            and(
              eq(
                staffBreaks.staffId,
                input.staffId,
              ),

              eq(
                staffBreaks.dayOfWeek,
                input.dayOfWeek,
              ),

              eq(
                staffBreaks.enabled,
                true,
              ),
            ),
          );

      const invalidBreak =
        breaks.find(
          (breakItem) =>
            breakItem.startTime <
              input.startTime ||
            breakItem.endTime >
              input.endTime,
        );

      if (invalidBreak) {
        return {
          success: false,
          message:
            `La pause ${invalidBreak.startTime.slice(0, 5)}–${invalidBreak.endTime.slice(0, 5)} est en dehors des nouveaux horaires. Modifiez ou supprimez cette pause d'abord.`,
        };
      }
    }

    await db
      .insert(workingHours)
      .values({
        staffId:
          input.staffId,

        dayOfWeek:
          input.dayOfWeek,

        startTime:
          input.startTime,

        endTime:
          input.endTime,

        enabled:
          input.enabled,
      })
      .onConflictDoUpdate({
        target: [
          workingHours.staffId,
          workingHours.dayOfWeek,
        ],

        set: {
          startTime:
            input.startTime,

          endTime:
            input.endTime,

          enabled:
            input.enabled,
        },
      });

    revalidatePlanning();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Update working day:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible d'enregistrer cette journée.",
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