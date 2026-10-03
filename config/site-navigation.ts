export const SITE_SECTIONS = [
  {
    id: "home",
    label: "Accueil",
  },
  {
    id: "services",
    label: "Services",
  },
  {
    id: "about",
    label: "À propos",
  },
  {
    id: "gallery",
    label: "Galerie",
  },
  {
    id: "contact",
    label: "Contact",
  },
] as const;

export type SiteSectionId =
  (typeof SITE_SECTIONS)[number]["id"];

export function getHomeSectionHref(
  sectionId: SiteSectionId,
) {
  return `/#${sectionId}`;
}

export function getSectionHref(
  sectionId: SiteSectionId,
  pathname: string,
) {
  if (pathname === "/") {
    return `#${sectionId}`;
  }

  return getHomeSectionHref(sectionId);
}