"use client";

import { useState } from "react";

import { BookingProgress } from "@/components/booking/booking-progress";
import { CustomerStep } from "@/components/booking/steps/customer-step";
import { DateStep } from "@/components/booking/steps/date-step";
import { ServiceStep } from "@/components/booking/steps/service-step";
import { StaffStep } from "@/components/booking/steps/staff-step";
import { TimeStep } from "@/components/booking/steps/time-step";

import {
  createBooking,
} from "@/features/booking/actions/create-booking";

import {
  getBookingAvailability,
} from "@/features/booking/actions/get-availability";

import type {
  AvailabilityResult,
} from "@/features/availability/engine/availability.types";

import {
  INITIAL_BOOKING_STATE,
  type BookingState,
  type BookingStep,
} from "@/features/booking/types";

import type { ServiceItem } from "@/features/services/queries";
import type { StaffItem } from "@/features/staff/queries";

type BookingFlowProps = {
  services: ServiceItem[];
  staff: StaffItem[];
  initialService?: ServiceItem | null;
};

export function BookingFlow({
  services,
  staff,
  initialService = null,
}: BookingFlowProps) {
  const [currentStep, setCurrentStep] =
    useState<BookingStep>("service");

  const [booking, setBooking] =
    useState<BookingState>({
      ...INITIAL_BOOKING_STATE,
      service: initialService,
    });

  const [availability, setAvailability] =
    useState<AvailabilityResult | null>(
      null,
    );

  const [
    loadingAvailability,
    setLoadingAvailability,
  ] = useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [
    bookingError,
    setBookingError,
  ] = useState<string | null>(null);

  const [
    appointmentId,
    setAppointmentId,
  ] = useState<string | null>(null);

  // =========================================================
  // AVAILABLE STAFF
  // =========================================================

  const availableStaff = booking.service
    ? staff.filter((member) =>
        member.serviceIds.includes(
          booking.service!.id,
        ),
      )
    : [];

  // =========================================================
  // DATE HELPERS
  // =========================================================

  function formatLocalDate(date: Date) {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");

    const day = String(
      date.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function parseLocalDate(
    value: string | null,
  ): Date | undefined {
    if (!value) {
      return undefined;
    }

    const [year, month, day] = value
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day,
    );
  }

  // =========================================================
  // SERVICE
  // =========================================================

  function selectService(
    service: ServiceItem,
  ) {
    setBooking((current) => ({
      ...current,
      service,
      staffId: null,
      date: null,
      time: null,
    }));

    setAvailability(null);
    setBookingError(null);

    setCurrentStep("staff");
  }

  // =========================================================
  // STAFF
  // =========================================================

  function selectStaff(
    member: StaffItem,
  ) {
    setBooking((current) => ({
      ...current,
      staffId: member.id,
      date: null,
      time: null,
    }));

    setAvailability(null);
    setBookingError(null);

    setCurrentStep("date");
  }

  // =========================================================
  // DATE
  // =========================================================

  async function selectDate(
    selectedDate: Date,
  ) {
    if (
      !booking.service ||
      !booking.staffId
    ) {
      return;
    }

    const date =
      formatLocalDate(selectedDate);

    setBooking((current) => ({
      ...current,
      date,
      time: null,
    }));

    setAvailability(null);
    setBookingError(null);
    setLoadingAvailability(true);

    try {
      const result =
        await getBookingAvailability({
          staffId:
            booking.staffId,

          serviceId:
            booking.service.id,

          date,
        });

      setAvailability(result);

      setCurrentStep("time");
    } catch (error) {
      console.error(
        "Failed to load availability:",
        error,
      );

      setBookingError(
        "Impossible de charger les disponibilités.",
      );
    } finally {
      setLoadingAvailability(false);
    }
  }

  // =========================================================
  // TIME
  // =========================================================

  function selectTime(time: string) {
    setBooking((current) => ({
      ...current,
      time,
    }));

    setBookingError(null);

    setCurrentStep("customer");
  }

  // =========================================================
  // CUSTOMER
  // =========================================================

  function updateCustomer(
    customer: BookingState["customer"],
  ) {
    setBooking((current) => ({
      ...current,
      customer,
    }));

    setBookingError(null);
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  async function submitBooking() {
    if (
      !booking.service ||
      !booking.staffId ||
      !booking.date ||
      !booking.time
    ) {
      setBookingError(
        "Les informations du rendez-vous sont incomplètes.",
      );

      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const result =
        await createBooking({
          serviceId:
            booking.service.id,

          staffId:
            booking.staffId,

          date:
            booking.date,

          time:
            booking.time,

          firstName:
            booking.customer.firstName,

          lastName:
            booking.customer.lastName,

          phone:
            booking.customer.phone,
        });

      if (!result.success) {
        setBookingError(
          result.message,
        );

        if (
          result.code ===
            "SLOT_UNAVAILABLE" ||
          result.code ===
            "DATABASE_CONFLICT"
        ) {
          setAvailability(null);

          setBooking((current) => ({
            ...current,
            time: null,
          }));

          setCurrentStep("date");
        }

        return;
      }

      setAppointmentId(
        result.appointmentId,
      );

      setCurrentStep(
        "confirmation",
      );
    } catch (error) {
      console.error(
        "Submit booking error:",
        error,
      );

      setBookingError(
        "Une erreur est survenue. Veuillez réessayer.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>
      <div className="border-b border-white/10 pb-4 sm:pb-7">
        <BookingProgress
          currentStep={currentStep}
        />
      </div>

      <div className="pt-6 sm:pt-10">
        {/* 01 — SERVICE */}

        {currentStep === "service" && (
          <ServiceStep
            services={services}
            selectedService={
              booking.service
            }
            onSelect={selectService}
          />
        )}

        {/* 02 — STAFF */}

        {currentStep === "staff" && (
          <StaffStep
            staff={availableStaff}
            selectedStaffId={
              booking.staffId
            }
            onSelect={selectStaff}
            onBack={() =>
              setCurrentStep(
                "service",
              )
            }
          />
        )}

        {/* 03 — DATE */}

        {currentStep === "date" && (
          <DateStep
            selectedDate={parseLocalDate(
              booking.date,
            )}
            loading={
              loadingAvailability
            }
            onSelect={selectDate}
            onBack={() =>
              setCurrentStep(
                "staff",
              )
            }
          />
        )}

        {/* 04 — TIME */}

        {currentStep === "time" && (
          <TimeStep
            availability={
              availability
            }
            selectedTime={
              booking.time
            }
            onSelect={selectTime}
            onBack={() =>
              setCurrentStep(
                "date",
              )
            }
          />
        )}

        {/* 05 — CUSTOMER */}

        {currentStep ===
          "customer" && (
          <CustomerStep
            customer={
              booking.customer
            }
            loading={submitting}
            error={bookingError}
            onChange={
              updateCustomer
            }
            onSubmit={
              submitBooking
            }
            onBack={() =>
              setCurrentStep(
                "time",
              )
            }
          />
        )}

        {/* 06 — CONFIRMATION */}

        {currentStep ===
          "confirmation" && (
          <div className="mx-auto max-w-xl py-6 text-center sm:py-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand text-2xl font-bold text-black">
              ✓
            </div>

            <p className="mt-7 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
              Demande envoyée
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
              Votre rendez-vous a bien
              été enregistré.
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/45">
              Votre demande a été
              transmise à THE LORD Hair
              Salon. Le salon pourra
              confirmer votre
              rendez-vous.
            </p>

            <div className="mt-8 rounded-xl border border-white/10 bg-surface p-5 text-left">
              <div className="space-y-4">
                <BookingSummaryRow
                  label="Service"
                  value={
                    booking.service
                      ?.name ?? "—"
                  }
                />

                <BookingSummaryRow
                  label="Date"
                  value={
                    booking.date ??
                    "—"
                  }
                />

                <BookingSummaryRow
                  label="Heure"
                  value={
                    booking.time ??
                    "—"
                  }
                />

                <BookingSummaryRow
                  label="Prix"
                  value={
                    booking.service
                      ? `${Number(
                          booking
                            .service
                            .price,
                        )} DT`
                      : "—"
                  }
                />
              </div>
            </div>

            {appointmentId && (
              <p className="mt-5 font-mono text-[10px] text-white/20">
                Référence :{" "}
                {appointmentId}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingSummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-white/[0.06] pb-4 last:border-none last:pb-0">
      <span className="text-sm text-white/35">
        {label}
      </span>

      <span className="text-right text-sm font-semibold text-white">
        {value}
      </span>
    </div>
  );
}