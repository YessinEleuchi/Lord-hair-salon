import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-brand">
      <div
        className="
          mx-auto
          max-w-[var(--page-max-width)]
          px-5
          py-20
          sm:px-8
          sm:py-24
          lg:px-10
          lg:py-28
        "
      >
        <div
          className="
            flex
            flex-col
            gap-10
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.3em]
                text-black/55
              "
            >
              Votre prochain rendez-vous
            </p>

            <h2
              className="
                mt-5
                max-w-5xl
                font-serif
                text-5xl
                font-semibold
                uppercase
                leading-[0.88]
                tracking-[-0.05em]
                text-black

                sm:text-6xl
                lg:text-7xl
                xl:text-8xl
              "
            >
              Prêt pour votre
              <span className="block">
                prochain style ?
              </span>
            </h2>
          </div>

          <Link
            href="/booking"
            className="
              group
              inline-flex
              min-h-16
              shrink-0
              items-center
              justify-center
              gap-3
              bg-black
              px-7
              text-sm
              font-bold
              uppercase
              tracking-[0.1em]
              text-white
              transition-transform
              hover:-translate-y-1
            "
          >
            <CalendarDays className="size-5 text-brand" />

            Réserver maintenant

            <ArrowRight
              className="
                size-5
                transition-transform
                group-hover:translate-x-1
              "
            />
          </Link>
        </div>
      </div>
    </section>
  );
}