import {
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import Link from "next/link";

import type { ServiceItem } from "@/features/services/queries";

type ServiceListItemProps = {
  service: ServiceItem;
  index: number;
};

export function ServiceListItem({
  service,
  index,
}: ServiceListItemProps) {
  return (
    <Link
      href={`/booking?service=${service.slug}`}
      aria-label={`Réserver ${service.name}`}
      className="
        group
        relative
        flex
        flex-col
        gap-6
        border-t
        border-white/10
        py-7
        transition-all
        duration-300

        hover:bg-white/[0.025]

        focus-visible:outline-none
        focus-visible:ring-1
        focus-visible:ring-brand

        sm:py-8

        lg:grid
        lg:grid-cols-[80px_1fr_180px_160px]
        lg:items-center
        lg:gap-8
        lg:px-4
      "
    >
      {/* NUMBER */}
      <span
        className="
          font-mono
          text-xs
          tracking-[0.15em]
          text-white/25
          transition-colors
          duration-300

          group-hover:text-brand/60
        "
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* INFO */}
      <div>
        <h3
          className="
            text-xl
            font-semibold
            tracking-[-0.02em]
            text-white
            transition-colors
            duration-300

            group-hover:text-brand

            sm:text-2xl
          "
        >
          {service.name}
        </h3>

        {service.description && (
          <p
            className="
              mt-2
              max-w-xl
              text-sm
              leading-6
              text-white/40
            "
          >
            {service.description}
          </p>
        )}
      </div>

      {/* DURATION */}
      <div
        className="
          flex
          items-center
          gap-2
          text-sm
          text-white/45
        "
      >
        <Clock3
          className="
            size-4
            text-brand
          "
        />

        {service.durationMinutes} min
      </div>

      {/* PRICE */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-5

          lg:justify-end
        "
      >
        <span
          className="
            whitespace-nowrap
            text-xl
            font-semibold
            text-white
          "
        >
          {Number(service.price)} DT
        </span>

        {/* VISUAL INDICATOR */}
        <span
          className="
            flex
            size-11
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            text-white
            transition-all
            duration-300

            group-hover:border-brand
            group-hover:bg-brand
            group-hover:text-black
          "
        >
          <ArrowUpRight
            className="
              size-4
              transition-transform
              duration-300

              group-hover:-translate-y-0.5
              group-hover:translate-x-0.5
            "
          />
        </span>
      </div>
    </Link>
  );
}