import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the Edge-compatible config (no Google provider) for middleware
// Next.js 16 requires a default export from proxy.ts
const { auth } = NextAuth(authConfig);
export default auth;

export const config = {
  // Protect everything except: auth API, login page, Next.js internals, favicon
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon\\.ico).*)",
  ],
};
