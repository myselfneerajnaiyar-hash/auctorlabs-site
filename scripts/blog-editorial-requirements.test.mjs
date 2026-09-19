import assert from "node:assert/strict";
import test from "node:test";
import { editorialRequirements } from "../lib/blog-editorial-requirements.mjs";
import { publicationTechnicalBlockers } from "../lib/blog-publish-policy.ts";
import { insertInlineImageAtSection, removeInlineImageFromMdx } from "./blog-engine.mjs";

const make = (images = [], links = "") => {
  const content = `## Insight\n\nA useful paragraph ${links}.\n\n${images.filter(image => image.status === "generated").map(image => `{/* inline-image:${image.id} */}\n\n![${image.id}](${image.src})`).join("\n\n")}`;
  return { slug: "current", title: "Current article", description: "Useful description", content, frontmatter: { date: "2026-09-19", author: "Auctor Labs", inlineImages: images } };
};
const human = id => ({ id, role: "human", status: "generated", src: `https://cdn.test/${id}.png` });
const supporting = id => ({ id, role: "supporting_visual", status: "generated", src: `https://cdn.test/${id}.png` });
const assets = images => images.map(image => ({ image_key: image.id, asset_type: "inline", status: "generated", public_url: image.src }));
const valid = ["/blog/published", "/test-series"];

test("publish readiness counts only accepted human images: 0/2, 1/2, 2/2", () => {
  for (const count of [0, 1, 2]) {
    const images = [human("one"), human("two")].slice(0, count);
    const state = editorialRequirements(make(images, "[related article](/blog/published)"), assets(images), valid);
    assert.equal(state.humanImages, count);
    assert.equal(state.humanReady, count === 2);
  }
});

test("discarded and merely proposed images are not inserted or counted", () => {
  const images = [human("kept"), { ...human("discarded"), status: "removed" }, { ...human("proposed"), status: "proposed" }];
  const row = make(images);
  assert.equal(editorialRequirements(row, assets(images), valid).humanImages, 1);
  assert.ok(!row.content.includes("inline-image:discarded"));
  assert.ok(!row.content.includes("inline-image:proposed"));
});

test("supporting visuals count separately and are recommended, not required", () => {
  const images = [human("one"), human("two"), supporting("diagram")];
  const state = editorialRequirements(make(images, "[related](/blog/published)"), assets(images), valid);
  assert.equal(state.humanImages, 2);
  assert.equal(state.supportingVisuals, 1);
  assert.equal(state.linksReady, true);
});

test("only a real, different published destination in final content satisfies linking", () => {
  const images = [human("one"), human("two")];
  for (const link of ["", "[self](/blog/current)", "[draft](/blog/unpublished)"]) {
    const row = make(images, link), state = editorialRequirements(row, assets(images), valid);
    assert.equal(state.linksReady, false);
    assert.ok(publicationTechnicalBlockers(row, assets(images), { validInternalUrls: valid }).some(issue => issue.includes("contextual link")));
  }
  const row = make(images, "[related](/blog/published)");
  assert.equal(editorialRequirements(row, assets(images), valid).linksReady, true);
});

test("accepting and discarding one image preserve article prose and existing images", () => {
  const original="## Insight\n\nThe article text stays intact.\n\n{/* inline-image:old */}\n\n![Old](https://cdn.test/old.png)\n\n## Another section\n\nMore unchanged prose.";
  const proposed={id:"new",placement:"another-section",alt:"New",src:"https://cdn.test/new.png"};
  const accepted=insertInlineImageAtSection(original,proposed);
  assert.equal(accepted.resolved,true);
  assert.ok(accepted.content.includes("inline-image:old"));
  assert.ok(accepted.content.includes("inline-image:new"));
  const discarded=removeInlineImageFromMdx(accepted.content,"new");
  assert.ok(!discarded.includes("inline-image:new"));
  assert.ok(discarded.includes("The article text stays intact."));
  assert.ok(discarded.includes("More unchanged prose."));
  assert.ok(discarded.includes("inline-image:old"));
});
