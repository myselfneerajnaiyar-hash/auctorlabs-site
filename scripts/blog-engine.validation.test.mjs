import assert from "node:assert/strict";
import test from "node:test";
import {
  parseArticleReferences,
  parseImageSources,
  validateInternalLinks,
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
