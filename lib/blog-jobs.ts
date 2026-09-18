import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any -- generated MDX frontmatter is runtime-shaped JSON. */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogAdmin } from "./blog-admin-auth";
import { generateBlog,researchTopic } from "./blog-engine";
import { claimCmsJob,createCmsJob,getCmsJob,heartbeatCmsJob,updateBlogAssetMetadata,updateCmsJob,uploadBlogAsset,upsertCmsArticle } from "./blog-cms-db";
import { canRetryGenerationJob, classifyGenerationFailure } from "./blog-job-policy.mjs";
import {getSeoCorpus} from "./seo/corpus";
import {attachResearchEvidence} from "./seo/research-link.mjs";

export const stages=["researching","brief","writing","reviewing","improving","featuredImage","imagePlanning","inlineImages","finalizing"] as const;
type Stage=(typeof stages)[number]; type State="pending"|"processing"|"complete"|"failed";
export async function createBlogJob(admin:BlogAdmin,topic:string,audience:string,differentAngle=false,manualResearch=false){let job=await createCmsJob(admin,differentAngle?`${topic} — use a substantially different angle, structure, hook and original examples`:topic,audience);if(manualResearch)job=await updateCmsJob(job.id,{research_context:{manualResearch:true}});return{...job,differentAngle,manualResearch};}
export async function runBlogJob(admin:BlogAdmin,job:{id:string;topic:string;audience:string;manualResearch?:boolean;research_context?:{manualResearch?:boolean}}){
 const claimed=await claimCmsJob(job.id);if(!claimed)return;
 try{
  const manualResearch=Boolean(job.manualResearch||job.research_context?.manualResearch),corpus=await getSeoCorpus(),research=await researchTopic(job.topic,{corpus,adminId:admin.id});
  try{await heartbeatCmsJob(job.id,{research_snapshot_ids:research.snapshotIds,research_context:{...research,manualResearch}});}catch(error){console.warn("SEO evidence job columns are unavailable until the Phase 3A migration is applied.",error);}
  const result=await generateBlog({topic:job.topic,audience:job.audience,withImage:true,manualResearch,researchContext:research.briefContext,onProgress:async(stage:Stage,state:State,detail:Record<string,number>={})=>{const current=await getCmsJob(job.id),nextStages={...(current?.stages||{}),[stage]:state};await heartbeatCmsJob(job.id,{stages:nextStages,progress:{stage,...detail}});}}) as {slug:string;filePath:string;briefPath?:string};
  const parsed=matter(fs.readFileSync(result.filePath,"utf8")),briefFile=result.briefPath&&fs.existsSync(result.briefPath)?JSON.parse(fs.readFileSync(result.briefPath,"utf8")):undefined,linked=attachResearchEvidence(parsed.data,briefFile?.brief||briefFile||{},research),brief=briefFile?.brief?{...briefFile,brief:linked.brief}:linked.brief;parsed.data=linked.frontmatter;
  let row=await upsertCmsArticle(admin,{slug:result.slug,status:"draft",title:String(parsed.data.title),description:String(parsed.data.description||""),content:parsed.content,frontmatter:parsed.data,brief});
  const runtimeRoot=path.resolve(path.dirname(result.filePath),"../.."),assets=[{key:"featured",type:"featured" as const,src:String(parsed.data.image||""),prompt:String(parsed.data.imagePrompt||""),alt:String(parsed.data.imageAlt||""),status:parsed.data.featuredImageError?"failed":"generated",error:String(parsed.data.featuredImageError||"")},...(Array.isArray(parsed.data.inlineImages)?parsed.data.inlineImages:[]).map((item:any)=>({key:String(item.id),type:"inline" as const,src:String(item.src||""),prompt:String(item.prompt||""),alt:String(item.alt||""),placement:String(item.placement||""),status:String(item.status||"failed"),error:String(item.error||"")}))];
  let content=parsed.content;const frontmatter={...parsed.data};
  for(const asset of assets){if(asset.status!=="generated"||!asset.src.startsWith("/blog/")){if(["failed","placement-unresolved"].includes(asset.status))await updateBlogAssetMetadata(row.id,asset.key,{assetType:asset.type,prompt:asset.prompt,altText:asset.alt,placement:"placement" in asset?asset.placement:undefined,status:"failed",generationError:asset.error||"Image generation failed quality review."});continue;}const local=path.join(runtimeRoot,"public",asset.src.slice(1));if(!fs.existsSync(local)){await updateBlogAssetMetadata(row.id,asset.key,{assetType:asset.type,prompt:asset.prompt,altText:asset.alt,placement:"placement" in asset?asset.placement:undefined,status:"failed",generationError:"Generated image file was not found."});continue;}const url=await uploadBlogAsset(row.id,asset.key,fs.readFileSync(local),{assetType:asset.type,prompt:asset.prompt,altText:asset.alt,placement:"placement" in asset?asset.placement:undefined});content=content.split(asset.src).join(url);if(asset.type==="featured")frontmatter.image=url;else if(Array.isArray(frontmatter.inlineImages))frontmatter.inlineImages=frontmatter.inlineImages.map((item:any)=>item.id===asset.key?{...item,src:url}:item);}
  row=await upsertCmsArticle(admin,{slug:result.slug,status:"draft",title:String(frontmatter.title),description:String(frontmatter.description||""),content,frontmatter,brief});
  await updateCmsJob(job.id,{status:"complete",result:{...result,filePath:null,persistentArticleId:row.id},completed_at:new Date().toISOString(),lease_expires_at:null});
 }catch(error){await updateCmsJob(job.id,{status:"failed",failure_kind:classifyGenerationFailure(error),error:error instanceof Error?error.message:String(error),completed_at:new Date().toISOString(),lease_expires_at:null});}
}
export async function retryBlogJob(admin:BlogAdmin,id:string){const job=await getCmsJob(id);if(!canRetryGenerationJob(job))throw new Error("This job is not retryable or has reached its retry limit.");await runBlogJob(admin,{id:job.id,topic:job.topic,audience:job.audience,research_context:job.research_context});return getCmsJob(id);}
export async function getBlogJob(id:string){return getCmsJob(id);}
