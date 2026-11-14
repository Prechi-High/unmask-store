"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { DEFAULT_SECTIONS, type ThemeId } from "@/lib/themes/presets";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveStoreAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const storeId = formData.get("store_id") ? String(formData.get("store_id")) : null;
  const name = String(formData.get("name"));
  const slug = String(formData.get("slug") || slugify(name));
  const themeId = String(formData.get("theme_id") || "beauty_minimal") as ThemeId;
  const publish = formData.get("publish") === "on";

  if (storeId) {
    await supabase
      .from("stores")
      .update({
        name,
        slug,
        tagline: String(formData.get("tagline") || ""),
        description: String(formData.get("description") || ""),
        logo_url: String(formData.get("logo_url") || "") || null,
        status: publish ? "active" : "draft",
      })
      .eq("id", storeId)
      .eq("seller_id", seller.id);

    await supabase
      .from("store_settings")
      .update({ theme_id: themeId, published: publish })
      .eq("store_id", storeId);

    redirect("/app/store");
  }

  const { data: store } = await supabase
    .from("stores")
    .insert({
      seller_id: seller.id,
      name,
      slug,
      tagline: String(formData.get("tagline") || ""),
      description: String(formData.get("description") || ""),
      logo_url: String(formData.get("logo_url") || "") || null,
      currency: "NGN",
      status: publish ? "active" : "draft",
    })
    .select("id, slug")
    .single();

  if (!store) redirect("/app/store?error=create");

  await supabase.from("store_settings").insert({
    store_id: store.id,
    theme_id: themeId,
    sections: DEFAULT_SECTIONS as unknown as import("@/types/database").Json,
    published: publish,
  });

  const platform = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";
  await supabase.from("store_domains").insert({
    store_id: store.id,
    hostname: `${store.slug}.${platform}`,
    type: "subdomain",
    status: "active",
  });

  await supabase.from("sellers").update({ onboarding_step: "products" }).eq("id", seller.id);

  redirect("/app/store");
}
