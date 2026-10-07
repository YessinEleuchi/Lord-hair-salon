import {
  and,
  asc,
  eq,
  gte,
  lt,
  ne,
} from "drizzle-orm";

import {
  db,
} from "@/db";

import {
  appointments,
  customers,
  scheduleOverrides,
  services,
  staff,
  staffBreaks,
  workingHours,
} from "@/db/schema";

const TIMEZONE = "Africa/Tunis";

function getDateParts(
  date: string,
) {
  const [year, month, day] =
    date.split("-").map(Number);

  return {
    year,
    month,
    day,
  };
}

function getDayRange(
  date: string,
) {
  const {
    year,
    month,
    day,
  } = getDateParts(date);

  const start = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      -1,
      0,
      0,
    ),
  );

  const end = new Date(
    Date.UTC(
      year,
      month - 1,
      day + 1,
      -1,
      0,
      0,
    ),
  );

  return {
    start,
    end,
  };
}

function getDayOfWeek(
  date: string,
) {
  const {
    year,
    month,
    day,
  } = getDateParts(date);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  ).getUTCDay();
}

function normalizeTime(
  value: string | null,
) {
  return value
    ? value.slice(0, 5)
    : null;
}

export async function getCalendarDay(
  date: string,
) {
  const dayOfWeek =
    getDayOfWeek(date);

  const {
    start,
    end,
  } = getDayRange(date);

  const [activeStaff] =
    await db
      .select({
        id: staff.id,
        name: staff.name,
      })
      .from(staff)
      .where(
        eq(
          staff.active,
          true,
        ),
      )
      .orderBy(
        asc(staff.position),
      )
      .limit(1);

  if (!activeStaff) {
    return {
      date,
      timezone: TIMEZONE,
      staff: null,
      workingDay: null,
      override: null,
      breaks: [],
      appointments: [],
    };
  }

  const [
    weeklyHours,
    override,
    breaks,
    dayAppointments,
  ] = await Promise.all([
    db
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
            activeStaff.id,
          ),
          eq(
            workingHours.dayOfWeek,
            dayOfWeek,
          ),
        ),
      )
      .limit(1),

    db
      .select({
        id:
          scheduleOverrides.id,
        isClosed:
          scheduleOverrides.isClosed,
        startTime:
          scheduleOverrides.startTime,
        endTime:
          scheduleOverrides.endTime,
        reason:
          scheduleOverrides.reason,
      })
      .from(
        scheduleOverrides,
      )
      .where(
        and(
          eq(
            scheduleOverrides.staffId,
            activeStaff.id,
          ),
          eq(
            scheduleOverrides.date,
            date,
          ),
        ),
      )
      .limit(1),

    db
      .select({
        id:
          staffBreaks.id,
        startTime:
          staffBreaks.startTime,
        endTime:
          staffBreaks.endTime,
        label:
          staffBreaks.label,
      })
      .from(
        staffBreaks,
      )
      .where(
        and(
          eq(
            staffBreaks.staffId,
            activeStaff.id,
          ),
          eq(
            staffBreaks.dayOfWeek,
            dayOfWeek,
          ),
          eq(
            staffBreaks.enabled,
            true,
          ),
        ),
      )
      .orderBy(
        asc(
          staffBreaks.startTime,
        ),
      ),

    db
      .select({
        id:
          appointments.id,
        startAt:
          appointments.startAt,
        endAt:
          appointments.endAt,
        blockedUntil:
          appointments.blockedUntil,
        price:
          appointments.price,
        status:
          appointments.status,
        cancelledAt:
          appointments.cancelledAt,
        cancellationReason:
          appointments.cancellationReason,

        customer: {
          id:
            customers.id,
          name:
            customers.name,
          phone:
            customers.phone,
        },

        service: {
          id:
            services.id,
          name:
            services.name,
          durationMinutes:
            services.durationMinutes,
        },

        staff: {
          id:
            staff.id,
          name:
            staff.name,
        },
      })
      .from(
        appointments,
      )
      .innerJoin(
        customers,
        eq(
          appointments.customerId,
          customers.id,
        ),
      )
      .innerJoin(
        services,
        eq(
          appointments.serviceId,
          services.id,
        ),
      )
      .innerJoin(
        staff,
        eq(
          appointments.staffId,
          staff.id,
        ),
      )
      .where(
        and(
          eq(
            appointments.staffId,
            activeStaff.id,
          ),
          gte(
            appointments.startAt,
            start,
          ),
          lt(
            appointments.startAt,
            end,
          ),
        ),
      )
      .orderBy(
        asc(
          appointments.startAt,
        ),
      ),
  ]);

  const weekly =
    weeklyHours[0] ?? null;

  const special =
    override[0] ?? null;

  let workingDay:
    | {
        enabled: boolean;
        startTime: string | null;
        endTime: string | null;
      }
    | null = null;

  if (special) {
    workingDay = {
      enabled:
        !special.isClosed,
      startTime:
        normalizeTime(
          special.startTime,
        ),
      endTime:
        normalizeTime(
          special.endTime,
        ),
    };
  } else if (weekly) {
    workingDay = {
      enabled:
        weekly.enabled,
      startTime:
        normalizeTime(
          weekly.startTime,
        ),
      endTime:
        normalizeTime(
          weekly.endTime,
        ),
    };
  }

  return {
    date,
    timezone: TIMEZONE,

    staff: activeStaff,

    workingDay,

    override: special
      ? {
          id:
            special.id,
          isClosed:
            special.isClosed,
          startTime:
            normalizeTime(
              special.startTime,
            ),
          endTime:
            normalizeTime(
              special.endTime,
            ),
          reason:
            special.reason,
        }
      : null,

    breaks:
      breaks.map(
        (item) => ({
          ...item,
          startTime:
            item.startTime.slice(
              0,
              5,
            ),
          endTime:
            item.endTime.slice(
              0,
              5,
            ),
        }),
      ),

    appointments:
      dayAppointments,
  };
}

export async function getCalendarMonth(
  year: number,
  month: number,
) {
  const startDate =
    `${year}-${String(month).padStart(2, "0")}-01`;

  const nextMonth =
    month === 12
      ? {
          year: year + 1,
          month: 1,
        }
      : {
          year,
          month: month + 1,
        };

  const endDate =
    `${nextMonth.year}-${String(
      nextMonth.month,
    ).padStart(2, "0")}-01`;

  const start =
    new Date(
      `${startDate}T00:00:00+01:00`,
    );

  const end =
    new Date(
      `${endDate}T00:00:00+01:00`,
    );

  const rows =
    await db
      .select({
        startAt:
          appointments.startAt,
        status:
          appointments.status,
      })
      .from(appointments)
      .where(
        and(
          gte(
            appointments.startAt,
            start,
          ),
          lt(
            appointments.startAt,
            end,
          ),
          ne(
            appointments.status,
            "CANCELLED",
          ),
        ),
      )
      .orderBy(
        asc(
          appointments.startAt,
        ),
      );

  const counts =
    new Map<string, number>();

  for (const row of rows) {
    const date =
      new Intl.DateTimeFormat(
        "en-CA",
        {
          timeZone:
            "Africa/Tunis",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        },
      ).format(row.startAt);

    counts.set(
      date,
      (counts.get(date) ?? 0) +
        1,
    );
  }

  return Array.from(
    counts.entries(),
  ).map(
    ([date, count]) => ({
      date,
      count,
    }),
  );
}

export type CalendarDayData =
  Awaited<
    ReturnType<
      typeof getCalendarDay
    >
  >;