"use client";

import { useSyncExternalStore } from "react";

import {
  getSavedEventsServerSnapshot,
  getSavedEventsSnapshot,
  subscribeSavedEvents,
  toggleSavedEvent,
} from "@/lib/saved-events";

export interface SavedEventsState {
  ids: readonly string[];
  count: number;
  isSaved: (eventId: string) => boolean;
  toggleSaved: (eventId: string) => boolean;
}

export function useSavedEvents(): SavedEventsState {
  const ids = useSyncExternalStore(
    subscribeSavedEvents,
    getSavedEventsSnapshot,
    getSavedEventsServerSnapshot,
  );

  return {
    ids,
    count: ids.length,
    isSaved: (eventId: string) => ids.includes(eventId),
    toggleSaved: toggleSavedEvent,
  };
}
