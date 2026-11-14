import { createClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getSellerForUser() {
  const user = await getSessionUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("sellers")
    .select("*")
    .eq("core_user_id", user.id)
    .maybeSingle();
  return data;
}

export async function getActiveSubscription(accountId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("subscriptions")
    .select("*, plans(*)")
    .eq("account_id", accountId)
    .in("status", ["active", "pending", "past_due"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function requireSellerWithActiveSub() {
  const user = await getSessionUser();
  if (!user) return { error: "auth" as const, user: null, seller: null, subscription: null };

  const supabase = await createClient();
  const { data: seller } = await supabase
    .from("sellers")
    .select("*")
    .eq("core_user_id", user.id)
    .maybeSingle();

  if (!seller?.account_id) {
    return { error: "onboarding" as const, user, seller, subscription: null };
  }

  const subscription = await getActiveSubscription(seller.account_id);
  if (!subscription || subscription.status !== "active") {
    return { error: "subscription" as const, user, seller, subscription };
  }

  return { error: null, user, seller, subscription };
}
