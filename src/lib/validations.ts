import { z } from "zod";

import { EVENT_TYPES } from "@/types";

// ─── Login ────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginValues = z.infer<typeof loginSchema>;

// ─── Register ─────────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  image: z
    .string()
    .trim()
    .min(1, "Photo URL is required")
    .url("Enter a valid image URL"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/[a-z]/, "Password must include at least one lowercase letter"),
});

export type RegisterValues = z.infer<typeof registerSchema>;

// ─── Password rules (shared with the live checklist) ─────────────────────────
export const PASSWORD_RULES = [
  {
    id: "minLength",
    label: "At least 6 characters",
    test: (value: string) => value.length >= 6,
  },
  {
    id: "uppercase",
    label: "At least one uppercase letter (A–Z)",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter (a–z)",
    test: (value: string) => /[a-z]/.test(value),
  },
] as const;

// ─── Event (create + update) ─────────────────────────────────────────────────
const isoDate = z
  .string()
  .min(1, "Event date is required")
  .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date")
  .refine((value) => new Date(value).getTime() > Date.now(), "Event date must be in the future");

export const eventSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(120, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  eventType: z.enum(EVENT_TYPES, { error: "Choose an event type" }),
  thumbnail: z.string().trim().min(1, "Thumbnail URL is required").url("Enter a valid image URL"),
  location: z.string().trim().min(2, "Location is required").max(160, "Location is too long"),
  eventDate: isoDate,
});

export type EventFormValues = z.infer<typeof eventSchema>;

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  image: z.string().trim().min(1, "Photo URL is required").url("Enter a valid image URL"),
});

export type ProfileValues = z.infer<typeof profileSchema>;

// ─── Newsletter ───────────────────────────────────────────────────────────────
export const newsletterSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
