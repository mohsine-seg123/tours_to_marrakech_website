create table public.posts(
    id uuid default gen_random_uuid() primary key,
    cover_image text,
    created_at timestamp with time zone default now(),
    alt_image text,
    timeread text not null default '5 min read',
    published boolean not null default true,

    en jsonb not null default '{}'::jsonb,
    fr jsonb not null default '{}'::jsonb,
    es jsonb not null default '{}'::jsonb
);


-- Index pour la recherche rapide par slug par langue
create index idx_posts_en_slug on public.posts ((en->>'slug'));
create index idx_posts_fr_slug on public.posts ((fr->>'slug'));
create index idx_posts_es_slug on public.posts ((es->>'slug'));

-- Activation de RLS
alter table public.posts enable row level security;

-- Lecture publique pour les articles publiés
create policy "Lecture publique" on public.posts 
  for select using (published = true);