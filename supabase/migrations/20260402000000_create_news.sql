-- news テーブル作成
create table if not exists public.news (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null default '',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- updated_at 自動更新トリガー
drop trigger if exists set_updated_at on public.news;
create trigger set_updated_at
  before update on public.news
  for each row execute function update_updated_at();

-- RLS
alter table public.news enable row level security;

create policy "Allow all operations" on public.news
  for all using (true) with check (true);

-- インデックス
create index if not exists idx_news_published_at on public.news (published_at desc);
create index if not exists idx_news_published on public.news (published);
