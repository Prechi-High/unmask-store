import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getSellerForUser, getSessionUser, getActiveSubscription } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SellerHomePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const subscription =
    seller.account_id ? await getActiveSubscription(seller.account_id) : null;

  const { count: productCount } = await supabase
    .from("store_products")
    .select("id", { count: "exact", head: true })
    .in(
      "store_id",
      (
        await supabase.from("stores").select("id").eq("seller_id", seller.id)
      ).data?.map((s) => s.id) ?? [],
    );

  const { count: orderCount } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .in(
      "store_id",
      (
        await supabase.from("stores").select("id").eq("seller_id", seller.id)
      ).data?.map((s) => s.id) ?? [],
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight">Good to see you</h1>
        <p className="mt-2 text-neutral-600">{seller.business_name}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">Subscription</p>
          <p className="mt-2 text-2xl font-medium capitalize">
            {subscription?.status ?? "none"}
          </p>
          {subscription?.status !== "active" ? (
            <Link href="/app/onboarding/plan" className="mt-3 inline-block text-sm underline">
              Choose plan
            </Link>
          ) : null}
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Products</p>
          <p className="mt-2 text-2xl font-medium">{productCount ?? 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Orders</p>
          <p className="mt-2 text-2xl font-medium">{orderCount ?? 0}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-medium">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/app/products/new" className="rounded-full bg-neutral-900 px-4 py-2 text-white">
            Add product
          </Link>
          <Link href="/app/store" className="rounded-full bg-neutral-100 px-4 py-2">
            Store setup
          </Link>
          <Link href="/app/settings" className="rounded-full bg-neutral-100 px-4 py-2">
            Settings
          </Link>
        </div>
      </Card>
    </div>
  );
}
