"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  SITE_SECTIONS,
  type SiteSectionId,
} from "@/config/site-navigation";

export function useActiveSection() {
  const pathname = usePathname();

  const [activeSection, setActiveSection] =
    useState<SiteSectionId>("home");

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    function updateActiveSection() {
      // Header desktop ≈ 96px.
      // On regarde légèrement plus bas pour rendre
      // le changement d'état plus naturel.
      const activationPoint = 140;

      let currentSection: SiteSectionId = "home";

      for (const section of SITE_SECTIONS) {
        const element =
          document.getElementById(section.id);

        if (!element) {
          continue;
        }

        const rect =
          element.getBoundingClientRect();

        if (rect.top <= activationPoint) {
          currentSection = section.id;
        }
      }

      setActiveSection(currentSection);
    }

    updateActiveSection();

    window.addEventListener(
      "scroll",
      updateActiveSection,
      { passive: true },
    );

    window.addEventListener(
      "resize",
      updateActiveSection,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateActiveSection,
      );

      window.removeEventListener(
        "resize",
        updateActiveSection,
      );
    };
  }, [pathname]);

  return {
    pathname,
    activeSection,
  };
}