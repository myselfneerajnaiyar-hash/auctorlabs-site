// Run after npm run build. Uses an installed Chromium browser and the actual
// compiled Tailwind CSS; no production requests or additional dependencies.
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import {studioBrowserBundle,studioBrowserFixture} from "./helpers/blog-studio-browser.mjs";

const browser = process.env.BLOG_TEST_BROWSER || [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/chromium", "/usr/bin/google-chrome",
].find(file => existsSync(file));
assert.ok(browser, "Set BLOG_TEST_BROWSER to a Chromium executable.");
const cssRoot = path.resolve(".next/static");
const css = readdirSync(cssRoot, { recursive: true }).filter(file => file.endsWith(".css")).map(file => readFileSync(path.join(cssRoot, file), "utf8")).join("\n");
assert.ok(css.includes("sticky"), "Build the application before running layout tests.");
const bundle=studioBrowserBundle();
const server=createServer((request,response)=>{
 if(request.url==='/bundle.js'){response.setHeader('Content-Type','application/javascript');response.end(bundle);return}
 response.setHeader('Content-Type','text/html');
 if(request.url.startsWith('/admin/blog/preview/')){response.end('<article><h1>Saved article preview</h1><p>Article content remains accessible.</p></article>');return}
 response.end('<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>'+css+'</style></head><body><div id="root"></div><script>'+studioBrowserFixture+'</script><script src="/bundle.js"></script></body></html>');
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
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
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
    const wait=async predicate=>{for(let i=0;i<60;i++){if(await evaluate(predicate))return;await new Promise(r=>setTimeout(r,100))}throw Error(`${name}: timed out ${predicate}`)};
    const click=async label=>{await evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(b=>!b.closest('[hidden]')&&(b.textContent===${JSON.stringify(label)}||b.getAttribute('aria-label')===${JSON.stringify(label)}));if(!b)throw Error('Missing button');b.click()})()`);await new Promise(r=>setTimeout(r,120))};
    await wait('!!document.querySelector("#article-a button")');
    await evaluate('document.querySelector("#article-a button").scrollIntoView();window.libraryPosition=scrollY');
    await click('Review / Edit');await wait('document.getElementById("studio-context").hidden && Math.abs(document.getElementById("draft-review").getBoundingClientRect().top-24)<3');
    assert.equal(await evaluate('document.querySelector("[aria-pressed=true]").textContent'),'Content');
    await evaluate('window.articleFrame=document.querySelector("iframe");window.initialCalls=window.calls.length');
    for(const tool of ['Review','Images','Links','SEO','Birbal','Content']){
      await click(tool);
      const layout=await evaluate(`(()=>{const a=document.getElementById('article-content').getBoundingClientRect(),nav=document.querySelector('nav[aria-label="Editorial tools"]').getBoundingClientRect(),panels=[...document.querySelectorAll('[id^="tool-"]')].filter(p=>!p.hidden),p=panels[0]?.getBoundingClientRect();return {active:document.querySelector('[aria-pressed=true]').textContent,count:panels.length,sameFrame:window.articleFrame===document.querySelector('iframe'),overflow:document.documentElement.scrollWidth>innerWidth,article:{x:a.x,right:a.right,top:a.top,bottom:a.bottom,width:a.width},nav:{top:nav.top,bottom:nav.bottom},panel:p?{x:p.x,top:p.top,width:p.width}:null}})()`);
      assert.equal(layout.active,tool);assert.equal(layout.count,tool==='Content'?0:1);assert.equal(layout.sameFrame,true);assert.equal(layout.overflow,false,`${name}/${tool}: no horizontal overflow`);
      if(mobile){assert.ok(layout.nav.top>=layout.article.bottom-1,`${name}: tools follow article`);if(layout.panel)assert.ok(layout.panel.top>=layout.nav.bottom-1)}
      else {assert.ok(layout.nav.bottom<=layout.article.top);if(layout.panel){assert.ok(layout.panel.x>=layout.article.right);assert.ok(layout.article.width>layout.panel.width);assert.ok(Math.abs(layout.panel.top-layout.article.top)<2)}}
    }
    assert.equal(await evaluate('window.calls.length===window.initialCalls'),true,'tool navigation has no requests');
    await click('Review');await click('Fix with Birbal');
    assert.equal(await evaluate('document.querySelector("[aria-pressed=true]").textContent'),'Birbal');
    await wait('document.getElementById("tool-birbal").textContent.includes("Improve Article A")');
    await evaluate('window.birbal=document.querySelector("[aria-label^=Birbal]");true');
    await click('Images');await click('Birbal');assert.equal(await evaluate('window.birbal===document.querySelector("[aria-label^=Birbal]")'),true);
    assert.equal(await evaluate('document.getElementById("tool-birbal").textContent.includes("Improve Article A")'),true);
    await click('SEO');await evaluate(`(()=>{const e=document.querySelector('input[aria-label="Primary keyword"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,'retained keyword');e.dispatchEvent(new Event('input',{bubbles:true}))})()`);await new Promise(r=>setTimeout(r,100));
    await click('Content');await click('SEO');assert.equal(await evaluate('document.querySelector("input[aria-label^=Primary]").value'),'retained keyword');
    await evaluate('window.scrollTo(0,500)');await new Promise(r=>setTimeout(r,100));
    assert.ok(Math.abs(await evaluate('document.querySelector("header[aria-label]").getBoundingClientRect().top'))<2,`${name}: sticky header`);
    await click('Back to Library');assert.equal(await evaluate('Math.abs(scrollY-window.libraryPosition)<3'),true);
    await click('Return to article: Article A');assert.equal(await evaluate('document.querySelector("[aria-pressed=true]").textContent'),'SEO');
    await click('Back to Library');await evaluate('document.querySelector("#article-b button").click()');await wait('document.querySelector("header[aria-label] h2")?.textContent==="Article B"');
    assert.equal(await evaluate('document.querySelector("[aria-pressed=true]").textContent'),'Content');assert.equal(await evaluate('document.getElementById("tool-birbal").textContent.includes("Improve Article A")'),false);
    console.log(`PASS ${name} (${width}x${height}): tool layout, article continuity, no overflow, Review to Birbal, retained state, sticky header, library navigation, article isolation.`);

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
