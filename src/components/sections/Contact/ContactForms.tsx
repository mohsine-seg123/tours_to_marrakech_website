"use client";

import { useId, useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { Send, Loader2, User, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

interface ContactFormData {
  fullName: string;
  email: string;
  whatsapp: string;
  message: string;
}

const INITIAL_FORM: ContactFormData = {
  fullName: "",
  email: "",
  whatsapp: "",
  message: "",
};

const CONTENT = {
  en: {
    title: "Let’s Talk About",
    titleHighlight: "Your Trip to Morocco",
    description: "Tell us your dates, who’s travelling and what you’d like to experience. Our local team will reply with practical advice and a personalised proposal.",
    fullName: "Full name",
    fullNamePlaceholder: "Your full name",
    email: "Email address",
    emailPlaceholder: "you@example.com",
    optional: "Optional",
    whatsappPlaceholder: "Include your country code",
    message: "Your travel plans",
    messagePlaceholder: "...",
    submit: "Send my enquiry",
    sending: "Sending your enquiry...",
    successTitle: "Thank you for getting in touch",
    successDescription: "Your message has been sent. Our team will reply using the contact details you provided.",
    errorTitle: "Your message could not be sent",
    errorDescription:
      "Please try again in a moment. Your information is still in the form.",
  },
  fr: {
    title: "Parlons de",
    titleHighlight: "Votre Voyage au Maroc",
    description:
      "Indiquez-nous vos dates, le nombre de voyageurs et vos envies. Notre équipe locale vous répondra avec des conseils pratiques et une proposition personnalisée.",
    fullName: "Nom complet",
    fullNamePlaceholder: "Votre nom et prénom",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.com",
    optional: "Facultatif",
    whatsappPlaceholder: "Avec votre indicatif téléphonique",
    message: "Votre projet de voyage",
    messagePlaceholder:"...",
    submit: "Envoyer ma demande",
    sending: "Envoi de votre demande...",
    successTitle: "Merci pour votre message",
    successDescription:
      "Votre message a bien été envoyé. Notre équipe vous répondra aux coordonnées indiquées.",
    errorTitle: "Votre message n’a pas pu être envoyé",
    errorDescription:
      "Veuillez réessayer dans un instant. Vos informations sont conservées dans le formulaire.",
  },
  es: {
    title: "Hablemos de",
    titleHighlight: "Tu Viaje a Marruecos",
    description:
      "Cuéntanos tus fechas, cuántas personas viajáis y qué te gustaría hacer. Nuestro equipo local te responderá con consejos prácticos y una propuesta personalizada.",
    fullName: "Nombre completo",
    fullNamePlaceholder: "Tu nombre y apellidos",
    email: "Correo electrónico",
    emailPlaceholder: "tu@ejemplo.com",
    optional: "Opcional",
    whatsappPlaceholder: "Incluye el prefijo de tu país",
    message: "Tus planes de viaje",
    messagePlaceholder: "...",
    submit: "Enviar mi consulta",
    sending: "Enviando tu consulta...",
    successTitle: "Gracias por contactar con nosotros",
    successDescription:
      "Tu mensaje se ha enviado. Nuestro equipo te responderá utilizando los datos de contacto que has facilitado.",
    errorTitle: "No se ha podido enviar tu mensaje",
    errorDescription:
      "Vuelve a intentarlo en unos instantes. Tus datos siguen en el formulario.",
  },
};

const INPUT_CLASS = "w-full rounded-xl border border-border bg-surface-soft py-3 pl-10 pr-4 font-body text-sm text-text-main placeholder:text-text-muted transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 focus:outline-none";

const LABEL_CLASS = "mb-2 block font-body text-sm font-semibold text-heading-soft";

const ICON_CLASS = "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary";

export default function ContactForm(): React.JSX.Element {
  const locale = useLocale();
  const currentLocale = locale === "fr" || locale === "es" ? locale : "en";
  const t = CONTENT[currentLocale];

  const formId = useId();

  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof ContactFormData, value: string): void => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data: { success?: boolean } | null = await response.json();

      if (!response.ok || !data?.success) {
        toast.error(t.errorTitle, {
          description: t.errorDescription,
        });
        return;
      }

      toast.success(t.successTitle, {
        description: t.successDescription,
      });

      setForm(INITIAL_FORM);
    } catch {
      toast.error(t.errorTitle, {
        description: t.errorDescription,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact-form"
      lang={currentLocale}
      className="relative flex h-full flex-col overflow-hidden rounded-xl bg-card py-6 px-8 shadow-lg shadow-desert/10 ring-1 ring-border"
    >
      {/* PRÉSENTATION */}
      <div className="relative">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-heading">
          {t.title}{" "}
          <span className="bg-gradient-to-r from-primary via-gold to-primary bg-clip-text text-transparent">
            {t.titleHighlight}
          </span>
        </h2>

        <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
          {t.description}
        </p>
      </div>

      {/* FORMULAIRE */}
      <form
        onSubmit={handleSubmit}
        aria-busy={loading}
        className="relative mt-8 flex flex-1 flex-col space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* NOM */}
          <div className="group relative">
            <label htmlFor={`${formId}-fullName`} className={LABEL_CLASS}>
              {t.fullName}
            </label>

            <div className="relative">
              <User className={ICON_CLASS} aria-hidden="true" />

              <input
                id={`${formId}-fullName`}
                name="fullName"
                type="text"
                required
                autoComplete="name"
                disabled={loading}
                value={form.fullName}
                onChange={(event) =>
                  updateField("fullName", event.target.value)
                }
                placeholder={t.fullNamePlaceholder}
                className={INPUT_CLASS}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="group relative">
            <label htmlFor={`${formId}-email`} className={LABEL_CLASS}>
              {t.email}
            </label>

            <div className="relative">
              <Mail className={ICON_CLASS} aria-hidden="true" />

              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                required
                autoComplete="email"
                disabled={loading}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder={t.emailPlaceholder}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        </div>

        {/* WHATSAPP */}
        <div className="group relative">
          <label htmlFor={`${formId}-whatsapp`} className={LABEL_CLASS}>
            WhatsApp <span className="text-text-muted">({t.optional})</span>
          </label>

          <div className="relative">
            <Phone className={ICON_CLASS} aria-hidden="true" />

            <input
              id={`${formId}-whatsapp`}
              name="whatsapp"
              type="tel"
              autoComplete="tel"
              disabled={loading}
              value={form.whatsapp}
              onChange={(event) => updateField("whatsapp", event.target.value)}
              placeholder={t.whatsappPlaceholder}
              className={INPUT_CLASS}
            />
          </div>
        </div>

        {/* MESSAGE */}
        <div className="group relative flex flex-1 flex-col">
          <label htmlFor={`${formId}-message`} className={LABEL_CLASS}>
            {t.message}
          </label>

          <div className="relative flex flex-1">
            <MessageSquare
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-text-muted transition-colors group-focus-within:text-primary"
            />

            <textarea
              id={`${formId}-message`}
              name="message"
              required
              disabled={loading}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder={t.messagePlaceholder}
              className="min-h-[140px] flex-1 resize-none rounded-xl border border-border bg-surface-soft py-3 pl-10 pr-4 font-body text-sm text-text-main placeholder:text-text-muted transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 focus:outline-none"
            />
          </div>
        </div>

        {/* ENVOI */}
        <button
          type="submit"
          disabled={loading}
          className="group/btn relative inline-flex w-full items-center hover:cursor-pointer justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-gold-soft px-6 py-3 font-body text-sm font-bold text-primary-foreground shadow-sm disabled:cursor-wait"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full"
          />

          {loading ? (
            <>
              <Loader2
                className="h-4 w-4 shrink-0 animate-spin"
                aria-hidden="true"
              />
              {t.sending}
            </>
          ) : (
            <>
              <Send
                className="h-4 w-4 shrink-0 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                aria-hidden="true"
              />
              {t.submit}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
