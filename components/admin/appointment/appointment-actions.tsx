"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  Loader2,
  X,
} from "lucide-react";

import {
  cancelAppointment,
  confirmAppointment,
} from "@/features/appointments/actions/update-status";

type AppointmentActionsProps = {
  appointmentId: string;
};

export function AppointmentActions({
  appointmentId,
}: AppointmentActionsProps) {
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

  function confirm() {
    if (pending) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result =
        await confirmAppointment(
          appointmentId,
        );

      if (!result.success) {
        setError(result.message);
      }
    });
  }

  function cancel() {
    if (pending) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result =
        await cancelAppointment(
          appointmentId,
        );

      if (!result.success) {
        setError(result.message);
      }
    });
  }

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={cancel}
          disabled={pending}
          className="
            flex
            min-h-11
            touch-manipulation
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-white/10
            px-3
            text-sm
            font-medium
            text-white/55
            transition
            hover:border-red-500/30
            hover:bg-red-500/[0.06]
            hover:text-red-300
            active:scale-[0.99]
            disabled:pointer-events-none
            disabled:opacity-50
          "
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <X className="size-4" />
          )}

          Refuser
        </button>

        <button
          type="button"
          onClick={confirm}
          disabled={pending}
          className="
            flex
            min-h-11
            touch-manipulation
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-brand
            px-3
            text-sm
            font-semibold
            text-black
            transition
            hover:bg-brand-hover
            active:scale-[0.99]
            disabled:pointer-events-none
            disabled:opacity-50
          "
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Check className="size-4" />
          )}

          Confirmer
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5">
          <p className="text-xs leading-5 text-red-300">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}