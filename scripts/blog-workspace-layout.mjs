// Run after npm run build. Uses an installed Chromium browser and the actual
// compiled Tailwind CSS; no production requests or additional dependencies.
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import "./helpers/blog-studio-harness.mjs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
const { default: Header } = await import("../app/admin/blog/article-workspace-header.tsx");

const browser = process.env.BLOG_TEST_BROWSER || [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/chromium", "/usr/bin/google-chrome",
].find(file => existsSync(file));
assert.ok(browser, "Set BLOG_TEST_BROWSER to a Chromium executable.");
const cssRoot = path.resolve(".next/static");
const css = readdirSync(cssRoot, { recursive: true }).filter(file => file.endsWith(".css")).map(file => readFileSync(path.join(cssRoot, file), "utf8")).join("\n");
assert.ok(css.includes("sticky"), "Build the application before running layout tests.");
const markup = renderToStaticMarkup(createElement(Header, {
  title: "An intentionally long article title that must truncate without displacing Save, readiness, or Publish on small screens",
  saveState: "Unsaved changes", saveError: "", dirty: true, busy: false,
  publishEnabled: false, blockers: ["At least 2 accepted human images are required (1/2).", "At least 1 contextual internal link is required."],
  warnings: [], onSave() {}, onPublish() {}, onBack() {},
}));
const server = createServer((request, response) => {
  response.setHeader("Content-Type", "text/html");
  response.end(`<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>${css}</style></head><body><main class="min-h-screen bg-[#080b14] text-white"><div class="mx-auto max-w-7xl px-5 py-10"><div id="studio-context" hidden style="height:900px">Library and Research</div><section id="draft-review" class="rounded-2xl border border-orange-500/20 bg-white/[.04] p-6">${markup}<div style="height:2400px">Article content</div></section></div></main></body></html>`);
});
server.listen(0, "127.0.0.1");
await once(server, "listening");
const profile = mkdtempSync(path.join(tmpdir(), "blog-workspace-layout-"));
const child = spawn(browser, ["--headless=new", "--no-first-run", "--disable-background-networking", "--disable-extensions", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { windowsHide: true, stdio: ["ignore", "ignore", "pipe"] });
let socket, sequence = 0;
const pending = new Map();
function send(method, params = {}, sessionId) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, sessionId }));
  });
}
try {
  const endpoint = await new Promise((resolve, reject) => {
    let log = "";
    const timer = setTimeout(() => reject(new Error("Browser did not start.")), 15000);
    child.once("error", error => { clearTimeout(timer); reject(error); });
    child.stderr.on("data", data => { log += data; const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (match) { clearTimeout(timer); resolve(match[1]); } });
  });
  socket = new WebSocket(endpoint);
  await once(socket, "open");
  socket.addEventListener("message", event => {
    const result = JSON.parse(event.data), task = pending.get(result.id);
    if (!task) return;
    pending.delete(result.id); clearTimeout(task.timer);
    if (result.error) task.reject(new Error(result.error.message)); else task.resolve(result.result);
  });
  const { targetId } = await send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true });
  const evaluate = async expression => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await send("Page.enable", {}, sessionId);
  for (const [name, width, height, mobile] of [["desktop",1440,900,false],["mobile",390,844,true],["narrow mobile",320,640,true],["mobile keyboard",390,300,true]]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile }, sessionId);
    await send("Page.navigate", { url: `http://127.0.0.1:${server.address().port}` }, sessionId);
    for (let attempt = 0; attempt < 50; attempt++) {
      if (await evaluate('document.readyState === "complete" && !!document.querySelector("header")')) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    const context = await evaluate('(()=>{const studio=document.getElementById("studio-context"),article=document.getElementById("draft-review");return {studioHeight:studio.getBoundingClientRect().height,articleTop:article.getBoundingClientRect().top,headerCount:document.querySelectorAll("header").length}})()');
    assert.equal(context.studioHeight,0,`${name}: Studio contributes no space above the article`);
    assert.ok(context.articleTop>=0&&context.articleTop<=60,`${name}: article opens near viewport top`);
    assert.equal(context.headerCount,1);
    await evaluate('window.retainedHeader=document.querySelector("header");document.getElementById("studio-context").hidden=false;document.getElementById("draft-review").hidden=true');
    assert.equal(await evaluate('document.querySelector("header").getClientRects().length'),0,`${name}: workspace is hidden in Studio`);
    await evaluate('document.getElementById("studio-context").hidden=true;document.getElementById("draft-review").hidden=false');
    assert.equal(await evaluate('document.querySelector("header")===window.retainedHeader'),true,`${name}: context switch retains the mounted workspace`);
    await evaluate('window.scrollTo({top:1300,behavior:"instant"}); new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
    const layout = await evaluate(`(()=>{
      const header=document.querySelector('header'), rect=header.getBoundingClientRect();
      const controls=[...header.querySelectorAll('button,summary')].filter(el=>!el.closest('#publish-status'));
      return {top:rect.top,height:rect.height,overflow:document.documentElement.scrollWidth>innerWidth,
        titleTruncated:header.querySelector('h2').scrollWidth>header.querySelector('h2').clientWidth,
        controls:controls.map(el=>{const r=el.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {label:el.getAttribute('aria-label')||el.textContent,visible:r.width>0&&r.x>=0&&r.right<=innerWidth&&r.y>=0&&r.bottom<=innerHeight,uncovered:el===hit||el.contains(hit)}}),
        singleRow:Math.abs(header.querySelector('h2').getBoundingClientRect().top-header.querySelector('button[aria-label="Save & Revalidate"]').getBoundingClientRect().top)<20};
    })()`);
    assert.ok(Math.abs(layout.top) <= 1, `${name}: header must stick to the viewport top`);
    assert.ok(layout.height <= (mobile ? 112 : 80), `${name}: header must stay compact (${layout.height}px)`);
    assert.equal(layout.overflow, false, `${name}: no horizontal overflow`);
    assert.equal(layout.titleTruncated, true, `${name}: long title truncates`);
    assert.equal(layout.controls.length, 4);
    for (const control of layout.controls) assert.ok(control.visible && control.uncovered, `${name}: ${control.label} must be accessible`);
    if (!mobile) assert.equal(layout.singleRow, true, "desktop actions share one row");
    await evaluate('document.querySelector("summary").click()');
    const disclosure = await evaluate('(()=>{const el=document.getElementById("publish-status"),r=el.getBoundingClientRect();return {open:el.parentElement.open,left:r.left,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight}})()');
    assert.equal(disclosure.open, true);
    assert.ok(disclosure.left >= 0 && disclosure.right <= disclosure.width && disclosure.bottom <= disclosure.height + 1, `${name}: readiness stays in the viewport`);
    console.log(`PASS ${name} (${width}×${height}): separate contexts, retained workspace, sticky controls, compact layout, no overflow, accessible readiness.`);
  }
} finally {
  if (socket?.readyState === WebSocket.OPEN) { await send("Browser.close").catch(() => {}); socket.close(); }
  if (child.exitCode === null) await Promise.race([once(child,"exit"),new Promise(resolve=>setTimeout(resolve,2000))]);
  if (child.exitCode === null) child.kill();
  server.close();
  for (const task of pending.values()) clearTimeout(task.timer);
  // Only remove the unique temporary browser profile created by this script.
  const resolved=realpathSync(profile), temporaryRoot=realpathSync(tmpdir());
  assert.ok(resolved.startsWith(temporaryRoot+path.sep) && path.basename(resolved).startsWith("blog-workspace-layout-"));
  rmSync(resolved,{recursive:true,force:true,maxRetries:10,retryDelay:200});
}
