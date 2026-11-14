import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const storeIds =
    (await supabase.from("stores").select("id").eq("seller_id", seller.id)).data?.map((s) => s.id) ?? [];

  const { data: orders } = storeIds.length
    ? await supabase.from("orders").select("*").in("store_id", storeIds).order("created_at", { ascending: false })
    : { data: [] };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-light">Orders</h1>
      <ul className="divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
        {(orders ?? []).map((order) => (
          <li key={order.id} className="flex items-center justify-between px-5 py-4 text-sm">
            <div>
              <p className="font-medium">{order.order_number}</p>
              <p className="text-neutral-500">{order.status}</p>
            </div>
            <p>{formatMoney(Number(order.total), order.currency)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
