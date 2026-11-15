DROP POLICY IF EXISTS subscriptions_account_manage ON public.subscriptions;
CREATE POLICY subscriptions_account_manage ON public.subscriptions FOR ALL
  USING (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()))
  WITH CHECK (account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid()));

DROP POLICY IF EXISTS brand_memberships_seller_join ON public.brand_memberships;
CREATE POLICY brand_memberships_seller_join ON public.brand_memberships FOR INSERT
  WITH CHECK (seller_id = public.current_seller_id());
