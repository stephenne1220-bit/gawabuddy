-- Gawa App Supabase schema
-- Run in Supabase SQL editor. Enable email auth in Authentication settings.

-- Profiles
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  name text,
  email text,
  currency text default 'KES',
  month_start_day int default 1,
  monthly_income numeric default 0,
  onboarding_complete boolean default false,
  dark_mode boolean default false,
  budget_rollover boolean default true,
  emergency_fund_months int default 3,
  created_at timestamptz default now()
);

-- Accounts
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  balance numeric default 0,
  color text,
  created_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  group_name text not null check (group_name in ('Needs','Wants','Savings','Debt')),
  icon text,
  color text,
  monthly_limit numeric default 0,
  is_default boolean default false
);

-- Transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  type text not null check (type in ('income','expense')),
  amount numeric not null,
  category_id uuid references categories(id),
  account_id uuid references accounts(id),
  date date not null,
  note text,
  recurring text,
  created_at timestamptz default now()
);

-- Recurring items
create table if not exists recurring_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  type text not null check (type in ('income','expense')),
  amount numeric not null,
  category_id uuid references categories(id),
  account_id uuid references accounts(id),
  frequency text check (frequency in ('weekly','monthly','yearly')),
  next_due_date date,
  is_active boolean default true
);

-- Savings goals
create table if not exists savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  target_amount numeric not null,
  current_amount numeric default 0,
  deadline date,
  color text,
  is_emergency boolean default false,
  created_at timestamptz default now()
);

create table if not exists savings_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  goal_id uuid references savings_goals(id) on delete cascade,
  amount numeric not null,
  type text check (type in ('deposit','withdrawal')),
  date date,
  note text
);

-- Debts
create table if not exists debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  lender text,
  total_amount numeric not null,
  balance numeric not null,
  interest_rate numeric default 0,
  min_payment numeric default 0,
  due_date text,
  created_at timestamptz default now()
);

create table if not exists debt_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  debt_id uuid references debts(id) on delete cascade,
  amount numeric not null,
  date date,
  note text
);

-- Wishlist
create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  estimated_cost numeric not null,
  amount_saved numeric default 0,
  priority text check (priority in ('High','Medium','Low')),
  target_date date,
  category text,
  notes text,
  link text,
  status text default 'Planned' check (status in ('Planned','Saving','Bought')),
  created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
alter table accounts enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;
alter table recurring_items enable row level security;
alter table savings_goals enable row level security;
alter table savings_transactions enable row level security;
alter table debts enable row level security;
alter table debt_payments enable row level security;
alter table wishlist_items enable row level security;

create policy "own profile" on profiles for all using (auth.uid() = id);
create policy "own accounts" on accounts for all using (auth.uid() = user_id);
create policy "own categories" on categories for all using (auth.uid() = user_id);
create policy "own transactions" on transactions for all using (auth.uid() = user_id);
create policy "own recurring" on recurring_items for all using (auth.uid() = user_id);
create policy "own savings_goals" on savings_goals for all using (auth.uid() = user_id);
create policy "own savings_tx" on savings_transactions for all using (auth.uid() = user_id);
create policy "own debts" on debts for all using (auth.uid() = user_id);
create policy "own debt_payments" on debt_payments for all using (auth.uid() = user_id);
create policy "own wishlist" on wishlist_items for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
