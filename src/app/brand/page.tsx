import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function BrandDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: brand } = await supabase.from("brand_profiles").select("*").maybeSingle();
  if (!brand) redirect("/signup");

  const { count: memberCount } = await supabase
    .from("brand_memberships")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand.id);

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status, plan_id")
    .eq("account_id", brand.account_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let maxSellers = 10;
  if (sub?.plan_id) {
    const { data: ent } = await supabase
      .from("plan_entitlements")
      .select("value")
      .eq("plan_id", sub.plan_id)
      .eq("key", "max_sellers")
      .maybeSingle();
    if (ent?.value) maxSellers = Number(ent.value);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-light">{brand.name}</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">Seller capacity</p>
          <p className="mt-2 text-2xl font-medium">
            {memberCount ?? 0} / {maxSellers}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Subscription</p>
          <p className="mt-2 text-2xl font-medium capitalize">{sub?.status ?? "none"}</p>
          {sub?.status !== "active" ? (
            <Link href="/brand/onboarding/plan" className="mt-2 inline-block text-sm underline">
              Activate brand plan
            </Link>
          ) : null}
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Invitations</p>
          <Link href="/brand/invitations" className="mt-2 inline-block text-sm underline">
            Manage invites
          </Link>
        </Card>
      </div>
    </div>
  );
}
