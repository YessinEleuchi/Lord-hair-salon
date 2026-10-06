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
  updateWorkingHour,
} from "@/features/planning/actions/update-working-hour";

type Props = {
  id: string;
  startTime: string;
  endTime: string;
  enabled: boolean;
};

export function WorkingHourRow({
  id,
  startTime: initialStart,
  endTime: initialEnd,
  enabled: initialEnabled,
}: Props) {
  const [
    startTime,
    setStartTime,
  ] = useState(initialStart);

  const [
    endTime,
    setEndTime,
  ] = useState(initialEnd);

  const [
    enabled,
    setEnabled,
  ] = useState(initialEnabled);

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

  function save() {
    if (pending) return;

    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result =
        await updateWorkingHour({
          id,
          startTime,
          endTime,
          enabled,
        });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 1800);
    });
  }

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium text-white/55">
          Créneau
        </p>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() =>
            setEnabled(
              (value) => !value,
            )
          }
          className={`
            relative
            h-6
            w-11
            shrink-0
            rounded-full
            transition
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
              size-4
              rounded-full
              bg-white
              transition
              ${
                enabled
                  ? "left-6"
                  : "left-1"
              }
            `}
          />
        </button>
      </div>

      <div
        className={`
          mt-3
          grid
          grid-cols-[1fr_auto_1fr]
          items-center
          gap-2
          transition
          ${
            enabled
              ? ""
              : "opacity-35"
          }
        `}
      >
        <TimeInput
          value={startTime}
          onChange={setStartTime}
          disabled={!enabled}
        />

        <span className="text-xs text-white/25">
          à
        </span>

        <TimeInput
          value={endTime}
          onChange={setEndTime}
          disabled={!enabled}
        />
      </div>

      {error && (
        <p className="mt-3 text-xs leading-5 text-red-300">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="
          mt-3
          flex
          min-h-10
          w-full
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-white/[0.06]
          px-3
          text-xs
          font-semibold
          text-white/60
          transition
          hover:bg-white/[0.1]
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
        ) : saved ? (
          <>
            <Check className="size-3.5 text-brand" />
            Enregistré
          </>
        ) : (
          "Enregistrer"
        )}
      </button>
    </div>
  );
}

function TimeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (
    value: string,
  ) => void;
  disabled: boolean;
}) {
  return (
    <input
      type="time"
      value={value}
      disabled={disabled}
      onChange={(event) =>
        onChange(
          event.target.value,
        )
      }
      className="
        min-h-11
        min-w-0
        w-full
        rounded-lg
        border
        border-white/10
        bg-background
        px-2
        text-center
        text-sm
        font-medium
        text-white
        outline-none
        transition
        focus:border-brand/50
        disabled:cursor-not-allowed
      "
    />
  );
}