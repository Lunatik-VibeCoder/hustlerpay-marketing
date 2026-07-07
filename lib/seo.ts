import type { Metadata } from "next";

// Real, intended production domain (this repo IS hustlerpay.com's
// marketing site) — not a placeholder guess.
const SITE_URL = "https://hustlerpay.com";
const SITE_NAME = "HustlerPay";

interface BuildMetadataOptions {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/", "/about", "/contact". */
  path: string;
}

// Shared helper so every real page gets title/description/canonical/OG
// consistently, without repeating the same boilerplate 6+ times. No real
// OG image exists yet — deliberately omitted (a broken/placeholder image
// reference would be worse than no image); add `openGraph.images` here
// once a real one is designed, nothing else needs to change.
export function buildMetadata({ title, description, path }: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "fr_FR",
    },
  };
}

// For internal/reference routes (design-system, content-framework demo
// pages) — real pages, but never meant to be publicly indexed alongside
// the actual marketing site.
export function buildNoIndexMetadata({ title, description }: { title: string; description: string }): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}
