import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  Scissors
} from "lucide-react";

export const gestionNavigation = [
  {
    label: "Accueil",
    href: "/gestion",
    icon: LayoutDashboard,
  },
  {
    label: "Rendez-vous",
    shortLabel: "RDV",
    href: "/gestion/rendez-vous",
    icon: Scissors,
  },
  {
    label: "Calendrier",
    shortLabel: "Agenda",
    href: "/gestion/calendrier",
    icon: CalendarDays,
  },
  {
    label: "Planning",
    href: "/gestion/planning",
    icon: Clock3,
  },
  /*{
    label: "Paramètres",
    shortLabel: "Réglages",
    href: "/gestion/parametres",
    icon: Settings,
  },*/
] as const;