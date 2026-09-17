-- Reserve one uncached keyword research run atomically per admin.
create or replace function public.reserve_blog_keyword_research(
  p_admin_id uuid, p_fingerprint text, p_request_metadata jsonb, p_daily_limit integer
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_id uuid; v_count integer;
begin
  if p_admin_id is null or p_daily_limit < 1 or p_daily_limit > 100 then
    raise exception 'Invalid keyword research reservation';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(p_admin_id::text, 0));
  if exists(select 1 from public.seo_provider_runs where request_fingerprint=p_fingerprint and status='PROCESSING') then
    return jsonb_build_object('status','deduplicated');
  end if;
  select count(*) into v_count from public.seo_provider_runs
    where created_by=p_admin_id and provider='dataforseo' and capability='keyword_metrics'
      and cache_hit=false and (status='PROCESSING' or request_count > 0)
      and requested_at > now() - interval '24 hours';
  if v_count >= p_daily_limit then
    return jsonb_build_object('status','quota_exceeded');
  end if;
  begin
    insert into public.seo_provider_runs(provider,capability,status,cache_hit,request_fingerprint,request_metadata,request_count,created_by)
      values('dataforseo','keyword_metrics','PROCESSING',false,p_fingerprint,p_request_metadata,0,p_admin_id)
      returning id into v_id;
  exception when unique_violation then
    return jsonb_build_object('status','deduplicated');
  end;
  return jsonb_build_object('status','reserved','id',v_id);
end $$;
revoke all on function public.reserve_blog_keyword_research(uuid,text,jsonb,integer) from public, anon, authenticated;
grant execute on function public.reserve_blog_keyword_research(uuid,text,jsonb,integer) to service_role;
