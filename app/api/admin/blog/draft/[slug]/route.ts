import { NextResponse } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { discardCmsDraft,getCmsDraft,saveCmsDraft } from "@/lib/blog-cms-actions";
import {getSeoCorpus} from "@/lib/seo/corpus";
import {recommendInternalLinks} from "@/lib/seo/intelligence.mjs";
async function withLinkRecommendations(draft:NonNullable<Awaited<ReturnType<typeof getCmsDraft>>>){const corpus=await getSeoCorpus().catch(()=>[]);return{...draft,internalLinkRecommendations:recommendInternalLinks(String(draft.data.primaryKeyword||draft.data.title||""),corpus,draft.slug)};}
export async function GET(_:Request,{params}:{params:Promise<{slug:string}>}){const admin=await getBlogAdmin();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});const{slug}=await params,draft=await getCmsDraft(slug);return draft?NextResponse.json(await withLinkRecommendations(draft)):NextResponse.json({error:"Draft not found."},{status:404});}
export async function PUT(request:Request,{params}:{params:Promise<{slug:string}>}){const admin=await getBlogAdmin();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});try{const{slug}=await params;return NextResponse.json(await withLinkRecommendations(await saveCmsDraft(admin,slug,await request.json())));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:400});}}
export async function DELETE(_:Request,{params}:{params:Promise<{slug:string}>}){const admin=await getBlogAdmin();if(!admin)return NextResponse.json({error:"Unauthorized"},{status:401});try{const{slug}=await params;return NextResponse.json(await discardCmsDraft(admin,slug));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:String(error)},{status:400});}}
