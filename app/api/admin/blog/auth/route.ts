import { NextResponse } from "next/server";
import { clearAdminSession,setAdminSession,signInBlogAdmin } from "@/lib/blog-admin-auth";
export async function POST(request:Request){try{const body=await request.json(),result=await signInBlogAdmin(String(body.email||"").trim().toLowerCase(),String(body.password||"")),response=NextResponse.json({authenticated:true,admin:result.admin});setAdminSession(response,result.accessToken,result.expiresIn);return response;}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Authentication failed."},{status:401});}}
export async function DELETE(){const response=NextResponse.json({authenticated:false});clearAdminSession(response);return response;}
