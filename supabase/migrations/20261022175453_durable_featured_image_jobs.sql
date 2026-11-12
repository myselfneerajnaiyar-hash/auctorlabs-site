alter table public.blog_generation_jobs
  add column if not exists job_type text not null default 'article' check (job_type in ('article','featured_image')),
  add column if not exists article_id uuid references public.blog_articles(id) on delete cascade,
  add column if not exists payload jsonb not null default '{}'::jsonb,
  add column if not exists queue_dispatch_at timestamptz;

create unique index if not exists blog_featured_image_one_active_job
  on public.blog_generation_jobs(article_id)
  where job_type='featured_image' and status in ('pending','processing');
