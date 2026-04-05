create table if not exists public.portfolio_page_views (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  source text not null,
  path text not null default '/',
  referrer text,
  ip_hash text,
  country text,
  region text,
  city text,
  user_agent text,
  accept_language text,
  screen text,
  viewport text,
  timezone text
);

alter table public.portfolio_page_views enable row level security;

drop policy if exists "Service role can insert portfolio page views" on public.portfolio_page_views;
create policy "Service role can insert portfolio page views"
  on public.portfolio_page_views
  for insert
  to service_role
  with check (true);

drop policy if exists "Service role can read portfolio page views" on public.portfolio_page_views;
create policy "Service role can read portfolio page views"
  on public.portfolio_page_views
  for select
  to service_role
  using (true);

create index if not exists portfolio_page_views_created_at_idx
  on public.portfolio_page_views (created_at desc);

create index if not exists portfolio_page_views_source_idx
  on public.portfolio_page_views (source);

create index if not exists portfolio_page_views_path_idx
  on public.portfolio_page_views (path);

create index if not exists portfolio_page_views_ip_hash_idx
  on public.portfolio_page_views (ip_hash);
