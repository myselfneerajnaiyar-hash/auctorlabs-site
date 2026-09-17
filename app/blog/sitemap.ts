import type { MetadataRoute } from "next";
import { getPublishedBlogPosts, SITE_URL } from "../../lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = (await getPublishedBlogPosts()).map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedDate || post.date),
  }));

  return [
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
    },
    ...posts,
  ];
}
