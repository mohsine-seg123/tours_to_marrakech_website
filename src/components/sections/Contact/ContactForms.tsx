
"use client";

import { useState } from "react";
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
      className="relative flex h-full flex-col overflow-hidden rounded-xl bg-card py-6 px-8 shadow-lg shadow-desert/10 ring-1 ring-border"
    >
    
      {/* Header */}
      <div className="relative">

        <h2 className="font-heading text-3xl font-bold tracking-tight text-heading">
          Let&apos;s Plan Your
          <span className=" bg-gradient-to-r from-primary via-gold to-primary bg-clip-text text-transparent">
            {" "}Perfect Journey
          </span>
        </h2>
        
        <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
          Tell us about your dream trip and our experts will craft the perfect
          itinerary for you.
        </p>
      </div>

      {/* Form */}
      <form 
        onSubmit={handleSubmit} 
        className="relative mt-8 flex flex-1 flex-col space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="group relative">
            <label className="mb-2 block font-body text-sm font-semibold text-heading-soft">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
              <input
                type="text"
                required
                autoComplete="name"
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder="John Doe"
                className="w-full rounded-xl border border-border bg-surface-soft py-3 pl-10 pr-4 font-body text-sm text-text-main placeholder:text-text-muted transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div className="group relative">
            <label className="mb-2 block font-body text-sm font-semibold text-heading-soft">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="john@example.com"
                className="w-full rounded-xl border border-border bg-surface-soft py-3 pl-10 pr-4 font-body text-sm text-text-main placeholder:text-text-muted transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp */}
        <div className="group relative">
          <label className="mb-2 block font-body text-sm font-semibold text-heading-soft">
            WhatsApp <span className="text-text-muted">(Optional)</span>
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
            <input
              type="tel"
              autoComplete="tel"
              value={form.whatsapp}
              onChange={(event) => updateField("whatsapp", event.target.value)}
              className="w-full rounded-xl border border-border bg-surface-soft py-3 pl-10 pr-4 font-body text-sm text-text-main placeholder:text-text-muted transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Message */}
        <div className="group relative flex flex-1 flex-col">
          <label className="mb-2 block font-body text-sm font-semibold text-heading-soft">
            Message
          </label>
          <div className="relative flex flex-1">
            <MessageSquare className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-text-muted transition-colors group-focus-within:text-primary" />
            <textarea
              required
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="Tell us about your dream trip..."
              className="min-h-[140px] flex-1 resize-none rounded-xl border border-border bg-surface-soft py-3 pl-10 pr-4 font-body text-sm text-text-main placeholder:text-text-muted transition-all focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="group/btn relative inline-flex w-full items-center hover:cursor-pointer justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-gold-soft px-6 py-3 font-body text-sm font-bold text-primary-foreground shadow-sm"
        >
          {/* Effet de brillance */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover/btn:translate-x-full" />
          
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" aria-hidden="true" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
