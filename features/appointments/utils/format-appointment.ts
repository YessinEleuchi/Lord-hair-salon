const TIMEZONE = "Africa/Tunis";

export function formatAppointmentTime(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "fr-TN",
    {
      timeZone: TIMEZONE,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  ).format(date);
}

export function formatAppointmentDate(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "fr-TN",
    {
      timeZone: TIMEZONE,
      weekday: "short",
      day: "2-digit",
      month: "short",
    },
  ).format(date);
}

export function formatAppointmentLongDate(
  date: Date,
) {
  return new Intl.DateTimeFormat(
    "fr-TN",
    {
      timeZone: TIMEZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
    },
  ).format(date);
}