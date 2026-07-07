export interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Same abstraction shape as content/ContentProvider.ts — the form UI never
// knows how (or whether) a submission actually reaches anyone. Swapping
// NoopContactSubmitter for a real implementation (email API, backend
// endpoint) later touches only this file's export, never the form.
export interface ContactSubmitter {
  submit(values: ContactFormValues): Promise<void>;
}
