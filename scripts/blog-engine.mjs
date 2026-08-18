import fs from "fs";
import path from "path";
import matter from "gray-matter";
import slugify from "slugify";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, "content", "blog");
const DRAFT_DIR = path.join(ROOT, "content", "drafts");
const STRATEGY_PATH = path.join(ROOT, "content", "content-strategy.json");
const REGISTRY_PATH = path.join(ROOT, "content", "content-registry.json");
const REPORT_PATH = path.join(ROOT, "content", "content-audit.json");
const DISCOVERY_PATH = path.join(ROOT, "content", "topic-opportunities.json");
const VALID_ACTIONS = ["UPDATE", "MERGE", "REDIRECT", "EXPAND", "CREATE_NEW", "LEAVE_ALONE"];

function readStrategy() {
  return JSON.parse(fs.readFileSync(STRATEGY_PATH, "utf8"));
}

function extractLinks(content) {
  const markdown = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
  const html = [...content.matchAll(/href=["']([^"']+)["']/g)].map((match) => match[1]);
  return [...new Set([...markdown, ...html])];
}

function wordCount(content) {
  return content.replace(/<[^>]+>/g, " ").replace(/!\[[^\]]*\]\([^)]*\)/g, " ").split(/\s+/).filter(Boolean).length;
}

function inventory(directory = BLOG_DIR) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory).filter((file) => file.endsWith(".mdx")).map((file) => {
    const raw = fs.readFileSync(path.join(directory, file), "utf8");
    const { data, content } = matter(raw);
    const links = extractLinks(content);
    return {
      url: `/blog/${file.replace(/\.mdx$/, "")}`,
      slug: file.replace(/\.mdx$/, ""),
      title: data.title || "",
      description: data.description || "",
      primaryKeyword: data.primaryKeyword || null,
      secondaryKeywords: data.secondaryKeywords || [],
      searchIntent: data.searchIntent || null,
      cluster: data.cluster || data.category || "Unmapped",
      category: data.category || "Strategy",
      publicationDate: data.date || null,
      updatedDate: data.updatedDate || null,
      status: data.status || "published",
      author: data.author || "Auctor Labs Editorial Team",
      targetPage: data.targetPage || null,
      internalLinks: links.filter((link) => link.startsWith("/") || link.includes("auctorlabs.in")),
      externalReferences: data.externalReferences || links.filter((link) => link.startsWith("http") && !link.includes("auctorlabs.in")),
      image: data.image || null,
      imageAlt: data.imageAlt || null,
      schemaType: data.schemaType || "BlogPosting",
      seoScore: data.seoScore || scoreSeo(data, content),
      contentQualityScore: data.contentQualityScore || scoreQuality(data, content).total,
      backlinkOpportunities: data.backlinkOpportunities || [],
      refreshDate: data.refreshDate || null,
      wordCount: wordCount(content),
      headings: (content.match(/^#{2,3}\s+/gm) || []).length,
    };
  });
}

function scoreSeo(data, content) {
  let score = 0;
  if (data.title && data.title.length >= 25 && data.title.length <= 70) score += 15;
  if (data.description && data.description !== data.title && data.description.length >= 100 && data.description.length <= 170) score += 15;
  if (data.primaryKeyword) score += 10;
  if (data.searchIntent && data.cluster) score += 10;
  if (data.image && data.imageAlt) score += 10;
  if (data.author && data.date) score += 10;
  if (data.updatedDate || data.refreshDate) score += 5;
  if ((content.match(/^##\s+/gm) || []).length >= 3) score += 10;
  if (extractLinks(content).some((link) => link.startsWith("/blog/"))) score += 8;
  if (extractLinks(content).some((link) => link.startsWith("/features/") || link === "/test-series" || link === "/auctor-rc")) score += 7;
  return score;
}

function scoreQuality(data, content) {
  const words = wordCount(content);
  const links = extractLinks(content);
  const dimensions = {
    searchIntentMatch: data.primaryKeyword && data.searchIntent ? 10 : 3,
    originality: /Auctor-created|illustrative example|diagnostic|framework/i.test(content) ? 9 : 4,
    depth: words >= 1200 ? 10 : words >= 800 ? 7 : words >= 500 ? 5 : 2,
    usefulness: /\|.+\|\n\|[- :|]+\||exercise|worked example|checklist|step \d/i.test(content) ? 10 : 4,
    seoCompleteness: Math.round(scoreSeo(data, content) / 10),
    internalLinking: links.filter((link) => link.startsWith("/")).length >= 3 ? 10 : links.some((link) => link.startsWith("/")) ? 6 : 2,
    readability: (content.match(/^##\s+/gm) || []).length >= 3 && !content.includes("In today's fast-paced world") ? 8 : 4,
    factualReliability: data.externalReferences?.length || /Auctor-created|illustrative/i.test(content) ? 9 : 5,
    visualQuality: data.image && data.imageAlt && /diagram|table|framework|visual/i.test(content) ? 9 : data.image ? 5 : 0,
    conversionRelevance: links.some((link) => /features|test-series|auctor-rc/.test(link)) ? 8 : 3,
  };
  return { total: Object.values(dimensions).reduce((sum, value) => sum + value, 0), dimensions };
}

function similarity(a, b) {
  const stop = new Set(["with", "from", "that", "this", "your", "into", "about", "mastering", "unlocking", "success"]);
  const tokens = (value) => new Set(value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 3 && !stop.has(token)));
  const left = tokens(`${a.title} ${a.primaryKeyword || ""}`); const right = tokens(`${b.title} ${b.primaryKeyword || ""}`);
  const shared = [...left].filter((token) => right.has(token)).length;
  return shared / Math.max(1, new Set([...left, ...right]).size);
}

function audit() {
  const posts = inventory();
  const today = new Date();
  const overlaps = [];
  for (let i = 0; i < posts.length; i++) for (let j = i + 1; j < posts.length; j++) {
    const value = similarity(posts[i], posts[j]);
    if (value >= 0.34) overlaps.push({ left: posts[i].slug, right: posts[j].slug, similarity: Number(value.toFixed(2)), recommendation: "REVIEW_FOR_MERGE_OR_DIFFERENTIATION" });
  }
  const recommendations = posts.map((post) => {
    const ageDays = post.publicationDate ? Math.floor((today - new Date(post.updatedDate || post.publicationDate)) / 86400000) : null;
    let action = "LEAVE_ALONE";
    const reasons = [];
    if (!post.primaryKeyword || !post.searchIntent) { action = "EXPAND"; reasons.push("Missing keyword/intent mapping"); }
    if (post.wordCount < 700) { action = "EXPAND"; reasons.push("Thin relative to current SERP expectations"); }
    if (post.description === post.title) reasons.push("Meta description duplicates title");
    if (ageDays !== null && ageDays > 365) { action = "UPDATE"; reasons.push("Freshness review due"); }
    return { slug: post.slug, action, reasons };
  });
  const report = { generatedAt: new Date().toISOString(), allowedActions: VALID_ACTIONS, summary: { posts: posts.length, overlaps: overlaps.length, expandOrUpdate: recommendations.filter((item) => item.action !== "LEAVE_ALONE").length }, overlaps, recommendations };
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

function registry() {
  const posts = inventory();
  fs.writeFileSync(REGISTRY_PATH, `${JSON.stringify({ generatedAt: new Date().toISOString(), posts }, null, 2)}\n`);
  return posts;
}

function backlinks(topic) {
  return [
    { type: "Resource pages", targets: "MBA preparation and college learning-resource pages", pitch: `Offer the worked ${topic} framework as a free reference.` },
    { type: "Student communities", targets: "CAT study communities and campus MBA clubs", pitch: "Share the exercise as a discussion resource; do not automate posting." },
    { type: "Guest expertise", targets: "Education publications and MBA preparation blogs", pitch: "Contribute a decision-analysis excerpt with an original visual." },
    { type: "Linkable asset", targets: "Teachers, mentors and study groups", pitch: "Create a downloadable one-page error taxonomy and attribution-friendly diagram." }
  ];
}

async function discover() {
  if (!process.env.SERP_API_KEY) throw new Error("SERP_API_KEY is required for topic discovery.");
  const queries = [
    "CAT 2026 VARC preparation",
    "CAT reading comprehension problems",
    "CAT para jumbles para summary odd sentence",
    "CAT VARC mock score improvement",
  ];
  const existing = inventory();
  const candidates = [];
  for (const query of queries) {
    const { data } = await axios.get("https://serpapi.com/search.json", { params: { engine: "google", q: query, google_domain: "google.co.in", gl: "in", hl: "en", api_key: process.env.SERP_API_KEY } });
    const ideas = [
      ...(data.related_searches || []).map((item) => ({ query: item.query, source: "related_search" })),
      ...(data.related_questions || []).map((item) => ({ query: item.question, source: "people_also_ask" })),
    ];
    for (const idea of ideas) {
      if (!/cat|varc|verbal|reading comprehension|para|mock/i.test(idea.query)) continue;
      const probe = { title: idea.query, primaryKeyword: idea.query };
      const collision = existing.map((post) => ({ slug: post.slug, similarity: similarity(post, probe) })).sort((a, b) => b.similarity - a.similarity)[0];
      candidates.push({ ...idea, seedQuery: query, cannibalizationRisk: collision?.similarity || 0, closestExisting: collision?.slug || null, recommendation: collision?.similarity >= 0.5 ? "UPDATE_OR_DIFFERENTIATE" : "RESEARCH_BRIEF", requiresEditorialReview: true });
    }
  }
  const unique = [...new Map(candidates.map((item) => [item.query.toLowerCase(), item])).values()]
    .sort((a, b) => a.cannibalizationRisk - b.cannibalizationRisk)
    .slice(0, 40);
  const output = { generatedAt: new Date().toISOString(), note: "Discovery candidates are not publication approval. Validate intent, sources, product relevance and SERP quality before adding to the queue.", candidates: unique };
  fs.writeFileSync(DISCOVERY_PATH, `${JSON.stringify(output, null, 2)}\n`);
  return { candidates: unique.length, output: DISCOVERY_PATH };
}

function sampleDraft() {
  const strategy = readStrategy();
  const brief = strategy.queue.find((item) => item.slug === "cat-para-summary-strategy");
  const existing = inventory();
  const collision = existing.map((post) => ({ slug: post.slug, similarity: similarity(post, brief) })).sort((a, b) => b.similarity - a.similarity)[0];
  if (collision?.similarity >= 0.5) throw new Error(`Cannibalization risk with ${collision.slug}`);
  fs.mkdirSync(DRAFT_DIR, { recursive: true });
  const date = new Date().toISOString().slice(0, 10);
  const content = `## Why para summary is a scope test\n\nA CAT para summary question does not ask you to rewrite a paragraph. It asks you to choose the option that preserves the paragraph's central claim, logical movement and degree of certainty. The wrong options are often factually related; they fail because they shrink, stretch or tilt the original argument.\n\nThis guide uses **Auctor-created illustrative examples**, not official CAT questions. Use them to learn the method, then validate the method on genuine CAT previous-year questions.\n\n## The three-part summary test\n\n| Test | Ask | Reject an option when |\n|---|---|---|\n| Coverage | Does it include the paragraph's governing idea? | It captures only an example or one half of a contrast. |\n| Scope | Is it no broader or narrower than the paragraph? | It adds a population, cause or consequence the paragraph never established. |\n| Stance | Does it preserve the author's level of certainty? | It turns may into must, criticism into rejection, or observation into advocacy. |\n\nApply the tests in that order. Coverage quickly removes fragments. Scope removes attractive overreach. Stance usually separates the final two options. This same evidence discipline also matters when you [practise CAT RC accuracy](/features/precision-drills).\n\n## Auctor-created worked example\n\n**Paragraph:** Remote work can widen access to jobs for people outside major cities. Yet access alone does not erase inequality: reliable internet, quiet workspace and managerial trust remain unevenly distributed. Companies that treat location flexibility as a complete inclusion policy may therefore preserve the barriers they intended to remove.\n\n**Option A:** Remote work eliminates geographic and economic inequality in employment.\n\n**Option B:** Although remote work can expand job access, it does not ensure inclusion unless other unequal working conditions are addressed.\n\n**Option C:** Companies should require every employee to work remotely to improve inclusion.\n\n**Option D:** Internet access is the only remaining barrier to equitable employment.\n\n**Answer: B.** It keeps both halves of the argument: expanded access and the limits created by unequal conditions. A overstates the benefit, C invents a recommendation, and D narrows several barriers to one.\n\n## The five traps behind wrong options\n\n1. **Example trap:** repeats a vivid illustration but drops the main claim.\n2. **Half-summary trap:** preserves one side of a contrast and ignores the qualification.\n3. **Overreach trap:** adds a cause, solution or prediction not established in the paragraph.\n4. **Tone shift:** converts a measured observation into praise, alarm or condemnation.\n5. **Keyword mirror:** reuses the paragraph's language while changing the relationship between ideas.\n\nThese traps overlap with the option errors discussed in [why RC accuracy gets stuck](/blog/improve-rc-accuracy-cat). The difference is that para summary compresses the entire decision into one paragraph-level claim.\n\n## A 60-second solving workflow\n\n### 1. State the paragraph's job\n\nBefore reading the options, complete this sentence: “The paragraph argues that…” If you can only name the topic, read again for the relationship between ideas.\n\n### 2. Mark the turn\n\nWords such as *but*, *yet*, *however*, *therefore* and *although* often reveal which claim controls the paragraph. Do not automatically treat the last sentence as the summary; identify what logical work it performs.\n\n### 3. Eliminate by named failure\n\nDo not say an option “feels incomplete.” Name the failure: too narrow, too broad, unsupported conclusion, wrong stance or missing contrast. A named rejection can be reviewed and improved.\n\n### 4. Compare the final two against the paragraph\n\nThe better option is not the prettier sentence. It is the one that loses the least essential meaning while adding nothing.\n\n## Mini exercise\n\n**Auctor-created paragraph:** Public rankings can make institutions more transparent, but they also encourage institutions to optimise what the ranking measures. When indicators become targets, performance may improve on paper without the underlying educational experience improving at the same rate.\n\nWrite a one-sentence summary before revealing the model below. Check whether your sentence retains both transparency and the risk of metric-driven distortion.\n\n<details><summary>Model summary</summary><p>Rankings may increase transparency, yet they can distort institutional priorities when measured indicators become targets rather than reflections of educational quality.</p></details>\n\n## How to practise without memorising tricks\n\nBuild a small error log with four columns: your predicted main claim, the option selected, the exact trap, and the phrase in the paragraph that disproves your choice. Review the log after five sets. If the same trap repeats, use targeted practice before taking another full sectional.\n\nPair this method with [daily structured VARC practice](/features/daily-rc-workout), and use a [CAT VARC test](/test-series) to check whether the method survives time pressure.\n\n## Final checklist\n\n- Can I express the central claim before viewing options?\n- Did I preserve every essential contrast?\n- Is the option at the same scope as the paragraph?\n- Did it strengthen or weaken the author's certainty?\n- Can I name why each rejected option fails?\n\nA good summary is faithful compression. It covers the paragraph's argument, respects its boundaries and keeps its stance intact.`;
  const data = {
    title: brief.title,
    description: "Learn a reliable CAT para summary method using scope, coverage and stance checks, with Auctor-created worked examples and a practical error log.",
    date,
    updatedDate: date,
    image: "/blog/cat-para-summary-framework.png",
    imageAlt: "CAT para summary method showing coverage, scope and author stance checks",
    category: "Verbal Ability",
    author: "Auctor Labs Editorial Team",
    status: "draft",
    primaryKeyword: brief.primaryKeyword,
    secondaryKeywords: brief.secondaryKeywords,
    searchIntent: brief.searchIntent,
    cluster: brief.cluster,
    targetPage: brief.targetPage,
    relatedArticles: ["improve-rc-accuracy-cat", "unlocking-success-mastering-reading-comprehension-for-cat-with-proven-strategies"],
    externalReferences: [],
    schemaType: "BlogPosting",
    refreshDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
    backlinkOpportunities: backlinks("para-summary"),
  };
  const quality = scoreQuality(data, content); const seo = scoreSeo(data, content);
  data.seoScore = seo; data.contentQualityScore = quality.total;
  data.qualityDimensions = quality.dimensions;
  data.publishEligible = quality.total >= strategy.minimumQualityScore;
  const filePath = path.join(DRAFT_DIR, `${slugify(brief.slug, { lower: true, strict: true })}.mdx`);
  fs.writeFileSync(filePath, matter.stringify(content, data));
  return { filePath, quality: quality.total, seo, threshold: strategy.minimumQualityScore, publishEligible: data.publishEligible, closestExisting: collision };
}

const command = process.argv[2] || "audit";
if (command === "registry") console.log(JSON.stringify({ posts: registry().length, output: REGISTRY_PATH }, null, 2));
else if (command === "audit") console.log(JSON.stringify(audit().summary, null, 2));
else if (command === "sample") console.log(JSON.stringify(sampleDraft(), null, 2));
else if (command === "discover") console.log(JSON.stringify(await discover(), null, 2));
else if (command === "check") { const posts = registry(); const report = audit(); const failing = posts.filter((post) => !post.title || !post.description || !post.publicationDate || !post.image); const warnings = posts.filter((post) => !post.imageAlt || !post.primaryKeyword || !post.searchIntent).map((post) => post.slug); console.log(JSON.stringify({ posts: posts.length, failing: failing.map((post) => post.slug), migrationWarnings: warnings, overlaps: report.summary.overlaps }, null, 2)); if (failing.length) process.exitCode = 1; }
else throw new Error(`Unknown command: ${command}`);
