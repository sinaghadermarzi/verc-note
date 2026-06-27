import type { Session } from "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";

type AuthResult = {
  handlers: {
    GET: (request: Request) => Promise<Response>;
    POST: (request: Request) => Promise<Response>;
  };
  auth: () => Promise<Session | null>;
  signIn: (provider?: string, options?: { redirectTo?: string }) => Promise<never>;
  signOut: (options?: { redirectTo?: string }) => Promise<never>;
};

const nextAuth = NextAuth as unknown as (config: Record<string, unknown>) => AuthResult;

export const { handlers, auth, signIn, signOut } = nextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" }
});
