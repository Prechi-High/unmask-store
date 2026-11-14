"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("account_type")
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .maybeSingle();

  if (profile?.account_type === "brand") redirect("/brand");
  redirect("/app");
}

export async function signupAction(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const displayName = String(formData.get("display_name"));
  const accountType = String(formData.get("account_type")) as "seller" | "brand";
  const businessName = String(formData.get("business_name"));

  const supabase = await createClient();
  const { data: signUpData, error } = await supabase.auth.signUp({ email, password });
  if (error || !signUpData.user) {
    redirect(`/signup?error=${encodeURIComponent(error?.message ?? "Signup failed")}`);
  }

  const userId = signUpData.user.id;

  await supabase.from("profiles").upsert({
    id: userId,
    display_name: displayName,
    account_type: accountType,
  });

  const { data: account } = await supabase
    .from("accounts")
    .insert({ type: accountType, owner_user_id: userId })
    .select("id")
    .single();

  if (!account) redirect("/signup?error=account");

  if (accountType === "seller") {
    await supabase.from("sellers").insert({
      core_user_id: userId,
      account_id: account.id,
      business_name: businessName,
      contact_email: email,
      country: "NG",
      status: "pending",
      onboarding_step: "plan",
      legal_name: businessName,
    });
    redirect("/app/onboarding/plan");
  }

  await supabase.from("brand_profiles").insert({
    account_id: account.id,
    name: businessName,
    contact_email: email,
    country: "NG",
  });
  redirect("/brand/onboarding/plan");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
