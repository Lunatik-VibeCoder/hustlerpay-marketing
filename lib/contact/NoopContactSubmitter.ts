import { ContactSubmitter, ContactFormValues } from "./ContactSubmitter";

// Sole implementation for WEB-CALC-2 Sprint C — logs only, sends nothing.
// IMPORTANT before this page takes real public traffic: replace this with
// a real implementation (email API or backend endpoint) — until then, a
// real visitor's message is NOT actually delivered anywhere. The form UI
// deliberately shows a modest, honest acknowledgment (see app/contact/
// page.tsx) rather than a specific promise ("we'll respond within 24h")
// that this implementation can't back up.
export class NoopContactSubmitter implements ContactSubmitter {
  async submit(values: ContactFormValues): Promise<void> {
    console.warn("[NoopContactSubmitter] Message not actually sent anywhere yet:", values);
  }
}
