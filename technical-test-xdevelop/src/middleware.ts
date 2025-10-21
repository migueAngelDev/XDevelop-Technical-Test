import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/users", "/posts", "/books"];

export function middleware(req: NextRequest) {
   const { pathname } = req.nextUrl;

   // Ignorar estáticos y API
   if (
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      pathname.startsWith("/assets")
   ) {
      return NextResponse.next();
   }

   const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
   if (!isProtected) return NextResponse.next();

   const access = req.cookies.get("accessToken")?.value;
   if (access) return NextResponse.next();

   const loginUrl = req.nextUrl.clone();
   loginUrl.pathname = "/login";
   loginUrl.searchParams.set("next", pathname);
   return NextResponse.redirect(loginUrl);
}

export const config = {
   matcher: ["/((?!_next|favicon|assets).*)"],
};
