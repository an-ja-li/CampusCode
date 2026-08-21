// ============================================================
// CampusCode — Auth Hook (Mock)
// ============================================================

'use client';

import { useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';
import { currentUser } from '@/lib/mock-data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: currentUser,
    isAuthenticated: true,
    isLoading: false,
  });

  const login = useCallback(async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    // Mock login — always succeeds
    await new Promise((r) => setTimeout(r, 800));
    setState({ user: currentUser, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const register = useCallback(async (data: { name: string; email: string; password: string; role: UserRole }) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 1000));
    const newUser: User = {
      ...currentUser,
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    setState({ user: newUser, isAuthenticated: true, isLoading: false });
    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    setState((s) => ({
      ...s,
      user: s.user ? { ...s.user, ...updates } : null,
    }));
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
