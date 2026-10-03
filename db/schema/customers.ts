import {
  pgTable,
  text,
  timestamp,
  uuid,
  index,
} from "drizzle-orm/pg-core";

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    name: text("name").notNull(),

    phone: text("phone").notNull(),

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
    index("customers_phone_idx").on(table.phone),
  ],
);