import {
  Smartphone,
  Zap,
  Wallet,
  UserCheck,
  Building2,
  ShieldAlert,
  Server,
  Code2,
  Globe,
  Calculator,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

// Same pattern already used in HustlerPay Dashboard (src/components/
// dashboard/Sidebar.tsx's IconResolver) — content authors reference an
// icon by string name (JSON-serializable, works through ContentProvider
// metadata), resolved to a real lucide-react component at render time.
// Genuinely cross-portal generic; a candidate to dedupe against the
// Dashboard's copy once a shared UI package exists.
//
// Explicit named-import registry (same shape as SectionRenderer's
// SECTION_REGISTRY) instead of `import * as Icons from "lucide-react"` —
// the wildcard pulled the entire icon library into the module graph
// regardless of which icons content actually references. Adding a new
// icon name to content data requires adding its import + one line here;
// that's the accepted cost of real tree-shaking.
const ICON_REGISTRY: Record<string, LucideIcon> = {
  Smartphone,
  Zap,
  Wallet,
  UserCheck,
  Building2,
  ShieldAlert,
  Server,
  Code2,
  Globe,
  Calculator,
};

export function IconResolver({ name, className }: { name: string; className?: string }) {
  const IconComponent = ICON_REGISTRY[name] ?? HelpCircle;
  return <IconComponent className={className} />;
}
