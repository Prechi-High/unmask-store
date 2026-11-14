"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { initializePaystackTransaction, paystackAmountToKobo } from "@/lib/payments/paystack";

export async function startSubscriptionAction(formData: FormData) {
  const planId = String(formData.get("plan_id"));
  const user = await getSessionUser();
  if (!user?.email) redirect("/login");

  const seller = await getSellerForUser();
  if (!seller?.account_id) redirect("/signup");

  const supabase = await createClient();
  const { data: plan } = await supabase.from("plans").select("*").eq("id", planId).single();
  if (!plan) redirect("/app/onboarding/plan?error=plan");

  const reference = `sub_${randomUUID()}`;

  const { data: sub } = await supabase
    .from("subscriptions")
    .insert({
      account_id: seller.account_id,
      plan_id: plan.id,
      status: "pending",
      payment_reference: reference,
      payment_metadata: { email: user.email, seller_id: seller.id },
    })
    .select("id")
    .single();

  if (!sub) redirect("/app/onboarding/plan?error=sub");

  try {
    const init = await initializePaystackTransaction({
      email: user.email,
      amountKobo: paystackAmountToKobo(Number(plan.price)),
      reference,
      metadata: {
        subscription_id: sub.id,
        account_id: seller.account_id,
        kind: "platform_subscription",
      },
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/app/onboarding/complete`,
    });
    redirect(init.authorization_url);
  } catch {
    redirect("/app/onboarding/plan?error=paystack");
  }
}

export async function activateSubscriptionFromWebhook(payload: {
  reference: string;
  transactionId?: string;
  amount?: number;
}) {
  const service = await createServiceClient();
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return { ok: false as const, reason: "no_service_role" };

  const { data: sub } = await service
    .from("subscriptions")
    .select("*")
    .eq("payment_reference", payload.reference)
    .maybeSingle();

  if (!sub) return { ok: false as const, reason: "subscription_not_found" };
  if (sub.status === "active") return { ok: true as const, duplicate: true };

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await service
    .from("subscriptions")
    .update({
      status: "active",
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      provider_transaction_id: payload.transactionId ? String(payload.transactionId) : null,
    })
    .eq("id", sub.id);

  await service.from("payments").insert({
    account_id: sub.account_id,
    kind: "platform_subscription",
    amount: payload.amount ? payload.amount / 100 : 0,
    currency: "NGN",
    status: "success",
    provider: "paystack",
    provider_reference: payload.reference,
    provider_transaction_id: payload.transactionId ? String(payload.transactionId) : null,
    metadata: { subscription_id: sub.id },
  });

  const { data: account } = await service
    .from("accounts")
    .select("owner_user_id, type")
    .eq("id", sub.account_id)
    .single();

  if (account?.type === "seller") {
    await service
      .from("sellers")
      .update({ status: "active", onboarding_step: "store" })
      .eq("account_id", sub.account_id);
  }

  await service.from("audit_events").insert({
    account_id: sub.account_id,
    event_type: "subscription.activated",
    actor_user_id: account?.owner_user_id,
    payload: { reference: payload.reference },
  });

  return { ok: true as const };
}
