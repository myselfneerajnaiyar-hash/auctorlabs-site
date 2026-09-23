import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { cms, fixture } from "./helpers/blog-studio-harness.mjs";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost" });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
dom.window.scrollTo=({top})=>Object.defineProperty(dom.window,"scrollY",{value:top,configurable:true});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { default: BlogStudio } = await import("../app/admin/blog/studio.tsx");
const { getCmsDraft, saveCmsDraft, publishCmsDraft } = await import("../lib/blog-cms-actions.ts");
const { acceptCmsInlineImage, removeCmsInlineImage } = await import("../lib/blog-cms-images.ts");
const admin = { id: "test-admin", role: "owner" };
let draftTransform, root, calls, scrolls, pendingDraft, withoutWarnings, pendingSave, saveFailure, draftWaits, birbalWait, imageWait, researchWait, jobResponse;
const originalFetch = globalThis.fetch;
dom.window.HTMLElement.prototype.scrollIntoView = function(options) {
  assert.ok(this.isConnected, "scroll target must already be committed to the DOM");
  scrolls.push({ element: this, options });
};
function button(label) {
  const found = [...document.querySelectorAll("button")].find(el => !el.closest("[hidden]") && (el.textContent === label || el.getAttribute("aria-label") === label));
  assert.ok(found, `Missing button: ${label}`);
  return found;
}
async function click(label) { await act(async () => button(label).click()); }
async function setup(options) {
  fixture(options); draftTransform=draft=>draft; calls = []; scrolls = []; pendingDraft = null; withoutWarnings = false; pendingSave = null; saveFailure = false; draftWaits=new Map(); birbalWait=null; imageWait=null; researchWait=null; jobResponse=null;window.scrollTo({top:0});
  globalThis.confirm = () => true;
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url, ...init });
    let body;
    if (url === "/api/admin/blog") body = { posts: [{ slug: "current", title: cms.row.title, status: "draft", seoScore: 20 },{slug:"other",title:"Article B",status:"draft"}], topics: [], categories: [], qualityThreshold: 80 };
    else if (url === "/api/admin/blog/search-performance") body = { status: "UNAVAILABLE" };
    else if (url === "/api/admin/blog/draft/other") {
      if(draftWaits.has("other"))await draftWaits.get("other");
      body=await getCmsDraft("current");body={...body,slug:"other",data:{...body.data,title:"Article B"}};
    } else if (url === "/api/admin/blog/draft/current") {
      if(draftWaits.has("current"))await draftWaits.get("current");
      if (pendingDraft) await pendingDraft;
      if (init.method === "PUT" && pendingSave) await pendingSave;
      if (init.method === "PUT" && saveFailure) return {ok:false,json:async()=>({error:"Save rejected: version conflict"})};
      body = init.method === "PUT" ? await saveCmsDraft(admin, "current", JSON.parse(init.body)) : await getCmsDraft("current");
      body.internalLinkRecommendations = [{ targetArticle: "Published", url: "/blog/published", anchor: "related reading" }];
      if (withoutWarnings) { body.data.publishWarnings = []; body.data.publishEligibilityIssues = body.data.publishEligibilityIssues.filter(i => i.severity === "blocker"); }
    } else if (url === "/api/admin/blog/images") {if(imageWait)await imageWait;const input=JSON.parse(init.body);body = input.action==="remove-inline"?await removeCmsInlineImage(admin,"current",input.id):await acceptCmsInlineImage(admin, "current",input.id);}
    else if (url === "/api/admin/blog/birbal") {if(birbalWait)await birbalWait;if(JSON.parse(init.body).action){body={draft:await getCmsDraft("current")}}else body={reply:"A targeted proposal",proposal:[{type:"replace_text",target:"related reading",replacement:"focused reading",summary:"Improve the selected passage"}]};}
    else if (url === "/api/admin/blog/keyword-research") {if(researchWait)await researchWait;body={keyword:"reading practice",provider:"test",status:"SUCCESS",freshness:"FRESH",data:null,partialErrors:[],error:null};}
    else if (url === "/api/admin/blog/generate") body={jobId:"job-1"};
    else if (url === "/api/admin/blog/status/job-1") body=jobResponse||{id:"job-1",status:"processing",stages:{}};
    else if (url === "/api/admin/blog/publish") body = await publishCmsDraft(admin, "current");
    else throw new Error(`Unexpected request: ${url}`);
    if(url.includes("/draft/"))body=draftTransform(body);
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
  await click("Back to Library");
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
  await click("Images");await click("Keep and insert");
  assert.equal(button("Publish").disabled, false);
  assert.equal((await getCmsDraft("current")).data.editorialRequirements.humanImages, 2);
  assert.equal(scrolls.length, 1, "image acceptance should not move the review viewport");
});

test("a contextual link enables Publish only after Save & Revalidate", async () => {
  await setup({ link: false });
  await click("Review / Edit");
  await click("Links");await click("Insert in article");
  assert.equal(button("Publish").disabled, true);
  assert.match(document.getElementById("publish-status").textContent, /Save & Revalidate/);
  await click("Save & Revalidate");
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

function header(){return document.querySelector('header[aria-label="Article workspace"]')}
function saveStatus(){return header().querySelector('[aria-label="Save status"]').textContent}
async function editField(element,value){
  const proto=element.tagName==="TEXTAREA"?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  await act(async()=>{Object.getOwnPropertyDescriptor(proto,"value").set.call(element,value);element.dispatchEvent(new window.Event("input",{bubbles:true}))});
}

test("workspace header shows the article title, saved status and existing actions",async()=>{
  await setup();await click("Review / Edit");
  assert.ok(header());assert.equal(header().querySelector("h2").textContent,cms.row.title);
  assert.equal(saveStatus(),"Saved");
  assert.ok(header().contains(button("Save & Revalidate")));
  assert.ok(header().contains(button("Publish")));
  await click("Edit Article");assert.equal(saveStatus(),"Saved","edit mode alone is not a local change");
  const title=document.querySelector('[aria-label="Article title"]');
  await editField(title,"Changed title");assert.equal(saveStatus(),"Unsaved changes");
  assert.equal(header().querySelector("h2").textContent,"Changed title");
  await editField(title,cms.row.title);assert.equal(saveStatus(),"Saved","reverting a field restores saved state");
});

test("header Save uses the existing PUT handler and shows Saving then Saved",async()=>{
  await setup();await click("Review / Edit");await click("Edit Article");
  await editField(document.querySelector('[aria-label="Article title"]'),"Saved title");
  let resolve;pendingSave=new Promise(done=>{resolve=done});
  await click("Save & Revalidate");
  assert.equal(saveStatus(),"Saving\u2026");assert.equal(button("Save & Revalidate").disabled,true);
  await act(async()=>resolve());
  assert.equal(saveStatus(),"Saved");assert.equal(cms.row.title,"Saved title");
  const puts=calls.filter(c=>c.method==="PUT");assert.equal(puts.length,1);
  assert.equal(JSON.parse(puts[0].body).expectedUpdatedAt,"1");
});

test("failed Save stays visible and retains local edits for retry",async()=>{
  await setup();await click("Review / Edit");await click("Edit Article");
  await editField(document.querySelector('[aria-label="Article title"]'),"Local title");
  saveFailure=true;await click("Save & Revalidate");
  assert.equal(saveStatus(),"Save failed");assert.match(header().querySelector('[role="alert"]').textContent,/version conflict/);
  assert.equal(document.querySelector('[aria-label="Article title"]').value,"Local title");
  assert.notEqual(cms.row.title,"Local title");
  saveFailure=false;await click("Save & Revalidate");assert.equal(saveStatus(),"Saved");
});

test("typing during a save remains unsaved after the older response arrives",async()=>{
  await setup();await click("Review / Edit");await click("Edit Article");
  await editField(document.querySelector('[aria-label="Article title"]'),"Submitted title");
  let resolve;pendingSave=new Promise(done=>{resolve=done});await click("Save & Revalidate");
  await editField(document.querySelector('[aria-label="Article title"]'),"Newer local title");
  await act(async()=>resolve());
  assert.equal(cms.row.title,"Submitted title");assert.equal(saveStatus(),"Unsaved changes");
  assert.equal(header().querySelector("h2").textContent,"Newer local title");
  await click("Edit Article");assert.equal(document.querySelector('[aria-label="Article title"]').value,"Newer local title");
});

test("Back to Library confirms unsaved navigation and retains the open draft",async()=>{
  await setup({link:false});await click("Review / Edit");await click("Links");await click("Insert in article");
  assert.equal(saveStatus(),"Unsaved changes");
  let confirmations=0;globalThis.confirm=()=>{confirmations++;return false};
  const previousScrolls=scrolls.length;await click("Back to Library");
  assert.equal(scrolls.length,previousScrolls);assert.equal(confirmations,1);
  globalThis.confirm=()=>true;await click("Back to Library");
  assert.equal(document.activeElement.id,"content-library");assert.ok(header());
  assert.equal(saveStatus(),"Unsaved changes");
  const fetches=calls.filter(c=>c.url==="/api/admin/blog/draft/current").length;
  await click("Review / Edit");
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/draft/current").length,fetches,"returning to the same dirty draft must not replace it");
  assert.equal(saveStatus(),"Unsaved changes");
});

test("readiness disclosure shows exact server blockers beside the sticky actions",async()=>{
  await setup({humans:1,link:false});await click("Review / Edit");
  const summary=header().querySelector('summary[aria-label="Readiness: 2 blockers"]');assert.ok(summary);
  await act(async()=>summary.click());assert.equal(summary.parentElement.open,true);
  const details=document.getElementById("publish-status");
  assert.match(details.textContent,/1\/2/);assert.match(details.textContent,/contextual link/);
  assert.equal(button("Publish").disabled,true);
  assert.equal(scrolls.length,1,"opening readiness must not navigate down the page");
});

test("browser departure warns only while local changes are unsaved",async()=>{
  await setup({link:false});await click("Review / Edit");
  let event=new window.Event("beforeunload",{cancelable:true});window.dispatchEvent(event);assert.equal(event.defaultPrevented,false);
  await click("Links");await click("Insert in article");event=new window.Event("beforeunload",{cancelable:true});window.dispatchEvent(event);assert.equal(event.defaultPrevented,true);
  await click("Save & Revalidate");event=new window.Event("beforeunload",{cancelable:true});window.dispatchEvent(event);assert.equal(event.defaultPrevented,false);
});

function workspaceVisible(){return document.getElementById("draft-review")?.hidden===false}
function activeTool(){return document.querySelector('nav[aria-label="Editorial tools"] [aria-pressed="true"]')?.textContent}
async function openOther(){await act(async()=>document.querySelector('#article-other button').click())}

test("Studio and article are distinct visible contexts; returning restores position without refetching",async()=>{
  await setup();
  assert.equal(document.getElementById("studio-context").hidden,false);
  assert.equal(document.getElementById("draft-review"),null);
  window.scrollTo({top:1234});button("Review / Edit").focus();
  await click("Review / Edit");
  assert.equal(document.getElementById("studio-context").hidden,true);
  assert.ok(workspaceVisible());assert.ok(header());
  const article=document.getElementById("draft-review");
  assert.equal(article.querySelector("#keyword-research"),null);
  assert.equal(article.querySelector("#content-library"),null);
  const count=calls.length;
  await click("Back to Library");
  assert.equal(document.getElementById("studio-context").hidden,false);
  assert.equal(article.hidden,true);assert.equal(window.scrollY,1234);
  assert.equal(document.activeElement,button("Review / Edit"));
  await click("Return to article: Reading with purpose");
  assert.equal(document.getElementById("draft-review"),article);
  assert.ok(workspaceVisible());assert.equal(calls.length,count);
});

test("Birbal input, conversation and proposal survive navigation; another article gets separate state",async()=>{
  await setup();await click("Review / Edit");await click("Birbal");await click("Improve introduction");
  const panel=document.querySelector('[aria-label="Birbal editorial assistant"]');
  assert.match(panel.textContent,/Improve the selected passage/);
  await editField(panel.querySelector("input"),"A follow-up question");
  await click("Back to Library");await click("Review / Edit");
  assert.equal(document.querySelector('[aria-label="Birbal editorial assistant"]'),panel);
  assert.match(panel.textContent,/A targeted proposal/);
  assert.equal(panel.querySelector("input").value,"A follow-up question");
  await click("Back to Library");await openOther();
  const otherPanel=document.querySelector('[aria-label="Birbal editorial assistant"]');
  assert.notEqual(otherPanel,panel);assert.equal(header().querySelector("h2").textContent,"Article B");
  assert.doesNotMatch(otherPanel.textContent,/Improve the selected passage/);
  assert.equal(otherPanel.querySelector("input").value,"");
});

test("unsaved Article A cannot be silently replaced when Article B is opened from Studio",async()=>{
  await setup({link:false});await click("Review / Edit");await click("Links");await click("Insert in article");
  await click("Back to Library");globalThis.confirm=()=>false;await openOther();
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/draft/other").length,0);
  await click("Review / Edit");assert.ok(workspaceVisible());assert.equal(saveStatus(),"Unsaved changes");
});

test("overlapping article loads ignore stale responses and duplicate opens do not duplicate requests",async()=>{
  await setup();let resolve;
  draftWaits.set("current",new Promise(done=>{resolve=done}));
  await click("Review / Edit");await click("Review / Edit");
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/draft/current").length,1);
  await openOther();assert.equal(header().querySelector("h2").textContent,"Article B");
  await act(async()=>resolve());assert.equal(header().querySelector("h2").textContent,"Article B");
  assert.equal(document.querySelectorAll("#draft-review").length,1);
});

test("a running Birbal operation survives navigation and prevents cross-article mutation",async()=>{
  await setup();await click("Review / Edit");let resolve;
  birbalWait=new Promise(done=>{resolve=done});await click("Birbal");await click("Improve introduction");
  await click("Back to Library");await openOther();
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/draft/other").length,0);
  await click("Review / Edit");assert.equal(button("Ask Birbal").disabled,true);
  await act(async()=>resolve());
  assert.match(document.querySelector('[aria-label="Birbal editorial assistant"]').textContent,/Improve the selected passage/);
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/birbal").length,1);
});

test("image acceptance finishes in the retained draft while Studio is visible",async()=>{
  await setup({humans:1});
  const proposal={id:"pending-image",role:"human",status:"proposed",src:"https://cdn.test/pending.png",placement:"insight",alt:"Learner"};
  cms.row.frontmatter.inlineImages.push(proposal);
  cms.assets.push({image_key:proposal.id,asset_type:"inline",status:"generated",public_url:proposal.src});
  await click("Review / Edit");let resolve;imageWait=new Promise(done=>{resolve=done});
  await click("Images");await click("Keep and insert");await click("Back to Library");
  await act(async()=>resolve());
  assert.equal(document.getElementById("studio-context").hidden,false,"completion must not switch contexts");
  await click("Review / Edit");assert.equal(button("Publish").disabled,false);
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/images").length,1);
  assert.equal((await getCmsDraft("current")).data.editorialRequirements.humanImages,2);
});

test("research completes in Studio without duplicate requests or loss during article navigation",async()=>{
  await setup();let resolve;researchWait=new Promise(done=>{resolve=done});
  await editField(document.querySelector('[aria-label="Target keyword"]'),"reading practice");
  await click("Research Keyword");await click("Review / Edit");
  await act(async()=>resolve());assert.ok(workspaceVisible());
  await click("Back to Library");
  assert.match(document.getElementById("keyword-research").textContent,/reading practice/);
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/keyword-research").length,1);
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/search-performance").length,1);
});

test("generation polling survives context changes and completion does not replace the active article",async()=>{
  await setup();
  await editField(document.querySelector('textarea[placeholder="Enter a relevant editorial topic"]'),"A new article topic");
  await click("Generate Article");await click("Review / Edit");
  jobResponse={id:"job-1",status:"complete",stages:{},result:{slug:"other"}};
  await act(async()=>new Promise(resolve=>setTimeout(resolve,1650)));
  assert.ok(workspaceVisible());assert.equal(header().querySelector("h2").textContent,"Reading with purpose");
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/generate").length,1);
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/draft/other").length,0);
  await click("Back to Library");await click("Open generated draft");
  assert.equal(header().querySelector("h2").textContent,"Article B");
});

test("Content defaults on each new article; tools are exclusive and preserve the single article preview",async()=>{
  await setup();await click("Review / Edit");assert.equal(activeTool(),"Content");
  const preview=document.querySelector('iframe[title="Article preview"]'),count=calls.length;
  for(const tool of ["Review","Images","Links","SEO","Birbal","Content"]){
    await click(tool);assert.equal(activeTool(),tool);
    assert.equal(document.querySelectorAll('[id^="tool-"]:not([hidden])').length,tool==="Content"?0:1);
    assert.equal(document.querySelector('iframe[title="Article preview"]'),preview);
    assert.equal(document.querySelectorAll('#article-content').length,1);
  }
  assert.equal(calls.length,count,"switching tools must not issue requests");
  await click("SEO");await click("Back to Library");await openOther();assert.equal(activeTool(),"Content");
});

for(const label of ["Fix with Birbal","Fix all"])test(`Review ${label} routes proposals into the persistent Birbal conversation`,async()=>{
  await setup({link:false});await click("Review / Edit");await click("Review");
  const review=document.querySelector('#tool-review');assert.match(review.textContent,/Blockers/);assert.match(review.textContent,/Warnings/);assert.match(review.textContent,/Improvements/);assert.match(review.textContent,/contextual link/);
  await click(label);assert.equal(activeTool(),"Birbal");
  const panel=document.querySelector('[aria-label="Birbal editorial assistant"]');assert.match(panel.textContent,/A targeted proposal/);assert.match(panel.textContent,/Improve the selected passage/);
  await editField(panel.querySelector('input'),"Keep this follow-up");
  await click("Images");await click("SEO");await click("Birbal");assert.equal(panel.querySelector('input').value,"Keep this follow-up");assert.match(panel.textContent,/Improve the selected passage/);
  assert.equal(calls.filter(c=>c.url==="/api/admin/blog/birbal").length,1);
  await click("Cancel");assert.doesNotMatch(panel.textContent,/Birbal proposes:/);assert.match(panel.textContent,/A targeted proposal/);
});

test("Birbal Apply and Undo retain their existing request contracts across tool switches",async()=>{
  await setup();await click("Review / Edit");await click("Birbal");await click("Improve introduction");await click("Links");await click("Birbal");await click("Apply changes");
  assert.match(document.getElementById('tool-birbal').textContent,/Birbal updated the article/);await click("Undo");
  const requests=calls.filter(c=>c.url==="/api/admin/blog/birbal").map(c=>JSON.parse(c.body));
  assert.equal(requests.length,3);assert.equal(requests[1].action,"apply");assert.equal(requests[1].operations.length,1);assert.equal(requests[2].action,"undo");assert.ok(requests.every(r=>r.slug==="current"));
});

test("Images show each asset once and discard a proposal through the existing image handler",async()=>{
  await setup({humans:1,supporting:true});const proposal={id:"proposal",role:"human",status:"proposed",src:"https://cdn.test/proposal.png",placement:"insight",alt:"Learner"};
  cms.row.frontmatter.inlineImages.push(proposal);cms.assets.push({image_key:proposal.id,asset_type:"inline",status:"generated",public_url:proposal.src});
  await click("Review / Edit");await click("Images");
  const manager=document.getElementById('tool-images');assert.match(manager.textContent,/Needs Review/);assert.match(manager.textContent,/Accepted/);assert.match(manager.textContent,/Failed/);
  for(const id of ['proposal','human-0','diagram'])assert.equal(manager.querySelectorAll(`[data-image-id="${id}"]`).length,1);
  await act(async()=>[...manager.querySelectorAll("button")].find(b=>b.textContent==="Discard").click());assert.equal(manager.querySelector('[data-image-id="proposal"]'),null);assert.equal(button("Publish").disabled,true);
  const requests=calls.filter(c=>c.url==="/api/admin/blog/images");assert.equal(requests.length,1);assert.equal(JSON.parse(requests[0].body).action,"remove-inline");
});

test("Links show inserted state immediately and require server revalidation after removal",async()=>{
  await setup({link:false});await click("Review / Edit");await click("Links");await click("Insert in article");
  assert.match(document.getElementById('tool-links').textContent,/awaiting revalidation/);assert.equal(button("Publish").disabled,true);
  await click("Save & Revalidate");assert.match(document.getElementById('tool-links').textContent,/VERIFIED/);assert.match(document.getElementById('tool-links').textContent,/Internal links: 1\/1 required/);
  await click("Remove link");assert.equal(saveStatus(),"Unsaved changes");assert.match(document.getElementById('tool-links').textContent,/No internal links in the article/);
  await click("Save & Revalidate");assert.equal(button("Publish").disabled,true);assert.match(document.getElementById('tool-links').textContent,/Internal links: 0\/1 required/);
});

test("Links cannot count a self, invalid, or unpublished destination toward readiness",async()=>{
  await setup({link:false});
  draftTransform=draft=>({...draft,internalLinkRecommendations:[{targetArticle:'Self',url:'/blog/current',anchor:'related reading'},{targetArticle:'Invalid',url:'https://invalid.test',anchor:'related reading'}]});
  await click("Review / Edit");await click("Links");assert.doesNotMatch(document.getElementById('tool-links').textContent,/Self/);await click("Insert in article");assert.equal(saveStatus(),"Saved");
  await click("Edit Article");await editField(document.querySelector('[aria-label="Article content"]'),cms.row.content+'\n\n[Unknown](/blog/unpublished) [Self](/blog/current)');
  await click("Save & Revalidate");assert.equal(button("Publish").disabled,true);assert.match(document.getElementById('tool-links').textContent,/BROKEN/);
});

test("SEO edits persist across tools and save through the existing draft endpoint",async()=>{
  await setup();await click("Review / Edit");await click("SEO");
  await editField(document.querySelector('[aria-label="Primary keyword"]'),"reading practice");await editField(document.querySelector('[aria-label="Meta description"]'),"A revised SEO description.");
  await click("Content");await click("Birbal");await click("SEO");assert.equal(document.querySelector('[aria-label="Primary keyword"]').value,"reading practice");assert.equal(saveStatus(),"Unsaved changes");
  await click("Save & Revalidate");assert.equal(saveStatus(),"Saved");const request=calls.find(c=>c.method==="PUT");assert.equal(JSON.parse(request.body).data.description,"A revised SEO description.");assert.equal(document.querySelectorAll('[aria-label="Primary keyword"]').length,1);
});

test("Links retain saved suggestions without duplicating generated recommendations",async()=>{
  await setup({link:false});
  draftTransform=draft=>({...draft,data:{...draft.data,internalLinkStates:[{url:'/blog/published',anchor:'related reading',state:'SUGGESTED'},{url:'/blog/additional',anchor:'practice',state:'SUGGESTED'}]}});
  await click("Review / Edit");await click("Links");const panel=document.getElementById('tool-links');
  assert.equal([...panel.querySelectorAll('button')].filter(b=>b.textContent==='Insert in article').length,2);assert.match(panel.textContent,/additional/);
});

test("running Birbal work and its proposal survive switching to Content without duplicate requests",async()=>{
  await setup();await click("Review / Edit");await click("Birbal");let resolve;birbalWait=new Promise(done=>{resolve=done});await click("Improve introduction");
  await click("Images");await click("Content");assert.equal(button("Save & Revalidate").disabled,true);await act(async()=>resolve());assert.equal(activeTool(),"Content");
  await click("Birbal");assert.match(document.getElementById('tool-birbal').textContent,/Improve the selected passage/);assert.equal(calls.filter(c=>c.url==='/api/admin/blog/birbal').length,1);
});
