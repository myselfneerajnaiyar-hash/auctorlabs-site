import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("website app links use the shared website campaign attribution", async () => {
  const helper = await read("lib/app-attribution.ts");
  assert.match(helper, /utm_source", "website"/);
  assert.match(helper, /utm_medium", "button"/);
  assert.match(helper, /utm_campaign", "oct_push"/);
  assert.match(helper, /utm_content", content/);
  assert.match(helper, /utm_source", "blog"/);
  assert.match(helper, /utm_medium", "organic"/);
});

test("share-ready campaign links match the channel conventions", async () => {
  const links = await read("docs/tracking-oct-push-links.md");
  for (const tag of [
    "utm_source=whatsapp&amp;utm_medium=community&amp;utm_campaign=oct_push",
    "utm_source=whatsapp&amp;utm_medium=direct&amp;utm_campaign=followup",
    "utm_source=telegram&amp;utm_medium=community&amp;utm_campaign=oct_push",
    "utm_source=ig&amp;utm_medium=social&amp;utm_campaign=oct_push&amp;utm_content=bio",
    "utm_content=story",
    "utm_content=reel",
    "utm_source=email&amp;utm_medium=email&amp;utm_campaign=oct_push",
  ]) assert.ok(links.includes(tag.replaceAll("&amp;", "&")), `missing share link pattern ${tag}`);
});

test("public pricing lists all four subscription plans and sends plan IDs to app checkout", async () => {
  const pricing = await read("app/pricing/page.tsx");
  for (const [id, label, amount] of [
    ["monthly", "Pro Monthly", "₹399"],
    ["quarterly", "3 Month", "₹799"],
    ["half_yearly", "Half Yearly", "₹1,299"],
    ["yearly", "Elite (Yearly)", "₹1,999"],
  ]) {
    assert.ok(pricing.includes(`id: "${id}"`), `${label} plan id should be listed`);
    assert.ok(pricing.includes(`name: "${label}"`), `${label} plan should be named`);
    assert.ok(pricing.includes(`price: "${amount}"`), `${label} price should be displayed`);
  }
  for (const contentId of ["pricing_monthly", "pricing_3month", "pricing_half_yearly", "pricing_elite"]) assert.ok(pricing.includes(`contentId: "${contentId}"`));
  assert.match(pricing, /appAttributionHref\("\/pricing", plan\.contentId, \{ plan: plan\.id \}\)/);
  assert.doesNotMatch(pricing, /rzp\.io/);
});

test("app links in blog, home, feature pages and email carry campaign attribution", async () => {
  const files = [
    "app/components/BlogPracticeCTA.tsx",
    "app/components/BlogArticleView.tsx",
    "app/components/Navbar.tsx",
    "app/features/[slug]/page.tsx",
    "app/page.tsx",
    "app/api/send-test-series-email/route.ts",
  ];
  const contents = await Promise.all(files.map(read));
  assert.match(contents[0], /blogAppAttributionHref\(slug\)/);
  assert.match(contents[1], /blogAppAttributionHref\(slug\)/);
  for (const source of contents.slice(2, 5)) assert.match(source, /appAttributionHref|utm_source=/);
  assert.match(contents[5], /utm_source=email.*utm_medium=email.*utm_campaign=oct_push.*utm_content=testseries_free_mock/s);
});
