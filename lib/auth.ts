import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedDomain = (process.env.ALLOWED_EMAIL_DOMAIN || "")
  .trim()
  .toLowerCase();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          hd: allowedDomain,
          prompt: "select_account",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google" || !user.email || !allowedDomain) {
        return false;
      }

      const email = user.email.trim().toLowerCase();
      const emailDomain = email.split("@")[1];
      const isVerified =
        (profile as { email_verified?: boolean } | undefined)?.email_verified === true;

      return isVerified && emailDomain === allowedDomain;
    },
  },
};
