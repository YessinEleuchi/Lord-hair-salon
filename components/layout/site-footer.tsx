import {
  ArrowUp,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { FaInstagram,FaFacebook, FaTiktok } from "react-icons/fa";

import { getPublicSalonInfo } from "@/features/salon/queries";

const navigation = [
  { label: "Accueil", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "À propos", href: "#about" },
  { label: "Galerie", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

export async function SiteFooter() {
  const data = await getPublicSalonInfo();

  const salon = data?.salon;

  return (
    <footer className="border-t border-white/10 bg-background">
      <div
        className="
          mx-auto
          max-w-[var(--page-max-width)]
          px-5
          py-14
          sm:px-8
          lg:px-10
          lg:py-20
        "
      >
        <div
          className="
            grid
            gap-12
            lg:grid-cols-[1.4fr_0.7fr_0.9fr]
            lg:gap-16
          "
        >
          {/* BRAND */}
          <div>
            <Link
              href="/"
              className="
                inline-block
                font-serif
                text-3xl
                font-bold
                uppercase
                tracking-[-0.04em]
                text-white
              "
            >
              THE LORD
              <span className="block text-brand">
                Hair Salon
              </span>
            </Link>

            {salon?.description && (
              <p
                className="
                  mt-5
                  max-w-md
                  text-sm
                  leading-6
                  text-white/40
                "
              >
                {salon.description}
              </p>
            )}

            {/* SOCIALS */}
            <div className="mt-7 flex items-center gap-3">
              {salon?.instagramUrl && (
                <a
                  href={salon.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="
                    flex size-10 items-center justify-center
                    rounded-full border border-white/10
                    text-white/50
                    transition-all
                    hover:border-brand
                    hover:text-brand
                  "
                >
                  <FaInstagram className="size-4" />
                </a>
              )}

              {salon?.facebookUrl && (
                <a
                  href={salon.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="
                    flex size-10 items-center justify-center
                    rounded-full border border-white/10
                    text-white/50
                    transition-all
                    hover:border-brand
                    hover:text-brand
                  "
                >
                  <FaFacebook className="size-4" />
                </a>
              )}

              {salon?.tiktokUrl && (
                <a
                  href={salon.tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="
                    flex size-10 items-center justify-center
                    rounded-full border border-white/10
                    text-white/50
                    transition-all
                    hover:border-brand
                    hover:text-brand
                  "
                >
                  <FaTiktok className="size-4" />
                </a>
              )}
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-brand
              "
            >
              Navigation
            </p>

            <nav className="mt-6 flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    w-fit
                    text-sm
                    text-white/50
                    transition-colors
                    hover:text-white
                  "
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* CONTACT */}
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-brand
              "
            >
              Nous trouver
            </p>

            <div className="mt-6 space-y-5">
              {salon?.address && (
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />

                  <p className="text-sm leading-6 text-white/50">
                    {salon.address}

                    {salon.city && (
                      <>
                        <br />
                        {salon.city}
                      </>
                    )}
                  </p>
                </div>
              )}

              {salon?.phone && (
                <a
                  href={`tel:${salon.phone}`}
                  className="
                    flex
                    w-fit
                    items-center
                    gap-3
                    text-sm
                    text-white/50
                    transition-colors
                    hover:text-brand
                  "
                >
                  <Phone className="size-4 text-brand" />

                  {salon.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          className="
            mt-14
            flex
            flex-col
            gap-5
            border-t
            border-white/10
            pt-6

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-xs
              uppercase
              tracking-[0.12em]
              text-white/25
            "
          >
            © {new Date().getFullYear()} THE LORD Hair Salon.
            Tous droits réservés.
          </p>

          <a
            href="#home"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-white/40
              transition-colors
              hover:text-brand
            "
          >
            Retour en haut

            <span
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                transition-colors
                group-hover:border-brand
              "
            >
              <ArrowUp className="size-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}