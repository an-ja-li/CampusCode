// ============================================================
// CampusCode — Authentication & User Profile Hook
// ============================================================
// Uses NextAuth useSession() for real server-backed authentication.
// All user data is stored in Neon PostgreSQL via Prisma.
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import type { StudentProfile } from "@/types";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  studentProfile: StudentProfile | null;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const isSessionLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user;

  // Fetch full profile from database when session is available
  useEffect(() => {
    if (isAuthenticated && session?.user?.id && !profile) {
      setProfileLoading(true);
      fetch("/api/auth/profile")
        .then(async (res) => {
          if (res.status === 404) {
            // User was removed or re-seeded in database; clear stale session
            await signOut({ redirect: false });
            return null;
          }
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data) {
            setProfile({
              id: data.id,
              name: data.name,
              email: data.email,
              avatar: data.avatar || null,
              role: data.role?.toLowerCase() || "student",
              isVerified: data.isVerified ?? true,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              studentProfile: data.studentProfile
                ? {
                    id: data.studentProfile.id,
                    userId: data.studentProfile.userId,
                    college: data.studentProfile.college,
                    degree: data.studentProfile.degree,
                    graduationYear: data.studentProfile.graduationYear,
                    skills: data.studentProfile.skills || [],
                    bio: data.studentProfile.bio || "",
                    level: data.studentProfile.level?.toLowerCase() || "beginner",
                    badges: data.studentProfile.badges || [],
                    rating: data.studentProfile.rating || 0,
                    reviewCount: data.studentProfile.reviewCount || 0,
                    totalSales: data.studentProfile.totalSales || 0,
                    totalEarnings: data.studentProfile.totalEarnings || 0,
                    completedProjects: data.studentProfile.completedProjects || 0,
                    portfolioUrl: data.studentProfile.portfolioUrl || "",
                    github: data.studentProfile.github,
                    linkedin: data.studentProfile.linkedin,
                  }
                : null,
            });
          }
        })
        .catch((err) => {
          console.error("[useAuth] Failed to fetch profile:", err);
        })
        .finally(() => {
          setProfileLoading(false);
        });
    }

    if (!isAuthenticated) {
      setProfile(null);
    }
  }, [isAuthenticated, session?.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build the user object — prefer full profile, fall back to session
  const user = profile
    ? profile
    : isAuthenticated && session?.user
    ? {
        id: (session.user as { id?: string }).id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || null,
        role: (session.user as { role?: string }).role || "student",
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        studentProfile: null,
      }
    : null;

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await signIn("credentials", {
          email: email.trim().toLowerCase(),
          password,
          redirect: false,
        });

        if (result?.error) {
          return { success: false, error: "Invalid email or password" };
        }

        return { success: true };
      } catch (error) {
        console.error("[useAuth] Login error:", error);
        return { success: false, error: "Login failed. Please try again." };
      }
    },
    []
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      password: string;
      role?: string;
      college?: string;
      degree?: string;
      graduationYear?: number;
      skills?: string[];
      bio?: string;
    }) => {
      try {
        // Create account via API
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          return { success: false, error: result.error || "Registration failed" };
        }

        // Auto-login after registration
        const signInResult = await signIn("credentials", {
          email: data.email.trim().toLowerCase(),
          password: data.password,
          redirect: false,
        });

        if (signInResult?.error) {
          return {
            success: true,
            error: "Account created but auto-login failed. Please sign in manually.",
          };
        }

        return { success: true };
      } catch (error) {
        console.error("[useAuth] Register error:", error);
        return { success: false, error: "Registration failed. Please try again." };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setProfile(null);
    await signOut({ redirectTo: "/login" });
  }, []);

  const updateProfile = useCallback(
    async (updates: {
      name?: string;
      avatar?: string;
      studentProfile?: Partial<StudentProfile>;
    }) => {
      try {
        const body: Record<string, unknown> = {};
        if (updates.name !== undefined) body.name = updates.name;
        if (updates.avatar !== undefined) body.avatar = updates.avatar;
        if (updates.studentProfile) {
          if (updates.studentProfile.college !== undefined) body.college = updates.studentProfile.college;
          if (updates.studentProfile.degree !== undefined) body.degree = updates.studentProfile.degree;
          if (updates.studentProfile.graduationYear !== undefined) body.graduationYear = updates.studentProfile.graduationYear;
          if (updates.studentProfile.skills !== undefined) body.skills = updates.studentProfile.skills;
          if (updates.studentProfile.bio !== undefined) body.bio = updates.studentProfile.bio;
          if ((updates.studentProfile as Record<string, unknown>).github !== undefined) body.github = (updates.studentProfile as Record<string, unknown>).github;
          if ((updates.studentProfile as Record<string, unknown>).linkedin !== undefined) body.linkedin = (updates.studentProfile as Record<string, unknown>).linkedin;
        }

        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          return { success: false, error: "Failed to update profile" };
        }

        const updatedData = await res.json();

        // Update local profile state
        setProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            name: updatedData.name ?? prev.name,
            avatar: updatedData.avatar ?? prev.avatar,
            studentProfile: updatedData.studentProfile
              ? {
                  ...prev.studentProfile,
                  ...updatedData.studentProfile,
                  skills: updatedData.studentProfile.skills || prev.studentProfile?.skills || [],
                  badges: updatedData.studentProfile.badges || prev.studentProfile?.badges || [],
                }
              : prev.studentProfile,
          };
        });

        return { success: true };
      } catch (error) {
        console.error("[useAuth] Update profile error:", error);
        return { success: false, error: "Failed to update profile" };
      }
    },
    []
  );

  return {
    user,
    isAuthenticated,
    isLoading: isSessionLoading || profileLoading,
    login,
    register,
    logout,
    updateProfile,
  };
}
