import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    /**
     * Only allow sign-in from email addresses listed in ALLOWED_EMAILS
     * (comma-separated env var). If the list is empty, all access is denied.
     */
    signIn({ user }) {
      const allowedEmails = (process.env.ALLOWED_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (allowedEmails.length === 0) return false;
      return allowedEmails.includes((user.email ?? "").toLowerCase());
    },
  },
});
