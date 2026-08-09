import fs from "fs";
import path from "path";
import type { MetadataRoute } from "next";
import matter from "gray-matter";

const BASE_URL = "https://auctorlabs.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogDirectory = path.join(process.cwd(), "content", "blog");

  const posts = fs
    .readdirSync(blogDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(blogDirectory, file);
      const source = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(source);
      const publishedDate = new Date(data.date);

      return {
        url: `${BASE_URL}/blog/${file.replace(/\.mdx$/, "")}`,
        lastModified: Number.isNaN(publishedDate.getTime())
          ? fs.statSync(filePath).mtime
          : publishedDate,
      };
    });

  return [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
    },
    ...posts,
  ];
}
