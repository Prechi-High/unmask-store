import { Card } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function BrandSettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const supabase = await createClient();
  const { data: brand } = await supabase.from("brand_profiles").select("*").maybeSingle();

  return (
    <Card className="max-w-xl">
      <h1 className="text-2xl font-medium">Brand settings</h1>
      <p className="mt-4 text-sm text-neutral-600">{brand?.contact_email}</p>
    </Card>
  );
}
