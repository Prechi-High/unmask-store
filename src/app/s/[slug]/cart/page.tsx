import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";
import { placeOrderAction } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function CartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: store } = await supabase.from("stores").select("id, slug, name, currency").eq("slug", slug).maybeSingle();
  if (!store) notFound();

  const token = (await cookies()).get("cart_token")?.value;
  let items: Array<{ id: string; quantity: number; unit_price: number; title: string }> = [];

  if (token && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const service = await createServiceClient();
    const { data: cart } = await service
      .from("carts")
      .select("id")
      .eq("store_id", store.id)
      .eq("session_token", token)
      .maybeSingle();
    if (cart) {
      const { data: rows } = await service
        .from("cart_items")
        .select("id, quantity, unit_price, store_products(title)")
        .eq("cart_id", cart.id);
      items =
        rows?.map((r) => ({
          id: r.id,
          quantity: r.quantity,
          unit_price: Number(r.unit_price),
          title: (r.store_products as { title?: string })?.title ?? "Product",
        })) ?? [];
    }
  }

  const total = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Link href={`/s/${slug}`} className="text-sm text-neutral-500">
        ← {store.name}
      </Link>
      <h1 className="mt-6 text-3xl font-light">Cart</h1>
      {!items.length ? (
        <p className="mt-6 text-neutral-600">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mt-6 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between px-4 py-3 text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{formatMoney(item.unit_price * item.quantity, store.currency)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-right text-lg font-medium">{formatMoney(total, store.currency)}</p>
          <form action={placeOrderAction} className="mt-8 space-y-3 rounded-2xl border border-neutral-200 bg-white p-4">
            <input type="hidden" name="store_slug" value={slug} />
            <Input name="full_name" placeholder="Full name" required />
            <Input name="email" type="email" placeholder="Email" required />
            <Button type="submit" className="w-full">
              Place order (manual payment V1)
            </Button>
          </form>
        </>
      )}
    </main>
  );
}
