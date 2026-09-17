create table if not exists public.blog_article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.blog_articles(id) on delete cascade,
  version integer not null,
  slug text not null,
  status public.blog_article_status not null,
  title text not null,
  description text not null,
  content text not null,
  frontmatter jsonb not null default '{}'::jsonb,
  brief jsonb,
  created_by uuid references public.blog_admins(id),
  created_at timestamptz not null default now(),
  unique(article_id, version)
);

create table if not exists public.blog_redirects (
  id uuid primary key default gen_random_uuid(),
  old_path text not null unique,
  new_path text not null,
  status_code integer not null default 308 check (status_code in (301, 308, 410)),
  active boolean not null default true,
  created_by uuid references public.blog_admins(id),
  created_at timestamptz not null default now(),
  constraint blog_redirect_not_loop check (old_path <> new_path)
);

alter table public.blog_generation_jobs add column if not exists heartbeat_at timestamptz;
alter table public.blog_generation_jobs add column if not exists max_attempts integer not null default 3;
alter table public.blog_generation_jobs add column if not exists failure_kind text check (failure_kind in ('transient','permanent','timeout'));
alter table public.blog_generation_jobs add column if not exists idempotency_key text;
create unique index if not exists blog_jobs_idempotency_key on public.blog_generation_jobs(idempotency_key) where idempotency_key is not null;

create or replace function public.claim_blog_generation_job(target_id uuid,lease_seconds integer default 300) returns public.blog_generation_jobs
language plpgsql security definer set search_path=public as $$
declare claimed public.blog_generation_jobs;
begin
  update public.blog_generation_jobs set status='processing',attempt_count=attempt_count+1,
    started_at=coalesce(started_at,now()),heartbeat_at=now(),lease_expires_at=now()+make_interval(secs=>lease_seconds),error=null,failure_kind=null
  where id=target_id and attempt_count<max_attempts and (status='pending' or (status='failed' and failure_kind in ('transient','timeout')) or (status='processing' and lease_expires_at<now()))
  returning * into claimed;
  return claimed;
end $$;
revoke all on function public.claim_blog_generation_job(uuid,integer) from public;
grant execute on function public.claim_blog_generation_job(uuid,integer) to service_role;

create or replace function public.capture_blog_article_revision() returns trigger language plpgsql security definer set search_path=public as $$
declare next_version integer;
begin
  if row(old.title,old.description,old.content,old.frontmatter,old.brief,old.slug,old.status)
     is distinct from row(new.title,new.description,new.content,new.frontmatter,new.brief,new.slug,new.status) then
    select coalesce(max(version),0)+1 into next_version from public.blog_article_revisions where article_id=old.id;
    insert into public.blog_article_revisions(article_id,version,slug,status,title,description,content,frontmatter,brief,created_by)
    values(old.id,next_version,old.slug,old.status,old.title,old.description,old.content,old.frontmatter,old.brief,new.updated_by);
  end if;
  return new;
end $$;

drop trigger if exists blog_articles_capture_revision on public.blog_articles;
create trigger blog_articles_capture_revision before update on public.blog_articles for each row execute function public.capture_blog_article_revision();

alter table public.blog_article_revisions enable row level security;
alter table public.blog_redirects enable row level security;
create policy "admins read revisions" on public.blog_article_revisions for select using (public.is_blog_admin());
create policy "owners delete revisions" on public.blog_article_revisions for delete using (public.is_blog_owner());
create policy "public reads active redirects" on public.blog_redirects for select using (active=true);
create policy "admins manage redirects" on public.blog_redirects for all using (public.is_blog_admin()) with check (public.is_blog_admin());

create or replace function public.rename_blog_article(article_slug text,new_slug text,admin_id uuid) returns public.blog_articles
language plpgsql security definer set search_path=public as $$
declare changed public.blog_articles;
begin
  if new_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'Invalid article slug'; end if;
  if article_slug=new_slug then raise exception 'New slug matches current slug'; end if;
  insert into public.blog_redirects(old_path,new_path,status_code,created_by)
  values('/blog/'||article_slug,'/blog/'||new_slug,308,admin_id)
  on conflict(old_path) do update set new_path=excluded.new_path,status_code=308,active=true;
  update public.blog_articles set slug=new_slug,updated_by=admin_id where slug=article_slug returning * into changed;
  if changed.id is null then raise exception 'Article not found'; end if;
  return changed;
end $$;
revoke all on function public.rename_blog_article(text,text,uuid) from public;
grant execute on function public.rename_blog_article(text,text,uuid) to service_role;
