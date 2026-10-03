import type { Metadata } from "next";
import Link from "next/link";

import { ServicesCatalog } from "@/components/services/services-catalog";
import {
  getActiveServices,
  getServiceCategories,
} from "@/features/services/queries";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Découvrez les prestations THE LORD Hair Salon à Sfax : coupe, barbe, styling, soins du visage et traitements capillaires.",
};

export default async function ServicesPage() {
  const [services, categories] =
    await Promise.all([
      getActiveServices(),
      getServiceCategories(),
    ]);

  return (
    <>
      {/* ========================================
          HERO
      ========================================= */}
      <section
        className="
          relative
          overflow-hidden
          border-b
          border-white/10
          bg-background
          pt-36

          sm:pt-40
          lg:pt-48
        "
      >
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-32
            top-20
            size-[420px]
            rounded-full
            bg-brand/5
            blur-[120px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-[var(--page-max-width)]
            px-5
            pb-16

            sm:px-8
            sm:pb-20

            lg:px-10
            lg:pb-24
          "
        >
          <p
            className="
              font-mono
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-brand
            "
          >
            THE LORD Hair Salon
          </p>

          <h1
            className="
              mt-5
              max-w-4xl
              text-5xl
              font-semibold
              uppercase
              leading-[0.9]
              tracking-[-0.055em]
              text-white

              sm:text-6xl
              lg:text-8xl
            "
          >
            Nos
            <span className="block text-brand">
              services
            </span>
          </h1>

          <div
            className="
              mt-8
              flex
              flex-col
              gap-8

              lg:flex-row
              lg:items-end
              lg:justify-between
            "
          >
            <p
              className="
                max-w-xl
                text-sm
                leading-7
                text-white/45

                sm:text-base
              "
            >
              Coupe, barbe, styling, soins et
              traitements. Choisissez votre
              prestation et réservez votre
              rendez-vous en quelques étapes.
            </p>

            <span
              className="
                font-mono
                text-xs
                uppercase
                tracking-[0.15em]
                text-white/30
              "
            >
              {services.length} prestations
            </span>
          </div>
        </div>
      </section>

      {/* ========================================
          CATEGORY NAVIGATION
      ========================================= */}
      <div
        className="
          sticky
          top-20
          z-30
          border-b
          border-white/10
          bg-background/90
          backdrop-blur-xl

          lg:top-24
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[var(--page-max-width)]
            gap-2
            overflow-x-auto
            px-5
            py-4

            sm:px-8
            lg:px-10
          "
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`#${category.slug}`}
              className="
                shrink-0
                rounded-full
                border
                border-white/10
                px-5
                py-2.5
                text-xs
                font-semibold
                uppercase
                tracking-[0.1em]
                text-white/55
                transition-all

                hover:border-brand
                hover:text-brand
              "
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ========================================
          CATALOG
      ========================================= */}
      <section className="bg-background">
        <div
          className="
            mx-auto
            max-w-[var(--page-max-width)]
            px-5
            py-16

            sm:px-8
            sm:py-20

            lg:px-10
            lg:py-28
          "
        >
          {services.length > 0 ? (
            <ServicesCatalog
              services={services}
              categories={categories}
            />
          ) : (
            <div
              className="
                border
                border-white/10
                p-10
                text-center
              "
            >
              <p className="text-white/50">
                Aucun service disponible pour le
                moment.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}