import Google from "next-auth/providers/google";

type SignInArgs = {
  profile?: {
    email?: string | null;
    email_verified?: boolean;
  } | null;
};

type SessionArgs = {
  session: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
  user: { id: string };
};

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { prompt: "select_account" } }
    })
  ],
  callbacks: {
    async signIn({ profile }: SignInArgs) {
      if (!profile?.email) return false;
      return profile.email_verified !== false;
    },
    async session({ session, user }: SessionArgs) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
