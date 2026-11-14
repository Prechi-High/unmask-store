import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const platform = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";
  const pathname = request.nextUrl.pathname;

  if (
    host !== platform &&
    !host.startsWith("localhost") &&
    !host.startsWith("127.0.0.1") &&
    host.includes(".")
  ) {
    const slug = host.split(".")[0];
    if (slug && !pathname.startsWith("/s/")) {
      const url = request.nextUrl.clone();
      url.pathname = `/s/${slug}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  if (
    pathname.startsWith("/app") ||
    pathname.startsWith("/brand") ||
    pathname === "/login" ||
    pathname === "/signup"
  ) {
    try {
      return await updateSession(request);
    } catch {
      return NextResponse.next({ request });
    }
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/app/:path*", "/brand/:path*", "/login", "/signup"],
};
