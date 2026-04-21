import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import OpenAI from "openai";
import fs from "fs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🔥 FEATURED IMAGE PROMPTS (VARIETY)
const FEATURED_PROMPTS = [
  "Indian student preparing for CAT exam, reading RC passage at desk, focused expression, clean modern room",
  "Indian female student studying with notebook and book, natural light from window, minimal setup",
  "top view of study desk with open book, notes, pen, laptop, aesthetic clean workspace",
  "Indian student deeply focused reading difficult passage, serious face, shallow depth of field",
  "minimal desk setup with books and coffee, productivity vibe, no human",
];

// 🔥 CONCEPT / VISUAL THINKING IMAGES
const CONCEPT_PROMPTS = [
  "visual representation of decision making, arrows branching, minimal dark theme",
  "split screen showing correct vs incorrect answer selection, conceptual visualization",
  "multiple choice elimination process, options fading out one by one",
  "comparison of fast reading vs deep understanding, visual contrast",
  "logical reasoning steps visualized as flow arrows, clean minimal design"
];

// 🔥 PAIN / STUDENT IMAGES (RELATABLE)
const PAIN_PROMPTS = [
  "Indian student confused while solving RC question, holding head, exam stress",
  "student stuck between two answer choices, thinking intensely",
  "Indian student stressed during exam, clock visible, tension environment",
  "student frustrated after wrong answer, notebook open",
  "late night studying, tired Indian student under desk lamp"
];

// 🔥 COMMON IMAGE GENERATOR
async function generateImage(prompt, filename) {
  const enhancedPrompt = `
${prompt}

STYLE:
ultra-realistic DSLR photography, 50mm lens, shallow depth of field,
natural skin tones, Indian students, modern environment, clean composition

LIGHTING:
soft natural light, cinematic but subtle, no harsh shadows

COMPOSITION:
center subject, minimal background clutter, professional framing

NEGATIVE:
blurry, distorted face, extra fingers, bad anatomy, cartoon, illustration,
cgi, 3d render, unrealistic lighting, oversaturated, watermark, text,
logo, duplicate people, low quality, grainy
`;

  const res = await client.images.generate({
    model: "gpt-image-1",
    prompt: enhancedPrompt,
    size: "1024x1024",
  });

  const b64 = res.data[0].b64_json;

  fs.writeFileSync(`public/blog/${filename}`, Buffer.from(b64, "base64"));

  console.log("✅ Created:", filename);
}

// 🔥 MAIN FUNCTION
async function run() {

  let counter = 1;

  // ✅ 10 FEATURED IMAGES
  for (let i = 0; i < 10; i++) {
    const prompt = FEATURED_PROMPTS[i % FEATURED_PROMPTS.length];
    await generateImage(prompt, `IM-${counter}.png`);
    counter++;
  }

  // ✅ 10 CONCEPT IMAGES
  for (let i = 0; i < 10; i++) {
    const prompt = CONCEPT_PROMPTS[i % CONCEPT_PROMPTS.length];
    await generateImage(prompt, `IM-${counter}.png`);
    counter++;
  }

  // ✅ 10 PAIN IMAGES
  for (let i = 0; i < 10; i++) {
    const prompt = PAIN_PROMPTS[i % PAIN_PROMPTS.length];
    await generateImage(prompt, `IM-${counter}.png`);
    counter++;
  }

  console.log("🎉 DONE: 30 images created");
}

run();