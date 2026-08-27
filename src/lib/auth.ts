// ============================================================
// CampusCode — NextAuth Configuration (v5 / Auth.js compatible)
// ============================================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;
        const email = String(credentials.email || "").trim().toLowerCase();
        const password = String(credentials.password || "");

        if (!email || !password) return null;

        // Query the cloud PostgreSQL database
        try {
          const dbUser = await db.user.findUnique({
            where: { email },
            include: {
              studentProfile: true,
              clientProfile: true,
            },
          });

          if (!dbUser || !dbUser.password) return null;

          // Verify password with bcrypt
          const isValidPassword = await bcrypt.compare(password, dbUser.password);
          if (!isValidPassword) return null;

          return {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.avatar || null,
            role: dbUser.role.toLowerCase(),
          };
        } catch (error) {
          console.error("[Auth] Database error during login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || session.user.id;
        (session.user as { role?: string }).role = (token.role as string) || "student";
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "campuscode-production-secret-replace-with-env",
});
