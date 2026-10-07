"use client";

import {
  CheckCircle2,
  MessageCircle,
  X,
  XCircle,
} from "lucide-react";

import {
  useCustomerNotification,
} from "@/components/admin/customer-notification/customer-notification-provider";

import {
  APPOINTMENT_STATUS,
} from "@/db/schema/enums";

import {
  getCustomerWhatsAppUrl,
} from "@/features/appointments/utils/whatsapp";

export function CustomerNotificationModal() {
  const {
    notification,
    closeCustomerNotification,
  } =
    useCustomerNotification();

  if (!notification) {
    return null;
  }

  const confirmed =
    notification.status ===
    APPOINTMENT_STATUS.CONFIRMED;

  const whatsappUrl =
    getCustomerWhatsAppUrl({
      status:
        notification.status,

      appointment: {
        customerName:
          notification.customerName,

        customerPhone:
          notification.customerPhone,

        serviceName:
          notification.serviceName,

        date:
          notification.date,

        time:
          notification.time,
      },
    });

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        p-3
        sm:items-center
        sm:p-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-notification-title"
    >
      <button
        type="button"
        aria-label="Fermer"
        onClick={
          closeCustomerNotification
        }
        className="
          absolute
          inset-0
          bg-black/75
          backdrop-blur-sm
        "
      />

      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          rounded-2xl
          border
          border-white/10
          bg-surface
          p-5
          shadow-2xl
          sm:p-6
        "
      >
        <button
          type="button"
          onClick={
            closeCustomerNotification
          }
          aria-label="Fermer"
          className="
            absolute
            right-3
            top-3
            flex
            size-9
            items-center
            justify-center
            rounded-lg
            text-white/35
            transition
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <X className="size-4" />
        </button>

        <div
          className={`
            flex
            size-12
            items-center
            justify-center
            rounded-xl
            ${
              confirmed
                ? "bg-emerald-500/10 text-emerald-300"
                : "bg-red-500/10 text-red-300"
            }
          `}
        >
          {confirmed ? (
            <CheckCircle2 className="size-6" />
          ) : (
            <XCircle className="size-6" />
          )}
        </div>

        <h2
          id="customer-notification-title"
          className="
            mt-4
            text-lg
            font-semibold
            tracking-[-0.025em]
            text-white
          "
        >
          {confirmed
            ? "Rendez-vous confirmé"
            : "Rendez-vous refusé"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-white/45">
          {confirmed
            ? "Le rendez-vous a été confirmé. Vous pouvez maintenant informer le client sur WhatsApp."
            : "La demande a été refusée. Vous pouvez maintenant informer le client sur WhatsApp."}
        </p>

        <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
          <p className="truncate text-sm font-semibold text-white">
            {
              notification.customerName
            }
          </p>

          <p className="mt-1 truncate text-xs text-white/35">
            {
              notification.serviceName
            }
          </p>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/45">
            <span>
              {notification.date}
            </span>

            <span>
              {notification.time}
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          <button
            type="button"
            onClick={
              closeCustomerNotification
            }
            className="
              min-h-11
              rounded-xl
              border
              border-white/10
              px-4
              text-sm
              font-medium
              text-white/60
              transition
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            Fermer
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={
              closeCustomerNotification
            }
            className="
              flex
              min-h-11
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
        </div>
      </div>
    </div>
  );
}