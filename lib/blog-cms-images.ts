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

type InlineImage = {
  id: string;
  type: string;
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
    await updateBlogAssetMetadata(row.id, image.id, {
      assetType,
      prompt: image.prompt,
      altText: image.alt,
      placement: image.placement,
      status: "failed",
      generationError: error instanceof Error ? error.message : String(error),
    });
    throw error;
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
  return saveCmsDraft(admin, slug, { data: { image: url } });
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

async function generateInline(admin: BlogAdmin, slug: string, candidate: InlineImage) {
  const row = await draft(slug);
  const images = inlineImages(row.frontmatter);
  const existingIndex = images.findIndex((image) => image.id === candidate.id);
  const url = await generateAndStore(row, candidate, "inline");
  const generated = { ...candidate, src: url, status: "generated", error: "" };
  if (existingIndex >= 0) images[existingIndex] = generated;
  else images.push(generated);
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

export async function regenerateCmsInlineImage(admin: BlogAdmin, slug: string, id: string) {
  const row = await draft(slug);
  const image = inlineImages(row.frontmatter).find((item) => item.id === id);
  if (!image) throw new Error(`Inline image not found: ${id}`);
  return generateInline(admin, slug, { ...image, status: "generating", error: "" });
}

async function plannedImages(slug: string) {
  const row = await draft(slug);
  return (await planInlineImages(briefFor(row), row.content)) as InlineImage[];
}

export async function addCmsInlineImage(admin: BlogAdmin, slug: string, placement: string) {
  const row = await draft(slug);
  const planned = await plannedImages(slug);
  const candidate = planned.find((image) => image.placement === placement);
  if (!candidate) throw new Error("The image planner found no useful image for that section.");
  const images = inlineImages(row.frontmatter);
  const base = candidate.id;
  let suffix = 2;
  while (images.some((image) => image.id === candidate.id)) candidate.id = `${base}-${suffix++}`;
  return generateInline(admin, slug, candidate);
}

export async function planCmsInlineImages(admin: BlogAdmin, slug: string) {
  const planned = await plannedImages(slug);
  let result = await saveCmsDraft(admin, slug, {});
  for (const image of planned) result = await generateInline(admin, slug, image);
  return result;
}
