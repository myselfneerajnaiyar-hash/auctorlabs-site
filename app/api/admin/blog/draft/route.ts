import { NextResponse } from "next/server";
import { getBlogAdmin } from "@/lib/blog-admin-auth";
import { createManualCmsDraft } from "@/lib/blog-cms-db";
import { getCmsDraft } from "@/lib/blog-cms-actions";
import { getSeoCorpus } from "@/lib/seo/corpus";
import { recommendInternalLinks } from "@/lib/seo/intelligence.mjs";

export async function POST() {
  const admin = await getBlogAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const row = await createManualCmsDraft(admin), draft = await getCmsDraft(row.slug);
    if (!draft) throw new Error("Draft creation failed.");
    const corpus = await getSeoCorpus().catch(() => []);
    return NextResponse.json({ ...draft, internalLinkRecommendations: recommendInternalLinks(String(draft.data.primaryKeyword || draft.data.title || ""), corpus, draft.slug) }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
