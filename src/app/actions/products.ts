"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function productSaveAction(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const productId = formData.get("product_id") ? String(formData.get("product_id")) : null;
  const storeId = String(formData.get("store_id"));
  const title = String(formData.get("title"));
  const price = Number(formData.get("price"));
  const qty = Number(formData.get("inventory_quantity") || 0);

  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("id, currency")
    .eq("id", storeId)
    .eq("seller_id", seller.id)
    .single();

  if (!store) redirect("/app/products/new?error=store");

  const payload = {
    store_id: storeId,
    title,
    description: String(formData.get("description")),
    price,
    currency: store.currency,
    inventory_quantity: qty,
    in_stock: qty > 0,
    hero_image_url: String(formData.get("hero_image_url") || "") || null,
    status: "active",
    visibility: "visible",
    category: String(formData.get("category") || "") || null,
    sku: String(formData.get("sku") || "") || null,
    ingredients: String(formData.get("ingredients") || "") || null,
    size_volume: String(formData.get("size_volume") || "") || null,
  };

  if (productId) {
    await supabase.from("store_products").update(payload).eq("id", productId);
    redirect(`/app/products/${productId}`);
  }

  const { data: product } = await supabase
    .from("store_products")
    .insert({
      ...payload,
      compare_at_price: null,
      product_url_slug: slugify(title),
    })
    .select("id")
    .single();

  redirect(product ? `/app/products/${product.id}` : "/app/products");
}
