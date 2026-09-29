"use client";

import { CalendarDays, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  {
    label: "Accueil",
    href: "#home",
  },
  {
    label: "Services",
    href: "#services",
  },
  {
    label: "Galerie",
    href: "#gallery",
  },
  {
    label: "À propos",
    href: "#about",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[var(--page-max-width)] items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="relative z-50 flex items-center"
          aria-label="THE LORD Hair Salon"
          onClick={closeMenu}
        >
          <Image
            src="/logo/logo.svg"
            alt="THE LORD Hair Salon"
            width={190}
            height={70}
            priority
            className="h-12 w-auto object-contain sm:h-14 lg:h-16"
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-7 lg:flex xl:gap-10">
          {navigation.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "relative text-sm font-medium uppercase tracking-[0.12em]",
                "transition-colors hover:text-brand",
                index === 0
                  ? "text-brand"
                  : "text-white/80",
              ].join(" ")}
            >
              {item.label}

              {index === 0 && (
                <span className="absolute -bottom-2 left-0 h-px w-full bg-brand" />
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop booking */}
        <Link
          href="/booking"
          className="hidden items-center gap-2.5 rounded-lg bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-black transition hover:bg-brand-hover lg:flex"
        >
          <CalendarDays className="size-4" />
          Réserver
        </Link>

        {/* Mobile button */}
        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen((current) => !current)
          }
          className="relative z-50 flex size-11 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
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

      {/* Mobile menu */}
      <div
        className={[
          "absolute inset-x-0 top-full overflow-hidden border-b border-white/10 bg-background transition-all duration-300 lg:hidden",
          mobileMenuOpen
            ? "max-h-[600px] opacity-100"
            : "pointer-events-none max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="flex flex-col px-5 py-6 sm:px-8">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className="border-b border-white/10 py-4 text-base font-medium uppercase tracking-[0.12em] text-white/80 transition hover:text-brand"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/booking"
            onClick={closeMenu}
            className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 font-bold uppercase tracking-[0.08em] text-black"
          >
            <CalendarDays className="size-5" />
            Réserver maintenant
          </Link>
        </nav>
      </div>
    </header>
  );
}