create table public.activities(
  id uuid default gen_random_uuid() primary key,
  category text not null,
  price numeric(10,2),
  image_url1 text,
  image_alt1 text,
  image_url2 text,
  image_alt2 text,
  created_at timestamp with time zone default now(),
  published boolean not null default true,

  en jsonb not null default '{}'::jsonb,
  fr jsonb not null default '{}'::jsonb,
  es jsonb not null default '{}'::jsonb
);

-- Index pour la recherche rapide par slug, par langue
create index idx_activities_en_slug on public.activities ((en->>'slug'));
create index idx_activities_fr_slug on public.activities ((fr->>'slug'));
create index idx_activities_es_slug on public.activities ((es->>'slug'));

-- Index sur la catégorie pour filtrer rapidement (ex: day-trips, tours, activities)
create index idx_activities_category on public.activities (category);

-- Activation de RLS
alter table public.activities enable row level security;

-- Lecture publique uniquement pour les activités publiées
create policy "Lecture publique" on public.activities
for select using (published = true);