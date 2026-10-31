"use client";

import { SAVED_EVENTS_STORAGE_KEY } from "@/lib/constants";

const EMPTY: readonly string[] = Object.freeze([]);

let cached: string[] | null = null;
const listeners = new Set<() => void>();

function readSaved(): string[] {
  if (cached) return cached;
  if (typeof window === "undefined") {
    cached = [];
    return cached;
  }
  try {
    const raw = window.localStorage.getItem(SAVED_EVENTS_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    cached = [];
  }
  return cached;
}

function emitChange() {
  for (const listener of listeners) listener();
}

export function subscribeSavedEvents(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSavedEventsSnapshot(): readonly string[] {
  if (typeof window === "undefined") return EMPTY;
  return readSaved();
}

export function getSavedEventsServerSnapshot(): readonly string[] {
  return EMPTY;
}

/** Adds or removes a bookmark and returns the new saved state. */
export function toggleSavedEvent(eventId: string): boolean {
  const current = readSaved();
  const alreadySaved = current.includes(eventId);
  const next = alreadySaved
    ? current.filter((id) => id !== eventId)
    : [eventId, ...current];

  cached = next;
  try {
    window.localStorage.setItem(SAVED_EVENTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage may be unavailable; the in-memory list still updates this session.
  }
  emitChange();
  return !alreadySaved;
}
