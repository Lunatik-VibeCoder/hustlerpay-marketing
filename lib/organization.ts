import { SITE_NAME, SITE_URL } from "./seo";

// Single source of truth for HustlerPay's real-world contact/organization
// facts — consumed by both the /contact page (human-readable display) and
// the Organization JSON-LD below (structured data for search engines).
// Two independently hand-typed copies of the same real address/phone/
// email would be exactly the kind of drift already found in the design
// tokens; this avoids it for the one piece of entity data the site has.
export const CONTACT_INFO = {
  email: "contact@hustlerpay.com",
  phone: "+229 01 97 19 94 74",
  address: {
    streetAddress: "Lot 800 D Sehogan",
    addressLocality: "Cotonou",
    addressCountry: "BJ",
  },
} as const;

export const CONTACT_ADDRESS_DISPLAY = `${CONTACT_INFO.address.streetAddress}, ${CONTACT_INFO.address.addressLocality}, Bénin`;

// https://schema.org/Organization — the only structured-data type this
// site can back with real facts today (name/url/email/phone/address). No
// `sameAs` (social profiles) or `logo` — not fabricated, add once real.
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_INFO.address.streetAddress,
      addressLocality: CONTACT_INFO.address.addressLocality,
      addressCountry: CONTACT_INFO.address.addressCountry,
    },
  };
}
