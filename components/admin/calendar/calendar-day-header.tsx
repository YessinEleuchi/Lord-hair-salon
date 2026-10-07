"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

type CalendarDayHeaderProps = {
  date: string;
};

const TIMEZONE =
  "Africa/Tunis";

function parseDate(
  value: string,
) {
  const [year, month, day] =
    value.split("-").map(Number);

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      12,
    ),
  );
}

function formatDateParam(
  date: Date,
) {
  const year =
    date.getUTCFullYear();

  const month = String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getUTCDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      },
    ).formatToParts(
      new Date(),
    );

  const values =
    Object.fromEntries(
      parts.map(
        ({ type, value }) => [
          type,
          value,
        ],
      ),
    );

  return `${values.year}-${values.month}-${values.day}`;
}

export function CalendarDayHeader({
  date,
}: CalendarDayHeaderProps) {
  const router =
    useRouter();

  const current =
    parseDate(date);

  const today =
    getToday();

  const isToday =
    date === today;

  function navigate(
    offset: number,
  ) {
    const next =
      new Date(current);

    next.setUTCDate(
      next.getUTCDate() +
        offset,
    );

    router.push(
      `/gestion/calendrier?date=${formatDateParam(
        next,
      )}`,
    );
  }

  function goToday() {
    router.push(
      `/gestion/calendrier?date=${today}`,
    );
  }

  const formattedDate =
    new Intl.DateTimeFormat(
      "fr-TN",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      },
    ).format(current);

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Jour précédent"
          className="
            flex
            size-11
            shrink-0
            touch-manipulation
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            text-white/50
            transition
            hover:border-white/20
            hover:bg-white/[0.04]
            hover:text-white
            active:scale-95
          "
        >
          <ChevronLeft className="size-5" />
        </button>

        <button
          type="button"
          onClick={goToday}
          className="
            min-w-0
            flex-1
            touch-manipulation
            rounded-xl
            px-2
            py-2
            text-center
            transition
            hover:bg-white/[0.03]
          "
        >
          <div className="flex items-center justify-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-brand" />

            <p className="truncate text-sm font-semibold capitalize text-white sm:text-base">
              {formattedDate}
            </p>
          </div>

          <p
            className={`
              mt-1
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              ${
                isToday
                  ? "text-brand"
                  : "text-white/25"
              }
            `}
          >
            {isToday
              ? "Aujourd'hui"
              : "Aller à aujourd'hui"}
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(1)
          }
          aria-label="Jour suivant"
          className="
            flex
            size-11
            shrink-0
            touch-manipulation
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            text-white/50
            transition
            hover:border-white/20
            hover:bg-white/[0.04]
            hover:text-white
            active:scale-95
          "
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}