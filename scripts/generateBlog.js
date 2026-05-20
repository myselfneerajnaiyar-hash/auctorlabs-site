import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import fs from "fs";
import axios from "axios";
import slugify from "slugify";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CATEGORY_RULES = [
  { name: "Inference", match: ["inference", "assumption", "conclusion"] },
  { name: "Tone", match: ["tone", "attitude", "author tone"] },
  { name: "Accuracy", match: ["accuracy", "mistake", "error", "wrong"] },
  { name: "Elimination", match: ["eliminate", "option", "trap"] },
  { name: "Speed", match: ["speed", "fast", "time", "quick"] },
  { name: "Strategy", match: [] }, // fallback
];

const ALL_CATEGORIES = CATEGORY_RULES.map(c => c.name);

function detectCategory(keyword) {
  const text = keyword.toLowerCase();

  for (const rule of CATEGORY_RULES) {
    if (rule.match.some(word => text.includes(word))) {
      return rule.name;
    }
  }

  return "Strategy";
}

async function generateImages(topic, slug, category, index) {
  try {
    // 🔥 STYLE VARIATION (this fixes same-looking images)
    const STYLES = [
      "minimal dark",
      "bright editorial",
      "warm indoor",
      "moody cinematic",
      "soft natural light"
    ];

    const style = STYLES[index % STYLES.length];

    // 🔥 RANDOM SCENE VARIATION
    const SCENES = [
      "Indian student studying at desk",
      "student reading in library",
      "late night study setup",
      "minimal desk with books and notes",
      "focused student analyzing passage"
    ];

    const scene = SCENES[Math.floor(Math.random() * SCENES.length)];

    // 🔥 FEATURED IMAGE (VARIED + INDIAN)
   const FEATURED_STYLES = [

  // 1️⃣ REAL STUDENT (INDIAN + RELATABLE)
  `
Indian student studying at desk,
reading comprehension practice,
natural light, realistic photography,
clean background, calm focus
`,

  // 2️⃣ LIBRARY / SERIOUS PREP
  `
Indian student in library,
books and notes around,
deep focus reading passage,
warm indoor lighting, cinematic
`,

  // 3️⃣ MINIMAL DESK (PREMIUM LOOK)
  `
minimal desk setup,
open book, laptop, notes,
no human or subtle human presence,
clean aesthetic, soft lighting
`,

  // 4️⃣ ABSTRACT / CONCEPTUAL (HIGH VARIETY)
  `
abstract concept of understanding text,
blurred words becoming clear,
focus and clarity metaphor,
modern minimal design
`,

  // 5️⃣ CLOSE-UP INTENSE THINKING
  `
close-up of student eyes reading text,
deep concentration,
low depth of field,
dramatic but clean lighting
`
];

const featuredPrompt =
  FEATURED_STYLES[Math.floor(Math.random() * FEATURED_STYLES.length)];
    // 🔥 CONCEPT IMAGE (BASED ON CATEGORY)
    let conceptTopic = "reading comprehension strategy";

    if (category === "Inference") conceptTopic = "inference reasoning from text";
    if (category === "Tone") conceptTopic = "author tone detection positive negative neutral";
    if (category === "Accuracy") conceptTopic = "common mistakes in reading comprehension";
    if (category === "Elimination") conceptTopic = "elimination technique multiple choice";
    if (category === "Speed") conceptTopic = "fast reading and time pressure";

   const CONCEPT_STYLES = [
  "split screen contrast",
  "before vs after",
  "decision flow",
  "mental model diagram",
  "cause vs effect"
];

const conceptStyle = CONCEPT_STYLES[index % CONCEPT_STYLES.length];

let conceptVisual = "";

if (category === "Inference") {
  conceptVisual = "sentences connected with arrows leading to a hidden conclusion, logical jumps, meaning emerging from clues";
}

else if (category === "Tone") {
  conceptVisual = "same text interpreted in positive, negative and neutral tone, emotional contrast, subtle differences";
}

else if (category === "Accuracy") {
  conceptVisual = "correct vs incorrect interpretation, one side clear thinking, other side confusion, decision error contrast";
}

else if (category === "Elimination") {
  conceptVisual = "multiple answer choices, wrong options faded or crossed, one correct option highlighted, filtering process";
}

else if (category === "Speed") {
  conceptVisual = "fast vs slow reading, clock pressure, scanning vs deep reading contrast, time vs understanding";
}

else {
  conceptVisual = "step by step structured reading process, organized thinking, clear flow from reading to answering";
}

const conceptPrompt = `
${conceptStyle},
${conceptVisual},
minimal composition,
dark or high contrast background,
realistic (NOT illustration),
no text, no labels,
clean, modern, visually explanatory,
NOT stock photo
`;

    // 🔥 ANNOTATED IMAGE (MOST IMPORTANT)
  const PAIN_SCENES = [
  "student confused while reading a dense passage",
  "student stuck between two similar answer choices",
  "exam pressure with clock running out on desk",
  "student realizing mistake after answering",
  "mental fatigue while solving reading comprehension",
  "frustration after getting answer wrong",
  "student overthinking simple question"
];

const painScene = PAIN_SCENES[Math.floor(Math.random() * PAIN_SCENES.length)];

let categoryEmotion = "";

if (category === "Inference") {
  categoryEmotion = "missing hidden meaning despite reading carefully";
}

else if (category === "Tone") {
  categoryEmotion = "misjudging author attitude and feeling unsure";
}

else if (category === "Accuracy") {
  categoryEmotion = "feeling confident but choosing wrong answer";
}

else if (category === "Elimination") {
  categoryEmotion = "unable to eliminate trap options";
}

else if (category === "Speed") {
  categoryEmotion = "rushing due to time pressure and losing understanding";
}

else {
  categoryEmotion = "reading without clear strategy and feeling lost";
}

const annotatedPrompt = `
${painScene},
${categoryEmotion},
Indian student, exam setup,
desk, paper, book, subtle stress,
cinematic lighting, shallow depth of field,
ultra realistic (NOT illustration),
natural expression,
no text, no arrows, no annotations,
emotionally relatable, not stock
`;

    async function generateOne(prompt, path) {
     const res = await client.images.generate({
  model: "gpt-image-1",
  prompt: `${prompt}
ultra realistic, cinematic lighting, sharp focus,
depth of field, professional photography,
no text, no watermark, no blur, no cartoon`,
  size: "1024x1024",
});

      const b64 = res.data[0].b64_json;
      fs.writeFileSync(path, Buffer.from(b64, "base64"));
    }

    const featuredPath = `public/blog/${slug}-featured.png`;
    const inside1Path = `public/blog/${slug}-1.png`;
    const inside2Path = `public/blog/${slug}-2.png`;

    await generateOne(featuredPrompt, featuredPath);
    await generateOne(conceptPrompt, inside1Path);
    await generateOne(annotatedPrompt, inside2Path);

    return {
      featured: `/blog/${slug}-featured.png`,
      inside1: `/blog/${slug}-1.png`,
      inside2: `/blog/${slug}-2.png`,
    };

  } catch (err) {
    console.log("❌ Image failed:", err.message);

    return {
      featured: "/blog/rc2.png",
      inside1: "/blog/rc2.png",
      inside2: "/blog/rc2.png",
    };
  }
}
// 🔥 GET TRENDING KEYWORDS (FIXED)
async function getTrendingKeywords() {
  try {
    const baseQueries = [
      "reading comprehension CAT",
      "RC accuracy CAT",
      "inference questions CAT",
      "RC mistakes CAT",
      "how to improve RC CAT",
    ];

    let allKeywords = [];

    console.log("SERP KEY:", process.env.SERP_API_KEY);

    for (const query of baseQueries) {
     const res = await axios.get("https://serpapi.com/search.json", {
  params: {
    engine: "google",
    q: query,
    google_domain: "google.co.in",
    hl: "en",
    gl: "in",
    api_key: process.env.SERP_API_KEY,
  },
});

      let keywords = [];

// 1. Related searches
if (res.data.related_searches) {
  keywords.push(...res.data.related_searches.map(r => r.query));
}

// 2. Organic results titles (VERY IMPORTANT)
if (res.data.organic_results) {
  keywords.push(...res.data.organic_results.map(r => r.title));
}

// 3. People also ask (GOLD)
if (res.data.related_questions) {
  keywords.push(...res.data.related_questions.map(q => q.question));
}

allKeywords.push(...keywords);
    }

    const uniqueKeywords = [...new Set(allKeywords)];

    // 🔥 CLEAN FILTER (FIXED)
 const filtered = uniqueKeywords.filter((k) => {
  const text = k.toLowerCase();

  return (
    // ✅ must be RC related
    (
      text.includes("reading comprehension") ||
      text.includes("rc") ||
      text.includes("inference") ||
      text.includes("passage")
    ) &&

    // ❌ remove junk intent
    !text.includes("pdf") &&
    !text.includes("download") &&
    !text.includes("free") &&
    !text.includes("book") &&
    !text.includes("reddit") &&
    !text.includes("youtube") &&
    !text.includes("quora") &&

    // ❌ remove practice / low-value
    !text.includes("question") &&
    !text.includes("questions") &&
    !text.includes("mcq") &&
    !text.includes("test") &&
    !text.includes("exercise") &&
    !text.includes("worksheet") &&

    // ❌ remove beginner / definition
    !text.startsWith("what is") &&
    !text.includes("meaning") &&

    // ❌ remove resource intent
    !text.includes("books") &&
    !text.includes("sources") &&
    !text.includes("material") &&
    !text.includes("pdf") &&

    // ❌ remove numbers (EXERCISE 4 type junk)
    !/\d/.test(text)
  );
});

if (filtered.length === 0) {
  console.log("⚠️ No filtered keywords, using base queries");
  return baseQueries;
}

    console.log("🔥 Filtered Keywords:", filtered);

    return filtered.slice(0, 5);
  } catch (err) {
    console.log("❌ SerpAPI ERROR:");
    console.log(err.response?.data || err.message);

    return [
      "RC accuracy improvement CAT",
      "inference questions RC CAT",
      "RC strategy CAT exam",
      "common RC mistakes CAT",
      "how to read RC passages faster",
    ];
  }
}

// 🔥 KEYWORD → TITLE
const TITLE_STYLES = [
  "question",
  "contrarian",
  "insight",
  "mistake",
  "outcome",
  "reality"
];

async function generateTopic(keyword, category) {
  const style = TITLE_STYLES[Math.floor(Math.random() * TITLE_STYLES.length)];

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
Convert this keyword into a ${style}-style blog title for CAT aspirants.

Keyword: "${keyword}"
Category: "${category}"

Rules:
- Maximum 12 words
- Must feel like a sharp insight (not blog title)
- No generic phrases
- No filler words like "key", "ultimate", "guide"
- Make it slightly uncomfortable / thought-provoking

Examples:
- "You Read the Passage — But You Miss the Inference"
- "Your RC Accuracy Drops Right After You Feel Confident"
- "You Think You Understand Tone — You Don’t"
- "The Option Feels Right — That’s Why It’s Wrong"

Return ONLY the title.
`,
      },
    ],
  });

  return res.choices[0].message.content.trim();
}

function blogExists(slug) {
  return fs.existsSync(`content/blog/${slug}.mdx`);
}


// 🔥 GENERATE BLOG

const usedTitles = new Set();
async function generateBlog(keyword, forcedCategory = null) {
  console.log("👉 Raw keyword:", keyword);

  const category = forcedCategory || detectCategory(keyword);
console.log("📂 Category:", category);

  
 

  

  // 🚫 Prevent duplicate ideas
let attempts = 0;
let topic;

while (attempts < 3) {
  topic = await generateTopic(keyword, category);

  if (!usedTitles.has(topic.toLowerCase())) {
    usedTitles.add(topic.toLowerCase());
    break;
  }

  console.log("⚠️ Duplicate detected, regenerating...");
  attempts++;
}

if (attempts === 3) {
  console.log("❌ Failed to generate unique topic");
  return;
}

console.log("✨ Final topic:", topic);

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
You are writing a premium blog for CAT aspirants for Auctor RC.

--------------------------------
STRUCTURE (STRICT)
--------------------------------

## <Insight heading>

2–3 short paragraphs (emotional hook)

![Thinking](/blog/rc2.png)

---

## What You Think You Are Doing

---

## What You Should Be Doing Instead

- Max 3 bullets

---

## Where the Mistake Actually Happens

![Decision making](/blog/image2.png)

---

## The Discipline You Need

---

## The Role of Elimination

---

## Final Thought

---

--------------------------------
STYLE
--------------------------------

- Mentor tone
- No fluff
- Short paragraphs
- Deep insight
- No generic blog language

--------------------------------
TOPIC
--------------------------------

TOPIC: ${topic}
CATEGORY: ${category}

IMPORTANT:
- The blog MUST strongly focus on this category

Category meanings:
- Accuracy → focus on mistakes, wrong decisions
- Inference → hidden meaning, logical jumps
- Tone → author's intent, attitude
- Elimination → option rejection logic
- Speed → reading efficiency, time pressure
- Strategy → overall approach

Return ONLY markdown.
`,
      },
    ],
  });

  function cleanUrls(text) {
  return text.replace(
    /https?:\/\/[^\s)]+/g,
    (url) => {
      try {
        const u = new URL(url);

        // remove all utm params
        [...u.searchParams.keys()].forEach((key) => {
          if (key.startsWith("utm_")) {
            u.searchParams.delete(key);
          }
        });

        return u.origin + u.pathname;
      } catch {
        return url.split("?")[0];
      }
    }
  );
}

let content = cleanUrls(
  res.choices[0].message.content
);

  const slug = slugify(topic, { lower: true, strict: true });
  const images = await generateImages(topic, slug, category, Math.floor(Math.random() * 100));
  // 🔥 Inject images into blog content
content = content
  .replace(/\/blog\/rc2\.png/g, images.inside1)
  .replace(/\/blog\/image2\.png/g, images.inside2);
  const filePath = `content/blog/${slug}.mdx`;

 if (blogExists(slug)) {
    console.log("⚠️ Already exists:", slug);
    return;
  }

 const clean = (text) => text.replace(/^"+|"+$/g, "");

const mdx = `---
title: "${clean(topic)}"
description: "${clean(topic)}"
date: "${new Date().toISOString().split("T")[0]}"
image: "${images.featured}"
category: "${category}"
---

${content}
`;

  fs.writeFileSync(filePath, mdx);

  console.log("✅ Blog created:", slug);
}

// 🔥 MAIN
async function run() {
  const keywords = await getTrendingKeywords();

  console.log("🔥 Final Topics List:", keywords);

  for (let i = 0; i < keywords.length; i++) {
  const keyword = keywords[i];

  const forcedCategory = ALL_CATEGORIES[i % ALL_CATEGORIES.length];

  await generateBlog(keyword, forcedCategory);
}

  console.log("🎉 DONE");
}

run();