import {
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import Link from "next/link";

import type { ServiceItem } from "@/features/services/queries";

type ServiceCardProps = {
  service: ServiceItem;
  index: number;
};

function formatPrice(price: string) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price;
  }

  return new Intl.NumberFormat("fr-TN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}

export function ServiceCard({
  service,
  index,
}: ServiceCardProps) {
  return (
    <Link
      href={`/booking?service=${service.slug}`}
      className="
        group
        relative
        flex
        min-h-[280px]
        flex-col
        overflow-hidden
        border
        border-white/10
        bg-surface
        p-6

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-brand/50
        hover:bg-surface-hover

        sm:p-7
        lg:min-h-[310px]
        lg:p-8
      "
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-5">
        <span
          className="
            font-mono
            text-xs
            font-semibold
            tracking-[0.2em]
            text-brand
          "
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          className="
            flex
            size-10
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            text-white/60

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
              group-hover:rotate-12
            "
          />
        </div>
      </div>

      {/* Category */}
      {service.category && (
        <p
          className="
            mt-8
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.22em]
            text-white/35
          "
        >
          {service.category.name}
        </p>
      )}

      {/* Name */}
      <h3
        className="
          mt-3
          max-w-sm

          text-2xl
          font-semibold
          uppercase
          leading-tight
          tracking-[-0.03em]
          text-white

          transition-colors
          duration-300

          group-hover:text-brand

          lg:text-[1.7rem]
        "
      >
        {service.name}
      </h3>

      {/* Description */}
      {service.description && (
        <p
          className="
            mt-4
            max-w-sm
            text-sm
            leading-6
            text-white/45
          "
        >
          {service.description}
        </p>
      )}

      {/* Push footer to bottom */}
      <div className="flex-1" />

      <div
        className="
          mt-8
          flex
          items-end
          justify-between
          gap-4
          border-t
          border-white/10
          pt-5
        "
      >
        {/* Duration */}
        <div className="flex items-center gap-2 text-white/45">
          <Clock3 className="size-4 text-brand" />

          <span className="text-xs uppercase tracking-[0.1em]">
            {service.durationMinutes} min
          </span>
        </div>

        {/* Price */}
        <div className="text-right">
          <span
            className="
              text-2xl
              font-bold
              tracking-[-0.04em]
              text-white
            "
          >
            {formatPrice(service.price)}
          </span>

          <span
            className="
              ml-1.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-brand
            "
          >
            DT
          </span>
        </div>
      </div>

      {/* Hover bottom accent */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-[2px]

          origin-left
          scale-x-0
          bg-brand

          transition-transform
          duration-300

          group-hover:scale-x-100
        "
      />
    </Link>
  );
}