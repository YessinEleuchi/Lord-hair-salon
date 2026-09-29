import { sql } from "drizzle-orm";

import {
  boolean,
  check,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const salonSettings = pgTable(
  "salon_settings",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // General information
    name: text("name").notNull(),

    description: text("description"),

    // Contact
    phone: text("phone"),
    whatsapp: text("whatsapp"),
    email: text("email"),

    // Location
    address: text("address"),
    city: text("city"),

    // Social networks
    instagramUrl: text("instagram_url"),
    tiktokUrl: text("tiktok_url"),
    facebookUrl: text("facebook_url"),

    // Booking configuration
    bookingEnabled: boolean("booking_enabled")
      .notNull()
      .default(true),

    // If false:
    // booking -> PENDING -> manual confirmation
    //
    // If true:
    // booking -> CONFIRMED
    autoConfirmAppointments: boolean("auto_confirm_appointments")
      .notNull()
      .default(false),

    // Interval between proposed appointment start times.
    //
    // Example:
    // 09:00
    // 09:30
    // 10:00
    // 10:30
    //
    // This is NOT the service duration.
    slotIntervalMinutes: integer("slot_interval_minutes")
      .notNull()
      .default(30),

    // Timezone used by the booking engine.
    timezone: text("timezone")
      .notNull()
      .default("Africa/Tunis"),

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
      "salon_settings_slot_interval_check",
      sql`${table.slotIntervalMinutes} > 0`,
    ),
  ],
);