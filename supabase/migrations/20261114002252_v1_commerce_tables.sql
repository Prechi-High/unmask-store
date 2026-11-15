CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts (id),
  store_id uuid REFERENCES public.stores (id),
  order_id uuid,
  kind text NOT NULL CHECK (kind IN ('platform_subscription', 'customer_checkout', 'payout')),
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'NGN',
  status text NOT NULL DEFAULT 'pending',
  provider text NOT NULL DEFAULT 'paystack',
  provider_reference text,
  provider_transaction_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL UNIQUE REFERENCES public.stores (id) ON DELETE CASCADE,
  theme_id text NOT NULL DEFAULT 'beauty_minimal',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  checkout_enabled boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_themes (
  id text PRIMARY KEY,
  name text NOT NULL,
  tokens jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.store_products (id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.store_products (id) ON DELETE CASCADE,
  title text NOT NULL,
  sku text,
  price numeric,
  inventory_quantity integer NOT NULL DEFAULT 0,
  options jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_products
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS brand_name text,
  ADD COLUMN IF NOT EXISTS ingredients text,
  ADD COLUMN IF NOT EXISTS size_volume text,
  ADD COLUMN IF NOT EXISTS usage_info text,
  ADD COLUMN IF NOT EXISTS shipping_info text;

DO $$ BEGIN
  ALTER TABLE public.store_products ADD COLUMN visibility text NOT NULL DEFAULT 'visible';
EXCEPTION WHEN duplicate_column THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.store_products ADD COLUMN onmask_product_id uuid;
EXCEPTION WHEN duplicate_column THEN NULL; END $$;
