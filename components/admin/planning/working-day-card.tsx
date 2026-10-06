"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  Loader2,
} from "lucide-react";

import {
  updateWorkingDay,
} from "@/features/planning/actions/update-working-hour";

import {
  StaffBreakEditor,
} from "@/components/admin/planning/staff-break-editor";

type BreakItem = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  label: string | null;
  enabled: boolean;
};

type Props = {
  staffId: string;

  dayOfWeek: number;

  label: string;

  workingHour:
    | {
        id: string;
        startTime: string;
        endTime: string;
        enabled: boolean;
      }
    | undefined;

  breaks: BreakItem[];
};

export function WorkingDayCard({
  staffId,
  dayOfWeek,
  label,
  workingHour,
  breaks,
}: Props) {
  const [
    enabled,
    setEnabled,
  ] = useState(
    workingHour?.enabled ??
      false,
  );

  const [
    startTime,
    setStartTime,
  ] = useState(
    workingHour?.startTime ??
      "09:00",
  );

  const [
    endTime,
    setEndTime,
  ] = useState(
    workingHour?.endTime ??
      "20:00",
  );

  const [
    pending,
    startTransition,
  ] = useTransition();

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    saved,
    setSaved,
  ] = useState(false);

  function showSaved() {
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1500);
  }

  function saveHours() {
    if (pending) return;

    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result =
        await updateWorkingDay({
          staffId,
          dayOfWeek,
          startTime,
          endTime,
          enabled: true,
        });

      if (!result.success) {
        setError(
          result.message,
        );

        return;
      }

      showSaved();
    });
  }

  function toggleDay() {
    if (pending) return;

    const nextEnabled =
      !enabled;

    setError(null);
    setSaved(false);

    // Optimistic UI
    setEnabled(nextEnabled);

    startTransition(async () => {
      const result =
        await updateWorkingDay({
          staffId,
          dayOfWeek,
          startTime,
          endTime,
          enabled:
            nextEnabled,
        });

      if (!result.success) {
        // Rollback UI
        setEnabled(
          !nextEnabled,
        );

        setError(
          result.message,
        );

        return;
      }

      showSaved();
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
      {/* HEADER */}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {label}
          </h2>

          <div className="mt-1 flex items-center gap-2">
            <span
              className={`
                size-1.5
                rounded-full
                ${
                  enabled
                    ? "bg-brand"
                    : "bg-white/20"
                }
              `}
            />

            <p
              className={`
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                ${
                  enabled
                    ? "text-brand"
                    : "text-white/25"
                }
              `}
            >
              {enabled
                ? "Ouvert"
                : "Fermé"}
            </p>

            {saved && (
              <span className="flex items-center gap-1 text-[10px] text-white/30">
                <Check className="size-3" />
                Enregistré
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-label={
            enabled
              ? `Fermer ${label}`
              : `Ouvrir ${label}`
          }
          aria-checked={enabled}
          disabled={pending}
          onClick={toggleDay}
          className={`
            relative
            h-7
            w-12
            shrink-0
            rounded-full
            transition
            disabled:opacity-50
            ${
              enabled
                ? "bg-brand"
                : "bg-white/10"
            }
          `}
        >
          <span
            className={`
              absolute
              top-1
              size-5
              rounded-full
              bg-white
              transition-all
              ${
                enabled
                  ? "left-6"
                  : "left-1"
              }
            `}
          />
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-500/15 bg-red-500/[0.05] px-3 py-2.5">
          <p className="text-xs leading-5 text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* CLOSED */}

      {!enabled && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
          <p className="text-xs leading-5 text-white/30">
            Aucune réservation ne
            sera proposée ce jour.
          </p>
        </div>
      )}

      {/* OPEN */}

      {enabled && (
        <>
          <div className="my-4 h-px bg-white/[0.06]" />

          {/* HOURS */}

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/25">
              Horaires
            </p>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <TimeInput
                value={
                  startTime
                }
                onChange={
                  setStartTime
                }
              />

              <span className="text-xs text-white/25">
                à
              </span>

              <TimeInput
                value={
                  endTime
                }
                onChange={
                  setEndTime
                }
              />
            </div>

            <button
              type="button"
              onClick={
                saveHours
              }
              disabled={
                pending
              }
              className="
                mt-3
                flex
                min-h-10
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-white/[0.06]
                px-4
                text-xs
                font-semibold
                text-white/60
                transition
                hover:bg-white/[0.09]
                hover:text-white
                disabled:pointer-events-none
                disabled:opacity-50
              "
            >
              {pending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les horaires"
              )}
            </button>
          </div>

          {/* BREAKS */}

          <div className="mt-5 border-t border-white/[0.06] pt-5">
            <StaffBreakEditor
              staffId={
                staffId
              }
              dayOfWeek={
                dayOfWeek
              }
              breaks={
                breaks
              }
            />
          </div>
        </>
      )}
    </section>
  );
}

function TimeInput({
  value,
  onChange,
}: {
  value: string;

  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <input
      type="time"
      value={value}
      onChange={(event) =>
        onChange(
          event.target.value,
        )
      }
      className="
        min-h-11
        min-w-0
        w-full
        rounded-xl
        border
        border-white/10
        bg-background
        px-3
        text-center
        text-sm
        font-medium
        text-white
        outline-none
        transition
        focus:border-brand/50
      "
    />
  );
}