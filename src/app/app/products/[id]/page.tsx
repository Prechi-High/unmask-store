import { productSaveAction } from "@/app/actions/products";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const { data: product } = await supabase.from("store_products").select("*").eq("id", id).single();
  if (!product) notFound();

  return (
    <Card className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-medium">Edit product</h1>
      <form action={productSaveAction} className="mt-6 space-y-4">
        <input type="hidden" name="product_id" value={product.id} />
        <input type="hidden" name="store_id" value={product.store_id} />
        <Input name="title" defaultValue={product.title} required />
        <textarea
          name="description"
          defaultValue={product.description}
          className="min-h-28 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
        />
        <Input name="price" type="number" defaultValue={Number(product.price)} required />
        <Input name="category" defaultValue={product.category ?? ""} />
        <Input name="ingredients" defaultValue={product.ingredients ?? ""} />
        <Input name="inventory_quantity" type="number" defaultValue={product.inventory_quantity} />
        <Input name="hero_image_url" defaultValue={product.hero_image_url ?? ""} />
        <Button type="submit">Save changes</Button>
      </form>
    </Card>
  );
}
