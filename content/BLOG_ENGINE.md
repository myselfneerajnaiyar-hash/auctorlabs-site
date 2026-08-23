# Auctor Labs AI editorial engine

The engine in `scripts/blog-engine.mjs` discovers, researches, plans, writes, reviews, and saves blog content. It never publishes. Generated articles always use `status: draft` and are written to `content/drafts` for human review.

## Commands

```bash
npm run blog:discover
npm run blog:discover -- --topic="how to learn vocabulary from context"
npm run blog:plan
npm run blog:plan -- --topic="grammar errors in competitive exams"
npm run blog:generate
npm run blog:generate -- --topic="how to eliminate trap answers in reading comprehension"
npm run blog:generate -- --topic="how to identify author tone" --image
npm run blog:sample
npm run blog:audit
npm run blog:registry
npm run blog:roadmap
npm run blog:check
```

`blog:sample` is retained for compatibility, but now invokes the real AI pipeline. It is not a hard-coded sample.

## Environment

Copy the variable names from `.env.example` into `.env.local`. Never commit real keys. `OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL`, the minimum score, and the bounded revision count are configurable.

## Workflow and artifacts

Discovery combines SerpApi organic results, snippets, related searches, People Also Ask questions, the existing published/draft inventory, and the planned strategy queue. Unverified demand is labelled an editorial opportunity rather than a trend. Results go to `content/topic-opportunities.json`.

Planning uses structured OpenAI output to create a brief, approved source list, relevant existing links, backlink outreach opportunities, cluster assignment, and an article-specific image concept. Briefs go to `content/briefs/<slug>.json`.

Generation writes MDX to `content/drafts/<slug>.mdx`. A separate structured review scores SEO, intent, originality, depth, accuracy, usefulness, examples, clarity, readability, information gain, expertise, naturalness, differentiation, brand alignment, internal linking, and schema completeness. At most `BLOG_MAX_REVISIONS` revisions run. `publishEligible` is advisory; `humanReviewRequired` and `status: draft` are always set.

The review also scores freedom from redundancy. Deterministic checks route missing natural keyword usage, titles outside 35-60 characters, meta descriptions outside 140-160 characters, and highly similar long paragraphs into the permitted revision. A draft cannot be marked `publishEligible` while those SEO checks remain unresolved or its SEO review score is below 80.

`blog:roadmap` writes `content/content-roadmap.json`. It compares published posts, drafts, and plans with `content/content-clusters.json`, then reports pillar coverage, supporting-topic coverage, search-intent gaps, internal-link gaps, backlink-worthy resource gaps, a 0-100 content-gap score, and recommended next articles.

Backlink opportunities must cite an exact source page returned by research. The engine verifies that each source page exists in the current SERP result set and that its domain matches the proposed site before retaining it.

Use `--image` to generate an article-specific featured image. Without it, the draft still stores its article-specific prompt and intended image path so image generation can be scheduled separately.
