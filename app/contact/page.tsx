import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — HustlerPay",
  description: "Contactez l'équipe HustlerPay.",
};

// Coordonnées réelles à fournir — jamais un email/téléphone/adresse
// inventé affiché comme réel sur une page publique. Remplacer ces 3
// valeurs (et retirer ce commentaire) dès qu'elles sont communiquées.
const CONTACT_INFO = {
  email: "À compléter",
  phone: "À compléter",
  address: "À compléter",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Contactez-nous</h1>
      <p className="text-muted-foreground mt-2">
        Une question, une démonstration à planifier ? Écrivez-nous.
      </p>

      <div className="mt-10 grid gap-10 sm:grid-cols-2">
        <ContactForm />

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm text-foreground">{CONTACT_INFO.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm text-foreground">{CONTACT_INFO.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm text-foreground">{CONTACT_INFO.address}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
