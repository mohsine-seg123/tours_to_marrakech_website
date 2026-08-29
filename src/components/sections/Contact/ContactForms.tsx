"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
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

export default function ContactForm(): React.JSX.Element {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof ContactFormData, value: string): void => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to send your message.");
      }
      toast.success("Message sent successfully!", {
        description: "Our travel team will contact you shortly.",
      });
      setForm(INITIAL_FORM);
    } catch (error) {
      toast.error("Something went wrong", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="contact-form"
      className="flex h-full flex-col rounded-[6px] bg-card p-6"
    >
      <div className="flex items-center gap-2">
        <Send className="h-4 w-4 text-primary" aria-hidden="true" />

        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          Send Us a Message
        </span>
      </div>

      <h2 className="mt-3 text-2xl font-bold text-heading sm:text-3xl">
        We&apos;re Here to Help
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-6 flex flex-1 flex-col space-y-5"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full Name">
            <input
              type="text"
              required
              autoComplete="name"
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Your full name"
              className={inputClass}
            />
          </Field>

          <Field label="Email Address">
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="Your email address"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="WhatsApp (Optional)">
          <input
            type="tel"
            autoComplete="tel"
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
            placeholder="Your WhatsApp number"
            className={inputClass}
          />
        </Field>

        <div className="flex flex-1 flex-col">
          <Field label="Message">
            <textarea
              required
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us about your trip, interests, or any questions…"
              className={`${inputClass} h-full min-h-[120px] flex-1 resize-y`}
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-heading placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </span>

      {children}
    </label>
  );
}
