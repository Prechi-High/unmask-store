import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const storeIds =
    (await supabase.from("stores").select("id").eq("seller_id", seller.id)).data?.map((s) => s.id) ?? [];

  const { data: customers } = storeIds.length
    ? await supabase.from("customers").select("*").in("store_id", storeIds)
    : { data: [] };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-light">Customers</h1>
      <ul className="divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
        {(customers ?? []).map((c) => (
          <li key={c.id} className="px-5 py-4 text-sm">
            <p className="font-medium">{c.full_name ?? "Guest"}</p>
            <p className="text-neutral-500">{c.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
