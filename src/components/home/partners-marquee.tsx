"use client";

import { PARTNER_NAMES } from "@/lib/constants";
import { Container } from "@/components/shared/container";
import { Reveal } from "@/components/shared/reveal";

export function PartnersMarquee() {
  const loop = [...PARTNER_NAMES, ...PARTNER_NAMES];

  return (
    <section className="py-12 md:py-16">
      <Container>
        <Reveal className="mb-8 flex flex-col items-center gap-2 text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Trusted by community partners
          </p>
          <p className="max-w-xl text-sm text-muted-foreground">
            Local NGOs, youth circles and neighbourhood groups run their drives on
            MeraSEP.
          </p>
        </Reveal>
      </Container>

      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
        />
        <div className="flex w-max animate-marquee items-center gap-12 py-4">
          {loop.map((name, index) => (
            <span
              key={`${name}-${index}`}
              className="whitespace-nowrap font-heading text-lg font-bold text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
