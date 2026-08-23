import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local", quiet: true });

const root = process.cwd();
const bucket = process.env.BLOG_ASSET_BUCKET || "blog-assets";
const execute = process.argv.includes("--execute");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase CMS environment variables are missing.");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function filesIn(relativeDirectory, status) {
  const directory = path.join(root, relativeDirectory);
  return fs.readdirSync(directory)
    .filter((name) => name.endsWith(".mdx"))
    .sort()
    .map((name) => ({
      filePath: path.join(directory, name),
      sourcePath: `${relativeDirectory}/${name}`.replaceAll("\\", "/"),
      slug: name.replace(/\.mdx$/, ""),
      status,
    }));
}

function isoDate(value) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
  if (extension === ".webp") return "image/webp";
  if (extension === ".gif") return "image/gif";
  if (extension === ".svg") return "image/svg+xml";
  return "image/png";
}

function imageReferences(data, content) {
  const references = [];
  if (typeof data.image === "string" && data.image) {
    references.push({ source: data.image, type: "featured", alt: String(data.imageAlt || data.title || ""), prompt: String(data.imagePrompt || ""), placement: null });
  }
  for (const match of content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)) {
    references.push({ source: match[2], type: "inline", alt: match[1], prompt: "", placement: null });
  }
  for (const match of content.matchAll(/<(?:img|Image)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/g)) {
    references.push({ source: match[1], type: "inline", alt: "", prompt: "", placement: null });
  }
  const seen = new Set();
  return references.filter((reference) => {
    if (seen.has(reference.source)) return false;
    seen.add(reference.source);
    return true;
  });
}

async function uploadImages(article) {
  const replacements = new Map();
  const assets = [];
  const warnings = [];
  let inlineNumber = 0;
  for (const reference of imageReferences(article.data, article.content)) {
    if (!reference.source.startsWith("/blog/")) continue;
    const localPath = path.join(root, "public", reference.source.slice(1));
    if (!fs.existsSync(localPath)) {
      warnings.push(`Missing local image preserved: ${reference.source}`);
      continue;
    }
    const imageKey = reference.type === "featured" ? "featured" : `inline-${++inlineNumber}`;
    const extension = path.extname(localPath).toLowerCase() || ".png";
    const storagePath = `file-imports/${article.slug}/${imageKey}${extension}`;
    const { error } = await supabase.storage.from(bucket).upload(storagePath, fs.readFileSync(localPath), {
      contentType: contentType(localPath),
      upsert: true,
    });
    if (error) throw new Error(`Storage upload failed for ${reference.source}: ${error.message}`);
    const publicUrl = supabase.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl;
    replacements.set(reference.source, publicUrl);
    assets.push({
      asset_type: reference.type,
      image_key: imageKey,
      prompt: reference.prompt,
      alt_text: reference.alt,
      placement: reference.placement,
      status: "generated",
      public_url: publicUrl,
      storage_path: storagePath,
      generation_error: null,
    });
  }
  return { replacements, assets, warnings };
}

const discovered = [
  ...filesIn("content/blog", "published"),
  ...filesIn("content/drafts", "draft"),
];
const articles = discovered.map((entry) => {
  const parsed = matter(fs.readFileSync(entry.filePath, "utf8"));
  return { ...entry, data: parsed.data, content: parsed.content };
});

console.log(JSON.stringify({
  mode: execute ? "execute" : "dry-run",
  found: articles.length,
  published: articles.filter((article) => article.status === "published").length,
  drafts: articles.filter((article) => article.status === "draft").length,
  sources: ["content/blog/*.mdx", "content/drafts/*.mdx"],
}, null, 2));
if (!execute) process.exit(0);

const { data: admins, error: adminError } = await supabase
  .from("blog_admins")
  .select("id")
  .eq("active", true)
  .limit(2);
if (adminError) throw adminError;
if (admins.length !== 1) throw new Error(`Expected exactly one active blog_admin, found ${admins.length}.`);
const adminId = admins[0].id;

const { data: existingRows, error: existingError } = await supabase
  .from("blog_articles")
  .select("id,slug");
if (existingError) throw existingError;
const existingBySlug = new Map(existingRows.map((row) => [row.slug, row]));

const summary = { inserted: 0, skipped: 0, imagesUploaded: 0, warnings: [] };
for (const article of articles) {
  if (existingBySlug.has(article.slug)) {
    summary.skipped++;
    console.log(`SKIP ${article.slug} (already exists)`);
    continue;
  }

  const { replacements, assets, warnings } = await uploadImages(article);
  const frontmatter = { ...article.data };
  if (typeof frontmatter.image === "string" && replacements.has(frontmatter.image)) {
    frontmatter.image = replacements.get(frontmatter.image);
  }
  let content = article.content;
  for (const [source, target] of replacements) content = content.split(source).join(target);
  const publishedAt = article.status === "published" ? isoDate(frontmatter.date) : null;
  const createdAt = isoDate(frontmatter.date);
  const updatedAt = isoDate(frontmatter.updatedDate) || createdAt;
  const payload = {
    slug: article.slug,
    status: article.status,
    title: String(frontmatter.title || article.slug),
    description: String(frontmatter.description || frontmatter.excerpt || frontmatter.title || article.slug),
    content,
    frontmatter: { ...frontmatter, status: article.status },
    created_by: adminId,
    updated_by: adminId,
    published_at: publishedAt,
    ...(createdAt ? { created_at: createdAt } : {}),
    ...(updatedAt ? { updated_at: updatedAt } : {}),
  };
  const { data: inserted, error: insertError } = await supabase
    .from("blog_articles")
    .insert(payload)
    .select("id,slug")
    .single();
  if (insertError) throw new Error(`Article insert failed for ${article.slug}: ${insertError.message}`);
  if (assets.length) {
    const { error: assetError } = await supabase.from("blog_assets").upsert(
      assets.map((asset) => ({ ...asset, article_id: inserted.id })),
      { onConflict: "article_id,image_key" },
    );
    if (assetError) throw new Error(`Asset metadata failed for ${article.slug}: ${assetError.message}`);
  }
  summary.inserted++;
  summary.imagesUploaded += assets.length;
  summary.warnings.push(...warnings.map((warning) => `${article.slug}: ${warning}`));
  console.log(`IMPORT ${article.status} ${article.slug} (${assets.length} images)`);
}

const { data: importedRows, error: verifyError } = await supabase
  .from("blog_articles")
  .select("slug,status");
if (verifyError) throw verifyError;
const counts = new Map();
for (const row of importedRows) counts.set(row.slug, (counts.get(row.slug) || 0) + 1);
const duplicateSlugs = [...counts].filter(([, count]) => count > 1).map(([slug]) => slug);
console.log(JSON.stringify({ ...summary, cmsTotal: importedRows.length, duplicateSlugs }, null, 2));
if (duplicateSlugs.length) process.exitCode = 1;
