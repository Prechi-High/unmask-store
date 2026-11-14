import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MarketingHomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20">
      <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">OnMask Commerce</p>
      <h1 className="mt-4 max-w-3xl text-5xl font-light tracking-tight md:text-7xl">
        Sell beauty with a storefront that feels as considered as your products.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-neutral-600">
        Independent commerce for sellers and brands. Subscriptions, stores, and checkout—without
        tying your business to discovery platforms.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/signup">
          <Button>Start selling</Button>
        </Link>
        <Link href="/login">
          <Button variant="secondary">Sign in</Button>
        </Link>
        <Link href="/brand">
          <Button variant="ghost">Brand program</Button>
        </Link>
      </div>
    </main>
  );
}
