"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import {
  gestionNavigation,
} from "@/config/admin-navigation";

export function GestionBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t
        border-white/10
        bg-background/95
        pb-[env(safe-area-inset-bottom)]
        backdrop-blur-xl
        lg:hidden
      "
    >
      <div className="grid h-16 grid-cols-5">
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
                  relative
                  flex
                  min-w-0
                  touch-manipulation
                  flex-col
                  items-center
                  justify-center
                  gap-1
                  px-1
                  transition
                  ${
                    active
                      ? "text-brand"
                      : "text-white/35"
                  }
                `}
              >
                {active && (
                  <span
                    className="
                      absolute
                      top-0
                      h-0.5
                      w-8
                      rounded-full
                      bg-brand
                    "
                  />
                )}

                <Icon
                  className="size-[19px]"
                  strokeWidth={
                    active ? 2.3 : 1.8
                  }
                />

                <span className="max-w-full truncate text-[9px] font-medium">
                  {"shortLabel" in item
                    ? item.shortLabel
                    : item.label}
                </span>
              </Link>
            );
          },
        )}
      </div>
    </nav>
  );
}