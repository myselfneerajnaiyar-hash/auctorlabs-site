import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getBlogAdmin } from "../../../../../lib/blog-admin-auth";
import { deleteCmsArticle, getCmsArticle, renameCmsArticle, transitionCmsArticle } from "../../../../../lib/blog-cms-db";
import { lifecycleTarget } from "../../../../../lib/blog-lifecycle.mjs";

export async function POST(request: Request) {
  const admin = await getBlogAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug, action, newSlug, expectedUpdatedAt, confirm } = await request.json();
    const row = await getCmsArticle(String(slug || ""));
    if (!row) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    let result: unknown;
    const target=lifecycleTarget(row.status,String(action));
    if(target)result=await transitionCmsArticle(admin,row.slug,target as "draft"|"published"|"unpublished"|"archived",expectedUpdatedAt||row.updated_at);
    else if (action === "rename" && newSlug) result = await renameCmsArticle(admin, row.slug, String(newSlug));
    else if (action === "delete" && row.status === "archived" && confirm === row.slug) result = await deleteCmsArticle(admin, row.slug);
    else throw new Error("Invalid lifecycle transition. Published articles must be unpublished before archiving; permanent deletion requires an archived article and exact slug confirmation.");
    revalidatePath("/blog"); revalidatePath("/blog/sitemap.xml"); revalidatePath(`/blog/${row.slug}`); revalidatePath("/admin/blog");
    if (action === "rename") revalidatePath(`/blog/${String(newSlug)}`);
    return NextResponse.json({ ok: true, action, article: result });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
