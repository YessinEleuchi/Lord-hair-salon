import { sql } from "drizzle-orm";

import {
  check,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { appointmentStatusEnum } from "./enums";
import { customers } from "./customers";
import { services } from "./services";
import { staff } from "./staff";

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, {
        onDelete: "restrict",
      }),

    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, {
        onDelete: "restrict",
      }),

    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, {
        onDelete: "restrict",
      }),

    startAt: timestamp("start_at", {
      withTimezone: true,
    }).notNull(),

    // Actual end of the service
    endAt: timestamp("end_at", {
      withTimezone: true,
    }).notNull(),

    // End of the reserved period including service buffer
    blockedUntil: timestamp("blocked_until", {
      withTimezone: true,
    }).notNull(),

    // Price at the moment the booking was created
    price: numeric("price", {
      precision: 10,
      scale: 2,
    }).notNull(),

    status: appointmentStatusEnum("status")
      .notNull()
      .default("PENDING"),

    internalNotes: text("internal_notes"),

    cancelledAt: timestamp("cancelled_at", {
      withTimezone: true,
    }),

    cancellationReason: text("cancellation_reason"),

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
      "appointments_time_range_check",
      sql`
        ${table.startAt} < ${table.endAt}
        AND ${table.endAt} <= ${table.blockedUntil}
      `,
    ),

    check(
      "appointments_price_check",
      sql`${table.price} >= 0`,
    ),

    index("appointments_staff_start_idx").on(
      table.staffId,
      table.startAt,
    ),

    index("appointments_customer_idx").on(
      table.customerId,
    ),

    index("appointments_status_idx").on(
      table.status,
    ),

    index("appointments_start_idx").on(
      table.startAt,
    ),
  ],
);