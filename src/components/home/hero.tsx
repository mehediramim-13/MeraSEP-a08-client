"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

const FLOATING_CARDS = [
  {
    title: "Winter Clothes Distribution",
    location: "Mirpur 10, Dhaka",
    type: "Donation",
    volunteers: "120 of 200",
    color: "from-rose-500/20 to-amber-500/10",
  },
  {
    title: "Buriganga Riverbank Cleanup",
    location: "Sadarghat, Dhaka",
    type: "Cleanup",
    volunteers: "45 of 80",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Free Health Camp",
    location: "Uttara, Dhaka",
    type: "Health Camp",
    volunteers: "30 of 40",
    color: "from-sky-500/20 to-indigo-500/10",
  },
] as const;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24">
      {/* Animated mesh gradient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-40 -left-32 size-[38rem] rounded-full bg-emerald-500/25 blur-[130px]"
          animate={reduceMotion ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 right-0 size-[32rem] rounded-full bg-amber-400/20 blur-[120px]"
          animate={reduceMotion ? undefined : { x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 size-[26rem] rounded-full bg-emerald-300/15 blur-[110px]"
          animate={reduceMotion ? undefined : { scale: [1, 1.25, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,var(--foreground)_1px,transparent_0)] [background-size:26px_26px]" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex flex-col items-start">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold tracking-[0.14em] text-primary uppercase"
            >
              <span className="size-1.5 rounded-full bg-highlight animate-pulse" aria-hidden="true" />
              Community-driven social service
            </motion.span>

            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">Your community.</span>
              <span className="block">Your cause.</span>
              <span className="block">
                Your{" "}
                <motion.span
                  key="rotating"
                  className="inline-block bg-gradient-to-r from-primary via-emerald-500 to-highlight bg-clip-text text-transparent"
                  animate={
                    reduceMotion
                      ? undefined
                      : { opacity: [1, 0, 1] }
                  }
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  move.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              MeraSEP connects people across Bangladesh with social service events
              happening in their own neighbourhood — cleanups, plantation drives,
              health camps, donation runs and more. Find a cause. Bring a friend.
              Leave your area better than you found it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Button
                render={<Link href="/events" />}
                nativeButton={false}
                size="lg"
                className="group h-12 rounded-full px-6 font-semibold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
              >
                Explore events
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Button>
              <Button
                render={<Link href="/create-event" />}
                nativeButton={false}
                variant="outline"
                size="lg"
                className="group h-12 rounded-full px-6 font-semibold transition-all hover:-translate-y-0.5"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                Create an event
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80",
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
                ].map((src, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className="size-9 rounded-full border-2 border-background object-cover"
                    style={{ zIndex: 4 - index }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="size-4 text-primary" aria-hidden="true" />
                <span className="font-semibold text-foreground">2,400+</span>
                <span className="text-muted-foreground">volunteers already involved</span>
              </div>
            </motion.div>
          </div>

          {/* Floating composition */}
          <div className="relative hidden h-[520px] lg:block">
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/5 to-highlight/5"
              animate={reduceMotion ? undefined : { rotate: [0, 1, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {FLOATING_CARDS.map((card, index) => {
              const positions = [
                "top-6 left-4",
                "top-1/2 -translate-y-1/2 right-2",
                "bottom-6 left-10",
              ] as const;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 30, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.3 + index * 0.15 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`absolute ${positions[index]} w-72 rounded-2xl border border-border/70 bg-card/90 p-4 shadow-lift backdrop-blur`}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <MapPin className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-foreground">
                        {card.title}
                      </p>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {card.location}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      {card.type}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {card.volunteers} joined
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: index === 0 ? "60%" : index === 1 ? "56%" : "75%" }}
                      transition={{ duration: 1.2, delay: 0.6 + index * 0.15 }}
                    />
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute top-4 right-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 backdrop-blur"
            >
              <p className="font-heading text-2xl font-extrabold text-amber-500">320+</p>
              <p className="text-[11px] font-medium text-muted-foreground">events held</p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
