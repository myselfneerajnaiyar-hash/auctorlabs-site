-- Forward-only Phase 3B additions. Safe when the current Phase 3A migration is applied first,
-- and idempotent for environments where these columns were included in Phase 3A already.
alter table public.seo_keyword_metric_snapshots add column if not exists provider text;
alter table public.seo_keyword_metric_snapshots add column if not exists request_fingerprint text;
alter table public.seo_keyword_metric_snapshots add column if not exists request_metadata jsonb not null default '{}'::jsonb;
alter table public.seo_keyword_metric_snapshots add column if not exists provider_payload jsonb not null default '{}'::jsonb;

alter table public.seo_keyword_metric_snapshots disable trigger seo_keyword_metric_snapshots_immutable;
update public.seo_keyword_metric_snapshots set provider='legacy',request_fingerprint='legacy:'||id::text where provider is null or request_fingerprint is null;
alter table public.seo_keyword_metric_snapshots enable trigger seo_keyword_metric_snapshots_immutable;
alter table public.seo_keyword_metric_snapshots alter column provider set not null;
alter table public.seo_keyword_metric_snapshots alter column request_fingerprint set not null;

create index if not exists seo_keyword_metric_freshness on public.seo_keyword_metric_snapshots(request_fingerprint,expires_at desc);
create unique index if not exists seo_keyword_metric_snapshot_identity on public.seo_keyword_metric_snapshots(provider,request_fingerprint,metric,fetched_at);

alter table public.blog_generation_jobs add column if not exists research_snapshot_ids uuid[] not null default '{}';
alter table public.blog_generation_jobs add column if not exists research_context jsonb not null default '{}'::jsonb;
