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

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_self ON public.profiles;
CREATE POLICY profiles_self ON public.profiles FOR ALL USING (id = auth.uid()) WITH CHECK (id = auth.uid());

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS accounts_owner ON public.accounts;
CREATE POLICY accounts_owner ON public.accounts FOR ALL USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS sellers_select ON public.sellers;
DROP POLICY IF EXISTS sellers_insert ON public.sellers;
DROP POLICY IF EXISTS sellers_update ON public.sellers;
CREATE POLICY sellers_select ON public.sellers FOR SELECT USING (core_user_id = auth.uid());
CREATE POLICY sellers_insert ON public.sellers FOR INSERT WITH CHECK (core_user_id = auth.uid());
CREATE POLICY sellers_update ON public.sellers FOR UPDATE USING (core_user_id = auth.uid()) WITH CHECK (core_user_id = auth.uid());

DROP POLICY IF EXISTS stores_seller ON public.stores;
DROP POLICY IF EXISTS stores_public_read ON public.stores;
CREATE POLICY stores_seller ON public.stores FOR ALL
  USING (seller_id = public.current_seller_id())
  WITH CHECK (seller_id = public.current_seller_id());
CREATE POLICY stores_public_read ON public.stores FOR SELECT USING (public.is_store_public(id));

DROP POLICY IF EXISTS store_products_seller ON public.store_products;
DROP POLICY IF EXISTS store_products_public ON public.store_products;
CREATE POLICY store_products_seller ON public.store_products FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));
CREATE POLICY store_products_public ON public.store_products FOR SELECT
  USING (public.is_store_public(store_id) AND status = 'active' AND visibility = 'visible');

DROP POLICY IF EXISTS store_domains_seller ON public.store_domains;
DROP POLICY IF EXISTS store_domains_public ON public.store_domains;
CREATE POLICY store_domains_seller ON public.store_domains FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));
CREATE POLICY store_domains_public ON public.store_domains FOR SELECT
  USING (public.is_store_public(store_id) AND status = 'active');

ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS brand_profiles_owner ON public.brand_profiles;
CREATE POLICY brand_profiles_owner ON public.brand_profiles FOR ALL
  USING (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()))
  WITH CHECK (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()));

ALTER TABLE public.brand_memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS brand_memberships_brand ON public.brand_memberships;
DROP POLICY IF EXISTS brand_memberships_brand_manage ON public.brand_memberships;
CREATE POLICY brand_memberships_brand ON public.brand_memberships FOR SELECT
  USING (brand_id = public.current_brand_id() OR seller_id = public.current_seller_id());
CREATE POLICY brand_memberships_brand_manage ON public.brand_memberships FOR ALL
  USING (brand_id = public.current_brand_id()) WITH CHECK (brand_id = public.current_brand_id());

ALTER TABLE public.brand_invitation_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS brand_invites_brand ON public.brand_invitation_codes;
DROP POLICY IF EXISTS brand_invites_public_read ON public.brand_invitation_codes;
CREATE POLICY brand_invites_brand ON public.brand_invitation_codes FOR ALL
  USING (brand_id = public.current_brand_id()) WITH CHECK (brand_id = public.current_brand_id());
CREATE POLICY brand_invites_public_read ON public.brand_invitation_codes FOR SELECT
  USING (enabled = true AND (expires_at IS NULL OR expires_at > now()));

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS plans_public_read ON public.plans;
CREATE POLICY plans_public_read ON public.plans FOR SELECT USING (status = 'active');

ALTER TABLE public.plan_entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS plan_entitlements_public ON public.plan_entitlements;
CREATE POLICY plan_entitlements_public ON public.plan_entitlements FOR SELECT
  USING (plan_id IN (SELECT id FROM public.plans WHERE status = 'active'));

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS subscriptions_account ON public.subscriptions;
CREATE POLICY subscriptions_account ON public.subscriptions FOR SELECT
  USING (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()));

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS store_settings_seller ON public.store_settings;
DROP POLICY IF EXISTS store_settings_public ON public.store_settings;
CREATE POLICY store_settings_seller ON public.store_settings FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));
CREATE POLICY store_settings_public ON public.store_settings FOR SELECT USING (public.is_store_public(store_id));

ALTER TABLE public.store_themes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS store_themes_public ON public.store_themes;
CREATE POLICY store_themes_public ON public.store_themes FOR SELECT USING (true);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS customers_seller ON public.customers;
CREATE POLICY customers_seller ON public.customers FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orders_seller ON public.orders;
CREATE POLICY orders_seller ON public.orders FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS order_items_seller ON public.order_items;
CREATE POLICY order_items_seller ON public.order_items FOR ALL
  USING (order_id IN (
    SELECT o.id FROM public.orders o
    JOIN public.stores s ON s.id = o.store_id
    WHERE s.seller_id = public.current_seller_id()
  ));

ALTER TABLE public.onmask_connections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onmask_connections_seller ON public.onmask_connections;
CREATE POLICY onmask_connections_seller ON public.onmask_connections FOR ALL
  USING (seller_id = public.current_seller_id()) WITH CHECK (seller_id = public.current_seller_id());

ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS audit_events_read ON public.audit_events;
CREATE POLICY audit_events_read ON public.audit_events FOR SELECT
  USING (
    account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid())
    OR seller_id = public.current_seller_id()
    OR brand_id = public.current_brand_id()
  );

DROP POLICY IF EXISTS store_subscriptions_seller ON public.store_subscriptions;
CREATE POLICY store_subscriptions_seller ON public.store_subscriptions FOR SELECT
  USING (seller_id = public.current_seller_id());

DROP POLICY IF EXISTS store_activation_events_seller ON public.store_activation_events;
CREATE POLICY store_activation_events_seller ON public.store_activation_events FOR SELECT
  USING (seller_id = public.current_seller_id() OR actor_user_id = auth.uid());
