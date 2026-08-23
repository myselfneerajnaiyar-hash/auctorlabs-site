import { notFound, redirect } from "next/navigation";
import BlogArticleView from "@/app/components/BlogArticleView";
import { isBlogAdmin } from "@/lib/blog-admin-auth";
import { getCmsDraft } from "@/lib/blog-cms-actions";
import { createBlogPost, getBlogPostHybrid, type BlogFrontmatter } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function Preview({ params }: { params: Promise<{ slug: string }> }) {
  if (!await isBlogAdmin()) redirect("/admin/blog/login");
  const { slug } = await params, draft = await getCmsDraft(slug);
  const post = draft
    ? createBlogPost(slug, draft.data as BlogFrontmatter & Record<string, unknown>, draft.content)
    : await getBlogPostHybrid(slug);
  if (!post) notFound();
  return <BlogArticleView post={post} />;
}
