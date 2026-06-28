import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/audit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // The Prisma adapter still persists users and OAuth accounts (so notes can
  // reference a real user row), but sessions themselves are stateless JWTs —
  // a better fit for serverless: no DB read per request, edge-verifiable.
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Expose the user id on the session. Under the JWT strategy NextAuth stores
    // the user id in `token.sub`; copy it onto the session so server code can
    // scope queries by `session.user.id`.
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, isNewUser }) {
      await recordAudit({
        action: isNewUser ? "auth.signup" : "auth.signin",
        userId: user.id,
        meta: { email: user.email },
      });
    },
    async signOut(message) {
      // Under the JWT strategy the signout event carries the token, not a
      // session row; pull the user id from token.sub when present.
      const userId = "token" in message ? (message.token?.sub ?? null) : null;
      await recordAudit({ action: "auth.signout", userId });
    },
  },
});
