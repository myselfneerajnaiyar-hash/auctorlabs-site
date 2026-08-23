import { NextResponse } from "next/server";
import { after } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { createBlogJob,runBlogJob } from "@/lib/blog-jobs";
const audiences=["General / Multi-exam","CAT","XAT","GMAT","GRE","CUET","CLAT","IPMAT","NMAT","SNAP","SSC","Banking","Other"];
export const runtime="nodejs";
export const maxDuration=800;
export async function POST(request:Request){const admin=await getBlogAdmin();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});const body=await request.json();const topic=String(body.topic||"").trim(),audience=String(body.audience||"");if(topic.length<5)return NextResponse.json({error:"Enter a valid topic."},{status:400});if(!audiences.includes(audience))return NextResponse.json({error:"Select a valid audience."},{status:400});const job=await createBlogJob(admin,topic,audience,Boolean(body.differentAngle));after(()=>runBlogJob(admin,job));return NextResponse.json({jobId:job.id},{status:202});}
