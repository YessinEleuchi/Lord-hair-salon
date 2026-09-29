import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  pgTable,
  text,
  time,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

import { staff } from "./staff";

/**
 * Weekly working schedule.
 *
 * dayOfWeek:
 * 0 = Sunday
 * 1 = Monday
 * ...
 * 6 = Saturday
 */
export const workingHours = pgTable(
  "working_hours",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, {
        onDelete: "cascade",
      }),

    dayOfWeek: integer("day_of_week").notNull(),

    startTime: time("start_time").notNull(),

    endTime: time("end_time").notNull(),

    enabled: boolean("enabled").notNull().default(true),
  },

  (table) => [
    unique("working_hours_staff_day_unique").on(
      table.staffId,
      table.dayOfWeek,
    ),

    check(
      "working_hours_day_check",
      sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`,
    ),

    check(
      "working_hours_time_check",
      sql`${table.startTime} < ${table.endTime}`,
    ),
  ],
);

/**
 * Recurring weekly breaks.
 *
 * Example:
 * Monday 12:00 -> 13:00
 * Tuesday 12:30 -> 13:30
 *
 * Multiple breaks per day are allowed.
 */
export const staffBreaks = pgTable(
  "staff_breaks",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, {
        onDelete: "cascade",
      }),

    dayOfWeek: integer("day_of_week").notNull(),

    startTime: time("start_time").notNull(),

    endTime: time("end_time").notNull(),

    label: text("label"),

    enabled: boolean("enabled").notNull().default(true),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    check(
      "staff_breaks_day_check",
      sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`,
    ),

    check(
      "staff_breaks_time_check",
      sql`${table.startTime} < ${table.endTime}`,
    ),
  ],
);

/**
 * Exceptional periods during which the hairstylist
 * is unavailable.
 *
 * Examples:
 * - Vacation
 * - Personal appointment
 * - Medical absence
 * - Exceptional break
 * - Several days off
 */
export const timeOff = pgTable(
  "time_off",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, {
        onDelete: "cascade",
      }),

    startAt: timestamp("start_at", {
      withTimezone: true,
    }).notNull(),

    endAt: timestamp("end_at", {
      withTimezone: true,
    }).notNull(),

    reason: text("reason"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    check(
      "time_off_range_check",
      sql`${table.startAt} < ${table.endAt}`,
    ),
  ],
);

/**
 * Overrides the normal weekly schedule for one specific date.
 *
 * Examples:
 *
 * Normal Monday:
 * 09:00 -> 18:00
 *
 * Exceptional Monday:
 * 10:00 -> 14:00
 *
 * OR:
 *
 * isClosed = true
 */
export const scheduleOverrides = pgTable(
  "schedule_overrides",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, {
        onDelete: "cascade",
      }),

    date: date("date").notNull(),

    isClosed: boolean("is_closed").notNull().default(false),

    startTime: time("start_time"),

    endTime: time("end_time"),

    reason: text("reason"),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => [
    unique("schedule_override_staff_date_unique").on(
      table.staffId,
      table.date,
    ),

    check(
      "schedule_override_valid_check",
      sql`
        (
          ${table.isClosed} = true
          AND ${table.startTime} IS NULL
          AND ${table.endTime} IS NULL
        )
        OR
        (
          ${table.isClosed} = false
          AND ${table.startTime} IS NOT NULL
          AND ${table.endTime} IS NOT NULL
          AND ${table.startTime} < ${table.endTime}
        )
      `,
    ),
  ],
);