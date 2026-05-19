alter table public.profiles
  add column if not exists gender text check (gender in ('male', 'female'));

alter table public.doctors
  add column if not exists commune text,
  add column if not exists google_maps_link text,
  add column if not exists visual_mode text not null default 'photo' check (visual_mode in ('photo', 'icon')),
  add column if not exists avatar_icon text default 'stethoscope',
  add column if not exists experience_years integer check (experience_years >= 0),
  add column if not exists professional_background text,
  add column if not exists open_days text,
  add column if not exists closed_days text;

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
