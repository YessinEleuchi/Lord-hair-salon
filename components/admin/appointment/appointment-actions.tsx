"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  CheckCircle2,
  Loader2,
  MessageCircle,
  X,
  XCircle,
} from "lucide-react";

import {
  cancelAppointment,
  confirmAppointment,
} from "@/features/appointments/actions/update-status";


import {
  getCustomerWhatsAppUrl,
  type CustomerNotificationStatus,
} from "@/features/appointments/utils/whatsapp";

type AppointmentActionsProps = {
  appointmentId: string;

  customerName: string;
  customerPhone: string;
  serviceName: string;

  date: string;
  time: string;
};

export function AppointmentActions({
  appointmentId,
  customerName,
  customerPhone,
  serviceName,
  date,
  time,
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

  const [
    decision,
    setDecision,
  ] =
    useState<CustomerNotificationStatus | null>(
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
        return;
      }

      setDecision("CONFIRMED");
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
        return;
      }

      setDecision("CANCELLED");
    });
  }

  const whatsappUrl =
    decision
      ? getCustomerWhatsAppUrl({
          status: decision,
          appointment: {
            customerName,
            customerPhone,
            serviceName,
            date,
            time,
          },
        })
      : null;

  return (
    <>
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

      {decision && whatsappUrl && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-black/70
            p-4
            backdrop-blur-sm
            sm:items-center
          "
          onClick={() =>
            setDecision(null)
          }
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-notification-title"
            className="
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-surface
              p-5
              shadow-2xl
              sm:p-6
            "
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between gap-4">
              <div
                className={`
                  flex
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${
                    decision ===
                    "CONFIRMED"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : "bg-red-500/10 text-red-300"
                  }
                `}
              >
                {decision ===
                "CONFIRMED" ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <XCircle className="size-5" />
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setDecision(null)
                }
                aria-label="Fermer"
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-white/40
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                <X className="size-4" />
              </button>
            </div>

            <h2
              id="customer-notification-title"
              className="mt-5 text-lg font-semibold tracking-[-0.03em] text-white"
            >
              {decision ===
              "CONFIRMED"
                ? "Rendez-vous confirmé"
                : "Rendez-vous refusé"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              {decision ===
              "CONFIRMED"
                ? `Le rendez-vous de ${customerName} a bien été confirmé.`
                : `La demande de ${customerName} a bien été refusée.`}
            </p>

            <p className="mt-1 text-sm leading-6 text-white/50">
              Informez maintenant le
              client sur WhatsApp.
            </p>

            <div className="mt-6 space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  setDecision(null)
                }
                className="
                  flex
                  min-h-12
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
                  active:scale-[0.99]
                "
              >
                <MessageCircle className="size-4" />

                Informer sur WhatsApp
              </a>

              <button
                type="button"
                onClick={() =>
                  setDecision(null)
                }
                className="
                  flex
                  min-h-11
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  px-4
                  text-sm
                  font-medium
                  text-white/50
                  transition
                  hover:bg-white/[0.04]
                  hover:text-white
                "
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}