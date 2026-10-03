import type { Metadata } from "next";

import { BookingFlow } from "@/components/booking/booking-flow";
import { getActiveServices } from "@/features/services/queries";
import { getActiveStaffWithServices } from "@/features/staff/queries";

export const metadata: Metadata = {
  title: "Réserver",
  description:
    "Réservez votre rendez-vous chez THE LORD Hair Salon à Sfax.",
};

type BookingPageProps = {
  searchParams: Promise<{
    service?: string;
  }>;
};

export default async function BookingPage({
  searchParams,
}: BookingPageProps) {
  const params = await searchParams;

  const [services, staff] = await Promise.all([
  getActiveServices(),
  getActiveStaffWithServices(),
]);

  const initialService =
    services.find(
      (service) =>
        service.slug === params.service,
    ) ?? null;

  return (
    <section
      className="
        min-h-screen
        bg-background
        pt-32

        sm:pt-36
        lg:pt-40
      "
    >
      <div
        className="
          mx-auto
          max-w-[var(--page-max-width)]
          px-5
          pb-20

          sm:px-8
          lg:px-10
          lg:pb-28
        "
      >
        {/* PAGE HEADER */}
        <div
          className="
            mb-10
            max-w-3xl

            lg:mb-14
          "
        >
          <p
            className="
              font-mono
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-brand
            "
          >
            Rendez-vous
          </p>

          <h1
            className="
              mt-4
              text-4xl
              font-semibold
              uppercase
              leading-[0.95]
              tracking-[-0.05em]
              text-white

              sm:text-5xl
              lg:text-6xl
            "
          >
            Réservez votre
            <span className="block text-brand">
              prochain passage.
            </span>
          </h1>

          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-white/45

              sm:text-base
            "
          >
            Choisissez votre prestation, votre
            coiffeur et le créneau qui vous
            convient.
          </p>
        </div>

        {/* BOOKING */}
        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-background-soft
            p-5

            sm:p-7
            lg:p-10
          "
        >
          <BookingFlow
  services={services}
  staff={staff}
  initialService={initialService}
/>
        </div>
      </div>
    </section>
  );
}