import assert from "node:assert/strict";
import test from "node:test";
import {
  parseArticleReferences,
  parseImageSources,
  validateArticle,
  validateInternalLinks,
  sanitizePublicCopy,
  validateImagePrompt,
  isRelevantTopic,
  topicRelevanceDecision,
  completeInlineImagePlan,
} from "./blog-engine.mjs";

const existingArticle = "/blog/accuracy-in-rc-ignoring-context-could-ruin-your-score";

test("a Markdown image is parsed as an image, not an article hyperlink", () => {
  const content = "![A passage map](/blog/cat-varc-passages-inline-passage-map.png)";
  const references = parseArticleReferences(content);

  assert.deepEqual(references.hyperlinks, []);
  assert.deepEqual(parseImageSources(content), [
    "/blog/cat-varc-passages-inline-passage-map.png",
  ]);
  assert.deepEqual(validateInternalLinks(content), []);
});

test("a valid existing internal article link continues to be validated", () => {
  const content = `[CAT VARC](${existingArticle})`;

  assert.deepEqual(parseArticleReferences(content).hyperlinks, [existingArticle]);
  assert.deepEqual(validateInternalLinks(content), []);
});

test("an internal article-link candidate is not mistaken for an image", () => {
  const content = "[CAT VARC](/blog/cat-varc)";
  const references = parseArticleReferences(content);

  assert.deepEqual(references.hyperlinks, ["/blog/cat-varc"]);
  assert.deepEqual(references.images, []);
});

test("a broken internal article link is still rejected", () => {
  const content = "[Broken](/blog/non-existent-article)";

  assert.deepEqual(validateInternalLinks(content), [
    "/blog/non-existent-article",
  ]);
});

test("multiple inline images stay separate from internal links", () => {
  const content = [
    "![Passage map](/blog/cat-varc-passages-inline-passage-map.png)",
    `[Read the CAT VARC guide](${existingArticle})`,
    "![RC error log](/blog/cat-varc-passages-inline-rc-error-log.png)",
  ].join("\n\n");

  const references = parseArticleReferences(content);
  assert.deepEqual(references.hyperlinks, [existingArticle]);
  assert.deepEqual(
    references.images.map((reference) => reference.src),
    [
      "/blog/cat-varc-passages-inline-passage-map.png",
      "/blog/cat-varc-passages-inline-rc-error-log.png",
    ],
  );
  assert.deepEqual(validateInternalLinks(content), []);
});

test("image paths containing article-like topic words are never article links", () => {
  const content = [
    "![CAT VARC passage](/blog/cat-varc-rc-passage-map.png)",
    '<img src="/blog/rc-passage-inline-example.png" alt="RC passage" />',
    '<Image src="/blog/cat-varc-inline-passage.png" alt="Passage" />',
  ].join("\n");

  assert.deepEqual(parseArticleReferences(content).hyperlinks, []);
  assert.deepEqual(validateInternalLinks(content), []);
  assert.deepEqual(parseImageSources(content), [
    "/blog/cat-varc-rc-passage-map.png",
    "/blog/rc-passage-inline-example.png",
    "/blog/cat-varc-inline-passage.png",
  ]);
});

test("generated inline-image MDX markers preserve image classification", () => {
  const content = [
    "{/* inline-image:passage-map */}",
    "![A structured passage map](/blog/cat-varc-passages-inline-passage-map.png)",
    "{/* /inline-image:passage-map */}",
  ].join("\n");

  assert.deepEqual(parseArticleReferences(content).hyperlinks, []);
  assert.deepEqual(parseImageSources(content), [
    "/blog/cat-varc-passages-inline-passage-map.png",
  ]);
  assert.deepEqual(validateInternalLinks(content), []);
});

test("internal editorial notes and lesson-plan sections fail editorial checks", () => {
  const content = [
    "## Daily routine",
    "Human review required before this AI-generated article is published.",
    "## 1. Homework",
    "Write 2 sentences and record yourself.",
    "## 2. Final checklist",
  ].join("\n\n");
  const result = validateArticle(
    { primaryKeyword: "vocabulary strategy", searchIntent: "Strategy", topic: "Vocabulary strategy", articleType: "Strategy" },
    { title: "A Better Vocabulary Strategy for Competitive Exams", description: "A sufficiently descriptive editorial summary about vocabulary strategy for competitive examinations and why contextual learning improves retention over memorised lists.", content, claims: [] },
  );

  assert.ok(result.editorialIssues.some((issue) => issue.includes("Internal AI/editorial")));
  assert.ok(result.editorialIssues.some((issue) => issue.includes("Lesson-plan")));
});

test("public-copy sanitization removes internal review language", () => {
  assert.equal(sanitizePublicCopy("Public opening.\n\nHuman review required.\n\nPublic ending."), "Public opening.\n\nPublic ending.");
});

test("image prompt validation permits a relevant diagram brief", () => {
  assert.doesNotThrow(() => validateImagePrompt("Create a labeled diagram with a word list."));
  assert.doesNotThrow(() => validateImagePrompt("Premium photorealistic editorial photograph of a learner weighing two interpretations, no text or diagrams."));
});

test("image planner preserves a supporting visual and supplies two human slots", () => {
  const sections=[{id:"one",heading:"One"},{id:"two",heading:"Two"},{id:"three",heading:"Three"}];
  const support={id:"diagram",role:"supporting_visual",placement:"three",prompt:"Relevant diagram"};
  const plan=completeInlineImagePlan([support],sections);
  assert.equal(plan.filter(image=>image.role==="human").length,2);
  assert.equal(plan.filter(image=>image.role==="supporting_visual").length,1);
  assert.equal(plan.find(image=>image.id==="diagram").prompt,"Relevant diagram");
});

test("image prompt validation still requires an approved visual brief", () => {
  assert.throws(() => validateImagePrompt(""), /visual brief is empty/);
});

test("generator relevance accepts the researched CAT VARC topic", () => {
  assert.equal(isRelevantTopic({ topic: "CAT VARC Preparation" }), true);
  assert.equal(topicRelevanceDecision({ topic: "CAT VARC Preparation" }, { manualResearch: true }).allowed, true);
});

test("manual research warns but does not block a low-relevance topic", () => {
  const decision = topicRelevanceDecision({ topic: "homemade pasta recipes" }, { manualResearch: true });
  assert.equal(decision.relevant, false);
  assert.equal(decision.allowed, true);
  assert.match(decision.warning, /editorial confirmation/i);
});

test("automatic suggestions still respect the relevance filter", () => {
  const decision = topicRelevanceDecision({ topic: "homemade pasta recipes" });
  assert.equal(decision.relevant, false);
  assert.equal(decision.allowed, false);
  assert.equal(decision.warning, null);
});

test("generator relevance still rejects clearly unrelated topics", () => {
  assert.equal(isRelevantTopic({ topic: "cryptocurrency trading strategy" }), false);
  assert.equal(isRelevantTopic({ topic: "homemade pasta recipes" }), false);
});
