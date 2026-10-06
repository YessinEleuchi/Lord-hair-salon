"use client";

import Link from "next/link";

import {
  LogOut,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

import {
  logout,
} from "@/app/auth/actions";

import {
  gestionNavigation,
} from "@/config/admin-navigation";

export function GestionSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed
        inset-y-0
        left-0
        z-50
        hidden
        w-64
        border-r
        border-white/10
        bg-background
        lg:flex
        lg:flex-col
      "
    >
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <div>
          <p className="text-lg font-bold tracking-[-0.04em] text-white">
            THE LORD
          </p>

          <p className="mt-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-brand">
            Hair Salon · Gestion
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {gestionNavigation.map(
          (item) => {
            const Icon = item.icon;

            const active =
              item.href === "/gestion"
                ? pathname === "/gestion"
                : pathname.startsWith(
                    item.href,
                  );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex
                  min-h-11
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-brand text-black"
                      : "text-white/45 hover:bg-surface hover:text-white"
                  }
                `}
              >
                <Icon className="size-[18px]" />

                {item.label}
              </Link>
            );
          },
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <form action={logout}>
          <button
            type="submit"
            className="
              flex
              min-h-11
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              text-sm
              font-medium
              text-white/40
              transition
              hover:bg-surface
              hover:text-white
            "
          >
            <LogOut className="size-[18px]" />

            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}