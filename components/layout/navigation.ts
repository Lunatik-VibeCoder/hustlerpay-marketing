// Marketing-site navigation config — deliberately NOT in packages/ui.
// Nav items are inherently different per future HustlerPay portal
// (Marketing vs. Dashboard vs. Partners vs. Developers), so this isn't a
// cross-portal-shared primitive the way Button/Card are; only the
// underlying UI pieces (mega menu, mobile drawer mechanics) would be
// candidates for a future shared package, not this specific link list.

export interface NavLink {
  label: string;
  href: string;
  /** No dedicated page/destination exists yet — rendered as a disabled,
   * clearly-labeled item, never a link that would 404. Flip to false the
   * moment a real destination exists; never guess a placeholder href. */
  comingSoon?: boolean;
  /** True for links that leave this site (e.g. the live Dashboard app) —
   * real, already-deployed destinations, not fabricated. */
  external?: boolean;
}

export interface NavMegaMenu {
  label: string;
  items: NavLink[];
}

export type NavEntry = NavLink | NavMegaMenu;

export function isMegaMenu(entry: NavEntry): entry is NavMegaMenu {
  return "items" in entry;
}

// "HustlerPay Platform" links to the real homepage sections; "Dashboard"
// links to the real, already-deployed app.hustlerpay.com — both genuine
// destinations. Smart Calculator/API have no page yet (WEB-CALC-3 and a
// future developer portal respectively).
const productsMenu: NavMegaMenu = {
  label: "Products",
  items: [
    { label: "HustlerPay Platform", href: "/#features" },
    { label: "Smart Calculator", href: "", comingSoon: true },
    { label: "API", href: "", comingSoon: true },
    { label: "Dashboard", href: "https://app.hustlerpay.com", external: true },
  ],
};

// No dedicated solution page exists for any of these yet (WEB-CALC-2
// Sprint C only covers About/Privacy/Terms/Cookies/Contact) — all
// Coming Soon until a real page is built, never pointed at a generic
// anchor that doesn't actually match the specific solution.
const solutionsMenu: NavMegaMenu = {
  label: "Solutions",
  items: [
    { label: "Money Transfer", href: "", comingSoon: true },
    { label: "Mobile Money Automation", href: "", comingSoon: true },
    { label: "Treasury", href: "", comingSoon: true },
    { label: "Organizations", href: "", comingSoon: true },
  ],
};

export const HEADER_NAV: NavEntry[] = [
  productsMenu,
  solutionsMenu,
  { label: "Developers", href: "", comingSoon: true },
  { label: "Pricing", href: "", comingSoon: true },
  { label: "Documentation", href: "", comingSoon: true },
];

// Sign In / Get Started — UI placement only, per explicit instruction:
// prepare the header for these, without implementing authentication yet.
// Both point at /contact for now (the only real conversion path that
// exists today, same destination as the homepage's own CTAs) — never a
// fabricated auth flow. Update once a real sign-in/signup destination
// (possibly shared across app./partners./developers.hustlerpay.com) is
// decided.
export const HEADER_ACTIONS = {
  signIn: { label: "Sign In", href: "/contact" },
  getStarted: { label: "Get Started", href: "/contact" },
};

// Expanded per explicit requirement (WEB-CALC-2 Sprint C) to already
// reflect the shape of the wider HustlerPay ecosystem (Developers portal,
// Partners, Status, SDKs) even though most of these don't exist yet —
// same real-or-"Bientôt" rule as the header. "Developers" appears both as
// its own column (specific developer resources) and as a Resources link
// (a future developer portal/community hub) — intentional, not a
// duplication bug, per the user's own spec.
export const FOOTER_COLUMNS: { title: string; items: NavLink[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Platform", href: "/#features" },
      { label: "Dashboard", href: "https://app.hustlerpay.com", external: true },
      { label: "Smart Calculator", href: "", comingSoon: true },
      { label: "API", href: "", comingSoon: true },
    ],
  },
  {
    title: "Developers",
    items: [
      { label: "Documentation", href: "", comingSoon: true },
      { label: "API Reference", href: "", comingSoon: true },
      { label: "Webhooks", href: "", comingSoon: true },
      { label: "SDKs", href: "", comingSoon: true },
      { label: "Status", href: "", comingSoon: true },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Cookies", href: "/cookies" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Partners", href: "", comingSoon: true },
      { label: "Developers", href: "", comingSoon: true },
      { label: "Support", href: "", comingSoon: true },
      { label: "Changelog", href: "", comingSoon: true },
    ],
  },
];
