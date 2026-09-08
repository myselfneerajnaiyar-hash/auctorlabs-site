import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/blog";
import { featurePages } from "../lib/feature-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/contact", "/pricing", "/products", "/success", "/auctor-rc", "/test-series", "/institute", "/blog", "/privacy-policy", "/terms", "/data-deletion"];
  const staticPages = staticPaths.map((pathname) => ({ url: `${SITE_URL}${pathname}`, lastModified: new Date() }));
  const features = featurePages.map((feature) => ({ url: `${SITE_URL}/features/${feature.slug}`, lastModified: new Date() }));
  return [...staticPages, ...features];
}
