import {
  asc,
  desc,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  appointments,
  customers,
  services,
  staff,
} from "@/db/schema";

const appointmentSelect = {
  id: appointments.id,
  startAt: appointments.startAt,
  endAt: appointments.endAt,
  blockedUntil: appointments.blockedUntil,
  price: appointments.price,
  status: appointments.status,
  cancelledAt: appointments.cancelledAt,
  cancellationReason:
    appointments.cancellationReason,

  customer: {
    id: customers.id,
    name: customers.name,
    phone: customers.phone,
  },

  service: {
    id: services.id,
    name: services.name,
    durationMinutes:
      services.durationMinutes,
  },

  staff: {
    id: staff.id,
    name: staff.name,
  },
};

function baseAppointmentQuery() {
  return db
    .select(appointmentSelect)
    .from(appointments)
    .innerJoin(
      customers,
      eq(
        appointments.customerId,
        customers.id,
      ),
    )
    .innerJoin(
      services,
      eq(
        appointments.serviceId,
        services.id,
      ),
    )
    .innerJoin(
      staff,
      eq(
        appointments.staffId,
        staff.id,
      ),
    );
}

export async function getPendingAppointments() {
  return baseAppointmentQuery()
    .where(
      eq(
        appointments.status,
        "PENDING",
      ),
    )
    .orderBy(
      asc(appointments.startAt),
    );
}

export async function getAllAppointments() {
  return baseAppointmentQuery()
    .orderBy(
      desc(appointments.startAt),
    );
}

export async function getAppointmentsByStatus(
  status:
    | "PENDING"
    | "CONFIRMED"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW",
) {
  return baseAppointmentQuery()
    .where(
      eq(
        appointments.status,
        status,
      ),
    )
    .orderBy(
      status === "CANCELLED"
        ? desc(appointments.startAt)
        : asc(appointments.startAt),
    );
}

export type AppointmentItem =
  Awaited<
    ReturnType<
      typeof getAllAppointments
    >
  >[number];

export type PendingAppointment =
  Awaited<
    ReturnType<
      typeof getPendingAppointments
    >
  >[number];