"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Bookmark, Calendar, CalendarPlus, Check, Copy, LoaderCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { EVENT_META } from "@/lib/event-meta";
import { Progress } from "@/components/ui/progress";
import type { MeraEvent } from "@/types";
import { formatEventDate, formatEventDateTime, getCountdown, toGoogleCalendarUrl } from "@/lib/format";
import { useSavedEvents } from "@/hooks/use-saved-events";
import { EventCard } from "@/components/events/event-card";
import { getJoinedEvents, getUpcomingEvents, joinEvent } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

interface EventDetailsProps {
  event: MeraEvent;
}

export function EventDetails({ event }: EventDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggleSaved } = useSavedEvents();
  const meta = EVENT_META[event.eventType];
  const Icon = meta.icon;

  const [joinedCount, setJoinedCount] = useState(event.joinedCount ?? 0);
  const [isJoined, setIsJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [countdown, setCountdown] = useState(() => getCountdown(event.eventDate));
  const [similar, setSimilar] = useState<MeraEvent[]>([]);

  const goal = event.volunteerGoal ?? 0;
  const progress = goal > 0 ? Math.min(100, Math.round((joinedCount / goal) * 100)) : 0;
  const saved = isSaved(event._id);

  useEffect(() => {
    let active = true;
    getJoinedEvents(user?.email || "")
      .then((list) => {
        if (active) {
          setIsJoined(user?.email ? list.some((item) => item._id === event._id) : false);
        }
      })
      .catch(() => {
        if (active) setIsJoined(false);
      });
    return () => {
      active = false;
    };
  }, [event._id, user?.email]);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown(event.eventDate)), 1000);
    return () => clearInterval(timer);
  }, [event.eventDate]);

  useEffect(() => {
    let active = true;
    getUpcomingEvents({ type: event.eventType })
      .then((list) => {
        if (active) {
          setSimilar(list.filter((item) => item._id !== event._id).slice(0, 3));
        }
      })
      .catch(() => {
        if (active) setSimilar([]);
      });
    return () => {
      active = false;
    };
  }, [event._id, event.eventType]);

  const handleJoin = async () => {
    if (!user) {
      toast.info("Please sign in to join this event.");
      router.push(`/login?callbackUrl=/events/${event._id}`);
      return;
    }
    setJoining(true);
    try {
      await joinEvent(event._id, user.email);
      setJoinedCount((current) => current + 1);
      setIsJoined(true);
      toast.success("You're in! See you at the event.");
    } catch {
      toast.error("Could not join right now. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  const calendarUrl = toGoogleCalendarUrl({
    title: event.title,
    description: event.description,
    location: event.location,
    eventDate: event.eventDate,
  });

  return (
    <div className="pb-16">
      {/* Banner */}
      <div className="relative h-72 w-full overflow-hidden sm:h-96">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src = "/logo/merasep-logo.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <Container className="pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur ${meta.badge}`}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {event.eventType}
              </span>
              <span className="rounded-full bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
                {event.creatorName}
              </span>
            </div>
          </Container>
        </div>
      </div>

      <Container className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="space-y-8">
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" aria-hidden="true" />
                {event.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" aria-hidden="true" />
                {formatEventDateTime(event.eventDate)}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">About this event</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground">Organiser</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Created by{" "}
              <span className="font-semibold text-foreground">{event.creatorName}</span>
              {event.creatorEmail ? (
                <>
                  {" "}
                  (<span className="text-muted-foreground">{event.creatorEmail}</span>)
                </>
              ) : null}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Published {formatEventDate(event.createdAt, "d MMM yyyy")}
            </p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="sticky top-24 space-y-5">
            {/* Countdown */}
            <div className="rounded-2xl border border-border/70 bg-card p-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                Starts in
              </p>
              {countdown.isPast ? (
                <p className="mt-2 font-heading text-2xl font-extrabold text-foreground">
                  This event has passed
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Days", value: countdown.days },
                    { label: "Hours", value: countdown.hours },
                    { label: "Min", value: countdown.minutes },
                    { label: "Sec", value: countdown.seconds },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl bg-muted/60 p-2">
                      <p className="font-heading text-2xl font-extrabold tabular-nums text-foreground">
                        {String(item.value).padStart(2, "0")}
                      </p>
                      <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Impact meter */}
            {goal > 0 ? (
              <div className="rounded-2xl border border-border/70 bg-card p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">Volunteer goal</p>
                  <p className="text-sm font-bold text-primary tabular-nums">{progress}%</p>
                </div>
                <Progress value={progress} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {joinedCount} of {goal} volunteers joined
                </p>
              </div>
            ) : null}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                disabled={isJoined || joining}
                onClick={handleJoin}
                className="h-12 w-full rounded-xl font-semibold shadow-lg shadow-primary/20"
              >
                {joining ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                    Joining…
                  </>
                ) : isJoined ? (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    Joined
                  </>
                ) : (
                  "Join event"
                )}
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={handleCopy}
                >
                  <Copy className="size-4" aria-hidden="true" />
                  Copy link
                </Button>
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  render={<a href={calendarUrl} target="_blank" rel="noreferrer" />}
                  nativeButton={false}
                >
                  <CalendarPlus className="size-4" aria-hidden="true" />
                  Calendar
                </Button>
              </div>

              <Button
                variant="ghost"
                className="h-10 rounded-xl text-muted-foreground"
                onClick={() => toggleSaved(event._id)}
              >
                <Bookmark
                  className={`size-4 ${saved ? "fill-amber-400 text-amber-400" : ""}`}
                  aria-hidden="true"
                />
                {saved ? "Saved" : "Save for later"}
              </Button>
            </div>

            {user ? (
              <p className="text-center text-xs text-muted-foreground">
                Joining as {user.name}
              </p>
            ) : null}
          </div>
        </aside>
      </Container>

      {similar.length > 0 ? (
        <Container className="mt-16">
          <h2 className="font-heading text-2xl font-extrabold text-foreground">
            Similar events
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            More {event.eventType.toLowerCase()} drives near you.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <EventCard key={item._id} event={item} />
            ))}
          </div>
        </Container>
      ) : null}
    </div>
  );
}
