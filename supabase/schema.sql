create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'user' check (role in ('doctor', 'pharmacist', 'user', 'admin')),
  phone text,
  gender text check (gender in ('male', 'female')),
  created_at timestamptz not null default now()
);

create table if not exists public.pharmacies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  city text not null,
  address text,
  phone text,
  latitude numeric,
  longitude numeric,
  google_maps_link text,
  created_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  speciality text,
  photo_url text,
  phone text,
  city text,
  commune text,
  address text,
  google_maps_link text,
  visual_mode text not null default 'photo' check (visual_mode in ('photo', 'icon')),
  avatar_icon text default 'stethoscope',
  experience_years integer check (experience_years >= 0),
  professional_background text,
  open_days text,
  closed_days text,
  is_open_24_7 boolean not null default false,
  open_time text,
  close_time text,
  is_available boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('doctor', 'pharmacy')),
  target_id uuid not null,
  rating smallint not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create or replace view public.review_summary as
select
  target_type,
  target_id,
  avg(rating)::numeric(3,2) as average_rating,
  count(*) as review_count
from public.reviews
group by target_type, target_id;

alter table public.profiles add column if not exists gender text check (gender in ('male', 'female'));

alter table public.doctors add column if not exists commune text;
alter table public.doctors add column if not exists google_maps_link text;
alter table public.doctors add column if not exists visual_mode text not null default 'photo' check (visual_mode in ('photo', 'icon'));
alter table public.doctors add column if not exists avatar_icon text default 'stethoscope';
alter table public.doctors add column if not exists experience_years integer check (experience_years >= 0);
alter table public.doctors add column if not exists professional_background text;
alter table public.doctors add column if not exists open_days text;
alter table public.doctors add column if not exists closed_days text;

create table if not exists public.medicines (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  dosage text,
  form text,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.stock (
  id uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references public.pharmacies(id) on delete cascade,
  medicine_id uuid not null references public.medicines(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  unique (pharmacy_id, medicine_id)
);

create table if not exists public.medicine_search_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  medicine_name text not null,
  searched_at timestamptz not null default now()
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id uuid,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, gender)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'user'),
    nullif(new.raw_user_meta_data ->> 'gender', '')
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      role = excluded.role,
      gender = excluded.gender;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.pharmacies enable row level security;
alter table public.doctors enable row level security;
alter table public.medicines enable row level security;
alter table public.stock enable row level security;
alter table public.medicine_search_logs enable row level security;
alter table public.admin_logs enable row level security;
alter table public.reviews enable row level security;

create policy "profiles read own or admin" on public.profiles for select to authenticated using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "profiles insert self" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles update self or admin" on public.profiles for update to authenticated using (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (auth.uid() = id or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "public can read pharmacies" on public.pharmacies for select to anon, authenticated using (true);
create policy "pharmacist manage own pharmacies or admin" on public.pharmacies for all to authenticated using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "public can read doctors" on public.doctors for select to anon, authenticated using (true);
create policy "doctor manage own profile or admin" on public.doctors for all to authenticated using (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "public can read medicines" on public.medicines for select to anon, authenticated using (true);
create policy "pharmacist or admin create medicines" on public.medicines for insert to authenticated with check (auth.uid() = created_by or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "pharmacist or admin update medicines" on public.medicines for update to authenticated using (created_by = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (created_by = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "public can read stock" on public.stock for select to anon, authenticated using (true);
create policy "pharmacist or admin manage stock" on public.stock for all to authenticated using (exists (select 1 from public.pharmacies ph where ph.id = pharmacy_id and (ph.user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')))) with check (exists (select 1 from public.pharmacies ph where ph.id = pharmacy_id and (ph.user_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))));

create policy "authenticated can insert search logs" on public.medicine_search_logs for insert to authenticated with check (user_id = auth.uid());
create policy "admin can read search logs" on public.medicine_search_logs for select to authenticated using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "public can read reviews" on public.reviews for select to anon, authenticated using (true);
create policy "authenticated insert reviews" on public.reviews for insert to authenticated with check (reviewer_id = auth.uid());
create policy "review owner or admin manage reviews" on public.reviews for all to authenticated using (reviewer_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (reviewer_id = auth.uid() or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "admin manage admin logs" on public.admin_logs for all to authenticated using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')) with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));
