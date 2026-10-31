import type { AppUser } from "@/types";

export const PREVIEW_AS_LOGGED_IN = true;
export const DEMO_USER: AppUser = {
  id: "preview-user-nusrat-jahan",
  name: "Nusrat Jahan",
  email: "nusrat.jahan@merasep.org",
  image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&h=240&q=80",
};

export interface AuthSnapshot {
  user: AppUser | null;
  isLoading: boolean;
}

export function subscribeAuth(_listener?: () => void) {
  void _listener;
  return () => {};
}

export function getAuthSnapshot(): AuthSnapshot {
  return { user: DEMO_USER, isLoading: false };
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return { user: null, isLoading: true };
}

export function readProfileOverlay(..._args: unknown[]) {
  void _args;
  return null;
}

export function writeProfileOverlay(..._args: unknown[]) {
  void _args;
}

export function ensureAuthInitialized(..._args: unknown[]) {
  void _args;
}

export function setAuthUser(..._args: unknown[]) {
  void _args;
}

export function getAuthUser(..._args: unknown[]): AppUser {
  void _args;
  return DEMO_USER;
}

export function getCurrentUserEmail(..._args: unknown[]): string {
  void _args;
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("merasep_user_email");
    if (stored) return stored;
  }
  return DEMO_USER.email;
}

export async function login(..._args: unknown[]): Promise<void> {
  void _args;
}

export async function register(..._args: unknown[]): Promise<void> {
  void _args;
}

export async function logout(..._args: unknown[]): Promise<void> {
  void _args;
}
