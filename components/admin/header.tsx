"use client";

import {
  Bell,
} from "lucide-react";

export function GestionHeader() {
  return (
    <header
      className="
        sticky
        top-0
        z-40
        border-b
        border-white/10
        bg-background/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          h-16
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-bold tracking-[-0.03em] text-white">
            THE LORD
          </p>

          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand">
            Gestion
          </p>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="
            relative
            flex
            size-10
            touch-manipulation
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-surface
            text-white/70
            transition
            hover:border-white/20
            hover:text-white
          "
        >
          <Bell className="size-[18px]" />

          {/*
            Plus tard :
            afficher uniquement si pendingCount > 0
          */}

          <span
            className="
              absolute
              right-2
              top-2
              size-2
              rounded-full
              bg-brand
              ring-2
              ring-background
            "
          />
        </button>
      </div>
    </header>
  );
}