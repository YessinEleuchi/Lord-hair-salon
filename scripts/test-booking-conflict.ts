import { config } from "dotenv";
import { and, eq } from "drizzle-orm";
import { TZDate } from "@date-fns/tz";

config({
  path: ".env.local",
});

async function main() {
  const { db } = await import("../db");

  const {
    appointments,
    customers,
    salonSettings,
    services,
    staff,
  } = await import("../db/schema");

  const { getAvailableSlots } = await import(
    "../features/availability/engine/get-available-slots"
  );

  console.log("🧪 Starting booking conflict test...");

  // ─────────────────────────────────────────────
  // LOAD TEST DATA
  // ─────────────────────────────────────────────

  const [settings] = await db
    .select()
    .from(salonSettings)
    .limit(1);

  const [hairstylist] = await db
    .select()
    .from(staff)
    .where(eq(staff.slug, "rabie-hentati"))
    .limit(1);

  const [service] = await db
    .select()
    .from(services)
    .where(eq(services.slug, "coupe-cheveux"))
    .limit(1);

  if (!settings) {
    throw new Error("Salon settings missing");
  }

  if (!hairstylist) {
    throw new Error("Rabie Hentati not found");
  }

  if (!service) {
    throw new Error("Coupe cheveux service not found");
  }

  const testDate = "2026-09-30";

  const [year, month, day] = testDate
    .split("-")
    .map(Number);

  // ─────────────────────────────────────────────
  // CREATE TEMPORARY CUSTOMER
  // ─────────────────────────────────────────────

  const testPhone = "+21600000000";

  // Cleanup from a previous interrupted test.
  const previousCustomers = await db
    .select({
      id: customers.id,
    })
    .from(customers)
    .where(eq(customers.phone, testPhone));

  for (const customer of previousCustomers) {
    await db
      .delete(appointments)
      .where(eq(appointments.customerId, customer.id));

    await db
      .delete(customers)
      .where(eq(customers.id, customer.id));
  }

  const [customer] = await db
    .insert(customers)
    .values({
      name: "Availability Test",
      phone: testPhone,
      email: "availability-test@example.com",
    })
    .returning();

  console.log("✓ Temporary customer created");

  try {
    // ─────────────────────────────────────────────
    // CREATE 10:00 APPOINTMENT
    // ─────────────────────────────────────────────

    const startAt = new TZDate(
      year,
      month - 1,
      day,
      10,
      0,
      0,
      0,
      settings.timezone,
    );

    const endAt = new TZDate(
      year,
      month - 1,
      day,
      10,
      30,
      0,
      0,
      settings.timezone,
    );

    const blockedUntil = new TZDate(
      year,
      month - 1,
      day,
      10,
      35,
      0,
      0,
      settings.timezone,
    );

    const [appointment] = await db
      .insert(appointments)
      .values({
        customerId: customer.id,
        staffId: hairstylist.id,
        serviceId: service.id,

        startAt,
        endAt,
        blockedUntil,

        price: service.price,

        status: "CONFIRMED",

        customerNotes:
          "Temporary appointment created by availability test",
      })
      .returning();

    console.log(
      `✓ Temporary appointment created: ${appointment.id}`,
    );

    console.log(
      "✓ Appointment: 10:00 -> 10:30, blocked until 10:35",
    );

    // ─────────────────────────────────────────────
    // RUN AVAILABILITY ENGINE
    // ─────────────────────────────────────────────

    const result = await getAvailableSlots({
      staffId: hairstylist.id,
      serviceId: service.id,
      date: testDate,
    });

    const morning = result.sessions.find(
      (session) => session.type === "MORNING",
    );

    if (!morning) {
      throw new Error("Morning session missing");
    }

    const morningTimes = morning.slots.map(
      (slot) => slot.start,
    );

    console.log("");
    console.log(
      "Available morning slots:",
      morningTimes.join(", "),
    );

    // ─────────────────────────────────────────────
    // ASSERTIONS
    // ─────────────────────────────────────────────

    const forbiddenSlots = [
      "09:30",
      "10:00",
      "10:30",
    ];

    for (const slot of forbiddenSlots) {
      if (morningTimes.includes(slot)) {
        throw new Error(
          `❌ ${slot} should NOT be available`,
        );
      }
    }

    if (!morningTimes.includes("09:00")) {
      throw new Error(
        "❌ 09:00 should still be available",
      );
    }

    if (!morningTimes.includes("11:00")) {
      throw new Error(
        "❌ 11:00 should still be available",
      );
    }

    console.log("");
    console.log(
      "✓ 09:30 correctly removed",
    );

    console.log(
      "✓ 10:00 correctly removed",
    );

    console.log(
      "✓ 10:30 correctly removed",
    );

    console.log(
      "✓ 09:00 remains available",
    );

    console.log(
      "✓ 11:00 remains available",
    );

    console.log("");
    console.log(
      "🎉 Booking conflict test passed",
    );
  } finally {
    // ─────────────────────────────────────────────
    // CLEANUP
    // ─────────────────────────────────────────────

    await db
      .delete(appointments)
      .where(
        and(
          eq(
            appointments.customerId,
            customer.id,
          ),
          eq(
            appointments.staffId,
            hairstylist.id,
          ),
        ),
      );

    await db
      .delete(customers)
      .where(eq(customers.id, customer.id));

    console.log(
      "🧹 Temporary test data removed",
    );
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("");
    console.error(error);

    process.exit(1);
  });