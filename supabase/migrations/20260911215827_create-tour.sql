create table public.tours (
  id uuid primary key default gen_random_uuid(),

  -- General information
  price numeric(10, 2),
  departure_city text not null,
  duration text not null,
  type_tour text not null,
  map_title text not null,
  map_url text not null,

  -- Images
  image_url1 text not null,
  image_alt1 text,

  image_url2 text,
  image_alt2 text,

  image_url3 text,
  image_alt3 text,



  -- Publication
  published boolean not null default false,

  -- Multilingual content
  en jsonb not null,
  fr jsonb,
  es jsonb,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ============================================================
-- Indexes
-- ============================================================

create index tours_published_created_at_idx
on public.tours (published, created_at desc);

create index tours_en_slug_idx
on public.tours ((en->>'slug'));

create index tours_fr_slug_idx
on public.tours ((fr->>'slug'));

create index tours_es_slug_idx
on public.tours ((es->>'slug'));


-- ============================================================
-- Updated_at trigger
-- ============================================================

create or replace function public.update_tours_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create trigger update_tours_updated_at
before update on public.tours
for each row
execute function public.update_tours_updated_at();