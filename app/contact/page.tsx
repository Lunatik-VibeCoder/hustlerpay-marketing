import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact — HustlerPay",
  description: "Contactez l'équipe HustlerPay pour toute question sur la plateforme.",
  path: "/contact",
});

const CONTACT_INFO = {
  email: "contact@hustlerpay.com",
  phone: "+229 01 97 19 94 74",
  address: "Lot 800 D Sehogan, Cotonou, Bénin",
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
            <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-foreground hover:text-primary">
              {CONTACT_INFO.email}
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-primary shrink-0" />
            <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} className="text-sm text-foreground hover:text-primary">
              {CONTACT_INFO.phone}
            </a>
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
