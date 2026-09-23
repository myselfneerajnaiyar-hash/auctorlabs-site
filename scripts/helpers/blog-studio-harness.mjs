import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

// Run the real TSX components and CMS actions under node:test. Only persistence
// and the published URL catalog are replaced; validation/publish policy are real.
export const cms = { row: null, assets: [], writes: [] };
globalThis.__blogStudioTestCms = cms;
const root = new URL("../../", import.meta.url);
registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.includes("/node_modules/")) return next(specifier, context);
    if (specifier === "server-only") return { url: "test:server-only", shortCircuit: true };
    if (context.parentURL?.endsWith("/lib/blog-cms-actions.ts") && specifier === "./blog")
      return { url: "test:published-posts", shortCircuit: true };
    if (specifier.startsWith("@/")) specifier = new URL(specifier.slice(2), root).href;
    if (specifier.startsWith(".") || specifier.startsWith("file:")) {
      const url = new URL(specifier, context.parentURL);
      for (const extension of ["", ".ts", ".tsx"]) {
        const candidate = `${url.href}${extension}`;
        if (existsSync(fileURLToPath(candidate))) return { url: candidate, shortCircuit: true };
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    let source;
    if (url === "test:server-only") source = "export {};";
    if (url === "test:published-posts") source = 'export async function getPublishedBlogPosts(){return [{slug:"published"}]};';
    if (url.endsWith("/lib/blog-cms-db.ts")) source = `
      const db=globalThis.__blogStudioTestCms;
      export async function getCmsArticle(){return structuredClone(db.row)}
      export async function listCmsAssets(){return structuredClone(db.assets)}
      export async function listCmsArticles(){return [structuredClone(db.row)]}
      export async function archiveCmsArticle(){throw new Error("Unexpected archive")}
      export async function updateBlogAssetMetadata(article,id,changes){const asset=db.assets.find(item=>item.image_key===id);if(!asset)throw new Error("Unknown asset");Object.assign(asset,changes)}
      export async function uploadBlogAsset(article,id,bytes,metadata){if(!db.imageEngine)throw new Error("Unexpected image generation");const url="https://cdn.test/"+id+".png";db.assets.push({image_key:id,asset_type:metadata.assetType,status:"generated",public_url:url,storage_path:id,alt_text:metadata.altText});db.uploads.push({article,id,bytes,metadata});return url;}
      export async function updateCmsArticle(admin,slug,changes,version){
        if(version!==db.row.updated_at)throw new Error("Stale version");
        db.writes.push(structuredClone(changes));
        db.row={...db.row,...structuredClone(changes),updated_at:String(Number(db.row.updated_at)+1)};
        return structuredClone(db.row);
      }`;
    if (url.endsWith("/lib/blog-engine.ts")) source = `
      export * from "${new URL("scripts/blog-engine.mjs",root).href}";
      import * as real from "${new URL("scripts/blog-engine.mjs",root).href}";
      const db=globalThis.__blogStudioTestCms;
      export async function generateImageBytes(...args){return db.imageEngine?db.imageEngine.generate(...args):real.generateImageBytes(...args)}
      export async function validateGeneratedImage(...args){return db.imageEngine?db.imageEngine.validate(...args):real.validateGeneratedImage(...args)}
      export async function planInlineImages(...args){return db.imageEngine?db.imageEngine.plan(...args):real.planInlineImages(...args)}
    `;
    if (source !== undefined) return { source, format: "module", shortCircuit: true };
    if (/\.(tsx|ts)$/.test(url) && url.startsWith(root.href)) {
      return { source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      }).outputText, format: "module", shortCircuit: true };
    }
    return next(url, context);
  },
});

export function fixture({ humans = 2, link = true, supporting = false } = {}) {
  const images = Array.from({ length: humans }, (_, i) => ({ id: `human-${i}`, role: "human", status: "generated", src: `https://cdn.test/human-${i}.png`, placement: "insight", alt: "Learner", purpose: "Human context" }));
  if (supporting) images.push({ id: "diagram", role: "supporting_visual", status: "failed", src: "", placement: "insight" });
  cms.row = { id: "article-1", slug: "current", status: "draft", title: "Reading with purpose", description: "Practical reading methods.", updated_at: "1",
    frontmatter: { title: "Reading with purpose", date: "2026-09-21", author: "Auctor Labs", inlineImages: images },
    content: `## Insight\n\nUse ${link ? "[related reading](/blog/published)" : "related reading"} to practice.\n\n${images.filter(i => i.src).map(i => `{/* inline-image:${i.id} */}\n\n![Learner](${i.src})`).join("\n\n")}` };
  cms.assets = images.filter(i => i.src).map(i => ({ image_key: i.id, asset_type: "inline", status: "generated", public_url: i.src, storage_path: i.id, alt_text: i.alt }));
  cms.writes = [];
}
