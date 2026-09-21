import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { cms, fixture } from "./helpers/blog-studio-harness.mjs";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: BlogStudio } = await import("../app/admin/blog/studio.tsx");
const { getCmsDraft, saveCmsDraft, publishCmsDraft } = await import("../lib/blog-cms-actions.ts");
const { acceptCmsInlineImage } = await import("../lib/blog-cms-images.ts");
const admin = { id: "test-admin", role: "owner" };
let root, calls, scrolls, pendingDraft, withoutWarnings;
const originalFetch = globalThis.fetch;
dom.window.HTMLElement.prototype.scrollIntoView = function(options) {
  assert.ok(this.isConnected, "scroll target must already be committed to the DOM");
  scrolls.push({ element: this, options });
};
function button(label) {
  const found = [...document.querySelectorAll("button")].find(el => el.textContent === label);
  assert.ok(found, `Missing button: ${label}`);
  return found;
}
async function click(label) { await act(async () => button(label).click()); }
async function setup(options) {
  fixture(options); calls = []; scrolls = []; pendingDraft = null; withoutWarnings = false;
  globalThis.confirm = () => true;
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url, ...init });
    let body;
    if (url === "/api/admin/blog") body = { posts: [{ slug: "current", title: cms.row.title, status: "draft", seoScore: 20 }], topics: [], categories: [], qualityThreshold: 80 };
    else if (url === "/api/admin/blog/search-performance") body = { status: "UNAVAILABLE" };
    else if (url === "/api/admin/blog/draft/current") {
      if (pendingDraft) await pendingDraft;
      body = init.method === "PUT" ? await saveCmsDraft(admin, "current", JSON.parse(init.body)) : await getCmsDraft("current");
      body.internalLinkRecommendations = [{ targetArticle: "Published", url: "/blog/published", anchor: "related reading" }];
      if (withoutWarnings) { body.data.publishWarnings = []; body.data.publishEligibilityIssues = body.data.publishEligibilityIssues.filter(i => i.severity === "blocker"); }
    } else if (url === "/api/admin/blog/images") body = await acceptCmsInlineImage(admin, "current", JSON.parse(init.body).id);
    else if (url === "/api/admin/blog/publish") body = await publishCmsDraft(admin, "current");
    else throw new Error(`Unexpected request: ${url}`);
    return { ok: true, json: async () => body };
  };
  root = createRoot(document.getElementById("root"));
  await act(async () => root.render(createElement(BlogStudio)));
}
afterEach(async () => { if (root) await act(async () => root.unmount()); root = null; globalThis.fetch = originalFetch; });

test("one Review/Edit click waits for the draft commit, focuses and scrolls the only panel", async () => {
  await setup();
  let resolve;
  pendingDraft = new Promise(done => { resolve = done; });
  await click("Review / Edit");
  assert.equal(document.querySelector("#draft-review"), null);
  assert.equal(scrolls.length, 0);
  await act(async () => resolve());
  const panel = document.querySelector("#draft-review");
  assert.ok(panel);
  assert.equal(document.querySelectorAll("#draft-review").length, 1);
  assert.equal(scrolls.length, 1);
  assert.equal(scrolls[0].element, panel);
  assert.equal(scrolls[0].options.block, "start");
  assert.equal(document.activeElement, panel);
  await click("Edit Article");
  assert.equal(scrolls.length, 1, "ordinary editing must not jump the viewport");
  await click("Review / Edit");
  assert.equal(scrolls.length, 2, "reopening the same draft should navigate again");
  assert.equal(document.querySelectorAll("#draft-review").length, 1);
  assert.ok(document.querySelector('[aria-label="Birbal editorial assistant"]'));
});

for (const entry of [
  { label: "required conditions satisfied with no supporting visuals", options: {}, enabled: true },
  { label: "zero human images", options: { humans: 0 }, enabled: false, reason: /0\/2/ },
  { label: "one human image", options: { humans: 1 }, enabled: false, reason: /1\/2/ },
  { label: "missing internal link", options: { link: false }, enabled: false, reason: /contextual link/ },
  { label: "failed optional supporting visual", options: { supporting: true }, enabled: true },
]) test(`Publish matches server policy: ${entry.label}`, async () => {
  await setup(entry.options);
  await click("Review / Edit");
  const draft = await getCmsDraft("current");
  assert.equal(button("Publish").disabled, !entry.enabled);
  assert.equal(draft.data.publishEligible, entry.enabled);
  if (entry.reason) assert.match(document.getElementById("publish-status").textContent, entry.reason);
  await click("Publish");
  assert.equal(calls.filter(c => c.url === "/api/admin/blog/publish").length, entry.enabled ? 1 : 0);
  if (entry.enabled) {
    assert.equal(cms.row.status, "published", "real publish handler reaches persistence");
    assert.match(document.body.textContent, /Published/);
  } else {
    await assert.rejects(publishCmsDraft(admin, "current"), entry.reason);
    assert.equal(cms.writes.length, 0);
  }
});

test("exact blockers are visible beside Publish even when there are no warnings", async () => {
  await setup({ link: false }); withoutWarnings = true;
  await click("Review / Edit");
  const status = document.getElementById("publish-status");
  assert.match(status.textContent, /contextual link/);
  assert.equal(button("Publish").getAttribute("aria-describedby"), status.id);
  assert.ok([...document.querySelectorAll("button")].some(el => el.textContent === "Fix article"));
});

test("accepting a persisted proposed human image refreshes readiness without reopening", async () => {
  await setup({ humans: 1 });
  const proposal = { id: "proposed", role: "human", status: "proposed", src: "https://cdn.test/proposed.png", placement: "insight", alt: "Learner" };
  cms.row.frontmatter.inlineImages.push(proposal);
  cms.assets.push({ image_key: proposal.id, asset_type: "inline", status: "generated", public_url: proposal.src });
  await click("Review / Edit");
  assert.equal(button("Publish").disabled, true);
  await click("Keep and insert");
  assert.equal(button("Publish").disabled, false);
  assert.equal((await getCmsDraft("current")).data.editorialRequirements.humanImages, 2);
  assert.equal(scrolls.length, 1, "image acceptance should not move the review viewport");
});

test("a contextual link enables Publish only after Save Draft & Revalidate", async () => {
  await setup({ link: false });
  await click("Review / Edit");
  await click("Insert in article");
  assert.equal(button("Publish").disabled, true);
  assert.match(document.getElementById("publish-status").textContent, /Save Draft/);
  await click("Save Draft & Revalidate");
  assert.equal(button("Publish").disabled, false);
  assert.equal((await getCmsDraft("current")).data.editorialRequirements.linksReady, true);
  assert.equal(scrolls.length, 1);
});

test("existing structural safeguards still block both the UI and server", async () => {
  await setup(); cms.row.content = "# Unexpected body title\n\n" + cms.row.content;
  await click("Review / Edit");
  assert.equal(button("Publish").disabled, true);
  assert.match(document.getElementById("publish-status").textContent, /H1/);
  await assert.rejects(publishCmsDraft(admin, "current"), /H1/);
});

test("SEO control center review also waits for the single review panel before scrolling",async()=>{
  await setup();
  let resolve;
  pendingDraft=new Promise(done=>{resolve=done});
  await click("Review draft");
  assert.equal(scrolls.length,0);
  await act(async()=>resolve());
  assert.equal(document.querySelectorAll("#draft-review").length,1);
  assert.equal(scrolls.length,1);
  assert.equal(document.activeElement,document.getElementById("draft-review"));
});
