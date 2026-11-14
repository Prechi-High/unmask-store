"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function addToCartAction(formData: FormData) {
  const storeSlug = String(formData.get("store_slug"));
  const productId = String(formData.get("product_id"));

  const supabase = await createClient();
  const { data: store } = await supabase.from("stores").select("id").eq("slug", storeSlug).single();
  const { data: product } = await supabase
    .from("store_products")
    .select("id, price, title")
    .eq("id", productId)
  .single();

  if (!store || !product) redirect(`/s/${storeSlug}`);

  const cookieStore = await cookies();
  let token = cookieStore.get("cart_token")?.value;
  if (!token) token = randomUUID();

  const service = await createServiceClient();
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    redirect(`/s/${storeSlug}/cart`);
  }

  let { data: existingCart } = await service
    .from("carts")
    .select("id")
    .eq("session_token", token)
    .eq("store_id", store.id)
    .maybeSingle();

  if (!existingCart) {
    const created = await service
      .from("carts")
      .insert({ store_id: store.id, session_token: token, status: "active" })
      .select("id")
      .single();
    existingCart = created.data;
  }

  const cartId = existingCart?.id;

  if (cartId) {
    await service.from("cart_items").insert({
      cart_id: cartId,
      product_id: product.id,
      quantity: 1,
      unit_price: product.price,
    });
  }

  cookieStore.set("cart_token", token, { httpOnly: true, path: "/" });
  redirect(`/s/${storeSlug}/cart`);
}

export async function placeOrderAction(formData: FormData) {
  const storeSlug = String(formData.get("store_slug"));
  const fullName = String(formData.get("full_name"));
  const email = String(formData.get("email"));

  const cookieStore = await cookies();
  const token = cookieStore.get("cart_token")?.value;
  if (!token) redirect(`/s/${storeSlug}/cart`);

  const service = await createServiceClient();
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) redirect(`/s/${storeSlug}/cart?error=server`);

  const { data: store } = await service.from("stores").select("id, currency").eq("slug", storeSlug).single();
  if (!store) redirect(`/s/${storeSlug}/cart`);

  const { data: cart } = await service
    .from("carts")
    .select("id")
    .eq("store_id", store.id)
    .eq("session_token", token)
    .maybeSingle();

  if (!cart) redirect(`/s/${storeSlug}/cart`);

  const { data: items } = await service
    .from("cart_items")
    .select("*, store_products(title)")
    .eq("cart_id", cart.id);

  const subtotal =
    items?.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0) ?? 0;

  const { data: customer } = await service
    .from("customers")
    .insert({ store_id: store.id, email, full_name: fullName })
    .select("id")
    .single();

  const orderNumber = `ORD-${Date.now()}`;
  const { data: order } = await service
    .from("orders")
    .insert({
      store_id: store.id,
      customer_id: customer?.id,
      order_number: orderNumber,
      status: "pending",
      payment_status: "manual_pending",
      currency: store.currency,
      subtotal,
      total: subtotal,
      metadata: { checkout_mode: "manual_cod_v1" },
    })
    .select("id")
    .single();

  if (!order) redirect(`/s/${storeSlug}/cart?error=order`);

  for (const item of items ?? []) {
    const title =
      (item.store_products as { title?: string } | null)?.title ?? "Product";
    await service.from("order_items").insert({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      title,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: Number(item.unit_price) * item.quantity,
    });
  }

  await service.from("carts").update({ status: "converted" }).eq("id", cart.id);

  redirect(`/s/${storeSlug}/checkout/success?order=${orderNumber}`);
}
