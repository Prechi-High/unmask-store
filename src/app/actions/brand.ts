"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/account";
import { initializePaystackTransaction, paystackAmountToKobo } from "@/lib/payments/paystack";

export async function startBrandSubscriptionAction(formData: FormData) {
  const planId = String(formData.get("plan_id"));
  const user = await getSessionUser();
  if (!user?.email) redirect("/login");

  const supabase = await createClient();
  const { data: brand } = await supabase.from("brand_profiles").select("account_id").maybeSingle();
  if (!brand) redirect("/signup");

  const { data: plan } = await supabase.from("plans").select("*").eq("id", planId).single();
  if (!plan) redirect("/brand/onboarding/plan?error=plan");

  const reference = `brand_sub_${randomUUID()}`;
  await supabase.from("subscriptions").insert({
    account_id: brand.account_id,
    plan_id: plan.id,
    status: "pending",
    payment_reference: reference,
  });

  try {
    const init = await initializePaystackTransaction({
      email: user.email,
      amountKobo: paystackAmountToKobo(Number(plan.price)),
      reference,
      metadata: { account_id: brand.account_id, kind: "platform_subscription" },
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/brand`,
    });
    redirect(init.authorization_url);
  } catch {
    redirect("/brand/onboarding/plan?error=paystack");
  }
}

export async function createInvitationAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: brand } = await supabase.from("brand_profiles").select("id, name, account_id").maybeSingle();
  if (!brand) redirect("/brand");

  const { count } = await supabase
    .from("brand_memberships")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand.id);

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id, status")
    .eq("account_id", brand.account_id)
    .maybeSingle();

  if (sub?.plan_id) {
    const { data: ent } = await supabase
      .from("plan_entitlements")
      .select("value")
      .eq("plan_id", sub.plan_id)
      .eq("key", "max_sellers")
      .maybeSingle();
    const max = Number(ent?.value ?? 0);
    if ((count ?? 0) >= max) redirect("/brand/invitations?error=capacity");
  }

  const code = String(formData.get("code") || randomUUID().slice(0, 8).toUpperCase());
  const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  await supabase.from("brand_invitation_codes").insert({
    brand_id: brand.id,
    code,
    slug,
    max_uses: Number(formData.get("max_uses") || 0) || null,
    created_by: user.id,
  });

  redirect("/brand/invitations");
}

export async function joinBrandAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=/join/brand/${formData.get("code")}`);

  const code = String(formData.get("code"));
  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("brand_invitation_codes")
    .select("*")
    .eq("code", code)
    .eq("enabled", true)
    .maybeSingle();

  if (!invite) redirect(`/join/brand/${code}?error=invalid`);

  const { data: seller } = await supabase
    .from("sellers")
    .select("id")
    .eq("core_user_id", user.id)
    .maybeSingle();

  if (!seller) redirect("/signup");

  const { data: brand } = await supabase
    .from("brand_profiles")
    .select("id, account_id")
    .eq("id", invite.brand_id)
    .single();

  if (!brand) redirect(`/join/brand/${code}?error=invalid`);

  const { count } = await supabase
    .from("brand_memberships")
    .select("id", { count: "exact", head: true })
    .eq("brand_id", brand.id);

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("account_id", brand.account_id)
    .eq("status", "active")
    .maybeSingle();

  if (sub?.plan_id) {
    const { data: ent } = await supabase
      .from("plan_entitlements")
      .select("value")
      .eq("plan_id", sub.plan_id)
      .eq("key", "max_sellers")
      .maybeSingle();
    if ((count ?? 0) >= Number(ent?.value ?? 0)) redirect(`/join/brand/${code}?error=capacity`);
  }

  await supabase.from("brand_memberships").insert({
    brand_id: brand.id,
    seller_id: seller.id,
    status: "active",
  });

  await supabase
    .from("brand_invitation_codes")
    .update({ use_count: invite.use_count + 1 })
    .eq("id", invite.id);

  await supabase.from("audit_events").insert({
    brand_id: brand.id,
    seller_id: seller.id,
    event_type: "brand.membership.created",
    actor_user_id: user.id,
    payload: { code },
  });

  redirect("/app");
}
