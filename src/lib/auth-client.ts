/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER AUTH CLIENT — designed to be deleted and replaced by BetterAuth.
 *
 * Nothing here establishes a real session. `login`, `register`,
 * `loginWithGoogle` and `logout` are intentional no-ops so the UI can be
 * designed and reviewed before the backend exists. No user is written to
 * localStorage by those actions.
 *
 * `PREVIEW_AS_LOGGED_IN` is the single switch that decides which navbar state
 * is rendered: `true` shows the demo user and unlocks the private pages for
 * design review, `false` shows the logged-out UI.
 *
 * TODO(mehedi): replace this module with the BetterAuth client. The shape of
 * `useAuth()` in `src/hooks/use-auth.ts` can stay exactly the same.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { AppUser } from "@/types";

export const PREVIEW_AS_LOGGED_IN = true;

export const DEMO_USER: AppUser = {
  id: "preview-user-nusrat-jahan",
  name: "Nusrat Jahan",
  email: "nusrat.jahan@merasep.org",
  image:
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&h=240&q=80",
};

const PROFILE_STORAGE_KEY = "merasep:profile:v1";

export interface AuthSnapshot {
  user: AppUser | null;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginCredentials {
  name: string;
  image: string;
}

const SERVER_SNAPSHOT: AuthSnapshot = { user: null, isLoading: true };

let snapshot: AuthSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
let initialized = false;

function emitChange() {
  for (const listener of listeners) listener();
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuthSnapshot(): AuthSnapshot {
  return snapshot;
}

export function getServerAuthSnapshot(): AuthSnapshot {
  return SERVER_SNAPSHOT;
}

export function readProfileOverlay(): Partial<AppUser> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    const profile: Partial<AppUser> = {};
    if (typeof record.name === "string") profile.name = record.name;
    if (typeof record.image === "string") profile.image = record.image;
    if (typeof record.id === "string") profile.id = record.id;
    if (typeof record.email === "string") profile.email = record.email;
    return profile;
  } catch {
    return null;
  }
}

export function writeProfileOverlay(profile: Partial<AppUser>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Storage can be unavailable (private mode, quota). Preview mode stays usable.
  }
}

/**
 * Called once on mount by `useAuth`. Keeps the first client render identical to
 * the server render (loading), then reveals the preview user.
 */
export function ensureAuthInitialized(): void {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  if (!PREVIEW_AS_LOGGED_IN) {
    snapshot = { user: null, isLoading: false };
    emitChange();
    return;
  }

  snapshot = {
    user: { ...DEMO_USER, ...readProfileOverlay() },
    isLoading: false,
  };
  emitChange();
}

export function setAuthUser(user: AppUser): void {
  snapshot = { user, isLoading: false };
  emitChange();
}

export function getAuthUser(): AppUser | null {
  return snapshot.user;
}

/**
 * The email used by the mock data layer to answer "my events" and "my joins".
 * A real API would derive this from the JWT instead.
 */
export function getCurrentUserEmail(): string {
  if (!PREVIEW_AS_LOGGED_IN) return "";
  return snapshot.user?.email ?? DEMO_USER.email;
}

// ─── Inert auth actions (required by the brief) ─────────────────────────────
// TODO(mehedi): wire to BetterAuth `signIn.email`, `signUp.email`,
// `signIn.social` and `signOut`. Do not add toasts or redirects here until the
// real session exists.

export async function login(): Promise<void> {
  // Intentionally inert. The form validates visually and stops here.
}

export async function register(): Promise<void> {
  // Intentionally inert. The form validates visually and stops here.
}

export async function loginWithGoogle(): Promise<void> {
  // Intentionally inert. The Google button only shows its pressed state.
}

export async function logout(): Promise<void> {
  // Intentionally inert. Clicking Logout must not change the preview session.
}
