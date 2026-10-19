import React from "react";
import Image from "next/image";
import {ArrowUpRight,Compass,MessageCircle,Map,Sparkles,Users,Mail,Hotel,Car,MapPinned,} from "lucide-react";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";

import { Link } from "@/i18n/routing";

type Locale = "en" | "fr" | "es";


const BASE_URL = "https://toursmarrakechdesert.com";

const metadataContent = {
  en: {
    title: "About Tours Marrakech Desert | Local Morocco Tour Company",
    description:
      "Meet Tours Marrakech Desert, a local Morocco tour company creating private tours, desert journeys and tailor-made itineraries with experienced local guides and drivers.",
    keywords: [
      "Tours Marrakech Desert",
      "Morocco tour company",
      "local Morocco travel agency",
      "Marrakech desert tours",
      "private Morocco tours",
      "Morocco local guides",
      "Morocco desert tour company",
      "Morocco travel agency",
      "Morocco private driver",
      "custom Morocco tours",
    ],
    ogLocale: "en_US",
    imageAlt: "Local Morocco travel team at Tours Marrakech Desert",
  },

  fr: {
    title: "À propos de Tours Marrakech Desert | Agence locale au Maroc",
    description:
      "Découvrez Tours Marrakech Desert, une agence de voyage locale au Maroc spécialisée dans les circuits privés, les excursions dans le désert et les itinéraires sur mesure avec des guides et chauffeurs locaux expérimentés.",
    keywords: [
      "Tours Marrakech Desert",
      "agence de voyage Maroc",
      "agence locale Maroc",
      "circuits désert Marrakech",
      "circuits privés Maroc",
      "guide local Maroc",
      "excursion désert Maroc",
      "chauffeur privé Maroc",
      "voyage sur mesure Maroc",
      "circuit Maroc",
    ],
    ogLocale: "fr_FR",
    imageAlt: "Équipe locale de Tours Marrakech Desert au Maroc",
  },

  es: {
    title:
      "Sobre Tours Marrakech Desert | Agencia local de viajes en Marruecos",
    description:
      "Conoce Tours Marrakech Desert, una agencia local de viajes en Marruecos especializada en tours privados, viajes al desierto e itinerarios a medida con guías y conductores locales.",
    keywords: [
      "Tours Marrakech Desert",
      "agencia de viajes Marruecos",
      "agencia local Marruecos",
      "tours desierto Marrakech",
      "tours privados Marruecos",
      "guía local Marruecos",
      "viajes desierto Marruecos",
      "conductor privado Marruecos",
      "viajes a medida Marruecos",
      "circuitos Marruecos",
    ],
    ogLocale: "es_ES",
    imageAlt: "Equipo local de Tours Marrakech Desert en Marruecos",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    keywords: string[];
    ogLocale: string;
    imageAlt: string;
  }
>;

const aboutPaths: Record<Locale, string> = {
  en: "/about",
  fr: "/a-propos",
  es: "/sobre-nosotros",
};

export async function generateMetadata({params,}: {params: Promise<{ locale: Locale }>;}): Promise<Metadata> {

  const { locale } = await params;

  const currentLocale: Locale = locale === "fr" || locale === "es" ? locale : "en";

  const meta = metadataContent[currentLocale];

  const canonicalUrl = `${BASE_URL}/${currentLocale}${aboutPaths[currentLocale]}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,

    alternates: {
      canonical: canonicalUrl,

      languages: {
        en: `${BASE_URL}${aboutPaths.en}`,
        fr: `${BASE_URL}/fr${aboutPaths.fr}`,
        es: `${BASE_URL}/es${aboutPaths.es}`,
        "x-default": `${BASE_URL}${aboutPaths.en}`,
      },
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: meta.title,
      description: meta.description,
      siteName: "Tours Marrakech Desert",
      locale: meta.ogLocale,

      alternateLocale: [
        currentLocale !== "en" ? "en_US" : null,
        currentLocale !== "fr" ? "fr_FR" : null,
        currentLocale !== "es" ? "es_ES" : null,
      ].filter(Boolean) as string[],

      images: [
        {
          url: `${BASE_URL}/images/team.webp`,
          width: 1200,
          height: 630,
          alt: meta.imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${BASE_URL}/images/team.webp`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

const serviceMeta = [
  {
    number: "01",
    icon: Compass,
    href: "/about" as const,
  },
  {
    number: "02",
    icon: Map,
    href: "/tours" as const,
  },
  {
    number: "03",
    icon: Users,
    href: "/tours" as const,
  },
  {
    number: "04",
    icon: Sparkles,
    href: "/customize-your-tour" as const,
  },
] as const;

const translations = {
  en: {
    about: {
      eyebrow: "Who we are",
      title: "A Morocco tour company",
      titleAccent: "shaped by local experience.",
      intro:
        "Tours Marrakech Desert is a local travel company creating private tours, desert journeys and tailor-made itineraries across Morocco.",
      description:
        "We believe a memorable journey is not only about the destinations you visit, but also the people you meet, the roads you take and the time you have to experience each place properly.",
      points: ["Local knowledge", "Private journeys", "Flexible planning"],
    },
    contact: {
      eyebrow: "Have a Morocco trip in mind?",
      title: "Ask us anything about your journey.",
      text: "You do not need to have your itinerary figured out. Tell us what you are thinking about, the places you would like to see, or simply ask a question about traveling in Morocco.",
      subtext:
        "We will be happy to share a local perspective and help you understand what could work best for your trip.",
      cta: "Ask a local",
      ctaText: "Routes, timing, desert trips or anything about Morocco",
      note: "No booking needed. A simple question is always welcome.",
    },
    guide: {
      eyebrow: "Your local guide",
      title: "Meet Youssef",
      text1:
        "Traveling through Morocco is different when you share the road with someone who knows the country from within. Youssef brings a local perspective to the journey, helping travelers feel comfortable, understand the places they visit and enjoy the experience at a natural pace.",
      text2:
        "Whether you are crossing the Atlas Mountains, heading toward the Sahara or stopping in a small village along the way, he is there to make the journey feel more personal and easier to navigate.",
      speaks: "Youssef speaks",
      languages: ["English", "Español", "Arabic", "Amazigh"],
      detail: "Local knowledge · Flexible travel · Moroccan hospitality",
      alt: "Youssef, local Morocco guide at Tours Marrakech Desert",
      role: "Local Morocco Guide",
    },
    road: {
      alt: "Road through Morocco landscape with Hmad, experienced local guide",
      label: "Morocco by road",
      captionTitle: "More than getting from one place to another.",
      captionText:
        "The landscapes between each destination are part of the journey.",
      eyebrow: "Thoughtful journeys",
      title: "The route matters.",
      titleAccent: "So does how you travel it.",
      text: "We balance driving time, meaningful stops and enough freedom to enjoy the places you visit without making every day feel rushed.",
      paceLabel: "Your pace",
      paceText: "Flexible when the route allows.",
      focusLabel: "Our focus",
      focusText: "Comfort and meaningful stops.",
    },
    team: {
      eyebrow: "Our team",
      title: "The people behind",
      titleAccent: "your journey.",
      alt: "Local Morocco travel team at Tours Marrakech Desert",
      lead: "A small local team, with each person taking care of a different part of your journey.",
      story: {
        start:
          "Behind every journey is a small local team working together to make your experience in Morocco feel simple, personal and well organized.",
        mohsine:
          "takes care of your emails and communication, answering your questions and helping you prepare your trip before arrival.",
        mohammed:
          "coordinates hotel reservations and important travel arrangements, making sure everything is properly organized along the way. On the road,",
        hmad: "combines professional driving with his experience as a local guide in Marrakech, while",
        youssef:
          ", a local guide and driver from the desert region, shares his knowledge of southern Morocco, its landscapes and local life.",
      },
      closing:
        "Each of us has a different role, but we share the same goal: to make you feel welcomed, comfortable and well cared for throughout your journey.",
      roles: [
        {
          name: "Mohsine",
          role: "Guest Communication",
          text: "Emails, questions & trip preparation",
        },
        {
          name: "Mohammed",
          role: "Travel Coordination",
          text: "Hotels, reservations & arrangements",
        },
        {
          name: "Hmad",
          role: "Driver & Marrakech Guide",
          text: "Local knowledge & life on the road",
        },
        {
          name: "Youssef",
          role: "Desert Guide & Driver",
          text: "Sahara, southern Morocco & local life",
        },
      ],
      signature:
        "Four people. Different roles. One journey carefully looked after.",
      location: "Local team · Morocco",
    },
    travel: {
      eyebrow: "Travel with us",
      title: "Different ways to experience",
      titleAccent: "Morocco.",
      text: "From a simple day trip to a complete private journey, our role is to help you experience Morocco in a way that feels natural, comfortable and personal.",
    },
    services: [
      {
        eyebrow: "Our mission",
        title: "Travel with meaning",
        text: "We create Morocco journeys that feel comfortable, personal and easy to enjoy. Beyond famous places, we want you to experience the landscapes, culture, people and small moments that make Morocco memorable.",
        linkText: "Discover our approach",
      },
      {
        eyebrow: "Our travel services",
        title: "Explore Morocco your way",
        text: "From desert journeys and day trips to complete Morocco itineraries, we help you choose an experience that fits your dates, interests and the way you like to travel.",
        linkText: "Explore our tours",
      },
      {
        eyebrow: "Private Morocco tours",
        title: "More freedom on the road",
        text: "Travel privately with the people who matter to you. Enjoy a more relaxed rhythm, flexible stops and enough time to experience each destination without feeling rushed.",
        linkText: "View private tours",
      },
      {
        eyebrow: "Custom Morocco travel",
        title: "Have another journey in mind?",
        text: "Tell us the places you want to see, the experiences that interest you and how much time you have. We can help shape those ideas into a Morocco itinerary that feels right for you.",
        linkText: "Share your travel idea",
      },
    ],
    valuesHeader: {
      eyebrow: "Our core values",
      title: "What we stand for",
      text: "Simple principles that influence the way we plan, communicate and travel with our guests.",
    },
    values: [
      {
        title: "Comfort in every detail",
        text: "We carefully plan each stage of your journey to make travel feel smooth, safe and comfortable from beginning to end.",
      },
      {
        title: "A journey shaped around you",
        text: "Your pace, interests and priorities matter. Whenever possible, we adjust stops and timing to create a more personal travel experience.",
      },
      {
        title: "Hospitality with a local touch",
        text: "Warm, respectful service is part of the experience. We want every traveler to feel welcomed and well cared for throughout Morocco.",
      },
      {
        title: "Thoughtful quality",
        text: "We invest in what matters most: dependable service, comfortable transport, carefully chosen stays and meaningful experiences.",
      },
      {
        title: "Knowledge you can travel with",
        text: "Our local experience helps us recommend the right routes, stops and travel choices based on the season and your interests.",
      },
    ],
  },

  fr: {
    about: {
      eyebrow: "Qui sommes-nous",
      title: "Une agence de voyages au Maroc",
      titleAccent: "façonnée par l’expérience locale.",
      intro:
        "Tours Marrakech Desert est une agence de voyage locale qui crée des circuits privés, des voyages dans le désert et des itinéraires sur mesure à travers le Maroc.",
      description:
        "Nous pensons qu’un voyage mémorable ne dépend pas seulement des destinations que vous visitez, mais aussi des personnes que vous rencontrez, des routes que vous parcourez et du temps que vous prenez pour vivre pleinement chaque lieu.",
      points: [
        "Connaissance locale",
        "Voyages privés",
        "Organisation flexible",
      ],
    },
    contact: {
      eyebrow: "Vous avez un voyage au Maroc en tête ?",
      title: "Posez-nous toutes vos questions sur votre voyage.",
      text: "Vous n’avez pas besoin d’avoir déjà défini votre itinéraire. Parlez-nous de vos idées, des lieux que vous aimeriez découvrir ou posez-nous simplement une question sur votre voyage au Maroc.",
      subtext:
        "Nous serons heureux de partager notre point de vue local et de vous aider à comprendre ce qui conviendrait le mieux à votre séjour.",
      cta: "Demander à un local",
      ctaText: "Itinéraires, durée, désert ou toute question sur le Maroc",
      note: "Aucune réservation nécessaire. Une simple question est toujours la bienvenue.",
    },
    guide: {
      eyebrow: "Votre guide local",
      title: "Rencontrez Youssef",
      text1:
        "Voyager au Maroc est différent lorsque vous partagez la route avec quelqu’un qui connaît le pays de l’intérieur. Youssef apporte une perspective locale au voyage, aide les voyageurs à se sentir à l’aise, à mieux comprendre les lieux visités et à profiter de l’expérience à un rythme naturel.",
      text2:
        "Que vous traversiez les montagnes de l’Atlas, que vous vous dirigiez vers le Sahara ou que vous fassiez une halte dans un petit village en chemin, il est là pour rendre le voyage plus personnel et plus simple à vivre.",
      speaks: "Youssef parle",
      languages: ["Anglais", "Espagnol", "Arabe", "Amazigh"],
      detail: "Connaissance locale · Voyage flexible · Hospitalité marocaine",
      alt: "Youssef, guide local au Maroc chez Tours Marrakech Desert",
      role: "Guide local au Maroc",
    },
    road: {
      alt: "Route à travers les paysages du Maroc avec Hmad, guide local expérimenté",
      label: "Le Maroc par la route",
      captionTitle: "Bien plus que passer d’un lieu à un autre.",
      captionText:
        "Les paysages entre chaque destination font partie du voyage.",
      eyebrow: "Des voyages pensés avec soin",
      title: "L’itinéraire compte.",
      titleAccent: "La façon de le parcourir aussi.",
      text: "Nous équilibrons le temps de conduite, les arrêts qui valent le détour et suffisamment de liberté pour profiter des lieux visités sans donner l’impression que chaque journée est précipitée.",
      paceLabel: "Votre rythme",
      paceText: "Flexible lorsque l’itinéraire le permet.",
      focusLabel: "Notre priorité",
      focusText: "Le confort et des arrêts qui ont du sens.",
    },
    team: {
      eyebrow: "Notre équipe",
      title: "Les personnes derrière",
      titleAccent: "votre voyage.",
      alt: "Équipe locale de voyage au Maroc de Tours Marrakech Desert",
      lead: "Une petite équipe locale, où chacun prend soin d’une partie différente de votre voyage.",
      story: {
        start:
          "Derrière chaque voyage se trouve une petite équipe locale qui travaille ensemble pour rendre votre expérience au Maroc simple, personnelle et bien organisée.",
        mohsine:
          "s’occupe de vos e-mails et de la communication, répond à vos questions et vous aide à préparer votre voyage avant votre arrivée.",
        mohammed:
          "coordonne les réservations d’hôtels et les principales dispositions du voyage afin que tout soit correctement organisé tout au long du parcours. Sur la route,",
        hmad: "associe la conduite professionnelle à son expérience de guide local à Marrakech, tandis que",
        youssef:
          ", guide local et chauffeur originaire de la région du désert, partage sa connaissance du sud du Maroc, de ses paysages et de la vie locale.",
      },
      closing:
        "Chacun de nous a un rôle différent, mais nous partageons le même objectif : vous faire sentir bien accueilli, à l’aise et accompagné avec attention tout au long de votre voyage.",
      roles: [
        {
          name: "Mohsine",
          role: "Communication voyageurs",
          text: "E-mails, questions et préparation du voyage",
        },
        {
          name: "Mohammed",
          role: "Coordination du voyage",
          text: "Hôtels, réservations et organisation",
        },
        {
          name: "Hmad",
          role: "Chauffeur & guide à Marrakech",
          text: "Connaissance locale et expérience sur la route",
        },
        {
          name: "Youssef",
          role: "Guide du désert & chauffeur",
          text: "Sahara, sud du Maroc et vie locale",
        },
      ],
      signature:
        "Quatre personnes. Des rôles différents. Un voyage suivi avec attention.",
      location: "Équipe locale · Maroc",
    },
    travel: {
      eyebrow: "Voyagez avec nous",
      title: "Différentes façons de découvrir",
      titleAccent: "le Maroc.",
      text: "D’une simple excursion d’une journée à un voyage privé complet, notre rôle est de vous aider à découvrir le Maroc d’une manière naturelle, confortable et personnelle.",
    },
    services: [
      {
        eyebrow: "Notre mission",
        title: "Voyager avec du sens",
        text: "Nous créons des voyages au Maroc confortables, personnels et agréables à vivre. Au-delà des lieux célèbres, nous voulons vous faire découvrir les paysages, la culture, les habitants et les petits moments qui rendent le Maroc mémorable.",
        linkText: "Découvrir notre approche",
      },
      {
        eyebrow: "Nos services de voyage",
        title: "Explorez le Maroc à votre façon",
        text: "Des voyages dans le désert et excursions à la journée aux itinéraires complets au Maroc, nous vous aidons à choisir une expérience adaptée à vos dates, à vos envies et à votre façon de voyager.",
        linkText: "Explorer nos circuits",
      },
      {
        eyebrow: "Circuits privés au Maroc",
        title: "Plus de liberté sur la route",
        text: "Voyagez en privé avec les personnes qui comptent pour vous. Profitez d’un rythme plus détendu, d’arrêts flexibles et de suffisamment de temps pour découvrir chaque destination sans vous sentir pressé.",
        linkText: "Voir les circuits privés",
      },
      {
        eyebrow: "Voyage sur mesure au Maroc",
        title: "Vous avez un autre voyage en tête ?",
        text: "Indiquez-nous les lieux que vous souhaitez découvrir, les expériences qui vous intéressent et le temps dont vous disposez. Nous pouvons transformer ces idées en un itinéraire au Maroc qui vous ressemble.",
        linkText: "Partager votre idée de voyage",
      },
    ],
    valuesHeader: {
      eyebrow: "Nos valeurs fondamentales",
      title: "Ce qui nous guide",
      text: "Des principes simples qui influencent notre façon d’organiser, de communiquer et de voyager avec nos clients.",
    },
    values: [
      {
        title: "Le confort dans chaque détail",
        text: "Nous planifions soigneusement chaque étape de votre voyage afin qu’il soit fluide, sûr et confortable du début à la fin.",
      },
      {
        title: "Un voyage pensé autour de vous",
        text: "Votre rythme, vos centres d’intérêt et vos priorités comptent. Lorsque cela est possible, nous adaptons les arrêts et le programme pour créer une expérience de voyage plus personnelle.",
      },
      {
        title: "Une hospitalité profondément locale",
        text: "Un accueil chaleureux et respectueux fait partie de l’expérience. Nous voulons que chaque voyageur se sente bienvenu et accompagné avec attention partout au Maroc.",
      },
      {
        title: "Une qualité pensée avec soin",
        text: "Nous investissons dans ce qui compte le plus : un service fiable, un transport confortable, des hébergements soigneusement sélectionnés et des expériences qui ont du sens.",
      },
      {
        title: "Une connaissance locale à vos côtés",
        text: "Notre expérience locale nous aide à recommander les bons itinéraires, les bonnes étapes et les meilleurs choix de voyage selon la saison et vos centres d’intérêt.",
      },
    ],
  },

  es: {
    about: {
      eyebrow: "Quiénes somos",
      title: "Una agencia de viajes en Marruecos",
      titleAccent: "creada desde la experiencia local.",
      intro:
        "Tours Marrakech Desert es una agencia de viajes local que crea tours privados, viajes al desierto e itinerarios a medida por todo Marruecos.",
      description:
        "Creemos que un viaje memorable no depende solo de los destinos que visitas, sino también de las personas que conoces, las carreteras que recorres y el tiempo que tienes para disfrutar realmente de cada lugar.",
      points: [
        "Conocimiento local",
        "Viajes privados",
        "Planificación flexible",
      ],
    },
    contact: {
      eyebrow: "¿Tienes un viaje a Marruecos en mente?",
      title: "Pregúntanos lo que quieras sobre tu viaje.",
      text: "No necesitas tener tu itinerario completamente definido. Cuéntanos qué tienes en mente, qué lugares te gustaría conocer o simplemente haznos una pregunta sobre viajar por Marruecos.",
      subtext:
        "Estaremos encantados de compartir una perspectiva local y ayudarte a entender qué puede funcionar mejor para tu viaje.",
      cta: "Pregunta a un local",
      ctaText: "Rutas, tiempos, desierto o cualquier duda sobre Marruecos",
      note: "No hace falta reservar. Una simple pregunta siempre es bienvenida.",
    },
    guide: {
      eyebrow: "Tu guía local",
      title: "Conoce a Youssef",
      text1:
        "Viajar por Marruecos es diferente cuando compartes el camino con alguien que conoce el país desde dentro. Youssef aporta una perspectiva local al viaje, ayudando a los viajeros a sentirse cómodos, comprender mejor los lugares que visitan y disfrutar de la experiencia a un ritmo natural.",
      text2:
        "Ya sea cruzando las montañas del Atlas, rumbo al Sahara o haciendo una parada en un pequeño pueblo por el camino, está ahí para hacer que el viaje sea más personal y más fácil de disfrutar.",
      speaks: "Youssef habla",
      languages: ["Inglés", "Español", "Árabe", "Amazigh"],
      detail: "Conocimiento local · Viaje flexible · Hospitalidad marroquí",
      alt: "Youssef, guía local en Marruecos de Tours Marrakech Desert",
      role: "Guía local en Marruecos",
    },
    road: {
      alt: "Carretera por los paisajes de Marruecos con Hmad, guía local experimentado",
      label: "Marruecos por carretera",
      captionTitle: "Mucho más que ir de un lugar a otro.",
      captionText:
        "Los paisajes entre cada destino también forman parte del viaje.",
      eyebrow: "Viajes pensados con cuidado",
      title: "La ruta importa.",
      titleAccent: "También importa cómo la recorres.",
      text: "Equilibramos el tiempo de conducción, las paradas que merecen la pena y la libertad suficiente para disfrutar de los lugares que visitas sin que cada día se sienta apresurado.",
      paceLabel: "Tu ritmo",
      paceText: "Flexible cuando la ruta lo permite.",
      focusLabel: "Nuestro enfoque",
      focusText: "Comodidad y paradas con sentido.",
    },
    team: {
      eyebrow: "Nuestro equipo",
      title: "Las personas detrás de",
      titleAccent: "tu viaje.",
      alt: "Equipo local de viajes en Marruecos de Tours Marrakech Desert",
      lead: "Un pequeño equipo local en el que cada persona cuida una parte diferente de tu viaje.",
      story: {
        start:
          "Detrás de cada viaje hay un pequeño equipo local que trabaja unido para que tu experiencia en Marruecos sea sencilla, personal y bien organizada.",
        mohsine:
          "se ocupa de tus correos y de la comunicación, responde a tus preguntas y te ayuda a preparar el viaje antes de tu llegada.",
        mohammed:
          "coordina las reservas de hoteles y los principales detalles del viaje para que todo esté bien organizado durante el recorrido. En la carretera,",
        hmad: "combina la conducción profesional con su experiencia como guía local en Marrakech, mientras que",
        youssef:
          ", guía local y conductor originario de la región del desierto, comparte su conocimiento del sur de Marruecos, sus paisajes y la vida local.",
      },
      closing:
        "Cada uno de nosotros tiene un papel diferente, pero compartimos el mismo objetivo: hacer que te sientas bienvenido, cómodo y acompañado con atención durante todo el viaje.",
      roles: [
        {
          name: "Mohsine",
          role: "Comunicación con viajeros",
          text: "Correos, preguntas y preparación del viaje",
        },
        {
          name: "Mohammed",
          role: "Coordinación del viaje",
          text: "Hoteles, reservas y organización",
        },
        {
          name: "Hmad",
          role: "Conductor y guía en Marrakech",
          text: "Conocimiento local y experiencia en carretera",
        },
        {
          name: "Youssef",
          role: "Guía del desierto y conductor",
          text: "Sahara, sur de Marruecos y vida local",
        },
      ],
      signature:
        "Cuatro personas. Roles diferentes. Un viaje cuidado en cada detalle.",
      location: "Equipo local · Marruecos",
    },
    travel: {
      eyebrow: "Viaja con nosotros",
      title: "Diferentes formas de descubrir",
      titleAccent: "Marruecos.",
      text: "Desde una sencilla excursión de un día hasta un viaje privado completo, nuestro papel es ayudarte a descubrir Marruecos de una forma natural, cómoda y personal.",
    },
    services: [
      {
        eyebrow: "Nuestra misión",
        title: "Viajar con sentido",
        text: "Creamos viajes por Marruecos que se sienten cómodos, personales y fáciles de disfrutar. Más allá de los lugares famosos, queremos que vivas los paisajes, la cultura, la gente y esos pequeños momentos que hacen inolvidable Marruecos.",
        linkText: "Descubre nuestro enfoque",
      },
      {
        eyebrow: "Nuestros servicios de viaje",
        title: "Explora Marruecos a tu manera",
        text: "Desde viajes al desierto y excursiones de un día hasta itinerarios completos por Marruecos, te ayudamos a elegir una experiencia que encaje con tus fechas, intereses y forma de viajar.",
        linkText: "Explora nuestros tours",
      },
      {
        eyebrow: "Tours privados por Marruecos",
        title: "Más libertad en el camino",
        text: "Viaja en privado con las personas que te importan. Disfruta de un ritmo más relajado, paradas flexibles y tiempo suficiente para conocer cada destino sin sentirte apresurado.",
        linkText: "Ver tours privados",
      },
      {
        eyebrow: "Viajes a medida por Marruecos",
        title: "¿Tienes otro viaje en mente?",
        text: "Cuéntanos qué lugares quieres conocer, qué experiencias te interesan y cuánto tiempo tienes. Podemos ayudarte a convertir esas ideas en un itinerario por Marruecos que encaje contigo.",
        linkText: "Comparte tu idea de viaje",
      },
    ],
    valuesHeader: {
      eyebrow: "Nuestros valores",
      title: "Lo que nos representa",
      text: "Principios sencillos que influyen en nuestra forma de planificar, comunicarnos y viajar con nuestros huéspedes.",
    },
    values: [
      {
        title: "Comodidad en cada detalle",
        text: "Planificamos cuidadosamente cada etapa de tu viaje para que la experiencia sea fluida, segura y cómoda de principio a fin.",
      },
      {
        title: "Un viaje pensado alrededor de ti",
        text: "Tu ritmo, tus intereses y tus prioridades importan. Siempre que es posible, adaptamos las paradas y los tiempos para crear una experiencia de viaje más personal.",
      },
      {
        title: "Hospitalidad con un toque local",
        text: "Un trato cálido y respetuoso forma parte de la experiencia. Queremos que cada viajero se sienta bienvenido y bien atendido durante todo su recorrido por Marruecos.",
      },
      {
        title: "Calidad cuidada",
        text: "Invertimos en lo que realmente importa: un servicio fiable, transporte cómodo, alojamientos seleccionados con cuidado y experiencias que merecen la pena.",
      },
      {
        title: "Conocimiento local que viaja contigo",
        text: "Nuestra experiencia local nos ayuda a recomendar las mejores rutas, paradas y opciones de viaje según la temporada y tus intereses.",
      },
    ],
  },
} as const;

async function page({params,}: { params: Promise<{ locale: Locale }>;}): Promise<React.JSX.Element> {

  const { locale } = await params;
  setRequestLocale(locale);
  const t = translations[locale] ?? translations.en;

  const teamIcons = [Mail, Hotel, Car, MapPinned] as const;

  return (
    <section className="overflow-hidden bg-background">
      <section className="bg-background pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            {/* LEFT — ABOUT */}
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {t.about.eyebrow}
              </p>

              <h1 className="mt-5 font-heading text-5xl font-semibold leading-[0.98] tracking-tight text-heading">
                {t.about.title}
                <span className="mt-2 block italic text-primary">
                  {t.about.titleAccent}
                </span>
              </h1>

              <p className="mt-8 max-w-xl text-lg leading-8 text-text-secondary">
                {t.about.intro}
              </p>

              <p className="mt-5 max-w-xl text-base leading-8 text-text-secondary">
                {t.about.description}
              </p>

              {/* SMALL POINTS */}
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
                {t.about.points.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-text-main"
                  >
                    <span className="size-1.5 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — CONTACT */}
            <div>
              <div className="border border-border bg-card p-6 rounded-[4px]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {t.contact.eyebrow}
                </p>

                <h2 className="mt-4 font-heading text-3xl font-semibold leading-[1.1] text-heading">
                  {t.contact.title}
                </h2>

                <p className="mt-4 max-w-md text-base leading-7 text-text-secondary">
                  {t.contact.text}
                </p>

                <p className="mt-4 max-w-md text-sm leading-6 text-text-muted">
                  {t.contact.subtext}
                </p>

                <div className="mt-8">
                  <a
                    href="https://wa.me/212704572370"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-[76px] items-center justify-between rounded-[4px] bg-primary px-3 py-2 transition-colors hover:bg-primary-hover"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
                        <MessageCircle className="size-5 text-primary-foreground" />
                      </div>

                      <div>
                        <p className="font-semibold text-primary-foreground">
                          {t.contact.cta}
                        </p>

                        <p className="mt-1 text-xs text-primary-foreground/75">
                          {t.contact.ctaText}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="size-5 text-primary-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </div>

                <div className="mt-7">
                  <p className="text-sm leading-6 text-text-secondary">
                    {t.contact.note}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            {/* LEFT — CONTENT */}
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {t.guide.eyebrow}
              </p>

              <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-heading sm:text-5xl">
                {t.guide.title}
              </h2>

              <p className="mt-6 text-base leading-8 text-text-secondary sm:text-lg">
                {t.guide.text1}
              </p>

              <p className="mt-5 text-base leading-8 text-text-secondary">
                {t.guide.text2}
              </p>

              {/* LANGUAGES */}
              <div className="mt-8">
                <p className="text-sm font-semibold text-heading">
                  {t.guide.speaks}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {t.guide.languages.map((language) => (
                    <span
                      key={language}
                      className=" cursor-default rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-text-secondary transition-all duration-200 hover:border-primary   hover:bg-primary hover:text-primary-foreground"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>

              {/* SMALL DETAIL */}
              <div className="mt-9 flex items-center gap-3">
                <p className="text-sm leading-6 text-text-muted">
                  {t.guide.detail}
                </p>
              </div>
            </div>

            {/* RIGHT — IMAGE */}
            <div className="relative min-h-[440px] overflow-hidden rounded-[6px] sm:min-h-[520px] lg:min-h-[580px]">
              <Image
                src="/images/youssef1.jpeg"
                alt={t.guide.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              <div className="absolute bottom-5 left-5">
                <div className="border border-border bg-background px-5 py-3">
                  <p className="font-heading text-xl font-semibold text-heading">
                    Youssef
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                    {t.guide.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[6px] border border-border bg-card">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            {/* IMAGE */}
            <div className="relative min-h-[360px] lg:min-h-[460px]">
              <Image
                src="/images/hmad.jpeg"
                alt={t.road.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 68vw"
              />

              {/* Small premium label */}
              <div className="absolute left-6 top-6 sm:left-8 sm:top-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  <Compass className="size-4 text-primary" />
                  {t.road.label}
                </div>
              </div>

              {/* Bottom caption */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="max-w-md">
                  <p className="font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                    {t.road.captionTitle}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/90">
                    {t.road.captionText}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="relative flex min-h-[360px] flex-col justify-between bg-footer p-7 sm:p-10 lg:p-12">
              {/* TOP */}
              <div>
                <div className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <Compass className="size-5 text-primary" />
                </div>
              </div>

              {/* MAIN MESSAGE */}
              <div className="py-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {t.road.eyebrow}
                </p>

                <h2 className="mt-5 font-heading text-4xl font-semibold leading-[1.05] text-footer-foreground">
                  {t.road.title}
                </h2>

                <p className="mt-2 font-heading text-3xl italic leading-tight text-primary">
                  {t.road.titleAccent}
                </p>

                <p className="mt-7 max-w-md text-base leading-8 text-footer-muted">
                  {t.road.text}
                </p>
              </div>

              {/* BOTTOM DETAIL */}
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      {t.road.paceLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-footer-muted">
                      {t.road.paceText}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      {t.road.focusLabel}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-footer-muted">
                      {t.road.focusText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* TOP */}
          <div className="grid gap-10 border-b border-border pb-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20 lg:pb-16">
            {/* LEFT — TITLE */}
            <div>
              <div className="flex items-center">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {t.team.eyebrow}
                </p>
              </div>

              <h2 className="mt-5 max-w-md font-heading text-4xl font-semibold leading-[1.05] text-heading sm:text-5xl">
                {t.team.title}
                <span className="block italic text-primary">
                  {t.team.titleAccent}
                </span>
              </h2>

              {/* IMAGE */}
              <div className="relative mt-8 h-[280px] w-full max-w-md overflow-hidden rounded-[6px] sm:h-[300px]">
                <Image
                  src="/images/team.webp"
                  alt={t.team.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* RIGHT — STORY */}
            <div className="lg:pt-5">
              <p className="max-w-3xl font-heading text-2xl leading-[1.45] text-heading sm:text-3xl">
                {t.team.lead}
              </p>

              <p className="mt-7 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
                {t.team.story.start}{" "}
                <strong className="font-semibold text-heading">Mohsine</strong>{" "}
                {t.team.story.mohsine}{" "}
                <strong className="font-semibold text-heading">Mohammed</strong>{" "}
                {t.team.story.mohammed}{" "}
                <strong className="font-semibold text-heading">Hmad</strong>{" "}
                {t.team.story.hmad}{" "}
                <strong className="font-semibold text-heading">Youssef</strong>
                {t.team.story.youssef}
              </p>

              <p className="mt-5 max-w-3xl text-base leading-8 text-text-secondary">
                {t.team.closing}
              </p>
            </div>
          </div>

          {/* TEAM ROLES */}
          <div className="grid border-l border-border sm:grid-cols-2 lg:grid-cols-4">
            {t.team.roles.map((member, index) => {
              const Icon = teamIcons[index];

              return (
                <div
                  key={member.name}
                  className="group border-b border-r border-border px-5 py-6 transition-colors duration-300 hover:bg-surface-soft sm:px-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-[18px]" />
                    </div>

                    <div>
                      <h3 className="font-heading text-xl font-semibold text-heading">
                        {member.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-primary">
                        {member.role}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-text-muted">
                        {member.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTTOM SIGNATURE */}
          <div className="flex flex-col gap-5 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-heading text-xl italic text-heading">
              {t.team.signature}
            </p>

            <div className="flex items-center gap-3">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                {t.team.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 rounded-xl lg:px-8">
          {/* HEADER */}
          <div className="mb-12 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {t.travel.eyebrow}
              </p>

              <h2 className="mt-4 max-w-2xl font-heading text-4xl font-semibold leading-[1.05] text-heading">
                {t.travel.title}
                <span className="italic text-primary">
                  {" "}
                  {t.travel.titleAccent}
                </span>
              </h2>
            </div>

            <p className="max-w-lg text-base leading-7 text-text-secondary lg:justify-self-end">
              {t.travel.text}
            </p>
          </div>

          {/* CARDS */}
          <div className="grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-4">
            {serviceMeta.map((service, index) => {
              const Icon = service.icon;
              const content = t.services[index];

              return (
                <article
                  key={service.number}
                  className=" group relative flex min-h-[350px] flex-col border-b border-r border-border bg-card p-6 transition-colors duration-300  hover:bg-surface-soft "
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="
                      flex size-9 items-center justify-center
                      rounded-full
                      bg-primary/10
                      text-primary
                      transition-colors duration-300
                      group-hover:bg-primary
                      group-hover:text-primary-foreground
                    "
                    >
                      <Icon className="size-5" />
                    </div>

                    <span className="font-heading text-xl text-text-muted/60">
                      {service.number}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-10">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      {content.eyebrow}
                    </p>

                    <h3 className="mt-3 font-heading text-2xl font-semibold leading-tight text-heading">
                      {content.title}
                    </h3>

                    <p className="mt-5 text-sm leading-7 text-text-secondary">
                      {content.text}
                    </p>
                  </div>

                  {/* LINK */}
                  <div className="mt-auto pt-8">
                    <Link
                      href={service.href}
                      className="
                      inline-flex items-center gap-2
                      text-sm font-semibold text-heading
                      transition-colors
                      hover:text-primary
                    "
                    >
                      {content.linkText}

                      <ArrowUpRight
                        className="
                        size-4 text-primary
                        transition-transform duration-200
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                      "
                      />
                    </Link>
                  </div>

                  {/* PRIMARY BOTTOM ACCENT */}
                  <div
                    className="
                    absolute inset-x-0 bottom-0 h-[2px]
                    origin-left scale-x-0
                    bg-primary
                    transition-transform duration-300
                    group-hover:scale-x-100
                  "
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-3 py-24 lg:px-8">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {t.valuesHeader.eyebrow}
            </p>

            <h2 className="mt-4 font-heading text-4xl font-semibold leading-none text-heading">
              {t.valuesHeader.title}
            </h2>
          </div>

          <p className="max-w-md leading-7 text-text-secondary">
            {t.valuesHeader.text}
          </p>
        </div>

        <div className="space-y-4">
          {t.values.map((value, index) => (
            <article
              key={value.title}
              className={`grid gap-6 border border-border bg-card p-5 sm:p-6 rounded-xl lg:grid-cols-[100px_0.8fr_1.2fr] lg:items-center ${
                index % 2 === 1 ? "lg:ml-20" : "lg:mr-20"
              }`}
            >
              <span className="font-heading text-4xl text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-heading text-2xl font-semibold text-heading sm:text-3xl">
                {value.title}
              </h3>

              <p className="max-w-2xl leading-7 text-text-secondary">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default page;
