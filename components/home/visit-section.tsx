import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";

import { formatWorkingHours } from "@/features/salon/format-working-hours";
import { getPublicSalonInfo } from "@/features/salon/queries";

export async function VisitSection() {
  const data = await getPublicSalonInfo();

  if (!data) {
    return null;
  }

  const { salon, workingHours } = data;

  const formattedHours = formatWorkingHours(
    workingHours,
  );

  return (
    <section
      id="contact"
      className="
        relative
        overflow-hidden
        bg-background
        py-20
        sm:py-24
        lg:py-32
      "
    >
      {/* Decorative light */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-0
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
        {/* =========================================
            HEADER
        ========================================== */}
        <div
          className="
            mb-12
            grid
            gap-7

            lg:mb-16
            lg:grid-cols-[1fr_0.7fr]
            lg:items-end
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-brand" />

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.35em]
                  text-brand
                "
              >
                Visitez-nous
              </p>
            </div>

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
              Votre prochain
              <span className="block text-brand">
                style commence ici.
              </span>
            </h2>
          </div>

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
            Retrouvez toutes les informations nécessaires
            pour préparer votre visite chez THE LORD.
          </p>
        </div>

        {/* =========================================
            MAIN
        ========================================== */}
        <div
          className="
            grid
            overflow-hidden
            border
            border-white/10

            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          {/* =======================================
              INFO
          ======================================== */}
          <div
            className="
              bg-surface
              p-6

              sm:p-8
              lg:p-10
              xl:p-12
            "
          >
            {/* Address */}
            <div
              className="
                flex
                gap-4
                border-b
                border-white/10
                pb-7
              "
            >
              <div
                className="
                  flex
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-brand/10
                  text-brand
                "
              >
                <MapPin className="size-5" />
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white/35
                  "
                >
                  Adresse
                </p>

                <p
                  className="
                    mt-2
                    text-base
                    font-medium
                    leading-6
                    text-white
                  "
                >
                  {salon.address}
                </p>
              </div>
            </div>

            {/* Opening hours */}
            <div
              className="
                border-b
                border-white/10
                py-7
              "
            >
              <div className="mb-5 flex items-center gap-3">
                <Clock3 className="size-5 text-brand" />

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-white/35
                  "
                >
                  Horaires
                </p>
              </div>

              <div className="space-y-3">
                {formattedHours.map((item) => (
                  <div
                    key={item.day}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-5
                    "
                  >
                    <span className="text-sm text-white/50">
                      {item.day}
                    </span>

                    <span
                      className="
                        text-sm
                        font-medium
                        tabular-nums
                        text-white
                      "
                    >
                      {item.enabled
  ? `${item.startTime} — ${item.endTime}`
  : "Fermé"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Phone */}
            <div className="py-7">
              <div className="flex gap-4">
                <div
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-brand/10
                    text-brand
                  "
                >
                  <Phone className="size-5" />
                </div>

                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-white/35
                    "
                  >
                    Téléphone
                  </p>

                  <a
                    href={`tel:${salon.phone}`}
                    className="
                      mt-2
                      block
                      text-base
                      font-medium
                      text-white
                      transition-colors
                      hover:text-brand
                    "
                  >
                    {salon.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div
              className="
                mt-2
                grid
                gap-3

                sm:grid-cols-2
              "
            >
              <Link
                href="/booking"
                className="
                  inline-flex
                  min-h-14
                  items-center
                  justify-center
                  gap-2

                  bg-brand
                  px-5

                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.1em]
                  text-black

                  transition-colors
                  hover:bg-brand-hover
                "
              >
                <CalendarDays className="size-4" />

                Réserver
              </Link>

              {salon.googleMapsUrl && (
                <a
                  href={salon.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group
                    inline-flex
                    min-h-14
                    items-center
                    justify-center
                    gap-2

                    border
                    border-white/15
                    px-5

                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.1em]
                    text-white

                    transition-colors

                    hover:border-brand
                    hover:text-brand
                  "
                >
                  Itinéraire

                  <ArrowUpRight
                    className="
                      size-4
                      transition-transform
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </a>
              )}
            </div>
          </div>

          {/* =======================================
              MAP
          ======================================== */}
          <div
            className="
              relative
              min-h-[420px]
              bg-background-soft

              lg:min-h-full
            "
          >
            {salon.mapEmbedUrl ? (
              <iframe
                src={salon.mapEmbedUrl}
                title={`Localisation de ${salon.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  border-0
                  grayscale
                  contrast-125
                  invert-[0.9]
                "
              />
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-4
                  p-8
                  text-center
                "
              >
                <MapPin className="size-9 text-brand" />

                <div>
                  <p className="font-semibold text-white">
                    {salon.name}
                  </p>

                  <p
                    className="
                      mt-2
                      max-w-sm
                      text-sm
                      leading-6
                      text-white/40
                    "
                  >
                    {salon.address}
                  </p>
                </div>
              </div>
            )}

            {/* yellow corner */}
            <div
              className="
                pointer-events-none
                absolute
                right-0
                top-0
                h-1
                w-24
                bg-brand
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
}