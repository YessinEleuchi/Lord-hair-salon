import {
  asc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  scheduleOverrides,
  staff,
  staffBreaks,
  workingHours,
} from "@/db/schema";

function normalizeTime(
  value: string,
) {
  return value.slice(0, 5);
}

export async function getPlanningStaff() {
  return db
    .select({
      id: staff.id,
      name: staff.name,
    })
    .from(staff)
    .where(
      eq(staff.active, true),
    )
    .orderBy(
      asc(staff.position),
    );
}

export async function getStaffWorkingHours(
  staffId: string,
) {
  const rows =
    await db
      .select({
        id: workingHours.id,
        dayOfWeek:
          workingHours.dayOfWeek,
        startTime:
          workingHours.startTime,
        endTime:
          workingHours.endTime,
        enabled:
          workingHours.enabled,
      })
      .from(workingHours)
      .where(
        eq(
          workingHours.staffId,
          staffId,
        ),
      )
      .orderBy(
        asc(
          workingHours.dayOfWeek,
        ),
      );

  return rows.map(
    (row) => ({
      ...row,

      startTime:
        normalizeTime(
          row.startTime,
        ),

      endTime:
        normalizeTime(
          row.endTime,
        ),
    }),
  );
}

export async function getStaffBreaks(
  staffId: string,
) {
  const rows =
    await db
      .select({
        id: staffBreaks.id,

        dayOfWeek:
          staffBreaks.dayOfWeek,

        startTime:
          staffBreaks.startTime,

        endTime:
          staffBreaks.endTime,

        label:
          staffBreaks.label,

        enabled:
          staffBreaks.enabled,
      })
      .from(staffBreaks)
      .where(
        eq(
          staffBreaks.staffId,
          staffId,
        ),
      )
      .orderBy(
        asc(
          staffBreaks.dayOfWeek,
        ),
        asc(
          staffBreaks.startTime,
        ),
      );

  return rows.map(
    (row) => ({
      ...row,

      startTime:
        normalizeTime(
          row.startTime,
        ),

      endTime:
        normalizeTime(
          row.endTime,
        ),
    }),
  );}

  export async function getStaffScheduleOverrides(
  staffId: string,
) {
  const rows =
    await db
      .select({
        id:
          scheduleOverrides.id,

        date:
          scheduleOverrides.date,

        isClosed:
          scheduleOverrides.isClosed,

        startTime:
          scheduleOverrides.startTime,

        endTime:
          scheduleOverrides.endTime,

        reason:
          scheduleOverrides.reason,
      })
      .from(scheduleOverrides)
      .where(
        eq(
          scheduleOverrides.staffId,
          staffId,
        ),
      )
      .orderBy(
        asc(
          scheduleOverrides.date,
        ),
      );

  return rows.map(
    (row) => ({
      ...row,

      startTime:
        row.startTime
          ? row.startTime.slice(
              0,
              5,
            )
          : null,

      endTime:
        row.endTime
          ? row.endTime.slice(
              0,
              5,
            )
          : null,
    }),
  );
}