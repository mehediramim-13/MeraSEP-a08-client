"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The footer copyright year. Uses the server snapshot during prerender so the
 * build never touches `new Date()`, then reads the real year on the client.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026,
  );

  return <>{year}</>;
}
