"use server";

import { TZDate } from "@date-fns/tz";
import {
  and,
  eq,
} from "drizzle-orm";

import { db } from "@/db";

import {
  appointments,
  customers,
  salonSettings,
  services,
} from "@/db/schema";

import { getAvailableSlots } from "@/features/availability/engine/get-available-slots";
import { normalizePhone } from "@/features/booking/utils/normalize-phone";

import {
  createBookingSchema,
  type CreateBookingInput,
} from "@/features/booking/schemas/create-booking.schema";

import type {
  CreateBookingResult,
} from "./types";

export async function createBooking(
  rawInput: CreateBookingInput,
): Promise<CreateBookingResult> {
  const parsed =
    createBookingSchema.safeParse(
      rawInput,
    );

  if (!parsed.success) {
    return {
      success: false,
      code: "VALIDATION_ERROR",
      message:
        parsed.error.issues[0]
          ?.message ??
        "Informations invalides.",
    };
  }

  const input = parsed.data;

  try {
    // ─────────────────────────────────────────────
    // SETTINGS
    // ─────────────────────────────────────────────

    const [settings] = await db
      .select()
      .from(salonSettings)
      .limit(1);

    if (!settings) {
      return {
        success: false,
        code: "UNKNOWN_ERROR",
        message:
          "Configuration du salon introuvable.",
      };
    }

    if (!settings.bookingEnabled) {
      return {
        success: false,
        code: "BOOKING_DISABLED",
        message:
          "Les réservations sont temporairement indisponibles.",
      };
    }

    // ─────────────────────────────────────────────
    // RECHECK AVAILABILITY
    // ─────────────────────────────────────────────

    const availability =
      await getAvailableSlots({
        staffId: input.staffId,
        serviceId: input.serviceId,
        date: input.date,
      });

    const selectedSlot =
      availability.sessions
        .flatMap(
          (session) =>
            session.slots,
        )
        .find(
          (slot) =>
            slot.start ===
            input.time,
        );

    if (!selectedSlot) {
      return {
        success: false,
        code: "SLOT_UNAVAILABLE",
        message:
          "Ce créneau n'est plus disponible. Veuillez en choisir un autre.",
      };
    }

    // ─────────────────────────────────────────────
    // SERVICE
    // ─────────────────────────────────────────────

    const [service] = await db
      .select({
        id: services.id,
        price: services.price,
      })
      .from(services)
      .where(
        and(
          eq(
            services.id,
            input.serviceId,
          ),
          eq(
            services.active,
            true,
          ),
        ),
      )
      .limit(1);

    if (!service) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        message:
          "Le service sélectionné n'est plus disponible.",
      };
    }

    // ─────────────────────────────────────────────
    // DATE / TIME
    // ─────────────────────────────────────────────

    const [
      year,
      month,
      day,
    ] = input.date
      .split("-")
      .map(Number);

    const [
      hours,
      minutes,
    ] = input.time
      .split(":")
      .map(Number);

    const startAt =
      new TZDate(
        year,
        month - 1,
        day,
        hours,
        minutes,
        0,
        0,
        settings.timezone,
      );

    const [
      endHours,
      endMinutes,
    ] = selectedSlot.end
      .split(":")
      .map(Number);

    const endAt =
      new TZDate(
        year,
        month - 1,
        day,
        endHours,
        endMinutes,
        0,
        0,
        settings.timezone,
      );

    const [
      blockedHours,
      blockedMinutes,
    ] =
      selectedSlot.blockedUntil
        .split(":")
        .map(Number);

    const blockedUntil =
      new TZDate(
        year,
        month - 1,
        day,
        blockedHours,
        blockedMinutes,
        0,
        0,
        settings.timezone,
      );

    // ─────────────────────────────────────────────
    // CUSTOMER
    // ─────────────────────────────────────────────

    const customerName =
      `${input.firstName} ${input.lastName}`
        .replace(/\s+/g, " ")
        .trim();

    const normalizedPhone =
      normalizePhone(
        input.phone,
      );

    if (
      !/^\+216\d{8}$/.test(
        normalizedPhone,
      )
    ) {
      return {
        success: false,
        code: "VALIDATION_ERROR",
        message:
          "Veuillez saisir un numéro de téléphone tunisien valide.",
      };
    }

    // ─────────────────────────────────────────────
    // TRANSACTION
    // ─────────────────────────────────────────────

    const appointment =
      await db.transaction(
        async (tx) => {
          const [
            existingCustomer,
          ] = await tx
            .select()
            .from(customers)
            .where(
              and(
                eq(
                  customers.phone,
                  normalizedPhone,
                ),
                eq(
                  customers.name,
                  customerName,
                ),
              ),
            )
            .limit(1);

          let customerId: string;

          if (existingCustomer) {
            customerId =
              existingCustomer.id;
          } else {
            const [
              newCustomer,
            ] = await tx
              .insert(customers)
              .values({
                name:
                  customerName,
                phone:
                  normalizedPhone,
              })
              .returning({
                id: customers.id,
              });

            customerId =
              newCustomer.id;
          }

          const [
            createdAppointment,
          ] = await tx
            .insert(appointments)
            .values({
              customerId,

              staffId:
                input.staffId,

              serviceId:
                input.serviceId,

              startAt,
              endAt,
              blockedUntil,

              price:
                service.price,

              status:
                settings.autoConfirmAppointments
                  ? "CONFIRMED"
                  : "PENDING",
            })
            .returning({
              id: appointments.id,
              status:
                appointments.status,
            });

          return createdAppointment;
        },
      );

    return {
      success: true,
      appointmentId:
        appointment.id,
      status:
        appointment.status,
    };
  } catch (error) {
    console.error(
      "Create booking error:",
      error,
    );

    return {
      success: false,
      code: "DATABASE_CONFLICT",
      message:
        "Ce créneau vient peut-être d'être réservé. Veuillez choisir un autre horaire.",
    };
  }
}