"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventCard } from "@/components/events/event-card";
import { getUpcomingEvents } from "@/lib/api";
import type { MeraEvent } from "@/types";

function EventCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-auto h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function RecentEvents() {
  const [events, setEvents] = useState<MeraEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    getUpcomingEvents({ limit: 6 })
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

  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <Container>
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            title="Events happening soon."
            subtitle="Six causes near you that need hands this month. Join one, or browse them all."
          />
          <Button
            render={<Link href="/events" />}
            nativeButton={false}
            variant="outline"
            className="shrink-0 rounded-full"
          >
            View all events
          </Button>
        </div>

        <Reveal className="mt-10">
          {events === null ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <EventCardSkeleton key={index} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 bg-card p-10 text-center">
              <p className="font-heading text-lg font-bold text-foreground">
                No upcoming events right now.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to create one for your neighbourhood.
              </p>
              <Button
                render={<Link href="/create-event" />}
                nativeButton={false}
                className="mt-5 rounded-full"
              >
                Create an event
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <EventCard key={event._id} event={event} priority={index < 3} />
              ))}
            </div>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
