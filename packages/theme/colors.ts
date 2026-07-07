// Grounded in the real, already-shipped HustlerPay Dashboard palette
// (HustlerPay Dashboard/src/styles/theme.css) — a dark-first theme with a
// lime-green primary accent, not invented for this repo. Keeping these
// values identical (not just "similar") is what lets Marketing/Dashboard
// eventually share one Design System, per the long-term platform vision.
export const colors = {
  background: "#050B08",
  foreground: "#F5F5F5",

  primary: "#C5FF41",
  primaryForeground: "#050B08",

  secondary: "#0D1F16",
  secondaryForeground: "#F5F5F5",

  surface: "#1E3A2B",
  surfaceForeground: "#F5F5F5",

  muted: "#0D1F16",
  mutedForeground: "#8E9A8E",

  accent: "#1E3A2B",
  accentForeground: "#C5FF41",

  border: "#1E3A2B",
  input: "#0D1F16",
  ring: "#C5FF41",

  // Semantic status colors — match the Tailwind shades (emerald/amber/red/
  // blue -400) already used throughout the Dashboard's badges (e.g.
  // BeneficiaryStatusBadge), not new colors invented for Marketing.
  success: "#34d399",
  successForeground: "#052e1c",
  warning: "#fbbf24",
  warningForeground: "#451a03",
  destructive: "#f87171",
  destructiveForeground: "#450a0a",
  info: "#60a5fa",
  infoForeground: "#0c1e3e",
} as const;

export type ColorToken = keyof typeof colors;
