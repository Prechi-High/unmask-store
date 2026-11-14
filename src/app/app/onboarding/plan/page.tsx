import { createClient } from "@/lib/supabase/server";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { redirect } from "next/navigation";
import { formatMoney } from "@/lib/utils";
import { startSubscriptionAction } from "@/app/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function SellerPlanPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller?.account_id) redirect("/signup");

  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("audience", "seller")
    .eq("status", "active");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight">Choose your plan</h1>
        <p className="mt-2 text-neutral-600">Pricing is configured in the database—not hard-coded.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {plans?.map((plan) => (
          <Card key={plan.id}>
            <h2 className="text-xl font-medium">{plan.name}</h2>
            <p className="mt-2 text-3xl font-light">
              {formatMoney(Number(plan.price), plan.currency)}
              <span className="text-sm text-neutral-500"> / {plan.billing_interval}</span>
            </p>
            <form action={startSubscriptionAction} className="mt-6">
              <input type="hidden" name="plan_id" value={plan.id} />
              <Button type="submit" className="w-full">
                Pay with Paystack
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </div>
  );
}
