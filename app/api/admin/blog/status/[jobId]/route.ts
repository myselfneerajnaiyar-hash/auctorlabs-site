import { NextResponse } from "next/server";
import { isBlogAdmin } from "@/lib/blog-admin-auth";
import { getBlogJob } from "@/lib/blog-jobs";
export const runtime="nodejs";
export async function GET(_:Request,{params}:{params:Promise<{jobId:string}>}){if(!await isBlogAdmin())return NextResponse.json({error:"Unauthorized"},{status:401});const {jobId}=await params,job=await getBlogJob(jobId);return job?NextResponse.json(job):NextResponse.json({error:"Job not found."},{status:404});}
