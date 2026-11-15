-- Public checkout tables: enable RLS + policies (GitHub deploy)

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS payments_seller_read ON public.payments;
CREATE POLICY payments_seller_read ON public.payments FOR SELECT
  USING (
    account_id IN (SELECT id FROM public.accounts WHERE owner_user_id = auth.uid())
    OR store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id())
  );

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS product_images_seller ON public.product_images;
CREATE POLICY product_images_seller ON public.product_images FOR ALL
  USING (product_id IN (
    SELECT sp.id FROM public.store_products sp
    JOIN public.stores st ON st.id = sp.store_id
    WHERE st.seller_id = public.current_seller_id()
  ))
  WITH CHECK (product_id IN (
    SELECT sp.id FROM public.store_products sp
    JOIN public.stores st ON st.id = sp.store_id
    WHERE st.seller_id = public.current_seller_id()
  ));
CREATE POLICY product_images_public ON public.product_images FOR SELECT
  USING (product_id IN (
    SELECT id FROM public.store_products WHERE public.is_store_public(store_id)
  ));

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS product_variants_seller ON public.product_variants;
CREATE POLICY product_variants_seller ON public.product_variants FOR ALL
  USING (product_id IN (
    SELECT sp.id FROM public.store_products sp
    JOIN public.stores st ON st.id = sp.store_id
    WHERE st.seller_id = public.current_seller_id()
  ))
  WITH CHECK (product_id IN (
    SELECT sp.id FROM public.store_products sp
    JOIN public.stores st ON st.id = sp.store_id
    WHERE st.seller_id = public.current_seller_id()
  ));

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shipping_seller ON public.shipping;
CREATE POLICY shipping_seller ON public.shipping FOR ALL
  USING (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()))
  WITH CHECK (store_id IN (SELECT id FROM public.stores WHERE seller_id = public.current_seller_id()));