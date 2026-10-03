import {
  ArrowRight,
  Scissors,
} from "lucide-react";
import Link from "next/link";

import { getActiveServices } from "@/features/services/queries";

import { ServiceCard } from "./service-card";

const SERVICES_PREVIEW_COUNT = 6;

export async function ServicesSection() {
  const services = await getActiveServices();

  if (services.length === 0) {
    return null;
  }

  const featuredServices = services.slice(
    0,
    SERVICES_PREVIEW_COUNT,
  );

  return (
    <section
      id="services"
      className="
        relative
        overflow-hidden
        border-t
        border-white/5
        bg-background-soft
        py-20

        sm:py-24
        lg:py-32
      "
    >
      {/* Background decoration */}
      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-0
          size-[500px]
          rounded-full
          bg-brand/[0.025]
          blur-[120px]
        "
      />

      <div
        className="
          relative
          mx-auto
          max-w-[var(--page-max-width)]
          px-5

          sm:px-8
          lg:px-10
        "
      >
        {/* ===============================================
            SECTION HEADER
        ================================================ */}
        <div
          className="
            mb-12
            grid
            gap-8

            lg:mb-16
            lg:grid-cols-[1fr_0.7fr]
            lg:items-end
          "
        >
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <Scissors className="size-4 text-brand" />

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.35em]
                  text-brand
                "
              >
                Nos services
              </p>
            </div>

            {/* Heading */}
            <h2
              className="
                mt-5
                max-w-3xl

                font-serif
                text-4xl
                font-semibold
                uppercase
                leading-[0.92]
                tracking-[-0.04em]
                text-white

                sm:text-5xl
                lg:text-6xl
                xl:text-7xl
              "
            >
              L&apos;essentiel,
              <span className="block text-brand">
                sans compromis.
              </span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p
              className="
                max-w-lg
                text-base
                leading-7
                text-white/50

                lg:ml-auto
                lg:text-lg
                lg:leading-8
              "
            >
              Des prestations pensées pour votre style,
              réalisées avec précision dans notre salon à
              Sfax.
            </p>

            <div
              className="
                mt-6
                hidden
                items-center
                justify-between
                border-t
                border-white/10
                pt-5

                lg:flex
              "
            >
              <span
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                "
              >
                01 / Services
              </span>

              <span
                className="
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                "
              >
                The Lord
              </span>
            </div>
          </div>
        </div>

        {/* ===============================================
            SERVICES GRID
        ================================================ */}
        <div
          className="
            grid
            grid-cols-1
            gap-3

            sm:grid-cols-2

            xl:grid-cols-3
          "
        >
          {featuredServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
            />
          ))}
        </div>

        {/* ===============================================
            BOTTOM ACTION
        ================================================ */}
        {services.length > SERVICES_PREVIEW_COUNT && (
          <div
            className="
              mt-10
              flex
              justify-center

              lg:mt-12
            "
          >
            <Link
              href="/services"
              className="
                group
                inline-flex
                min-h-14
                items-center
                justify-center
                gap-3

                border
                border-white/15

                px-7

                text-sm
                font-semibold
                uppercase
                tracking-[0.1em]
                text-white

                transition-all
                duration-300

                hover:border-brand
                hover:text-brand
              "
            >
              Voir tous les services

              <ArrowRight
                className="
                  size-4
                  transition-transform
                  duration-300

                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}