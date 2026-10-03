export type BookingDateOption = {
  value: string;
  day: string;
  dayNumber: string;
  month: string;
};

const DAY_FORMATTER =
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    timeZone: "Africa/Tunis",
  });

const MONTH_FORMATTER =
  new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    timeZone: "Africa/Tunis",
  });

const DATE_PARTS_FORMATTER =
  new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Africa/Tunis",
  });

function toSalonDate(date: Date) {
  const parts =
    DATE_PARTS_FORMATTER.formatToParts(date);

  const year = parts.find(
    (part) => part.type === "year",
  )!.value;

  const month = parts.find(
    (part) => part.type === "month",
  )!.value;

  const day = parts.find(
    (part) => part.type === "day",
  )!.value;

  return `${year}-${month}-${day}`;
}

export function getBookingDateOptions(
  numberOfDays = 14,
): BookingDateOption[] {
  const result: BookingDateOption[] = [];

  const now = new Date();

  for (let index = 0; index < numberOfDays; index++) {
    const date = new Date(now);

    date.setDate(
      date.getDate() + index,
    );

    result.push({
      value: toSalonDate(date),

      day: DAY_FORMATTER
        .format(date)
        .replace(".", ""),

      dayNumber:
        new Intl.DateTimeFormat("fr-FR", {
          day: "2-digit",
          timeZone: "Africa/Tunis",
        }).format(date),

      month: MONTH_FORMATTER
        .format(date)
        .replace(".", ""),
    });
  }

  return result;
}