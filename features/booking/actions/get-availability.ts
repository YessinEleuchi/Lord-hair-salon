"use server";

import { getAvailableSlots } from "@/features/availability/engine/get-available-slots";

export async function getBookingAvailability(input: {
  staffId: string;
  serviceId: string;
  date: string;
}) {
  return getAvailableSlots(input);
}