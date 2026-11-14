-- OnMask Standalone Commerce V1 schema extensions (incremental over existing tables)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles (auth.users companion)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  account_type text CHECK (account_type IN ('seller', 'brand')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('seller', 'brand')),
  owner_user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS account_id uuid REFERENCES public.accounts (id);

CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL UNIQUE REFERENCES public.accounts (id) ON DELETE CASCADE,
  name text NOT NULL,
  legal_name text,
  contact_email text NOT NULL,
  phone text,
  country text NOT NULL DEFAULT 'NG',
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brand_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brand_profiles (id) ON DELETE CASCADE,
  seller_id uuid NOT NULL REFERENCES public.sellers (id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'seller',
  status text NOT NULL DEFAULT 'active',
  joined_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brand_id, seller_id)
);

CREATE TABLE IF NOT EXISTS public.brand_invitation_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.brand_profiles (id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  slug text NOT NULL,
  max_uses integer,
  use_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  enabled boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  audience text NOT NULL CHECK (audience IN ('seller', 'brand')),
  price numeric NOT NULL,
  currency text NOT NULL DEFAULT 'NGN',
  billing_interval text NOT NULL DEFAULT 'monthly',
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.plan_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.plans (id) ON DELETE CASCADE,
  key text NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (plan_id, key)
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid NOT NULL REFERENCES public.accounts (id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.plans (id),
  status text NOT NULL DEFAULT 'pending',
  current_period_start timestamptz,
  current_period_end timestamptz,
  payment_provider text DEFAULT 'paystack',
  payment_reference text,
  provider_transaction_id text,
  payment_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

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
  product_id uuid NOT NULL,
  url text NOT NULL,
  alt text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
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
  ADD COLUMN IF NOT EXISTS shipping_info text,
  ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'visible',
  ADD COLUMN IF NOT EXISTS onmask_product_id uuid;

CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  email text,
  phone text,
  full_name text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  session_token text,
  customer_id uuid REFERENCES public.customers (id),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id uuid NOT NULL REFERENCES public.carts (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.store_products (id) ON DELETE CASCADE,
  variant_id uuid REFERENCES public.product_variants (id),
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.customers (id),
  order_number text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  currency text NOT NULL DEFAULT 'NGN',
  subtotal numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  shipping_address jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (store_id, order_number)
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.store_products (id),
  variant_id uuid REFERENCES public.product_variants (id),
  title text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  line_total numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payments
  ADD CONSTRAINT payments_order_fkey FOREIGN KEY (order_id) REFERENCES public.orders (id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS public.shipping (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores (id) ON DELETE CASCADE,
  name text NOT NULL,
  rate numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'NGN',
  regions text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.onmask_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES public.sellers (id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'disconnected',
  scopes text[] DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES public.accounts (id),
  seller_id uuid REFERENCES public.sellers (id),
  brand_id uuid REFERENCES public.brand_profiles (id),
  event_type text NOT NULL,
  actor_user_id uuid REFERENCES auth.users (id),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Theme seeds
INSERT INTO public.store_themes (id, name, tokens) VALUES
  ('beauty_minimal', 'Beauty Minimal', '{"font":"ui-sans-serif","accent":"#1a1a1a","surface":"#fafafa"}'),
  ('beauty_boutique', 'Beauty Boutique', '{"font":"Georgia,serif","accent":"#8b5a3c","surface":"#f9f5f0"}'),
  ('beauty_editorial', 'Beauty Editorial', '{"font":"Helvetica Neue,sans-serif","accent":"#000","surface":"#fff"}'),
  ('beauty_luxury', 'Beauty Luxury', '{"font":"Didot,serif","accent":"#c9a962","surface":"#0f0f0f"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.plans (code, name, audience, price, currency, billing_interval, status) VALUES
  ('seller_standard', 'Seller Standard', 'seller', 15000, 'NGN', 'monthly', 'active'),
  ('seller_brand_program', 'Brand Program Seller', 'seller', 10000, 'NGN', 'monthly', 'active'),
  ('brand_starter', 'Brand Starter', 'brand', 50000, 'NGN', 'monthly', 'active')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.plan_entitlements (plan_id, key, value)
SELECT p.id, e.key, to_jsonb(e.val)
FROM (
  VALUES
    ('seller_standard', 'max_stores', 1),
    ('seller_standard', 'max_products', 500),
    ('seller_brand_program', 'max_stores', 1),
    ('seller_brand_program', 'max_products', 500),
    ('brand_starter', 'max_sellers', 10)
) AS e(plan_code, key, val)
JOIN public.plans p ON p.code = e.plan_code
ON CONFLICT (plan_id, key) DO NOTHING;

-- Helper: seller for auth user
CREATE OR REPLACE FUNCTION public.current_seller_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id FROM public.sellers s WHERE s.core_user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_brand_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT bp.id
  FROM public.brand_profiles bp
  JOIN public.accounts a ON a.id = bp.account_id
  WHERE a.owner_user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_store_public(p_store_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.stores st
    JOIN public.store_settings ss ON ss.store_id = st.id
    WHERE st.id = p_store_id AND st.status = 'active' AND ss.published = true
  );
$$;

-- RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_self ON public.profiles FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY accounts_owner ON public.accounts FOR ALL USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS sellers_owner ON public.sellers;
CREATE POLICY sellers_select ON public.sellers FOR SELECT USING (core_user_id = auth.uid());
CREATE POLICY sellers_insert ON public.sellers FOR INSERT WITH CHECK (core_user_id = auth.uid());
CREATE POLICY sellers_update ON public.sellers FOR UPDATE USING (core_user_id = auth.uid()) WITH CHECK (core_user_id = auth.uid());

DROP POLICY IF EXISTS stores_owner ON public.stores;
CREATE POLICY stores_seller ON public.stores FOR ALL
  USING (seller_id = public.current_seller_id())
  WITH CHECK (seller_id = public.current_seller_id());
CREATE POLICY stores_public_read ON public.stores FOR SELECT USING (public.is_store_public(id));

DROP POLICY IF EXISTS store_products_policy ON public.store_products;
CREATE POLICY store_products_seller ON public.store_products FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));
CREATE POLICY store_products_public ON public.store_products FOR SELECT
  USING (public.is_store_public(store_id) AND status = 'active' AND visibility = 'visible');

DROP POLICY IF EXISTS store_domains_policy ON public.store_domains;
CREATE POLICY store_domains_seller ON public.store_domains FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));
CREATE POLICY store_domains_public ON public.store_domains FOR SELECT
  USING (public.is_store_public(store_id) AND status = 'active');

ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY brand_profiles_owner ON public.brand_profiles FOR ALL
  USING (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()))
  WITH CHECK (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()));

ALTER TABLE public.brand_memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY brand_memberships_brand ON public.brand_memberships FOR SELECT
  USING (brand_id = public.current_brand_id() OR seller_id = public.current_seller_id());
CREATE POLICY brand_memberships_brand_manage ON public.brand_memberships FOR ALL
  USING (brand_id = public.current_brand_id()) WITH CHECK (brand_id = public.current_brand_id());

ALTER TABLE public.brand_invitation_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY brand_invites_brand ON public.brand_invitation_codes FOR ALL
  USING (brand_id = public.current_brand_id()) WITH CHECK (brand_id = public.current_brand_id());
CREATE POLICY brand_invites_public_read ON public.brand_invitation_codes FOR SELECT
  USING (enabled = true AND (expires_at IS NULL OR expires_at > now()));

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY plans_public_read ON public.plans FOR SELECT USING (status = 'active');

ALTER TABLE public.plan_entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY plan_entitlements_public ON public.plan_entitlements FOR SELECT
  USING (plan_id IN (SELECT id FROM public.plans WHERE status = 'active'));

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_account ON public.subscriptions FOR SELECT
  USING (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()));

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY store_settings_seller ON public.store_settings FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));
CREATE POLICY store_settings_public ON public.store_settings FOR SELECT USING (public.is_store_public(store_id));

ALTER TABLE public.store_themes ENABLE ROW LEVEL SECURITY;
CREATE POLICY store_themes_public ON public.store_themes FOR SELECT USING (true);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY customers_seller ON public.customers FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY orders_seller ON public.orders FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY order_items_seller ON public.order_items FOR ALL
  USING (order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.stores s ON s.id = o.store_id
    WHERE s.seller_id = public.current_seller_id()
  ));

ALTER TABLE public.onmask_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY onmask_connections_seller ON public.onmask_connections FOR ALL
  USING (seller_id = public.current_seller_id()) WITH CHECK (seller_id = public.current_seller_id());

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_events_read ON public.audit_events FOR SELECT
  USING (
    account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid())
    OR seller_id = public.current_seller_id()
    OR brand_id = public.current_brand_id()
  );

-- store_subscriptions: seller read
CREATE POLICY store_subscriptions_seller ON public.store_subscriptions FOR SELECT
  USING (seller_id = public.current_seller_id());

CREATE POLICY store_activation_events_seller ON public.store_activation_events FOR SELECT
  USING (seller_id = public.current_seller_id() OR actor_user_id = auth.uid());
