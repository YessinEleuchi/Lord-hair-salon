import { config } from "dotenv";

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

  // ─────────────────────────────────────────────
  // SALON
  // Coordonnées issues du profil Instagram.
  // ─────────────────────────────────────────────

  const [salon] = await db
    .insert(salonSettings)
    .values({
      name: "THE LORD Hair Salon",
      description:
        "Salon de coiffure pour hommes et enfants par Rabie Hentati. " +
        "Coupe, barbe, brushing et soins. " +
        "Route Gremda km 3, en face de l’école Sidi Abbes, Sfax.",
      phone: "+21622984983",
      city: "Sfax",
      timezone: "Africa/Tunis",
      bookingEnabled: true,
      autoConfirmAppointments: false,

      // WhatsApp non confirmé : ne pas renseigner sans validation.
    })
    .returning();

  console.log(`✓ Salon created: ${salon.name}`);

  // ─────────────────────────────────────────────
  // STAFF
  // ─────────────────────────────────────────────

  const [hairstylist] = await db
    .insert(staff)
    .values({
      name: "Rabie Hentati",
      slug: "rabie-hentati",
      bio:
        "Coiffeur chez THE LORD Hair Salon à Sfax. " +
        "Coupe hommes et enfants, barbe, brushing et soins.",
      active: true,
      position: 1,
    })
    .returning();

  console.log(`✓ Staff created: ${hairstylist.name}`);

  // ─────────────────────────────────────────────
  // SERVICE CATEGORIES
  // ─────────────────────────────────────────────

  const [haircutsCategory] = await db
    .insert(serviceCategories)
    .values({
      name: "Coupes",
      slug: "coupes",
      description: "Coupes de cheveux pour hommes et enfants.",
      position: 1,
      active: true,
    })
    .returning();

  const [packagesCategory] = await db
    .insert(serviceCategories)
    .values({
      name: "Forfaits",
      slug: "forfaits",
      description: "Prestations combinant coupe, barbe, brushing ou masque.",
      position: 2,
      active: true,
    })
    .returning();

  const [stylingCategory] = await db
    .insert(serviceCategories)
    .values({
      name: "Brushing",
      slug: "brushing",
      description: "Mise en forme et coiffage des cheveux.",
      position: 3,
      active: true,
    })
    .returning();

  const [beardCategory] = await db
    .insert(serviceCategories)
    .values({
      name: "Barbe",
      slug: "barbe",
      description: "Taille et rasage de la barbe.",
      position: 4,
      active: true,
    })
    .returning();

  console.log("✓ Service categories created");

  // ─────────────────────────────────────────────
  // SERVICES
  //
  // Prix en dinars tunisiens, issus de la grille.
  // Durées et buffers ESTIMATIFS à valider.
  //
  // Coupe enfant : 10 DT.
  // Coupe enfant + brushing : 10 + 5 = 15 DT.
  // ─────────────────────────────────────────────

  const createdServices = await db
    .insert(services)
    .values([
      {
        categoryId: haircutsCategory.id,
        name: "Coupe cheveux",
        slug: "coupe-cheveux",
        description: "Coupe de cheveux homme.",
        durationMinutes: 30,
        bufferMinutes: 5,
        price: "12.00",
        position: 1,
      },
      {
        categoryId: packagesCategory.id,
        name: "Coupe + barbe",
        slug: "coupe-barbe",
        description: "Coupe de cheveux et taille de barbe.",
        durationMinutes: 45,
        bufferMinutes: 5,
        price: "15.00",
        position: 2,
      },
      {
        categoryId: packagesCategory.id,
        name: "Coupe + barbe + brushing",
        slug: "coupe-barbe-brushing",
        description: "Coupe de cheveux, taille de barbe et brushing.",
        durationMinutes: 60,
        bufferMinutes: 5,
        price: "18.00",
        position: 3,
      },
      {
        categoryId: packagesCategory.id,
        name: "Coupe + barbe + brushing + masque",
        slug: "coupe-barbe-brushing-masque",
        description:
          "Coupe de cheveux, taille de barbe, brushing et masque.",
        durationMinutes: 75,
        bufferMinutes: 5,
        price: "20.00",
        position: 4,
      },
      {
        categoryId: haircutsCategory.id,
        name: "Coupe enfant",
        slug: "coupe-enfant",
        description: "Coupe de cheveux enfant.",
        durationMinutes: 30,
        bufferMinutes: 5,
        price: "10.00",
        position: 5,
      },
      {
        categoryId: packagesCategory.id,
        name: "Coupe enfant + brushing",
        slug: "coupe-enfant-brushing",
        description: "Coupe enfant à 10 DT et brushing à 5 DT.",
        durationMinutes: 40,
        bufferMinutes: 5,
        price: "15.00",
        position: 6,
      },
      {
        categoryId: stylingCategory.id,
        name: "Brushing",
        slug: "brushing",
        description: "Mise en forme des cheveux au brushing.",
        durationMinutes: 20,
        bufferMinutes: 5,
        price: "8.00",
        position: 7,
      },
      {
        categoryId: beardCategory.id,
        name: "Barbe dégradée",
        slug: "barbe-degradee",
        description: "Taille de barbe en dégradé.",
        durationMinutes: 20,
        bufferMinutes: 5,
        price: "7.00",
        position: 8,
      },
      {
        categoryId: beardCategory.id,
        name: "Barbe à zéro",
        slug: "barbe-zero",
        description: "Rasage de la barbe à zéro.",
        durationMinutes: 15,
        bufferMinutes: 5,
        price: "5.00",
        position: 9,
      },
    ])
    .returning();

  console.log(`✓ ${createdServices.length} services created`);

  // ─────────────────────────────────────────────
  // STAFF ↔ SERVICES
  // Toutes les prestations sont attribuées à Rabie.
  // ─────────────────────────────────────────────

  await db.insert(staffServices).values(
    createdServices.map((service) => ({
      staffId: hairstylist.id,
      serviceId: service.id,
    })),
  );

  console.log("✓ Services assigned to hairstylist");

  // ─────────────────────────────────────────────
  // WEEKLY WORKING HOURS — DEVELOPMENT ONLY
  //
  // Horaires provisoires, non confirmés par le salon.
  //
  // 0 = dimanche
  // 1 = lundi
  // ...
  // 6 = samedi
  //
  // Lundi–vendredi : 09:00–18:00
  // Samedi : 09:00–17:00
  // Aucune plage ajoutée pour le dimanche.
  // ─────────────────────────────────────────────

  await db.insert(workingHours).values(
    [1, 2, 3, 4, 5, 6].map((dayOfWeek) => ({
      staffId: hairstylist.id,
      dayOfWeek,
      startTime: "09:00",
      endTime: dayOfWeek === 6 ? "17:00" : "18:00",
    })),
  );

  console.log("✓ Temporary working hours created");

  // ─────────────────────────────────────────────
  // RECURRING BREAKS — DEVELOPMENT ONLY
  //
  // Pause provisoire du lundi au vendredi.
  // À confirmer avec le salon.
  // ─────────────────────────────────────────────

  await db.insert(staffBreaks).values(
    [1, 2, 3, 4, 5].map((dayOfWeek) => ({
      staffId: hairstylist.id,
      dayOfWeek,
      startTime: "13:00",
      endTime: "14:00",
      label: "Pause déjeuner",
    })),
  );

  console.log("✓ Temporary recurring breaks created");

  console.log("");
  console.log("🎉 Database seeded successfully");
  console.log(`   Salon: ${salon.name}`);
  console.log(`   Staff: ${hairstylist.name}`);
  console.log(`   Services: ${createdServices.length}`);
  console.log("   Currency: TND — prices expressed in dinars");
  console.log("   Timezone: Africa/Tunis");
  console.log("   ⚠ Validate durations, working hours and breaks before launch.");
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