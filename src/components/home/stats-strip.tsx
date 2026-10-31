"use client";

import { useEffect, useRef, useState } from "react";

import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";
import { IMPACT_STATS } from "@/lib/constants";
import { formatCompactNumber } from "@/lib/format";

function useCountUp(target: number, duration = 1600, startWhenVisible = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !startWhenVisible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration, startWhenVisible]);

  return { ref, value };
}

function StatCard({ value, suffix, label, detail }: (typeof IMPACT_STATS)[number]) {
  const { ref, value: animated } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="group relative flex flex-col items-center gap-2 rounded-2xl border border-border/70 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
    >
      <span className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        {formatCompactNumber(animated)}
        <span className="text-primary">{suffix}</span>
      </span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{detail}</span>
    </div>
  );
}

export function StatsStrip() {
  return (
    <section
      id="impact"
      className="relative border-y border-border/60 bg-muted/40 py-12 md:py-16"
    >
      <Container>
        <Reveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Our impact so far
          </p>
          <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
            Numbers that belong to the neighbourhood.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {IMPACT_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}
