"use client";

import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

export function FinalCta() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-emerald-600 to-emerald-700 p-8 text-white shadow-2xl shadow-primary/30 sm:p-12 md:p-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 size-96 rounded-full bg-amber-400/20 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] uppercase">
                  <HeartHandshake className="size-3.5" aria-hidden="true" />
                  Start today
                </span>
                <h2 className="mt-5 font-heading text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
                  Your neighbourhood is waiting for a hand.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                  Create an event, join one nearby, or just show up this weekend.
                  Every small act counts, and it all starts here.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                <Button
                  render={<Link href="/create-event" />}
                  nativeButton={false}
                  size="lg"
                  className="h-12 rounded-full bg-white px-6 font-semibold text-primary shadow-lg hover:bg-white/90"
                >
                  Create an event
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  render={<Link href="/events" />}
                  nativeButton={false}
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-white/40 bg-white/10 px-6 font-semibold text-white hover:bg-white/20 hover:text-white"
                >
                  Browse events
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
