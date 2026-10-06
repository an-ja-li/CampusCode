// ============================================================
// CampusCode — NextAuth Configuration (v5 / Auth.js compatible)
// ============================================================

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
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
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || process.env.GITHUB_APP_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "github") {
        try {
          const email = (user.email || (profile as { email?: string })?.email || "").toLowerCase().trim();
          if (!email) return false;

          const ghProfile = profile as { login?: string; avatar_url?: string; name?: string } | undefined;
          const githubUsername = ghProfile?.login || null;
          const githubAccessToken = account.access_token || null;
          const avatarUrl = user.image || ghProfile?.avatar_url || null;
          const name = user.name || ghProfile?.name || githubUsername || "Developer";

          const existingUser = await db.user.findUnique({
            where: { email },
            include: { studentProfile: true },
          });

          if (existingUser) {
            await db.$executeRawUnsafe(
              'UPDATE "users" SET "avatar" = COALESCE($1, "avatar"), "githubUsername" = COALESCE($2, "githubUsername"), "githubAccessToken" = COALESCE($3, "githubAccessToken") WHERE "id" = $4',
              avatarUrl,
              githubUsername,
              githubAccessToken,
              existingUser.id
            );

            if (existingUser.studentProfile && githubUsername) {
              await db.studentProfile.update({
                where: { id: existingUser.studentProfile.id },
                data: { github: githubUsername },
              });
            } else if (!existingUser.studentProfile) {
              await db.studentProfile.create({
                data: {
                  userId: existingUser.id,
                  college: "Developer",
                  degree: "Software Engineering",
                  graduationYear: 2026,
                  skills: ["JavaScript", "TypeScript", "React"],
                  github: githubUsername,
                },
              });
            }
          } else {
            const newUser = await db.user.create({
              data: {
                name,
                email,
                avatar: avatarUrl,
                role: "STUDENT",
                isVerified: true,
              },
            });

            await db.$executeRawUnsafe(
              'UPDATE "users" SET "githubUsername" = $1, "githubAccessToken" = $2 WHERE "id" = $3',
              githubUsername,
              githubAccessToken,
              newUser.id
            );

            await db.studentProfile.create({
              data: {
                userId: newUser.id,
                college: "Developer",
                degree: "Software Engineering",
                graduationYear: 2026,
                skills: ["JavaScript", "TypeScript", "React"],
                github: githubUsername,
              },
            });
          }

          return true;
        } catch (error) {
          console.error("[Auth] GitHub OAuth sign in error:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (account?.provider === "github") {
        if (account.access_token) {
          token.githubAccessToken = account.access_token;
        }
        const email = (user?.email || token.email || "").toLowerCase().trim();
        if (email) {
          const dbUser = await db.user.findUnique({
            where: { email },
            select: { id: true, role: true, avatar: true, name: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role.toLowerCase();
            token.name = dbUser.name;
            token.picture = dbUser.avatar;
          }
        }
        if ((profile as { login?: string })?.login) {
          token.githubUsername = (profile as { login?: string }).login;
        }
      } else if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || session.user.id;
        (session.user as { role?: string }).role = (token.role as string) || "student";
        (session.user as { githubAccessToken?: string }).githubAccessToken = token.githubAccessToken as string | undefined;
        (session.user as { githubUsername?: string }).githubUsername = token.githubUsername as string | undefined;
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || "campuscode-production-secret-replace-with-env",
});
