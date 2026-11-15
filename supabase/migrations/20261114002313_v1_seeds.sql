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
