-- Phase 3A: append-oriented SEO evidence. This migration preserves all existing content and CMS data.
create table public.seo_keywords (
  id uuid primary key default gen_random_uuid(), keyword text not null, normalized_keyword text not null,
  country_code text not null default 'IN' check(country_code ~ '^[A-Z]{2}$'), language_code text not null default 'en' check(language_code ~ '^[a-z]{2,8}(?:-[a-z0-9]{2,8})*$'),
  created_at timestamptz not null default now(), unique(normalized_keyword,country_code,language_code)
);
create table public.seo_provider_runs (
  id uuid primary key default gen_random_uuid(), provider text not null, capability text not null,
  requested_at timestamptz not null default now(), completed_at timestamptz,
  status text not null check(status in ('PROCESSING','SUCCESS','FAILED','UNAVAILABLE','CACHED','STALE')),
  cache_hit boolean not null default false, request_fingerprint text not null, request_count integer not null default 0 check(request_count>=0),
  error_code text, error_message text, cost_amount numeric, cost_currency char(3), request_metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.blog_admins(id)
);
create unique index seo_provider_runs_one_active_request on public.seo_provider_runs(request_fingerprint) where status='PROCESSING';
create index seo_provider_runs_lookup on public.seo_provider_runs(provider,capability,requested_at desc);

create table public.seo_keyword_metric_snapshots (
  id uuid primary key default gen_random_uuid(), keyword_id uuid not null references public.seo_keywords(id) on delete cascade,
  provider_run_id uuid references public.seo_provider_runs(id), provider text not null, request_fingerprint text not null, metric text not null,
  numeric_value numeric, text_value text, currency char(3), source_type text not null check(source_type in ('PROVIDER','OBSERVED','HEURISTIC','AI','ESTIMATED','UNAVAILABLE')),
  status text not null check(status in ('SUCCESS','FAILED','UNAVAILABLE','CACHED','STALE')), fetched_at timestamptz, expires_at timestamptz,
  confidence numeric check(confidence between 0 and 1), evidence jsonb not null default '{}'::jsonb,
  request_metadata jsonb not null default '{}'::jsonb, provider_payload jsonb not null default '{}'::jsonb,
  check(numeric_value is not null or text_value is not null or status in ('FAILED','UNAVAILABLE')),
  unique(provider,request_fingerprint,metric,fetched_at)
);
create index seo_keyword_metric_history on public.seo_keyword_metric_snapshots(keyword_id,metric,fetched_at desc);
create index seo_keyword_metric_freshness on public.seo_keyword_metric_snapshots(request_fingerprint,expires_at desc);

create table public.seo_serp_snapshots (
  id uuid primary key default gen_random_uuid(), keyword_id uuid not null references public.seo_keywords(id) on delete cascade,
  provider_run_id uuid not null references public.seo_provider_runs(id), provider text not null, search_engine text not null default 'google', device text not null default 'desktop',
  fetched_at timestamptz not null, expires_at timestamptz not null, status text not null check(status in ('SUCCESS','CACHED','STALE')),
  request_fingerprint text not null, response_checksum text, result_count integer not null default 0, serp_features jsonb not null default '[]'::jsonb,
  unique(provider,request_fingerprint,fetched_at)
);
create index seo_serp_snapshot_freshness on public.seo_serp_snapshots(request_fingerprint,fetched_at desc);
create table public.seo_serp_results (
  id uuid primary key default gen_random_uuid(), snapshot_id uuid not null references public.seo_serp_snapshots(id) on delete cascade,
  position integer not null check(position>0), result_type text not null, title text not null default '', url text not null, domain text not null default '', snippet text not null default '', displayed_date text,
  unique(snapshot_id,result_type,position,url)
);
create index seo_serp_results_domain on public.seo_serp_results(domain);
create table public.seo_serp_questions (
  id uuid primary key default gen_random_uuid(), snapshot_id uuid not null references public.seo_serp_snapshots(id) on delete cascade,
  position integer not null check(position>0), question text not null, answer text not null default '', source_title text not null default '', source_url text not null default '', unique(snapshot_id,position,question)
);
create table public.seo_related_queries (
  id uuid primary key default gen_random_uuid(), snapshot_id uuid references public.seo_serp_snapshots(id) on delete cascade,
  keyword_id uuid not null references public.seo_keywords(id) on delete cascade, provider_run_id uuid references public.seo_provider_runs(id),
  provider text not null, relation_type text not null, position integer check(position>0), query text not null, fetched_at timestamptz not null, unique(provider_run_id,relation_type,query)
);
create index seo_related_queries_keyword on public.seo_related_queries(keyword_id,fetched_at desc);
create table public.seo_trend_snapshots (
  id uuid primary key default gen_random_uuid(), keyword_id uuid not null references public.seo_keywords(id) on delete cascade,
  provider_run_id uuid not null references public.seo_provider_runs(id), provider text not null, fetched_at timestamptz not null, expires_at timestamptz not null,
  status text not null check(status in ('SUCCESS','CACHED','STALE')), request_fingerprint text not null,
  top_queries jsonb not null default '[]'::jsonb, rising_queries jsonb not null default '[]'::jsonb,
  top_topics jsonb not null default '[]'::jsonb, rising_topics jsonb not null default '[]'::jsonb, timeline jsonb not null default '[]'::jsonb,
  unique(provider,request_fingerprint,fetched_at)
);
create index seo_trend_snapshot_freshness on public.seo_trend_snapshots(request_fingerprint,fetched_at desc);
create table public.seo_content_opportunities (
  id uuid primary key default gen_random_uuid(), keyword_id uuid not null references public.seo_keywords(id) on delete cascade,
  serp_snapshot_id uuid references public.seo_serp_snapshots(id), score numeric check(score between 0 and 100), confidence numeric check(confidence between 0 and 1),
  recommendation text not null check(recommendation in ('GENERATE','MODIFY_TOPIC','AVOID','REVIEW')),
  observed_inputs jsonb not null default '{}'::jsonb, heuristic_components jsonb not null default '{}'::jsonb,
  content_gap_evidence jsonb not null default '{}'::jsonb, cannibalization_evidence jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index seo_opportunities_keyword on public.seo_content_opportunities(keyword_id,created_at desc);

alter table public.blog_generation_jobs add column if not exists research_snapshot_ids uuid[] not null default '{}';
alter table public.blog_generation_jobs add column if not exists research_context jsonb not null default '{}'::jsonb;

create table public.seo_search_performance (
  id uuid primary key default gen_random_uuid(), provider_run_id uuid references public.seo_provider_runs(id), property text not null,
  observation_date date not null, query text, page text, country_code text, device text, search_type text not null default 'web',
  clicks numeric not null, impressions numeric not null, ctr numeric not null, average_position numeric not null, fetched_at timestamptz not null,
  unique(property,observation_date,query,page,country_code,device,search_type)
);
create table public.seo_competitor_snapshots (
  id uuid primary key default gen_random_uuid(), serp_result_id uuid references public.seo_serp_results(id), provider_run_id uuid references public.seo_provider_runs(id),
  url text not null, canonical_url text, http_status integer, title text, description text, published_at timestamptz, modified_at timestamptz,
  word_count integer check(word_count>=0), headings jsonb not null default '[]'::jsonb, entities jsonb not null default '[]'::jsonb, questions jsonb not null default '[]'::jsonb,
  fetched_at timestamptz not null, expires_at timestamptz, status text not null check(status in ('SUCCESS','FAILED','UNAVAILABLE')), error_message text
);

create or replace function public.reject_seo_observation_mutation() returns trigger language plpgsql as $$begin raise exception 'SEO observations are append-only';end$$;
do $$ declare table_name text; begin foreach table_name in array array['seo_keyword_metric_snapshots','seo_serp_snapshots','seo_serp_results','seo_serp_questions','seo_related_queries','seo_trend_snapshots','seo_content_opportunities','seo_search_performance','seo_competitor_snapshots'] loop execute format('create trigger %I before update or delete on public.%I for each row execute function public.reject_seo_observation_mutation()',table_name||'_immutable',table_name); end loop; end $$;

alter table public.seo_keywords enable row level security; alter table public.seo_provider_runs enable row level security;
alter table public.seo_keyword_metric_snapshots enable row level security; alter table public.seo_serp_snapshots enable row level security;
alter table public.seo_serp_results enable row level security; alter table public.seo_serp_questions enable row level security;
alter table public.seo_related_queries enable row level security; alter table public.seo_content_opportunities enable row level security;
alter table public.seo_trend_snapshots enable row level security;
alter table public.seo_search_performance enable row level security; alter table public.seo_competitor_snapshots enable row level security;
do $$ declare table_name text; begin foreach table_name in array array['seo_keywords','seo_provider_runs','seo_keyword_metric_snapshots','seo_serp_snapshots','seo_serp_results','seo_serp_questions','seo_related_queries','seo_trend_snapshots','seo_content_opportunities','seo_search_performance','seo_competitor_snapshots'] loop execute format('create policy "admins read %s" on public.%I for select using (public.is_blog_admin())',table_name,table_name); end loop; end $$;
-- No authenticated insert/update/delete policies are created. Application writes use the server-only service-role client.
