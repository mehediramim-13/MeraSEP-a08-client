/**
 * Local write overlay for the mock data layer.
 *
 * Reads come from the static JSON file (or any URL in NEXT_PUBLIC_API_URL).
 * Writes (create / update / delete / join) are kept in localStorage and merged
 * on top of those reads so the entire product is usable without a server.
 *
 * TODO(mehedi): delete this file once the real API exists. `src/lib/api.ts` is
 * the only consumer.
 */

import { DEMO_USER, PREVIEW_AS_LOGGED_IN } from "@/lib/auth-client";
import type { MeraEvent } from "@/types";

export const OVERLAY_STORAGE_KEY = "merasep:event-overlay:v1";
export const STORE_CHANGE_EVENT = "merasep:store-change";

interface StoredJoin {
  eventId: string;
  userEmail: string;
  joinedAt: string;
}

interface EventOverlayState {
  created: MeraEvent[];
  updated: Record<string, Partial<MeraEvent>>;
  deleted: string[];
  joins: StoredJoin[];
}

/**
 * A couple of pre-joined events so `/joined-events` and the dashboard states
 * are reviewable without clicking through the app first.
 * TODO(mehedi): remove this seed — real joins will come from the API.
 */
const SEEDED_JOINS: StoredJoin[] =
  PREVIEW_AS_LOGGED_IN
    ? [
        {
          eventId: "evt-chandrima-plantation",
          userEmail: DEMO_USER.email,
          joinedAt: "2026-10-20T09:12:00",
        },
        {
          eventId: "evt-sylhet-iftar",
          userEmail: DEMO_USER.email,
          joinedAt: "2026-10-24T20:45:00",
        },
      ]
    : [];

function createSeedState(): EventOverlayState {
  return { created: [], updated: {}, deleted: [], joins: [...SEEDED_JOINS] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeState(value: unknown): EventOverlayState {
  if (!isRecord(value)) return createSeedState();

  const created = Array.isArray(value.created)
    ? value.created.filter(
        (event): event is MeraEvent => isRecord(event) && typeof event._id === "string",
      )
    : [];

  const updated: Record<string, Partial<MeraEvent>> = {};
  if (isRecord(value.updated)) {
    for (const [id, patch] of Object.entries(value.updated)) {
      if (isRecord(patch)) updated[id] = patch as Partial<MeraEvent>;
    }
  }

  const deleted = Array.isArray(value.deleted)
    ? value.deleted.filter((id): id is string => typeof id === "string")
    : [];

  const joins = Array.isArray(value.joins)
    ? value.joins.filter(
        (join): join is StoredJoin =>
          isRecord(join) &&
          typeof join.eventId === "string" &&
          typeof join.userEmail === "string" &&
          typeof join.joinedAt === "string",
      )
    : [];

  return { created, updated, deleted, joins };
}

export function readOverlay(): EventOverlayState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = window.localStorage.getItem(OVERLAY_STORAGE_KEY);
    if (!raw) return createSeedState();
    return sanitizeState(JSON.parse(raw) as unknown);
  } catch {
    return createSeedState();
  }
}

function persist(state: EventOverlayState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OVERLAY_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable; the in-memory merge still works for this page.
  }
  window.dispatchEvent(new CustomEvent(STORE_CHANGE_EVENT));
}

export function updateOverlay(
  updater: (state: EventOverlayState) => EventOverlayState,
): EventOverlayState {
  const next = updater(readOverlay());
  persist(next);
  return next;
}

function countJoins(state: EventOverlayState, eventId: string): number {
  return state.joins.filter((join) => join.eventId === eventId).length;
}

/** Merge the local overlay over whatever the data source returned. */
export function applyOverlay(events: MeraEvent[]): MeraEvent[] {
  const state = readOverlay();
  const deleted = new Set(state.deleted);
  const seen = new Set<string>();
  const merged: MeraEvent[] = [];

  const push = (event: MeraEvent) => {
    if (deleted.has(event._id) || seen.has(event._id)) return;
    seen.add(event._id);
    merged.push({
      ...event,
      joinedCount: Math.max(0, (event.joinedCount ?? 0) + countJoins(state, event._id)),
    });
  };

  for (const event of state.created) {
    const patch = state.updated[event._id];
    push(patch ? { ...event, ...patch } : event);
  }

  for (const event of events) {
    const patch = state.updated[event._id];
    push(patch ? { ...event, ...patch } : event);
  }

  return merged;
}

export function addCreatedEvent(event: MeraEvent): void {
  updateOverlay((state) => ({
    ...state,
    created: [event, ...state.created.filter((item) => item._id !== event._id)],
  }));
}

export function patchEvent(id: string, patch: Partial<MeraEvent>): void {
  updateOverlay((state) => {
    const createdIndex = state.created.findIndex((event) => event._id === id);
    const nextCreated =
      createdIndex >= 0
        ? state.created.map((event, index) =>
            index === createdIndex ? { ...event, ...patch, _id: event._id } : event,
          )
        : state.created;

    return {
      ...state,
      created: nextCreated,
      updated:
        createdIndex >= 0
          ? state.updated
          : {
              ...state.updated,
              [id]: { ...state.updated[id], ...patch, _id: id },
            },
    };
  });
}

export function removeEvent(id: string): void {
  updateOverlay((state) => {
    const updated = { ...state.updated };
    delete updated[id];
    return {
      ...state,
      created: state.created.filter((event) => event._id !== id),
      updated,
      deleted: state.deleted.includes(id) ? state.deleted : [...state.deleted, id],
      joins: state.joins.filter((join) => join.eventId !== id),
    };
  });
}

export function addJoin(eventId: string, userEmail: string): boolean {
  const state = readOverlay();
  const exists = state.joins.some(
    (join) => join.eventId === eventId && join.userEmail === userEmail,
  );
  if (exists) return false;

  updateOverlay((current) => ({
    ...current,
    joins: [
      ...current.joins,
      { eventId, userEmail, joinedAt: new Date().toISOString() },
    ],
  }));
  return true;
}

export function hasJoined(eventId: string, userEmail: string): boolean {
  return readOverlay().joins.some(
    (join) => join.eventId === eventId && join.userEmail === userEmail,
  );
}

export function getUserJoins(userEmail: string): StoredJoin[] {
  return readOverlay().joins.filter((join) => join.userEmail === userEmail);
}
