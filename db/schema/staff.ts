import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { services } from "./services";

export const staff = pgTable("staff", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),

  bio: text("bio"),
  avatarUrl: text("avatar_url"),

  active: boolean("active").notNull().default(true),

  position: integer("position").notNull().default(0),

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
});

export const staffServices = pgTable(
  "staff_services",
  {
    staffId: uuid("staff_id")
      .notNull()
      .references(() => staff.id, {
        onDelete: "cascade",
      }),

    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, {
        onDelete: "cascade",
      }),
  },
  (table) => [
    primaryKey({
      columns: [table.staffId, table.serviceId],
    }),
  ],
);