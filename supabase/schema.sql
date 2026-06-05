create extension if not exists "pgcrypto";

create type public.app_role as enum ('curator', 'judge', 'admin', 'viewer');
create type public.challenge_type as enum ('intellectual', 'action', 'result');
create type public.event_type as enum (
  'weekly_meeting',
  'cultural_camp',
  'walkthrough',
  'workshop',
  'small_festival',
  'milestone',
  'final_event'
);

create table public.curations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_cn text not null,
  name_en text,
  bucket text not null,
  display_order int,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key,
  email text unique,
  name_cn text not null,
  name_en text,
  phone text,
  role public.app_role not null default 'viewer',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.curation_members (
  id uuid primary key default gen_random_uuid(),
  curation_id uuid not null references public.curations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  is_primary boolean not null default false,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  type public.event_type not null,
  name_cn text not null,
  name_en text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_mandatory boolean not null default true,
  year_month text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_attendance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  curation_id uuid not null references public.curations(id) on delete cascade,
  attended boolean not null,
  is_grace boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, curation_id)
);

create table public.monthly_scores (
  id uuid primary key default gen_random_uuid(),
  curation_id uuid not null references public.curations(id) on delete cascade,
  year_month text not null,
  a_delivery numeric(4,1) not null default 0,
  b1_internal smallint check (b1_internal in (5, 10, 15)),
  b2_peer smallint not null default 0 check (b2_peer between 0 and 15),
  c_depth_total smallint not null default 0 check (c_depth_total between 0 and 40),
  fengyun_total smallint not null default 0,
  base_total numeric(5,1) generated always as (a_delivery + coalesce(b1_internal, 0) + b2_peer + c_depth_total) stored,
  month_total numeric(5,1) generated always as (a_delivery + coalesce(b1_internal, 0) + b2_peer + c_depth_total + fengyun_total) stored,
  locked boolean not null default false,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curation_id, year_month)
);

create table public.peer_votes (
  id uuid primary key default gen_random_uuid(),
  year_month text not null,
  voter_curation_id uuid not null references public.curations(id) on delete cascade,
  best_curation_id uuid not null references public.curations(id) on delete cascade,
  improved_curation_id uuid not null references public.curations(id) on delete cascade,
  submitted_at timestamptz not null default now(),
  unique (year_month, voter_curation_id),
  check (best_curation_id <> voter_curation_id),
  check (improved_curation_id <> voter_curation_id)
);

create table public.content_checks (
  id uuid primary key default gen_random_uuid(),
  curation_id uuid not null references public.curations(id) on delete cascade,
  item_key text not null,
  item_type text not null check (item_type in ('depth', 'production')),
  points smallint not null,
  ticked_at timestamptz,
  ticked_by uuid references public.profiles(id),
  evidence text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (curation_id, item_key)
);

create table public.fengyun_challenges (
  id uuid primary key default gen_random_uuid(),
  year_month text not null,
  challenge_type public.challenge_type not null,
  name_cn text not null,
  name_en text,
  criterion_cn text not null,
  max_points smallint not null,
  max_winners smallint not null default 1,
  is_event_day boolean not null default false,
  event_day_date date,
  announced_at timestamptz,
  deadline timestamptz,
  pool_share smallint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.fengyun_submissions (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.fengyun_challenges(id) on delete cascade,
  curation_id uuid not null references public.curations(id) on delete cascade,
  submitted_by uuid references public.profiles(id),
  evidence_text text,
  evidence_file_ids uuid[],
  submitted_at timestamptz not null default now(),
  unique (challenge_id, curation_id)
);

create table public.fengyun_verdicts (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.fengyun_challenges(id) on delete cascade,
  curation_id uuid not null references public.curations(id) on delete cascade,
  points_awarded smallint not null,
  verdict_notes text,
  decided_by uuid references public.profiles(id),
  decided_at timestamptz not null default now(),
  unique (challenge_id, curation_id)
);

create table public.monthly_owners (
  year_month text primary key,
  owner_user_id uuid references public.profiles(id),
  theme_cn text
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);

create or replace view public.board_scores as
select
  ms.year_month,
  c.id as curation_id,
  c.slug as curation_slug,
  c.name_cn as curation_name_cn,
  c.name_en as curation_name_en,
  ms.a_delivery,
  coalesce(ms.b1_internal, 0) + ms.b2_peer as b_quality,
  ms.c_depth_total,
  ms.fengyun_total,
  ms.base_total,
  ms.month_total,
  sum(ms.month_total) over (partition by c.id order by ms.year_month) as ytd_total,
  rank() over (partition by ms.year_month order by ms.month_total desc, c.display_order asc) as month_rank
from public.monthly_scores ms
join public.curations c on c.id = ms.curation_id
where c.active = true;

create or replace function public.current_user_role()
returns public.app_role
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

alter table public.curations enable row level security;
alter table public.profiles enable row level security;
alter table public.curation_members enable row level security;
alter table public.events enable row level security;
alter table public.event_attendance enable row level security;
alter table public.monthly_scores enable row level security;
alter table public.peer_votes enable row level security;
alter table public.content_checks enable row level security;
alter table public.fengyun_challenges enable row level security;
alter table public.fengyun_submissions enable row level security;
alter table public.fengyun_verdicts enable row level security;
alter table public.monthly_owners enable row level security;
alter table public.audit_log enable row level security;

create policy "Public can read active curations"
  on public.curations for select
  using (active = true);

create policy "Admins manage curations"
  on public.curations for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy "Users read own profile"
  on public.profiles for select
  using (id = auth.uid() or public.current_user_role() in ('judge', 'admin'));

create policy "Admins manage profiles"
  on public.profiles for all
  using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy "Public can read locked monthly scores"
  on public.monthly_scores for select
  using (locked = true or public.current_user_role() in ('curator', 'judge', 'admin'));

create policy "Judges manage monthly scores"
  on public.monthly_scores for all
  using (public.current_user_role() in ('judge', 'admin'))
  with check (public.current_user_role() in ('judge', 'admin'));

create policy "Curators read and create own peer vote"
  on public.peer_votes for insert
  with check (
    public.current_user_role() in ('curator', 'judge', 'admin')
    and exists (
      select 1 from public.curation_members cm
      where cm.curation_id = voter_curation_id
      and cm.user_id = auth.uid()
      and cm.left_at is null
    )
  );

create policy "Judges read peer votes"
  on public.peer_votes for select
  using (public.current_user_role() in ('judge', 'admin'));

create policy "Public can read announced challenges"
  on public.fengyun_challenges for select
  using (announced_at is not null or public.current_user_role() in ('judge', 'admin'));

create policy "Judges manage challenges"
  on public.fengyun_challenges for all
  using (public.current_user_role() in ('judge', 'admin'))
  with check (public.current_user_role() in ('judge', 'admin'));

create policy "Curators manage own submissions"
  on public.fengyun_submissions for all
  using (
    public.current_user_role() in ('judge', 'admin')
    or exists (
      select 1 from public.curation_members cm
      where cm.curation_id = fengyun_submissions.curation_id
      and cm.user_id = auth.uid()
      and cm.left_at is null
    )
  )
  with check (
    public.current_user_role() in ('judge', 'admin')
    or exists (
      select 1 from public.curation_members cm
      where cm.curation_id = fengyun_submissions.curation_id
      and cm.user_id = auth.uid()
      and cm.left_at is null
    )
  );

create policy "Public can read verdicts"
  on public.fengyun_verdicts for select
  using (true);

create policy "Judges manage verdicts"
  on public.fengyun_verdicts for all
  using (public.current_user_role() in ('judge', 'admin'))
  with check (public.current_user_role() in ('judge', 'admin'));
