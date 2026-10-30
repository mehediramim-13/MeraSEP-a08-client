"use client";

import type { ReactNode } from "react";

import { FullPageSkeleton } from "@/components/shared/full-page-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { PREVIEW_AS_LOGGED_IN } from "@/lib/auth-client";

/**
 * Single wrapper for every private page.
 *
 * Preview mode renders children directly so each private page can be reviewed
 * at /create-event, /manage-events, /joined-events and /profile.
 *
 * TODO(mehedi): when the real session is wired, replace the `!user` branch with:
 *   "use client" + usePathname()
 *   if (!user) redirect(`/login?redirect=${encodeURIComponent(pathname)}`);
 * Keep the `isLoading` skeleton above it — it prevents a reload on a private
 * route from flashing the login page before the session resolves.
 */
export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageSkeleton />;
  }

  if (!user && !PREVIEW_AS_LOGGED_IN) {
    return <FullPageSkeleton />;
  }

  return <>{children}</>;
}
