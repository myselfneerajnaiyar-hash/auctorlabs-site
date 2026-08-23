import { NextResponse } from "next/server";
import { isBlogAdmin } from "@/lib/blog-admin-auth";
import { getStudioData } from "@/lib/blog-engine";
import { isCmsConfigured, listCmsArticles } from "@/lib/blog-cms-db";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isBlogAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const refresh = new URL(request.url).searchParams.get("refresh") === "1";
  const result = await getStudioData({ refresh });

  if (isCmsConfigured()) {
    type StudioPost = (typeof result.posts)[number];
    const rows = await listCmsArticles();
    const posts: StudioPost[] = rows.map((row) => ({
      slug: row.slug,
      url: `/blog/${row.slug}`,
      title: row.title,
      description: row.description,
      primaryKeyword: String(row.frontmatter?.primaryKeyword || ""),
      secondaryKeywords: Array.isArray(row.frontmatter?.secondaryKeywords) ? row.frontmatter.secondaryKeywords : [],
      searchIntent: String(row.frontmatter?.searchIntent || ""),
      cluster: String(row.frontmatter?.cluster || row.frontmatter?.category || ""),
      category: String(row.frontmatter?.category || "Reading Comprehension"),
      status: row.status,
      date: String(row.frontmatter?.date || row.created_at.slice(0, 10)),
      updatedDate: row.updated_at.slice(0, 10),
      image: String(row.frontmatter?.image || ""),
      imageAlt: String(row.frontmatter?.imageAlt || ""),
      author: String(row.frontmatter?.author || "Auctor Labs Editorial Team"),
      relevantExams: Array.isArray(row.frontmatter?.relevantExams) ? row.frontmatter.relevantExams : [],
      targetPage: String(row.frontmatter?.targetPage || ""),
      relatedArticles: Array.isArray(row.frontmatter?.relatedArticles) ? row.frontmatter.relatedArticles : [],
      externalReferences: Array.isArray(row.frontmatter?.externalReferences) ? row.frontmatter.externalReferences : [],
      backlinkOpportunities: Array.isArray(row.frontmatter?.backlinkOpportunities) ? row.frontmatter.backlinkOpportunities : [],
      schemaType: String(row.frontmatter?.schemaType || "BlogPosting"),
      seoScore: typeof row.frontmatter?.seoScore === "number" ? row.frontmatter.seoScore : null,
      contentQualityScore: typeof row.frontmatter?.contentQualityScore === "number" ? row.frontmatter.contentQualityScore : null,
      wordCount: row.content.trim() ? row.content.trim().split(/\s+/).length : 0,
      headings: (row.content.match(/^#{1,6}\s+/gm) || []).length,
      internalLinks: [],
    }));
    const slugs = new Set(posts.map((post) => post.slug));
    result.posts = [...posts, ...result.posts.filter((post) => !slugs.has(post.slug))];
  }

  return NextResponse.json(result);
}
