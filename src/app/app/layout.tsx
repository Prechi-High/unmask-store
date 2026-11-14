import Link from "next/link";
import { SellerSidebarNav } from "@/components/seller/sidebar-nav";
import { signOutAction } from "@/app/actions/auth";

export default function SellerAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-neutral-200/80 bg-white p-4 md:min-h-screen md:border-b-0 md:border-r">
        <Link href="/" className="block text-xs uppercase tracking-[0.2em] text-neutral-500">
          OnMask
        </Link>
        <p className="mt-1 text-sm font-medium">Seller</p>
        <div className="mt-6">
          <SellerSidebarNav />
        </div>
        <form action={signOutAction} className="mt-8">
          <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
            Sign out
          </button>
        </form>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
