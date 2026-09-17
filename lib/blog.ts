import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const SITE_URL = "https://auctorlabs.in";
export const BLOG_AUTHOR = {
  name: "Auctor Labs Editorial Team",
  url: `${SITE_URL}/about`,
};

export type BlogStatus = "draft" | "review" | "published" | "unpublished" | "archived";
export type BlogCategory = "Reading Comprehension" | "Vocabulary" | "Grammar" | "Verbal Ability" | "Critical Reading";

export function normalizeBlogCategory(value?: string): BlogCategory {
  const category = (value || "").toLowerCase();
  if (/vocab|word root|synonym|antonym/.test(category)) return "Vocabulary";
  if (/grammar|modifier|parallelism|pronoun|tense|subject.?verb|error spotting|sentence correction/.test(category)) return "Grammar";
  if (/verbal ability|para jumble|para summary|odd sentence|cohesion|coherence|sentence placement/.test(category)) return "Verbal Ability";
  if (/critical reading|argument|assumption|bias|logical gap/.test(category)) return "Critical Reading";
  return "Reading Comprehension";
}

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
  audience?: string;
  relevantExams?: string[];
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
  return createBlogPost(slug, data as BlogFrontmatter & Record<string, unknown>, content);
}

export function createBlogPost(slug: string, data: BlogFrontmatter & Record<string, unknown>, content: string): BlogPost {
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
    category: normalizeBlogCategory(data.category),
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
    audience: typeof data.audience === "string" ? data.audience : undefined,
    relevantExams: Array.isArray(data.relevantExams) ? data.relevantExams.map(String) : [],
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

/** Production repository: Supabase owns every slug it knows; files are legacy-only. */
export async function getPublishedBlogPostBySlug(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const filePost = getBlogPost(slug);
    return filePost?.status === "published" ? filePost : null;
  }
  try {
    const { getCmsArticle, cmsRowToPost } = await import("./blog-cms-db");
    const row = await getCmsArticle(slug);
    if (row) return row.status === "published" ? cmsRowToPost(row) : null;
    const legacy = getBlogPost(slug);
    return legacy?.status === "published" ? legacy : null;
  } catch (error) {
    console.error("Production CMS article lookup failed; refusing an ambiguous filesystem fallback.", error);
    return null;
  }
}

export async function getPublishedBlogPosts() {
  const files = getAllBlogPosts();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return files;
  try {
    const { listCmsArticles, cmsRowToPost } = await import("./blog-cms-db");
    const rows = await listCmsArticles(), ownedSlugs = new Set(rows.map(row => row.slug));
    const database = rows.filter(row => row.status === "published").map(cmsRowToPost);
    return mergePublishedBlogPosts(database, files, ownedSlugs);
  } catch (error) {
    console.error("Production CMS article listing failed; refusing a potentially stale filesystem fallback.", error);
    return [];
  }
}

export function mergePublishedBlogPosts(database:BlogPost[],files:BlogPost[],ownedSlugs:ReadonlySet<string>){return [...database,...files.filter(post=>!ownedSlugs.has(post.slug))].filter(post=>post.status==="published").sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime());}

export const getBlogPostHybrid = getPublishedBlogPostBySlug;
export const getAllBlogPostsHybrid = getPublishedBlogPosts;

function tokens(post: BlogPost) {
  return new Set(
    `${post.title} ${post.category} ${post.cluster} ${post.primaryKeyword || ""}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 3),
  );
}

export async function getPublishedRelatedPosts(currentSlug: string, limit = 3) {
  const posts = await getPublishedBlogPosts();
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

export const getRelatedBlogPosts = getPublishedRelatedPosts;

export function absoluteUrl(value?: string) {
  if (!value) return undefined;
  return value.startsWith("http") ? value : `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}
