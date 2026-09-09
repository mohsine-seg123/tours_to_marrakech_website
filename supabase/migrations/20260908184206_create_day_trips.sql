create table public.day_trips (
  id uuid primary key default gen_random_uuid(),

  -- General information
  price numeric(10, 2),
  departure_city text not null,

  -- Images
  image_url text not null,
  image_alt text,

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

create index day_trips_published_created_at_idx
on public.day_trips (published, created_at desc);

create index day_trips_en_slug_idx
on public.day_trips ((en->>'slug'));

create index day_trips_fr_slug_idx
on public.day_trips ((fr->>'slug'));

create index day_trips_es_slug_idx
on public.day_trips ((es->>'slug'));


-- ============================================================
-- Updated_at trigger
-- ============================================================

create or replace function public.update_day_trips_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_day_trips_updated_at
before update on public.day_trips
for each row
execute function public.update_day_trips_updated_at();