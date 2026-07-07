import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Explicitly disallow the two internal engineering demo routes — they
// already carry noindex metadata (belt-and-suspenders, not redundant:
// robots.txt stops crawling, the meta tag stops indexing if crawled
// anyway e.g. via an external link). /calculator joins the list for
// Sprint A only (demo data, no real engine) — remove it, add the route
// to sitemap.ts, and switch its page to buildMetadata the day real
// quotes ship.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/design-system", "/content-framework", "/calculator"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
