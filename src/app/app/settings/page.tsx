import { Card } from "@/components/ui/card";
import { getSellerForUser, getSessionUser } from "@/lib/auth/account";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const seller = await getSellerForUser();

  return (
    <Card className="max-w-xl">
      <h1 className="text-2xl font-medium">Settings</h1>
      <dl className="mt-6 space-y-3 text-sm">
        <div>
          <dt className="text-neutral-500">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Business</dt>
          <dd>{seller?.business_name}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">OnMask connection</dt>
          <dd className="text-neutral-600">Not connected (future integration)</dd>
        </div>
      </dl>
    </Card>
  );
}
