"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Home" },
  { href: "/app/products", label: "Products" },
  { href: "/app/orders", label: "Orders" },
  { href: "/app/customers", label: "Customers" },
  { href: "/app/store", label: "Store" },
  { href: "/app/analytics", label: "Analytics" },
  { href: "/app/payments", label: "Payments" },
  { href: "/app/settings", label: "Settings" },
];

export function SellerSidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm transition",
              active ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
