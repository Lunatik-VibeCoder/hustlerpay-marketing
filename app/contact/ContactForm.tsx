"use client";

import { useState } from "react";
import { Input } from "@ui/Input";
import { Button } from "@ui/Button";

interface ContactFormValues {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

const EMPTY_VALUES: ContactFormValues = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
};

// Explicit instruction: do not wire this to any backend yet. Rather than
// simulate a submission and show a generic "thank you" (which would
// falsely imply the message went somewhere), submitting shows an honest,
// explicit notice instead. No ContactSubmitter/API call at all — when a
// real destination exists, this component's onSubmit is the only thing
// that changes.
export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-md border border-border bg-secondary p-4 text-sm text-foreground">
        L&apos;envoi de formulaire sera activé lors du lancement public. En attendant, contactez-nous directement via
        les coordonnées ci-contre.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="fullName" className="text-xs font-semibold text-muted-foreground uppercase">
          Nom complet
        </label>
        <Input
          id="fullName"
          required
          value={values.fullName}
          onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="company" className="text-xs font-semibold text-muted-foreground uppercase">
          Entreprise <span className="normal-case font-normal text-muted-foreground/70">(optionnel)</span>
        </label>
        <Input
          id="company"
          value={values.company}
          onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase">
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase">
            Téléphone <span className="normal-case font-normal text-muted-foreground/70">(optionnel)</span>
          </label>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="subject" className="text-xs font-semibold text-muted-foreground uppercase">
          Sujet
        </label>
        <Input
          id="subject"
          required
          value={values.subject}
          onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-xs font-semibold text-muted-foreground uppercase">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          className="flex w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>
      <label htmlFor="consent" className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          id="consent"
          type="checkbox"
          required
          checked={values.consent}
          onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-input accent-primary"
        />
        J&apos;accepte que ces informations soient utilisées pour répondre à ma demande, conformément à la{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          politique de confidentialité
        </a>
        .
      </label>
      <Button type="submit">Envoyer</Button>
    </form>
  );
}
