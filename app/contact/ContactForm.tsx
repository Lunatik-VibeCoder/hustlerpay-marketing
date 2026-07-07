"use client";

import { useState } from "react";
import { Input } from "@ui/Input";
import { Button } from "@ui/Button";
import { NoopContactSubmitter } from "@/lib/contact/NoopContactSubmitter";
import { ContactFormValues } from "@/lib/contact/ContactSubmitter";

const submitter = new NoopContactSubmitter();

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    await submitter.submit(values);
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div className="rounded-md border border-border bg-secondary p-4 text-sm text-foreground">
        Merci pour votre message. En attendant l&apos;activation complète de ce formulaire, vous pouvez aussi nous
        joindre directement via les coordonnées ci-contre.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold text-muted-foreground uppercase">
            Nom
          </label>
          <Input
            id="name"
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          />
        </div>
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
      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
