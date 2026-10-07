import {
  CalendarDays,
} from "lucide-react";

import {
  CalendarDayHeader,
} from "@/components/admin/calendar/calendar-day-header";

import {
  CalendarDayView,
} from "@/components/admin/calendar/calendar-day-view";

import {
  CalendarMonth,
} from "@/components/admin/calendar/calendar-month";

import {
  CalendarScheduleBanner,
} from "@/components/admin/calendar/calendar-schedule-banner";

import {
  getCalendarDay,
  getCalendarMonth,
} from "@/features/calendar/queries";

const TIMEZONE =
  "Africa/Tunis";

type PageProps = {
  searchParams: Promise<{
    date?: string;
  }>;
};

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

function isValidDate(
  value?: string,
) {
  if (
    !value ||
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  ) {
    return false;
  }

  const [year, month, day] =
    value
      .split("-")
      .map(Number);

  const parsed =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
      ),
    );

  return (
    parsed.getUTCFullYear() ===
      year &&
    parsed.getUTCMonth() ===
      month - 1 &&
    parsed.getUTCDate() ===
      day
  );
}

export default async function CalendarPage({
  searchParams,
}: PageProps) {
  const params =
    await searchParams;

  const date =
    isValidDate(params.date)
      ? params.date!
      : getToday();

  const [
    year,
    month,
  ] = date
    .split("-")
    .map(Number);

  const [
    data,
    monthDays,
  ] = await Promise.all([
    getCalendarDay(date),

    getCalendarMonth(
      year,
      month,
    ),
  ]);

  const activeAppointments =
    data.appointments.filter(
      (appointment) =>
        appointment.status !==
        "CANCELLED",
    );

  const pendingCount =
    activeAppointments.filter(
      (appointment) =>
        appointment.status ===
        "PENDING",
    ).length;

  const confirmedCount =
    activeAppointments.filter(
      (appointment) =>
        appointment.status ===
        "CONFIRMED",
    ).length;

  return (
    <div className="min-w-0">
      {/* Heading */}
      <section>
        <div className="flex items-start gap-3">
          <div
            className="
              mt-0.5
              hidden
              size-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-brand/10
              text-brand
              sm:flex
            "
          >
            <CalendarDays className="size-5" />
          </div>

          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-brand">
              Gestion
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.045em] text-white sm:text-3xl">
              Calendrier
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
              Consultez le planning,
              les pauses et les
              rendez-vous de la
              journée.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation journalière */}
      <section className="mt-6">
        <CalendarDayHeader
          date={date}
        />
      </section>

      {/* Statistiques */}
      <section className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard
          label="Rendez-vous"
          value={
            activeAppointments.length
          }
        />

        <StatCard
          label="Confirmés"
          value={
            confirmedCount
          }
        />

        <StatCard
          label="En attente"
          value={
            pendingCount
          }
          highlighted={
            pendingCount > 0
          }
        />
      </section>

      {/* Calendrier mensuel */}
      <section className="mt-3">
        <CalendarMonth
          selectedDate={date}
          days={monthDays}
        />
      </section>

      {/* Planning effectif */}
      <section className="mt-3">
        <CalendarScheduleBanner
          data={data}
        />
      </section>

      {/* Agenda */}
      <section className="mt-6">
        <CalendarDayView
          data={data}
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlighted = false,
}: {
  label: string;
  value: number;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`
        min-w-0
        rounded-xl
        border
        px-3
        py-3
        sm:rounded-2xl
        sm:px-4
        sm:py-4
        ${
          highlighted
            ? "border-brand/20 bg-brand/[0.05]"
            : "border-white/10 bg-surface"
        }
      `}
    >
      <p
        className={`
          text-lg
          font-semibold
          tracking-[-0.04em]
          sm:text-xl
          ${
            highlighted
              ? "text-brand"
              : "text-white"
          }
        `}
      >
        {value}
      </p>

      <p className="mt-1 truncate text-[9px] uppercase tracking-[0.08em] text-white/30 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}