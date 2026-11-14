import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";

const nav = [
  { href: "/brand", label: "Overview" },
  { href: "/brand/invitations", label: "Invitations" },
  { href: "/brand/sellers", label: "Sellers" },
  { href: "/brand/settings", label: "Settings" },
];

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-neutral-200/80 bg-white p-4 md:min-h-screen md:border-b-0 md:border-r">
        <Link href="/" className="text-xs uppercase tracking-[0.2em] text-neutral-500">
          OnMask
        </Link>
        <p className="mt-1 text-sm font-medium">Brand</p>
        <nav className="mt-6 flex gap-2 overflow-x-auto md:flex-col">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAction} className="mt-8">
          <button type="submit" className="text-sm text-neutral-500">
            Sign out
          </button>
        </form>
      </aside>
      <main className="p-4 md:p-8">{children}</main>
    </div>
  );
}
