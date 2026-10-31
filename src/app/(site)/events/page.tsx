"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventCard } from "@/components/events/event-card";
import { EVENT_TYPES } from "@/types";
import { getUpcomingEvents } from "@/lib/api";
import type { MeraEvent } from "@/types";
import { useEffect } from "react";

type SortOption = "soonest" | "newest";

export default function EventsPage() {
  const [events, setEvents] = useState<MeraEvent[] | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<(typeof EVENT_TYPES)[number] | "all">("all");
  const [sort, setSort] = useState<SortOption>("soonest");

  useEffect(() => {
    let active = true;
    getUpcomingEvents({})
      .then((list) => {
        if (active) setEvents(list);
      })
      .catch(() => {
        if (active) setEvents([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!events) return [];
    const term = search.trim().toLowerCase();
    let list = events.filter((event) => {
      if (typeFilter !== "all" && event.eventType !== typeFilter) return false;
      if (!term) return true;
      return (
        event.title.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term) ||
        event.eventType.toLowerCase().includes(term)
      );
    });

    list = [...list].sort((a, b) => {
      const aTime = new Date(a.eventDate).getTime();
      const bTime = new Date(b.eventDate).getTime();
      if (sort === "soonest") return aTime - bTime;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [events, search, typeFilter, sort]);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading
          eyebrow="Upcoming events"
          title="Find a cause near you."
          subtitle="Browse community service events across Bangladesh. Filter by type, search by location, and join in one click."
        />

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, location or type…"
                className="h-11 rounded-xl pl-10"
                aria-label="Search events"
              />
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-11 rounded-xl border border-border/70 bg-card px-3 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Sort events"
              >
                <option value="soonest">Soonest first</option>
                <option value="newest">Newest first</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTypeFilter("all")}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                typeFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              }`}
            >
              All types
            </button>
            {EVENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setTypeFilter(type)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  typeFilter === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <Reveal className="mt-10">
          {events === null ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card"
                >
                  <Skeleton className="aspect-[16/10] w-full rounded-none" />
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-auto h-10 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-card p-12 text-center">
              <p className="font-heading text-xl font-bold text-foreground">
                No events match your filters.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different type or clear the search.
              </p>
              <Button
                variant="outline"
                className="mt-5 rounded-full"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((event, index) => (
                <EventCard key={event._id} event={event} priority={index < 3} />
              ))}
            </div>
          )}
        </Reveal>

        {events && events.length > 0 ? (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Showing {filtered.length} of {events.length} upcoming events
          </p>
        ) : null}
      </Container>
    </section>
  );
}
