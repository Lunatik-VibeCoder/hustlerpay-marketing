import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Explicitly disallow the two internal engineering demo routes — they
// already carry noindex metadata (belt-and-suspenders, not redundant:
// robots.txt stops crawling, the meta tag stops indexing if crawled
// anyway e.g. via an external link).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/design-system", "/content-framework"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
