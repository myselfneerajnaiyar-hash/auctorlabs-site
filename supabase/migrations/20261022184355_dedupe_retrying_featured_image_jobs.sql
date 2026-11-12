drop index if exists public.blog_featured_image_one_active_job;
create unique index blog_featured_image_one_active_job
  on public.blog_generation_jobs(article_id)
  where job_type='featured_image'
    and (
      status in ('pending','processing')
      or (status='failed' and failure_kind in ('transient','timeout') and attempt_count<max_attempts)
    );
