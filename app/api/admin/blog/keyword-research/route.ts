import { NextResponse } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { normalizeSeoRequest, isValidResearchKeyword } from "@/lib/seo/provider.mjs";
import { createDataForSeoProvider } from "@/lib/seo/providers/dataforseo.mjs";
import { refreshProviderEvidence } from "@/lib/seo/refresh.mjs";
import { createSupabaseSeoStore } from "@/lib/seo/store.mjs";
import { seoRequestFingerprint } from "@/lib/seo/provider.mjs";
import { buildResearchIntelligence } from "@/lib/seo/intelligence.mjs";
import { getSeoCorpus } from "@/lib/seo/corpus";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await getBlogAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Enter one valid keyword." }, { status: 400 }); }
  const raw = typeof body === "object" && body !== null && "keyword" in body ? (body as { keyword: unknown }).keyword : null;
  if (typeof raw !== "string") return NextResponse.json({ error: "Enter one valid keyword." }, { status: 400 });
  const keyword = normalizeSeoRequest({ keyword: raw }).keyword;
  if (!isValidResearchKeyword(raw)) {
    return NextResponse.json({ error: "Enter one keyword, between 3 and 120 characters." }, { status: 400 });
  }

  const store = createSupabaseSeoStore();
  if (!store) return NextResponse.json({ error: "SEO evidence storage is unavailable. No paid request was made." }, { status: 503 });
  try {
    const schema = await store.verifyKeywordMetricSchema();
    if (!schema.available) return NextResponse.json({ error: "SEO metric storage is unavailable. No paid request was made." }, { status: 503 });
    const result = await refreshProviderEvidence({
      provider: createDataForSeoProvider(), capability: "keyword_metrics",
      request: { keyword, country: "IN", language: "en", device: "desktop", searchEngine: "google" },
      store, adminId: admin.id, paidDailyLimit: 20,
    });
    const partialErrors = result.partialErrors || [];
    const data = result.data || result.historicalSnapshot?.data || null;
    const freshness = result.status === "CACHED" ? "CACHED" : result.freshness || "UNAVAILABLE";
    const missingDifficulty = (result.status === "SUCCESS" || result.status === "CACHED") && data && data.keywordDifficulty == null;
    const evidenceRequest = { keyword, country: "IN", language: "en", device: "desktop", searchEngine: "google" };
    const [serpLookup, trendLookup, corpusLookup, performanceLookup] = await Promise.allSettled([
      store.findFresh(seoRequestFingerprint("serpapi", "serp", evidenceRequest)),
      store.findFreshTrend(seoRequestFingerprint("google_trends_unofficial", "trends", evidenceRequest)),
      getSeoCorpus(),
      store.getSearchPerformance({ days: 90, limit: 5000 }),
    ]);
    const serp = serpLookup.status === "fulfilled" && serpLookup.value ? { status: "CACHED", data: serpLookup.value } : null;
    const trend = trendLookup.status === "fulfilled" && trendLookup.value ? { status: "CACHED", data: trendLookup.value } : null;
    const corpus = corpusLookup.status === "fulfilled" ? corpusLookup.value : [];
    const performance = performanceLookup.status === "fulfilled" ? performanceLookup.value : [];
    const intelligence = buildResearchIntelligence({ keyword, metrics: result, serp, trend, corpus, performance });
    if (data && (result.status === "SUCCESS" || result.status === "CACHED")) {
      await store.persistOpportunity({keyword,serpSnapshotId:serpLookup.status==="fulfilled"?serpLookup.value?.id:null,opportunity:intelligence.opportunity,contentGap:intelligence.contentGap,cannibalization:intelligence.cannibalization,action:intelligence.opportunity.action}).catch(()=>null);
    }
    return NextResponse.json({
      keyword, provider: "DataForSEO", status: partialErrors.length || missingDifficulty ? "PARTIAL" : result.status,
      freshness, fetchedAt: result.fetchedAt || result.historicalSnapshot?.fetched_at || null,
      expiresAt: result.expiresAt || result.historicalSnapshot?.expires_at || null,
      data, partialErrors: partialErrors.map((item: { metric: string; code: string }) => ({ metric: item.metric, code: item.code })),
      error: result.error ? { code: result.error.code, message: result.error.message } : null,
      cost: result.costMetadata?.amount ?? null,
      requestCount: result.costMetadata?.requestCount ?? 0,
      intelligence,
    }, { status: result.error?.code === "QUOTA_EXCEEDED" ? 429 : 200 });
  } catch {
    return NextResponse.json({ error: "Keyword research could not complete. No metrics were fabricated." }, { status: 503 });
  }
}
