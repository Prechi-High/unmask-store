import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const platform = process.env.NEXT_PUBLIC_PLATFORM_DOMAIN ?? "localhost:3000";
  const pathname = request.nextUrl.pathname;

  if (host !== platform && !host.startsWith("localhost") && host.includes(".")) {
    const slug = host.split(".")[0];
    if (slug && !pathname.startsWith("/s/")) {
      const url = request.nextUrl.clone();
      url.pathname = `/s/${slug}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  if (pathname.startsWith("/app") || pathname.startsWith("/brand")) {
    return updateSession(request);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
