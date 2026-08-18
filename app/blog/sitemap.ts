import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "../../lib/blog";

const BASE_URL = "https://auctorlabs.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.date),
  }));

  return [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
    },
    ...posts,
  ];
}
