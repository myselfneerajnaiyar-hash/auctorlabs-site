import fs from "fs";
import path from "path";
import matter from "gray-matter";
import BlogClient from "../components/BlogClient";

type Blog = {
  slug: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  category?: string;
};

function getBlogs() {
  const dir = path.join(process.cwd(), "content/blog");
  const files = fs.readdirSync(dir);

  const blogs: Blog[] = files.map((file) => {
    const slug = file.replace(".mdx", "");
    const filePath = path.join(dir, file);
    const source = fs.readFileSync(filePath, "utf-8");

    const { data } = matter(source);

    return {
      slug,
      title: data.title || "",
      description: data.description || "",
      date: data.date || "",
      image: data.image || "",
      category: data.category || "General",
    };
  }); // ✅ VERY IMPORTANT — closes map

  return blogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default function BlogPage() {
  const blogs = getBlogs();

  return <BlogClient blogs={blogs} />;
}