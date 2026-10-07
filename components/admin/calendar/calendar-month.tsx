"use client";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

type MonthDay = {
  date: string;
  count: number;
};

type Props = {
  selectedDate: string;
  days: MonthDay[];
};

const WEEK_DAYS = [
  "Lu",
  "Ma",
  "Me",
  "Je",
  "Ve",
  "Sa",
  "Di",
];

function parseDate(
  value: string,
) {
  const [year, month, day] =
    value.split("-").map(Number);

  return {
    year,
    month,
    day,
  };
}

function buildDate(
  year: number,
  month: number,
  day: number,
) {
  return [
    year,
    String(month).padStart(
      2,
      "0",
    ),
    String(day).padStart(
      2,
      "0",
    ),
  ].join("-");
}

export function CalendarMonth({
  selectedDate,
  days,
}: Props) {
  const router =
    useRouter();

  const {
    year,
    month,
    day,
  } = parseDate(
    selectedDate,
  );

  const counts =
    new Map(
      days.map(
        (item) => [
          item.date,
          item.count,
        ],
      ),
    );

  const firstDay =
    new Date(
      Date.UTC(
        year,
        month - 1,
        1,
      ),
    );

  const daysInMonth =
    new Date(
      Date.UTC(
        year,
        month,
        0,
      ),
    ).getUTCDate();

  // JS:
  // Sunday = 0
  //
  // Calendar:
  // Monday = 0
  const offset =
    (
      firstDay.getUTCDay() +
      6
    ) % 7;

  const monthLabel =
    new Intl.DateTimeFormat(
      "fr-TN",
      {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      },
    ).format(
      firstDay,
    );

  function selectDay(
    selectedDay: number,
  ) {
    router.push(
      `/gestion/calendrier?date=${buildDate(
        year,
        month,
        selectedDay,
      )}`,
    );
  }

  function changeMonth(
    direction: number,
  ) {
    const target =
      new Date(
        Date.UTC(
          year,
          month - 1 +
            direction,
          1,
        ),
      );

    const targetYear =
      target.getUTCFullYear();

    const targetMonth =
      target.getUTCMonth() +
      1;

    const targetDays =
      new Date(
        Date.UTC(
          targetYear,
          targetMonth,
          0,
        ),
      ).getUTCDate();

    // Keep the same day when
    // possible.
    const targetDay =
      Math.min(
        day,
        targetDays,
      );

    router.push(
      `/gestion/calendrier?date=${buildDate(
        targetYear,
        targetMonth,
        targetDay,
      )}`,
    );
  }

  const cells = [
    ...Array.from(
      {
        length: offset,
      },
      () => null,
    ),

    ...Array.from(
      {
        length:
          daysInMonth,
      },
      (_, index) =>
        index + 1,
    ),
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-surface p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() =>
            changeMonth(-1)
          }
          aria-label="Mois précédent"
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-lg
            text-white/35
            transition
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          <ChevronLeft className="size-4" />
        </button>

        <p className="text-sm font-semibold capitalize text-white">
          {monthLabel}
        </p>

        <button
          type="button"
          onClick={() =>
            changeMonth(1)
          }
          aria-label="Mois suivant"
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-lg
            text-white/35
            transition
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7">
        {WEEK_DAYS.map(
          (weekDay) => (
            <div
              key={weekDay}
              className="pb-2 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-white/20"
            >
              {weekDay}
            </div>
          ),
        )}

        {cells.map(
          (
            cellDay,
            index,
          ) => {
            if (
              cellDay === null
            ) {
              return (
                <div
                  key={`empty-${index}`}
                  className="aspect-square"
                />
              );
            }

            const date =
              buildDate(
                year,
                month,
                cellDay,
              );

            const selected =
              cellDay === day;

            const count =
              counts.get(
                date,
              ) ?? 0;

            return (
              <div
                key={date}
                className="flex aspect-square items-center justify-center p-0.5"
              >
                <button
                  type="button"
                  onClick={() =>
                    selectDay(
                      cellDay,
                    )
                  }
                  className={`
                    relative
                    flex
                    size-full
                    max-h-11
                    max-w-11
                    touch-manipulation
                    items-center
                    justify-center
                    rounded-xl
                    text-xs
                    font-medium
                    transition
                    ${
                      selected
                        ? "bg-brand font-semibold text-black"
                        : "text-white/55 hover:bg-white/[0.05] hover:text-white"
                    }
                  `}
                >
                  {cellDay}

                  {count > 0 && (
                    <span
                      className={`
                        absolute
                        bottom-1
                        size-1
                        rounded-full
                        ${
                          selected
                            ? "bg-black/60"
                            : "bg-brand"
                        }
                      `}
                    />
                  )}
                </button>
              </div>
            );
          },
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
        <span className="size-1.5 rounded-full bg-brand" />

        <p className="text-[10px] text-white/30">
          Journée avec
          rendez-vous
        </p>
      </div>
    </div>
  );
}