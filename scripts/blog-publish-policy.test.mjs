import assert from "node:assert/strict";
import test from "node:test";
import { publicationPersistenceError, publicationTechnicalBlockers, sanitizeCmsPublicCopy } from "../lib/blog-publish-policy.ts";

const row = (overrides = {}) => ({
  slug: "test-draft", title: "A useful editorial title", description: "A useful description", content: "## Insight\n\nSubstantive public copy.",
  frontmatter: { date: "2026-08-25", author: "Auctor Labs Editorial Team", seoScore: 20, contentQualityScore: 20, inlineImages: [] },
  ...overrides,
});

test("SEO and quality warnings never become technical blockers", () => assert.deepEqual(publicationTechnicalBlockers(row()), []));
test("a failed optional image never blocks publication", () => assert.deepEqual(publicationTechnicalBlockers(row({ frontmatter: { ...row().frontmatter, inlineImages: [{ id: "optional", status: "failed", src: "" }] } }), [{ id: "asset-1", image_key: "optional", asset_type: "inline", status: "failed", public_url: null }]), []));
test("an unreferenced failed asset never blocks publication", () => assert.deepEqual(publicationTechnicalBlockers(row(), [{ id: "asset-2", image_key: "old", asset_type: "inline", status: "failed", public_url: null }]), []));
test("a failed referenced asset is an actionable technical blocker", () => { const draft=row({ content: "## Insight\n\n{/* inline-image:required */}" ,frontmatter:{...row().frontmatter,inlineImages:[{id:"required",status:"failed",src:"/missing.png"}]}});assert.match(publicationTechnicalBlockers(draft,[{id:"asset-3",image_key:"required",asset_type:"inline",status:"failed",public_url:null}])[0],/required \(asset-3; failed\)/); });
test("missing required data is actionable", () => assert.match(publicationTechnicalBlockers(row({ title: "" }))[0], /title/));
test("internal production notes cannot leak into public copy", () => { const clean=sanitizeCmsPublicCopy("Public opening.\n\nHuman review required before publication.\n\nPublic ending.");assert.equal(clean,"Public opening.\n\nPublic ending."); });
test("a Supabase persistence failure returns an actionable technical error", () => assert.match(publicationPersistenceError(new Error("write failed")), /could not be saved to Supabase: write failed/));
