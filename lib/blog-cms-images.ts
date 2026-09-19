import "server-only";

import type { BlogAdmin } from "./blog-admin-auth";
import { getCmsArticle, updateBlogAssetMetadata, uploadBlogAsset } from "./blog-cms-db";
import { saveCmsDraft } from "./blog-cms-actions";
import {
  generateImageBytes,
  insertInlineImageAtSection,
  planInlineImages,
  removeInlineImageFromMdx,
} from "./blog-engine";
import { resolveBirbalImageCandidate } from "./birbal-image-candidate.mjs";

type InlineImage = {
  id: string;
  type: string;
  role?: "human" | "supporting_visual";
  placement: string;
  purpose: string;
  prompt: string;
  alt: string;
  src?: string;
  status: string;
  error?: string;
};

function inlineImages(frontmatter: Record<string, unknown>): InlineImage[] {
  return Array.isArray(frontmatter.inlineImages)
    ? (frontmatter.inlineImages as InlineImage[]).map((image) => ({ ...image }))
    : [];
}

function imageSummary(images: InlineImage[]) {
  const active = images.filter((image) => image.status !== "removed");
  return {
    planned: active.length,
    generated: active.filter((image) => image.status === "generated").length,
    failed: active.filter((image) => ["failed", "placement-unresolved"].includes(image.status)).length,
  };
}

function friendlyImageError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/insufficient_quota|billing|credit|quota/i.test(message)) return "Image generation unavailable because the OpenAI API organization has insufficient credits.";
  if (/model.*(?:does not exist|not found|access)|unsupported model/i.test(message)) return "The configured OpenAI image model is unavailable to this API account.";
  if (/quality gate/i.test(message)) return `The generated image did not meet the visual quality standard after two attempts. ${message.replace(/^.*quality gate:\s*/i, "")}`;
  return `Image generation failed: ${message}`;
}

function briefFor(row: NonNullable<Awaited<ReturnType<typeof getCmsArticle>>>) {
  return row.brief || {
    slug: row.slug,
    title: row.title,
    topic: row.title,
    targetAudience: Array.isArray(row.frontmatter.relevantExams)
      ? row.frontmatter.relevantExams
      : [String(row.frontmatter.audience || "Competitive-exam learners")],
  };
}

async function draft(slug: string) {
  const row = await getCmsArticle(slug, "draft");
  if (!row) throw new Error(`Draft not found: ${slug}`);
  return row;
}

async function generateAndStore(
  row: NonNullable<Awaited<ReturnType<typeof getCmsArticle>>>,
  image: InlineImage | { id: "featured"; prompt: string; alt: string; placement?: string },
  assetType: "featured" | "inline",
) {
  try {
    const bytes = await generateImageBytes(image.prompt);
    return await uploadBlogAsset(row.id, image.id, bytes, {
      assetType,
      prompt: image.prompt,
      altText: image.alt,
      placement: image.placement,
    });
  } catch (error) {
    const friendlyError = friendlyImageError(error);
    await updateBlogAssetMetadata(row.id, image.id, {
      assetType,
      prompt: image.prompt,
      altText: image.alt,
      placement: image.placement,
      status: "failed",
      generationError: friendlyError,
    });
    throw new Error(friendlyError);
  }
}

export async function removeCmsFeaturedImage(admin: BlogAdmin, slug: string) {
  const row = await draft(slug);
  await updateBlogAssetMetadata(row.id, "featured", {
    assetType: "featured",
    prompt: String(row.frontmatter.imagePrompt || ""),
    altText: String(row.frontmatter.imageAlt || ""),
    status: "removed",
  });
  return saveCmsDraft(admin, slug, { data: { image: "" } });
}

export async function regenerateCmsFeaturedImage(admin: BlogAdmin, slug: string) {
  const row = await draft(slug);
  const prompt = String(row.frontmatter.imagePrompt || "").trim();
  if (!prompt) throw new Error("The saved featured-image prompt is missing.");
  const url = await generateAndStore(row, {
    id: "featured",
    prompt,
    alt: String(row.frontmatter.imageAlt || row.title),
  }, "featured");
  return saveCmsDraft(admin, slug, { data: { image: url, featuredImageRole: "human" } });
}

export async function removeCmsInlineImage(admin: BlogAdmin, slug: string, id: string) {
  const row = await draft(slug);
  const images = inlineImages(row.frontmatter);
  const index = images.findIndex((image) => image.id === id);
  if (index < 0) throw new Error(`Inline image not found: ${id}`);
  const previous = images[index];
  images[index] = { ...previous, status: "removed", src: "", error: "" };
  await updateBlogAssetMetadata(row.id, id, {
    assetType: "inline",
    prompt: previous.prompt,
    altText: previous.alt,
    placement: previous.placement,
    status: "removed",
  });
  return saveCmsDraft(admin, slug, {
    content: removeInlineImageFromMdx(row.content, id),
    data: { inlineImages: images, inlineImageSummary: imageSummary(images) },
  });
}

async function generateInline(admin: BlogAdmin, slug: string, candidate: InlineImage, stage = false) {
  const row = await draft(slug);
  const images = inlineImages(row.frontmatter);
  const existingIndex = images.findIndex((image) => image.id === candidate.id);
  let url: string;
  try { url = await generateAndStore(row, candidate, "inline"); }
  catch (error) {
    const failed = { ...candidate, src: "", status: "failed", error: friendlyImageError(error) };
    if (existingIndex >= 0) images[existingIndex] = failed;
    else images.push(failed);
    return saveCmsDraft(admin, slug, { data: { inlineImages: images, inlineImageSummary: imageSummary(images) } });
  }
  const generated = { ...candidate, src: url, status: stage ? "proposed" : "generated", error: "" };
  if (existingIndex >= 0) images[existingIndex] = generated;
  else images.push(generated);
  if (stage) return saveCmsDraft(admin, slug, {
    data: { inlineImages: images, inlineImageSummary: imageSummary(images) },
  });
  const withoutPrevious = removeInlineImageFromMdx(row.content, candidate.id);
  const placed = insertInlineImageAtSection(withoutPrevious, generated);
  if (!placed.resolved) {
    generated.status = "placement-unresolved";
    generated.error = `Heading '${candidate.placement}' no longer exists.`;
  }
  return saveCmsDraft(admin, slug, {
    content: placed.content,
    data: { inlineImages: images, inlineImageSummary: imageSummary(images) },
  });
}

export async function acceptCmsInlineImage(admin: BlogAdmin, slug: string, id: string) {
  const row = await draft(slug);
  const images = inlineImages(row.frontmatter);
  const index = images.findIndex(image => image.id === id && image.status === "proposed" && image.src);
  if (index < 0) throw new Error(`Proposed image not found: ${id}`);
  const image = { ...images[index], status: "generated" };
  const placed = insertInlineImageAtSection(row.content, image);
  if (!placed.resolved) throw new Error(`Heading '${image.placement}' no longer exists.`);
  images[index] = image;
  return saveCmsDraft(admin, slug, { content: placed.content, data: { inlineImages: images, inlineImageSummary: imageSummary(images) } });
}

export async function regenerateCmsInlineImage(admin: BlogAdmin, slug: string, id: string) {
  const row = await draft(slug);
  const image = inlineImages(row.frontmatter).find((item) => item.id === id);
  if (!image) throw new Error(`Inline image not found: ${id}`);
  return generateInline(admin, slug, { ...image, status: "generating", error: "" }, image.status === "proposed");
}

async function plannedImages(slug: string) {
  const row = await draft(slug);
  return (await planInlineImages(briefFor(row), row.content)) as InlineImage[];
}

export async function addCmsInlineImage(admin: BlogAdmin, slug: string, placement: string, explicitBrief = "") {
  const row = await draft(slug);
  const images = inlineImages(row.frontmatter);
  const validPlacements=[...row.content.matchAll(/^##\s+(.+)$/gm)].map(match=>String(match[1]).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""));
  let planned:InlineImage[]=[];try{planned=await plannedImages(slug);}catch(error){if(!String(explicitBrief).trim())throw error;}
  const resolveCandidate=resolveBirbalImageCandidate as unknown as (input:{planned:InlineImage[];placement:string;brief:string;validPlacements:string[];existingIds:string[];sectionHeading:string})=>InlineImage;
  const sectionHeading=[...row.content.matchAll(/^##\s+(.+)$/gm)].find(match=>String(match[1]).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")===placement)?.[1]||"";
  const candidate=resolveCandidate({planned,placement,brief:explicitBrief,validPlacements,existingIds:images.map(image=>image.id),sectionHeading});
  if (explicitBrief.trim()) {
    const supporting = /\b(?:diagram|comparison|comparative|contrast|flowchart|framework|process|infographic|chart|split|composite|illustration|arrows|cards)\b/i.test(explicitBrief) && !/\b(?:photo|photograph|student|learner|person|people)\b/i.test(explicitBrief);
    candidate.role = supporting ? "supporting_visual" : "human";
    candidate.prompt = `Create a relevant ${supporting ? "supporting editorial visual (diagram, comparison, or illustration is allowed)" : "human-centered editorial image"} for section ${sectionHeading}. Approved visual brief: ${explicitBrief}. Preserve the approved concept and article relevance. Avoid unrelated decoration, unsafe content, and severe visual artifacts.`;
  } else candidate.role ||= "human";
  const base = candidate.id;
  let suffix = 2;
  while (images.some((image) => image.id === candidate.id)) candidate.id = `${base}-${suffix++}`;
  return generateInline(admin, slug, candidate, true);
}

export async function planCmsInlineImages(admin: BlogAdmin, slug: string) {
  const planned = await plannedImages(slug);
  let result = await saveCmsDraft(admin, slug, {});
  for (const image of planned) result = await generateInline(admin, slug, image, true);
  return result;
}
