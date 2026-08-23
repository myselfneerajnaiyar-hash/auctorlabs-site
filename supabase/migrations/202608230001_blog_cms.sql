create extension if not exists pgcrypto;

create type public.blog_admin_role as enum ('owner','editor');
create type public.blog_article_status as enum ('draft','published','archived');
create type public.blog_job_status as enum ('pending','processing','complete','failed');
create type public.blog_asset_type as enum ('featured','inline');

create table public.blog_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role public.blog_admin_role not null default 'editor',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.blog_articles (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  status public.blog_article_status not null default 'draft', title text not null,
  description text not null default '', content text not null default '', frontmatter jsonb not null default '{}'::jsonb,
  brief jsonb, created_by uuid references public.blog_admins(id), updated_by uuid references public.blog_admins(id),
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint blog_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.blog_assets (
  id uuid primary key default gen_random_uuid(), article_id uuid not null references public.blog_articles(id) on delete cascade,
  asset_type public.blog_asset_type not null, image_key text not null, prompt text not null default '', alt_text text not null default '',
  placement text, status text not null default 'planned', public_url text, storage_path text, generation_error text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(article_id,image_key)
);

create table public.blog_generation_jobs (
  id uuid primary key default gen_random_uuid(), requested_by uuid not null references public.blog_admins(id),
  topic text not null, audience text not null, status public.blog_job_status not null default 'pending',
  stages jsonb not null default '{}'::jsonb, progress jsonb, result jsonb, error text,
  attempt_count integer not null default 0, lease_expires_at timestamptz,
  created_at timestamptz not null default now(), started_at timestamptz, completed_at timestamptz, updated_at timestamptz not null default now()
);

create or replace function public.is_blog_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.blog_admins where user_id=auth.uid() and active=true)
$$;
create or replace function public.is_blog_owner() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.blog_admins where user_id=auth.uid() and active=true and role='owner')
$$;
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$begin new.updated_at=now();return new;end$$;
create trigger blog_articles_touch before update on public.blog_articles for each row execute function public.touch_updated_at();
create trigger blog_assets_touch before update on public.blog_assets for each row execute function public.touch_updated_at();
create trigger blog_jobs_touch before update on public.blog_generation_jobs for each row execute function public.touch_updated_at();

alter table public.blog_admins enable row level security;
alter table public.blog_articles enable row level security;
alter table public.blog_assets enable row level security;
alter table public.blog_generation_jobs enable row level security;
create policy "admins can read own authorization" on public.blog_admins for select using (user_id=auth.uid() and active=true);
create policy "owners manage admins" on public.blog_admins for all using (public.is_blog_owner()) with check (public.is_blog_owner());
create policy "admins manage articles" on public.blog_articles for all using (public.is_blog_admin()) with check (public.is_blog_admin());
create policy "public reads published articles" on public.blog_articles for select using (status='published');
create policy "admins manage assets" on public.blog_assets for all using (public.is_blog_admin()) with check (public.is_blog_admin());
create policy "public reads published assets" on public.blog_assets for select using (exists(select 1 from public.blog_articles a where a.id=article_id and a.status='published'));
create policy "admins manage jobs" on public.blog_generation_jobs for all using (public.is_blog_admin()) with check (public.is_blog_admin());

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('blog-assets','blog-assets',true,10485760,array['image/png','image/jpeg','image/webp'])
on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create policy "public reads blog assets" on storage.objects for select using (bucket_id='blog-assets');
create policy "admins upload blog assets" on storage.objects for insert with check (bucket_id='blog-assets' and public.is_blog_admin());
create policy "admins update blog assets" on storage.objects for update using (bucket_id='blog-assets' and public.is_blog_admin());
create policy "admins delete blog assets" on storage.objects for delete using (bucket_id='blog-assets' and public.is_blog_admin());

-- Bootstrap only after both Auth users exist. Replace values, run once, then add future editors similarly.
-- insert into public.blog_admins(user_id,email,name,role)
-- select id,email,'Owner name','owner' from auth.users where email='owner@auctorlabs.in';
-- insert into public.blog_admins(user_id,email,name,role)
-- select id,email,'Cofounder name','editor' from auth.users where email='cofounder@auctorlabs.in';
