"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  CalendarPlus,
  Loader2,
} from "lucide-react";

import {
  saveScheduleOverride,
} from "@/features/planning/actions/schedule-override-actions";

type Props = {
  staffId: string;
};

export function ScheduleOverrideForm({
  staffId,
}: Props) {
  const [
    date,
    setDate,
  ] = useState("");

  const [
    isClosed,
    setIsClosed,
  ] = useState(true);

  const [
    startTime,
    setStartTime,
  ] = useState("09:00");

  const [
    endTime,
    setEndTime,
  ] = useState("20:00");

  const [
    reason,
    setReason,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    success,
    setSuccess,
  ] = useState(false);

  const [
    pending,
    startTransition,
  ] = useTransition();

  function handleSubmit() {
    if (pending) return;

    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result =
        await saveScheduleOverride({
          staffId,
          date,
          isClosed,

          startTime:
            isClosed
              ? undefined
              : startTime,

          endTime:
            isClosed
              ? undefined
              : endTime,

          reason,
        });

      if (!result.success) {
        setError(
          result.message,
        );

        return;
      }

      setSuccess(true);

      setDate("");
      setReason("");

      window.setTimeout(() => {
        setSuccess(false);
      }, 2000);
    });
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <CalendarPlus className="size-4" />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-white">
            Ajouter une exception
          </h2>

          <p className="mt-1 text-xs leading-5 text-white/35">
            Modifiez le planning
            uniquement pour une date
            précise.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <FieldLabel>
          Date
        </FieldLabel>

        <input
          type="date"
          value={date}
          onChange={(event) =>
            setDate(
              event.target.value,
            )
          }
          className={inputClass}
        />
      </div>

      <div className="mt-4">
        <FieldLabel>
          Type
        </FieldLabel>

        <div className="grid grid-cols-2 gap-2">
          <TypeButton
            active={isClosed}
            onClick={() =>
              setIsClosed(true)
            }
          >
            Fermé
          </TypeButton>

          <TypeButton
            active={!isClosed}
            onClick={() =>
              setIsClosed(false)
            }
          >
            Horaires spéciaux
          </TypeButton>
        </div>
      </div>

      {!isClosed && (
        <div className="mt-4">
          <FieldLabel>
            Horaires
          </FieldLabel>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <input
              type="time"
              value={startTime}
              onChange={(event) =>
                setStartTime(
                  event.target.value,
                )
              }
              className={inputClass}
            />

            <span className="text-xs text-white/25">
              à
            </span>

            <input
              type="time"
              value={endTime}
              onChange={(event) =>
                setEndTime(
                  event.target.value,
                )
              }
              className={inputClass}
            />
          </div>
        </div>
      )}

      <div className="mt-4">
        <FieldLabel>
          Raison
          <span className="ml-1 font-normal normal-case tracking-normal text-white/20">
            optionnel
          </span>
        </FieldLabel>

        <input
          type="text"
          value={reason}
          onChange={(event) =>
            setReason(
              event.target.value,
            )
          }
          maxLength={150}
          placeholder={
            isClosed
              ? "Ex. repos exceptionnel"
              : "Ex. ouverture exceptionnelle"
          }
          className={inputClass}
        />
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-500/15 bg-red-500/[0.05] px-3 py-2.5">
          <p className="text-xs leading-5 text-red-300">
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-xl border border-brand/15 bg-brand/[0.05] px-3 py-2.5">
          <p className="text-xs text-brand">
            Exception enregistrée.
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={
          pending ||
          !date
        }
        onClick={
          handleSubmit
        }
        className="
          mt-5
          flex
          min-h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-brand
          px-4
          text-sm
          font-semibold
          text-black
          transition
          hover:bg-brand-hover
          disabled:pointer-events-none
          disabled:opacity-40
        "
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          "Enregistrer l'exception"
        )}
      </button>
    </section>
  );
}

function FieldLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
      {children}
    </label>
  );
}

function TypeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;

  onClick: () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-11
        rounded-xl
        border
        px-3
        text-xs
        font-semibold
        transition

        ${
          active
            ? "border-brand/40 bg-brand/10 text-brand"
            : "border-white/10 bg-white/[0.02] text-white/40 hover:bg-white/[0.05]"
        }
      `}
    >
      {children}
    </button>
  );
}

const inputClass = `
  min-h-11
  w-full
  min-w-0
  rounded-xl
  border
  border-white/10
  bg-background
  px-3
  text-sm
  text-white
  outline-none
  transition
  placeholder:text-white/20
  focus:border-brand/50
`;