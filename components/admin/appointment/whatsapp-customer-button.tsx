"use client";

import {
  MessageCircle,
} from "lucide-react";

import {
  getCustomerWhatsAppUrl,
  type CustomerNotificationStatus,
} from "@/features/appointments/utils/whatsapp";

type Props = {
  status: CustomerNotificationStatus;

  customerName: string;
  customerPhone: string;
  serviceName: string;

  date: string;
  time: string;
};

export function WhatsAppCustomerButton({
  status,
  customerName,
  customerPhone,
  serviceName,
  date,
  time,
}: Props) {
  const url =
    getCustomerWhatsAppUrl({
      status,
      appointment: {
        customerName,
        customerPhone,
        serviceName,
        date,
        time,
      },
    });

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        inline-flex
        min-h-11
        w-full
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-white/10
        bg-white/[0.04]
        px-4
        text-sm
        font-semibold
        text-white
        transition
        hover:border-white/20
        hover:bg-white/[0.08]
        active:scale-[0.99]
        sm:w-auto
      "
    >
      <MessageCircle className="size-4" />

      {status === "CONFIRMED"
        ? "Informer le client"
        : "Informer du refus"}
    </a>
  );
}