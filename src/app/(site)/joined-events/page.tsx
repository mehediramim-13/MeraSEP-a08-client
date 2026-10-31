"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventCard } from "@/components/events/event-card";
import { PrivateRoute } from "@/components/auth/private-route";
import { getJoinedEvents } from "@/lib/api";
import type { MeraEvent } from "@/types";

export default function JoinedEventsPage() {
  const [events, setEvents] = useState<MeraEvent[] | null>(null);

  useEffect(() => {
    let active = true;
    getJoinedEvents()
      .then((list) => {
        if (active) {
          const sorted = [...list].sort(
            (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime(),
          );
          setEvents(sorted);
        }
      })
      .catch(() => {
        if (active) setEvents([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PrivateRoute>
      <section className="py-12 md:py-16">
        <Container>
          <SectionHeading
            align="left"
            eyebrow="Joined events"
            title="Events you're attending."
            subtitle="Sorted by date, soonest first. Show up and make it count."
          />

          <div className="mt-10">
            {events === null ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border/70 bg-card">
                    <Skeleton className="aspect-[16/10] w-full rounded-none" />
                    <div className="space-y-3 p-5">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <EmptyState
                title="You haven't joined any events yet."
                description="Browse upcoming events and join the ones that matter to you."
                action={
                  <Button
                    render={<Link href="/events" />}
                    nativeButton={false}
                    className="rounded-full"
                  >
                    Browse events
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>
    </PrivateRoute>
  );
}
