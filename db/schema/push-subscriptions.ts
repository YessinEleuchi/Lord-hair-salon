import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const pushSubscriptions =
  pgTable(
    "push_subscriptions",
    {
      id: uuid("id")
        .defaultRandom()
        .primaryKey(),

      userId: uuid("user_id")
        .notNull(),

      endpoint: text("endpoint")
        .notNull(),

      p256dh: text("p256dh")
        .notNull(),

      auth: text("auth")
        .notNull(),

      createdAt: timestamp(
        "created_at",
        {
          withTimezone: true,
        },
      )
        .defaultNow()
        .notNull(),

      updatedAt: timestamp(
        "updated_at",
        {
          withTimezone: true,
        },
      )
        .defaultNow()
        .notNull(),
    },
    (table) => [
      uniqueIndex(
        "push_subscriptions_endpoint_idx",
      ).on(table.endpoint),
    ],
  );