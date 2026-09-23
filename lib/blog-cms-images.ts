import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import type { BlogAdmin } from "./blog-admin-auth";
import { getCmsArticle, listCmsAssets, uploadBlogAsset } from "./blog-cms-db";
import { saveCmsDraft } from "./blog-cms-actions";
import { generateImageBytes, validateGeneratedImage, insertInlineImageAtSection, planInlineImages, removeInlineImageFromMdx } from "./blog-engine";
import { directedImage, sameConcept } from "./blog-image-concepts.mjs";

type Role = "human" | "supporting_visual";
type InlineImage = { id:string; type:string; role?:Role; placement:string; purpose:string; prompt:string; alt:string; src?:string; status:string; error?:string; visualConceptId?:string; conceptDescription?:string; source?:string; replaces?:string; target?:"featured"; sectionHeading?:string };
const inlineImages = (data:Record<string,unknown>):InlineImage[] => Array.isArray(data.inlineImages) ? structuredClone(data.inlineImages) : [];
const imageSummary = (images:InlineImage[]) => ({planned:images.filter(i=>i.status!=="removed").length,generated:images.filter(i=>i.status==="generated").length,failed:images.filter(i=>i.status==="failed").length});
async function draft(slug:string) { const row=await getCmsArticle(slug,"draft"); if(!row)throw new Error(`Draft not found: ${slug}`); return row; }
function sections(content:string) { return [...content.matchAll(/^##\s+(.+)$/gm)].map(match=>({heading:match[1],id:match[1].toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")})); }
function assertPlacement(content:string,placement:string) { if(!sections(content).some(section=>section.id===placement))throw new Error("The requested image section no longer exists."); }
function activeConcepts(row:Awaited<ReturnType<typeof draft>>) {
  return [...inlineImages(row.frontmatter).filter(i=>i.target!=="featured"&&!["removed","failed"].includes(i.status)),...(row.frontmatter.image?[{id:"featured",role:row.frontmatter.featuredImageRole||"human",prompt:row.frontmatter.imagePrompt,visualConceptId:row.frontmatter.featuredVisualConceptId,conceptDescription:row.frontmatter.featuredConceptDescription}]:[])];
}
async function saveImages(admin:BlogAdmin,slug:string,row:Awaited<ReturnType<typeof draft>>,images:InlineImage[],content=row.content,data:Record<string,unknown>={}) {
  return saveCmsDraft(admin,slug,{content,data:{inlineImages:images,inlineImageSummary:imageSummary(images),...data},expectedUpdatedAt:row.updated_at});
}
async function generateInline(admin:BlogAdmin,slug:string,candidate:InlineImage) {
  const row=await draft(slug);
  const image={...candidate,alt:candidate.alt.replace(/[\[\]\r\n]/g," ").slice(0,500),id:`image-${randomUUID()}`,source:"ai",src:"",status:"proposed",error:""};
  try {
    const others=activeConcepts(row).filter(i=>i.id!==candidate.replaces);
    if(others.some(other=>sameConcept(image,other)))throw new Error("This visual concept is already in the article. Describe a different action or story.");
    const bytes=await generateImageBytes(`${image.prompt}\nRequired role: ${image.role==="human"?"human-centered, with a visible relevant person":"supporting visual"}. Approved concept: ${image.conceptDescription||image.purpose}. Article: ${row.title}. Other visual concepts to distinguish this scene from: ${JSON.stringify(others.map(i=>i.conceptDescription||i.prompt))}. Vary the action, framing, emotional state, positioning and story; do not create a stock-pose variant.`);
    image.src=await uploadBlogAsset(row.id,image.id,bytes,{assetType:image.target==="featured"?"featured":"inline",prompt:image.prompt,altText:image.alt,placement:image.placement});
  } catch(error) { image.status="failed"; image.error=error instanceof Error?error.message:String(error); }
  // Re-read after the slow model call, preserving edits made while it ran.
  const current=await draft(slug);
  return saveImages(admin,slug,current,[...inlineImages(current.frontmatter),image]);
}
export async function removeCmsFeaturedImage(admin:BlogAdmin,slug:string) {
  const row=await draft(slug);
  return saveImages(admin,slug,row,inlineImages(row.frontmatter).map(i=>i.target==="featured"&&i.status==="generated"?{...i,status:"removed"}:i),row.content,{image:""});
}
export async function regenerateCmsFeaturedImage(admin:BlogAdmin,slug:string,direction="",role?:Role) {
  const row=await draft(slug);
  if(!direction.trim())throw new Error("Describe what you would like instead.");
  const candidate:InlineImage={id:"featured",type:"editorial",target:"featured",replaces:"featured",role:(row.frontmatter.featuredImageRole as Role)||"human",placement:"featured",purpose:direction,prompt:"",alt:direction,status:"planned"};
  return generateInline(admin,slug,directedImage(candidate,direction,role));
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
