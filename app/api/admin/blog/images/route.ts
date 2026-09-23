import { NextResponse } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import {
  uploadCmsInlineImage,
  addCmsInlineImage,
  acceptCmsInlineImage,
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
    if(request.headers.get("content-type")?.includes("multipart/form-data")) {
      if(Number(request.headers.get("content-length"))>11*1024*1024)throw new Error("Upload must be under 10 MB.");
      const form=await request.formData(),file=form.get("file");
      if(!(file instanceof File))throw new Error("Choose an image file.");
      return NextResponse.json(await uploadCmsInlineImage(admin,String(form.get("slug")||""),file,String(form.get("placement")||""),String(form.get("role")) as "human"|"supporting_visual",String(form.get("concept")||""),String(form.get("alt")||"")));
    }
    const { slug, action, id, placement, direction = "", role } = await request.json();
    if(role && !["human","supporting_visual"].includes(role))throw new Error("Invalid image role.");
    if(typeof direction!=="string"||direction.length>4000)throw new Error("Image direction must be under 4000 characters.");
    const safeSlug = String(slug || "");
    if (action === "remove-featured") return NextResponse.json(await removeCmsFeaturedImage(admin, safeSlug));
    if (action === "regenerate-featured") return NextResponse.json(await regenerateCmsFeaturedImage(admin, safeSlug, direction, role));
    if (action === "plan-inline") return NextResponse.json(await planCmsInlineImages(admin, safeSlug, direction));
    if (action === "regenerate-inline") return NextResponse.json(await regenerateCmsInlineImage(admin, safeSlug, String(id || ""), direction, role));
    if (action === "remove-inline") return NextResponse.json(await removeCmsInlineImage(admin, safeSlug, String(id || "")));
    if (action === "accept-inline") return NextResponse.json(await acceptCmsInlineImage(admin, safeSlug, String(id || "")));
    if (action === "add-inline") return NextResponse.json(await addCmsInlineImage(admin, safeSlug, String(placement || ""), direction));
    return NextResponse.json({ error: "Unknown image action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
