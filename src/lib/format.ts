import { format, isValid, parseISO } from "date-fns";

export function parseEventDate(value: string | Date): Date | null {
  const date = value instanceof Date ? value : parseISO(value);
  return isValid(date) ? date : null;
}

export function formatEventDate(value: string | Date, pattern = "EEE, d MMM yyyy"): string {
  const date = parseEventDate(value);
  return date ? format(date, pattern) : "Date to be announced";
}

export function formatEventTime(value: string | Date): string {
  return formatEventDate(value, "h:mm a");
}

export function formatEventDateTime(value: string | Date): string {
  return formatEventDate(value, "EEE, d MMM yyyy · h:mm a");
}

export interface DateChip {
  day: string;
  month: string;
}

export function toDateChip(value: string | Date): DateChip {
  const date = parseEventDate(value);
  if (!date) return { day: "--", month: "---" };
  return { day: format(date, "d"), month: format(date, "MMM") };
}

/** Turns a calendar selection into a stable ISO local date-time (10:00 AM start). */
export function calendarDateToIso(date: Date): string {
  const next = new Date(date);
  next.setHours(10, 0, 0, 0);
  return format(next, "yyyy-MM-dd'T'HH:mm:ss");
}

export function toCalendarDate(value: string): Date | undefined {
  const date = parseEventDate(value);
  return date ?? undefined;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalMs: number;
}

export function getCountdown(target: string | Date, now: number = Date.now()): Countdown {
  const date = parseEventDate(target);
  const totalMs = date ? date.getTime() - now : 0;
  const remaining = Math.max(totalMs, 0);
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
    isPast: totalMs <= 0,
    totalMs,
  };
}

export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "U";
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "U";
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatFullNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function isUpcoming(eventDate: string, now: number = Date.now()): boolean {
  const date = parseEventDate(eventDate);
  return date ? date.getTime() >= now : false;
}

export function toGoogleCalendarUrl(input: {
  title: string;
  description: string;
  location: string;
  eventDate: string;
}): string {
  const start = parseEventDate(input.eventDate);
  const end = start ? new Date(start.getTime() + 3 * 60 * 60 * 1000) : null;
  const compact = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: input.title,
    details: input.description.slice(0, 900),
    location: input.location,
  });
  if (start && end) {
    params.set("dates", `${compact(start)}/${compact(end)}`);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
