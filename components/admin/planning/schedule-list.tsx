"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  CalendarOff,
  Clock3,
  Loader2,
  Trash2,
} from "lucide-react";

import {
  deleteScheduleOverride,
} from "@/features/planning/actions/schedule-override-actions";

type ScheduleOverride = {
  id: string;
  date: string;
  isClosed: boolean;
  startTime: string | null;
  endTime: string | null;
  reason: string | null;
};

type Props = {
  overrides:
    ScheduleOverride[];
};

export function ScheduleOverrideList({
  overrides,
}: Props) {
  if (
    overrides.length === 0
  ) {
    return (
      <section className="rounded-2xl border border-white/10 bg-surface px-4 py-8 text-center">
        <CalendarOff className="mx-auto size-5 text-white/20" />

        <p className="mt-3 text-sm font-medium text-white/50">
          Aucune exception
        </p>

        <p className="mt-1 text-xs text-white/25">
          Le planning hebdomadaire
          s&apos;applique normalement.
        </p>
      </section>
    );
  }

  return (
    <div className="space-y-2">
      {overrides.map(
        (override) => (
          <OverrideCard
            key={override.id}
            override={
              override
            }
          />
        ),
      )}
    </div>
  );
}

function OverrideCard({
  override,
}: {
  override:
    ScheduleOverride;
}) {
  const [
    confirmDelete,
    setConfirmDelete,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    pending,
    startTransition,
  ] = useTransition();

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setError(null);

    startTransition(async () => {
      const result =
        await deleteScheduleOverride(
          override.id,
        );

      if (!result.success) {
        setError(
          result.message,
        );

        setConfirmDelete(
          false,
        );
      }
    });
  }

  return (
    <article className="rounded-2xl border border-white/10 bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold capitalize text-white">
            {formatDate(
              override.date,
            )}
          </p>

          <div className="mt-2 flex items-center gap-2">
            {override.isClosed ? (
              <>
                <CalendarOff className="size-3.5 text-red-300" />

                <span className="text-xs font-medium text-red-300">
                  Fermé
                </span>
              </>
            ) : (
              <>
                <Clock3 className="size-3.5 text-brand" />

                <span className="text-xs font-medium text-brand">
                  {
                    override.startTime
                  }
                  {" → "}
                  {
                    override.endTime
                  }
                </span>
              </>
            )}
          </div>

          {override.reason && (
            <p className="mt-2 text-xs leading-5 text-white/30">
              {
                override.reason
              }
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={pending}
          onClick={
            handleDelete
          }
          className={`
            flex
            min-h-9
            shrink-0
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            px-2.5
            text-[11px]
            font-semibold
            transition
            disabled:opacity-50

            ${
              confirmDelete
                ? "border-red-500/20 bg-red-500/10 text-red-300"
                : "border-white/10 bg-white/[0.03] text-white/30 hover:text-red-300"
            }
          `}
        >
          {pending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}

          {confirmDelete
            ? "Confirmer"
            : "Supprimer"}
        </button>
      </div>

      {confirmDelete &&
        !pending && (
          <button
            type="button"
            onClick={() =>
              setConfirmDelete(
                false,
              )
            }
            className="mt-3 text-[11px] text-white/30 underline underline-offset-4"
          >
            Annuler la suppression
          </button>
        )}

      {error && (
        <p className="mt-3 text-xs text-red-300">
          {error}
        </p>
      )}
    </article>
  );
}

function formatDate(
  date: string,
) {
  const [
    year,
    month,
    day,
  ] = date
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat(
    "fr-TN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(
      year,
      month - 1,
      day,
    ),
  );
}