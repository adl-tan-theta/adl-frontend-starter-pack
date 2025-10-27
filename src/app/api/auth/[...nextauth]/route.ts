import { eq } from "drizzle-orm";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { comparePassword } from "@/lib/password";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user in database
          const userResult = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email));

          if (userResult.length === 0) {
            return null;
          }

          const user = userResult[0];

          // Check if user has a password hash
          if (!user.passwordHash) {
            console.error("User has no password hash");
            return null;
          }

          // Verify the password
          const isValidPassword = await comparePassword(
            credentials.password,
            user.passwordHash,
          );

          if (!isValidPassword) {
            return null;
          }

          if (user) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name || "",
              image: null,
            };
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || "";
        token.uuid = uuidv4(); // Generate UUID6-like ID for each session
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).email = token.email as string;
        (session.user as any).name = token.name as string;
        (session.user as any).uuid = token.uuid as string;
      }
      return session;
    },

    async signIn({ user: _user, account: _account, profile: _profile }) {
      // Add any custom sign-in logic here
      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
