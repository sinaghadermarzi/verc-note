import type { DefaultSession } from "next-auth";

// Make `session.user.id` part of the typed session object.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
