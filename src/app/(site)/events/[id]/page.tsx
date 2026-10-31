"use client";

import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import EventDetailLoading from "./loading";
import { EventDetails } from "@/components/events/event-details";
import { getEventById } from "@/lib/api";
import type { MeraEvent } from "@/types";

export default function EventPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const [event, setEvent] = useState<MeraEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;
    getEventById(id)
      .then((result) => {
        if (!active) return;
        if (!result) setMissing(true);
        else setEvent(result);
      })
      .catch(() => {
        if (active) setMissing(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (!id) notFound();
  if (loading) return <EventDetailLoading />;
  if (missing || !event) notFound();

  return <EventDetails event={event} />;
}
