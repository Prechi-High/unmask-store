import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StoreRenderer } from "@/components/storefront/store-renderer";
import { parseSections } from "@/lib/themes/presets";

export default async function StorefrontPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase.from("stores").select("*").eq("slug", slug).maybeSingle();
  if (!store) notFound();

  const { data: settings } = await supabase
    .from("store_settings")
    .select("*")
    .eq("store_id", store.id)
    .maybeSingle();

  const { data: theme } = settings
    ? await supabase.from("store_themes").select("tokens").eq("id", settings.theme_id).maybeSingle()
    : { data: null };

  const { data: products } = await supabase
    .from("store_products")
    .select("id, title, price, currency, hero_image_url, product_url_slug")
    .eq("store_id", store.id)
    .eq("status", "active")
    .eq("visibility", "visible");

  return (
    <StoreRenderer
      store={store}
      sections={parseSections(settings?.sections ?? null)}
      products={products ?? []}
      themeTokens={(theme?.tokens as Record<string, string>) ?? {}}
    />
  );
}
