import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: [
      "https://auctorlabs.in/sitemap.xml",
      "https://auctorlabs.in/blog/sitemap.xml",
    ],
  };
}
