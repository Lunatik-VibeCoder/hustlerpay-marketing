import { buildNoIndexMetadata } from "@/lib/seo";
import DesignSystemClient from "./DesignSystemClient";

// Internal engineering reference, not a real marketing page — noindex so
// it never surfaces in search results alongside the real site. The actual
// interactive showcase is a Client Component (DesignSystemClient) since it
// exercises stateful components (Tabs, Dialog, toasts); a Client Component
// cannot export `metadata` directly, hence this thin Server Component
// wrapper.
export const metadata = buildNoIndexMetadata({
  title: "Design System (demo)",
  description: "Internal showcase of the HustlerPay Design System (packages/theme + packages/ui).",
});

export default function DesignSystemPage() {
  return <DesignSystemClient />;
}
