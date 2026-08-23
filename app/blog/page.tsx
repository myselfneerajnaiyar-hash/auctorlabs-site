import BlogClient from "../components/BlogClient";
import Navbar from "../components/Navbar";
import { getAllBlogPostsHybrid } from "../../lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reading Comprehension & Verbal Skills Blog | Auctor Labs",
  description: "Practical guides to reading comprehension, vocabulary, verbal ability, grammar and critical reading for competitive-exam preparation.",
  alternates: {
    canonical: "https://auctorlabs.in/blog",
    types: { "application/rss+xml": "https://auctorlabs.in/blog/rss.xml" },
  },
  openGraph: {
    type: "website",
    url: "https://auctorlabs.in/blog",
    siteName: "Auctor Labs",
    title: "Reading Comprehension & Verbal Skills Blog",
    description: "Practical reading comprehension, vocabulary, grammar, verbal ability and critical-reading guidance for competitive-exam learners.",
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

export const dynamic = "force-dynamic";
export default async function BlogPage() {
  const blogs: Blog[] = (await getAllBlogPostsHybrid()).map(({ slug, title, description, date, image, category }) => ({
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
