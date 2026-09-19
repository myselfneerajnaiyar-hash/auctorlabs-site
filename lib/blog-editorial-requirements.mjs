import { extractArticleBodyLinks } from "./blog-links.mjs";

export function editorialRequirements(row, assets = [], validUrls = []) {
  const data = row.frontmatter || {};
  const content = String(row.content || "");
  const images = Array.isArray(data.inlineImages) ? data.inlineImages : [];
  const accepted = images.filter(image => image.status === "generated" && image.src && content.includes(`inline-image:${image.id}`) && content.includes(`](${image.src})`) && assets.some(asset => asset.image_key === image.id && asset.status === "generated" && asset.public_url === image.src));
  const featured = assets.some(asset => asset.image_key === "featured" && asset.status === "generated" && asset.public_url === data.image);
  const featuredHuman = data.featuredImageRole === "human" || /human|photorealistic editorial photograph/i.test(String(data.imagePrompt || ""));
  const humanImages = accepted.filter(image => image.role === "human").length + (featured && featuredHuman ? 1 : 0);
  const supportingVisuals = accepted.filter(image => image.role === "supporting_visual").length;
  const allowed = new Set(validUrls);
  const self = `/blog/${row.slug}`;
  const internalLinks = [...new Set(extractArticleBodyLinks(content).map(link => link.url.split(/[?#]/)[0]).filter(url => url !== self && allowed.has(url)))];
  return { humanImages, supportingVisuals, internalLinks, humanReady: humanImages >= 2, linksReady: internalLinks.length >= 1 };
}
