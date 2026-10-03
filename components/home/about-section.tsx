import {
  CalendarDays,
  MapPin,
  Scissors,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function AboutSection() {
  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-background
        py-20
        sm:py-24
        lg:py-32
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-[var(--page-max-width)]
          gap-12
          px-5

          sm:px-8

          lg:grid-cols-[1.05fr_0.95fr]
          lg:items-center
          lg:gap-16
          lg:px-10

          xl:gap-24
        "
      >
        {/* =========================================
            IMAGE
        ========================================== */}
        <div
          className="
            relative
            min-h-[420px]
            overflow-hidden
            sm:min-h-[520px]
            lg:min-h-[650px]
          "
        >
          <Image
            src="/images/salon.png"
            alt="Intérieur de THE LORD Hair Salon à Sfax"
            fill
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="
              object-cover
              transition-transform
              duration-700
              hover:scale-[1.02]
            "
          />

          {/* image overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

          {/* Corner */}
          <div
            className="
              absolute
              bottom-0
              left-0

              border-r
              border-t
              border-white/10

              bg-black/80
              px-5
              py-4

              backdrop-blur-md

              sm:px-6
              sm:py-5
            "
          >
            <div className="flex items-center gap-3">
              <MapPin className="size-4 text-brand" />

              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-white
                  "
                >
                  THE LORD
                </p>

                <p className="mt-1 text-xs text-white/45">
                  Route Gremda · Sfax
                </p>
              </div>
            </div>
          </div>

          {/* decorative border */}
          <div
            className="
              pointer-events-none
              absolute
              inset-4
              border
              border-white/[0.08]
            "
          />
        </div>

        {/* =========================================
            CONTENT
        ========================================== */}
        <div>
          {/* eyebrow */}
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
              À propos
            </p>
          </div>

          {/* heading */}
          <h2
            className="
              mt-6

              font-serif
              text-4xl
              font-semibold
              uppercase
              leading-[0.94]
              tracking-[-0.04em]
              text-white

              sm:text-5xl
              lg:text-6xl
              xl:text-7xl
            "
          >
            Plus qu&apos;une
            <span className="block text-brand">
              simple coupe.
            </span>
          </h2>

          {/* text */}
          <div
            className="
              mt-8
              max-w-xl
              space-y-5

              text-base
              leading-7
              text-white/55

              sm:text-lg
              sm:leading-8
            "
          >
            <p>
              THE LORD Hair Salon est un salon de coiffure
              dédié aux hommes et aux enfants, situé à Sfax.
              Un espace pensé pour prendre soin de votre style
              dans une ambiance moderne et soignée.
            </p>

            <p>
              De la coupe à la barbe, du brushing aux soins,
              chaque prestation est réalisée avec attention,
              précision et le souci du détail.
            </p>
          </div>

          {/* =========================================
              VALUES
          ========================================== */}
          <div
            className="
              mt-10
              grid
              gap-px
              overflow-hidden
              border
              border-white/10
              bg-white/10

              sm:grid-cols-2
            "
          >
            <div className="bg-background p-5 sm:p-6">
              <Scissors className="size-5 text-brand" />

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-white
                "
              >
                Précision
              </p>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Une attention particulière portée à chaque
                coupe et chaque finition.
              </p>
            </div>

            <div className="bg-background p-5 sm:p-6">
              <Sparkles className="size-5 text-brand" />

              <p
                className="
                  mt-4
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.1em]
                  text-white
                "
              >
                Expérience
              </p>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Un environnement moderne, confortable et
                pensé autour du client.
              </p>
            </div>
          </div>

          {/* =========================================
              LOCATION + CTA
          ========================================== */}
          <div
            className="
              mt-8
              flex
              flex-col
              gap-5
              border-t
              border-white/10
              pt-7

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />

              <div>
                <p className="text-sm font-medium text-white">
                  Route Gremda km 3
                </p>

                <p className="mt-1 text-xs text-white/40">
                  En face de l&apos;école Sidi Abbes · Sfax
                </p>
              </div>
            </div>

            <Link
              href="/booking"
              className="
                group
                inline-flex
                min-h-12
                shrink-0
                items-center
                justify-center
                gap-2

                bg-brand
                px-5

                text-xs
                font-bold
                uppercase
                tracking-[0.08em]
                text-black

                transition-colors
                hover:bg-brand-hover
              "
            >
              <CalendarDays className="size-4" />
              Réserver
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}