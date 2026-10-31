/**
 * MeraSEP data layer.
 *
 * Reads: fetches the configured JSON list (default `public/mock/events.json`),
 * normalises whatever shape it finds, then filters, searches, sorts and limits
 * entirely on the client. Any plain JSON endpoint works — no backend required.
 *
 * Writes: stored in a localStorage overlay on top of the fetched list, so the
 * full product can be demonstrated. Each write is marked with the real endpoint
 * it will call and the JWT it will send once the backend exists.
 */

import {
  DEMO_USER,
  getAuthUser,
  getCurrentUserEmail,
  setAuthUser,
  writeProfileOverlay,
} from "@/lib/auth-client";
import { EVENTS_LIST_URL } from "@/lib/api-config";
import {
  addCreatedEvent,
  addJoin,
  applyOverlay,
  getUserJoins,
  hasJoined,
  patchEvent,
  readOverlay,
  removeEvent,
} from "@/lib/mock-store";
import { EVENT_TYPES } from "@/types";
import type {
  AppUser,
  CreateEventInput,
  EventQuery,
  EventType,
  JoinedEvent,
  MeraEvent,
  ProfileUpdateInput,
  UpdateEventInput,
} from "@/types";

const FALLBACK_THUMBNAIL = "/fallback-event.svg";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim().length > 0) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function toEventType(value: unknown): EventType {
  const raw = asString(value, "Cleanup").toLowerCase();
  const direct = EVENT_TYPES.find((type) => type.toLowerCase() === raw);
  if (direct) return direct;

  if (raw.includes("tree") || raw.includes("plant")) return "Plantation";
  if (raw.includes("food") || raw.includes("meal") || raw.includes("iftar")) {
    return "Food Distribution";
  }
  if (raw.includes("blood")) return "Blood Donation";
  if (raw.includes("flood")) return "Flood Relief";
  if (raw.includes("health") || raw.includes("medical")) return "Health Camp";
  if (raw.includes("school") || raw.includes("educat") || raw.includes("book")) return "Education";
  if (raw.includes("cloth") || raw.includes("donat") || raw.includes("blanket")) return "Donation";
  return "Cleanup";
}

function toIsoDate(value: unknown, fallback: string): string {
  const raw = asString(value);
  if (!raw) return fallback;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? fallback : raw;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}


export function normalizeEvent(raw: unknown, index = 0): MeraEvent {
  const source = isRecord(raw) ? raw : {};
  const title = asString(source.title, "Community event");
  const fallbackDate = new Date(Date.now() + WEEK_MS).toISOString();

  return {
    _id: asString(source._id) || asString(source.id) || `event-${index}-${slugify(title)}`,
    title,
    description: asString(
      source.description,
      "Details for this community event will be shared by the organiser soon.",
    ),
    eventType: toEventType(source.eventType ?? source.type ?? source.category),
    thumbnail: asString(source.thumbnail ?? source.image ?? source.imageUrl, FALLBACK_THUMBNAIL),
    location: asString(source.location ?? source.venue, "Location to be announced"),
    eventDate: toIsoDate(source.eventDate ?? source.date ?? source.startDate, fallbackDate),
    creatorEmail: asString(source.creatorEmail ?? source.ownerEmail, "community@merasep.org"),
    creatorName: asString(source.creatorName ?? source.ownerName ?? source.creator, "MeraSEP community"),
    createdAt: toIsoDate(source.createdAt, new Date().toISOString()),
    volunteerGoal: asNumber(source.volunteerGoal ?? source.goal, 50),
    joinedCount: asNumber(source.joinedCount ?? source.volunteers ?? source.joined, 0),
  };
}

function extractEventArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of ["data", "events", "results", "items", "docs"]) {
    const candidate = payload[key];
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) {
      for (const nestedKey of ["data", "events", "results", "items"]) {
        const nested = candidate[nestedKey];
        if (Array.isArray(nested)) return nested;
      }
    }
  }

  return [];
}

export function normalizeEventList(payload: unknown): MeraEvent[] {
  return extractEventArray(payload).map((item, index) => normalizeEvent(item, index));
}

async function fetchEventSource(): Promise<MeraEvent[]> {
  if (typeof window === "undefined") {
    throw new Error("MeraSEP events must be loaded on the client.");
  }

  const response = await fetch(EVENTS_LIST_URL, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load events (${response.status}). Please try again.`);
  }

  const payload: unknown = await response.json();
  return normalizeEventList(payload);
}

async function fetchMergedEvents(): Promise<MeraEvent[]> {
  return applyOverlay(await fetchEventSource());
}

function matchesSearch(event: MeraEvent, search: string): boolean {
  if (!search) return true;
  const needle = search.toLowerCase();
  return [event.title, event.location, event.eventType, event.creatorName, event.description].some(
    (value) => value.toLowerCase().includes(needle),
  );
}

function sortEvents(events: MeraEvent[], sort: EventQuery["sort"]): MeraEvent[] {
  const byDate = [...events].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
  );
  if (sort === "newest") {
    return byDate.reverse();
  }
  return byDate;
}

/**
 * Upcoming events only (date >= now), optionally searched, filtered and limited.
 * Past events never leave this function, even if the JSON contains them.
 */
export async function getUpcomingEvents(query: EventQuery = {}): Promise<MeraEvent[]> {
  const { limit, search = "", type, sort = "soonest" } = query;
  const now = Date.now();
  const events = await fetchMergedEvents();

  const filtered = events.filter((event) => {
    const time = new Date(event.eventDate).getTime();
    if (Number.isNaN(time) || time < now) return false;
    if (type && event.eventType !== type) return false;
    return matchesSearch(event, search.trim());
  });

  const sorted = sortEvents(filtered, sort);
  return typeof limit === "number" && limit > 0 ? sorted.slice(0, limit) : sorted;
}

/** Every event from the source, past ones included. Used for "similar events". */
export async function getAllEvents(): Promise<MeraEvent[]> {
  return fetchMergedEvents();
}

export async function getEventById(id: string): Promise<MeraEvent | null> {
  const events = await fetchMergedEvents();
  return events.find((event) => event._id === id) ?? null;
}

/**
 * POST /events  (see `src/lib/api-config.ts`)
 * TODO(mehedi): POST `${API_BASE_URL}${ENDPOINTS.events}` with
 * `Authorization: Bearer <JWT>` and the JSON body below, then return the saved
 * event from the response.
 */
export async function createEvent(data: CreateEventInput): Promise<MeraEvent> {
  const event: MeraEvent = {
    _id: createLocalId(),
    title: data.title.trim(),
    description: data.description.trim(),
    eventType: data.eventType,
    thumbnail: data.thumbnail.trim() || FALLBACK_THUMBNAIL,
    location: data.location.trim(),
    eventDate: data.eventDate,
    creatorEmail: data.creatorEmail,
    creatorName: data.creatorName,
    createdAt: new Date().toISOString(),
    volunteerGoal: 50,
    joinedCount: 0,
  };

  addCreatedEvent(event);
  return event;
}

/**
 * GET /events/mine
 * TODO(mehedi): GET `${API_BASE_URL}${ENDPOINTS.myEvents}` with the JWT; the
 * server should filter by the token's user, not by an email query param.
 */
export async function getMyEvents(): Promise<MeraEvent[]> {
  const email = getCurrentUserEmail();
  if (!email) return [];

  const events = await fetchMergedEvents();
  return events
    .filter((event) => event.creatorEmail.toLowerCase() === email.toLowerCase())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateEvent(id: string, data: UpdateEventInput): Promise<MeraEvent> {
  const existing = await getEventById(id);
  if (!existing) throw new Error("This event no longer exists.");

  patchEvent(id, data);
  return { ...existing, ...data };
}


export async function deleteEvent(id: string): Promise<void> {
  removeEvent(id);
}

export async function joinEvent(id: string, emailParam?: string): Promise<MeraEvent> {
  const email = emailParam || getCurrentUserEmail();
  if (!email) {
    throw new Error("Please sign in to join this event.");
  }

  const event = await getEventById(id);
  if (!event) throw new Error("This event no longer exists.");

  const wasAdded = addJoin(id, email);
  return {
    ...event,
    joinedCount: (event.joinedCount ?? 0) + (wasAdded ? 1 : 0),
  };
}

/**
 * GET /events/joined
 * TODO(mehedi): GET `${API_BASE_URL}${ENDPOINTS.joinedEvents}` with the JWT and
 * return the events plus `userEmail` and `joinedAt`.
 */
export async function getJoinedEvents(emailParam?: string): Promise<JoinedEvent[]> {
  const email = emailParam || getCurrentUserEmail();
  if (!email) return [];

  const joins = getUserJoins(email);
  if (joins.length === 0) return [];

  const events = await fetchMergedEvents();
  const byId = new Map(events.map((event) => [event._id, event]));

  return joins
    .flatMap((join) => {
      const event = byId.get(join.eventId);
      return event ? [{ ...event, userEmail: join.userEmail, joinedAt: join.joinedAt }] : [];
    })
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
}

/**
 * PATCH /profile
 * TODO(mehedi): PATCH `${API_BASE_URL}${ENDPOINTS.profile}` with the JWT and
 * `{ name, image }`, then return the persisted user.
 */
export async function updateProfile(data: ProfileUpdateInput): Promise<AppUser> {
  const base = getAuthUser() ?? DEMO_USER;
  const updated: AppUser = {
    ...base,
    name: data.name.trim(),
    image: data.image.trim() || base.image,
  };

  // The profile overlay lives with the placeholder auth client so the preview
  // session and the form stay in sync. Replace with the BetterAuth session.
  writeProfileOverlay(updated);
  setAuthUser(updated);
  return updated;
}

export function isJoinedEvent(id: string): boolean {
  return hasJoined(id, getCurrentUserEmail());
}

/** Count of joins stored locally, useful for badges in the navbar. */
export function getLocalJoinCount(): number {
  return readOverlay().joins.filter((join) => join.userEmail === getCurrentUserEmail()).length;
}

function createLocalId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `evt-local-${crypto.randomUUID()}`;
  }
  return `evt-local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
