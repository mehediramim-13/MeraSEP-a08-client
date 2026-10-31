"use client";

import {
  CalendarCheck,
  HeartHandshake,
  MapPin,
  Megaphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { RevealGroup, RevealItem } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const FEATURES = [
  {
    icon: Megaphone,
    title: "Create an event in minutes",
    body:
      "Title, type, location, date and a thumbnail — that's all it takes. Your event goes live for the whole community.",
  },
  {
    icon: CalendarCheck,
    title: "Join with one click",
    body:
      "No forms, no waiting. Save your spot and get a reminder as the day approaches.",
  },
  {
    icon: HeartHandshake,
    title: "Track what you joined",
    body:
      "A personal dashboard of every event you showed up for, sorted by date.",
  },
  {
    icon: ShieldCheck,
    title: "Manage your own events",
    body:
      "Edit details, update the goal, or remove an event you created — all in one place.",
  },
  {
    icon: MapPin,
    title: "Local first",
    body:
      "Filter by district and event type so you always find something close to home.",
  },
  {
    icon: Sparkles,
    title: "Transparent impact",
    body:
      "Volunteer goals and joined counts are public, so progress is visible to everyone.",
  },
] as const;

export function Features() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why MeraSEP"
          title="Everything a neighbourhood needs to serve together."
          subtitle="Six small tools that make organising social service feel possible for anyone, not just NGOs."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <RevealItem key={feature.title}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-heading text-lg font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
