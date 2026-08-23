import { NextResponse } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import {
  addCmsInlineImage,
  planCmsInlineImages,
  regenerateCmsFeaturedImage,
  regenerateCmsInlineImage,
  removeCmsFeaturedImage,
  removeCmsInlineImage,
} from "@/lib/blog-cms-images";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const admin = await getBlogAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { slug, action, id, placement } = await request.json();
    const safeSlug = String(slug || "");
    if (action === "remove-featured") return NextResponse.json(await removeCmsFeaturedImage(admin, safeSlug));
    if (action === "regenerate-featured") return NextResponse.json(await regenerateCmsFeaturedImage(admin, safeSlug));
    if (action === "plan-inline") return NextResponse.json(await planCmsInlineImages(admin, safeSlug));
    if (action === "regenerate-inline") return NextResponse.json(await regenerateCmsInlineImage(admin, safeSlug, String(id || "")));
    if (action === "remove-inline") return NextResponse.json(await removeCmsInlineImage(admin, safeSlug, String(id || "")));
    if (action === "add-inline") return NextResponse.json(await addCmsInlineImage(admin, safeSlug, String(placement || "")));
    return NextResponse.json({ error: "Unknown image action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
