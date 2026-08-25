// ============================================================
// CampusCode — NextAuth Configuration (v5 / Auth.js compatible)
// ============================================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { students, clients } from "@/lib/mock-data";

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

        // 1. Try querying cloud PostgreSQL database
        try {
          const dbUser = await db.user.findUnique({
            where: { email },
            include: {
              studentProfile: true,
              clientProfile: true,
            },
          });

          if (dbUser) {
            // Note: If dbUser.password exists, compare with hash; for development, accept password
            return {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              image: dbUser.avatar || null,
              role: dbUser.role.toLowerCase(),
            };
          }
        } catch {
          // Database offline or uninitialized
        }

        // 2. Fallback to mock data during initial development setup
        const allUsers = [...students, ...clients];
        const mockUser = allUsers.find(
          (u) => u.email.toLowerCase() === email
        );

        if (!mockUser) return null;

        return {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          image: mockUser.avatar || null,
          role: mockUser.role,
        };
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
  secret: process.env.NEXTAUTH_SECRET || "campuscode-production-secret-replace-with-env",
});
