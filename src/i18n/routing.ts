import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "fr", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed",

  pathnames: {
    "/": "/",

    // Tours
    "/tours": {
      en: "/tours",
      fr: "/circuits",
      es: "/tours",
    },
    "/tours/[slug]": {
      en: "/tours/[slug]",
      fr: "/circuits/[slug]",
      es: "/tours/[slug]",
    },
    "/tours/from/[city]": {
      en: "/tours/from/[city]",
      fr: "/circuits/depuis/[city]",
      es: "/tours/desde/[city]",
    },

    // Day Trips
    "/day-trips": {
      en: "/day-trips",
      fr: "/excursions",
      es: "/excursiones",
    },
    "/day-trips/[slug]": {
      en: "/day-trips/[slug]",
      fr: "/excursions/[slug]",
      es: "/excursiones/[slug]",
    },

    // Activities
    "/activities": {
      en: "/activities",
      fr: "/activites",
      es: "/actividades",
    },
    "/activities/[slug]": {
      en: "/activities/[slug]",
      fr: "/activites/[slug]",
      es: "/actividades/[slug]",
    },

    // Customize
    "/customize-your-tour": {
      en: "/customize-your-tour",
      fr: "/personnalisez-votre-circuit",
      es: "/personaliza-tu-tour",
    },

    // Blog
    "/blog": {
      en: "/blog",
      fr: "/blog",
      es: "/blog",
    },
    "/blog/[slug]": {
      en: "/blog/[slug]",
      fr: "/blog/[slug]",
      es: "/blog/[slug]",
    },

    // About
    "/about": {
      en: "/about",
      fr: "/a-propos",
      es: "/sobre-nosotros",
    },
    "/about/morocco_tourist": {
      en: "/about/morocco-tourist",
      fr: "/a-propos/tourisme-maroc",
      es: "/sobre-nosotros/turismo-marruecos",
    },

    // Contact
    "/contact": {
      en: "/contact",
      fr: "/contact",
      es: "/contacto",
    },

    // Favorites
    "/favorites": {
      en: "/favorites",
      fr: "/favoris",
      es: "/favoritos",
    },
  },
});


export type Locale = (typeof routing.locales)[number];
export type Pathnames = keyof typeof routing.pathnames;


export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
