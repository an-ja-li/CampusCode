// ============================================================
// CampusCode — Authentication & User Profile Hook
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import type { User, UserRole, StudentProfile } from "@/types";

const AUTH_STORAGE_KEY = "campuscode_active_user";

// Clean initial user template (0 stats)
const defaultCleanUser: User = {
  id: "u_default",
  name: "Harsh Vardhan",
  email: "harsh@campuscode.dev",
  avatar: "",
  role: "student",
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  studentProfile: {
    id: "sp_default",
    userId: "u_default",
    college: "IIT Bombay",
    degree: "B.Tech Computer Science",
    graduationYear: 2026,
    skills: ["Next.js", "TypeScript", "React", "Python", "PostgreSQL"],
    bio: "Full-stack developer building software solutions.",
    level: "builder",
    badges: [],
    rating: 5.0,
    reviewCount: 0,
    totalSales: 0,
    totalEarnings: 0,
    completedProjects: 0,
    portfolioUrl: "harsh",
  },
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: defaultCleanUser,
    isAuthenticated: true,
    isLoading: true,
  });

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({
          user: parsed,
          isAuthenticated: Boolean(parsed),
          isLoading: false,
        });
        return;
      }
    } catch {
      // Fallback
    }

    // Default clean initial session
    setState({
      user: defaultCleanUser,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const login = useCallback(async (email: string, password?: string, customName?: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 400));

    const nameFromEmail = customName || email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    const loggedInUser: User = {
      id: `u_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
      name: nameFromEmail || "Student Developer",
      email: email,
      avatar: "",
      role: "student",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      studentProfile: {
        id: `sp_${Date.now()}`,
        userId: `u_${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
        college: "Engineering College",
        degree: "Computer Science",
        graduationYear: 2026,
        skills: ["React", "TypeScript", "Next.js"],
        bio: "Student developer on CampusCode",
        level: "beginner",
        badges: [],
        rating: 5.0,
        reviewCount: 0,
        totalSales: 0,
        totalEarnings: 0,
        completedProjects: 0,
        portfolioUrl: email.split("@")[0],
      },
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
    } catch {}

    setState({ user: loggedInUser, isAuthenticated: true, isLoading: false });
    return { success: true, user: loggedInUser };
  }, []);

  const register = useCallback(async (data: {
    name: string;
    email: string;
    role?: UserRole;
    college?: string;
    degree?: string;
    graduationYear?: number;
    skills?: string[];
    bio?: string;
  }) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 400));

    const userId = `u_${Date.now()}`;
    const newUser: User = {
      id: userId,
      name: data.name,
      email: data.email,
      avatar: "",
      role: data.role || "student",
      isVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      studentProfile: {
        id: `sp_${Date.now()}`,
        userId,
        college: data.college || "University",
        degree: data.degree || "Computer Science",
        graduationYear: Number(data.graduationYear) || 2026,
        skills: data.skills || ["React", "TypeScript", "Next.js"],
        bio: data.bio || "",
        level: "beginner",
        badges: [],
        rating: 5.0,
        reviewCount: 0,
        totalSales: 0,
        totalEarnings: 0,
        completedProjects: 0,
        portfolioUrl: data.name.toLowerCase().replace(/\s+/g, "-"),
      },
    };

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}

    setState({ user: newUser, isAuthenticated: true, isLoading: false });
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {}
    setState({ user: null, isAuthenticated: false, isLoading: false });
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }, []);

  const updateProfile = useCallback(async (updates: {
    name?: string;
    email?: string;
    avatar?: string;
    studentProfile?: Partial<StudentProfile>;
  }) => {
    setState((s) => {
      if (!s.user) return s;
      const currentProfile = s.user.studentProfile || {
        id: `sp_${Date.now()}`,
        userId: s.user.id,
        college: "",
        degree: "",
        graduationYear: 2026,
        skills: [],
        bio: "",
        level: "beginner" as const,
        badges: [],
        rating: 5.0,
        reviewCount: 0,
        totalSales: 0,
        totalEarnings: 0,
        completedProjects: 0,
      };

      const updatedUser: User = {
        ...s.user,
        name: updates.name ?? s.user.name,
        email: updates.email ?? s.user.email,
        avatar: updates.avatar ?? s.user.avatar,
        studentProfile: {
          ...currentProfile,
          ...(updates.studentProfile || {}),
        },
      };

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      } catch {}

      return {
        ...s,
        user: updatedUser,
      };
    });
    return { success: true };
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  };
}
