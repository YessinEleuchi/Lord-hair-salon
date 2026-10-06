"use client";

import {
  useActionState,
} from "react";

import {
  LockKeyhole,
  Loader2,
  Mail,
} from "lucide-react";

import {
  login,
  type LoginState,
} from "@/app/auth/actions";

const initialState: LoginState = {
  error: null,
};

export function AdminLoginForm() {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    login,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="mt-8 space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-medium text-white/55"
        >
          Email
        </label>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            required
            placeholder="admin@thelord.tn"
            className="
              min-h-12
              w-full
              rounded-xl
              border
              border-white/10
              bg-surface
              py-3
              pl-11
              pr-4
              text-base
              text-white
              outline-none
              transition
              placeholder:text-white/20
              focus:border-brand
              sm:text-sm
            "
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs font-medium text-white/55"
        >
          Mot de passe
        </label>

        <div className="relative">
          <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/25" />

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="
              min-h-12
              w-full
              rounded-xl
              border
              border-white/10
              bg-surface
              py-3
              pl-11
              pr-4
              text-base
              text-white
              outline-none
              transition
              placeholder:text-white/20
              focus:border-brand
              sm:text-sm
            "
          />
        </div>
      </div>

      {state.error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
          <p className="text-sm text-red-300">
            {state.error}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="
          flex
          min-h-12
          w-full
          touch-manipulation
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-brand
          px-5
          py-3
          text-sm
          font-semibold
          text-black
          transition
          hover:bg-brand-hover
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
      >
        {pending && (
          <Loader2 className="size-4 animate-spin" />
        )}

        {pending
          ? "Connexion..."
          : "Se connecter"}
      </button>
    </form>
  );
}