import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { publishCmsDraft } from "@/lib/blog-cms-actions";
export async function POST(request:Request){const admin=await getBlogAdmin();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});try{const{slug}=await request.json(),result=await publishCmsDraft(admin,String(slug||""));revalidatePath("/blog");revalidatePath(`/blog/${result.publishedSlug}`);revalidatePath("/admin/blog");return NextResponse.json(result);}catch(error){return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:400});}}
