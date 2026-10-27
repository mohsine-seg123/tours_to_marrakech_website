import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link, type Locale } from "@/i18n/routing";
import Image from "next/image";

type PageProps = { params: Promise<{ locale: string }> };
type TextItem = { title: string; text: string };
type PolicyContent = {
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogLocale: string;
    imageAlt: string;
  };
  eyebrow: string;
  title: string;
  highlight: string;
  intro: string;
  summaryLabel: string;
  summary: TextItem[];
  processTitle: string;
  steps: TextItem[];
  pdfItems: string[];
  pdfNote: string;
  cancellation: {
    label: string;
    title: string;
    intro: string;
    notice: string;
    terms: string;
    support: string;
  };
  payment: TextItem & { security: string };
  informationTitle: string;
  information: TextItem[];
  cta: TextItem & { eyebrow: string; link: string };
};



const content: Record<Locale, PolicyContent> = {
  en: {
    meta: {
      title: "Booking, Payment & Cancellation Policy | Tours Marrakech Desert",
      description:
        "Learn how booking works with Tours Marrakech Desert, including the €150 deposit, PayPal and Mastercard payments, travel confirmation, hotel reservations and cancellation refunds.",
      keywords: [
        "Tours Marrakech Desert booking policy",
        "morocco tour guide book",
        "Morocco tour deposit",
        "Marrakech desert tour booking",
        "Morocco tour payment",
        "Morocco tour cancellation policy",
        "Morocco tour deposit refund",
        "private Morocco tour booking",
        "Marrakech desert tour payment",
        "Morocco travel booking policy",
      ],
      ogLocale: "en_US",
      imageAlt: "Booking and travel planning with Tours Marrakech Desert in Morocco",
    },
    eyebrow: "Booking & Payment",
    title: "Plan your journey with confidence.",
    highlight: "Clear steps from confirmation to arrival.",
    intro:
      "Booking a private journey should feel simple and transparent. At Tours Marrakech Desert, we want you to understand how your reservation is confirmed, when payments are made, what you receive after booking and what happens if your plans change.",
    summaryLabel: "Booking at a glance",
    summary: [
      { title: "€150 Deposit", text: "Required to confirm your booking." },
      {
        title: "Balance on arrival",
        text: "The remaining amount can be paid when you arrive in Morocco, according to the payment arrangement agreed with our team.",
      },
      {
        title: "Cancellation notice",
        text: "Please contact us at least 15 days before the scheduled start of your tour if you need to cancel.",
      },
    ],
    processTitle: "Your booking, step by step",
    steps: [
      {
        title: "Tell us about your journey",
        text: "Share your travel dates, number of travelers, destinations, preferred itinerary, interests and any important travel requirements. Together, we confirm the proposed itinerary and main trip details before requesting your deposit.",
      },
      {
        title: "Confirm your booking with a €150 deposit",
        text: "To confirm the tour, Tours Marrakech Desert requires a €150 deposit. Once it is received, our team can begin securing the confirmed travel arrangements, including accommodation and other required reservations.",
      },
      {
        title: "We organize the confirmed services",
        text: "After receiving the deposit, Mohammed coordinates hotel reservations and important travel arrangements. Our team verifies the main services connected to your confirmed itinerary and prepares the relevant logistics before your arrival.",
      },
      {
        title: "Receive your complete travel PDF",
        text: "After the main reservations are completed, you receive a complete travel confirmation document in PDF format. Depending on your confirmed arrangements and the details available, it may include:",
      },
      {
        title: "Pay the remaining balance",
        text: "The remaining balance does not need to be paid together with the initial €150 deposit. You can pay the outstanding amount upon arrival in Morocco, according to the payment arrangement confirmed with Tours Marrakech Desert before the beginning of your tour.",
      },
    ],
    pdfItems: [
      "Confirmed itinerary",
      "Travel dates",
      "Accommodation information",
      "Pick-up information",
      "Driver or guide information, when available",
      "Main included services",
      "Payment information",
      "Useful travel notes",
      "Important contact details",
    ],
    pdfNote:
      "This gives you a clear overview of your journey before you arrive in Morocco.",
    cancellation: {
      label: "Cancellation policy",
      title: "If your plans change",
      intro:
        "If you need to cancel your tour, please contact us as early as possible.",
      notice: "If you cancel your tour, your €150 deposit will be refunded.",
      terms:
        "We recommend contacting us as soon as possible so we can cancel any accommodation, reservations or services that may already have been arranged on your behalf.",
      support:
        "Our team will assist you with the cancellation process and confirm the refund details with you.",
    },
    payment: {
      title: "Payment methods",
      text: "The \u20ac150 booking deposit can be paid securely by PayPal or Mastercard. The remaining balance can be paid upon arrival in Morocco according to the payment arrangement confirmed with our team before the beginning of your tour.",
      security:
        "For your security, make payments only using the official payment details provided directly by Tours Marrakech Desert.",
    },
    informationTitle: "Important booking information",
    information: [
      {
        title: "Clear communication",
        text: "We confirm the main details of your journey before requesting the deposit.",
      },
      {
        title: "Reservations after confirmation",
        text: "Accommodation and required arrangements are organized after the booking is confirmed.",
      },
      {
        title: "Travel confirmation",
        text: "You receive clear trip information before your arrival.",
      },
      {
        title: "Local support",
        text: "Our team remains available if you have questions about your reservation.",
      },
    ],
    cta: {
      eyebrow: "Still have a question?",
      title: "Ask before you book.",
      text: "If something about the deposit, payment, itinerary or cancellation policy is unclear, contact us before confirming your journey. We are happy to explain the process clearly.",
      link: "Contact our team about your booking",
    },
  },
  fr: {
    meta: {
      title: "Réservation, paiement et annulation | Tours Marrakech Desert",
      description:
        "Découvrez comment réserver avec Tours Marrakech Desert : acompte de 150 €, paiement PayPal ou Mastercard, confirmation du voyage, réservations et remboursement en cas d’annulation.",
      keywords: [
        "réservation circuit Maroc",
        "Tours Marrakech Desert réservation",
        "acompte circuit Maroc",
        "paiement circuit Maroc",
        "circuit désert Marrakech réservation",
        "politique annulation circuit Maroc",
        "remboursement acompte Maroc",
        "circuit privé Maroc réservation",
        "paiement voyage Maroc",
        "conditions réservation Maroc",
      ],
      ogLocale: "fr_FR",
      imageAlt:
        "Réservation et organisation de voyage avec Tours Marrakech Desert au Maroc",
    },
    eyebrow: "Réservation et paiement",
    title: "Préparez votre voyage en toute confiance.",
    highlight: "Des étapes claires, de la confirmation à votre arrivée.",
    intro:
      "Réserver un voyage privé devrait être simple et transparent. Chez Tours Marrakech Desert, nous souhaitons que vous sachiez comment votre réservation est confirmée, quand effectuer vos paiements, quels documents vous recevrez et ce qui se passe si vos projets changent.",
    summaryLabel: "Votre réservation en bref",
    summary: [
      {
        title: "Acompte de 150 €",
        text: "Nécessaire pour confirmer votre réservation.",
      },
      {
        title: "Solde à l’arrivée",
        text: "Le solde restant peut être réglé à votre arrivée au Maroc, selon les modalités de paiement convenues avec notre équipe.",
      },
      {
        title: "Délai d’annulation",
        text: "Si vous devez annuler, merci de nous contacter au moins 15 jours avant la date de départ prévue de votre circuit.",
      },
    ],
    processTitle: "Votre réservation, étape par étape",
    steps: [
      {
        title: "Parlez-nous de votre voyage",
        text: "Indiquez-nous vos dates de voyage, le nombre de voyageurs, les destinations, l’itinéraire souhaité, vos centres d’intérêt et vos besoins particuliers. Ensemble, nous confirmons l’itinéraire proposé et les principaux détails du séjour avant de vous demander l’acompte.",
      },
      {
        title: "Confirmez votre réservation avec un acompte de 150 €",
        text: "Pour confirmer le circuit, Tours Marrakech Desert demande un acompte de 150 €. Dès sa réception, notre équipe peut commencer à réserver les prestations convenues, notamment les hébergements et les autres services nécessaires.",
      },
      {
        title: "Nous organisons les prestations confirmées",
        text: "Après réception de l’acompte, Mohammed coordonne les réservations d’hôtels et les principaux préparatifs du voyage. Notre équipe vérifie les prestations liées à votre itinéraire confirmé et prépare la logistique nécessaire avant votre arrivée.",
      },
      {
        title: "Recevez votre document de voyage complet au format PDF",
        text: "Une fois les principales réservations effectuées, vous recevez un document de confirmation du voyage complet au format PDF. Selon les prestations confirmées et les informations disponibles, il peut comprendre :",
      },
      {
        title: "Réglez le solde restant",
        text: "Le solde restant n’a pas besoin d’être réglé en même temps que l’acompte initial de 150 €. Vous pouvez le payer à votre arrivée au Maroc, selon les modalités convenues avec Tours Marrakech Desert avant le début de votre circuit.",
      },
    ],
    pdfItems: [
      "Itinéraire confirmé",
      "Dates du voyage",
      "Informations sur les hébergements",
      "Informations sur la prise en charge",
      "Coordonnées du chauffeur ou du guide, si disponibles",
      "Principales prestations incluses",
      "Informations sur le paiement",
      "Conseils pratiques pour le voyage",
      "Coordonnées des contacts importants",
    ],
    pdfNote:
      "Vous disposez ainsi d’une vue d’ensemble claire de votre voyage avant votre arrivée au Maroc.",
    cancellation: {
      label: "Politique d’annulation",
      title: "Si vos plans changent",
      intro:
        "Si vous devez annuler votre circuit, veuillez nous contacter le plus tôt possible.",
      notice:
        "Si vous annulez votre circuit, votre acompte de 150 € vous sera remboursé.",
      terms:
        "Nous vous recommandons de nous contacter dès que possible afin que nous puissions annuler les hébergements, réservations ou services qui auraient déjà été organisés en votre nom.",
      support:
        "Notre équipe vous accompagnera dans le processus d’annulation et vous confirmera les modalités du remboursement.",
    },
    payment: {
      title: "M\u00e9thodes de paiement",
      text: "L'acompte de 150 \u20ac n\u00e9cessaire pour confirmer votre r\u00e9servation peut \u00eatre pay\u00e9 en toute s\u00e9curit\u00e9 via PayPal ou par carte Mastercard. Le solde restant peut \u00eatre r\u00e9gl\u00e9 \u00e0 votre arriv\u00e9e au Maroc, selon les modalit\u00e9s convenues avec notre \u00e9quipe avant le d\u00e9but du circuit.",
      security:
        "Pour votre s\u00e9curit\u00e9, effectuez vos paiements uniquement \u00e0 partir des informations de paiement officielles fournies directement par Tours Marrakech Desert.",
    },
    informationTitle: "Informations importantes pour votre réservation",
    information: [
      {
        title: "Des échanges clairs",
        text: "Nous confirmons les principaux détails de votre voyage avant de demander l’acompte.",
      },
      {
        title: "Des réservations après confirmation",
        text: "Les hébergements et les prestations nécessaires sont organisés après confirmation de la réservation.",
      },
      {
        title: "La confirmation du voyage",
        text: "Vous recevez des informations claires sur votre séjour avant votre arrivée.",
      },
      {
        title: "Une équipe sur place",
        text: "Notre équipe reste à votre disposition pour toute question concernant votre réservation.",
      },
    ],
    cta: {
      eyebrow: "Vous avez encore une question ?",
      title: "Posez vos questions avant de réserver.",
      text: "Si un point concernant l’acompte, le paiement, l’itinéraire ou les conditions d’annulation n’est pas clair, contactez-nous avant de confirmer votre voyage. Nous serons heureux de vous expliquer chaque étape.",
      link: "Contacter notre équipe au sujet de votre réservation",
    },
  },
  es: {
    meta: {
      title: "Reserva, pago y cancelación | Tours Marrakech Desert",
      description:
        "Consulta cómo reservar con Tours Marrakech Desert: depósito de 150 €, pago con PayPal o Mastercard, confirmación del viaje, reservas y reembolso por cancelación.",
      keywords: [
        "reserva tour Marruecos",
        "Tours Marrakech Desert reserva",
        "depósito tour Marruecos",
        "pago tour Marruecos",
        "reserva tour desierto Marrakech",
        "política cancelación Marruecos",
        "reembolso depósito Marruecos",
        "tour privado Marruecos reserva",
        "pago viaje Marruecos",
        "condiciones reserva Marruecos",
      ],
      ogLocale: "es_ES",
      imageAlt:
        "Reserva y planificación de viaje con Tours Marrakech Desert en Marruecos",
    },
    eyebrow: "Reserva y pago",
    title: "Planifica tu viaje con confianza.",
    highlight: "Pasos claros desde la confirmación hasta tu llegada.",
    intro:
      "Reservar un viaje privado debería ser sencillo y transparente. En Tours Marrakech Desert queremos que sepas cómo se confirma tu reserva, cuándo se realizan los pagos, qué documentación recibirás y qué ocurre si cambian tus planes.",
    summaryLabel: "Tu reserva de un vistazo",
    summary: [
      {
        title: "Depósito de 150 €",
        text: "Necesario para confirmar tu reserva.",
      },
      {
        title: "Saldo a la llegada",
        text: "Puedes abonar el saldo restante al llegar a Marruecos, según las condiciones de pago acordadas con nuestro equipo.",
      },
      {
        title: "Aviso de cancelación",
        text: "Si necesitas cancelar, contacta con nosotros al menos 15 días antes de la fecha prevista de inicio de tu circuito.",
      },
    ],
    processTitle: "Tu reserva, paso a paso",
    steps: [
      {
        title: "Cuéntanos cómo te gustaría viajar",
        text: "Indícanos las fechas del viaje, el número de viajeros, los destinos, el itinerario que prefieres, tus intereses y cualquier necesidad importante. Juntos confirmamos el itinerario propuesto y los principales detalles del viaje antes de solicitar el depósito.",
      },
      {
        title: "Confirma tu reserva con un depósito de 150 €",
        text: "Para confirmar el circuito, Tours Marrakech Desert solicita un depósito de 150 €. Una vez recibido, nuestro equipo puede empezar a reservar los servicios acordados, como el alojamiento y las demás reservas necesarias.",
      },
      {
        title: "Organizamos los servicios confirmados",
        text: "Tras recibir el depósito, Mohammed coordina las reservas de hoteles y los preparativos importantes del viaje. Nuestro equipo verifica los principales servicios del itinerario confirmado y prepara la logística necesaria antes de tu llegada.",
      },
      {
        title: "Recibe la documentación completa de tu viaje en PDF",
        text: "Una vez completadas las principales reservas, recibirás un documento completo de confirmación del viaje en formato PDF. Según los servicios confirmados y la información disponible, puede incluir:",
      },
      {
        title: "Abona el saldo restante",
        text: "No es necesario abonar el saldo restante junto con el depósito inicial de 150 €. Puedes pagarlo al llegar a Marruecos, según las condiciones de pago acordadas con Tours Marrakech Desert antes del inicio de tu circuito.",
      },
    ],
    pdfItems: [
      "Itinerario confirmado",
      "Fechas del viaje",
      "Información sobre el alojamiento",
      "Información sobre la recogida",
      "Información del conductor o guía, cuando esté disponible",
      "Principales servicios incluidos",
      "Información sobre el pago",
      "Consejos prácticos para el viaje",
      "Datos de contacto importantes",
    ],
    pdfNote:
      "Así tendrás una visión clara de tu viaje antes de llegar a Marruecos.",
    cancellation: {
      label: "Política de cancelación",
      title: "Si cambian tus planes",
      intro:
        "Si necesitas cancelar tu tour, ponte en contacto con nosotros lo antes posible.",
      notice: "Si cancelas tu tour, te devolveremos el depósito de 150 €.",
      terms:
        "Te recomendamos que nos contactes lo antes posible para que podamos cancelar los alojamientos, reservas o servicios que ya hayan sido organizados en tu nombre.",
      support:
        "Nuestro equipo te ayudará durante el proceso de cancelación y te confirmará los detalles del reembolso.",
    },
    payment: {
      title: "M\u00e9todos de pago",
      text: "El dep\u00f3sito de 150 \u20ac necesario para confirmar la reserva puede pagarse de forma segura mediante PayPal o tarjeta Mastercard. El saldo restante puede pagarse a tu llegada a Marruecos, seg\u00fan las condiciones acordadas con nuestro equipo antes del inicio del tour.",
      security:
        "Por tu seguridad, realiza los pagos \u00fanicamente utilizando los datos de pago oficiales proporcionados directamente por Tours Marrakech Desert.",
    },
    informationTitle: "Información importante sobre tu reserva",
    information: [
      {
        title: "Comunicación clara",
        text: "Confirmamos los principales detalles de tu viaje antes de solicitar el depósito.",
      },
      {
        title: "Reservas tras la confirmación",
        text: "El alojamiento y los preparativos necesarios se organizan una vez confirmada la reserva.",
      },
      {
        title: "Confirmación del viaje",
        text: "Recibirás información clara sobre tu viaje antes de llegar.",
      },
      {
        title: "Apoyo local",
        text: "Nuestro equipo sigue a tu disposición si tienes preguntas sobre tu reserva.",
      },
    ],
    cta: {
      eyebrow: "¿Todavía tienes alguna pregunta?",
      title: "Pregunta antes de reservar.",
      text: "Si tienes dudas sobre el depósito, el pago, el itinerario o la política de cancelación, contacta con nosotros antes de confirmar tu viaje. Estaremos encantados de explicarte el proceso con claridad.",
      link: "Contactar con nuestro equipo sobre tu reserva",
    },
  },
};


function getLocale(locale: string): Locale {
  return locale === "fr" || locale === "es" ? locale : "en";
}


const BASE_URL = "https://toursmarrakechdesert.com";

const bookingPolicyPaths: Record<Locale, string> = {
  en: "/booking-policy",
  fr: "/politique-reservation",
  es: "/politica-reserva",
};

export async function generateMetadata({params,}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  const currentLocale = getLocale(locale);
  const meta = content[currentLocale].meta;

  const canonicalUrl = currentLocale === "en" ? `${BASE_URL}${bookingPolicyPaths.en}` : `${BASE_URL}/${currentLocale}${bookingPolicyPaths[currentLocale]}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${BASE_URL}${bookingPolicyPaths.en}`,
        fr: `${BASE_URL}/fr${bookingPolicyPaths.fr}`,
        es: `${BASE_URL}/es${bookingPolicyPaths.es}`,
        "x-default": `${BASE_URL}${bookingPolicyPaths.en}`,
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
      ].filter((value): value is string => value !== null),

      images: [
        {
          url: `${BASE_URL}/images/youssef1.jpeg`,
          alt: meta.imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [`${BASE_URL}/images/youssef1.jpeg`],
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

    category: "travel",
  };
}

export default async function BookingPolicyPage({ params }: PageProps) {
  const { locale } = await params;
  const currentLocale = getLocale(locale);
  setRequestLocale(currentLocale);
  const copy = content[currentLocale];

  return (
    <article className="bg-background text-text-main">
      <header className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:pb-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* LEFT — CONTENT */}
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-text-secondary">
              {copy.eyebrow}
            </p>

            <h1 className="mt-5 font-heading text-4xl font-semibold leading-tight tracking-tight text-heading sm:text-5xl">
              {copy.title}
            </h1>

            <p className="mt-4 font-heading text-3xl italic leading-tight text-primary">
              {copy.highlight}
            </p>

            <p className="mt-7 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
              {copy.intro}
            </p>
          </div>

          {/* RIGHT — IMAGE */}
          <div className="relative min-h-[340px] overflow-hidden sm:min-h-[420px]">
            <Image
              src="/images/youssef1.jpeg"
              alt="expert guide youssef with tourist un desert organised by Tours Marrakech Desert"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>

        <section
          aria-label={copy.summaryLabel}
          className="mt-8 rounded-[2px] border border-border bg-card p-6"
        >
          <dl className="grid gap-6 md:grid-cols-3 md:gap-8">
            {copy.summary.map((item) => (
              <div key={item.title}>
                <dt className="font-heading text-2xl font-semibold text-heading">
                  {item.title}
                </dt>
                <dd className="mt-2 text-base leading-7 text-text-secondary">
                  {item.text}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <section aria-labelledby="booking-process">
          <h2
            id="booking-process"
            className="font-heading text-3xl font-semibold text-heading sm:text-4xl"
          >
            {copy.processTitle}
          </h2>
          <ol className="mt-10 space-y-5">
            {copy.steps.map((step, index) => (
              <li
                key={step.title}
                className={`
        group
        grid
        gap-5
        rounded-[14px]
        border
        border-border
        bg-card
        p-6
        transition-all
        duration-300
        hover:border-primary/30
        hover:bg-surface-soft
        sm:p-7
        lg:grid-cols-[110px_0.85fr_1.25fr]
        lg:items-start
        lg:gap-10
        lg:px-8
        lg:py-9
        ${index % 2 === 0 ? "lg:mr-20" : "lg:ml-20"}
      `}
              >
                {/* NUMBER */}
                <div>
                  <span
                    aria-hidden="true"
                    className="font-heading text-3xl text-primary sm:text-4xl"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* TITLE */}
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary lg:hidden">
                    Step {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="font-heading text-2xl font-semibold leading-tight text-heading sm:text-3xl">
                    {step.title}
                  </h3>
                </div>

                {/* DESCRIPTION */}
                <div className="max-w-3xl">
                  <p className="text-base leading-8 text-text-secondary sm:text-lg">
                    {step.text}
                  </p>

                  {/* PDF CONTENT */}
                  {index === 3 && (
                    <div className="mt-6 border-t border-border pt-6">
                      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Your travel document may include
                      </p>

                      <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {copy.pdfItems.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm leading-6 text-text-secondary"
                          >
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />

                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <p className="mt-5 border-t border-border pt-5 text-sm leading-7 text-text-main">
                        {copy.pdfNote}
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-10 border-t border-border py-10 sm:py-14 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <section aria-labelledby="cancellation-policy">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-text-secondary">
              {copy.cancellation.label}
            </p>
            <h2
              id="cancellation-policy"
              className="mt-3 font-heading text-3xl font-semibold text-heading sm:text-4xl"
            >
              {copy.cancellation.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-text-secondary">
              {copy.cancellation.intro}
            </p>
            <p className="my-5 border-l-2 border-primary pl-5 text-lg leading-8 text-heading">
              <strong>{copy.cancellation.notice}</strong>
            </p>
            <p className="text-base leading-8 text-text-secondary">
              {copy.cancellation.terms}
            </p>
            <p className="mt-4 text-base leading-8 text-text-secondary">
              {copy.cancellation.support}
            </p>
          </section>
          <section
            aria-labelledby="payment-methods"
            className="self-start rounded-[4px] border border-border bg-card p-6 sm:p-8"
          >
            <h2
              id="payment-methods"
              className="font-heading text-3xl font-semibold text-heading"
            >
              {copy.payment.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-text-secondary">
              {copy.payment.text}
            </p>
            <p className="mt-6 border-t border-border pt-5 text-base leading-7 text-text-secondary">
              {copy.payment.security}
            </p>
          </section>
        </div>

        <section
          aria-labelledby="booking-information"
          className="border-t border-border py-10 sm:py-14"
        >
          <h2
            id="booking-information"
            className="font-heading text-3xl font-semibold text-heading sm:text-4xl"
          >
            {copy.informationTitle}
          </h2>
          <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {copy.information.map((item) => (
              <div key={item.title}>
                <h3 className="font-heading text-2xl font-semibold text-heading">
                  {item.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-text-secondary">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="booking-questions" className="rounded-[4px] border border-border bg-surface-soft px-6 py-10 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-text-secondary">
              {copy.cta.eyebrow}
            </p>
            <h2
              id="booking-questions"
              className="mt-3 font-heading text-3xl font-semibold text-heading sm:text-4xl"
            >
              {copy.cta.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-text-secondary">
              {copy.cta.text}
            </p>
            <Link
              href="/contact"
              className="mt-7 inline-flex min-h-12 items-center rounded-[4px] px-6 py-3 text-base font-semibold bg-primary text-white underline-offset-4"
            >
              {copy.cta.link}
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
