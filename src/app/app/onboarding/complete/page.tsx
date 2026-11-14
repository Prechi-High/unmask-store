import Link from "next/link";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { redirect } from "next/navigation";

export default async function OnboardingCompletePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();

  const supabase = await createClient();
  const { data: sub } = seller?.account_id
    ? await supabase
        .from("subscriptions")
        .select("status")
        .eq("account_id", seller.account_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  return (
    <Card className="mx-auto max-w-lg">
      <h1 className="text-2xl font-medium">Payment received</h1>
      <p className="mt-3 text-neutral-600">
        {sub?.status === "active"
          ? "Your subscription is active. You can set up your store now."
          : "We are confirming your payment via Paystack webhook. Refresh in a moment if this page still shows pending."}
      </p>
      <Link href="/app/store" className="mt-6 inline-block text-sm underline">
        Continue to store setup
      </Link>
    </Card>
  );
}
