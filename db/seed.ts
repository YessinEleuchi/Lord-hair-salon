import { config } from "dotenv";
import { sql } from "drizzle-orm";

config({ path: ".env.local" });

async function seed() {
  const { db } = await import("./index");

  const {
    salonSettings,
    serviceCategories,
    services,
    staff,
    staffServices,
    workingHours,
    staffBreaks,
  } = await import("./schema");

  console.log("🌱 Starting database seed...");

  // =========================================================
  // RESET
  // =========================================================

  console.log("🧹 Clearing existing data...");

  await db.execute(sql`
    TRUNCATE TABLE
      "salon_settings",
      "service_categories",
      "services",
      "staff",
      "staff_services",
      "working_hours",
      "staff_breaks"
    CASCADE
  `);

  console.log("✓ Database cleared");

  // =========================================================
  // SALON
  // =========================================================

  const [salon] = await db
    .insert(salonSettings)
    .values({
      name: "THE LORD Hair Salon",

      description:
        "THE LORD Hair Salon est un salon de coiffure et de soins à Sfax. " +
        "Coupes, styling, barbe, soins du visage et traitements capillaires.",

      phone: "+21622984983",

      address:
        "Route Gremda km 3, en face de l'école Sidi Abbes",

      city: "Sfax",

      timezone: "Africa/Tunis",

      bookingEnabled: true,

      autoConfirmAppointments: false,

      slotIntervalMinutes: 30,

      // À compléter lorsque les URLs officielles sont confirmées :
      // instagramUrl: "...",
      // facebookUrl: "...",
      // tiktokUrl: "...",
      // whatsapp: "...",
    })
    .returning();

  console.log(`✓ Salon created: ${salon.name}`);

  // =========================================================
  // STAFF
  // =========================================================

  const [hairstylist] = await db
  .insert(staff)
  .values({
    name: "Rabie Hentati",
    slug: "rabie-hentati",

    bio: "Coiffeur chez THE LORD Hair Salon à Sfax.",

    avatarUrl: "/images/staff/rabie.png",

    active: true,
    position: 1,
  })
  .returning();

  console.log(`✓ Staff created: ${hairstylist.name}`);

  // =========================================================
  // SERVICE CATEGORIES
  // =========================================================

  const categories = await db
    .insert(serviceCategories)
    .values([
      {
        name: "Coupe & Styling",
        slug: "coupe-styling",
        description:
          "Coupes, barbe, brushing et prestations de styling.",
        position: 1,
        active: true,
      },
      {
        name: "Soins",
        slug: "soins",
        description:
          "Soins du visage et prestations beauté.",
        position: 2,
        active: true,
      },
      {
        name: "Traitement",
        slug: "traitement",
        description:
          "Traitements et soins capillaires.",
        position: 3,
        active: true,
      },
    ])
    .returning();

  const haircutCategory = categories.find(
    (category) => category.slug === "coupe-styling",
  );

  const careCategory = categories.find(
    (category) => category.slug === "soins",
  );

  const treatmentCategory = categories.find(
    (category) => category.slug === "traitement",
  );

  if (
    !haircutCategory ||
    !careCategory ||
    !treatmentCategory
  ) {
    throw new Error(
      "Unable to create service categories.",
    );
  }

  console.log("✓ Service categories created");

  // =========================================================
  // SERVICES
  //
  // Prices: taken from the official price list supplied.
  //
  // Durations and buffers:
  // DEVELOPMENT ESTIMATES ONLY.
  // They must be confirmed before production.
  // =========================================================

  const createdServices = await db
    .insert(services)
    .values([
      // -------------------------------------------------------
      // COUPE & STYLING
      // -------------------------------------------------------

      {
        categoryId: haircutCategory.id,

        name: "Coupe cheveux",
        slug: "coupe-cheveux",

        description: "Coupe de cheveux.",

        durationMinutes: 30,
        bufferMinutes: 5,

        price: "12.00",

        position: 1,
      },

      {
        categoryId: haircutCategory.id,

        name: "Coupe + Brushing",
        slug: "coupe-brushing",

        description:
          "Coupe de cheveux avec brushing.",

        durationMinutes: 40,
        bufferMinutes: 5,

        price: "15.00",

        position: 2,
      },

      {
        categoryId: haircutCategory.id,

        name: "Coupe + barbe",
        slug: "coupe-barbe",

        description:
          "Coupe de cheveux et barbe.",

        durationMinutes: 45,
        bufferMinutes: 5,

        price: "15.00",

        position: 3,
      },

      {
        categoryId: haircutCategory.id,

        name: "Coupe + barbe + brushing",
        slug: "coupe-barbe-brushing",

        description:
          "Coupe, barbe et brushing.",

        durationMinutes: 60,
        bufferMinutes: 5,

        price: "18.00",

        position: 4,
      },

      {
        categoryId: haircutCategory.id,

        name: "Coupe + barbe + brushing + masque",
        slug: "coupe-barbe-brushing-masque",

        description:
          "Coupe, barbe, brushing et masque.",

        durationMinutes: 75,
        bufferMinutes: 5,

        price: "20.00",

        position: 5,
      },

      {
        categoryId: haircutCategory.id,

        name: "Coupe enfant + brushing",
        slug: "coupe-enfant-brushing",

        description:
          "Coupe enfant avec brushing.",

        durationMinutes: 40,
        bufferMinutes: 5,

        price: "15.00",

        position: 6,
      },

      {
        categoryId: haircutCategory.id,

        name: "Brushing",
        slug: "brushing",

        description:
          "Mise en forme des cheveux au brushing.",

        durationMinutes: 20,
        bufferMinutes: 5,

        price: "8.00",

        position: 7,
      },

      {
        categoryId: haircutCategory.id,

        name: "Barbe dégradée",
        slug: "barbe-degradee",

        description:
          "Taille de barbe en dégradé.",

        durationMinutes: 20,
        bufferMinutes: 5,

        price: "7.00",

        position: 8,
      },

      {
        categoryId: haircutCategory.id,

        name: "Barbe zéro",
        slug: "barbe-zero",

        description:
          "Rasage de la barbe à zéro.",

        durationMinutes: 15,
        bufferMinutes: 5,

        price: "5.00",

        position: 9,
      },

      // -------------------------------------------------------
      // SOINS
      // -------------------------------------------------------

      {
        categoryId: careCategory.id,

        name: "Mini Soin",
        slug: "mini-soin",

        description:
          "Mini soin du visage.",

        durationMinutes: 20,
        bufferMinutes: 5,

        price: "20.00",

        position: 10,
      },

      {
        categoryId: careCategory.id,

        name: "Soin Visage",
        slug: "soin-visage",

        description:
          "Soin du visage.",

        durationMinutes: 30,
        bufferMinutes: 5,

        price: "30.00",

        position: 11,
      },

      {
        categoryId: careCategory.id,

        name: "Soin Visage complet",
        slug: "soin-visage-complet",

        description:
          "Soin complet du visage.",

        durationMinutes: 45,
        bufferMinutes: 5,

        price: "50.00",

        position: 12,
      },

      {
        categoryId: careCategory.id,

        name: "Soin Mariage",
        slug: "soin-mariage",

        description:
          "Soin spécial mariage.",

        durationMinutes: 60,
        bufferMinutes: 5,

        price: "70.00",

        position: 13,
      },

      // -------------------------------------------------------
      // TRAITEMENT
      // -------------------------------------------------------

      {
        categoryId: treatmentCategory.id,

        name: "Protéine",
        slug: "proteine",

        description:
          "Traitement capillaire à la protéine.",

        durationMinutes: 120,
        bufferMinutes: 10,

        price: "120.00",

        position: 14,
      },

      {
        categoryId: treatmentCategory.id,

        name: "Kératine",
        slug: "keratine",

        description:
          "Traitement capillaire à la kératine.",

        durationMinutes: 120,
        bufferMinutes: 10,

        price: "90.00",

        position: 15,
      },

      {
        categoryId: treatmentCategory.id,

        name: "Lissage",
        slug: "lissage",

        description:
          "Traitement de lissage des cheveux.",

        durationMinutes: 120,
        bufferMinutes: 10,

        price: "60.00",

        position: 16,
      },

      {
        categoryId: treatmentCategory.id,

        name: "Soin Capillaire",
        slug: "soin-capillaire",

        description:
          "Soin des cheveux.",

        durationMinutes: 30,
        bufferMinutes: 5,

        price: "20.00",

        position: 17,
      },

      {
        categoryId: treatmentCategory.id,

        name: "Soin Capillaire Complet",
        slug: "soin-capillaire-complet",

        description:
          "Soin complet des cheveux.",

        durationMinutes: 45,
        bufferMinutes: 5,

        price: "40.00",

        position: 18,
      },
    ])
    .returning();

  console.log(
    `✓ ${createdServices.length} services created`,
  );

  // =========================================================
  // STAFF ↔ SERVICES
  // =========================================================

  await db.insert(staffServices).values(
    createdServices.map((service) => ({
      staffId: hairstylist.id,
      serviceId: service.id,
    })),
  );

  console.log(
    `✓ ${createdServices.length} services assigned to ${hairstylist.name}`,
  );

  // =========================================================
  // WORKING HOURS
  //
  // DEVELOPMENT DATA ONLY.
  // Must be configurable by admin.
  //
  // 0 Sunday
  // 1 Monday
  // ...
  // 6 Saturday
  // =========================================================

  await db.insert(workingHours).values(
    [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
      staffId: hairstylist.id,

      dayOfWeek,

      startTime: "09:00",

      endTime:
        dayOfWeek === 6
          ? "17:00"
          : "18:00",
    })),
  );

  console.log(
    "✓ Temporary working hours created",
  );

  // =========================================================
  // STAFF BREAKS
  //
  // DEVELOPMENT DATA ONLY.
  // Must be configurable by admin.
  // =========================================================

  await db.insert(staffBreaks).values(
    [1, 2, 3, 4, 5].map((dayOfWeek) => ({
      staffId: hairstylist.id,

      dayOfWeek,

      startTime: "13:00",
      endTime: "14:00",

      label: "Pause déjeuner",
    })),
  );

  console.log(
    "✓ Temporary recurring breaks created",
  );

  // =========================================================
  // SUMMARY
  // =========================================================

  console.log("");
  console.log(
    "🎉 Database seeded successfully",
  );

  console.log(`   Salon: ${salon.name}`);
  console.log(`   Staff: ${hairstylist.name}`);
  console.log(
    `   Categories: ${categories.length}`,
  );
  console.log(
    `   Services: ${createdServices.length}`,
  );
  console.log(
    "   Currency: TND — prices expressed in dinars",
  );
  console.log(
    "   Timezone: Africa/Tunis",
  );

  console.log("");
  console.log(
    "⚠ Service durations, working hours and breaks are provisional.",
  );
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Seed failed");
    console.error(error);

    process.exit(1);
  });