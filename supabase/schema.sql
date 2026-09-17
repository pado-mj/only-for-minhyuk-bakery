create extension if not exists pgcrypto;
create sequence if not exists public.cake_public_number_seq start 1;
create table if not exists public.cakes (
 id uuid primary key default gen_random_uuid(),
 public_id text unique not null,
 public_number bigint unique not null default nextval('public.cake_public_number_seq'),
 nickname varchar(20) not null check (char_length(nickname) between 1 and 20),
 country text,
 letter varchar(500) not null check (char_length(letter) between 1 and 500),
 cake_data jsonb not null default '{}'::jsonb,
 final_image_url text not null,
 view_count bigint not null default 0 check (view_count >= 0),
 status text not null default 'published' check(status in ('published','hidden','removed')),
 created_at timestamptz not null default now()
);
alter table public.cakes enable row level security;
-- Browser has no direct table policies. All reads/writes go through Vercel server functions.
-- In Supabase Storage create a PUBLIC bucket named: cakes
create index if not exists cakes_created_idx on public.cakes(created_at desc) where status='published';
create index if not exists cakes_view_idx on public.cakes(view_count desc) where status='published';
