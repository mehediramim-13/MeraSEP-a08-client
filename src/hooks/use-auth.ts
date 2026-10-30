"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

import { updateProfile as updateProfileRequest } from "@/lib/api";
import {
  ensureAuthInitialized,
  getAuthSnapshot,
  getServerAuthSnapshot,
  login,
  loginWithGoogle,
  logout,
  register,
  setAuthUser,
  subscribeAuth,
} from "@/lib/auth-client";
import type { AppUser, ProfileUpdateInput } from "@/types";

export interface UseAuthResult {
  user: AppUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  register: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdateInput) => Promise<AppUser>;
}

/**
 * Preview auth state. The shape of this hook is the seam for BetterAuth:
 * `src/lib/auth-client.ts` can be replaced without touching any page.
 */
export function useAuth(): UseAuthResult {
  const snapshot = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot,
  );

  useEffect(() => {
    ensureAuthInitialized();
  }, []);

  const updateProfile = useCallback(async (data: ProfileUpdateInput) => {
    const updated = await updateProfileRequest(data);
    setAuthUser(updated);
    return updated;
  }, []);

  return {
    user: snapshot.user,
    isLoading: snapshot.isLoading,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
  };
}
