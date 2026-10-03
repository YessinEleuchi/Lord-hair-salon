import type { ServiceItem } from "@/features/services/queries";

export type BookingStep =
  | "service"
  | "staff"
  | "date"
  | "time"
  | "customer"
  | "confirmation";

export type BookingState = {
  service: ServiceItem | null;

  staffId: string | null;

  date: string | null;

  time: string | null;

  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  };
};

export const INITIAL_BOOKING_STATE: BookingState = {
  service: null,

  staffId: null,

  date: null,

  time: null,

  customer: {
    firstName: "",
    lastName: "",
    phone: "",
  },
};