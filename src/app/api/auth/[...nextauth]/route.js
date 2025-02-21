import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

// Custom Prisma Adapter with modified createUser
const customAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data) => {
    const user = await prisma.user.create({
      data: {
        ...data,
        id: data.email, // Use email as id
      },
    });
    return user;
  },
  linkAccount: async (account) => {
    // Remove the refresh_token_expires_in field before saving
    const { refresh_token_expires_in, ...accountData } = account;

    const linkedAccount = await prisma.account.create({
      data: accountData,
    });
    return linkedAccount;
  },
};

export const authOptions = {
  adapter: customAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.upload",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (user) {
        session.user.id = user.id;

        // Get the associated account
        const account = await prisma.account.findFirst({
          where: { userId: user.id },
          orderBy: { id: "desc" },
        });

        if (account) {
          session.accessToken = account.access_token;
          session.refreshToken = account.refresh_token;
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
