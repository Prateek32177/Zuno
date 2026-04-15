alter table public.users
  add column if not exists avatar_seed text;

update public.users
set avatar_seed = substr(md5(gen_random_uuid()::text), 1, 12)
where avatar_seed is null or btrim(avatar_seed) = '';

alter table public.users
  alter column avatar_seed set default substr(md5(gen_random_uuid()::text), 1, 12);
