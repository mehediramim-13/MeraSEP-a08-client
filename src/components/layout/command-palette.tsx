"use client";

import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarDays,
  Home,
  LayoutDashboard,
  LoaderCircle,
  Plus,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { getUpcomingEvents } from "@/lib/api";
import { EVENT_META } from "@/lib/event-meta";
import { OPEN_COMMAND_PALETTE_EVENT } from "@/lib/ui-events";
import type { MeraEvent } from "@/types";

const PAGE_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Upcoming Events", icon: CalendarDays },
  { href: "/create-event", label: "Create Event", icon: Plus },
  { href: "/manage-events", label: "Manage Events", icon: LayoutDashboard },
  { href: "/joined-events", label: "Joined Events", icon: CalendarCheck },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState<MeraEvent[] | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    const handleOpen = () => setOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpen);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, handleOpen);
    };
  }, []);

  useEffect(() => {
    if (!open || events !== null) return;

    let active = true;
    getUpcomingEvents({ limit: 20 })
      .then((list) => {
        if (active) setEvents(list);
      })
      .catch(() => {
        if (active) setEvents([]);
      });

    return () => {
      active = false;
    };
  }, [open, events]);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Search MeraSEP"
      description="Jump to a page or find a community event near you."
      className="sm:max-w-xl"
    >
      <Command>
        <CommandInput placeholder="Search events, locations or pages…" />
        <CommandList className="max-h-[min(24rem,55vh)]">
          <CommandEmpty>No results found. Try a district or an event type.</CommandEmpty>

          <CommandGroup heading="Go to">
            {PAGE_LINKS.map((page) => (
              <CommandItem
                key={page.href}
                value={`page ${page.label}`}
                onSelect={() => go(page.href)}
              >
                <page.icon aria-hidden="true" />
                {page.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Upcoming events">
            {events === null ? (
              <CommandItem value="loading events" disabled>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Loading events…
              </CommandItem>
            ) : (
              events.map((event) => {
                const meta = EVENT_META[event.eventType];
                const EventIcon = meta.icon;
                return (
                  <CommandItem
                    key={event._id}
                    value={`event ${event.title} ${event.location} ${event.eventType}`}
                    onSelect={() => go(`/events/${event._id}`)}
                  >
                    <span className={`inline-flex size-6 items-center justify-center rounded-full ${meta.tile}`}>
                      <EventIcon className="size-3.5" aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">{event.title}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {event.location}
                      </span>
                    </span>
                  </CommandItem>
                );
              })
            )}
          </CommandGroup>
        </CommandList>
        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2 text-[11px] text-muted-foreground">
          <span>↑↓ to navigate · Enter to open</span>
          <span className="rounded border border-border/70 px-1.5 py-0.5">Esc</span>
        </div>
      </Command>
    </CommandDialog>
  );
}
