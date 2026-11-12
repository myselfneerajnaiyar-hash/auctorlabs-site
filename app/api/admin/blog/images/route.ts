import { NextResponse } from "next/server";
import { send } from "@vercel/queue";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { getCmsDraft } from "@/lib/blog-cms-actions";
import {
  uploadCmsInlineImage,
  addCmsInlineImage,
  acceptCmsInlineImage,
  planCmsInlineImages,
  regenerateCmsInlineImage,
  removeCmsFeaturedImage,
  removeCmsInlineImage,
  uploadManualCmsImage,
  startCmsFeaturedImageGeneration,
} from "@/lib/blog-cms-images";
import { getCmsFeaturedImageJob, updateCmsJob } from "@/lib/blog-cms-db";

export const runtime = "nodejs";
export const maxDuration = 800;

export async function POST(request: Request) {
  const admin = await getBlogAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    if(request.headers.get("content-type")?.includes("multipart/form-data")) {
      if(Number(request.headers.get("content-length"))>11*1024*1024)throw new Error("Upload must be under 10 MB.");
      const form=await request.formData(),file=form.get("file");
      if(!(file instanceof File))throw new Error("Choose an image file.");
      if(form.get("imageType")==="featured"||form.get("imageType")==="inline"){
        let data:Record<string,unknown>|undefined;
        try{const parsed=JSON.parse(String(form.get("data")||"{}"));if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))throw new Error();data=parsed;}catch{throw new Error("Article fields could not be read. Keep your edits open and retry the upload.");}
        const expectedUpdatedAt=String(form.get("expectedUpdatedAt")||"");
        if(expectedUpdatedAt&&!/^\d{4}-\d\d-\d\dT/.test(expectedUpdatedAt))throw new Error("Invalid article version.");
        const rawInsertAt=form.get("insertAt"),insertAt=rawInsertAt===null?undefined:Number(rawInsertAt);
        if(insertAt!==undefined&&(!Number.isInteger(insertAt)||insertAt<0||insertAt>String(form.get("content")||"").length))throw new Error("Choose a valid image position in the article.");
        const rawContent=form.get("content"),rawPlacement=String(form.get("placement")||"");
        return NextResponse.json(await uploadManualCmsImage(admin,String(form.get("slug")||""),file,String(form.get("imageType")) as "featured"|"inline",String(form.get("alt")||""),{content:rawContent===null?undefined:String(rawContent),data,expectedUpdatedAt,insertAt,placement:rawPlacement||undefined}));
      }
      return NextResponse.json(await uploadCmsInlineImage(admin,String(form.get("slug")||""),file,String(form.get("placement")||""),String(form.get("role")) as "human"|"supporting_visual",String(form.get("concept")||""),String(form.get("alt")||"")));
    }
    const { slug, action, id, placement, direction = "", role } = await request.json();
    if(role && !["human","supporting_visual"].includes(role))throw new Error("Invalid image role.");
    if(typeof direction!=="string"||direction.length>4000)throw new Error("Image direction must be under 4000 characters.");
    const safeSlug = String(slug || "");
    if(action==="regenerate-featured"){
      const job=await startCmsFeaturedImageGeneration(admin,safeSlug,String(direction),role);
      const persisted=await getCmsFeaturedImageJob(job.jobId);
      if(!persisted)throw new Error("The image job could not be found after saving. Retry generation.");
      try{await send("blog-featured-image",{jobId:job.jobId},{idempotencyKey:String(persisted.idempotency_key),retentionSeconds:604800});await updateCmsJob(job.jobId,{queue_dispatch_at:new Date().toISOString()});}
      catch(error){console.error("Featured image queue publish failed",{jobId:job.jobId,error:error instanceof Error?error.message:String(error)});return NextResponse.json({error:"The image job was saved, but the background worker could not be reached. Retry Generate featured image; your blog content is safe."},{status:503});}
      return NextResponse.json({...job,draft:await getCmsDraft(safeSlug)},{status:202});
    }
    if(action==="featured-status"){
      const {getCmsFeaturedImageGeneration}=await import("@/lib/blog-cms-images");
      const current=await getCmsFeaturedImageJob(String(id||""));
      const recoverable=current?.status==="pending"||current?.status==="failed"&&["transient","timeout"].includes(String(current.failure_kind))&&Number(current.attempt_count)<Number(current.max_attempts);
      if(recoverable&&(!current.queue_dispatch_at||Date.now()-Date.parse(String(current.queue_dispatch_at))>60_000)){
        try{await send("blog-featured-image",{jobId:String(id)},{idempotencyKey:String(current.idempotency_key),retentionSeconds:604800});await updateCmsJob(String(id),{queue_dispatch_at:new Date().toISOString()});}catch(error){console.error("Featured image queue recovery publish failed",{jobId:id,error:error instanceof Error?error.message:String(error)});}
      }
      return NextResponse.json(await getCmsFeaturedImageGeneration(admin,safeSlug,String(id||"")));
    }
    if (action === "remove-featured") return NextResponse.json(await removeCmsFeaturedImage(admin, safeSlug));
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
