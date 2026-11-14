import { saveStoreAction } from "@/app/actions/store";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { THEME_LABELS, type ThemeId } from "@/lib/themes/presets";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default async function StoreSetupPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();
  if (!seller) redirect("/signup");

  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("*")
    .eq("seller_id", seller.id)
    .maybeSingle();

  const { data: settings } = store
    ? await supabase.from("store_settings").select("*").eq("store_id", store.id).maybeSingle()
    : { data: null };

  const { data: themes } = await supabase.from("store_themes").select("id, name");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <StoreSetupIntro />
      <Card>
        <h1 className="text-2xl font-medium">{store ? "Store settings" : "Create your store"}</h1>
        <form action={saveStoreAction} className="mt-6 space-y-4">
          {store ? <input type="hidden" name="store_id" value={store.id} /> : null}
          <Input name="name" placeholder="Store name" defaultValue={store?.name ?? ""} required />
          <Input name="slug" placeholder="URL slug" defaultValue={store?.slug ?? ""} />
          <Input name="tagline" placeholder="Tagline" defaultValue={store?.tagline ?? ""} />
          <textarea
            name="description"
            placeholder="Description"
            defaultValue={store?.description ?? ""}
            className="min-h-24 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
          />
          <Input name="logo_url" placeholder="Logo URL" defaultValue={store?.logo_url ?? ""} />
          <select
            name="theme_id"
            defaultValue={settings?.theme_id ?? "beauty_minimal"}
            className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm"
          >
            {(themes ?? []).map((t) => (
              <option key={t.id} value={t.id}>
                {THEME_LABELS[t.id as ThemeId] ?? t.name}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="publish" defaultChecked={!!settings?.published} />
            Publish storefront
          </label>
          <Button type="submit">Save</Button>
        </form>
        {store ? (
          <Link href={`/s/${store.slug}`} className="mt-4 inline-block text-sm underline">
            Preview storefront
          </Link>
        ) : null}
      </Card>
    </div>
  );
}

function StoreSetupIntro() {
  return (
    <div>
      <h2 className="text-sm uppercase tracking-[0.2em] text-neutral-500">Progressive setup</h2>
      <p className="mt-2 text-neutral-600">Name, URL, logo, theme, then publish when ready.</p>
    </div>
  );
}
