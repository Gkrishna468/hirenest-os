// Supabase client — dynamically loaded only when env vars are present
// Falls back to null stubs so the app works without Supabase configured

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
const supabaseKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

export const isSupabaseConnected = !!supabaseUrl && !!supabaseKey;

// Minimal type stubs so consumers can type-check without the real package
export type SupabaseAuthResponse = {
  data: {
    user: { id: string; email?: string } | null;
    session: unknown | null;
  };
  error: { message: string } | null;
};

type QueryResult = { data: any; error: any; count?: number | null };

type QueryBuilder = {
  select: (...args: unknown[]) => QueryBuilder;
  insert: (data: unknown) => QueryBuilder;
  upsert: (data: unknown) => QueryBuilder;
  update: (data: unknown) => QueryBuilder;
  delete: () => QueryBuilder;
  eq: (col: string, val: unknown) => QueryBuilder;
  neq: (col: string, val: unknown) => QueryBuilder;
  gte: (col: string, val: unknown) => QueryBuilder;
  lte: (col: string, val: unknown) => QueryBuilder;
  gt: (col: string, val: unknown) => QueryBuilder;
  lt: (col: string, val: unknown) => QueryBuilder;
  in: (col: string, vals: unknown[]) => QueryBuilder;
  contains: (col: string, val: unknown) => QueryBuilder;
  order: (col: string, opts?: unknown) => QueryBuilder;
  limit: (n: number) => QueryBuilder;
  range: (from: number, to: number) => QueryBuilder;
  single: () => Promise<QueryResult>;
  maybeSingle: () => Promise<QueryResult>;
  then: <T>(
    resolve: (val: QueryResult) => T,
    reject?: (err: unknown) => T,
  ) => Promise<T>;
  count?: number | null;
} & Promise<QueryResult>;

type RealtimeChannel = {
  on: (...args: unknown[]) => RealtimeChannel;
  subscribe: (cb?: unknown) => { unsubscribe: () => void };
};

type SupabaseAuth = {
  signInWithPassword: (opts: {
    email: string;
    password: string;
  }) => Promise<SupabaseAuthResponse>;
  signUp: (opts: {
    email: string;
    password: string;
    options?: unknown;
  }) => Promise<SupabaseAuthResponse>;
  signOut: () => Promise<void>;
  getUser: () => Promise<{
    data: { user: { id: string; email?: string } | null };
    error: unknown;
  }>;
  getSession: () => Promise<{ data: { session: unknown | null } }>;
  onAuthStateChange: (cb: (event: string, session: unknown) => void) => {
    data: { subscription: { unsubscribe: () => void } };
  };
};

export type SupabaseClient = {
  auth: SupabaseAuth;
  from: (table: string) => QueryBuilder;
  channel: (name: string) => RealtimeChannel;
  removeChannel: (channel: RealtimeChannel | unknown) => void;
};

function createSupabaseClient(url: string, key: string): SupabaseClient {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@supabase/supabase-js") as {
      createClient: (url: string, key: string) => SupabaseClient;
    };
    return createClient(url, key);
  } catch {
    throw new Error("@supabase/supabase-js not installed");
  }
}

export const supabase: SupabaseClient | null = isSupabaseConnected
  ? createSupabaseClient(supabaseUrl, supabaseKey)
  : null;

export const SUPABASE_SCHEMA = `
-- Run this SQL in your Supabase SQL Editor to set up HireNest OS

create table public.requirements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  skills text[] not null default '{}',
  budget_min int,
  budget_max int,
  location text,
  experience_min int,
  experience_max int,
  description text,
  status text default 'active',
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  skills text[] not null default '{}',
  experience int,
  rate int,
  availability text default 'available',
  is_verified boolean default false,
  location text,
  bio text,
  vendor_id text,
  created_at timestamptz default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid references requirements(id),
  candidate_id uuid references candidates(id),
  vendor_id text not null default 'vendor-1',
  match_score int,
  status text default 'submitted',
  notes text,
  created_at timestamptz default now()
);

create table public.profiles (
  id uuid primary key,
  email text,
  name text,
  role text,
  company_name text,
  created_at timestamptz default now()
);

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  placement_id uuid,
  client_name text not null,
  candidate_name text not null,
  vendor_name text not null,
  client_amount numeric(12,2) not null,
  vendor_payout numeric(12,2) not null,
  platform_commission numeric(12,2) not null,
  placement_type text default 'contract',
  status text default 'pending',
  invoice_due_date date,
  created_at timestamptz default now()
);

create table public.match_queue (
  id text primary key,
  requirement_title text not null,
  candidate_name text not null,
  vendor_name text not null,
  match_score int not null,
  status text default 'Pending AI Review',
  created_at timestamptz default now()
);

create table public.disputes (
  id text primary key,
  dispute_type text not null,
  parties text not null,
  status text default 'Open',
  created_at timestamptz default now()
);

create table public.vendor_subscriptions (
  id uuid primary key default gen_random_uuid(),
  vendor_id text not null,
  plan text not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists public.placement_transactions (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid references requirements(id),
  candidate_id uuid references candidates(id),
  vendor_id text not null,
  status text not null default 'submitted',
  match_score int default 0,
  notes text,
  total_budget numeric(12,2),
  your_commission numeric(12,2),
  vendor_payout numeric(12,2),
  client_payment_status text default 'pending',
  vendor_payout_status text default 'pending',
  joined_date timestamptz,
  created_at timestamptz default now()
);
alter publication supabase_realtime add table submissions;
alter publication supabase_realtime add table placement_transactions;
`;
