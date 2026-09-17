-- Forward-only lifecycle extension. Existing rows are unchanged.
alter type public.blog_article_status add value if not exists 'unpublished' after 'published';
