import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";
import { addToCartAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; productSlug: string }>;
}) {
  const { slug, productSlug } = await params;
  const supabase = await createClient();
  const { data: store } = await supabase.from("stores").select("id, slug, name").eq("slug", slug).maybeSingle();
  if (!store) notFound();

  const { data: product } = await supabase
    .from("store_products")
    .select("*")
    .eq("store_id", store.id)
    .eq("product_url_slug", productSlug)
    .maybeSingle();

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <Link href={`/s/${slug}`} className="text-sm text-neutral-500">
        ← {store.name}
      </Link>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-neutral-100">
          {product.hero_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.hero_image_url} alt="" className="h-full w-full rounded-3xl object-cover" />
          ) : null}
        </div>
        <div>
          <h1 className="text-4xl font-light tracking-tight">{product.title}</h1>
          <p className="mt-4 text-xl">{formatMoney(Number(product.price), product.currency)}</p>
          <p className="mt-6 text-neutral-600 leading-relaxed">{product.description}</p>
          {product.ingredients ? (
            <p className="mt-4 text-sm text-neutral-500">Ingredients: {product.ingredients}</p>
          ) : null}
          <form action={addToCartAction} className="mt-8">
            <input type="hidden" name="store_slug" value={slug} />
            <input type="hidden" name="product_id" value={product.id} />
            <Button type="submit">Add to cart</Button>
          </form>
        </div>
      </div>
    </main>
  );
}
