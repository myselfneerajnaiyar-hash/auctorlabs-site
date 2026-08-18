import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const SITE_URL = "https://auctorlabs.in";
export const BLOG_AUTHOR = {
  name: "Auctor Labs Editorial Team",
  url: `${SITE_URL}/about`,
};

export type BlogStatus = "draft" | "review" | "published" | "archived";

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  updatedDate?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  author?: string;
  status?: BlogStatus;
  primaryKeyword?: string;
  secondaryKeywords?: string[];
  searchIntent?: string;
  cluster?: string;
  targetPage?: string;
  relatedArticles?: string[];
  externalReferences?: string[];
  schemaType?: "BlogPosting" | "Article";
  seoScore?: number;
  contentQualityScore?: number;
  refreshDate?: string;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  content: string;
  readingTime: number;
  wordCount: number;
};

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");

function wordsIn(content: string) {
  return content
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function getBlogSlugs() {
  return fs
    .readdirSync(BLOG_DIRECTORY)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIRECTORY, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(source);
  const wordCount = wordsIn(content);

  return {
    slug,
    content,
    title: data.title || slug,
    description: data.description || data.title || slug,
    date: data.date || "",
    updatedDate: data.updatedDate,
    image: data.image,
    imageAlt: data.imageAlt || data.title,
    category: data.category || "Strategy",
    author: data.author || BLOG_AUTHOR.name,
    status: data.status || "published",
    primaryKeyword: data.primaryKeyword,
    secondaryKeywords: data.secondaryKeywords || [],
    searchIntent: data.searchIntent,
    cluster: data.cluster || data.category || "Strategy",
    targetPage: data.targetPage,
    relatedArticles: data.relatedArticles || [],
    externalReferences: data.externalReferences || [],
    schemaType: data.schemaType || "BlogPosting",
    seoScore: data.seoScore,
    contentQualityScore: data.contentQualityScore,
    refreshDate: data.refreshDate,
    wordCount,
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
  };
}

export function getAllBlogPosts() {
  return getBlogSlugs()
    .map(getBlogPost)
    .filter((post): post is BlogPost => Boolean(post))
    .filter((post) => post.status === "published")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function tokens(post: BlogPost) {
  return new Set(
    `${post.title} ${post.category} ${post.cluster} ${post.primaryKeyword || ""}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3),
  );
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3) {
  const posts = getAllBlogPosts();
  const current = posts.find((post) => post.slug === currentSlug);
  if (!current) return posts.slice(0, limit);

  const explicit = (current.relatedArticles || [])
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => post !== undefined && post.slug !== currentSlug);
  const currentTokens = tokens(current);
  const ranked = posts
    .filter((post) => post.slug !== currentSlug && !explicit.some((item) => item.slug === post.slug))
    .map((post) => ({
      post,
      score:
        (post.cluster === current.cluster ? 5 : 0) +
        (post.category === current.category ? 3 : 0) +
        [...tokens(post)].filter((token) => currentTokens.has(token)).length,
    }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date).getTime() - new Date(a.post.date).getTime())
    .map(({ post }) => post);

  return [...explicit, ...ranked].slice(0, limit);
}

export function absoluteUrl(value?: string) {
  if (!value) return undefined;
  return value.startsWith("http") ? value : `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}
