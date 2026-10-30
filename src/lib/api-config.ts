/**
 * Single source of truth for where the mock data comes from.
 *
 * Default: the static file at `public/mock/events.json`.
 * Real API: set `NEXT_PUBLIC_API_URL` to any URL that returns the event list
 * (a plain array, `{ data: [...] }` or `{ events: [...] }`). Every page reads
 * through `src/lib/api.ts`, so nothing else has to change.
 */

const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";

/** Base used in the TODO(mehedi) comments for future write endpoints. */
export const API_BASE_URL = configuredUrl || "/mock";

/**
 * The one link that swaps the whole data source. When configured, it is used
 * verbatim as the events list endpoint.
 */
export const EVENTS_LIST_URL = configuredUrl || `${API_BASE_URL}/events.json`;

export const IS_USING_MOCK_DATA = configuredUrl.length === 0;

/**
 * REST endpoints the real backend will expose. Read paths resolve on the
 * client today; write paths are documented in `api.ts` and stored locally until
 * the backend is wired.
 */
export const ENDPOINTS = {
  events: "/events",
  eventById: (id: string) => `/events/${encodeURIComponent(id)}`,
  myEvents: "/events/mine",
  joinedEvents: "/events/joined",
  joinEvent: (id: string) => `/events/${encodeURIComponent(id)}/join`,
  profile: "/profile",
} as const;
