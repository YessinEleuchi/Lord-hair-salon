import type {
  AppointmentStatus,
} from "@/db/schema/enums";

type WhatsAppAppointment = {
  customerName: string;
  customerPhone: string;
  serviceName: string;
  date: string;
  time: string;
};

export type CustomerNotificationStatus =
  Extract<
    AppointmentStatus,
    "CONFIRMED" | "CANCELLED"
  >;

export function getCustomerWhatsAppUrl({
  status,
  appointment,
}: {
  status: CustomerNotificationStatus;
  appointment: WhatsAppAppointment;
}) {
  const phone =
    normalizeWhatsAppPhone(
      appointment.customerPhone,
    );

  const message =
    status === "CONFIRMED"
      ? getConfirmationMessage(
          appointment,
        )
      : getCancellationMessage(
          appointment,
        );

  return `https://wa.me/${phone}?text=${encodeURIComponent(
    message,
  )}`;
}

function normalizeWhatsAppPhone(
  phone: string,
) {
  let normalized =
    phone.replace(/\D/g, "");

  if (
    normalized.startsWith("00216")
  ) {
    normalized =
      normalized.slice(2);
  }

  if (
    normalized.length === 8
  ) {
    normalized =
      `216${normalized}`;
  }

  return normalized;
}

function getConfirmationMessage(
  appointment: WhatsAppAppointment,
) {
  return `Bonjour ${appointment.customerName},

Votre rendez-vous chez THE LORD Hair Salon est confirmé.

Date : ${appointment.date}
Heure : ${appointment.time}
Service : ${appointment.serviceName}

À bientôt chez THE LORD !`;
}

function getCancellationMessage(
  appointment: WhatsAppAppointment,
) {
  return `Bonjour ${appointment.customerName},

Votre demande de rendez-vous chez THE LORD Hair Salon n'a malheureusement pas pu être confirmée.

Date : ${appointment.date}
Heure : ${appointment.time}
Service : ${appointment.serviceName}

Vous pouvez choisir un autre créneau sur notre site.

Merci de votre compréhension.`;
}