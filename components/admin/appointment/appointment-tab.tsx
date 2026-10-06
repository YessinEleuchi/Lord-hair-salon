"use client";

import Link from "next/link";
import {
  useSearchParams,
} from "next/navigation";

const tabs = [
  {
    label: "Tous",
    value: "all",
  },
  {
    label: "En attente",
    value: "pending",
  },
  {
    label: "Confirmés",
    value: "confirmed",
  },
  {
    label: "Annulés",
    value: "cancelled",
  },
] as const;

export function AppointmentTabs() {
  const searchParams =
    useSearchParams();

  const current =
    searchParams.get("statut") ??
    "all";

  return (
    <div
      className="
        grid
        grid-cols-2
        gap-2
        sm:flex
        sm:flex-wrap
      "
    >
      {tabs.map((tab) => {
        const active =
          current === tab.value;

        const href =
          tab.value === "all"
            ? "/gestion/rendez-vous"
            : `/gestion/rendez-vous?statut=${tab.value}`;

        return (
          <Link
            key={tab.value}
            href={href}
            className={`
              flex
              min-h-10
              touch-manipulation
              items-center
              justify-center
              rounded-xl
              border
              px-4
              text-xs
              font-medium
              transition
              ${
                active
                  ? "border-brand bg-brand text-black"
                  : "border-white/10 bg-surface text-white/45 hover:border-white/20 hover:text-white"
              }
            `}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}