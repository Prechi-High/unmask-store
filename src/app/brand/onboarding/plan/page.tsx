import { startBrandSubscriptionAction } from "@/app/actions/brand";
import { getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/utils";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function BrandPlanPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: plans } = await supabase.from("plans").select("*").eq("audience", "brand");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-light">Brand subscription</h1>
      {plans?.map((plan) => (
        <Card key={plan.id}>
          <h2 className="text-xl font-medium">{plan.name}</h2>
          <p className="mt-2 text-2xl">{formatMoney(Number(plan.price), plan.currency)}</p>
          <form action={startBrandSubscriptionAction} className="mt-4">
            <input type="hidden" name="plan_id" value={plan.id} />
            <Button type="submit">Pay with Paystack</Button>
          </form>
        </Card>
      ))}
    </div>
  );
}
