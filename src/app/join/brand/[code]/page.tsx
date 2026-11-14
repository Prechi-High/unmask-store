import { joinBrandAction } from "@/app/actions/brand";
import { getSessionUser } from "@/lib/auth/account";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function JoinBrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { code } = await params;
  const { error } = await searchParams;

  const user = await getSessionUser();
  const supabase = await createClient();
  const { data: invite } = await supabase
    .from("brand_invitation_codes")
    .select("slug, brand_id")
    .eq("code", code)
    .maybeSingle();

  const { data: brandRow } = invite
    ? await supabase.from("brand_profiles").select("name").eq("id", invite.brand_id).maybeSingle()
    : { data: null };

  const brandName = brandRow?.name ?? "Brand";

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Card className="w-full">
        <p className="text-sm text-neutral-500">Join brand program</p>
        <h1 className="mt-2 text-2xl font-medium">{brandName}</h1>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        {user ? (
          <form action={joinBrandAction} className="mt-6">
            <input type="hidden" name="code" value={code} />
            <Button type="submit" className="w-full">
              Join as seller
            </Button>
          </form>
        ) : (
          <p className="mt-6 text-sm text-neutral-600">
            <a href={`/login?next=/join/brand/${code}`} className="underline">
              Sign in
            </a>{" "}
            to join with your seller account.
          </p>
        )}
      </Card>
    </main>
  );
}
