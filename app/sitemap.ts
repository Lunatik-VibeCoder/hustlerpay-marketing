import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Only the real, indexable pages — never the noindex demo routes
// (design-system, content-framework). Static list, matches the real
// route set exactly; add a line here when a new real page ships.
const ROUTES = ["/", "/about", "/contact", "/privacy", "/terms", "/cookies"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
