import { after, NextResponse } from "next/server";
import { getBlogAdmin } from "../../../../../lib/blog-admin-auth";
import { retryBlogJob } from "../../../../../lib/blog-jobs";
export async function POST(request:Request){const admin=await getBlogAdmin();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});try{const{id}=await request.json();after(()=>retryBlogJob(admin,String(id||"")));return NextResponse.json({retrying:true,jobId:id});}catch(error){return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:400});}}
