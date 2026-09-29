import { sql } from "drizzle-orm";

import {
  boolean,
  check,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const serviceCategories = pgTable("service_categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),

  description: text("description"),

  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),

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

export const services = pgTable(
  "services",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    categoryId: uuid("category_id").references(
      () => serviceCategories.id,
      {
        onDelete: "set null",
      },
    ),

    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),

    description: text("description"),

    durationMinutes: integer("duration_minutes").notNull(),

    bufferMinutes: integer("buffer_minutes")
      .notNull()
      .default(0),

    price: numeric("price", {
      precision: 10,
      scale: 2,
    }).notNull(),

    imageUrl: text("image_url"),

    active: boolean("active")
      .notNull()
      .default(true),

    position: integer("position")
      .notNull()
      .default(0),

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
      "services_duration_positive_check",
      sql`${table.durationMinutes} > 0`,
    ),

    check(
      "services_buffer_non_negative_check",
      sql`${table.bufferMinutes} >= 0`,
    ),

    check(
      "services_price_non_negative_check",
      sql`${table.price} >= 0`,
    ),
  ],
);