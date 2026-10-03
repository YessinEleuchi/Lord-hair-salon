"use client";

import {
  CalendarDays,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  getSectionHref,
  SITE_SECTIONS,
} from "@/config/site-navigation";
import { useActiveSection } from "@/hooks/use-active-section";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const {
    pathname,
    activeSection,
  } = useActiveSection();

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header
      className="
        fixed
        inset-x-0
        top-0
        z-50
        border-b
        border-white/10
        bg-black/80
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-20
          max-w-[var(--page-max-width)]
          items-center
          justify-between
          px-5

          sm:px-8

          lg:h-24
          lg:px-10
        "
      >
        {/* LOGO */}
        <Link
          href="/#home"
          className="
            relative
            z-50
            flex
            items-center
          "
          aria-label="THE LORD Hair Salon"
          onClick={closeMenu}
        >
          <Image
            src="/logo/logo.svg"
            alt="THE LORD Hair Salon"
            width={190}
            height={70}
            priority
            className="
              h-12
              w-auto
              object-contain

              sm:h-14
              lg:h-16
            "
          />
        </Link>

        {/* ======================================
            DESKTOP NAVIGATION
        ======================================= */}
        <nav
          className="
            hidden
            items-center
            gap-7

            lg:flex
            xl:gap-10
          "
        >
          {SITE_SECTIONS.map((item) => {
            const isActive =
              pathname === "/" &&
              activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={getSectionHref(
                  item.id,
                  pathname,
                )}
                aria-current={
                  isActive
                    ? "location"
                    : undefined
                }
                className={[
                  "group relative",
                  "text-sm font-medium uppercase",
                  "tracking-[0.12em]",
                  "transition-colors duration-300",
                  isActive
                    ? "text-brand"
                    : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                {item.label}

                {/* ACTIVE LINE */}
                <span
                  className={[
                    "absolute -bottom-2 left-0",
                    "h-px bg-brand",
                    "transition-all duration-300",
                    isActive
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-50",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        {/* BOOKING */}
        <Link
          href="/booking"
          className={[
            "hidden items-center gap-2.5",
            "rounded-lg px-6 py-3.5",
            "text-sm font-bold uppercase",
            "tracking-[0.08em]",
            "transition",
            "lg:flex",

            pathname.startsWith("/booking")
              ? "bg-white text-black"
              : "bg-brand text-black hover:bg-brand-hover",
          ].join(" ")}
        >
          <CalendarDays className="size-4" />

          Réserver
        </Link>

        {/* ======================================
            MOBILE BUTTON
        ======================================= */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(
              (current) => !current,
            )
          }
          className="
            relative
            z-50
            flex
            size-11
            items-center
            justify-center
            rounded-full
            border
            border-white/15
            text-white

            lg:hidden
          "
          aria-label={
            mobileMenuOpen
              ? "Fermer le menu"
              : "Ouvrir le menu"
          }
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* ========================================
          MOBILE MENU
      ========================================= */}
      <div
        className={[
          "absolute inset-x-0 top-full",
          "overflow-hidden",
          "border-b border-white/10",
          "bg-background",
          "transition-all duration-300",
          "lg:hidden",

          mobileMenuOpen
            ? "max-h-[650px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="flex flex-col px-5 py-6 sm:px-8">
          {SITE_SECTIONS.map((item) => {
            const isActive =
              pathname === "/" &&
              activeSection === item.id;

            return (
              <Link
                key={item.id}
                href={getSectionHref(
                  item.id,
                  pathname,
                )}
                onClick={closeMenu}
                aria-current={
                  isActive
                    ? "location"
                    : undefined
                }
                className={[
                  "flex items-center justify-between",
                  "border-b border-white/10",
                  "py-4",
                  "text-base font-medium uppercase",
                  "tracking-[0.12em]",
                  "transition-colors",

                  isActive
                    ? "text-brand"
                    : "text-white/70 hover:text-white",
                ].join(" ")}
              >
                {item.label}

                {isActive && (
                  <span
                    className="
                      size-1.5
                      rounded-full
                      bg-brand
                    "
                  />
                )}
              </Link>
            );
          })}

          <Link
            href="/booking"
            onClick={closeMenu}
            className="
              mt-6
              flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-brand
              px-6
              py-4
              font-bold
              uppercase
              tracking-[0.08em]
              text-black
            "
          >
            <CalendarDays className="size-5" />

            Réserver maintenant
          </Link>
        </nav>
      </div>
    </header>
  );
}