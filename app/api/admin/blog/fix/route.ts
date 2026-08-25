import { NextResponse } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { getCmsDraft, repairCmsDraft } from "@/lib/blog-cms-actions";
import { planCmsInlineImages, regenerateCmsFeaturedImage } from "@/lib/blog-cms-images";

export const runtime = "nodejs";
export const maxDuration = 800;

export async function POST(request: Request) {
  const admin = await getBlogAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug } = await request.json();
    const safeSlug = String(slug || "");
    let draft = await repairCmsDraft(admin, safeSlug);
    if (!draft.data.image) {
      try { draft = await regenerateCmsFeaturedImage(admin, safeSlug); } catch { /* Exact image failure is persisted and shown below. */ }
    }
    const activeInline = Array.isArray(draft.data.inlineImages) ? draft.data.inlineImages.filter((image: { status?: string }) => image.status !== "removed") : [];
    const wordCount = String(draft.content || "").trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 900 && activeInline.length === 0) draft = await planCmsInlineImages(admin, safeSlug);
    return NextResponse.json(await getCmsDraft(safeSlug));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
