import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config (no OAuth providers).
 * Used by middleware (proxy.ts) which runs in the Edge Runtime.
 * The full config with Google provider lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath =
        nextUrl.pathname.startsWith("/api/auth") ||
        nextUrl.pathname.startsWith("/login");

      if (isPublicPath) return true;
      if (isLoggedIn) return true;

      // Not logged in — redirect to login
      return false;
    },
  },
  providers: [], // No providers here — Edge Runtime can't use OAuth providers
};
