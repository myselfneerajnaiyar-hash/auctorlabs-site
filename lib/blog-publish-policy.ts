/* eslint-disable @typescript-eslint/no-explicit-any -- CMS JSON fields are runtime-shaped. */
const technicalRequiredFields = ["title", "description", "date", "author"];
const internalCopyPattern = /human review required|AI reviewer|editorial review|model-generated|content brief|production note|SEO score|\bdraft\b|this article was generated|image-generation instructions?|notes? to (?:the )?editor|placeholder text|internal instructions?/i;

export function sanitizeCmsPublicCopy(value: unknown) {
  return String(value || "").split("\n").filter(line => !internalCopyPattern.test(line)).join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export function referencedCmsAssets(row: any, assets: any[]) {
  const data = row.frontmatter || {}, content = String(row.content || ""), inlineImages = Array.isArray(data.inlineImages) ? data.inlineImages : [];
  return assets.filter((asset: any) => {
    if (asset.status === "removed") return false;
    if (asset.asset_type === "featured" || asset.image_key === "featured") return Boolean(data.image);
    const image = inlineImages.find((item: any) => item.id === asset.image_key);
    if (!image || image.status === "removed") return false;
    return Boolean((image.src && content.includes(image.src)) || content.includes(`inline-image:${image.id}`));
  });
}

export function publicationTechnicalBlockers(row: any, assets: any[] = []) {
  const data = row.frontmatter || {}, blockers: string[] = [];
  if (!String(row.slug || "").trim()) blockers.push("Article slug is missing.");
  if (!String(row.content || "").trim()) blockers.push("Article content is empty.");
  const missing = technicalRequiredFields.filter(key => !String(key === "title" ? row.title : key === "description" ? row.description : data[key] || "").trim());
  if (missing.length) blockers.push(`Required article fields are missing: ${missing.join(", ")}.`);
  const unresolved = referencedCmsAssets(row, assets).filter((asset: any) => asset.status !== "generated" || !asset.public_url || (asset.asset_type === "featured" ? data.image !== asset.public_url : !String(row.content || "").includes(asset.public_url)));
  if (unresolved.length) blockers.push(`Required referenced image assets are unavailable: ${unresolved.map((asset: any) => `${asset.image_key} (${asset.id}; ${asset.status})`).join(", ")}.`);
  return blockers;
}

export function publicationPersistenceError(error: unknown) {
  return `Publication failed because the article could not be saved to Supabase: ${error instanceof Error ? error.message : String(error)}`;
}
