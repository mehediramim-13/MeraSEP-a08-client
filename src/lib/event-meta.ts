import {
  Droplets,
  Gift,
  GraduationCap,
  HeartPulse,
  Leaf,
  LifeBuoy,
  Trash,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import type { EventType } from "@/types";

export interface EventTypeMeta {
  label: EventType;
  icon: LucideIcon;
  /** Short copy used in filters and empty states. */
  description: string;
  /** Solid-on-surface classes for type badges. */
  badge: string;
  /** Soft container for type icons. */
  tile: string;
  /** Small accent dot, used in filters and legends. */
  dot: string;
}

export const EVENT_META: Record<EventType, EventTypeMeta> = {
  Cleanup: {
    label: "Cleanup",
    icon: Trash,
    description: "Rivers, beaches, streets and public spaces",
    badge:
      "bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-sky-600/20 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-300/20",
    tile: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  Plantation: {
    label: "Plantation",
    icon: Leaf,
    description: "Native trees, saplings and green cover",
    badge:
      "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-300 dark:ring-emerald-300/20",
    tile: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  Donation: {
    label: "Donation",
    icon: Gift,
    description: "Clothes, blankets, supplies and funds",
    badge:
      "bg-amber-500/12 text-amber-700 ring-1 ring-inset ring-amber-600/25 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-300/20",
    tile: "bg-amber-500/12 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  Education: {
    label: "Education",
    icon: GraduationCap,
    description: "School kits, libraries and tutoring",
    badge:
      "bg-indigo-500/10 text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-300/20",
    tile: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-300",
    dot: "bg-indigo-500",
  },
  "Health Camp": {
    label: "Health Camp",
    icon: HeartPulse,
    description: "Free check-ups, medicine and counselling",
    badge:
      "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-300 dark:ring-rose-300/20",
    tile: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  "Food Distribution": {
    label: "Food Distribution",
    icon: UtensilsCrossed,
    description: "Iftar tables, food packs and hot meals",
    badge:
      "bg-orange-500/10 text-orange-700 ring-1 ring-inset ring-orange-600/20 dark:bg-orange-400/10 dark:text-orange-300 dark:ring-orange-300/20",
    tile: "bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300",
    dot: "bg-orange-500",
  },
  "Blood Donation": {
    label: "Blood Donation",
    icon: Droplets,
    description: "Donor camps for hospitals and patients",
    badge:
      "bg-red-500/10 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-400/10 dark:text-red-300 dark:ring-red-300/20",
    tile: "bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-300",
    dot: "bg-red-500",
  },
  "Flood Relief": {
    label: "Flood Relief",
    icon: LifeBuoy,
    description: "Boat rescue, dry food and shelter support",
    badge:
      "bg-blue-500/10 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-400/10 dark:text-blue-300 dark:ring-blue-300/20",
    tile: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300",
    dot: "bg-blue-500",
  },
};

export function getEventMeta(type: EventType): EventTypeMeta {
  return EVENT_META[type];
}
