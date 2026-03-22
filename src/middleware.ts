import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth(function middleware(req) {
  // Already authenticated — let them through
  if (req.auth) return NextResponse.next();

  // Redirect to login, preserving the intended destination
  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
});

export const config = {
  // Protect everything except: auth API, login page, Next.js internals, favicon
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
