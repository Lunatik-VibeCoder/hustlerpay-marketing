import * as Icons from "lucide-react";
import { HelpCircle } from "lucide-react";

// Same pattern already used in HustlerPay Dashboard (src/components/
// dashboard/Sidebar.tsx's IconResolver) — content authors reference an
// icon by string name (JSON-serializable, works through ContentProvider
// metadata), resolved to a real lucide-react component at render time.
// Genuinely cross-portal generic; a candidate to dedupe against the
// Dashboard's copy once a shared UI package exists.
export function IconResolver({ name, className }: { name: string; className?: string }) {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!IconComponent) return <HelpCircle className={className} />;
  return <IconComponent className={className} />;
}
