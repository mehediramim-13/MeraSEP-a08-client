/**
 * Shared domain types for MeraSEP.
 *
 * These mirror the shape the future API will return. The mock data layer in
 * `src/lib/api.ts` normalises unknown JSON into these types, so swapping the
 * data source never leaks untyped objects into the UI.
 */

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Education",
  "Health Camp",
  "Food Distribution",
  "Blood Donation",
  "Flood Relief",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface MeraEvent {
  _id: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  /** ISO date-time string, for example `2026-11-14T09:00:00`. */
  eventDate: string;
  creatorEmail: string;
  creatorName: string;
  createdAt: string;
  volunteerGoal?: number;
  joinedCount?: number;
}

export interface JoinedEvent extends MeraEvent {
  userEmail: string;
  joinedAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface EventQuery {
  limit?: number;
  search?: string;
  type?: EventType;
  sort?: "soonest" | "newest";
}

export interface CreateEventInput {
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  eventDate: string;
  creatorEmail: string;
  creatorName: string;
}

export interface UpdateEventInput {
  title?: string;
  description?: string;
  eventType?: EventType;
  thumbnail?: string;
  location?: string;
  eventDate?: string;
}

export interface ProfileUpdateInput {
  name: string;
  image: string;
}

export interface EventFilters {
  search: string;
  type: EventType | "all";
  sort: "soonest" | "newest";
}
