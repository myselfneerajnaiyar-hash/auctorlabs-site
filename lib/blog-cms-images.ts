import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import type { BlogAdmin } from "./blog-admin-auth";
import { claimCmsJob, createCmsFeaturedImageJob, getCmsArticle, getCmsFeaturedImageJob, getCmsJob, heartbeatCmsJob, listCmsAssets, updateCmsJob, uploadBlogAsset } from "./blog-cms-db";
import { saveCmsDraft } from "./blog-cms-actions";
import { generateImageBytes, validateGeneratedImage, insertInlineImageAtSection, planInlineImages, removeInlineImageFromMdx } from "./blog-engine";
import { directedImage, sameConcept } from "./blog-image-concepts.mjs";
import { insertManualImageAt } from "./blog-manual-format.mjs";
import { classifyGenerationFailure } from "./blog-job-policy.mjs";

type Role = "human" | "supporting_visual";
type InlineImage = { id:string; type:string; role?:Role; placement:string; purpose:string; prompt:string; alt:string; src?:string; status:string; error?:string; visualConceptId?:string; conceptDescription?:string; source?:string; replaces?:string; target?:"featured"; sectionHeading?:string; jobId?:string };
const inlineImages = (data:Record<string,unknown>):InlineImage[] => Array.isArray(data.inlineImages) ? structuredClone(data.inlineImages) : [];
const imageSummary = (images:InlineImage[]) => ({planned:images.filter(i=>i.status!=="removed").length,generated:images.filter(i=>i.status==="generated").length,failed:images.filter(i=>i.status==="failed").length});
async function draft(slug:string) { const row=await getCmsArticle(slug,"draft"); if(!row)throw new Error(`Draft not found: ${slug}`); return row; }
function sections(content:string) { return [...content.matchAll(/^#{2,3}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm)].map(match=>({heading:match[1].trim(),id:match[1].trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")})); }
function assertPlacement(content:string,placement:string) { if(!sections(content).some(section=>section.id===placement))throw new Error("The requested image section no longer exists."); }
function activeConcepts(row:Awaited<ReturnType<typeof draft>>) {
  return [...inlineImages(row.frontmatter).filter(i=>i.target!=="featured"&&!["removed","failed"].includes(i.status)),...(row.frontmatter.image?[{id:"featured",role:row.frontmatter.featuredImageRole||"human",prompt:row.frontmatter.imagePrompt,visualConceptId:row.frontmatter.featuredVisualConceptId,conceptDescription:row.frontmatter.featuredConceptDescription}]:[])];
}
async function saveImages(admin:BlogAdmin,slug:string,row:Awaited<ReturnType<typeof draft>>,images:InlineImage[],content=row.content,data:Record<string,unknown>={}) {
  return saveCmsDraft(admin,slug,{content,data:{inlineImages:images,inlineImageSummary:imageSummary(images),...data},expectedUpdatedAt:row.updated_at});
}
async function generateInline(admin:BlogAdmin,slug:string,candidate:InlineImage) {
  const row=await draft(slug);
  const image={...candidate,alt:candidate.alt.replace(/[\[\]\r\n]/g," ").slice(0,500),id:candidate.jobId?`featured-${candidate.jobId}`:`image-${randomUUID()}`,source:"ai",src:"",status:"proposed",error:""};
  try {
    const others=activeConcepts(row).filter(i=>i.id!==candidate.replaces);
    if(others.some(other=>sameConcept(image,other)))throw new Error("This visual concept is already in the article. Describe a different action or story.");
    const bytes=await generateImageBytes(`${image.prompt}\nRequired role: ${image.role==="human"?"human-centered, with a visible relevant person":"supporting visual"}. Approved concept: ${image.conceptDescription||image.purpose}. Article: ${row.title}. Other visual concepts to distinguish this scene from: ${JSON.stringify(others.map(i=>i.conceptDescription||i.prompt))}. Vary the action, framing, emotional state, positioning and story; do not create a stock-pose variant.`,undefined,image.jobId?`featured-image-${image.jobId}`:undefined);
    image.src=await uploadBlogAsset(row.id,image.id,bytes,{assetType:image.target==="featured"?"featured":"inline",prompt:image.prompt,altText:image.alt,placement:image.placement});
  } catch(error) { image.status="failed"; image.error=error instanceof Error?error.message:String(error); }
  // Re-read after the slow model call, preserving edits made while it ran.
  const current=await draft(slug);
  const images=inlineImages(current.frontmatter),previous=images.findIndex(item=>item.jobId&&item.jobId===image.jobId);
  if(previous>=0)images.splice(previous,1);
  return saveImages(admin,slug,current,[...images,image]);
}
export async function removeCmsFeaturedImage(admin:BlogAdmin,slug:string) {
  const row=await draft(slug);
  return saveImages(admin,slug,row,inlineImages(row.frontmatter).map(i=>i.target==="featured"&&i.status==="generated"?{...i,status:"removed"}:i),row.content,{image:""});
}
export async function regenerateCmsFeaturedImage(admin:BlogAdmin,slug:string,direction="",role?:Role,jobId?:string) {
  const row=await draft(slug);
  direction=direction.trim()||`Create a polished editorial cover image for “${row.title}”. Show a clear visual idea related to the article topic, with no text, logos, or watermarks.`;
  const candidate:InlineImage={id:"featured",type:"editorial",target:"featured",replaces:"featured",role:(row.frontmatter.featuredImageRole as Role)||"human",placement:"featured",purpose:direction,prompt:"",alt:direction,status:"planned",jobId};
  return generateInline(admin,slug,directedImage(candidate,direction,role));
}
export async function startCmsFeaturedImageGeneration(admin:BlogAdmin,slug:string,direction:string,role?:Role) {
  const row=await draft(slug);direction=direction.trim()||`Create a polished editorial cover image for “${row.title}”. Show a clear visual idea related to the article topic, with no text, logos, or watermarks.`;
  const job=await createCmsFeaturedImageJob(admin,row.id,slug,direction,role),payload=job.payload||{},jobDirection=String(payload.direction||direction),jobRole=(payload.role||role||"human") as Role;
  const state={id:job.id,status:job.status==="processing"?"generating":"pending",direction:jobDirection,startedAt:job.started_at||job.created_at};
  const priorState=row.frontmatter.featuredImageGeneration as {id?:string;status?:string}|undefined;
  if(priorState?.id!==job.id||priorState?.status==="failed")await saveCmsDraft(admin,slug,{data:{featuredImageGeneration:state},expectedUpdatedAt:row.updated_at});
  return{jobId:job.id,status:state.status,direction:jobDirection,role:jobRole};
}
export async function runCmsFeaturedImageGeneration(admin:BlogAdmin,slug:string,jobId:string,direction:string,role?:Role) {
  const before=await draft(slug),previous=inlineImages(before.frontmatter).find(image=>image.jobId===jobId),assets=await listCmsAssets(before.id);
  if(!(previous?.status==="proposed"&&previous.src&&assets.some(asset=>asset.image_key===previous.id&&asset.status==="generated"&&asset.public_url===previous.src)))try{await regenerateCmsFeaturedImage(admin,slug,direction,role,jobId);}
  catch(error){const message=error instanceof Error?error.message:String(error);console.error("Featured image generation failed",{slug,jobId,error:message});const row=await draft(slug);await saveCmsDraft(admin,slug,{data:{featuredImageGeneration:{id:jobId,status:"failed",direction,error:message,finishedAt:new Date().toISOString()}},expectedUpdatedAt:row.updated_at});throw error;}
  const row=await draft(slug),candidate=inlineImages(row.frontmatter).find(image=>image.jobId===jobId),failed=!candidate||candidate.status==="failed";
  const persistedAssets=await listCmsAssets(row.id),persisted=!failed&&persistedAssets.some(asset=>asset.image_key===candidate?.id&&asset.status==="generated"&&asset.public_url===candidate?.src);
  if(failed||!persisted){const message=candidate?.error||"The generated image was not persisted to Supabase Storage. Retry the featured image; your article content remains saved.";console.error("Featured image generation failed",{slug,jobId,error:message});await saveCmsDraft(admin,slug,{data:{featuredImageGeneration:{id:jobId,status:"failed",direction,error:message,finishedAt:new Date().toISOString()}},expectedUpdatedAt:row.updated_at});throw new Error(message);}
  await saveCmsDraft(admin,slug,{data:{featuredImageGeneration:{id:jobId,status:"review_ready",direction,error:"",imageId:candidate.id,imageUrl:candidate.src,finishedAt:new Date().toISOString()}},expectedUpdatedAt:row.updated_at});
}
export async function getCmsFeaturedImageGeneration(admin:BlogAdmin,slug:string,jobId:string) {
  const row=await draft(slug),job=await getCmsFeaturedImageJob(jobId);
  if(!job||job.article_id!==row.id)throw new Error("Image generation job not found.");
  const current=job.status==="processing"?await getCmsJob(jobId):job,age=Date.now()-Date.parse(String(current?.created_at||Date.now()));
  if(current?.status==="pending"&&age>15*60_000)await updateCmsJob(jobId,{status:"failed",failure_kind:"permanent",error:"The queued image job did not start. Retry featured image generation; your article remains saved.",completed_at:new Date().toISOString()});
  let latest=await getCmsFeaturedImageJob(jobId);
  if(latest&&age>7*24*60*60_000&&latest.status!=="complete"&&!(latest.status==="failed"&&latest.failure_kind==="permanent")){const changes={status:"failed" as const,failure_kind:"permanent",error:"The background queue message expired before the image job completed. Retry featured image generation; your article remains saved.",completed_at:new Date().toISOString()};await updateCmsJob(jobId,changes);latest={...latest,...changes};}
  if(!latest)throw new Error("Image generation job not found.");
  if(latest.status==="failed"&&["transient","timeout"].includes(String(latest.failure_kind))&&Number(latest.attempt_count)>=Number(latest.max_attempts)){const changes={failure_kind:"permanent",error:latest.error||"The image job exhausted its automatic retry attempts. Retry featured image generation; your article remains saved.",completed_at:latest.completed_at||new Date().toISOString()};await updateCmsJob(jobId,changes);latest={...latest,...changes};}
  const activeRetry=latest.status==="failed"&&["transient","timeout"].includes(String(latest.failure_kind))&&Number(latest.attempt_count)<Number(latest.max_attempts),generationStatus=latest.status==="complete"?"review_ready":latest.status==="processing"||latest.status==="pending"||activeRetry?latest.status==="pending"?"pending":"generating":"failed";
  const savedState=row.frontmatter.featuredImageGeneration as Record<string,unknown>|undefined;
  if(latest&&savedState?.id===jobId&&(savedState.status!==generationStatus||savedState.error!==(activeRetry?"":latest.error||""))){await saveCmsDraft(admin,slug,{data:{featuredImageGeneration:{...savedState,status:generationStatus,error:activeRetry?"":latest.error||""}},expectedUpdatedAt:row.updated_at});}
  const {getCmsDraft}=await import("./blog-cms-actions");return getCmsDraft(slug);
}

export async function processCmsFeaturedImageJob(jobId:string){
  const job=await getCmsFeaturedImageJob(jobId);if(!job)return;
  if(job.status==="complete"||job.status==="failed"&&job.failure_kind==="permanent")return;
  const claimed=await claimCmsJob(jobId,300);
  if(!claimed){const latest=await getCmsFeaturedImageJob(jobId);if(!latest)throw new Error("Featured image job disappeared before it could be claimed.");if(latest.status==="complete"||latest.status==="failed"&&latest.failure_kind==="permanent")return;
    const attempts=Number(latest.attempt_count),maxAttempts=Number(latest.max_attempts),leaseExpiry=Date.parse(String(latest.lease_expires_at||"")),stale=!Number.isFinite(leaseExpiry)||leaseExpiry<=Date.now();
    if(attempts>=maxAttempts&&stale){const message="The background image worker stopped before completing after its automatic retry limit. Retry featured image generation; your article remains saved.";await updateCmsJob(jobId,{status:"failed",failure_kind:"permanent",error:message,completed_at:new Date().toISOString(),lease_expires_at:null});const payload=latest?.payload||{},slug=String(payload.slug||"");if(slug){const row=await draft(slug),state=row.frontmatter.featuredImageGeneration as Record<string,unknown>|undefined;if(state?.id===jobId)await saveCmsDraft({id:String(latest.requested_by),userId:"",email:"worker@vercel.invalid",name:"Blog image worker",role:"editor"},slug,{data:{featuredImageGeneration:{...state,status:"failed",error:message,finishedAt:new Date().toISOString()}},expectedUpdatedAt:row.updated_at});}return;}
    throw new Error("Featured image job is already running or waiting for its lease to expire.");}
  const payload=job.payload||{},slug=String(payload.slug||""),direction=String(payload.direction||job.topic||""),role=(payload.role||"human") as Role;
  if(!slug||!direction){await updateCmsJob(jobId,{status:"failed",failure_kind:"permanent",error:"Featured image job is missing its saved article instructions.",completed_at:new Date().toISOString()});return;}
  const admin:BlogAdmin={id:String(job.requested_by),userId:"",email:"worker@vercel.invalid",name:"Blog image worker",role:"editor"};
  let heartbeatError:unknown;const heartbeat=setInterval(()=>{void heartbeatCmsJob(jobId,{},300).catch(error=>{heartbeatError=error;console.error("Featured image job heartbeat failed",{jobId,error:String(error)});});},60_000);heartbeat.unref?.();
  try{
    const row=await draft(slug),state=row.frontmatter.featuredImageGeneration as Record<string,unknown>|undefined;
    if(state?.id===jobId&&state.status!=="generating")await saveCmsDraft(admin,slug,{data:{featuredImageGeneration:{...state,status:"generating",error:""}},expectedUpdatedAt:row.updated_at});
    await runCmsFeaturedImageGeneration(admin,slug,jobId,direction,role);
    if(heartbeatError)throw heartbeatError;
    await updateCmsJob(jobId,{status:"complete",stages:{featuredImage:"complete"},completed_at:new Date().toISOString(),lease_expires_at:null,heartbeat_at:new Date().toISOString(),error:null,failure_kind:null});
  }catch(error){
    const message=error instanceof Error?error.message:String(error),failureKind=classifyGenerationFailure(error),attempts=Number(claimed.attempt_count||1),maxAttempts=Number(claimed.max_attempts||3),terminal=failureKind==="permanent"||attempts>=maxAttempts;
    await updateCmsJob(jobId,{status:"failed",stages:{featuredImage:"failed"},failure_kind:terminal?"permanent":failureKind,error:message,completed_at:terminal?new Date().toISOString():null,lease_expires_at:null,heartbeat_at:new Date().toISOString()});
    const row=await draft(slug),state=row.frontmatter.featuredImageGeneration as Record<string,unknown>|undefined;
    if(state?.id===jobId&&state.status!=="failed")await saveCmsDraft(admin,slug,{data:{featuredImageGeneration:{...state,status:"failed",error:message,finishedAt:new Date().toISOString()}},expectedUpdatedAt:row.updated_at});
    if(!terminal)throw error;
  }finally{clearInterval(heartbeat);}
}
export async function removeCmsInlineImage(admin:BlogAdmin,slug:string,id:string) {
  const row=await draft(slug),images=inlineImages(row.frontmatter),image=images.find(i=>i.id===id);
  if(!image)throw new Error(`Image not found: ${id}`);
  image.status="removed";
  // Keep immutable stored assets available to existing revisions / Undo.
  return saveImages(admin,slug,row,images,removeInlineImageFromMdx(row.content,id));
}
export async function acceptCmsInlineImage(admin:BlogAdmin,slug:string,id:string) {
  const row=await draft(slug),images=inlineImages(row.frontmatter),image=images.find(i=>i.id===id&&i.status==="proposed"&&i.src);
  if(!image&&row.frontmatter.featuredImageKey===id&&row.frontmatter.image)return (await import("./blog-cms-actions")).getCmsDraft(slug);
  if(!image)throw new Error(`Proposed image not found: ${id}`);
  const assets=await listCmsAssets(row.id);
  if(!assets.some(a=>a.image_key===id&&a.status==="generated"&&a.public_url===image.src))throw new Error("The image is not persisted. Upload or generate it again.");
  image.status="generated";
  if(image.target==="featured") {
    for(const item of images)if(item.id!==id&&item.target==="featured"&&item.status==="generated")item.status="removed";
    return saveImages(admin,slug,row,images,row.content,{image:image.src,imageAlt:image.alt,imagePrompt:image.prompt,featuredImageKey:image.id,featuredImageRole:image.role,featuredVisualConceptId:image.visualConceptId,featuredConceptDescription:image.conceptDescription});
  }
  assertPlacement(row.content,image.placement);
  let content=row.content;
  if(image.replaces) {
    const previous=images.find(i=>i.id===image.replaces);
    if(!previous||previous.status==="removed")throw new Error("The original image changed. Discard this replacement and add a new image.");
    previous.status="removed";
    content=removeInlineImageFromMdx(content,previous.id);
  }
  const placed=insertInlineImageAtSection(content,image);
  if(!placed.resolved)throw new Error("The image placement no longer exists.");
  return saveImages(admin,slug,row,images,placed.content);
}
export async function regenerateCmsInlineImage(admin:BlogAdmin,slug:string,id:string,direction="",role?:Role) {
  const row=await draft(slug),image=inlineImages(row.frontmatter).find(i=>i.id===id&&i.status!=="removed");
  if(!image)throw new Error(`Image not found: ${id}`);
  if(!direction.trim())throw new Error("Describe what you would like instead.");
  return generateInline(admin,slug,directedImage({...image,replaces:image.status==="generated"?image.id:image.replaces||image.id},direction,role));
}
async function plannedImages(slug:string,direction="") {
  const row=await draft(slug);
  return await planInlineImages(row.brief||{title:row.title,topic:row.title},row.content,{imageDirection:direction,existingImages:activeConcepts(row)}) as InlineImage[];
}
export async function addCmsInlineImage(admin:BlogAdmin,slug:string,placement:string,direction="") {
  const row=await draft(slug);assertPlacement(row.content,placement);
  let planned:InlineImage[];
  try { planned=await plannedImages(slug,direction); }
  catch(error) {
    if(!direction.trim())throw error;
    const fallback=directedImage({id:"new",type:"editorial",role:"human",placement,sectionHeading:sections(row.content).find(s=>s.id===placement)?.heading,purpose:direction,prompt:"",alt:direction,status:"planned"} as InlineImage,direction);
    return generateInline(admin,slug,fallback);
  }
  const candidate=planned.find(i=>i.placement===placement) || (direction.trim() ? directedImage({id:"new",type:"editorial",role:"human",placement,sectionHeading:sections(row.content).find(s=>s.id===placement)?.heading,purpose:direction,prompt:"",alt:direction,status:"planned"} as InlineImage,direction) : undefined);
  if(!candidate)throw new Error("The planner did not find an image for this section. Add image direction to describe what you want here.");
  return generateInline(admin,slug,{...candidate,placement});
}
export async function planCmsInlineImages(admin:BlogAdmin,slug:string,direction="") {
  const planned=await plannedImages(slug,direction);
  let result;
  for(const image of planned)result=await generateInline(admin,slug,image);
  return result||saveCmsDraft(admin,slug,{});
}
export async function uploadCmsInlineImage(admin:BlogAdmin,slug:string,file:File,placement:string,role:Role,concept:string,alt="") {
  const row=await draft(slug);assertPlacement(row.content,placement);
  if(!["human","supporting_visual"].includes(role))throw new Error("Choose an image role.");
  if(!concept.trim())throw new Error("Describe the image's visual concept.");
  if(!file||file.size===0||file.size>10*1024*1024||!["image/png","image/jpeg","image/webp"].includes(file.type))throw new Error("Upload a PNG, JPEG or WebP image up to 10 MB.");
  // Decode, strip metadata and normalize into the existing PNG asset format.
  const bytes=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:40000000}).rotate().png().toBuffer();
  await validateGeneratedImage(bytes,`Article: ${row.title}. Section: ${placement}. ${role==="human"?"Human-centered image with a visible person":"Supporting visual"}. Editor's concept: ${concept}`);
  const candidate=directedImage({id:`image-${randomUUID()}`,type:"editorial",placement,role,purpose:concept,prompt:"",alt:alt.trim()||concept,status:"proposed"} as InlineImage,concept,role);
  candidate.source="uploaded";
  candidate.alt=(alt.trim()||concept).replace(/[\[\]\r\n]/g," ").slice(0,500);
  candidate.src=await uploadBlogAsset(row.id,candidate.id,bytes,{assetType:"inline",prompt:candidate.prompt,altText:candidate.alt,placement});
  const current=await draft(slug);
  return saveImages(admin,slug,current,[...inlineImages(current.frontmatter),candidate]);
}

export async function uploadManualCmsImage(admin:BlogAdmin,slug:string,file:File,imageType:"featured"|"inline",alt="",workingCopy?:{content?:string;data?:Record<string,unknown>;expectedUpdatedAt?:string;insertAt?:number;placement?:string}) {
  const row=await draft(slug);
  if(workingCopy?.expectedUpdatedAt&&workingCopy.expectedUpdatedAt!==row.updated_at)throw new Error("This article changed in another session. Reload it before uploading again.");
  if(!file||file.size===0||file.size>10*1024*1024||!["image/png","image/jpeg","image/webp"].includes(file.type))throw new Error("Upload a PNG, JPEG or WebP image up to 10 MB.");
  const baseContent=typeof workingCopy?.content==="string"?workingCopy.content:row.content;
  if(imageType==="inline"&&workingCopy?.placement){assertPlacement(row.content,workingCopy.placement);assertPlacement(baseContent,workingCopy.placement);}
  const bytes=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:40000000}).rotate().png().toBuffer();
  const id=`manual-${randomUUID()}`,safeAlt=alt.trim().replace(/[\[\]\r\n]/g," ").slice(0,500)||file.name.replace(/\.[^.]+$/g,"").slice(0,200),placement=workingCopy?.placement||imageType,url=await uploadBlogAsset(row.id,id,bytes,{assetType:imageType,prompt:"Manually uploaded by an editor",altText:safeAlt,placement});
  const current=await draft(slug);
  if(current.updated_at!==row.updated_at)throw new Error("This article changed while the image was uploading. Reload it before trying again.");
  const data={...(current.frontmatter||{}),...(workingCopy?.data||{})};
  if(imageType==="featured")Object.assign(data,{image:url,imageAlt:safeAlt,featuredImageKey:id});
  else {const images=Array.isArray(data.inlineImages)?[...data.inlineImages as Record<string,unknown>[]]:[];images.push({id,type:"editorial",role:"human",placement,purpose:safeAlt,visualConceptId:id,prompt:"Manually uploaded by an editor",alt:safeAlt,src:url,status:"generated",source:"uploaded"});data.inlineImages=images;data.inlineImageSummary=imageSummary(images as InlineImage[]);}
  let content=baseContent;
  if(imageType==="inline"){
    const image=(data.inlineImages as Record<string,unknown>[]).find(item=>item.id===id)!;
    if(workingCopy?.placement){const placed=insertInlineImageAtSection(baseContent,image as InlineImage);if(!placed.resolved)throw new Error("That section is no longer in the article. Choose it again and retry the upload.");content=placed.content;}
    else content=insertManualImageAt(baseContent,`![${safeAlt}](${url})`,workingCopy?.insertAt??baseContent.length);
  }
  return saveCmsDraft(admin,slug,{data,content,expectedUpdatedAt:current.updated_at});
}
