"use client";

import {
  Loader2,
  Phone,
  User,
} from "lucide-react";

import type {
  BookingState,
} from "@/features/booking/types";

type CustomerData =
  BookingState["customer"];

type CustomerStepProps = {
  customer: CustomerData;
  loading: boolean;
  error: string | null;

  onChange: (
    customer: CustomerData,
  ) => void;

  onSubmit: () => void;
  onBack: () => void;
};

export function CustomerStep({
  customer,
  loading,
  error,
  onChange,
  onSubmit,
  onBack,
}: CustomerStepProps) {
  function update(
    field: keyof CustomerData,
    value: string,
  ) {
    onChange({
      ...customer,
      [field]: value,
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        className="mb-4 text-xs font-medium text-white/35 transition-colors hover:text-brand disabled:opacity-50"
      >
        ← Modifier l&apos;heure
      </button>

      <div className="mb-8">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-brand">
          Étape 05
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
          Vos informations
        </h2>

        <p className="mt-2 text-sm text-white/40">
          Quelques informations pour finaliser
          votre demande de rendez-vous.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Prénom"
          required
        >
          <div className="relative">
            <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

            <input
              value={customer.firstName}
              onChange={(event) =>
                update(
                  "firstName",
                  event.target.value,
                )
              }
              placeholder="Votre prénom"
              autoComplete="given-name"
              className={inputClass}
            />
          </div>
        </Field>

        <Field
          label="Nom"
          required
        >
          <div className="relative">
            <User className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

            <input
              value={customer.lastName}
              onChange={(event) =>
                update(
                  "lastName",
                  event.target.value,
                )
              }
              placeholder="Votre nom"
              autoComplete="family-name"
              className={inputClass}
            />
          </div>
        </Field>

        <Field
          label="Téléphone"
          required
        >
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

            <input
              type="tel"
              value={customer.phone}
              onChange={(event) =>
                update(
                  "phone",
                  event.target.value,
                )
              }
              placeholder="+216 XX XXX XXX"
              autoComplete="tel"
              className={inputClass}
            />
          </div>
        </Field>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="
          mt-8
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-brand
          px-6
          py-4
          text-sm
          font-semibold
          text-black
          transition
          hover:bg-brand-hover
          disabled:cursor-not-allowed
          disabled:opacity-50
          sm:w-auto
        "
      >
        {loading && (
          <Loader2 className="size-4 animate-spin" />
        )}

        {loading
          ? "Réservation..."
          : "Demander le rendez-vous"}
      </button>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-white/55">
        {label}

        {required && (
          <span className="ml-1 text-brand">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

const inputClass = `
  w-full
  rounded-xl
  border
  border-white/10
  bg-surface
  py-3
  pl-11
  pr-4
  text-sm
  text-white
  outline-none
  transition
  placeholder:text-white/20
  focus:border-brand
`;