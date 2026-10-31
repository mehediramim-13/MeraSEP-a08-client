"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, CalendarDays, MapPin } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { EVENT_META } from "@/lib/event-meta";
import { formatEventDate, formatEventTime } from "@/lib/format";
import { useSavedEvents } from "@/hooks/use-saved-events";
import type { MeraEvent } from "@/types";

interface EventCardProps {
  event: MeraEvent;
  priority?: boolean;
}

export function EventCard({ event, priority = false }: EventCardProps) {
  const meta = EVENT_META[event.eventType];
  const Icon = meta.icon;
  const { isSaved, toggleSaved } = useSavedEvents();
  const saved = isSaved(event._id);

  const goal = event.volunteerGoal ?? 0;
  const joined = event.joinedCount ?? 0;
  const progress = goal > 0 ? Math.min(100, Math.round((joined / goal) * 100)) : 0;

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group/card relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow duration-300 hover:shadow-lift"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = "/logo/merasep-logo.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${meta.badge}`}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {event.eventType}
          </span>
        </div>

        <button
          type="button"
          onClick={() => toggleSaved(event._id)}
          aria-label={saved ? "Remove from saved events" : "Save event"}
          aria-pressed={saved}
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur transition-all hover:scale-105 hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Bookmark
            className={`size-4 transition-transform ${saved ? "fill-amber-400 text-amber-400 scale-110" : ""}`}
            aria-hidden="true"
          />
        </button>

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="inline-flex flex-col items-center rounded-xl bg-white/95 px-2.5 py-1.5 text-center shadow-sm dark:bg-card">
            <span className="font-heading text-base leading-none font-extrabold text-primary">
              {formatEventDate(event.eventDate, "d")}
            </span>
            <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {formatEventDate(event.eventDate, "MMM")}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 font-heading text-lg font-bold leading-snug text-foreground">
          {event.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="line-clamp-1">{event.location}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5 shrink-0" aria-hidden="true" />
          <span>
            {formatEventDate(event.eventDate, "EEE, d MMM yyyy")} ·{" "}
            {formatEventTime(event.eventDate)}
          </span>
        </div>

        {goal > 0 ? (
          <div className="mt-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">
                {joined} of {goal} volunteers
              </span>
              <span className="tabular-nums text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-auto pt-2">
          <Button
            render={<Link href={`/events/${event._id}`} />}
            nativeButton={false}
            variant="outline"
            className="h-10 w-full rounded-xl font-semibold transition-colors group-hover/card:border-primary/40 group-hover/card:bg-primary/5 group-hover/card:text-primary"
          >
            View event
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
