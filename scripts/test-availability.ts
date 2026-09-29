import { config } from "dotenv";

config({
  path: ".env.local",
});

async function main() {
  const { db } = await import("../db");

  const {
    services,
    staff,
  } = await import("../db/schema");

  const { getAvailableSlots } =
    await import(
      "../features/availability/engine/get-available-slots"
    );

  const [hairstylist] = await db
    .select()
    .from(staff)
    .limit(1);

  const [service] = await db
    .select()
    .from(services)
    .limit(1);

  if (!hairstylist || !service) {
    throw new Error(
      "Staff or service missing",
    );
  }

  const result =
    await getAvailableSlots({
      staffId: hairstylist.id,
      serviceId: service.id,

      // Choose a working day.
      date: "2026-09-30",
    });

  console.dir(result, {
    depth: null,
  });
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });