select cron.unschedule(jobid)
from cron.job
where jobname='recover-stale-featured-image-jobs';

select cron.schedule(
  'recover-stale-featured-image-jobs',
  '*/10 * * * *',
  $job$
    update public.blog_generation_jobs
    set status='failed',
        failure_kind=case
          when status='pending' and created_at < now()-interval '15 minutes' then 'permanent'
          when created_at < now()-interval '7 days' then 'permanent'
          when attempt_count >= max_attempts then 'permanent'
          else 'timeout'
        end,
        error=case
          when status='pending' and created_at < now()-interval '15 minutes'
            then 'The queued image job did not start. Retry featured image generation; the article remains saved.'
          when created_at < now()-interval '7 days'
            then 'The background queue message expired before the image job completed. Retry featured image generation; the article remains saved.'
          when attempt_count >= max_attempts
            then 'The image worker stopped before completing after its automatic retry limit. Retry featured image generation; the article remains saved.'
          else 'The image worker lease expired. The queue may retry this job automatically.'
        end,
        completed_at=case
          when (status='pending' and created_at < now()-interval '15 minutes')
            or created_at < now()-interval '7 days'
            or attempt_count >= max_attempts then now()
          else null
        end,
        lease_expires_at=null,
        heartbeat_at=now()
    where job_type='featured_image'
      and (
        (status='pending' and created_at < now()-interval '15 minutes')
        or (status='processing' and lease_expires_at < now()-interval '1 minute')
        or (status='failed' and failure_kind in ('transient','timeout') and attempt_count >= max_attempts)
        or (status='failed' and failure_kind in ('transient','timeout') and created_at < now()-interval '7 days')
      )
  $job$
);
