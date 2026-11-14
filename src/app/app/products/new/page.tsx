import { productSaveAction } from "@/app/actions/products";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function NewProductPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("id, name")
    .eq("seller_id", seller.id)
    .limit(1)
    .maybeSingle();

  if (!store) redirect("/app/store");

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-medium">New product</h1>
      <p className="mt-1 text-sm text-neutral-500">Store: {store.name}</p>
      <form action={productSaveAction} className="mt-6 space-y-4">
        <input type="hidden" name="store_id" value={store.id} />
        <Input name="title" placeholder="Product name" required />
        <textarea
          name="description"
          placeholder="Description"
          required
          className="min-h-28 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
        />
        <Input name="price" type="number" placeholder="Price" required />
        <Input name="category" placeholder="Category" />
        <Input name="sku" placeholder="SKU" />
        <Input name="ingredients" placeholder="Ingredients (cosmetics)" />
        <Input name="size_volume" placeholder="Size / volume" />
        <Input name="inventory_quantity" type="number" defaultValue={0} />
        <Input name="hero_image_url" placeholder="Image URL" />
        <Button type="submit">Save product</Button>
      </form>
    </Card>
  );
}
