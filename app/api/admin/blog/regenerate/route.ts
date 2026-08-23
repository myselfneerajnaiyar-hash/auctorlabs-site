import { after,NextResponse } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { discardCmsDraft } from "@/lib/blog-cms-actions";
import { createBlogJob,runBlogJob } from "@/lib/blog-jobs";
export const runtime="nodejs";export const maxDuration=800;
export async function POST(request:Request){const admin=await getBlogAdmin();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});try{const{slug,topic,audience}=await request.json();await discardCmsDraft(admin,String(slug));const job=await createBlogJob(admin,String(topic),String(audience||"General / Multi-exam"),true);after(()=>runBlogJob(admin,job));return NextResponse.json({jobId:job.id},{status:202});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:400});}}
