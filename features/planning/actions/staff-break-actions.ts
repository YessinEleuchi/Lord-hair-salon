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
  staffBreaks,
  workingHours,
} from "@/db/schema";

import {
  requireAdmin,
} from "@/features/admin/auth/require-admin";

import type {
  PlanningActionResult,
} from "./update-working-hour";

const TIME_REGEX =
  /^([01]\d|2[0-3]):[0-5]\d$/;

type BreakInput = {
  staffId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  label?: string;
};

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createStaffBreak(
  input: BreakInput,
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

  const validation =
    await validateBreak(input);

  if (!validation.success) {
    return validation;
  }

  try {
    await db
      .insert(staffBreaks)
      .values({
        staffId:
          input.staffId,

        dayOfWeek:
          input.dayOfWeek,

        startTime:
          input.startTime,

        endTime:
          input.endTime,

        label:
          input.label?.trim() ||
          "Pause",

        enabled: true,
      });

    revalidatePlanning();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Create staff break:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible d'ajouter la pause.",
    };
  }
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updateStaffBreak(
  breakId: string,
  input: BreakInput,
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

  // IMPORTANT :
  // on transmet breakId pour que
  // la pause ne se compare pas à elle-même.
  const validation =
    await validateBreak(
      input,
      breakId,
    );

  if (!validation.success) {
    return validation;
  }

  try {
    const [updated] =
      await db
        .update(staffBreaks)
        .set({
          startTime:
            input.startTime,

          endTime:
            input.endTime,

          label:
            input.label?.trim() ||
            "Pause",
        })
        .where(
          and(
            eq(
              staffBreaks.id,
              breakId,
            ),

            eq(
              staffBreaks.staffId,
              input.staffId,
            ),
          ),
        )
        .returning({
          id: staffBreaks.id,
        });

    if (!updated) {
      return {
        success: false,
        message:
          "Cette pause n'existe plus.",
      };
    }

    revalidatePlanning();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Update staff break:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible de modifier la pause.",
    };
  }
}

// ─────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────

export async function deleteStaffBreak(
  breakId: string,
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
        .delete(staffBreaks)
        .where(
          eq(
            staffBreaks.id,
            breakId,
          ),
        )
        .returning({
          id: staffBreaks.id,
        });

    if (!deleted) {
      return {
        success: false,
        message:
          "Cette pause n'existe plus.",
      };
    }

    revalidatePlanning();

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Delete staff break:",
      error,
    );

    return {
      success: false,
      message:
        "Impossible de supprimer la pause.",
    };
  }
}

// ─────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────

async function validateBreak(
  input: BreakInput,
  currentBreakId?: string,
): Promise<PlanningActionResult> {
  // 1. Jour valide

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

  // 2. Format HH:mm

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
        "Horaires de pause invalides.",
    };
  }

  // 3. Début < fin

  if (
    input.startTime >=
    input.endTime
  ) {
    return {
      success: false,
      message:
        "La fin de la pause doit être après son début.",
    };
  }

  // 4. Récupérer la journée de travail

  const [workingDay] =
    await db
      .select({
        startTime:
          workingHours.startTime,

        endTime:
          workingHours.endTime,

        enabled:
          workingHours.enabled,
      })
      .from(workingHours)
      .where(
        and(
          eq(
            workingHours.staffId,
            input.staffId,
          ),

          eq(
            workingHours.dayOfWeek,
            input.dayOfWeek,
          ),
        ),
      )
      .limit(1);

  // 5. Impossible d'avoir une pause
  // sur une journée fermée

  if (
    !workingDay ||
    !workingDay.enabled
  ) {
    return {
      success: false,
      message:
        "Impossible d'ajouter une pause sur un jour fermé.",
    };
  }

  // PostgreSQL time peut être HH:mm:ss.
  const workingStart =
    workingDay.startTime.slice(
      0,
      5,
    );

  const workingEnd =
    workingDay.endTime.slice(
      0,
      5,
    );

  // 6. La pause doit rester
  // dans les horaires de travail

  if (
    input.startTime <
      workingStart ||
    input.endTime >
      workingEnd
  ) {
    return {
      success: false,
      message:
        `La pause doit être comprise entre ${workingStart} et ${workingEnd}.`,
    };
  }

  // 7. Récupérer les autres pauses
  // actives de cette journée

  const existingBreaks =
    await db
      .select({
        id:
          staffBreaks.id,

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

  // 8. Vérifier les chevauchements

  const overlappingBreak =
    existingBreaks.find(
      (existing) => {
        // Lors d'une modification,
        // ignorer la pause elle-même.
        if (
          currentBreakId &&
          existing.id ===
            currentBreakId
        ) {
          return false;
        }

        const existingStart =
          existing.startTime.slice(
            0,
            5,
          );

        const existingEnd =
          existing.endTime.slice(
            0,
            5,
          );

        return (
          input.startTime <
            existingEnd &&
          input.endTime >
            existingStart
        );
      },
    );

  if (overlappingBreak) {
    return {
      success: false,

      message:
        `Cette pause chevauche une pause existante (${overlappingBreak.startTime.slice(0, 5)}–${overlappingBreak.endTime.slice(0, 5)}).`,
    };
  }

  return {
    success: true,
  };
}

// ─────────────────────────────────────────────
// REVALIDATION
// ─────────────────────────────────────────────

function revalidatePlanning() {
  revalidatePath(
    "/gestion/planning",
  );

  revalidatePath(
    "/booking",
  );
}