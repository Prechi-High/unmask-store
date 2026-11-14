import { getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function BrandSellersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: brand } = await supabase.from("brand_profiles").select("id").maybeSingle();
  const { data: memberships } = brand
    ? await supabase
        .from("brand_memberships")
        .select("*, sellers(business_name, status)")
        .eq("brand_id", brand.id)
    : { data: [] };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-light">Sellers</h1>
      <ul className="divide-y divide-neutral-200 rounded-3xl border border-neutral-200 bg-white">
        {(memberships ?? []).map((m) => (
          <li key={m.id} className="px-5 py-4 text-sm">
            <p className="font-medium">{(m.sellers as { business_name?: string })?.business_name}</p>
            <p className="text-neutral-500">{m.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
