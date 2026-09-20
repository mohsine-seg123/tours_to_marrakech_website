import { Mail } from "lucide-react";
import { ContactItem } from "@/type/contact";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function ContactInformation({locale,ITEMS,}: {locale: string; ITEMS: ContactItem[];}): React.JSX.Element {

  if(!hasLocale(routing.locales,locale)){
    notFound();
  }

 const content = {
  en: {
    title: "Contact Information",
    label: "Get in Touch",
  },
  fr: {
    title: "Informations de contact",
    label: "Entrer en contact",
  },
  es: {
    title: "Información de contacto",
    label: "Ponte en contacto",
  },
 };

 const t= content[locale] || content.en;
  return (
    <div
      id="contact-form"
      className="flex h-full flex-col bg-card p-6 rounded-[6px]"
    >
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          {t?.label}
        </span>
      </div>

      <h2 className="mt-3 text-2xl font-bold text-heading sm:text-3xl">
        {t?.title}
      </h2>

      <ul className="mt-6 space-y-3">
        {ITEMS.map((item) => {
          const content = (
            <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-heading">{item.label}</p>
                <p className="mt-0.5 truncate text-sm text-text-secondary">
                  {item.value}
                </p>
                {item.note && (
                  <p className="mt-0.5 text-xs text-text-muted">{item.note}</p>
                )}
              </div>
            </div>
          );

          return (
            <li key={item.label}>
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="block"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
