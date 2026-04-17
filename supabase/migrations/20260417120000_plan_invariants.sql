-- Enforce plan creation invariants at the database layer so API/UI behavior stays consistent.

alter table public.plans
  drop constraint if exists plans_max_people_min_check,
  add constraint plans_max_people_min_check check (max_people >= 1);

alter table public.plans
  drop constraint if exists plans_private_host_mode_check,
  add constraint plans_private_host_mode_check check (
    visibility <> 'private' or host_mode = 'host_managed'
  );

notify pgrst, 'reload schema';
