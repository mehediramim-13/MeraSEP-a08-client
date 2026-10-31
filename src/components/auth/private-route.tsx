"use client";

import type { ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";

/**
 * Single guard used by every private page. Today it just renders its children so
 * the pages can be designed and reviewed with `PREVIEW_AS_LOGGED_IN`. The real
 * guard lives in the commented block below.
 */
export function PrivateRoute({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();

  // TODO(mehedi): real guard:
  // if (isLoading) return <FullPageSkeleton />;
  // if (!user) {
  //   const redirect = encodeURIComponent(pathname);
  //   router.replace(`/login?redirect=${redirect}`);
  //   return <FullPageSkeleton />;
  // }
  void isLoading;

  return <>{children}</>;
}
