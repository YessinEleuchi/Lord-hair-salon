import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="home"
      className="
        relative
        min-h-svh
        overflow-hidden
        bg-background
        pt-20
        lg:pt-24
      "
    >
      {/* =====================================================
          DESKTOP IMAGE
          
          La photo commence réellement à 50% de l'écran.
          Elle ne fait plus partie d'une Grid.
      ====================================================== */}
      <div
        className="
          absolute
          bottom-0
          right-0
          top-24

          hidden
          overflow-hidden

          lg:block
          lg:w-[52%]
        "
      >
        <Image
          src="/images/barber.png"
          alt="Rabie Hentati, coiffeur chez THE LORD Hair Salon"
          fill
          priority
          sizes="52vw"
          className="
  object-cover
  object-[40%_center]
          "
        />

        {/* Transition légère uniquement */}
        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            w-[18%]

            bg-gradient-to-r
            from-background
            to-transparent
          "
        />

        {/* Bottom fade */}
        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            bottom-0
            h-24

            bg-gradient-to-t
            from-background/25
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          MOBILE IMAGE
      ====================================================== */}
      <div
        className="
          relative
          h-[52svh]
          min-h-[370px]
          w-full
          overflow-hidden

          sm:min-h-[440px]

          lg:hidden
        "
      >
        <Image
          src="/images/barber.png"
          alt="Rabie Hentati, coiffeur chez THE LORD Hair Salon"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-[52%_center]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0

            bg-gradient-to-t
            from-background
            via-transparent
            to-black/20
          "
        />
      </div>

      {/* =====================================================
          DESKTOP / MOBILE CONTENT
      ====================================================== */}
      <div
        className="
          relative
          z-10

          mx-auto
          flex
          min-h-[calc(100svh-5rem)]
          w-full
          max-w-[var(--page-max-width)]
          items-center

          px-5
          pb-28
          pt-2

          sm:px-8

          lg:min-h-[calc(100svh-6rem)]
          lg:px-10
          lg:pb-12
          lg:pt-12
        "
      >
        <div
          className="
            w-full

            lg:w-[48%]
            lg:max-w-[720px]
          "
        >
          {/* Eyebrow */}
          <p
            className="
              mb-5

              text-xs
              font-semibold
              uppercase
              tracking-[0.42em]
              text-brand

              sm:text-sm
              lg:mb-6
            "
          >
            Coupe · Barbe · Style
          </p>

          {/* Title */}
          <h1
            className="
              font-serif
              font-semibold

              text-[clamp(3.2rem,13vw,5.5rem)]
              leading-[0.85]
              tracking-[-0.055em]

              lg:text-[clamp(4.2rem,5.3vw,6rem)]
            "
          >
            <span className="block text-white">
              THE LORD
            </span>

            <span className="mt-2 block text-brand">
              HAIR SALON
            </span>
          </h1>

          {/* Description */}
          <p
            className="
              mt-7
              max-w-md

              text-base
              leading-7
              text-white/65

              sm:text-lg

              lg:mt-8
              lg:text-lg
              lg:leading-8
            "
          >
            Une expérience soignée pour un style unique à Sfax.
          </p>

          {/* =================================================
              CTA
          ================================================== */}
          <div
            className="
              mt-8

              flex
              flex-col
              gap-3

              sm:flex-row
              sm:items-center

              lg:mt-9
            "
          >
            <Link
              href="/booking"
              className="
                group

                flex
                min-h-14
                items-center
                justify-center
                gap-3

                rounded-lg
                bg-brand

                px-6

                text-sm
                font-bold
                uppercase
                tracking-[0.06em]
                text-black

                transition-all
                duration-300

                hover:bg-brand-hover
              "
            >
              <CalendarDays className="size-5 shrink-0" />

              <span>Réserver maintenant</span>

              <ArrowRight
                className="
                  size-4
                  shrink-0
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>

            <Link
              href="#services"
              className="
                flex
                min-h-14
                items-center
                justify-center

                rounded-lg

                border
                border-white/20

                px-6

                text-sm
                font-semibold
                uppercase
                tracking-[0.08em]
                text-white

                transition-all
                duration-300

                hover:border-brand
                hover:text-brand
              "
            >
              Nos services
            </Link>
          </div>

          {/* =================================================
              SALON INFO
          ================================================== */}
          <div
            className="
              mt-10

              grid
              gap-5

              border-t
              border-white/10

              pt-7

              sm:grid-cols-3
              sm:gap-5

              lg:mt-11
            "
          >
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />

              <div>
                <p className="text-sm font-medium text-white">
                  Route Gremda
                </p>

                <p className="mt-1 text-xs text-muted">
                  Sfax, Tunisie
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock3 className="mt-0.5 size-5 shrink-0 text-brand" />

              <div>
                <p className="text-sm font-medium text-white">
                  Lun — Sam
                </p>

                <p className="mt-1 text-xs text-muted">
                  09:00 — 18:00
                </p>
              </div>
            </div>

            <a
              href="tel:+21622984983"
              className="group flex items-start gap-3"
            >
              <Phone className="mt-0.5 size-5 shrink-0 text-brand" />

              <div>
                <p
                  className="
                    text-sm
                    font-medium
                    text-white

                    transition-colors
                    group-hover:text-brand
                  "
                >
                  +216 22 984 983
                </p>

                <p className="mt-1 text-xs text-muted">
                  Appeler le salon
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* =====================================================
          MOBILE STICKY CTA
      ====================================================== */}
      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-40

          border-t
          border-white/10

          bg-black/85
          p-3

          backdrop-blur-xl

          lg:hidden
        "
      >
        <Link
          href="/booking"
          className="
            group

            flex
            min-h-14
            items-center
            justify-center
            gap-3

            rounded-lg
            bg-brand

            text-sm
            font-bold
            uppercase
            tracking-[0.08em]
            text-black

            transition-colors
            hover:bg-brand-hover
          "
        >
          <CalendarDays className="size-5" />

          <span>Réserver</span>

          <ArrowRight
            className="
              size-4
              transition-transform
              group-hover:translate-x-1
            "
          />
        </Link>
      </div>
    </section>
  );
}