import { createInvitationAction } from "@/app/actions/brand";
import { getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function BrandInvitationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: brand } = await supabase.from("brand_profiles").select("id, name").maybeSingle();
  const { data: invites } = brand
    ? await supabase
        .from("brand_invitation_codes")
        .select("*")
        .eq("brand_id", brand.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-light">Invitations</h1>
      <Card>
        <form action={createInvitationAction} className="flex flex-wrap gap-3">
          <Input name="code" placeholder="Code (optional)" className="max-w-xs" />
          <Input name="max_uses" type="number" placeholder="Max uses" className="max-w-[120px]" />
          <Button type="submit">Create invite</Button>
        </form>
      </Card>
      <ul className="space-y-3">
        {invites?.map((invite) => (
          <Card key={invite.id} className="text-sm">
            <p className="font-medium">{invite.code}</p>
            <p className="mt-1 text-neutral-500">
              {baseUrl}/join/brand/{invite.code}
            </p>
            <p className="mt-2 text-neutral-500">
              Uses {invite.use_count}
              {invite.max_uses ? ` / ${invite.max_uses}` : ""}
            </p>
          </Card>
        ))}
      </ul>
    </div>
  );
}
