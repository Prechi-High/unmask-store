import Link from "next/link";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatMoney } from "@/lib/utils";

export default async function ProductsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const { data: stores } = await supabase.from("stores").select("id").eq("seller_id", seller.id);
  const storeIds = stores?.map((s) => s.id) ?? [];

  const { data: products } = storeIds.length
    ? await supabase
        .from("store_products")
        .select("*")
        .in("store_id", storeIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-light tracking-tight">Products</h1>
        <Link href="/app/products/new" className="rounded-full bg-neutral-900 px-4 py-2 text-sm text-white">
          Add product
        </Link>
      </div>
      {!products?.length ? (
        <p className="text-neutral-600">No products yet. Create your store first, then add your first product.</p>
      ) : (
        <ul className="divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
          {products.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-neutral-500">{p.status}</p>
              </div>
              <div className="text-right">
                <p className="text-sm">{formatMoney(Number(p.price), p.currency)}</p>
                <Link href={`/app/products/${p.id}`} className="text-sm underline">
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
