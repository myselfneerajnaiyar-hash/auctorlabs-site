import BlogClient from "../components/BlogClient";
import Navbar from "../components/Navbar";
import { getAllBlogPosts } from "../../lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAT VARC & Reading Comprehension Blog | Auctor Labs",
  description: "Practical CAT VARC strategies, reading comprehension methods, worked explanations and preparation guidance from Auctor Labs.",
  alternates: {
    canonical: "https://auctorlabs.in/blog",
    types: { "application/rss+xml": "https://auctorlabs.in/blog/rss.xml" },
  },
  openGraph: {
    type: "website",
    url: "https://auctorlabs.in/blog",
    siteName: "Auctor Labs",
    title: "CAT VARC & Reading Comprehension Blog",
    description: "Practical CAT VARC strategies, reading comprehension methods and worked explanations from Auctor Labs.",
  },
};

type Blog = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  category?: string;
};

export default function BlogPage() {
  const blogs: Blog[] = getAllBlogPosts().map(({ slug, title, description, date, image, category }) => ({
    slug,
    title,
    description,
    date,
    image,
    category,
  }));

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <BlogClient blogs={blogs} />
      </div>
    </>
  );
}
