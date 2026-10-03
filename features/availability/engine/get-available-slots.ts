import { TZDate } from "@date-fns/tz";

import {
  and,
  eq,
  gt,
  inArray,
  lt,
} from "drizzle-orm";

import { db } from "@/db";

import {
  appointments,
  salonSettings,
  scheduleOverrides,
  services,
  staff,
  staffBreaks,
  staffServices,
  timeOff,
  workingHours,
} from "@/db/schema";

import type {
  AvailabilityResult,
  AvailabilitySession,
  AvailableSlot,
} from "./availability.types";

import {
  clamp,
  getDayOfWeek,
  minutesToTime,
  rangesOverlap,
  timeToMinutes,
  type MinuteRange,
} from "./time-utils";

type GetAvailableSlotsInput = {
  staffId: string;
  serviceId: string;

  /**
   * Salon-local date.
   *
   * YYYY-MM-DD
   *
   * Example:
   * 2026-09-30
   */
  date: string;
};

export async function getAvailableSlots({
  staffId,
  serviceId,
  date,
}: GetAvailableSlotsInput): Promise<AvailabilityResult> {
  // ─────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────

  const [settings] = await db
    .select()
    .from(salonSettings)
    .limit(1);

  if (!settings) {
    throw new Error("Salon settings not found");
  }

  // ─────────────────────────────────────────────
  // STAFF
  // ─────────────────────────────────────────────

  const [selectedStaff] = await db
    .select()
    .from(staff)
    .where(
      and(
        eq(staff.id, staffId),
        eq(staff.active, true),
      ),
    )
    .limit(1);

  if (!selectedStaff) {
    throw new Error("Staff not found");
  }

  // ─────────────────────────────────────────────
  // SERVICE
  // ─────────────────────────────────────────────

  const [selectedService] = await db
    .select()
    .from(services)
    .where(
      and(
        eq(services.id, serviceId),
        eq(services.active, true),
      ),
    )
    .limit(1);

  if (!selectedService) {
    throw new Error("Service not found");
  }

  // ─────────────────────────────────────────────
  // STAFF ↔ SERVICE
  //
  // The selected hairstylist must actually
  // provide this service.
  // ─────────────────────────────────────────────

  const [staffService] = await db
    .select({
      staffId: staffServices.staffId,
    })
    .from(staffServices)
    .where(
      and(
        eq(staffServices.staffId, staffId),
        eq(staffServices.serviceId, serviceId),
      ),
    )
    .limit(1);

  if (!staffService) {
    throw new Error(
      "This service is not available for the selected staff member",
    );
  }

  // ─────────────────────────────────────────────
  // BOOKING DISABLED
  // ─────────────────────────────────────────────

  if (!settings.bookingEnabled) {
    return createEmptyResult({
      date,
      timezone: settings.timezone,
      staff: selectedStaff,
      service: selectedService,
    });
  }

  // ─────────────────────────────────────────────
  // CURRENT SALON DATE / TIME
  //
  // Important:
  // Never trust the UI alone to prevent booking
  // dates or times that have already passed.
  // ─────────────────────────────────────────────

  const now = new TZDate(
    new Date(),
    settings.timezone,
  );

  const today =
    `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, "0")}-${String(
      now.getDate(),
    ).padStart(2, "0")}`;

  const isToday = date === today;

  const currentMinutes =
    now.getHours() * 60 +
    now.getMinutes();

  // A past date must never expose availability.
  //
  // YYYY-MM-DD can safely be compared
  // lexicographically because the format is
  // year -> month -> day.
  if (date < today) {
    return createEmptyResult({
      date,
      timezone: settings.timezone,
      staff: selectedStaff,
      service: selectedService,
    });
  }

  const dayOfWeek = getDayOfWeek(date);

  // ─────────────────────────────────────────────
  // NORMAL WORKING HOURS
  // ─────────────────────────────────────────────

  const [normalHours] = await db
    .select()
    .from(workingHours)
    .where(
      and(
        eq(workingHours.staffId, staffId),
        eq(workingHours.dayOfWeek, dayOfWeek),
        eq(workingHours.enabled, true),
      ),
    )
    .limit(1);

  // ─────────────────────────────────────────────
  // DATE-SPECIFIC OVERRIDE
  //
  // An override completely replaces the normal
  // weekly schedule for that date.
  // ─────────────────────────────────────────────

  const [override] = await db
    .select()
    .from(scheduleOverrides)
    .where(
      and(
        eq(scheduleOverrides.staffId, staffId),
        eq(scheduleOverrides.date, date),
      ),
    )
    .limit(1);

  if (override?.isClosed) {
    return createEmptyResult({
      date,
      timezone: settings.timezone,
      staff: selectedStaff,
      service: selectedService,
    });
  }

  let workStart: number;
  let workEnd: number;

  if (override) {
    if (!override.startTime || !override.endTime) {
      return createEmptyResult({
        date,
        timezone: settings.timezone,
        staff: selectedStaff,
        service: selectedService,
      });
    }

    workStart = timeToMinutes(
      override.startTime,
    );

    workEnd = timeToMinutes(
      override.endTime,
    );
  } else {
    if (!normalHours) {
      return createEmptyResult({
        date,
        timezone: settings.timezone,
        staff: selectedStaff,
        service: selectedService,
      });
    }

    workStart = timeToMinutes(
      normalHours.startTime,
    );

    workEnd = timeToMinutes(
      normalHours.endTime,
    );
  }

  // ─────────────────────────────────────────────
  // RECURRING BREAKS
  // ─────────────────────────────────────────────

  const recurringBreakRows = await db
    .select()
    .from(staffBreaks)
    .where(
      and(
        eq(staffBreaks.staffId, staffId),
        eq(
          staffBreaks.dayOfWeek,
          dayOfWeek,
        ),
        eq(staffBreaks.enabled, true),
      ),
    );

  const breakRanges: MinuteRange[] =
    recurringBreakRows.map((item) => ({
      start: timeToMinutes(
        item.startTime,
      ),
      end: timeToMinutes(
        item.endTime,
      ),
    }));

  // ─────────────────────────────────────────────
  // LOCAL DAY BOUNDARIES
  // ─────────────────────────────────────────────

  const [year, month, day] = date
    .split("-")
    .map(Number);

  const dayStart = new TZDate(
    year,
    month - 1,
    day,
    0,
    0,
    0,
    0,
    settings.timezone,
  );

  const nextDayStart = new TZDate(
    year,
    month - 1,
    day + 1,
    0,
    0,
    0,
    0,
    settings.timezone,
  );

  // ─────────────────────────────────────────────
  // TIME OFF
  // ─────────────────────────────────────────────

  const timeOffRows = await db
    .select()
    .from(timeOff)
    .where(
      and(
        eq(timeOff.staffId, staffId),

        // [startAt, endAt) overlaps requested day
        lt(
          timeOff.startAt,
          nextDayStart,
        ),

        gt(
          timeOff.endAt,
          dayStart,
        ),
      ),
    );

  const timeOffRanges: MinuteRange[] =
    timeOffRows.map((item) => {
      const effectiveStart =
        item.startAt < dayStart
          ? 0
          : dateToMinutes(
              item.startAt,
              settings.timezone,
            );

      const effectiveEnd =
        item.endAt >= nextDayStart
          ? 24 * 60
          : dateToMinutes(
              item.endAt,
              settings.timezone,
            );

      return {
        start: clamp(
          effectiveStart,
          0,
          24 * 60,
        ),

        end: clamp(
          effectiveEnd,
          0,
          24 * 60,
        ),
      };
    });

  // ─────────────────────────────────────────────
  // EXISTING APPOINTMENTS
  //
  // Only appointments that currently reserve
  // capacity block slots.
  // ─────────────────────────────────────────────

  const appointmentRows = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(
          appointments.staffId,
          staffId,
        ),

        inArray(
          appointments.status,
          [
            "PENDING",
            "CONFIRMED",
          ],
        ),

        lt(
          appointments.startAt,
          nextDayStart,
        ),

        gt(
          appointments.blockedUntil,
          dayStart,
        ),
      ),
    );

  const appointmentRanges: MinuteRange[] =
    appointmentRows.map(
      (appointment) => {
        const effectiveStart =
          appointment.startAt <
          dayStart
            ? 0
            : dateToMinutes(
                appointment.startAt,
                settings.timezone,
              );

        const effectiveEnd =
          appointment.blockedUntil >=
          nextDayStart
            ? 24 * 60
            : dateToMinutes(
                appointment.blockedUntil,
                settings.timezone,
              );

        return {
          start: effectiveStart,
          end: effectiveEnd,
        };
      },
    );

  // ─────────────────────────────────────────────
  // GENERATE CANDIDATE SLOTS
  // ─────────────────────────────────────────────

  const duration =
    selectedService.durationMinutes;

  const buffer =
    selectedService.bufferMinutes;

  const interval =
    settings.slotIntervalMinutes;

  const slots: AvailableSlot[] = [];

  for (
    let candidateStart = workStart;
    candidateStart < workEnd;
    candidateStart += interval
  ) {
    // ───────────────────────────────────────────
    // PAST / CURRENT SLOT
    //
    // When booking for today, do not expose a
    // slot whose start time has already passed
    // or is exactly the current minute.
    // ───────────────────────────────────────────

    if (
      isToday &&
      candidateStart <= currentMinutes
    ) {
      continue;
    }

    const serviceEnd =
      candidateStart + duration;

    const blockedUntil =
      serviceEnd + buffer;

    // Service + buffer must fit completely
    // inside working hours.
    if (blockedUntil > workEnd) {
      continue;
    }

    // Recurring staff breaks
    if (
      overlapsAny(
        candidateStart,
        blockedUntil,
        breakRanges,
      )
    ) {
      continue;
    }

    // Time off
    if (
      overlapsAny(
        candidateStart,
        blockedUntil,
        timeOffRanges,
      )
    ) {
      continue;
    }

    // Existing appointments
    if (
      overlapsAny(
        candidateStart,
        blockedUntil,
        appointmentRanges,
      )
    ) {
      continue;
    }

    slots.push({
      start:
        minutesToTime(
          candidateStart,
        ),

      end:
        minutesToTime(
          serviceEnd,
        ),

      blockedUntil:
        minutesToTime(
          blockedUntil,
        ),
    });
  }

  // ─────────────────────────────────────────────
  // BUILD DISPLAY SESSIONS
  // ─────────────────────────────────────────────

  const sessions = buildSessions({
    workStart,
    workEnd,
    breakRanges,
    slots,
  });

  return {
    date,
    timezone: settings.timezone,

    available:
      slots.length > 0,

    staff: {
      id: selectedStaff.id,
      name: selectedStaff.name,
    },

    service: {
      id: selectedService.id,
      name: selectedService.name,

      durationMinutes:
        selectedService.durationMinutes,

      bufferMinutes:
        selectedService.bufferMinutes,
    },

    sessions,
  };
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function overlapsAny(
  start: number,
  end: number,
  ranges: MinuteRange[],
): boolean {
  return ranges.some((range) =>
    rangesOverlap(
      start,
      end,
      range.start,
      range.end,
    ),
  );
}

function dateToMinutes(
  value: Date,
  timezone: string,
): number {
  const local = new TZDate(
    value,
    timezone,
  );

  return (
    local.getHours() * 60 +
    local.getMinutes()
  );
}

function createEmptyResult({
  date,
  timezone,
  staff,
  service,
}: {
  date: string;
  timezone: string;

  staff: {
    id: string;
    name: string;
  };

  service: {
    id: string;
    name: string;
    durationMinutes: number;
    bufferMinutes: number;
  };
}): AvailabilityResult {
  return {
    date,
    timezone,

    available: false,

    staff: {
      id: staff.id,
      name: staff.name,
    },

    service: {
      id: service.id,
      name: service.name,

      durationMinutes:
        service.durationMinutes,

      bufferMinutes:
        service.bufferMinutes,
    },

    sessions: [],
  };
}

function buildSessions({
  workStart,
  workEnd,
  breakRanges,
  slots,
}: {
  workStart: number;
  workEnd: number;
  breakRanges: MinuteRange[];
  slots: AvailableSlot[];
}): AvailabilitySession[] {
  /*
   * For the UI we use the longest break as
   * the separator between morning/afternoon.
   *
   * Example:
   *
   * Working: 09:00 -> 18:00
   * Break:   13:00 -> 14:00
   *
   * Morning:   09:00 -> 13:00
   * Afternoon: 14:00 -> 18:00
   */

  const mainBreak = [
    ...breakRanges,
  ]
    .filter(
      (range) =>
        range.start > workStart &&
        range.end < workEnd,
    )
    .sort(
      (a, b) =>
        b.end -
        b.start -
        (a.end - a.start),
    )[0];

  if (!mainBreak) {
    return [
      {
        type:
          workStart < 12 * 60
            ? "MORNING"
            : "AFTERNOON",

        start:
          minutesToTime(
            workStart,
          ),

        end:
          minutesToTime(
            workEnd,
          ),

        slots,
      },
    ];
  }

  const morningSlots =
    slots.filter(
      (slot) =>
        timeToMinutes(
          slot.start,
        ) < mainBreak.start,
    );

  const afternoonSlots =
    slots.filter(
      (slot) =>
        timeToMinutes(
          slot.start,
        ) >= mainBreak.end,
    );

  const sessions:
    AvailabilitySession[] = [];

  if (
    workStart <
    mainBreak.start
  ) {
    sessions.push({
      type: "MORNING",

      start:
        minutesToTime(
          workStart,
        ),

      end:
        minutesToTime(
          mainBreak.start,
        ),

      slots: morningSlots,
    });
  }

  if (
    mainBreak.end <
    workEnd
  ) {
    sessions.push({
      type: "AFTERNOON",

      start:
        minutesToTime(
          mainBreak.end,
        ),

      end:
        minutesToTime(
          workEnd,
        ),

      slots: afternoonSlots,
    });
  }

  return sessions;
}