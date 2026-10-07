import {
  pgEnum,
} from "drizzle-orm/pg-core";

export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export const appointmentStatusEnum =
  pgEnum(
    "appointment_status",
    [
      APPOINTMENT_STATUS.PENDING,
      APPOINTMENT_STATUS.CONFIRMED,
      APPOINTMENT_STATUS.CANCELLED,
    ],
  );

export type AppointmentStatus =
  (typeof appointmentStatusEnum.enumValues)[number];